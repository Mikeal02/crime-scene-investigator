export type Weather = 'clear' | 'rain' | 'fog' | 'storm' | 'snow';
export type FootprintType = 'shoe' | 'barefoot' | 'multiple' | 'none';
export type FootprintDirection = 'toward_body' | 'away_from_body' | 'scattered' | 'none';
export type BloodPattern = 'splash' | 'pool' | 'trail' | 'drip' | 'none';
export type BodyPosition = 'face_up' | 'face_down' | 'seated' | 'crouched';
export type WeaponType = 'knife' | 'blunt' | 'firearm' | 'poison' | 'strangulation' | 'none';
export type CrimeType = 'murder' | 'accident' | 'suicide';
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
  | 'basement';

export interface VictimProfile {
  name: string;
  age: number;
  profession: string;
  description?: string;
}

export interface WoundEvidence {
  type: 'stab' | 'blunt' | 'gunshot' | 'bruising' | 'ligature' | 'defensive';
  location: string;
  description: string;
}

export interface SceneObject {
  name: string;
  condition: string;
  relevance: 'key' | 'supporting' | 'red_herring';
}

export interface SurveillanceEvidence {
  available: boolean;
  description?: string;
  timeGap?: string;
}

export interface EnvironmentalDamage {
  type: 'broken_glass' | 'overturned_furniture' | 'scorch_marks' | 'water_damage' | 'none';
  description?: string;
}

export interface TimeClue {
  type: 'watch_stopped' | 'last_call' | 'receipt' | 'witness_sighting' | 'security_log';
  time: Date;
  description: string;
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
}
