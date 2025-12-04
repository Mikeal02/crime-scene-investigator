import { CrimeCase } from '@/types/crime';
import { EvidenceCard } from './EvidenceCard';
import { 
  Clock, 
  Cloud, 
  Footprints, 
  Droplets, 
  User, 
  Sword,
  AlertTriangle
} from 'lucide-react';

interface EvidencePanelProps {
  crimeCase: CrimeCase;
}

const weatherLabels: Record<string, string> = {
  clear: 'Clear Sky',
  rain: 'Heavy Rain',
  fog: 'Dense Fog',
  storm: 'Thunderstorm',
  snow: 'Snowfall',
};

const footprintLabels: Record<string, string> = {
  shoe: 'Shoe Prints',
  barefoot: 'Barefoot',
  multiple: 'Multiple Sets',
  none: 'No Prints Found',
};

const directionLabels: Record<string, string> = {
  toward_body: 'Leading Toward Body',
  away_from_body: 'Leading Away from Body',
  scattered: 'Scattered Pattern',
  none: 'N/A',
};

const bloodLabels: Record<string, string> = {
  splash: 'High-Velocity Splash',
  pool: 'Blood Pool',
  trail: 'Blood Trail',
  drip: 'Drip Pattern',
  none: 'No Blood Present',
};

const bodyLabels: Record<string, string> = {
  face_up: 'Supine (Face Up)',
  face_down: 'Prone (Face Down)',
  seated: 'Seated Position',
  crouched: 'Crouched/Fetal',
};

const weaponLabels: Record<string, string> = {
  knife: 'Knife/Sharp Object',
  blunt: 'Blunt Instrument',
  firearm: 'Firearm',
  poison: 'Suspected Poison',
  strangulation: 'Ligature Marks',
  none: 'No Weapon Found',
};

export function EvidencePanel({ crimeCase }: EvidencePanelProps) {
  const { evidence, redHerrings, difficulty } = crimeCase;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <div className="h-px flex-1 bg-border" />
        <h2 className="font-typewriter text-lg text-primary px-4">EVIDENCE COLLECTED</h2>
        <div className="h-px flex-1 bg-border" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <EvidenceCard
          icon={<Clock className="w-5 h-5" />}
          title="Time of Death"
          value={evidence.timeOfDeath.toLocaleString()}
          description="Estimated based on body temperature"
        />
        
        <EvidenceCard
          icon={<Cloud className="w-5 h-5" />}
          title="Weather Conditions"
          value={weatherLabels[evidence.weather]}
          description="At time of discovery"
        />
        
        <EvidenceCard
          icon={<Footprints className="w-5 h-5" />}
          title="Footprint Evidence"
          value={footprintLabels[evidence.footprintType]}
          description={directionLabels[evidence.footprintDirection]}
        />
        
        <EvidenceCard
          icon={<Droplets className="w-5 h-5" />}
          title="Blood Pattern"
          value={bloodLabels[evidence.bloodPattern]}
          description="Analyzed by forensic team"
        />

        {evidence.bodyPosition && (
          <EvidenceCard
            icon={<User className="w-5 h-5" />}
            title="Body Position"
            value={bodyLabels[evidence.bodyPosition]}
            description="As found at scene"
          />
        )}

        {evidence.weaponFound && (
          <EvidenceCard
            icon={<Sword className="w-5 h-5" />}
            title="Weapon Found"
            value={weaponLabels[evidence.weaponFound]}
            description="Recovered at crime scene"
          />
        )}
      </div>

      {redHerrings && redHerrings.length > 0 && (
        <div className="mt-6 p-4 bg-warning/10 border border-warning/30 rounded-lg">
          <div className="flex items-center gap-2 text-warning mb-2">
            <AlertTriangle className="w-4 h-4" />
            <span className="font-semibold text-sm">Additional Findings</span>
          </div>
          <ul className="text-sm text-muted-foreground space-y-1">
            {redHerrings.map((clue, index) => (
              <li key={index} className="flex items-center gap-2">
                <span className="w-1 h-1 bg-warning rounded-full" />
                {clue}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 text-center">
        <span className={cn(
          "inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider",
          difficulty === 'beginner' && "bg-success/20 text-success",
          difficulty === 'intermediate' && "bg-warning/20 text-warning",
          difficulty === 'expert' && "bg-destructive/20 text-destructive",
        )}>
          {difficulty} Case
        </span>
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
