import { useState, useEffect, useMemo } from 'react';
import { 
  History, 
  Clock, 
  Target, 
  Award, 
  Skull, 
  FileText, 
  ChevronDown, 
  ChevronRight,
  Trash2,
  Eye,
  Calendar,
  MapPin,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { CrimeCase, ValidationResult } from '@/types/crime';

interface CaseHistoryTrackerProps {
  className?: string;
  onSelectCase?: (caseId: string) => void;
}

export interface CaseHistoryEntry {
  id: string;
  caseId: string;
  caseTitle: string;
  location: string;
  difficulty: 'beginner' | 'intermediate' | 'expert';
  victimName: string;
  timestamp: number;
  completedAt: number;
  duration: number;
  score: number;
  verdict: 'consistent' | 'partial' | 'illogical';
  correctDeductions: number;
  incorrectDeductions: number;
  evidenceExamined: number;
  totalEvidence: number;
  crimeTypePredicted?: string;
  actualCrimeType?: string;
  wasStagedCorrectly?: boolean;
}

const STORAGE_KEY = 'evidence_archive_case_history';

export function getCaseHistory(): CaseHistoryEntry[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveCaseToHistory(
  crimeCase: CrimeCase, 
  result: ValidationResult,
  investigationDuration: number,
  evidenceExamined: number,
  totalEvidence: number,
  userPredictions: { crimeType?: string; wasStaged?: boolean }
): CaseHistoryEntry {
  const history = getCaseHistory();
  
  const entry: CaseHistoryEntry = {
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    caseId: crimeCase.id,
    caseTitle: crimeCase.title,
    location: crimeCase.location,
    difficulty: crimeCase.difficulty,
    victimName: crimeCase.victim.name,
    timestamp: Date.now(),
    completedAt: Date.now(),
    duration: investigationDuration,
    score: result.score,
    verdict: result.verdict,
    correctDeductions: result.correctDeductions.length,
    incorrectDeductions: result.incorrectDeductions.length,
    evidenceExamined,
    totalEvidence,
    crimeTypePredicted: userPredictions.crimeType,
    actualCrimeType: crimeCase.hiddenSolution.crimeType,
    wasStagedCorrectly: userPredictions.wasStaged === crimeCase.hiddenSolution.isStaged,
  };

  history.unshift(entry);
  
  // Keep only last 50 entries
  const trimmedHistory = history.slice(0, 50);
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedHistory));
  
  return entry;
}

