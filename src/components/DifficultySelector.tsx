import { cn } from '@/lib/utils';
import { Shield, Star, Skull } from 'lucide-react';

type Difficulty = 'beginner' | 'intermediate' | 'expert';

interface DifficultySelectorProps {
  selected: Difficulty;
  onSelect: (difficulty: Difficulty) => void;
}

const difficulties = [
  {
    value: 'beginner' as Difficulty,
    label: 'Rookie',
    description: 'Basic evidence analysis',
    icon: Shield,
    className: 'hover:border-success/50 data-[selected=true]:border-success data-[selected=true]:bg-success/10',
    iconClass: 'text-success',
  },
  {
    value: 'intermediate' as Difficulty,
    label: 'Detective',
    description: 'Includes weapons & body position',
    icon: Star,
    className: 'hover:border-warning/50 data-[selected=true]:border-warning data-[selected=true]:bg-warning/10',
    iconClass: 'text-warning',
  },
  {
    value: 'expert' as Difficulty,
    label: 'Senior Investigator',
    description: 'Red herrings & misleading clues',
    icon: Skull,
    className: 'hover:border-destructive/50 data-[selected=true]:border-destructive data-[selected=true]:bg-destructive/10',
    iconClass: 'text-destructive',
  },
];

export function DifficultySelector({ selected, onSelect }: DifficultySelectorProps) {
  return (
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
              "p-4 rounded-lg border border-border bg-card text-left transition-all duration-200",
              "hover:scale-[1.02] active:scale-[0.98]",
              diff.className
            )}
          >
            <Icon className={cn("w-6 h-6 mb-2", diff.iconClass)} />
            <h3 className="font-semibold text-foreground">{diff.label}</h3>
            <p className="text-xs text-muted-foreground mt-1">{diff.description}</p>
          </button>
        );
      })}
    </div>
  );
}
