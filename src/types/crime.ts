export type Weather = 'clear' | 'rain' | 'fog' | 'storm' | 'snow' | 'humid' | 'freezing';
export type FootprintType = 'shoe' | 'barefoot' | 'multiple' | 'partial' | 'smeared' | 'none';
export type FootprintDirection = 'toward_body' | 'away_from_body' | 'scattered' | 'circular' | 'none';
export type BloodPattern = 'splash' | 'pool' | 'trail' | 'drip' | 'arterial_spray' | 'cast_off' | 'transfer' | 'void' | 'none';
export type BodyPosition = 'face_up' | 'face_down' | 'seated' | 'crouched' | 'fetal' | 'suspended' | 'contorted';
export type WeaponType = 'knife' | 'blunt' | 'firearm' | 'poison' | 'strangulation' | 'sharp_object' | 'chemical' | 'none';
export type CrimeType = 'murder' | 'accident' | 'suicide' | 'undetermined';
export type LocationType = 
  | 'forest' 
  | 'apartment' 
  | 'street' 
  | 'office' 
  | 'factory' 
  | 'hotel' 
  | 'warehouse' 
  | 'parking_lot' 
  | 'rooftop' 
  | 'basement'
  | 'abandoned_hospital'
  | 'sewers'
  | 'construction_site'
  | 'cemetery';

export interface VictimProfile {
  name: string;
  age: number;
  profession: string;
  description?: string;
  lastKnownActivity?: string;
  knownAssociates?: string[];
  financialStatus?: 'stable' | 'debt' | 'wealthy' | 'unknown';
  recentBehavior?: string;
}

export interface WoundEvidence {
  type: 'stab' | 'blunt' | 'gunshot' | 'bruising' | 'ligature' | 'defensive' | 'chemical_burn' | 'bite' | 'scratch';
  location: string;
  description: string;
  forensicNote?: string;
  contradiction?: string;
}

export interface SceneObject {
  name: string;
  condition: string;
  relevance: 'key' | 'supporting' | 'red_herring' | 'contaminated';
  forensicNote?: string;
  hiddenMeaning?: string;
}

export interface SurveillanceEvidence {
  available: boolean;
  description?: string;
  timeGap?: string;
  corruption?: string;
  anomaly?: string;
}

export interface EnvironmentalDamage {
  type: 'broken_glass' | 'overturned_furniture' | 'scorch_marks' | 'water_damage' | 'chemical_residue' | 'biological_matter' | 'none';
  description?: string;
  forensicNote?: string;
}

export interface TimeClue {
  type: 'watch_stopped' | 'last_call' | 'receipt' | 'witness_sighting' | 'security_log' | 'digital_trace' | 'biological_marker';
  time: Date;
  description: string;
  reliability: 'verified' | 'questionable' | 'contradicted';
}

export interface ForensicContradiction {
  evidence1: string;
  evidence2: string;
  explanation: string;
  significance: 'minor' | 'major' | 'critical';
}

export interface HiddenHint {
  location: string;
  hint: string;
  indirectSuggestion: string;
  revealsAfter?: string;
}

export interface DigitalEvidence {
  type: 'phone_logs' | 'deleted_messages' | 'browser_history' | 'gps_data' | 'social_media' | 'financial_records';
  description: string;
  forensicNote?: string;
  partialData?: boolean;
  corrupted?: boolean;
}

export interface BiologicalEvidence {
  type: 'fingerprints' | 'dna' | 'hair' | 'fibers' | 'skin_cells' | 'bodily_fluids';
  description: string;
  quality: 'pristine' | 'partial' | 'contaminated' | 'degraded';
  forensicNote?: string;
  matchStatus?: 'matched' | 'unmatched' | 'inconclusive';
}

export interface EnvironmentalTrace {
  type: 'smell' | 'temperature' | 'humidity' | 'sound_residue' | 'light_patterns';
  description: string;
  forensicSignificance: string;
}

export interface Evidence {
  timeOfDeath: Date;
  weather: Weather;
  footprintType: FootprintType;
  footprintDirection: FootprintDirection;
  bloodPattern: BloodPattern;
  bodyPosition?: BodyPosition;
  weaponFound?: WeaponType;
  wounds?: WoundEvidence[];
  sceneObjects?: SceneObject[];
  surveillance?: SurveillanceEvidence;
  environmentalDamage?: EnvironmentalDamage;
  timeClues?: TimeClue[];
  additionalClues?: string[];
  digitalEvidence?: DigitalEvidence[];
  biologicalEvidence?: BiologicalEvidence[];
  environmentalTrace?: EnvironmentalTrace[];
  contradictions?: ForensicContradiction[];
}

export interface HiddenSolution {
  causeOfDeath: string[];
  estimatedTimeOfDeath: Date;
  crimeType: CrimeType;
  victimMovement: string;
  isStaged: boolean;
  suspectDirection: string;
  isIndoor: boolean;
  fullReconstruction: string;
  hiddenHints: HiddenHint[];
  trueNarrative: string;
}

export interface UserReconstruction {
  causeOfDeath: string;
  timeline: string;
  suspectDirection: 'entered_and_left' | 'entered_only' | 'left_only' | 'unknown';
  isStaged: boolean;
  isIndoor: boolean;
  crimeType?: CrimeType;
}

export interface ValidationResult {
  score: number;
  verdict: 'consistent' | 'partial' | 'illogical';
  correctDeductions: string[];
  incorrectDeductions: string[];
  missingReasoning: string[];
  officialReconstruction: string;
}

export interface CrimeCase {
  id: string;
  title: string;
  difficulty: 'beginner' | 'intermediate' | 'expert';
  location: LocationType;
  storyIntro: string;
  victim: VictimProfile;
  evidence: Evidence;
  hiddenSolution: HiddenSolution;
  redHerrings?: string[];
  investigatorNotes?: string[];
  warningFlags?: string[];
}
