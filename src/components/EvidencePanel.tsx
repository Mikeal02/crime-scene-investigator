import { CrimeCase } from '@/types/crime';
import { EvidenceCard } from './EvidenceCard';
import { 
  Clock, 
  Cloud, 
  Footprints, 
  Droplets, 
  User, 
  Sword,
  AlertTriangle,
  Camera,
  Package,
  Flame,
  Timer,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

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

const environmentalLabels: Record<string, string> = {
  broken_glass: 'Broken Glass',
  overturned_furniture: 'Overturned Furniture',
  scorch_marks: 'Scorch Marks',
  water_damage: 'Water Damage',
  none: 'None Detected',
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

        {evidence.surveillance && evidence.surveillance.available && (
          <EvidenceCard
            icon={<Camera className="w-5 h-5" />}
            title="Surveillance"
            value="Footage Available"
            description={evidence.surveillance.description || 'Under review'}
          />
        )}

        {evidence.environmentalDamage && evidence.environmentalDamage.type !== 'none' && (
          <EvidenceCard
            icon={<Flame className="w-5 h-5" />}
            title="Environmental Damage"
            value={environmentalLabels[evidence.environmentalDamage.type]}
            description={evidence.environmentalDamage.description}
          />
        )}
      </div>

      {/* Wounds Section */}
      {evidence.wounds && evidence.wounds.length > 0 && (
        <div className="mt-4 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
          <div className="flex items-center gap-2 text-destructive mb-3">
            <Activity className="w-4 h-4" />
            <span className="font-semibold text-sm">Wound Analysis</span>
          </div>
          <div className="space-y-2">
            {evidence.wounds.map((wound, index) => (
              <div key={index} className="text-sm">
                <span className="text-foreground font-medium capitalize">{wound.type.replace('_', ' ')} wound</span>
                <span className="text-muted-foreground"> - {wound.location}: </span>
                <span className="text-muted-foreground italic">{wound.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scene Objects */}
      {evidence.sceneObjects && evidence.sceneObjects.length > 0 && (
        <div className="mt-4 p-4 bg-primary/10 border border-primary/30 rounded-lg">
          <div className="flex items-center gap-2 text-primary mb-3">
            <Package className="w-4 h-4" />
            <span className="font-semibold text-sm">Objects at Scene</span>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {evidence.sceneObjects.map((obj, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                <span className="text-foreground font-medium">{obj.name}</span>
                <span className="text-muted-foreground">- {obj.condition}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Time Clues */}
      {evidence.timeClues && evidence.timeClues.length > 0 && (
        <div className="mt-4 p-4 bg-muted/50 border border-border rounded-lg">
          <div className="flex items-center gap-2 text-foreground mb-3">
            <Timer className="w-4 h-4" />
            <span className="font-semibold text-sm">Time-Related Clues</span>
          </div>
          <div className="space-y-2">
            {evidence.timeClues.map((clue, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{clue.description}</span>
                <span className="text-foreground font-mono text-xs bg-background px-2 py-1 rounded">
                  {clue.time.toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Red Herrings */}
      {redHerrings && redHerrings.length > 0 && (
        <div className="mt-4 p-4 bg-warning/10 border border-warning/30 rounded-lg">
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
