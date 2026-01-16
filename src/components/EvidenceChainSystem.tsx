import { useState, useMemo, useCallback, useEffect } from 'react';
import { CrimeCase } from '@/types/crime';
import { 
  Link2, 
  Lock, 
  Unlock, 
  ChevronRight, 
  Eye,
  AlertTriangle,
  Fingerprint,
  FileText,
  Clock,
  MessageSquare,
  MapPin,
  Zap,
  Brain,
  Target,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';

interface EvidenceChainSystemProps {
  crimeCase: CrimeCase;
  onProgressUpdate: (progress: number) => void;
  className?: string;
}

interface ClueNode {
  id: string;
  name: string;
  description: string;
  type: 'physical' | 'digital' | 'testimonial' | 'forensic' | 'circumstantial';
  tier: number;
  unlockRequirements: string[];
  unlocked: boolean;
  examined: boolean;
  hiddenInfo?: string;
  leadsTo: string[];
  contradicts?: string[];
  forensicNote?: string;
  criticalPath: boolean;
}

interface DeductionChain {
  id: string;
  name: string;
  clueIds: string[];
  conclusion: string;
  validated: boolean;
  probability: number;
}

export function EvidenceChainSystem({ crimeCase, onProgressUpdate, className }: EvidenceChainSystemProps) {
  const [examinedClues, setExaminedClues] = useState<Set<string>>(new Set());
  const [unlockedClues, setUnlockedClues] = useState<Set<string>>(new Set(['initial_report', 'body_discovery', 'scene_overview']));
  const [selectedClue, setSelectedClue] = useState<string | null>(null);
  const [deductions, setDeductions] = useState<DeductionChain[]>([]);
  const [showContradiction, setShowContradiction] = useState<string | null>(null);

  // Generate clue network based on case
  const clueNetwork = useMemo<ClueNode[]>(() => {
    const nodes: ClueNode[] = [];
    
    // Tier 0 - Always available
    nodes.push({
      id: 'initial_report',
      name: 'Initial Incident Report',
      description: `Body discovered at ${crimeCase.location.replace('_', ' ')}. First responders secured the scene.`,
      type: 'testimonial',
      tier: 0,
      unlockRequirements: [],
      unlocked: true,
      examined: false,
      leadsTo: ['body_discovery', 'witness_statements'],
      criticalPath: true,
    });

    nodes.push({
      id: 'body_discovery',
      name: 'Body Condition Report',
      description: `Victim found ${crimeCase.evidence.bodyPosition?.replace('_', ' ')}. ${crimeCase.evidence.bloodPattern !== 'none' ? `Blood pattern: ${crimeCase.evidence.bloodPattern.replace('_', ' ')}.` : 'Minimal blood present.'}`,
      type: 'forensic',
      tier: 0,
      unlockRequirements: [],
      unlocked: true,
      examined: false,
      hiddenInfo: crimeCase.hiddenSolution.hiddenHints[0]?.hint,
      leadsTo: ['wound_analysis', 'time_of_death'],
      criticalPath: true,
    });

    nodes.push({
      id: 'scene_overview',
      name: 'Scene Overview',
      description: `Weather conditions: ${crimeCase.evidence.weather}. Environment shows ${crimeCase.evidence.environmentalDamage?.type !== 'none' ? crimeCase.evidence.environmentalDamage?.type?.replace('_', ' ') : 'no significant damage'}.`,
      type: 'physical',
      tier: 0,
      unlockRequirements: [],
      unlocked: true,
      examined: false,
      leadsTo: ['footprint_analysis', 'environmental_trace'],
      criticalPath: false,
    });

    // Tier 1 - Unlocked by examining Tier 0
    nodes.push({
      id: 'witness_statements',
      name: 'Witness Statements',
      description: 'Multiple witnesses interviewed. Statements contain inconsistencies.',
      type: 'testimonial',
      tier: 1,
      unlockRequirements: ['initial_report'],
      unlocked: false,
      examined: false,
      hiddenInfo: 'One witness recanted their statement 3 days after initial interview.',
      leadsTo: ['witness_credibility', 'suspect_interviews'],
      contradicts: ['surveillance_data'],
      forensicNote: 'Statement timestamps conflict with digital evidence',
      criticalPath: true,
    });

    nodes.push({
      id: 'wound_analysis',
      name: 'Wound Pattern Analysis',
      description: crimeCase.evidence.wounds?.map(w => `${w.type} wound on ${w.location}: ${w.description}`).join('. ') || 'Autopsy pending.',
      type: 'forensic',
      tier: 1,
      unlockRequirements: ['body_discovery'],
      unlocked: false,
      examined: false,
      hiddenInfo: crimeCase.evidence.wounds?.find(w => w.contradiction)?.contradiction,
      leadsTo: ['weapon_analysis', 'defensive_wounds'],
      criticalPath: true,
    });

    nodes.push({
      id: 'time_of_death',
      name: 'Time of Death Estimation',
      description: `Estimated TOD: ${crimeCase.evidence.timeOfDeath.toLocaleTimeString()}. Method: Liver temperature and rigor mortis assessment.`,
      type: 'forensic',
      tier: 1,
      unlockRequirements: ['body_discovery'],
      unlocked: false,
      examined: false,
      leadsTo: ['timeline_reconstruction', 'alibi_verification'],
      contradicts: ['digital_timestamps'],
      forensicNote: 'Body temperature readings inconsistent with ambient conditions',
      criticalPath: true,
    });

    nodes.push({
      id: 'footprint_analysis',
      name: 'Footprint Evidence',
      description: `Footprints detected: ${crimeCase.evidence.footprintType}. Direction: ${crimeCase.evidence.footprintDirection?.replace('_', ' ')}.`,
      type: 'physical',
      tier: 1,
      unlockRequirements: ['scene_overview'],
      unlocked: false,
      examined: false,
      leadsTo: ['suspect_shoes', 'movement_pattern'],
      criticalPath: false,
    });

    nodes.push({
      id: 'environmental_trace',
      name: 'Environmental Trace Evidence',
      description: crimeCase.evidence.environmentalTrace?.map(t => `${t.type}: ${t.description}`).join('. ') || 'No significant environmental traces detected.',
      type: 'physical',
      tier: 1,
      unlockRequirements: ['scene_overview'],
      unlocked: false,
      examined: false,
      leadsTo: ['chemical_analysis', 'fiber_analysis'],
      criticalPath: false,
    });

    // Tier 2 - Requires multiple Tier 1 clues
    nodes.push({
      id: 'weapon_analysis',
      name: 'Weapon Forensics',
      description: crimeCase.evidence.weaponFound !== 'none' 
        ? `${crimeCase.evidence.weaponFound.charAt(0).toUpperCase() + crimeCase.evidence.weaponFound.slice(1)} recovered. Trace evidence being processed.`
        : 'Murder weapon not recovered. Searching databases for similar patterns.',
      type: 'forensic',
      tier: 2,
      unlockRequirements: ['wound_analysis'],
      unlocked: false,
      examined: false,
      hiddenInfo: 'Weapon shows signs of being staged post-mortem',
      leadsTo: ['weapon_source', 'fingerprint_results'],
      criticalPath: true,
    });

    nodes.push({
      id: 'defensive_wounds',
      name: 'Defensive Wound Analysis',
      description: crimeCase.evidence.wounds?.some(w => w.type === 'defensive') 
        ? 'Defensive wounds present indicating struggle.'
        : 'No clear defensive wounds. Victim may have been incapacitated or surprised.',
      type: 'forensic',
      tier: 2,
      unlockRequirements: ['wound_analysis'],
      unlocked: false,
      examined: false,
      contradicts: crimeCase.hiddenSolution.crimeType === 'suicide' ? ['wound_analysis'] : undefined,
      leadsTo: ['dna_under_nails'],
      criticalPath: true,
    });

    nodes.push({
      id: 'surveillance_data',
      name: 'Surveillance Footage',
      description: crimeCase.evidence.surveillance?.available 
        ? crimeCase.evidence.surveillance.description || 'Footage recovered. Analysis in progress.'
        : 'No surveillance footage available for incident timeframe.',
      type: 'digital',
      tier: 2,
      unlockRequirements: ['witness_statements', 'time_of_death'],
      unlocked: false,
      examined: false,
      hiddenInfo: crimeCase.evidence.surveillance?.anomaly,
      leadsTo: ['movement_timeline', 'facial_recognition'],
      contradicts: crimeCase.evidence.surveillance?.corruption ? ['witness_statements'] : undefined,
      forensicNote: crimeCase.evidence.surveillance?.timeGap ? `Time gap detected: ${crimeCase.evidence.surveillance.timeGap}` : undefined,
      criticalPath: true,
    });

    nodes.push({
      id: 'timeline_reconstruction',
      name: 'Timeline Reconstruction',
      description: 'Compiling all temporal data points. Contradictions flagged for review.',
      type: 'forensic',
      tier: 2,
      unlockRequirements: ['time_of_death', 'witness_statements'],
      unlocked: false,
      examined: false,
      leadsTo: ['critical_gap', 'final_movements'],
      contradicts: crimeCase.evidence.contradictions?.length ? ['digital_evidence'] : undefined,
      criticalPath: true,
    });

    nodes.push({
      id: 'digital_evidence',
      name: 'Digital Forensics',
      description: crimeCase.evidence.digitalEvidence?.map(d => `${d.type.replace('_', ' ')}: ${d.description}`).join('. ') || 'No digital devices recovered.',
      type: 'digital',
      tier: 2,
      unlockRequirements: ['time_of_death'],
      unlocked: false,
      examined: false,
      hiddenInfo: crimeCase.evidence.digitalEvidence?.find(d => d.partialData)?.forensicNote,
      leadsTo: ['phone_records', 'financial_motive'],
      criticalPath: false,
    });

    // Tier 3 - Deep investigation
    nodes.push({
      id: 'fingerprint_results',
      name: 'Fingerprint Database Results',
      description: crimeCase.evidence.biologicalEvidence?.find(b => b.type === 'fingerprints')?.description || 'Fingerprint analysis pending.',
      type: 'forensic',
      tier: 3,
      unlockRequirements: ['weapon_analysis', 'scene_overview'],
      unlocked: false,
      examined: false,
      hiddenInfo: 'Partial print matches multiple entries - inconclusive',
      leadsTo: ['suspect_identification'],
      criticalPath: true,
    });

    nodes.push({
      id: 'dna_evidence',
      name: 'DNA Analysis Results',
      description: crimeCase.evidence.biologicalEvidence?.find(b => b.type === 'dna')?.description || 'DNA samples submitted to lab.',
      type: 'forensic',
      tier: 3,
      unlockRequirements: ['defensive_wounds', 'footprint_analysis'],
      unlocked: false,
      examined: false,
      leadsTo: ['suspect_identification', 'family_connection'],
      forensicNote: 'Contamination possible - multiple handlers at scene',
      criticalPath: true,
    });

    nodes.push({
      id: 'critical_gap',
      name: 'Critical Timeline Gap',
      description: 'Unaccounted period identified. No corroborating evidence for 47 minutes.',
      type: 'circumstantial',
      tier: 3,
      unlockRequirements: ['timeline_reconstruction', 'surveillance_data'],
      unlocked: false,
      examined: false,
      hiddenInfo: 'Gap corresponds exactly to drive time from suspect\'s location',
      leadsTo: ['final_theory'],
      criticalPath: true,
    });

    nodes.push({
      id: 'suspect_identification',
      name: 'Suspect Profile',
      description: crimeCase.victim.knownAssociates?.length 
        ? `${crimeCase.victim.knownAssociates.length} persons of interest identified from victim\'s social network.`
        : 'No immediate suspects. Expanding investigation parameters.',
      type: 'circumstantial',
      tier: 3,
      unlockRequirements: ['fingerprint_results'],
      unlocked: false,
      examined: false,
      leadsTo: ['motive_analysis', 'alibi_breakdown'],
      criticalPath: true,
    });

    nodes.push({
      id: 'financial_motive',
      name: 'Financial Investigation',
      description: `Victim financial status: ${crimeCase.victim.financialStatus || 'unknown'}. ${crimeCase.evidence.digitalEvidence?.find(d => d.type === 'financial_records')?.description || 'Bank records subpoenaed.'}`,
      type: 'digital',
      tier: 3,
      unlockRequirements: ['digital_evidence'],
      unlocked: false,
      examined: false,
      hiddenInfo: 'Large transfer made day before death - recipient unknown',
      leadsTo: ['motive_analysis'],
      criticalPath: false,
    });

    // Tier 4 - Final pieces
    nodes.push({
      id: 'motive_analysis',
      name: 'Motive Assessment',
      description: 'Cross-referencing financial, personal, and professional connections.',
      type: 'circumstantial',
      tier: 4,
      unlockRequirements: ['suspect_identification', 'financial_motive'],
      unlocked: false,
      examined: false,
      hiddenInfo: 'Multiple viable motives - insufficient to narrow suspect pool',
      leadsTo: ['final_theory'],
      criticalPath: true,
    });

    nodes.push({
      id: 'staging_evidence',
      name: 'Scene Staging Analysis',
      description: crimeCase.hiddenSolution.isStaged 
        ? 'Evidence of scene manipulation detected. Original configuration being reconstructed.'
        : 'No definitive evidence of staging. Scene appears authentic.',
      type: 'forensic',
      tier: 4,
      unlockRequirements: ['critical_gap', 'weapon_analysis'],
      unlocked: false,
      examined: false,
      hiddenInfo: crimeCase.hiddenSolution.isStaged ? 'Staging sophistication suggests law enforcement knowledge' : undefined,
      leadsTo: ['final_theory'],
      contradicts: crimeCase.hiddenSolution.isStaged ? ['initial_report'] : undefined,
      criticalPath: true,
    });

    nodes.push({
      id: 'final_theory',
      name: 'Case Theory Synthesis',
      description: 'All evidence compiled. Preparing final assessment.',
      type: 'circumstantial',
      tier: 5,
      unlockRequirements: ['motive_analysis', 'staging_evidence', 'critical_gap'],
      unlocked: false,
      examined: false,
      hiddenInfo: crimeCase.hiddenSolution.trueNarrative,
      leadsTo: [],
      criticalPath: true,
    });

    return nodes;
  }, [crimeCase]);

  // Check for newly unlocked clues whenever examined clues change
  useEffect(() => {
    const newUnlocked = new Set(unlockedClues);
    let hasChanges = false;

    clueNetwork.forEach(clue => {
      if (!newUnlocked.has(clue.id) && clue.unlockRequirements.length > 0) {
        const allRequirementsMet = clue.unlockRequirements.every(req => examinedClues.has(req));
        if (allRequirementsMet) {
          newUnlocked.add(clue.id);
          hasChanges = true;
        }
      }
    });

    if (hasChanges) {
      setUnlockedClues(newUnlocked);
    }

    // Update progress
    const totalCritical = clueNetwork.filter(c => c.criticalPath).length;
    const examinedCritical = clueNetwork.filter(c => c.criticalPath && examinedClues.has(c.id)).length;
    onProgressUpdate(Math.round((examinedCritical / totalCritical) * 100));
  }, [examinedClues, clueNetwork, unlockedClues, onProgressUpdate]);

  const examineClue = useCallback((clueId: string) => {
    if (!unlockedClues.has(clueId)) return;
    
    setExaminedClues(prev => {
      const next = new Set(prev);
      next.add(clueId);
      return next;
    });
    setSelectedClue(clueId);
  }, [unlockedClues]);

  const getTypeIcon = (type: ClueNode['type']) => {
    switch (type) {
      case 'physical': return <MapPin className="w-4 h-4" />;
      case 'digital': return <Zap className="w-4 h-4" />;
      case 'testimonial': return <MessageSquare className="w-4 h-4" />;
      case 'forensic': return <Fingerprint className="w-4 h-4" />;
      case 'circumstantial': return <Brain className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: ClueNode['type']) => {
    switch (type) {
      case 'physical': return 'text-forensic border-forensic/30 bg-forensic/10';
      case 'digital': return 'text-cold border-cold/30 bg-cold/10';
      case 'testimonial': return 'text-warning border-warning/30 bg-warning/10';
      case 'forensic': return 'text-blood border-blood/30 bg-blood/10';
      case 'circumstantial': return 'text-muted-foreground border-muted/30 bg-muted/10';
    }
  };

  const selectedClueData = clueNetwork.find(c => c.id === selectedClue);
  
  // Group clues by tier
  const cluesByTier = useMemo(() => {
    const tiers: { [key: number]: ClueNode[] } = {};
    clueNetwork.forEach(clue => {
      if (!tiers[clue.tier]) tiers[clue.tier] = [];
      tiers[clue.tier].push(clue);
    });
    return tiers;
  }, [clueNetwork]);

  const tierLabels = ['Initial Evidence', 'Primary Analysis', 'Deep Investigation', 'Connections', 'Synthesis', 'Conclusion'];

  return (
    <div className={cn("bg-card border border-border rounded overflow-hidden", className)}>
      {/* Header */}
      <div className="p-4 border-b border-border bg-background/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-cold/20 border border-cold/30">
              <Link2 className="w-5 h-5 text-cold" />
            </div>
            <div>
              <h3 className="font-typewriter text-sm text-foreground tracking-wider">
                EVIDENCE CHAIN ANALYSIS
              </h3>
              <p className="text-xs text-muted-foreground font-terminal">
                Trace the clues • Build the case • Find the truth
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-xs text-muted-foreground font-terminal block">EVIDENCE EXAMINED</span>
              <span className="text-sm font-bold text-foreground">{examinedClues.size} / {clueNetwork.length}</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-muted-foreground font-terminal block">CRITICAL PATH</span>
              <span className="text-sm font-bold text-blood">
                {clueNetwork.filter(c => c.criticalPath && examinedClues.has(c.id)).length} / {clueNetwork.filter(c => c.criticalPath).length}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Clue Network Visualization */}
        <div className="flex-1 p-4 border-r border-border overflow-auto max-h-[600px]">
          <div className="space-y-6">
            {Object.entries(cluesByTier).map(([tier, clues]) => (
              <div key={tier} className="space-y-2">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-terminal text-muted-foreground">
                    TIER {tier}: {tierLabels[parseInt(tier)] || 'UNKNOWN'}
                  </span>
                  <div className="flex-1 h-px bg-border" />
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {clues.map(clue => {
                    const isUnlocked = unlockedClues.has(clue.id);
                    const isExamined = examinedClues.has(clue.id);
                    const isSelected = selectedClue === clue.id;
                    const hasContradiction = clue.contradicts && clue.contradicts.some(c => examinedClues.has(c));

                    return (
                      <button
                        key={clue.id}
                        onClick={() => isUnlocked && examineClue(clue.id)}
                        disabled={!isUnlocked}
                        className={cn(
                          "p-3 rounded border text-left transition-all relative",
                          isUnlocked 
                            ? isSelected
                              ? "border-cold bg-cold/10 shadow-lg"
                              : isExamined
                                ? "border-forensic/50 bg-forensic/5 hover:border-forensic"
                                : "border-warning/50 bg-warning/5 hover:border-warning animate-pulse-slow"
                            : "border-muted bg-muted/10 opacity-50 cursor-not-allowed"
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            {isUnlocked ? (
                              isExamined ? (
                                <CheckCircle className="w-4 h-4 text-forensic flex-shrink-0" />
                              ) : (
                                <Eye className="w-4 h-4 text-warning flex-shrink-0 animate-pulse" />
                              )
                            ) : (
                              <Lock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            )}
                            <span className={cn(
                              "text-xs font-terminal truncate",
                              isUnlocked ? "text-foreground" : "text-muted-foreground"
                            )}>
                              {isUnlocked ? clue.name : '[LOCKED]'}
                            </span>
                          </div>
                          
                          {clue.criticalPath && (
                            <Target className="w-3 h-3 text-blood flex-shrink-0" />
                          )}
                        </div>

                        {isUnlocked && (
                          <div className="mt-2 flex items-center gap-1">
                            <Badge 
                              variant="outline" 
                              className={cn("text-[10px] px-1", getTypeColor(clue.type))}
                            >
                              {getTypeIcon(clue.type)}
                              <span className="ml-1">{clue.type}</span>
                            </Badge>
                            
                            {hasContradiction && (
                              <Badge variant="outline" className="text-[10px] px-1 text-blood border-blood/30 bg-blood/10">
                                <AlertTriangle className="w-3 h-3" />
                              </Badge>
                            )}
                          </div>
                        )}

                        {!isUnlocked && clue.unlockRequirements.length > 0 && (
                          <div className="mt-2 text-[10px] text-muted-foreground/50 font-terminal">
                            Requires: {clue.unlockRequirements.map(r => {
                              const req = clueNetwork.find(c => c.id === r);
                              return req?.name || r;
                            }).join(', ')}
                          </div>
                        )}

                        {/* Connection lines */}
                        {isExamined && clue.leadsTo.length > 0 && (
                          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                            <ChevronRight className="w-3 h-3 text-muted-foreground rotate-90" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Clue Detail */}
        <div className="w-80 p-4 bg-background/50">
          {selectedClueData ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className={cn("p-2 rounded border", getTypeColor(selectedClueData.type))}>
                  {getTypeIcon(selectedClueData.type)}
                </div>
                <div>
                  <h4 className="font-typewriter text-sm text-foreground">{selectedClueData.name}</h4>
                  <span className="text-xs text-muted-foreground capitalize">{selectedClueData.type} Evidence</span>
                </div>
              </div>

              <div className="p-3 bg-card border border-border rounded">
                <p className="text-sm text-muted-foreground font-clinical leading-relaxed">
                  {selectedClueData.description}
                </p>
              </div>

              {selectedClueData.forensicNote && (
                <div className="p-3 bg-warning/5 border border-warning/30 rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-warning" />
                    <span className="text-xs font-terminal text-warning">FORENSIC NOTE</span>
                  </div>
                  <p className="text-xs text-muted-foreground font-clinical">
                    {selectedClueData.forensicNote}
                  </p>
                </div>
              )}

              {selectedClueData.hiddenInfo && examinedClues.has(selectedClueData.id) && (
                <div className="p-3 bg-blood/5 border border-blood/30 rounded animate-fade-in">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="w-4 h-4 text-blood" />
                    <span className="text-xs font-terminal text-blood">HIDDEN DETAIL</span>
                  </div>
                  <p className="text-xs text-blood/80 font-clinical italic">
                    {selectedClueData.hiddenInfo}
                  </p>
                </div>
              )}

              {selectedClueData.contradicts && selectedClueData.contradicts.some(c => examinedClues.has(c)) && (
                <div className="p-3 bg-blood/10 border border-blood/50 rounded animate-pulse-slow">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-blood" />
                    <span className="text-xs font-terminal text-blood">CONTRADICTION DETECTED</span>
                  </div>
                  <p className="text-xs text-blood font-clinical">
                    This evidence conflicts with: {selectedClueData.contradicts
                      .filter(c => examinedClues.has(c))
                      .map(c => clueNetwork.find(n => n.id === c)?.name)
                      .join(', ')}
                  </p>
                </div>
              )}

              {selectedClueData.leadsTo.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-terminal text-muted-foreground">LEADS TO:</span>
                  <div className="space-y-1">
                    {selectedClueData.leadsTo.map(id => {
                      const target = clueNetwork.find(c => c.id === id);
                      const isTargetUnlocked = unlockedClues.has(id);
                      return target ? (
                        <div 
                          key={id}
                          className={cn(
                            "flex items-center gap-2 p-2 rounded border text-xs",
                            isTargetUnlocked 
                              ? "border-forensic/30 bg-forensic/5" 
                              : "border-muted bg-muted/10 opacity-50"
                          )}
                        >
                          {isTargetUnlocked ? <Unlock className="w-3 h-3 text-forensic" /> : <Lock className="w-3 h-3 text-muted-foreground" />}
                          <span className="font-terminal">{target.name}</span>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              )}

              {selectedClueData.criticalPath && (
                <div className="flex items-center gap-2 text-xs text-blood font-terminal p-2 border border-blood/30 rounded bg-blood/5">
                  <Target className="w-4 h-4" />
                  <span>CRITICAL PATH EVIDENCE</span>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground">
              <Eye className="w-12 h-12 mb-4 opacity-30" />
              <p className="text-sm font-terminal">SELECT AN EVIDENCE NODE</p>
              <p className="text-xs mt-2 font-clinical">
                Examine unlocked evidence to reveal connections and unlock deeper investigation paths.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="p-4 border-t border-border bg-background/50">
        <div className="flex items-center gap-4">
          <span className="text-xs font-terminal text-muted-foreground">CHAIN PROGRESS</span>
          <Progress 
            value={(examinedClues.size / clueNetwork.length) * 100} 
            className="flex-1 h-2" 
          />
          <span className="text-xs font-terminal text-foreground">
            {Math.round((examinedClues.size / clueNetwork.length) * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
}
