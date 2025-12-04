import { 
  CrimeCase, 
  Weather, 
  FootprintType, 
  FootprintDirection, 
  BloodPattern, 
  BodyPosition, 
  WeaponType,
  LocationType,
  CrimeType,
  VictimProfile,
  WoundEvidence,
  SceneObject,
  SurveillanceEvidence,
  EnvironmentalDamage,
  TimeClue,
  HiddenSolution
} from '@/types/crime';

// Data pools for random generation
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
  'The Last Message',
  'Crimson Evidence',
  'The Forgotten Room',
  'Echoes of Violence',
];

const locations: LocationType[] = ['forest', 'apartment', 'street', 'office', 'factory', 'hotel', 'warehouse', 'parking_lot', 'rooftop', 'basement'];
const weathers: Weather[] = ['clear', 'rain', 'fog', 'storm', 'snow'];
const footprintTypes: FootprintType[] = ['shoe', 'barefoot', 'multiple', 'none'];
const footprintDirections: FootprintDirection[] = ['toward_body', 'away_from_body', 'scattered', 'none'];
const bloodPatterns: BloodPattern[] = ['splash', 'pool', 'trail', 'drip', 'none'];
const bodyPositions: BodyPosition[] = ['face_up', 'face_down', 'seated', 'crouched'];
const weaponTypes: WeaponType[] = ['knife', 'blunt', 'firearm', 'poison', 'strangulation', 'none'];
const crimeTypes: CrimeType[] = ['murder', 'accident', 'suicide'];

// Victim data pools
const firstNames = ['James', 'Maria', 'Robert', 'Elena', 'William', 'Sophie', 'Michael', 'Anna', 'David', 'Clara', 'Thomas', 'Victoria', 'Richard', 'Emma', 'Charles', 'Isabella'];
const lastNames = ['Anderson', 'Martinez', 'Thompson', 'Volkov', 'Harrison', 'Chen', 'Williams', 'Petrov', 'Moore', 'Kim', 'Taylor', 'Singh', 'Brown', 'Yamamoto', 'Davis', 'Mueller'];
const professions = [
  'Accountant', 'Software Developer', 'Lawyer', 'Doctor', 'Business Owner', 
  'Journalist', 'Banker', 'Real Estate Agent', 'Restaurant Owner', 'Professor',
  'Artist', 'Architect', 'Stock Broker', 'Private Investigator', 'Politician',
  'Pharmaceutical Rep', 'Insurance Agent', 'Construction Manager'
];

// Story intro templates
const storyIntroTemplates: Record<LocationType, string[]> = {
  forest: [
    "A hiker discovered the body deep in Blackwood Forest, hidden beneath fallen leaves. The victim appears to have been moved here.",
    "Park rangers found the scene at dawn, disturbed only by wildlife. The isolation suggests premeditation.",
  ],
  apartment: [
    "Neighbors reported a strange smell coming from Unit 4B. The door was found unlocked, revealing a grim scene inside.",
    "A welfare check led officers to this third-floor apartment. The victim lived alone, and no forced entry was detected.",
  ],
  street: [
    "The body was found in an alley behind Main Street at 3:47 AM. Security cameras in the area may hold crucial evidence.",
    "A sanitation worker made the gruesome discovery at the corner of Oak and 5th. The street was unusually quiet.",
  ],
  office: [
    "The cleaning crew found the victim slumped at their desk after hours. The office had been closed for the weekend.",
    "Security was alerted when the victim's access card was used at an unusual hour. They found more than they expected.",
  ],
  factory: [
    "Night shift workers discovered the body near the assembly line. The industrial setting complicates evidence collection.",
    "The abandoned section of the plant became a crime scene. The victim shouldn't have been there at all.",
  ],
  hotel: [
    "Room 217 was flagged when the guest missed checkout. What housekeeping found will haunt them forever.",
    "The luxury hotel's reputation now hangs in the balance. A VIP guest was found dead in the penthouse suite.",
  ],
  warehouse: [
    "An anonymous tip led police to this abandoned warehouse. The scene suggests the victim was held here before death.",
    "During a routine inspection, inspectors stumbled upon evidence of something far more sinister than code violations.",
  ],
  parking_lot: [
    "The victim's car was still running when discovered at 2 AM. The underground lot's dim lighting obscured much of the scene.",
    "Security footage shows the victim entering the lot but never leaving. Their body was found between parked vehicles.",
  ],
  rooftop: [
    "Building maintenance found the body on the roof after noticing the access door had been forced open.",
    "A drone operator filming the cityscape captured footage of something disturbing on this high-rise rooftop.",
  ],
  basement: [
    "Water damage led contractors to the basement, where they uncovered more than plumbing issues.",
    "The smell had been growing for days. When the building super finally checked, the basement revealed its dark secret.",
  ],
};

