import { VictimProfile as VictimProfileType } from '@/types/crime';
import { User, Briefcase, Calendar } from 'lucide-react';

interface VictimProfileProps {
  victim: VictimProfileType;
}

export function VictimProfile({ victim }: VictimProfileProps) {
  return (
    <div className="p-4 bg-card/50 border border-border rounded-lg">
      <div className="flex items-center gap-2 mb-3 text-destructive">
        <User className="w-4 h-4" />
        <span className="text-xs uppercase tracking-wider font-semibold">Victim Profile</span>
      </div>
      
      <div className="space-y-2">
        <h3 className="font-typewriter text-lg text-foreground">{victim.name}</h3>
        
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {victim.age} years old
          </span>
          <span className="flex items-center gap-1">
            <Briefcase className="w-3 h-3" />
            {victim.profession}
          </span>
        </div>
      </div>
    </div>
  );
}
