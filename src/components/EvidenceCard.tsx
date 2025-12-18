import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { AlertTriangle } from 'lucide-react';

interface EvidenceCardProps {
  icon: ReactNode;
  title: string;
  value: string;
  description?: string;
  note?: string;
  className?: string;
}

export function EvidenceCard({ icon, title, value, description, note, className }: EvidenceCardProps) {
  return (
    <div className={cn(
      "evidence-card group cursor-default animate-fade-in",
      className
    )}>
      <div className="flex items-start gap-3">
        <div className="p-2 rounded bg-blood/10 text-blood group-hover:bg-blood/20 transition-colors">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1 font-typewriter">
            {title}
          </p>
          <p className="font-semibold text-foreground truncate font-clinical">
            {value}
          </p>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">
              {description}
            </p>
          )}
          {note && (
            <p className="text-xs text-warning/60 mt-2 flex items-start gap-1 italic">
              <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5" />
              {note}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}