// Scene objects by location
const sceneObjectsByLocation: Record<LocationType, SceneObject[]> = {
  forest: [
    { name: 'Broken tree branch', condition: 'Recently snapped', relevance: 'supporting' },
    { name: 'Cigarette butt', condition: 'Fresh, unweathered', relevance: 'key' },
    { name: 'Animal tracks', condition: 'Overlapping human prints', relevance: 'red_herring' },
    { name: 'Torn fabric on bramble', condition: 'Dark colored cloth', relevance: 'supporting' },
    { name: 'Empty water bottle', condition: 'Fingerprints visible', relevance: 'key' },
  ],
  apartment: [
    { name: 'Overturned coffee table', condition: 'Signs of struggle', relevance: 'key' },
    { name: 'Uneaten dinner', condition: 'Food still on plate', relevance: 'supporting' },
    { name: 'Open laptop', condition: 'Screen still on', relevance: 'key' },
    { name: 'Unlocked phone', condition: 'Last message visible', relevance: 'key' },
    { name: 'Window left open', condition: 'Curtains disturbed', relevance: 'supporting' },
  ],
  street: [
    { name: 'Broken street light', condition: 'Recently damaged', relevance: 'supporting' },
    { name: 'Dropped wallet', condition: 'Cash still inside', relevance: 'key' },
    { name: 'Security camera', condition: 'Positioned toward scene', relevance: 'key' },
    { name: 'Dumpster nearby', condition: 'Lid partially open', relevance: 'supporting' },
    { name: 'Graffiti on wall', condition: 'Fresh paint', relevance: 'red_herring' },
  ],
  office: [
    { name: 'Desktop computer', condition: 'Files recently accessed', relevance: 'key' },
    { name: 'Spilled coffee', condition: 'Cold, dried', relevance: 'supporting' },
    { name: 'Visitor badge', condition: 'Unknown visitor logged', relevance: 'key' },
    { name: 'Filing cabinet', condition: 'Forced open', relevance: 'key' },
    { name: 'Office plant', condition: 'Knocked over', relevance: 'red_herring' },
  ],
  factory: [
    { name: 'Machinery', condition: 'Powered down improperly', relevance: 'supporting' },
    { name: 'Safety equipment', condition: 'Not worn by victim', relevance: 'key' },
    { name: 'Time clock', condition: 'Shows unusual punch-in', relevance: 'key' },
    { name: 'Chemical containers', condition: 'Some missing labels', relevance: 'supporting' },
    { name: 'Forklift', condition: 'Keys in ignition', relevance: 'red_herring' },
  ],
  hotel: [
    { name: 'Room service tray', condition: 'Partially eaten meal', relevance: 'supporting' },
    { name: 'Do Not Disturb sign', condition: 'Hung for 2 days', relevance: 'key' },
    { name: 'Mini bar', condition: 'Several bottles opened', relevance: 'supporting' },
    { name: 'Hotel safe', condition: 'Left open, empty', relevance: 'key' },
    { name: 'Guest register', condition: 'Fake name used', relevance: 'key' },
  ],
  warehouse: [
    { name: 'Rope and duct tape', condition: 'Recently used', relevance: 'key' },
    { name: 'Shipping manifest', condition: 'Hidden under debris', relevance: 'supporting' },
    { name: 'Old mattress', condition: 'Signs of recent use', relevance: 'key' },
    { name: 'Tire tracks', condition: 'Fresh in dust', relevance: 'key' },
    { name: 'Pigeon feathers', condition: 'Scattered around', relevance: 'red_herring' },
  ],
  parking_lot: [
    { name: "Victim's vehicle", condition: 'Engine still running', relevance: 'key' },
    { name: 'Parking ticket', condition: 'Timestamped', relevance: 'key' },
    { name: 'Security camera', condition: 'One camera disabled', relevance: 'key' },
    { name: 'Oil stain', condition: 'From different vehicle', relevance: 'supporting' },
    { name: 'Shopping cart', condition: 'Out of place', relevance: 'red_herring' },
  ],
  rooftop: [
    { name: 'Access door', condition: 'Lock broken', relevance: 'key' },
    { name: 'Cigarette butts', condition: 'Multiple brands', relevance: 'supporting' },
    { name: 'Fallen antenna', condition: 'Recently damaged', relevance: 'red_herring' },
    { name: 'Roof access log', condition: 'Unauthorized entry', relevance: 'key' },
    { name: 'Binoculars', condition: 'Near body', relevance: 'supporting' },
  ],
  basement: [
    { name: 'Broken light bulb', condition: 'Glass on floor', relevance: 'supporting' },
    { name: 'Padlock', condition: 'Cut with bolt cutters', relevance: 'key' },
    { name: 'Storage boxes', condition: 'Recently moved', relevance: 'supporting' },
    { name: 'Old newspapers', condition: 'Dated weeks ago', relevance: 'red_herring' },
    { name: 'Drainage grate', condition: 'Shows signs of tampering', relevance: 'key' },
  ],
};

