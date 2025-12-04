export type Weather = 'clear' | 'rain' | 'fog' | 'storm' | 'snow';
export type FootprintType = 'shoe' | 'barefoot' | 'multiple' | 'none';
export type FootprintDirection = 'toward_body' | 'away_from_body' | 'scattered' | 'none';
export type BloodPattern = 'splash' | 'pool' | 'trail' | 'drip' | 'none';
export type BodyPosition = 'face_up' | 'face_down' | 'seated' | 'crouched';
export type WeaponType = 'knife' | 'blunt' | 'firearm' | 'poison' | 'strangulation' | 'none';

export interface Evidence {
  timeOfDeath: Date;
  weather: Weather;
  footprintType: FootprintType;
  footprintDirection: FootprintDirection;
  bloodPattern: BloodPattern;
  bodyPosition?: BodyPosition;
  weaponFound?: WeaponType;
  additionalClues?: string[];
}

export interface UserReconstruction {
  causeOfDeath: string;
  timeline: string;
  suspectDirection: 'entered_and_left' | 'entered_only' | 'left_only' | 'unknown';
  isStaged: boolean;
  isIndoor: boolean;
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
  evidence: Evidence;
  correctAnswers: {
    causeOfDeath: string[];
    suspectDirection: string;
    isStaged: boolean;
    isIndoor: boolean;
  };
  redHerrings?: string[];
}
