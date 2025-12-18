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
  Activity,
  FileWarning,
  Eye,
  HelpCircle
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
  shoe: 'Shoe Impressions Detected',
  barefoot: 'Barefoot Impressions',
  multiple: 'Multiple Overlapping Sets',
  none: 'No Visible Impressions',
};

const directionLabels: Record<string, string> = {
  toward_body: 'Direction: Toward Remains',
  away_from_body: 'Direction: Away from Remains',
  scattered: 'Pattern: Erratic/Scattered',
  none: 'Direction: Indeterminate',
};

const bloodLabels: Record<string, string> = {
  splash: 'High-Velocity Impact Spatter',
  pool: 'Gravitational Blood Pooling',
  trail: 'Transfer Pattern / Blood Trail',
  drip: 'Passive Drip Pattern',
  none: 'No Blood Evidence Recovered',
};

const bodyLabels: Record<string, string> = {
  face_up: 'Supine Position (Face Up)',
  face_down: 'Prone Position (Face Down)',
  seated: 'Seated / Propped Position',
  crouched: 'Fetal / Defensive Posture',
};

const weaponLabels: Record<string, string> = {
  knife: 'Edged Weapon (Knife Class)',
  blunt: 'Blunt Force Instrument',
  firearm: 'Projectile Weapon',
  poison: 'Toxicological Suspicion',
  strangulation: 'Ligature / Compression Marks',
  none: 'No Weapon Recovered',
};

const environmentalLabels: Record<string, string> = {
  broken_glass: 'Shattered Glass Fragments',
  overturned_furniture: 'Displaced Furnishings',
  scorch_marks: 'Thermal Damage Present',
  water_damage: 'Fluid Contamination',
  none: 'Scene Environmentally Intact',
};

