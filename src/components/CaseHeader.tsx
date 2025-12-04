import { CrimeCase } from '@/types/crime';
import { Badge } from '@/components/ui/badge';
import { Shield, Calendar, MapPin } from 'lucide-react';

interface CaseHeaderProps {
  crimeCase: CrimeCase;
}

export function CaseHeader({ crimeCase }: CaseHeaderProps) {
  const difficultyColors = {
    beginner: 'bg-success/20 text-success border-success/30',
    intermediate: 'bg-warning/20 text-warning border-warning/30',
    expert: 'bg-destructive/20 text-destructive border-destructive/30',
  };

  return (
    <div className="relative overflow-hidden">
      {/* Crime tape decoration */}
      <div className="absolute top-0 left-0 right-0 h-2 crime-tape opacity-60" />
      
      <div className="pt-6 pb-4">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Shield className="w-4 h-4 text-primary" />
              <span>Case File #{crimeCase.id.slice(-8).toUpperCase()}</span>
            </div>
            <h1 className="font-typewriter text-2xl md:text-3xl text-foreground">
              {crimeCase.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {crimeCase.evidence.timeOfDeath.toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                Crime Scene Alpha
              </span>
            </div>
          </div>
          
          <Badge 
            variant="outline" 
            className={`${difficultyColors[crimeCase.difficulty]} uppercase tracking-wider font-semibold`}
          >
            {crimeCase.difficulty}
          </Badge>
        </div>
      </div>
      
      {/* Bottom border */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
    </div>
  );
}
