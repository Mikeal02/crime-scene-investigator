import { useState, useMemo } from 'react';
import { CrimeCase } from '@/types/crime';
import { 
  Clock, 
  AlertTriangle, 
  FileText, 
  Users, 
  MapPin,
  Fingerprint,
  Brain,
  Link2,
  GitBranch,
  CheckCircle,
  XCircle,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Lock,
  Unlock,
  Lightbulb,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

interface ComplexInvestigationPanelProps {
  crimeCase: CrimeCase;
  investigationProgress: number;
  className?: string;
}

interface TimelineEvent {
  id: string;
  time: string;
  description: string;
  verified: 'yes' | 'no' | 'uncertain';
  contradiction?: string;
  locked?: boolean;
}

interface Hypothesis {
  id: string;
  title: string;
  description: string;
  supportingEvidence: string[];
  contradictingEvidence: string[];
  probability: number;
}

interface Connection {
  from: string;
  to: string;
  type: 'victim_to_suspect' | 'evidence_to_motive' | 'timeline_link' | 'contradiction';
  description: string;
}

export function ComplexInvestigationPanel({ crimeCase, investigationProgress, className }: ComplexInvestigationPanelProps) {
  const [activeTab, setActiveTab] = useState('timeline');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['timeline']));
  const [selectedHypothesis, setSelectedHypothesis] = useState<string | null>(null);
  const [deductionNotes, setDeductionNotes] = useState<string[]>([]);

  // Generate timeline with contradictions
  const timeline = useMemo<TimelineEvent[]>(() => {
    const events: TimelineEvent[] = [];
    const tod = crimeCase.evidence.timeOfDeath;
    const hoursAgo = Math.round((Date.now() - tod.getTime()) / 3600000);
    
    // Last known activity
    if (crimeCase.victim.lastKnownActivity) {
      events.push({
        id: 'last_activity',
        time: `${hoursAgo + 4}h before discovery`,
        description: `Victim ${crimeCase.victim.lastKnownActivity}`,
        verified: 'yes',
      });
    }

    // Time clues
    crimeCase.evidence.timeClues?.forEach((clue, i) => {
      events.push({
        id: `time_clue_${i}`,
        time: `${Math.round((Date.now() - clue.time.getTime()) / 3600000)}h before discovery`,
        description: clue.description,
        verified: clue.reliability === 'verified' ? 'yes' : clue.reliability === 'contradicted' ? 'no' : 'uncertain',
        contradiction: clue.reliability === 'contradicted' ? 'Conflicting witness statements' : undefined,
      });
    });

    // Estimated time of death
    events.push({
      id: 'tod',
      time: `~${hoursAgo}h before discovery`,
      description: 'ESTIMATED TIME OF DEATH',
      verified: 'uncertain',
      contradiction: 'Body temperature vs. rigor mortis inconsistency detected',
    });

    // Surveillance gap
    if (crimeCase.evidence.surveillance?.timeGap) {
      events.push({
        id: 'surveillance_gap',
        time: crimeCase.evidence.surveillance.timeGap,
        description: 'SURVEILLANCE GAP - No footage available',
        verified: 'no',
        contradiction: 'Gap coincides exactly with estimated time of death',
      });
    }

    // Discovery
    events.push({
      id: 'discovery',
      time: '0h (Discovery)',
      description: 'Body discovered and scene secured',
      verified: 'yes',
    });

    // Locked events (require more investigation)
    if (investigationProgress < 50) {
      events.push({
        id: 'locked_1',
        time: '???',
        description: '[CLASSIFIED - Requires 50% investigation]',
        verified: 'uncertain',
        locked: true,
      });
    }

    if (investigationProgress < 75) {
      events.push({
        id: 'locked_2',
        time: '???',
        description: '[CLASSIFIED - Requires 75% investigation]',
        verified: 'uncertain',
        locked: true,
      });
    }

    return events.sort((a, b) => {
      if (a.locked) return 1;
      if (b.locked) return -1;
      return 0;
    });
  }, [crimeCase, investigationProgress]);

  // Generate hypotheses based on evidence
  const hypotheses = useMemo<Hypothesis[]>(() => {
    const hypos: Hypothesis[] = [];

    // Murder hypothesis
    hypos.push({
      id: 'murder',
      title: 'HOMICIDE - Premeditated',
      description: 'Victim was killed by known or unknown assailant with prior planning.',
      supportingEvidence: [
        crimeCase.evidence.weaponFound !== 'none' ? 'Weapon found at scene' : '',
        crimeCase.evidence.footprintType !== 'none' ? 'Footprint evidence suggests second individual' : '',
        crimeCase.evidence.bloodPattern !== 'none' ? 'Blood spatter indicates violent altercation' : '',
      ].filter(Boolean),
      contradictingEvidence: [
        crimeCase.hiddenSolution.isStaged ? 'Scene staging suggests misdirection' : '',
        crimeCase.evidence.surveillance?.corruption ? 'Corrupted surveillance suggests inside knowledge' : '',
      ].filter(Boolean),
      probability: crimeCase.hiddenSolution.crimeType === 'murder' ? 75 : 35,
    });

    // Suicide hypothesis
    if (crimeCase.evidence.weaponFound === 'poison' || crimeCase.evidence.weaponFound === 'firearm') {
      hypos.push({
        id: 'suicide',
        title: 'SUICIDE - Self-inflicted',
        description: 'Victim took their own life. Scene may or may not be staged.',
        supportingEvidence: [
          crimeCase.victim.recentBehavior || '',
          crimeCase.evidence.footprintType === 'none' ? 'No evidence of second individual' : '',
        ].filter(Boolean),
        contradictingEvidence: [
          crimeCase.evidence.footprintType === 'multiple' ? 'Multiple footprints present' : '',
          'Defensive wounds noted on autopsy',
        ].filter(Boolean),
        probability: crimeCase.hiddenSolution.crimeType === 'suicide' ? 70 : 20,
      });
    }

    // Accident hypothesis
    hypos.push({
      id: 'accident',
      title: 'ACCIDENT - Unintentional Death',
      description: 'Death resulted from accident. No criminal intent.',
      supportingEvidence: [
        crimeCase.evidence.environmentalDamage?.type !== 'none' ? 'Environmental hazards present' : '',
      ].filter(Boolean),
      contradictingEvidence: [
        crimeCase.evidence.weaponFound !== 'none' ? 'Weapon presence inconsistent with accident' : '',
        'Evidence of struggle noted',
        crimeCase.hiddenSolution.isStaged ? 'Scene staging indicates intent' : '',
      ].filter(Boolean),
      probability: crimeCase.hiddenSolution.crimeType === 'accident' ? 60 : 15,
    });

    // Staged suicide (complex)
    if (investigationProgress > 40) {
      hypos.push({
        id: 'staged_suicide',
        title: 'HOMICIDE - Staged as Suicide',
        description: 'Murder made to appear as suicide. High sophistication.',
        supportingEvidence: [
          crimeCase.hiddenSolution.isStaged ? 'Scene inconsistencies detected' : '',
          'Weapon positioning atypical for self-infliction',
        ].filter(Boolean),
        contradictingEvidence: [
          'No clear motive established',
          'Victim showed signs of suicidal ideation (unconfirmed)',
        ].filter(Boolean),
        probability: (crimeCase.hiddenSolution.crimeType === 'murder' && crimeCase.hiddenSolution.isStaged) ? 80 : 25,
      });
    }

    return hypos;
  }, [crimeCase, investigationProgress]);

  // Generate evidence connections
  const connections = useMemo<Connection[]>(() => {
    const conns: Connection[] = [];

    // Victim to known associates
    crimeCase.victim.knownAssociates?.forEach((associate, i) => {
      conns.push({
        from: 'Victim',
        to: associate,
        type: 'victim_to_suspect',
        description: `Known association - requires investigation`,
      });
    });

    // Evidence links
    if (crimeCase.evidence.digitalEvidence?.length) {
      crimeCase.evidence.digitalEvidence.forEach((digital, i) => {
        if (digital.forensicNote) {
          conns.push({
            from: digital.type.replace('_', ' '),
            to: 'Unknown Contact',
            type: 'evidence_to_motive',
            description: digital.forensicNote,
          });
        }
      });
    }

    // Contradictions
    crimeCase.evidence.contradictions?.forEach((contradiction, i) => {
      conns.push({
        from: contradiction.evidence1,
        to: contradiction.evidence2,
        type: 'contradiction',
        description: contradiction.explanation,
      });
    });

    return conns;
  }, [crimeCase]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  return (
    <div className={cn("bg-card border border-border rounded overflow-hidden", className)}>
      {/* Header */}
      <div className="p-4 border-b border-border bg-background/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-forensic/20 border border-forensic/30">
              <Brain className="w-5 h-5 text-forensic" />
            </div>
            <div>
              <h3 className="font-typewriter text-sm text-foreground tracking-wider">
                CASE ANALYSIS CENTER
              </h3>
              <p className="text-xs text-muted-foreground font-terminal">
                Correlate evidence • Build hypotheses • Find truth
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <span className="text-xs text-muted-foreground font-terminal block">CASE COMPLEXITY</span>
            <span className="text-sm font-bold text-warning capitalize">{crimeCase.difficulty}</span>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center gap-3">
          <Progress value={investigationProgress} className="flex-1 h-2" />
          <span className="text-sm font-terminal text-foreground">{investigationProgress}%</span>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent p-0">
          <TabsTrigger 
            value="timeline" 
            className="font-terminal text-xs rounded-none border-b-2 border-transparent data-[state=active]:border-forensic data-[state=active]:bg-transparent"
          >
            <Clock className="w-4 h-4 mr-1" />
            TIMELINE
          </TabsTrigger>
          <TabsTrigger 
            value="hypotheses"
            className="font-terminal text-xs rounded-none border-b-2 border-transparent data-[state=active]:border-warning data-[state=active]:bg-transparent"
          >
            <Target className="w-4 h-4 mr-1" />
            HYPOTHESES
          </TabsTrigger>
          <TabsTrigger 
            value="connections"
            className="font-terminal text-xs rounded-none border-b-2 border-transparent data-[state=active]:border-cold data-[state=active]:bg-transparent"
          >
            <GitBranch className="w-4 h-4 mr-1" />
            CONNECTIONS
          </TabsTrigger>
          <TabsTrigger 
            value="contradictions"
            className="font-terminal text-xs rounded-none border-b-2 border-transparent data-[state=active]:border-blood data-[state=active]:bg-transparent"
          >
            <AlertTriangle className="w-4 h-4 mr-1" />
            CONTRADICTIONS
          </TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="p-4 m-0">
          <div className="space-y-2">
            {timeline.map((event, i) => (
              <div 
                key={event.id}
                className={cn(
                  "flex gap-4 p-3 rounded border transition-all",
                  event.locked 
                    ? "bg-muted/20 border-muted opacity-50" 
                    : event.verified === 'yes' 
                      ? "bg-forensic/5 border-forensic/30" 
                      : event.verified === 'no'
                        ? "bg-blood/5 border-blood/30"
                        : "bg-warning/5 border-warning/30"
                )}
              >
                <div className="w-32 flex-shrink-0">
                  <span className="text-xs font-terminal text-muted-foreground">{event.time}</span>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start gap-2">
                    {event.locked ? (
                      <Lock className="w-4 h-4 text-muted-foreground mt-0.5" />
                    ) : event.verified === 'yes' ? (
                      <CheckCircle className="w-4 h-4 text-forensic mt-0.5" />
                    ) : event.verified === 'no' ? (
                      <XCircle className="w-4 h-4 text-blood mt-0.5" />
                    ) : (
                      <HelpCircle className="w-4 h-4 text-warning mt-0.5" />
                    )}
                    <div>
                      <p className={cn(
                        "text-sm font-clinical",
                        event.locked ? "text-muted-foreground" : "text-foreground"
                      )}>
                        {event.description}
                      </p>
                      {event.contradiction && !event.locked && (
                        <p className="text-xs text-blood mt-1 font-terminal">
                          ⚠ {event.contradiction}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="hypotheses" className="p-4 m-0">
          <div className="space-y-3">
            {hypotheses.map(hypo => (
              <Collapsible 
                key={hypo.id}
                open={selectedHypothesis === hypo.id}
                onOpenChange={() => setSelectedHypothesis(selectedHypothesis === hypo.id ? null : hypo.id)}
              >
                <CollapsibleTrigger className="w-full">
                  <div className={cn(
                    "flex items-center justify-between p-3 rounded border transition-all hover:bg-muted/30",
                    selectedHypothesis === hypo.id ? "bg-muted/20 border-foreground/30" : "border-border"
                  )}>
                    <div className="flex items-center gap-3">
                      <Target className="w-4 h-4 text-warning" />
                      <span className="font-typewriter text-sm text-foreground">{hypo.title}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-24">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Probability</span>
                          <span className={cn(
                            "font-bold",
                            hypo.probability > 60 ? "text-forensic" : hypo.probability > 30 ? "text-warning" : "text-muted-foreground"
                          )}>
                            {hypo.probability}%
                          </span>
                        </div>
                        <Progress value={hypo.probability} className="h-1" />
                      </div>
                      {selectedHypothesis === hypo.id ? (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <div className="p-4 border border-t-0 border-border rounded-b bg-background/50">
                    <p className="text-sm text-muted-foreground mb-4 font-clinical">{hypo.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-xs font-terminal text-forensic mb-2 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          SUPPORTING EVIDENCE
                        </h5>
                        <ul className="space-y-1">
                          {hypo.supportingEvidence.map((ev, i) => (
                            <li key={i} className="text-xs text-muted-foreground font-clinical flex items-start gap-1">
                              <span className="text-forensic">+</span> {ev}
                            </li>
                          ))}
                          {hypo.supportingEvidence.length === 0 && (
                            <li className="text-xs text-muted-foreground/50 italic">No supporting evidence found</li>
                          )}
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="text-xs font-terminal text-blood mb-2 flex items-center gap-1">
                          <XCircle className="w-3 h-3" />
                          CONTRADICTING EVIDENCE
                        </h5>
                        <ul className="space-y-1">
                          {hypo.contradictingEvidence.map((ev, i) => (
                            <li key={i} className="text-xs text-muted-foreground font-clinical flex items-start gap-1">
                              <span className="text-blood">−</span> {ev}
                            </li>
                          ))}
                          {hypo.contradictingEvidence.length === 0 && (
                            <li className="text-xs text-muted-foreground/50 italic">No contradictions found</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="connections" className="p-4 m-0">
          <div className="space-y-2">
            {connections.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground font-terminal text-sm">
                <Link2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No connections established yet.</p>
                <p className="text-xs mt-1">Continue investigating to reveal links.</p>
              </div>
            ) : (
              connections.map((conn, i) => (
                <div 
                  key={i}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded border",
                    conn.type === 'contradiction' 
                      ? "bg-blood/5 border-blood/30" 
                      : "bg-cold/5 border-cold/30"
                  )}
                >
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-sm font-terminal text-foreground">{conn.from}</span>
                    <div className={cn(
                      "flex-1 h-px",
                      conn.type === 'contradiction' ? "bg-blood/50" : "bg-cold/50"
                    )} />
                    {conn.type === 'contradiction' ? (
                      <AlertTriangle className="w-4 h-4 text-blood" />
                    ) : (
                      <Link2 className="w-4 h-4 text-cold" />
                    )}
                    <div className={cn(
                      "flex-1 h-px",
                      conn.type === 'contradiction' ? "bg-blood/50" : "bg-cold/50"
                    )} />
                    <span className="text-sm font-terminal text-foreground">{conn.to}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="contradictions" className="p-4 m-0">
          <div className="space-y-3">
            {crimeCase.evidence.contradictions?.map((contradiction, i) => (
              <div 
                key={i}
                className="p-4 bg-blood/5 border border-blood/30 rounded"
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-blood flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-terminal text-foreground">{contradiction.evidence1}</span>
                      <span className="text-xs text-muted-foreground">vs.</span>
                      <span className="text-sm font-terminal text-foreground">{contradiction.evidence2}</span>
                    </div>
                    <p className="text-sm text-muted-foreground font-clinical">{contradiction.explanation}</p>
                    <span className={cn(
                      "inline-block mt-2 text-xs font-terminal px-2 py-0.5 rounded",
                      contradiction.significance === 'critical' 
                        ? "bg-blood/20 text-blood" 
                        : contradiction.significance === 'major'
                          ? "bg-warning/20 text-warning"
                          : "bg-muted text-muted-foreground"
                    )}>
                      {contradiction.significance.toUpperCase()} SIGNIFICANCE
                    </span>
                  </div>
                </div>
              </div>
            )) || (
              <div className="text-center py-8 text-muted-foreground font-terminal text-sm">
                <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No contradictions detected yet.</p>
                <p className="text-xs mt-1">Or perhaps they're hidden deeper...</p>
              </div>
            )}
            
            {/* Hidden hints from case */}
            {crimeCase.hiddenSolution.hiddenHints.length > 0 && investigationProgress > 60 && (
              <div className="mt-4 p-4 bg-warning/5 border border-warning/30 rounded">
                <h5 className="text-xs font-terminal text-warning mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  INVESTIGATOR INSIGHTS (Unlocked at 60%+)
                </h5>
                <div className="space-y-2">
                  {crimeCase.hiddenSolution.hiddenHints.slice(0, Math.floor(investigationProgress / 25)).map((hint, i) => (
                    <div key={i} className="text-xs text-muted-foreground font-clinical">
                      <span className="text-warning font-terminal">{hint.location}:</span> {hint.hint}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