// Helper functions
function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateTimeOfDeath(): Date {
  const now = new Date();
  const hoursAgo = randomInt(2, 72);
  return new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
}

function generateVictim(): VictimProfile {
  const firstName = randomFrom(firstNames);
  const lastName = randomFrom(lastNames);
  return {
    name: `${firstName} ${lastName}`,
    age: randomInt(25, 65),
    profession: randomFrom(professions),
  };
}

function generateWounds(weaponFound: WeaponType | undefined, bloodPattern: BloodPattern): WoundEvidence[] {
  const wounds: WoundEvidence[] = [];
  
  if (weaponFound === 'knife' || bloodPattern === 'splash' || bloodPattern === 'trail') {
    wounds.push({
      type: 'stab',
      location: randomFrom(['chest', 'abdomen', 'back', 'neck']),
      description: 'Deep penetrating wound consistent with a sharp object',
    });
  }
  
  if (weaponFound === 'blunt' || bloodPattern === 'pool') {
    wounds.push({
      type: 'blunt',
      location: randomFrom(['head', 'skull', 'temple']),
      description: 'Severe blunt force trauma with visible contusion',
    });
  }
  
  if (weaponFound === 'firearm') {
    wounds.push({
      type: 'gunshot',
      location: randomFrom(['chest', 'head', 'back']),
      description: 'Entry wound with powder burns suggesting close range',
    });
  }
  
  if (weaponFound === 'strangulation') {
    wounds.push({
      type: 'ligature',
      location: 'neck',
      description: 'Visible ligature marks and petechial hemorrhaging',
    });
  }
  
  // Add defensive wounds for murder cases
  if (Math.random() > 0.5) {
    wounds.push({
      type: 'defensive',
      location: 'hands and forearms',
      description: 'Cuts and bruises consistent with defensive struggle',
    });
  }
  
  return wounds;
}

