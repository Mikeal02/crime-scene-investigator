import { cn } from '@/lib/utils';
import { Shield, AlertTriangle, Skull, Lock, Eye, Brain } from 'lucide-react';

type Difficulty = 'beginner' | 'intermediate' | 'expert';

interface DifficultySelectorProps {
  selected: Difficulty;
  onSelect: (difficulty: Difficulty) => void;
}

const difficulties = [
  {
    value: 'beginner' as Difficulty,
    label: 'CLEARANCE: LEVEL 1',
    codename: 'Observer',
    description: 'Standard forensic evidence. Minimal contradictions. Linear timeline.',
    warnings: ['Limited exposure', 'Recoverable psyche', 'Clear evidence trails'],
    icon: Shield,
    className: 'hover:border-forensic/50 data-[selected=true]:border-forensic data-[selected=true]:bg-forensic/10',
    iconClass: 'text-forensic',
    labelClass: 'text-forensic',
  },
  {
    value: 'intermediate' as Difficulty,
    label: 'CLEARANCE: LEVEL 2',
    codename: 'Investigator',
    description: 'Complex wound analysis. Timeline discrepancies. Partial evidence corruption.',
    warnings: ['Moderate discomfort', 'Ambiguous conclusions', 'Some data missing'],
    icon: Eye,
    className: 'hover:border-warning/50 data-[selected=true]:border-warning data-[selected=true]:bg-warning/10',
    iconClass: 'text-warning',
    labelClass: 'text-warning',
  },
  {
    value: 'expert' as Difficulty,
    label: 'CLEARANCE: LEVEL 3',
    codename: 'Profiler',
    description: 'Deliberately planted evidence. Severe contradictions. Unreliable documentation.',
    warnings: ['Psychological strain', 'No clean answers', 'Trust nothing'],
    icon: Skull,
    className: 'hover:border-blood/50 data-[selected=true]:border-blood data-[selected=true]:bg-blood/10',
    iconClass: 'text-blood',
    labelClass: 'text-blood',
  },
];

export function DifficultySelector({ selected, onSelect }: DifficultySelectorProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {difficulties.map((diff) => {
          const Icon = diff.icon;
          const isSelected = selected === diff.value;
          
          return (
            <button
              key={diff.value}
              onClick={() => onSelect(diff.value)}
              data-selected={isSelected}
              className={cn(
                "p-4 rounded border border-border bg-card text-left transition-all duration-200 relative overflow-hidden group",
                "hover:scale-[1.02] active:scale-[0.98]",
                diff.className
              )}
            >
              {/* Background effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-current opacity-5" />
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <Icon className={cn("w-6 h-6", diff.iconClass)} />
                  {isSelected && (
                    <span className="text-xs font-terminal text-success animate-pulse">SELECTED</span>
                  )}
                </div>
                
                <h3 className={cn("font-typewriter text-sm tracking-wider mb-1", diff.labelClass)}>
                  {diff.label}
                </h3>
                <p className="text-xs text-muted-foreground/70 font-terminal mb-3">
                  Codename: {diff.codename}
                </p>
                
                <p className="text-xs text-muted-foreground font-clinical mb-3">
                  {diff.description}
                </p>

                <div className="space-y-1 pt-2 border-t border-border/50">
                  {diff.warnings.map((warning, index) => (
                    <p key={index} className="text-xs text-muted-foreground/50 flex items-center gap-1">
                      <span className={cn("w-1 h-1 rounded-full", 
                        diff.value === 'beginner' && "bg-forensic",
                        diff.value === 'intermediate' && "bg-warning",
                        diff.value === 'expert' && "bg-blood"
                      )} />
                      {warning}
                    </p>
                  ))}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected level detail */}
      <div className="p-3 bg-background border border-border">
        <div className="flex items-center gap-2 text-xs font-terminal">
          {selected === 'beginner' && (
            <>
              <Lock className="w-3 h-3 text-forensic" />
              <span className="text-muted-foreground">
                Standard access granted. Evidence tampering: <span className="text-forensic">UNLIKELY</span>
              </span>
            </>
          )}
          {selected === 'intermediate' && (
            <>
              <Brain className="w-3 h-3 text-warning" />
              <span className="text-muted-foreground">
                Enhanced access granted. Evidence tampering: <span className="text-warning">POSSIBLE</span>
              </span>
            </>
          )}
          {selected === 'expert' && (
            <>
              <AlertTriangle className="w-3 h-3 text-blood" />
              <span className="text-muted-foreground">
                Full access granted. Evidence tampering: <span className="text-blood">CONFIRMED</span>
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}