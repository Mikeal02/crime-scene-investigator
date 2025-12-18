import { ValidationResult } from '@/types/crime';
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  FileText,
  Eye,
  Skull,
  AlertTriangle,
  Lock,
  FileWarning
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResultsPanelProps {
  result: ValidationResult;
  onNewCase: () => void;
}

export function ResultsPanel({ result, onNewCase }: ResultsPanelProps) {
  const verdictConfig = {
    consistent: {
      label: 'RECONSTRUCTION ACCEPTED',
      sublabel: 'Your analysis aligns with documented findings',
      icon: Eye,
      className: 'border-forensic/50 bg-forensic/5',
      textClass: 'text-forensic',
      endingText: 'Your reconstruction has been logged. It aligns with the official record. Whether the official record reflects truth... that remains classified.',
    },
    partial: {
      label: 'RECONSTRUCTION FLAGGED',
      sublabel: 'Critical inconsistencies detected in your analysis',
      icon: AlertTriangle,
      className: 'border-warning/50 bg-warning/5',
      textClass: 'text-warning',
      endingText: 'Your reconstruction contains significant deviations from documented evidence. It has been flagged for review. The truth remains elusive.',
    },
    illogical: {
      label: 'RECONSTRUCTION REJECTED',
      sublabel: 'Fundamental logical failures in your analysis',
      icon: XCircle,
      className: 'border-blood/50 bg-blood/5',
      textClass: 'text-blood',
      endingText: 'Your reconstruction contradicts fundamental evidence. It has been rejected. Perhaps the evidence itself was designed to mislead. Perhaps you saw what you were meant to see.',
    },
  };

  const config = verdictConfig[result.verdict];
  const VerdictIcon = config.icon;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <div className="h-px flex-1 bg-border" />
        <h2 className="font-typewriter text-lg text-blood px-4 tracking-wider">
          CASE ASSESSMENT
        </h2>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* Verdict Box */}
      <div className={cn(
        "p-6 border text-center",
        config.className
      )}>
        <VerdictIcon className={cn("w-12 h-12 mx-auto mb-3", config.textClass)} />
        <h3 className={cn("font-typewriter text-xl mb-1 tracking-wider", config.textClass)}>
          {config.label}
        </h3>
        <p className="text-xs text-muted-foreground font-clinical">
          {config.sublabel}
        </p>
        
        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs text-muted-foreground font-terminal">ACCURACY RATING:</span>
            <span className={cn("text-2xl font-bold font-terminal", config.textClass)}>
              {result.score}
            </span>
            <span className="text-muted-foreground/50">/100</span>
          </div>
        </div>
      </div>

      {/* Analysis Breakdown */}
      <div className="space-y-4">
        {/* Correct Findings */}
        {result.correctDeductions.length > 0 && (
          <div className="space-y-2">
            <h4 className="flex items-center gap-2 text-forensic font-typewriter text-sm">
              <CheckCircle2 className="w-4 h-4" />
              VERIFIED DEDUCTIONS
            </h4>
            <div className="space-y-2">
              {result.correctDeductions.map((deduction, index) => (
                <div 
                  key={index}
                  className="p-3 bg-forensic/5 border border-forensic/20 text-sm text-foreground font-clinical"
                >
                  <span className="text-forensic font-terminal text-xs mr-2">[CONFIRMED]</span>
                  {deduction}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Incorrect Findings */}
        {result.incorrectDeductions.length > 0 && (
          <div className="space-y-2">
            <h4 className="flex items-center gap-2 text-blood font-typewriter text-sm">
              <XCircle className="w-4 h-4" />
              CONTRADICTED ANALYSIS
            </h4>
            <div className="space-y-2">
              {result.incorrectDeductions.map((deduction, index) => (
                <div 
                  key={index}
                  className="p-3 bg-blood/5 border border-blood/20 text-sm text-foreground font-clinical"
                >
                  <span className="text-blood font-terminal text-xs mr-2">[REFUTED]</span>
                  {deduction}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Missing Reasoning */}
        {result.missingReasoning.length > 0 && (
          <div className="space-y-2">
            <h4 className="flex items-center gap-2 text-warning font-typewriter text-sm">
              <AlertCircle className="w-4 h-4" />
              OVERLOOKED EVIDENCE
            </h4>
            <div className="space-y-2">
              {result.missingReasoning.map((note, index) => (
                <div 
                  key={index}
                  className="p-3 bg-warning/5 border border-warning/20 text-sm text-foreground font-clinical"
                >
                  <span className="text-warning font-terminal text-xs mr-2">[UNADDRESSED]</span>
                  {note}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Official Reconstruction */}
      <div className="space-y-3">
        <h4 className="flex items-center gap-2 text-foreground font-typewriter text-sm">
          <FileText className="w-4 h-4 text-blood" />
          CLASSIFIED RECONSTRUCTION
        </h4>
        <div className="p-4 bg-card border border-border">
          <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground font-terminal">
            <Lock className="w-3 h-3" />
            <span>DOCUMENT CLEARANCE: PARTIAL RELEASE</span>
          </div>
          <p className="text-sm text-foreground leading-relaxed font-clinical">
            {result.officialReconstruction}
          </p>
        </div>
      </div>

      {/* Bleak Ending */}
      <div className="p-4 border border-border bg-background">
        <div className="flex items-center gap-2 mb-3">
          <Skull className="w-4 h-4 text-muted-foreground" />
          <span className="font-typewriter text-sm text-muted-foreground">CASE STATUS</span>
        </div>
        <p className="text-sm text-muted-foreground font-clinical italic leading-relaxed">
          {config.endingText}
        </p>
        <div className="mt-4 pt-3 border-t border-border/50 space-y-1 text-xs font-terminal text-muted-foreground/50">
          <p>• This case file will remain in the system indefinitely.</p>
          <p>• No perpetrator has been formally identified.</p>
          <p>• The victim's story ends here. Yours continues.</p>
        </div>
      </div>

      {/* Final Warning */}
      <div className="p-3 border border-blood/20 bg-blood/5 flex items-start gap-2">
        <FileWarning className="w-4 h-4 text-blood flex-shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground font-clinical">
          <span className="text-blood font-typewriter">NOTICE:</span> Your reconstruction has been permanently archived. 
          All conclusions drawn from this case file are your responsibility. 
          The system makes no claims regarding the ultimate truth of what occurred.
        </p>
      </div>

      {/* Continue Button */}
      <button
        onClick={onNewCase}
        className="w-full py-4 px-4 bg-card hover:bg-card/80 border border-border hover:border-blood/30 text-foreground font-typewriter tracking-wider transition-all duration-200 horror-button"
      >
        <span className="flex items-center justify-center gap-2">
          <Eye className="w-4 h-4" />
          EXAMINE ANOTHER CASE FILE
        </span>
      </button>

      <p className="text-center text-xs text-muted-foreground/30 font-terminal">
        Truth logged. Consequences unknown. The archive grows.
      </p>
    </div>
  );
}