function generateSurveillance(location: LocationType): SurveillanceEvidence {
  const hasCamera = ['apartment', 'office', 'hotel', 'parking_lot', 'street'].includes(location);
  
  if (!hasCamera || Math.random() > 0.6) {
    return { available: false };
  }
  
  return {
    available: true,
    description: randomFrom([
      'Footage shows unidentified figure near the scene',
      'Camera angle partially obstructed',
      'Recording corrupted during key timeframe',
      'Clear footage of victim entering alone',
      'Multiple individuals seen in vicinity',
    ]),
    timeGap: Math.random() > 0.5 ? `${randomInt(10, 45)} minute gap in recording` : undefined,
  };
}

function generateEnvironmentalDamage(): EnvironmentalDamage {
  if (Math.random() > 0.4) {
    return { type: 'none' };
  }
  
  const types: Array<EnvironmentalDamage['type']> = ['broken_glass', 'overturned_furniture', 'scorch_marks', 'water_damage'];
  const type = randomFrom(types);
  
  const descriptions: Record<string, string[]> = {
    broken_glass: ['Window shattered from inside', 'Glass fragments suggest struggle', 'Mirror smashed, pieces scattered'],
    overturned_furniture: ['Chair knocked over forcefully', 'Table displaced from original position', 'Bookshelf contents strewn about'],
    scorch_marks: ['Small burn marks on carpet', 'Evidence of minor fire', 'Cigarette burns on furniture'],
    water_damage: ['Recent water spillage', 'Broken pipes nearby', 'Wet floor around scene'],
  };
  
  return {
    type,
    description: randomFrom(descriptions[type]),
  };
}

function generateTimeClues(timeOfDeath: Date): TimeClue[] {
  const clues: TimeClue[] = [];
  const types: Array<TimeClue['type']> = ['watch_stopped', 'last_call', 'receipt', 'witness_sighting', 'security_log'];
  
  const numClues = randomInt(1, 3);
  const selectedTypes = [...types].sort(() => Math.random() - 0.5).slice(0, numClues);
  
  selectedTypes.forEach(type => {
    const offsetMinutes = randomInt(-60, 60);
    const clueTime = new Date(timeOfDeath.getTime() + offsetMinutes * 60 * 1000);
    
    const descriptions: Record<TimeClue['type'], string[]> = {
      watch_stopped: ["Victim's watch stopped at this time", 'Smartwatch last recorded activity'],
      last_call: ['Last outgoing call from victim', 'Final text message sent'],
      receipt: ['Store receipt found on victim', 'ATM withdrawal recorded'],
      witness_sighting: ['Neighbor saw victim arrive', 'Coworker last saw victim leave'],
      security_log: ['Building access log entry', 'Elevator camera timestamp'],
    };
    
    clues.push({
      type,
      time: clueTime,
      description: randomFrom(descriptions[type]),
    });
  });
  
  return clues;
}

function isIndoorLocation(location: LocationType): boolean {
  return ['apartment', 'office', 'factory', 'hotel', 'warehouse', 'basement'].includes(location);
}

