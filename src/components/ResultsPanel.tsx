import { ValidationResult } from '@/types/crime';
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  FileText,
  Trophy,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResultsPanelProps {
  result: ValidationResult;
  onNewCase: () => void;
}

export function ResultsPanel({ result, onNewCase }: ResultsPanelProps) {
  const verdictConfig = {
    consistent: {
      label: 'LOGICALLY CONSISTENT',
      icon: Trophy,
      className: 'verdict-success border',
      textClass: 'text-success',
    },
    partial: {
      label: 'PARTIALLY FLAWED',
      icon: AlertCircle,
      className: 'verdict-warning border',
      textClass: 'text-warning',
    },
    illogical: {
      label: 'ILLOGICAL RECONSTRUCTION',
      icon: XCircle,
      className: 'verdict-error border',
      textClass: 'text-destructive',
    },
  };

  const config = verdictConfig[result.verdict];
  const VerdictIcon = config.icon;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Score and Verdict */}
      <div className={cn(
        "p-6 rounded-lg text-center",
        config.className
      )}>
        <VerdictIcon className={cn("w-12 h-12 mx-auto mb-3", config.textClass)} />
        <h3 className={cn("font-typewriter text-xl mb-2", config.textClass)}>
          {config.label}
        </h3>
        <div className="flex items-center justify-center gap-2">
          <Target className="w-5 h-5 text-muted-foreground" />
          <span className="text-3xl font-bold text-foreground">{result.score}</span>
          <span className="text-muted-foreground">/100</span>
        </div>
      </div>

      {/* Correct Deductions */}
      {result.correctDeductions.length > 0 && (
        <div className="space-y-3">
          <h4 className="flex items-center gap-2 text-success font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            Correct Deductions
          </h4>
          <ul className="space-y-2">
            {result.correctDeductions.map((deduction, index) => (
              <li 
                key={index}
                className="p-3 bg-success/10 border border-success/20 rounded-lg text-sm text-foreground"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {deduction}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Incorrect Deductions */}
      {result.incorrectDeductions.length > 0 && (
        <div className="space-y-3">
          <h4 className="flex items-center gap-2 text-destructive font-semibold">
            <XCircle className="w-4 h-4" />
            Incorrect Analysis
          </h4>
          <ul className="space-y-2">
            {result.incorrectDeductions.map((deduction, index) => (
              <li 
                key={index}
                className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-foreground"
              >
                {deduction}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Missing Reasoning */}
      {result.missingReasoning.length > 0 && (
        <div className="space-y-3">
          <h4 className="flex items-center gap-2 text-warning font-semibold">
            <AlertCircle className="w-4 h-4" />
            Investigative Notes
          </h4>
          <ul className="space-y-2">
            {result.missingReasoning.map((note, index) => (
              <li 
                key={index}
                className="p-3 bg-warning/10 border border-warning/20 rounded-lg text-sm text-foreground"
              >
                {note}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Official Reconstruction */}
      <div className="space-y-3">
        <h4 className="flex items-center gap-2 text-primary font-semibold">
          <FileText className="w-4 h-4" />
          Official Reconstruction
        </h4>
        <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
          <p className="text-sm text-foreground leading-relaxed font-typewriter">
            {result.officialReconstruction}
          </p>
        </div>
      </div>

      {/* New Case Button */}
      <button
        onClick={onNewCase}
        className="w-full py-3 px-4 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-lg font-semibold transition-colors"
      >
        Investigate New Case
      </button>
    </div>
  );
}
