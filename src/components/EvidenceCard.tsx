import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface EvidenceCardProps {
  icon: ReactNode;
  title: string;
  value: string;
  description?: string;
  className?: string;
}

export function EvidenceCard({ icon, title, value, description, className }: EvidenceCardProps) {
  return (
    <div className={cn(
      "evidence-card group cursor-default animate-fade-in",
      className
    )}>
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
            {title}
          </p>
          <p className="font-semibold text-foreground truncate">
            {value}
          </p>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