function generateHiddenSolution(
  location: LocationType,
  weather: Weather,
  footprintType: FootprintType,
  footprintDirection: FootprintDirection,
  bloodPattern: BloodPattern,
  weaponFound: WeaponType | undefined,
  timeOfDeath: Date,
  victim: VictimProfile
): HiddenSolution {
  const isIndoor = isIndoorLocation(location);
  
  // Determine crime type based on evidence
  let crimeType: CrimeType = 'murder';
  if (weaponFound === 'none' && bloodPattern === 'none' && footprintType === 'none') {
    crimeType = Math.random() > 0.5 ? 'suicide' : 'accident';
  } else if (weaponFound === 'poison' && footprintType === 'none') {
    crimeType = Math.random() > 0.7 ? 'suicide' : 'murder';
  }
  
  // Determine if staged
  const hasContradiction = 
    (weather === 'rain' && footprintType === 'barefoot' && !isIndoor) ||
    (bloodPattern === 'pool' && footprintType === 'multiple' && footprintDirection === 'scattered') ||
    (crimeType === 'suicide' && footprintType === 'multiple');
  const isStaged = hasContradiction || Math.random() > 0.75;
  
  // Determine cause of death
  let causeOfDeath: string[] = [];
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
  
  // Generate victim movement description
  const victimMovement = isStaged 
    ? 'Body was moved post-mortem to this location'
    : 'Victim was attacked and died at this location';
  
  // Generate full reconstruction
  const fullReconstruction = `Based on forensic analysis: ${victim.name}, a ${victim.age}-year-old ${victim.profession}, ` +
    `died from ${causeOfDeath[0]} approximately ${Math.round((Date.now() - timeOfDeath.getTime()) / 3600000)} hours ago. ` +
    `The ${weather} weather and ${bloodPattern !== 'none' ? bloodPattern + ' blood pattern' : 'lack of blood'} suggest ` +
    `${crimeType === 'murder' ? 'foul play' : crimeType === 'accident' ? 'an unfortunate accident' : 'self-inflicted harm'}. ` +
    `${isStaged ? 'Evidence suggests the scene was deliberately staged to mislead investigators.' : 'The scene appears genuine.'} ` +
    `${footprintType !== 'none' ? `Footprint analysis indicates the perpetrator ${suspectDirection.replace('_', ' ')}.` : 'No useful footprint evidence was found.'}`;
  
  return {
    causeOfDeath,
    estimatedTimeOfDeath: timeOfDeath,
    crimeType,
    victimMovement,
    isStaged,
    suspectDirection,
    isIndoor,
    fullReconstruction,
  };
}

export function generateCrimeCase(difficulty: 'beginner' | 'intermediate' | 'expert' = 'beginner'): CrimeCase {
  const location = randomFrom(locations);
  const weather = randomFrom(weathers);
  const footprintType = randomFrom(footprintTypes);
  const footprintDirection: FootprintDirection = footprintType === 'none' 
    ? 'none' 
    : randomFrom(footprintDirections.filter(d => d !== 'none') as FootprintDirection[]);
  const bloodPattern = randomFrom(bloodPatterns);
  const timeOfDeath = generateTimeOfDeath();
  const victim = generateVictim();
  
  // Generate weapon based on difficulty
  const weaponFound = difficulty !== 'beginner' ? randomFrom(weaponTypes) : undefined;
  const bodyPosition = difficulty !== 'beginner' ? randomFrom(bodyPositions) : undefined;
  
  // Generate hidden solution
  const hiddenSolution = generateHiddenSolution(
    location, weather, footprintType, footprintDirection, 
    bloodPattern, weaponFound, timeOfDeath, victim
  );
  
  // Build evidence object based on difficulty
  const evidence: CrimeCase['evidence'] = {
    timeOfDeath,
    weather,
    footprintType,
    footprintDirection,
    bloodPattern,
    bodyPosition,
    weaponFound,
  };
  
  // Add more evidence for intermediate and expert
  if (difficulty !== 'beginner') {
    evidence.wounds = generateWounds(weaponFound, bloodPattern);
    evidence.sceneObjects = sceneObjectsByLocation[location]
      .sort(() => Math.random() - 0.5)
      .slice(0, randomInt(2, 4));
    evidence.surveillance = generateSurveillance(location);
  }
  
  // Add expert-level evidence
  if (difficulty === 'expert') {
    evidence.environmentalDamage = generateEnvironmentalDamage();
    evidence.timeClues = generateTimeClues(timeOfDeath);
  }
  
  // Generate red herrings for expert mode
  const redHerrings = difficulty === 'expert' ? [
    'A torn piece of fabric was found nearby',
    'Cigarette butts of an unknown brand were discovered',
    'A mysterious phone number was written on a napkin',
    'Unidentified fingerprints on nearby surfaces',
    'Strange symbol scratched into the ground',
  ].sort(() => Math.random() - 0.5).slice(0, randomInt(2, 4)) : undefined;
  
  // Get story intro
  const storyIntro = randomFrom(storyIntroTemplates[location]);
  
  return {
    id: `case-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title: randomFrom(caseTitles),
    difficulty,
    location,
    storyIntro,
    victim,
    evidence,
    hiddenSolution,
    redHerrings,
  };
}
