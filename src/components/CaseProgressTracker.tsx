import { useState, useEffect } from 'react';
import { CrimeCase } from '@/types/crime';
import { Progress } from '@/components/ui/progress';
import { 
  Eye, 
  FileText, 
  Fingerprint, 
  Brain, 
  Clock,
  AlertCircle,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CaseProgressTrackerProps {
  crimeCase: CrimeCase;
  evidenceViewed: Set<string>;
  className?: string;
}

interface ProgressStage {
  id: string;
  label: string;
  icon: React.ReactNode;
  requirement: number;
  description: string;
}

export function CaseProgressTracker({ 
  crimeCase, 
  evidenceViewed,
  className 
}: CaseProgressTrackerProps) {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);

  const totalEvidence = 
    (crimeCase.evidence.sceneObjects?.length || 0) +
    (crimeCase.evidence.wounds?.length || 0) +
    (crimeCase.evidence.timeClues?.length || 0) +
    5; // Base evidence types

  const viewedCount = evidenceViewed.size;
  const progressPercent = Math.min((viewedCount / totalEvidence) * 100, 100);

  const stages: ProgressStage[] = [
    { 
      id: 'arrival', 
      label: 'SCENE ARRIVAL', 
      icon: <Eye className="w-4 h-4" />,
      requirement: 0,
      description: 'Initial scene assessment'
    },
    { 
      id: 'collection', 
      label: 'EVIDENCE COLLECTION', 
      icon: <Fingerprint className="w-4 h-4" />,
      requirement: 25,
      description: 'Gathering physical evidence'
    },
    { 
      id: 'analysis', 
      label: 'FORENSIC ANALYSIS', 
      icon: <FileText className="w-4 h-4" />,
      requirement: 50,
      description: 'Processing collected materials'
    },
    { 
      id: 'reconstruction', 
      label: 'RECONSTRUCTION', 
      icon: <Brain className="w-4 h-4" />,
      requirement: 75,
      description: 'Forming hypothesis'
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const newStage = stages.findIndex((s, i) => {
      const nextStage = stages[i + 1];
      return !nextStage || progressPercent < nextStage.requirement;
    });
    setCurrentStage(Math.max(0, newStage));
  }, [progressPercent]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={cn("bg-card border border-border p-4 rounded", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-blood animate-pulse" />
          <span className="font-typewriter text-sm text-foreground tracking-wider">
            INVESTIGATION STATUS
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs font-terminal text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span className="text-forensic">{formatTime(timeElapsed)}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-xs font-terminal text-muted-foreground">
          <span>Evidence Analyzed</span>
          <span className="text-foreground">{viewedCount}/{totalEvidence}</span>
        </div>
        <Progress 
          value={progressPercent} 
          className="h-2 bg-background border border-border"
        />
      </div>

      {/* Stage Indicators */}
      <div className="flex items-center justify-between relative">
        {/* Connection Line */}
        <div className="absolute top-4 left-0 right-0 h-px bg-border -z-10" />
        
        {stages.map((stage, index) => {
          const isActive = index === currentStage;
          const isComplete = progressPercent >= (stages[index + 1]?.requirement || 100);
          const isLocked = index > currentStage;

          return (
            <div 
              key={stage.id}
              className={cn(
                "flex flex-col items-center text-center relative group",
                isLocked && "opacity-40"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full border-2 flex items-center justify-center bg-card transition-all duration-300",
                isActive && "border-blood text-blood animate-pulse-slow shadow-lg shadow-blood/20",
                isComplete && "border-forensic text-forensic bg-forensic/10",
                !isActive && !isComplete && "border-border text-muted-foreground"
              )}>
                {isComplete ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : isLocked ? (
                  <Lock className="w-3 h-3" />
                ) : (
                  stage.icon
                )}
              </div>
              
              <span className={cn(
                "text-[10px] font-terminal mt-2 tracking-wider max-w-16",
                isActive && "text-blood",
                isComplete && "text-forensic",
                !isActive && !isComplete && "text-muted-foreground"
              )}>
                {stage.label}
              </span>

              {/* Tooltip */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-background border border-border px-2 py-1 rounded text-xs font-terminal text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {stage.description}
              </div>
            </div>
          );
        })}
      </div>

      {/* Current Stage Info */}
      <div className="mt-4 p-2 bg-background border border-border text-xs font-terminal text-muted-foreground">
        <span className="text-blood">▸</span> {stages[currentStage].description}
        {currentStage < stages.length - 1 && (
          <span className="block mt-1 text-muted-foreground/60">
            Next stage at {stages[currentStage + 1].requirement}% completion
          </span>
        )}
      </div>
    </div>
  );
}
