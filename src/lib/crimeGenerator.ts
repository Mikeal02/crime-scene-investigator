import { CrimeCase, Weather, FootprintType, FootprintDirection, BloodPattern, BodyPosition, WeaponType } from '@/types/crime';

const caseTitles = [
  'The Midnight Manor Mystery',
  'Death at Dawn',
  'The Foggy Alley Case',
  'Storm Night Slaying',
  'The Silent Witness',
  'Cold Trail Murder',
  'The Vanishing Act',
  'Shadows in the Park',
  'The Warehouse Incident',
  'Rainy Night Revenge',
];

const weathers: Weather[] = ['clear', 'rain', 'fog', 'storm', 'snow'];
const footprintTypes: FootprintType[] = ['shoe', 'barefoot', 'multiple', 'none'];
const footprintDirections: FootprintDirection[] = ['toward_body', 'away_from_body', 'scattered', 'none'];
const bloodPatterns: BloodPattern[] = ['splash', 'pool', 'trail', 'drip', 'none'];
const bodyPositions: BodyPosition[] = ['face_up', 'face_down', 'seated', 'crouched'];
const weaponTypes: WeaponType[] = ['knife', 'blunt', 'firearm', 'poison', 'strangulation', 'none'];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateTimeOfDeath(): Date {
  const now = new Date();
  const hoursAgo = Math.floor(Math.random() * 48) + 1;
  return new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
}

export function generateCrimeCase(difficulty: 'beginner' | 'intermediate' | 'expert' = 'beginner'): CrimeCase {
  const weather = randomFrom(weathers);
  const footprintType = randomFrom(footprintTypes);
  const footprintDirection: FootprintDirection = footprintType === 'none' ? 'none' : randomFrom(footprintDirections.filter(d => d !== 'none') as FootprintDirection[]);
  const bloodPattern = randomFrom(bloodPatterns);
  
  // Determine if indoor based on evidence
  const isIndoor = weather === 'rain' || weather === 'storm' || weather === 'snow' 
    ? (footprintType !== 'none' && bloodPattern !== 'none') 
    : Math.random() > 0.5;

  // Determine staging based on contradictions
  const hasContradiction = (weather === 'rain' && footprintType === 'barefoot' && !isIndoor) ||
    (bloodPattern === 'pool' && footprintType === 'multiple' && footprintDirection === 'scattered');
  const isStaged = hasContradiction || Math.random() > 0.7;

  // Determine cause of death based on weapon/blood
  let causeOfDeath: string[] = [];
  let weaponFound: WeaponType | undefined;
  
  if (difficulty !== 'beginner') {
    weaponFound = randomFrom(weaponTypes);
  }

  if (weaponFound === 'knife' || bloodPattern === 'splash' || bloodPattern === 'trail') {
    causeOfDeath = ['stabbing', 'sharp force trauma'];
  } else if (weaponFound === 'blunt' || bloodPattern === 'pool') {
    causeOfDeath = ['blunt force trauma', 'head injury'];
  } else if (weaponFound === 'firearm') {
    causeOfDeath = ['gunshot wound', 'shooting'];
  } else if (weaponFound === 'poison') {
    causeOfDeath = ['poisoning', 'toxicity'];
  } else if (weaponFound === 'strangulation' || bloodPattern === 'none') {
    causeOfDeath = ['strangulation', 'asphyxiation', 'suffocation'];
  } else {
    causeOfDeath = ['unknown trauma', 'undetermined'];
  }

  // Determine suspect direction
  let suspectDirection: string;
  if (footprintDirection === 'toward_body') {
    suspectDirection = 'entered_only';
  } else if (footprintDirection === 'away_from_body') {
    suspectDirection = 'left_only';
  } else if (footprintType === 'multiple' || footprintDirection === 'scattered') {
    suspectDirection = 'entered_and_left';
  } else {
    suspectDirection = 'unknown';
  }

  const evidence = {
    timeOfDeath: generateTimeOfDeath(),
    weather,
    footprintType,
    footprintDirection,
    bloodPattern,
    ...(difficulty !== 'beginner' && { bodyPosition: randomFrom(bodyPositions) }),
    ...(difficulty !== 'beginner' && { weaponFound }),
  };

  const redHerrings = difficulty === 'expert' ? [
    'A torn piece of fabric was found nearby',
    'Cigarette butts were discovered at the scene',
    'A mysterious phone number was written on a napkin',
  ].slice(0, Math.floor(Math.random() * 3) + 1) : undefined;

  return {
    id: `case-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title: randomFrom(caseTitles),
    difficulty,
    evidence,
    correctAnswers: {
      causeOfDeath,
      suspectDirection,
      isStaged,
      isIndoor,
    },
    redHerrings,
  };
}