export function clearCaseHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function CaseHistoryTracker({ className, onSelectCase }: CaseHistoryTrackerProps) {
  const [history, setHistory] = useState<CaseHistoryEntry[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);

  useEffect(() => {
    const loadHistory = () => {
      setHistory(getCaseHistory());
    };
    
    loadHistory();
    
    // Listen for storage changes
    window.addEventListener('storage', loadHistory);
    
    // Custom event for same-tab updates
    const handleUpdate = () => loadHistory();
    window.addEventListener('case-history-updated', handleUpdate);
    
    return () => {
      window.removeEventListener('storage', loadHistory);
      window.removeEventListener('case-history-updated', handleUpdate);
    };
  }, []);

  const stats = useMemo(() => {
    if (history.length === 0) return null;
    
    const totalCases = history.length;
    const avgScore = Math.round(history.reduce((sum, h) => sum + h.score, 0) / totalCases);
    const consistentVerdicts = history.filter(h => h.verdict === 'consistent').length;
    const avgDuration = Math.round(history.reduce((sum, h) => sum + h.duration, 0) / totalCases);
    const correctCrimeTypes = history.filter(h => h.crimeTypePredicted === h.actualCrimeType).length;
    const correctStaging = history.filter(h => h.wasStagedCorrectly).length;
    
    // Recent trend (last 5 vs previous 5)
    const recent5 = history.slice(0, 5);
    const previous5 = history.slice(5, 10);
    const recentAvg = recent5.length > 0 ? recent5.reduce((sum, h) => sum + h.score, 0) / recent5.length : 0;
    const previousAvg = previous5.length > 0 ? previous5.reduce((sum, h) => sum + h.score, 0) / previous5.length : 0;
    const trend = recentAvg - previousAvg;
    
    return {
      totalCases,
      avgScore,
      consistentVerdicts,
      consistentRate: Math.round((consistentVerdicts / totalCases) * 100),
      avgDuration,
      correctCrimeTypes,
      crimeTypeAccuracy: Math.round((correctCrimeTypes / totalCases) * 100),
      correctStaging,
      stagingAccuracy: Math.round((correctStaging / totalCases) * 100),
      trend,
    };
  }, [history]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'consistent': return 'text-forensic border-forensic/30 bg-forensic/10';
      case 'partial': return 'text-warning border-warning/30 bg-warning/10';
      case 'illogical': return 'text-blood border-blood/30 bg-blood/10';
      default: return 'text-muted-foreground';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-forensic border-forensic/30';
      case 'intermediate': return 'text-warning border-warning/30';
      case 'expert': return 'text-blood border-blood/30';
      default: return 'text-muted-foreground';
    }
  };

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear all case history? This cannot be undone.')) {
      clearCaseHistory();
      setHistory([]);
    }
  };

  if (history.length === 0 && !isExpanded) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsExpanded(true)}
        className={cn("border-border text-muted-foreground hover:text-foreground", className)}
      >
        <History className="w-4 h-4 mr-2" />
        Case History
      </Button>
    );
  }

  return (
    <div className={cn("relative", className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        className="border-border text-muted-foreground hover:text-foreground"
      >
        <History className="w-4 h-4 mr-2" />
        Case History
        {history.length > 0 && (
          <Badge variant="outline" className="ml-2 text-[10px]">
            {history.length}
          </Badge>
        )}
      </Button>

      {isExpanded && (
        <div className="absolute right-0 top-full mt-2 w-[480px] bg-card border border-border rounded-lg shadow-xl z-50 animate-fade-in">
          {/* Header */}
          <div className="p-4 border-b border-border bg-background/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-cold" />
              <span className="font-typewriter text-sm text-foreground">INVESTIGATION HISTORY</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearHistory}
              className="text-muted-foreground hover:text-blood h-7 px-2"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Stats Summary */}
          {stats && (
            <div className="p-4 border-b border-border grid grid-cols-4 gap-3 text-center">
              <div>
                <div className="text-lg font-bold text-foreground">{stats.totalCases}</div>
                <div className="text-[10px] text-muted-foreground font-terminal">CASES</div>
              </div>
              <div>
                <div className="text-lg font-bold text-foreground flex items-center justify-center gap-1">
                  {stats.avgScore}%
                  {stats.trend !== 0 && (
                    stats.trend > 0 
                      ? <TrendingUp className="w-3 h-3 text-forensic" />
                      : <TrendingDown className="w-3 h-3 text-blood" />
                  )}
                </div>
                <div className="text-[10px] text-muted-foreground font-terminal">AVG SCORE</div>
              </div>
              <div>
                <div className="text-lg font-bold text-forensic">{stats.consistentRate}%</div>
                <div className="text-[10px] text-muted-foreground font-terminal">ACCURATE</div>
              </div>
              <div>
                <div className="text-lg font-bold text-cold">{stats.crimeTypeAccuracy}%</div>
                <div className="text-[10px] text-muted-foreground font-terminal">TYPE ACC</div>
              </div>
            </div>
          )}

          {/* History List */}
          <ScrollArea className="h-[400px]">
            {history.length === 0 ? (
              <div className="p-8 text-center">
                <Skull className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground font-terminal">NO CASES ON RECORD</p>
                <p className="text-xs text-muted-foreground/50 mt-1">
                  Complete investigations to build your history.
                </p>
              </div>
            ) : (
              <div className="p-2 space-y-1">
                {history.map((entry) => (
                  <Collapsible 
                    key={entry.id}
                    open={expandedEntry === entry.id}
                    onOpenChange={() => setExpandedEntry(expandedEntry === entry.id ? null : entry.id)}
                  >
                    <CollapsibleTrigger className="w-full">
                      <div className={cn(
                        "p-3 rounded border text-left hover:bg-muted/30 transition-all",
                        expandedEntry === entry.id ? "border-cold/50 bg-cold/5" : "border-border"
                      )}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-terminal text-foreground truncate">
                                {entry.caseTitle}
                              </span>
                              <Badge 
                                variant="outline" 
                                className={cn("text-[10px] px-1", getDifficultyColor(entry.difficulty))}
                              >
                                {entry.difficulty.charAt(0).toUpperCase()}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {entry.location.replace('_', ' ')}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatDuration(entry.duration)}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Badge 
                              variant="outline" 
                              className={cn("text-[10px] px-2", getVerdictColor(entry.verdict))}
                            >
                              {entry.score}%
                            </Badge>
                            {expandedEntry === entry.id ? (
                              <ChevronDown className="w-4 h-4 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                      </div>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <div className="p-3 border border-t-0 border-border rounded-b bg-background/50 space-y-3">
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <span className="text-muted-foreground font-terminal">VICTIM:</span>
                            <span className="text-foreground ml-2">{entry.victimName}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground font-terminal">DATE:</span>
                            <span className="text-foreground ml-2">{formatDate(entry.timestamp)}</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground font-terminal">EVIDENCE EXAMINED</span>
                            <span className="text-foreground">{entry.evidenceExamined}/{entry.totalEvidence}</span>
                          </div>
                          <Progress 
                            value={(entry.evidenceExamined / entry.totalEvidence) * 100} 
                            className="h-1" 
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="p-2 bg-forensic/10 border border-forensic/30 rounded">
                            <div className="text-sm font-bold text-forensic">{entry.correctDeductions}</div>
                            <div className="text-[10px] text-muted-foreground">Correct</div>
                          </div>
                          <div className="p-2 bg-blood/10 border border-blood/30 rounded">
                            <div className="text-sm font-bold text-blood">{entry.incorrectDeductions}</div>
                            <div className="text-[10px] text-muted-foreground">Incorrect</div>
                          </div>
                          <div className="p-2 bg-cold/10 border border-cold/30 rounded">
                            <div className="text-sm font-bold text-cold">
                              {entry.wasStagedCorrectly ? '✓' : '✗'}
                            </div>
                            <div className="text-[10px] text-muted-foreground">Staging</div>
                          </div>
                        </div>

                        {entry.crimeTypePredicted && entry.actualCrimeType && (
                          <div className="p-2 bg-muted/30 rounded text-xs">
                            <span className="text-muted-foreground font-terminal">CRIME TYPE: </span>
                            <span className={cn(
                              "font-clinical",
                              entry.crimeTypePredicted === entry.actualCrimeType 
                                ? "text-forensic" 
                                : "text-blood"
                            )}>
                              Predicted {entry.crimeTypePredicted} 
                              {entry.crimeTypePredicted !== entry.actualCrimeType && (
                                <span className="text-muted-foreground"> (Actual: {entry.actualCrimeType})</span>
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Footer */}
          <div className="p-3 border-t border-border bg-background/50">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
              className="w-full text-muted-foreground hover:text-foreground text-xs"
            >
              Close History
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