export function EvidencePanel({ crimeCase }: EvidencePanelProps) {
  const { evidence, redHerrings, difficulty } = crimeCase;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <div className="h-px flex-1 bg-border" />
        <h2 className="font-typewriter text-lg text-blood px-4 tracking-wider">
          FORENSIC EVIDENCE LOG
        </h2>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* Evidence Warning */}
      <div className="p-3 bg-background border border-border text-xs font-terminal text-muted-foreground mb-4">
        <p className="flex items-start gap-2">
          <FileWarning className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
          <span>
            Evidence integrity: <span className={cn(
              difficulty === 'beginner' && "text-forensic",
              difficulty === 'intermediate' && "text-warning",
              difficulty === 'expert' && "text-blood"
            )}>
              {difficulty === 'beginner' && 'STANDARD'}
              {difficulty === 'intermediate' && 'COMPROMISED'}
              {difficulty === 'expert' && 'UNRELIABLE'}
            </span>
            . Cross-reference all findings. Trust nothing at face value.
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <EvidenceCard
          icon={<Clock className="w-5 h-5" />}
          title="ESTIMATED TIME OF DEATH"
          value={evidence.timeOfDeath.toLocaleString()}
          description="Based on liver temperature, rigor mortis progression"
          note="± 2 hours margin of error. Environmental factors may skew readings."
        />
        
        <EvidenceCard
          icon={<Cloud className="w-5 h-5" />}
          title="ATMOSPHERIC CONDITIONS"
          value={weatherLabels[evidence.weather]}
          description="At time of body discovery"
          note="Weather may have altered or destroyed trace evidence."
        />
        
        <EvidenceCard
          icon={<Footprints className="w-5 h-5" />}
          title="FOOTPRINT ANALYSIS"
          value={footprintLabels[evidence.footprintType]}
          description={directionLabels[evidence.footprintDirection]}
          note="Partial impressions only. Some may belong to first responders."
        />
        
        <EvidenceCard
          icon={<Droplets className="w-5 h-5" />}
          title="BLOOD PATTERN ANALYSIS"
          value={bloodLabels[evidence.bloodPattern]}
          description="Primary spatter classification"
          note="Pattern may not correspond to lethal wound. Secondary sources possible."
        />

        {evidence.bodyPosition && (
          <EvidenceCard
            icon={<User className="w-5 h-5" />}
            title="BODY POSITIONING"
            value={bodyLabels[evidence.bodyPosition]}
            description="As documented at scene"
            note="Position may have been altered post-mortem. Lividity patterns under review."
          />
        )}

        {evidence.weaponFound && (
          <EvidenceCard
            icon={<Sword className="w-5 h-5" />}
            title="WEAPON RECOVERED"
            value={weaponLabels[evidence.weaponFound]}
            description="Tagged as potential instrument"
            note="Weapon presence does not confirm use. Fingerprint analysis pending."
          />
        )}

        {evidence.surveillance && evidence.surveillance.available && (
          <EvidenceCard
            icon={<Camera className="w-5 h-5" />}
            title="SURVEILLANCE DATA"
            value={evidence.surveillance.corruption ? "FOOTAGE CORRUPTED" : "FOOTAGE AVAILABLE"}
            description={evidence.surveillance.description || 'Under analysis'}
            note={evidence.surveillance.corruption 
              ? "Data recovery in progress. Gaps may be intentional." 
              : "Timestamp accuracy unverified. Footage may be incomplete."}
          />
        )}

        {evidence.environmentalDamage && evidence.environmentalDamage.type !== 'none' && (
          <EvidenceCard
            icon={<Flame className="w-5 h-5" />}
            title="ENVIRONMENTAL DAMAGE"
            value={environmentalLabels[evidence.environmentalDamage.type]}
            description={evidence.environmentalDamage.description}
            note="Damage may be staged. Assess relationship to timeline."
          />
        )}
      </div>

      {/* Wounds Section */}
      {evidence.wounds && evidence.wounds.length > 0 && (
        <div className="mt-4 p-4 bg-blood/5 border border-blood/30">
          <div className="flex items-center gap-2 text-blood mb-3">
            <Activity className="w-4 h-4" />
            <span className="font-typewriter text-sm tracking-wider">WOUND DOCUMENTATION</span>
          </div>
          <div className="space-y-3">
            {evidence.wounds.map((wound, index) => (
              <div key={index} className="p-3 bg-background border border-border">
                <div className="flex items-start justify-between mb-1">
                  <span className="text-foreground font-typewriter text-sm capitalize">
                    {wound.type.replace('_', ' ')} Trauma
                  </span>
                  <span className="text-xs font-terminal text-muted-foreground">
                    WOUND #{index + 1}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  <span className="text-foreground">Location:</span> {wound.location}
                </p>
                <p className="text-sm text-muted-foreground italic mt-1">
                  {wound.description}
                </p>
                {wound.forensicNote && (
                  <p className="text-xs text-warning/70 mt-2 flex items-start gap-1">
                    <HelpCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                    {wound.forensicNote}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scene Objects */}
      {evidence.sceneObjects && evidence.sceneObjects.length > 0 && (
        <div className="mt-4 p-4 bg-card border border-border">
          <div className="flex items-center gap-2 text-foreground mb-3">
            <Package className="w-4 h-4 text-muted-foreground" />
            <span className="font-typewriter text-sm tracking-wider">CATALOGUED OBJECTS</span>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {evidence.sceneObjects.map((obj, index) => (
              <div key={index} className="p-2 bg-background border border-border flex items-start justify-between">
                <div>
                  <span className="text-foreground font-typewriter text-sm">{obj.name}</span>
                  <span className="text-muted-foreground text-xs ml-2">— {obj.condition}</span>
                  {obj.relevance && (
                    <p className="text-xs text-muted-foreground/70 mt-1">{obj.relevance}</p>
                  )}
                </div>
                <Eye className="w-3 h-3 text-muted-foreground/30" />
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground/50 font-terminal mt-3">
            Note: Some objects may have been introduced after the incident.
          </p>
        </div>
      )}

      {/* Time Clues */}
      {evidence.timeClues && evidence.timeClues.length > 0 && (
        <div className="mt-4 p-4 bg-background border border-border">
          <div className="flex items-center gap-2 text-foreground mb-3">
            <Timer className="w-4 h-4 text-muted-foreground" />
            <span className="font-typewriter text-sm tracking-wider">TEMPORAL INDICATORS</span>
          </div>
          <div className="space-y-2">
            {evidence.timeClues.map((clue, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-card border border-border">
                <span className="text-sm text-muted-foreground">{clue.description}</span>
                <span className="text-foreground font-terminal text-xs bg-background px-2 py-1 border border-border">
                  {clue.time.toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-warning/60 font-terminal mt-3 flex items-start gap-1">
            <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5" />
            Timeline inconsistencies detected. Verify against witness statements.
          </p>
        </div>
      )}

      {/* Red Herrings / Additional Findings */}
      {redHerrings && redHerrings.length > 0 && (
        <div className="mt-4 p-4 bg-warning/5 border border-warning/30">
          <div className="flex items-center gap-2 text-warning mb-2">
            <AlertTriangle className="w-4 h-4" />
            <span className="font-typewriter text-sm tracking-wider">ANOMALOUS FINDINGS</span>
          </div>
          <p className="text-xs text-muted-foreground/70 mb-3">
            The following observations do not fit established patterns. Relevance: Unknown.
          </p>
          <ul className="space-y-2">
            {redHerrings.map((clue, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground p-2 bg-background border border-border">
                <span className="w-1.5 h-1.5 bg-warning rounded-full mt-2 flex-shrink-0" />
                <span>{clue}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Classification Footer */}
      <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
        <span className={cn(
          "inline-block px-3 py-1 rounded text-xs font-typewriter uppercase tracking-wider border",
          difficulty === 'beginner' && "bg-forensic/10 text-forensic border-forensic/30",
          difficulty === 'intermediate' && "bg-warning/10 text-warning border-warning/30",
          difficulty === 'expert' && "bg-blood/10 text-blood border-blood/30",
        )}>
          CLEARANCE: {difficulty.toUpperCase()}
        </span>
        <span className="text-xs text-muted-foreground/50 font-terminal">
          Evidence subject to reinterpretation
        </span>
      </div>
    </div>
  );
}