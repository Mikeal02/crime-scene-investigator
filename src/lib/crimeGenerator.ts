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
  HiddenSolution,
  ForensicContradiction,
  HiddenHint,
  DigitalEvidence,
  BiologicalEvidence,
  EnvironmentalTrace
} from '@/types/crime';

// Case titles - disturbing and clinical
const caseTitles = [
  'Case File #7734: The Residue',
  'Incident Report: Hollow Creek',
  'Autopsy Protocol 19-B',
  'Evidence Log: The Stillness',
  'File #2847: Unresolved',
  'The Marrow Case',
  'Document 44-X: Absence',
  'Investigation: The Remainder',
  'Report #891: Last Witness',
  'Case File: The Impression',
  'Protocol 7: The Descent',
  'Evidence File: Cold Storage',
  'Case #0093: The Displacement',
  'Incident Log: Terminal',
];

const locations: LocationType[] = [
  'forest', 'apartment', 'street', 'office', 'factory', 'hotel', 
  'warehouse', 'parking_lot', 'rooftop', 'basement', 
  'abandoned_hospital', 'sewers', 'construction_site', 'cemetery'
];

const weathers: Weather[] = ['clear', 'rain', 'fog', 'storm', 'snow', 'humid', 'freezing'];
const footprintTypes: FootprintType[] = ['shoe', 'barefoot', 'multiple', 'partial', 'smeared', 'none'];
const footprintDirections: FootprintDirection[] = ['toward_body', 'away_from_body', 'scattered', 'circular', 'none'];
const bloodPatterns: BloodPattern[] = ['splash', 'pool', 'trail', 'drip', 'arterial_spray', 'cast_off', 'transfer', 'void', 'none'];
const bodyPositions: BodyPosition[] = ['face_up', 'face_down', 'seated', 'crouched', 'fetal', 'suspended', 'contorted'];
const weaponTypes: WeaponType[] = ['knife', 'blunt', 'firearm', 'poison', 'strangulation', 'sharp_object', 'chemical', 'none'];
const crimeTypes: CrimeType[] = ['murder', 'accident', 'suicide', 'undetermined'];

// Victim data - expanded
const firstNames = [
  'Marcus', 'Elena', 'Victor', 'Natasha', 'Edward', 'Vera', 'Samuel', 'Iris', 
  'Theodore', 'Margot', 'Felix', 'Daphne', 'Conrad', 'Lydia', 'Oscar', 'Helena',
  'Arthur', 'Ingrid', 'Walter', 'Celeste'
];

const lastNames = [
  'Thornwood', 'Vance', 'Mercer', 'Holloway', 'Blackwell', 'Graves', 'Ashford', 
  'Sterling', 'Crane', 'Weston', 'Drake', 'Harlow', 'Sinclair', 'Frost', 'Carver',
  'Marsh', 'Finch', 'Stone', 'Whitmore', 'Coldwell'
];

const professions = [
  'Forensic Accountant', 'Night Shift Supervisor', 'Private Investigator', 'Estate Lawyer',
  'Pharmaceutical Researcher', 'Insurance Investigator', 'Coroner Assistant', 'Data Analyst',
  'Clinical Psychologist', 'Evidence Technician', 'Medical Examiner', 'Security Consultant',
  'Crime Scene Photographer', 'Toxicologist', 'Mortician', 'Cold Case Detective (Retired)',
  'Witness Protection Coordinator', 'Forensic Pathologist'
];

const recentBehaviors = [
  'Had been increasingly paranoid in recent weeks',
  'Changed daily routines without explanation',
  'Made large unexplained cash withdrawals',
  'Attempted to contact estranged family members',
  'Filed multiple police reports about being followed',
  'Cancelled all upcoming appointments two days prior',
  'Was observed having heated arguments with unknown individuals',
  'Left cryptic voicemails to colleagues',
  'Updated will and testament the previous month',
  'Had been researching disappearance cases online'
];

// Story intro templates - clinical and unsettling
const storyIntroTemplates: Record<LocationType, string[]> = {
  forest: [
    "Discovery timestamp: 06:47. A jogger's GPS data ended here abruptly. The body was found 47 meters off the main trail, partially concealed beneath decomposing foliage. Wildlife disturbance is evident. Something wanted this body found.",
    "Anonymous call traced to a payphone 12km away. Caller knew precise coordinates. Responding officers noted an unusual silence—no birds, no insects. The forest feels like it's holding its breath.",
  ],
  apartment: [
    "Neighbors reported a persistent odor originating from Unit 4B for nine days before management intervened. The deadbolt was engaged from the inside. The chain was not. Someone left after ensuring no one else could enter.",
    "A wellness check revealed more than anticipated. The resident had not been seen in 72 hours, but food delivery orders continued until 36 hours ago. The last order was never opened.",
  ],
  street: [
    "Discovered at 03:47 in an alley between Mercer and 7th. CCTV coverage has a 23-minute gap during the estimated time of death. The gap was not caused by technical failure. The system was accessed remotely.",
    "The victim was found positioned precisely under a non-functioning streetlight. Ballistics suggests the shooter knew exactly where the shadows would fall. This was choreographed.",
  ],
  office: [
    "Building security logs show the victim entering at 22:14. No exit recorded. The elevator footage shows them ascending to the 14th floor. The building only has 12 floors listed in public records.",
    "The cleaning crew found the body at 23:45. The victim's computer was still on, displaying a single document: their own death certificate, dated tomorrow.",
  ],
  factory: [
    "Third shift discovered the body near conveyor belt 7, which had been decommissioned for 18 months. The belt was running when they arrived. No one reactivated it.",
    "Industrial accident initially suspected. However, the safety mechanisms were manually disabled from the inside. The victim's keycard was used. The victim had been dead for six hours at that point.",
  ],
  hotel: [
    "Room 217 placed a 'Do Not Disturb' sign 96 hours ago. When staff finally entered, they found the bed untouched. The victim was in the bathtub, fully clothed, water ice cold. The tap was still running.",
    "The guest registered under a name that belonged to someone who died in this same room in 1987. Dental records confirm it's not the same person. The handwriting in the register is identical.",
  ],
  warehouse: [
    "An anonymous tip led officers to Section C. The body was found staged among mannequins—positioned exactly like them. Officers counted 47 mannequins on entry. On exit, they counted 48.",
    "Condemned since the fire three years ago. The victim's phone was still recording when found. 14 hours of audio. Mostly silence. Occasional footsteps. The victim stopped screaming at hour 3.",
  ],
  parking_lot: [
    "The victim's vehicle was found running, driver's door open, radio playing static. The key was in the ignition. The victim was in the trunk. They did not put themselves there.",
    "Security footage shows the victim entering the garage at 21:34. At 21:47, the feed glitches. When it resumes at 21:52, the victim is already on the ground. No one else appears in the frame.",
  ],
  rooftop: [
    "Initial assessment: suicide. However, the victim's hands show defensive wounds. The roof access door was locked from the outside. Someone ensured no rescue was possible.",
    "Building maintenance found the body. The victim had been positioned to face the sunrise. A chair was placed precisely 3 meters away, facing the body. Someone watched.",
  ],
  basement: [
    "The smell had permeated three floors above before anyone investigated. The basement door required a key the building manager claims doesn't exist. The lock shows no sign of forcing.",
    "Water damage revealed more than pipe issues. The body was behind a wall that building plans don't show. The wall was plastered over within the last two weeks. The victim was reported missing three weeks ago.",
  ],
  abandoned_hospital: [
    "Urbex explorers called it in. The body was found in the psychiatric ward, strapped to a gurney that still had power. The hospital's electricity was cut off in 2014.",
    "The victim was a former patient here, discharged in 2008. Their medical file was found clutched in their hands. Pages were missing—the ones describing their treatment.",
  ],
  sewers: [
    "Maintenance workers discovered the remains during routine inspection. The body had been positioned against the current, wedged in a junction that should have flushed anything downstream. Someone wanted them found eventually.",
    "Rats avoided the body. Testing revealed traces of a compound that doesn't appear in any known database. The victim's skin shows a pattern that almost looks deliberate.",
  ],
  construction_site: [
    "Foundation pour was delayed when workers discovered the body in freshly set concrete. The pour began at 05:00. The victim was last seen at 04:30. The math doesn't account for the concrete's cure state.",
    "The victim fell from the 23rd floor. Scaffolding records show no one was scheduled above floor 15. The victim's hardhat was found on floor 7. Still strapped.",
  ],
  cemetery: [
    "The groundskeeper found them at dawn, positioned atop a grave. The grave belongs to someone who hasn't been buried yet—the funeral was scheduled for today. The deceased in the casket and the victim had never met. Records say.",
    "The body was discovered inside a mausoleum that has been sealed since 1943. The seal showed no tampering. The victim's driver's license was issued last month.",
  ],
};

// Scene objects by location - enhanced with forensic notes
const sceneObjectsByLocation: Record<LocationType, SceneObject[]> = {
  forest: [
    { name: 'Broken branch at shoulder height', condition: 'Snapped within 48 hours', relevance: 'supporting', forensicNote: 'Break pattern suggests significant force', hiddenMeaning: 'Height suggests struggle, not fall' },
    { name: 'Unsmoked cigarette', condition: 'Victim brand, but victim quit 2 years ago', relevance: 'red_herring', forensicNote: 'No saliva detected—never touched lips' },
    { name: 'Partial boot print in clay', condition: 'Size inconsistent with victim', relevance: 'key', forensicNote: 'Tread pattern is from discontinued model', hiddenMeaning: 'Perpetrator planned this before 2019' },
    { name: 'Animal carcass nearby', condition: 'Decomposition rate inconsistent', relevance: 'supporting', forensicNote: 'Died approximately same time as victim' },
    { name: 'Rope fibers on tree bark', condition: 'Hemp, partially burned', relevance: 'key', forensicNote: 'Fibers match those under victim fingernails' },
  ],
  apartment: [
    { name: 'Television remote', condition: 'Batteries removed and placed beside it', relevance: 'key', forensicNote: 'Fingerprints wiped, but palm print remains', hiddenMeaning: 'Killer knew about fingerprint evidence but missed palm' },
    { name: 'Coffee mug', condition: 'Cold, half-full, wrong hand position for victim', relevance: 'key', forensicNote: 'Victim was left-handed; mug handle faces right' },
    { name: 'Calendar', condition: 'Today circled, nothing written', relevance: 'supporting', forensicNote: 'Different pen used than others entries' },
    { name: 'Window latch', condition: 'Unlocked, but paint seal unbroken', relevance: 'red_herring', forensicNote: 'Has not been opened in months' },
    { name: 'Pet food bowl', condition: 'Full, but no pet registered or found', relevance: 'key', forensicNote: 'Food is fresh, placed within hours of death', hiddenMeaning: 'Someone else was expected to arrive' },
  ],
  street: [
    { name: 'Broken surveillance camera', condition: 'Lens cracked from inside', relevance: 'key', forensicNote: 'Damage occurred 4 hours before incident' },
    { name: 'Fast food wrapper', condition: 'Restaurant closed 3 months ago', relevance: 'key', forensicNote: 'DNA inside matches unknown profile in database' },
    { name: 'Parking meter', condition: 'Time expired 47 minutes after estimated death', relevance: 'supporting', forensicNote: 'Victim had no vehicle registered', hiddenMeaning: 'Someone was waiting for them' },
    { name: 'Chalk marks on pavement', condition: 'Appear to be measurement notations', relevance: 'key', forensicNote: 'Made within last 24 hours' },
    { name: 'Discarded syringe', condition: 'Contains trace amounts of unknown substance', relevance: 'contaminated', forensicNote: 'Not connected to victim—different blood type' },
  ],
  office: [
    { name: 'Computer screen', condition: 'Showing login page, cursor blinking', relevance: 'key', forensicNote: 'Last keystroke was 47 minutes before discovery', hiddenMeaning: 'Gap in activity is unexplained' },
    { name: 'Coffee pot', condition: 'Timer set for 6 AM, but victim worked nights', relevance: 'supporting', forensicNote: 'Timer was changed day of death' },
    { name: 'Desk drawer', condition: 'Locked, key missing', relevance: 'key', forensicNote: 'Lock recently forced from inside', hiddenMeaning: 'Victim locked something away before death' },
    { name: 'Air freshener', condition: 'Industrial grade, not standard issue', relevance: 'key', forensicNote: 'Chemical composition masks certain organic odors' },
    { name: 'Calendar appointment', condition: 'Meeting with [REDACTED] at time of death', relevance: 'key', forensicNote: 'Entry was deleted and recovered from backup' },
  ],
  factory: [
    { name: 'Safety goggles', condition: 'Cracked, with blood trace', relevance: 'key', forensicNote: 'Blood is victim\'s, but crack pattern suggests external force' },
    { name: 'Punch card', condition: 'Shows victim clocked out 2 hours before death', relevance: 'key', forensicNote: 'Card was used, but victim was still on premises', hiddenMeaning: 'Someone else used the card' },
    { name: 'Chemical spill marker', condition: 'Placed but no spill present', relevance: 'supporting', forensicNote: 'Marker placement matches body location' },
    { name: 'Conveyor belt panel', condition: 'Override code entered, not victim\'s ID', relevance: 'key', forensicNote: 'ID belongs to employee deceased since 2018' },
    { name: 'First aid kit', condition: 'Recently opened, supplies unused', relevance: 'red_herring', forensicNote: 'Opened within 30 minutes of death' },
  ],
  hotel: [
    { name: 'Do Not Disturb sign', condition: 'Placed from inside, door locked from outside', relevance: 'key', forensicNote: 'Physical impossibility without secondary entry point', hiddenMeaning: 'Killer had staff access or duplicate key' },
    { name: 'Bible in drawer', condition: 'Specific verse highlighted, matches victim\'s last text', relevance: 'key', forensicNote: 'Highlighting done with victim\'s pen' },
    { name: 'Empty minibar', condition: 'All bottles present but contents replaced with water', relevance: 'supporting', forensicNote: 'No alcohol in victim\'s blood' },
    { name: 'Hotel stationery', condition: 'Writing indentation visible, no written page found', relevance: 'key', forensicNote: 'Reconstruction reveals phone number', hiddenMeaning: 'Number belongs to victim themselves' },
    { name: 'Bedsheets', condition: 'Made with hospital corners, hotel uses different fold', relevance: 'supporting', forensicNote: 'Victim had no medical or military background' },
  ],
  warehouse: [
    { name: 'Rope and restraints', condition: 'Brand new, tags still attached', relevance: 'key', forensicNote: 'Purchased at store 300km away, cash transaction' },
    { name: 'Chalk outline', condition: 'Present before police arrival', relevance: 'key', forensicNote: 'Not standard police procedure', hiddenMeaning: 'Killer documented their own crime scene' },
    { name: 'Shipping manifest', condition: 'Lists items that don\'t exist', relevance: 'supporting', forensicNote: 'Address leads to empty lot' },
    { name: 'Space heater', condition: 'Running despite 3-week power disconnection', relevance: 'key', forensicNote: 'Connected to independent power source' },
    { name: 'Mannequin fragments', condition: 'Arranged in pattern around body', relevance: 'key', forensicNote: 'Pattern matches constellation visible that night' },
  ],
  parking_lot: [
    { name: 'Vehicle still running', condition: 'Tank nearly empty, engine damage from prolonged idle', relevance: 'key', forensicNote: 'Approximately 11 hours of runtime' },
    { name: 'Ticket stub', condition: 'Validated for tomorrow\'s date', relevance: 'key', forensicNote: 'System doesn\'t allow future validation', hiddenMeaning: 'Database was accessed and modified' },
    { name: 'Broken glass', condition: 'From vehicle interior, but windows intact', relevance: 'key', forensicNote: 'Glass from different vehicle model' },
    { name: 'Paint transfer on pillar', condition: 'Victim\'s vehicle color, but no damage to vehicle', relevance: 'red_herring', forensicNote: 'Transfer occurred weeks prior' },
    { name: 'Key fob', condition: 'Crushed, but found inside locked vehicle', relevance: 'key', forensicNote: 'No spare key on victim or in records' },
  ],
  rooftop: [
    { name: 'Shoe', condition: 'Single shoe, placed not fallen', relevance: 'key', forensicNote: 'Positioned heel-down, 3 meters from body', hiddenMeaning: 'Staged to suggest suicide preparation' },
    { name: 'Cigarette ash pattern', condition: 'Two different brands present', relevance: 'key', forensicNote: 'Victim\'s and unknown second person' },
    { name: 'Roof access log', condition: 'Shows victim entry but door was physically jammed', relevance: 'key', forensicNote: 'Electronic entry recorded, but door wasn\'t opened' },
    { name: 'Phone mount attached to railing', condition: 'Position suggests recording toward body location', relevance: 'key', forensicNote: 'Mount is new, phone is missing', hiddenMeaning: 'Someone recorded this' },
    { name: 'Chalk marks on ledge', condition: 'Measurement notations, precise to millimeter', relevance: 'key', forensicNote: 'Made within hours of death' },
  ],
  basement: [
    { name: 'Hidden wall panel', condition: 'Recently constructed, inferior materials', relevance: 'key', forensicNote: 'Construction materials purchased at 3 different stores' },
    { name: 'Drainage grate', condition: 'Recently cleaned with industrial bleach', relevance: 'key', forensicNote: 'Bleach doesn\'t eliminate all evidence' },
    { name: 'Fuse box', condition: 'One breaker manually disabled', relevance: 'supporting', forensicNote: 'Breaker controls basement lighting' },
    { name: 'Tool marks on floor', condition: 'Consistent with body being dragged', relevance: 'key', forensicNote: 'Direction leads from stairs to final position' },
    { name: 'Rodent bait stations', condition: 'All empty, bait consumed recently', relevance: 'red_herring', forensicNote: 'Different poison than what was in victim\'s system' },
  ],
  abandoned_hospital: [
    { name: 'Gurney straps', condition: 'Recently tightened, show struggle marks', relevance: 'key', forensicNote: 'Fiber transfer from victim\'s clothing' },
    { name: 'Medical file', condition: 'Victim\'s records, pages 47-52 missing', relevance: 'key', forensicNote: 'Missing pages referenced experimental treatment', hiddenMeaning: 'Someone wanted treatment records hidden' },
    { name: 'Power cable', condition: 'Recently connected to external generator', relevance: 'key', forensicNote: 'Generator rented under false name' },
    { name: 'Surgical instruments', condition: 'Sterile packaging opened within days', relevance: 'key', forensicNote: 'Instruments are vintage, 1970s hospital issue' },
    { name: 'Patient bracelet', condition: 'On victim\'s wrist, ID number doesn\'t exist in records', relevance: 'key', forensicNote: 'Bracelet material matches those used at this hospital before closure' },
  ],
  sewers: [
    { name: 'Waterproof bag', condition: 'Contains victim\'s personal effects, sealed', relevance: 'key', forensicNote: 'Bag placed after death', hiddenMeaning: 'Killer wanted victim identified eventually' },
    { name: 'Chemical residue on walls', condition: 'Unknown compound, not from sewer system', relevance: 'key', forensicNote: 'Matches trace found on victim\'s skin' },
    { name: 'Rope anchor point', condition: 'Recently installed into concrete', relevance: 'key', forensicNote: 'Installation required specialized tools' },
    { name: 'Graffiti tag', condition: 'Paint still tacky, symbol unknown', relevance: 'supporting', forensicNote: 'Symbol matches one found in victim\'s notebook' },
    { name: 'Access grate above', condition: 'Welded shut from above', relevance: 'key', forensicNote: 'Only exit was through 2km of tunnels', hiddenMeaning: 'Victim was trapped' },
  ],
  construction_site: [
    { name: 'Hard hat', condition: 'Found 16 floors below victim\'s fall origin', relevance: 'key', forensicNote: 'Removed before fall, not during', hiddenMeaning: 'Victim knew they were going to fall' },
    { name: 'Safety harness', condition: 'Carabiners opened, not broken', relevance: 'key', forensicNote: 'Requires deliberate action to release' },
    { name: 'Concrete sample', condition: 'Cure rate indicates body was placed before pour began', relevance: 'key', forensicNote: 'Contradicts witness timeline' },
    { name: 'Foreman\'s log', condition: 'Entry for victim scratched out, still legible', relevance: 'key', forensicNote: 'Different handwriting than foreman\'s' },
    { name: 'Tool belt', condition: 'Missing specific tools, others left', relevance: 'supporting', forensicNote: 'Missing tools could be used as weapons' },
  ],
  cemetery: [
    { name: 'Fresh flowers', condition: 'On grave victim was found near, no card', relevance: 'supporting', forensicNote: 'Flowers placed within hours of death' },
    { name: 'Grave dirt', condition: 'Recently disturbed despite no scheduled services', relevance: 'key', forensicNote: 'Disturbance is precisely body-sized' },
    { name: 'Mausoleum seal', condition: 'Shows no tampering but victim found inside', relevance: 'key', forensicNote: 'Alternative entry point must exist', hiddenMeaning: 'Underground access unknown to cemetery' },
    { name: 'Cemetery logbook', condition: 'Victim\'s name appears three times under different dates', relevance: 'key', forensicNote: 'Entries made over past two weeks' },
    { name: 'Security patrol schedule', condition: 'Altered to skip this section on night of death', relevance: 'key', forensicNote: 'Alteration made by someone with system access' },
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
  const hoursAgo = randomInt(6, 96);
  return new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
}

function generateVictim(): VictimProfile {
  const firstName = randomFrom(firstNames);
  const lastName = randomFrom(lastNames);
  const associates = [
    'Unknown individual photographed with victim',
    'Estranged sibling (no contact 5+ years)',
    'Former employer (lawsuit pending)',
    'Anonymous online correspondent'
  ];
  
  return {
    name: `${firstName} ${lastName}`,
    age: randomInt(28, 67),
    profession: randomFrom(professions),
    lastKnownActivity: randomFrom([
      'Withdrew cash from ATM at 23:47',
      'Sent encrypted email to unknown recipient',
      'Purchased one-way ticket (unused)',
      'Made phone call lasting 47 seconds to payphone',
      'Accessed restricted database after hours',
      'Met with unidentified person at parking garage'
    ]),
    knownAssociates: associates.sort(() => Math.random() - 0.5).slice(0, randomInt(1, 3)),
    financialStatus: randomFrom(['stable', 'debt', 'wealthy', 'unknown']),
    recentBehavior: randomFrom(recentBehaviors),
  };
}

function generateWounds(weaponFound: WeaponType | undefined, bloodPattern: BloodPattern, difficulty: string): WoundEvidence[] {
  const wounds: WoundEvidence[] = [];
  
  if (weaponFound === 'knife' || weaponFound === 'sharp_object' || bloodPattern === 'splash' || bloodPattern === 'arterial_spray') {
    wounds.push({
      type: 'stab',
      location: randomFrom(['anterior chest, 3rd intercostal space', 'posterior thorax, paravertebral', 'lateral abdomen, hepatic region', 'anterior neck, carotid involvement']),
      description: 'Deep penetrating wound with clean margins suggesting sharp instrument',
      forensicNote: 'Wound track angle suggests assailant was taller than victim',
      contradiction: difficulty === 'expert' ? 'Lividity pattern inconsistent with wound position at discovery' : undefined,
    });
  }
  
  if (weaponFound === 'blunt' || bloodPattern === 'pool') {
    wounds.push({
      type: 'blunt',
      location: randomFrom(['left temporal region', 'occipital skull, posterior', 'right parietal bone', 'frontal bone, supraorbital']),
      description: 'Depressed skull fracture with stellate pattern, associated brain herniation',
      forensicNote: 'Impact pattern suggests cylindrical object, approximately 4cm diameter',
      contradiction: difficulty === 'expert' ? 'Weapon found doesn\'t match wound dimensions' : undefined,
    });
  }
  
  if (weaponFound === 'firearm') {
    wounds.push({
      type: 'gunshot',
      location: randomFrom(['anterior chest, left ventricle transit', 'posterior skull, execution style', 'lateral cranium, contact wound indicators']),
      description: 'Entry wound with stippling suggesting intermediate range, exit wound present',
      forensicNote: 'Bullet trajectory inconsistent with self-infliction',
    });
  }
  
  if (weaponFound === 'strangulation') {
    wounds.push({
      type: 'ligature',
      location: 'anterior and lateral neck, thyroid cartilage fractured',
      description: 'Circumferential ligature furrow with patterned abrasion, petechial hemorrhaging bilateral',
      forensicNote: 'Furrow pattern suggests specific material—possibly wire wrapped in fabric',
    });
  }

  if (weaponFound === 'chemical') {
    wounds.push({
      type: 'chemical_burn',
      location: randomFrom(['esophageal lining', 'oral mucosa and tongue', 'nasal passages']),
      description: 'Caustic burns indicating forced ingestion of corrosive substance',
      forensicNote: 'Burn pattern suggests multiple administrations over time',
    });
  }
  
  // Add defensive wounds
  if (Math.random() > 0.4) {
    wounds.push({
      type: 'defensive',
      location: 'bilateral hands and forearms, ulnar aspect',
      description: 'Multiple sharp and blunt trauma consistent with active defense',
      forensicNote: 'Skin cells under fingernails—DNA pending',
      contradiction: difficulty === 'expert' ? 'Defense wound pattern suggests victim was restrained, but no restraint marks found' : undefined,
    });
  }

  // Add secondary wounds
  if (difficulty !== 'beginner' && Math.random() > 0.5) {
    wounds.push({
      type: randomFrom(['bruising', 'scratch', 'bite']),
      location: randomFrom(['bilateral wrists', 'posterior ankles', 'anterior shoulders']),
      description: 'Secondary trauma suggesting restraint or struggle',
      forensicNote: 'Age of wound predates primary trauma by approximately 6-12 hours',
    });
  }
  
  return wounds;
}

function generateDigitalEvidence(): DigitalEvidence[] {
  const evidence: DigitalEvidence[] = [];
  const types: DigitalEvidence['type'][] = ['phone_logs', 'deleted_messages', 'browser_history', 'gps_data', 'social_media', 'financial_records'];
  const numItems = randomInt(2, 4);
  
  const descriptions: Record<DigitalEvidence['type'], string[]> = {
    phone_logs: [
      'Last outgoing call: 47 seconds to disconnected number',
      '23 missed calls from blocked number in final hour',
      'Phone powered off manually 3 hours before estimated death'
    ],
    deleted_messages: [
      'Recovered text: "I know what you did. Meet me or I tell everyone."',
      'Encrypted messaging app wiped remotely after death',
      'Deleted voicemail recovered: 2 minutes of silence, then breathing'
    ],
    browser_history: [
      'Search history cleared, but cache reveals: "how to disappear"',
      'Visited site for booking international travel 4 hours before death',
      'Downloaded encrypted file from dark web, file corrupted'
    ],
    gps_data: [
      'Phone location shows victim at scene, but cell tower data contradicts',
      'GPS disabled manually, then re-enabled at location unknown to contacts',
      'Fitness tracker shows elevated heart rate 2 hours before death, then flatline'
    ],
    social_media: [
      'Account accessed from unknown IP address 12 hours after death',
      'Draft post saved but never published: "If you\'re reading this, I didn\'t make it"',
      'Private message received and read after estimated time of death'
    ],
    financial_records: [
      'Large wire transfer to offshore account 48 hours before death',
      'Life insurance policy increased by 500% previous month',
      'Multiple cash withdrawals, amounts always $9,999 (below reporting threshold)'
    ]
  };
  
  const selectedTypes = [...types].sort(() => Math.random() - 0.5).slice(0, numItems);
  
  selectedTypes.forEach(type => {
    evidence.push({
      type,
      description: randomFrom(descriptions[type]),
      partialData: Math.random() > 0.6,
      corrupted: Math.random() > 0.7,
      forensicNote: Math.random() > 0.5 ? 'Data integrity compromised—analysis ongoing' : undefined,
    });
  });
  
  return evidence;
}

function generateBiologicalEvidence(difficulty: string): BiologicalEvidence[] {
  const evidence: BiologicalEvidence[] = [];
  const types: BiologicalEvidence['type'][] = ['fingerprints', 'dna', 'hair', 'fibers', 'skin_cells', 'bodily_fluids'];
  const numItems = randomInt(2, 4);
  
  const descriptions: Record<BiologicalEvidence['type'], string[]> = {
    fingerprints: [
      'Partial print on doorknob—7 points of comparison (insufficient for court)',
      'Palm print under victim\'s fingernails, no match in system',
      'Fingerprints wiped from surfaces, but overlooked on interior of gloves left at scene'
    ],
    dna: [
      'Unknown DNA profile mixed with victim\'s blood',
      'DNA from saliva on victim\'s face—no database match',
      'Degraded DNA sample, partial profile obtained'
    ],
    hair: [
      'Single hair strand, root attached—perpetrator or victim?',
      'Animal hair present—species inconsistent with location',
      'Dyed hair strand, original color unknown'
    ],
    fibers: [
      'Wool fibers not matching any of victim\'s clothing',
      'Synthetic fiber from rope not found at scene',
      'Carpet fiber from vehicle not owned by victim'
    ],
    skin_cells: [
      'Epithelials under victim\'s fingernails—vigorous struggle',
      'Skin cells on ligature material',
      'Touch DNA on weapon, partial profile'
    ],
    bodily_fluids: [
      'Saliva on victim—no database match',
      'Unknown blood type present, not victim\'s',
      'Sweat residue on surfaces, multiple contributors'
    ]
  };
  
  const selectedTypes = [...types].sort(() => Math.random() - 0.5).slice(0, numItems);
  
  selectedTypes.forEach(type => {
    const quality = randomFrom(['pristine', 'partial', 'contaminated', 'degraded'] as BiologicalEvidence['quality'][]);
    evidence.push({
      type,
      description: randomFrom(descriptions[type]),
      quality: difficulty === 'expert' ? 'contaminated' : quality,
      forensicNote: quality === 'contaminated' ? 'Evidence handling protocol may have been compromised' : undefined,
      matchStatus: randomFrom(['matched', 'unmatched', 'inconclusive']),
    });
  });
  
  return evidence;
}

function generateEnvironmentalTrace(): EnvironmentalTrace[] {
  const traces: EnvironmentalTrace[] = [];
  
  const smells = [
    { description: 'Faint chemical odor—industrial solvent', significance: 'Victim\'s workplace does not use this compound' },
    { description: 'Decomposition accelerated beyond normal rate', significance: 'Chemical intervention suspected' },
    { description: 'Perfume not matching victim\'s known preferences', significance: 'Another person was present recently' },
    { description: 'Bleach residue, but organic matter still detectable', significance: 'Cleanup attempt was interrupted' }
  ];
  
  const temperatures = [
    { description: 'Room temperature artificially lowered post-mortem', significance: 'Time of death estimation complicated' },
    { description: 'Body temperature inconsistent with ambient conditions', significance: 'Body was moved from different environment' },
    { description: 'Localized heat damage to floor beneath body', significance: 'Unknown heat source applied post-mortem' }
  ];
  
  if (Math.random() > 0.5) {
    const smell = randomFrom(smells);
    traces.push({ type: 'smell', description: smell.description, forensicSignificance: smell.significance });
  }
  
  if (Math.random() > 0.6) {
    const temp = randomFrom(temperatures);
    traces.push({ type: 'temperature', description: temp.description, forensicSignificance: temp.significance });
  }
  
  return traces;
}

function generateSurveillance(location: LocationType): SurveillanceEvidence {
  const hasCamera = ['apartment', 'office', 'hotel', 'parking_lot', 'street', 'factory', 'warehouse'].includes(location);
  
  if (!hasCamera || Math.random() > 0.7) {
    return { available: false };
  }
  
  return {
    available: true,
    description: randomFrom([
      'Footage shows unidentified figure, face obscured by hood and mask',
      'Camera angle convenient blind spot exactly where incident occurred',
      'Recording quality degraded during critical timeframe only',
      'Victim enters frame alone, but second shadow visible in reflection',
      'Timestamp shows 3-hour discrepancy with server logs',
    ]),
    timeGap: Math.random() > 0.4 ? `${randomInt(12, 67)} minute gap—cause: "unknown system error"` : undefined,
    corruption: Math.random() > 0.6 ? 'File corruption affects frames during estimated time of death' : undefined,
    anomaly: Math.random() > 0.5 ? randomFrom([
      'Figure appears to look directly at camera before footage cuts',
      'Clock on wall in footage doesn\'t match timestamp',
      'Door opens and closes but no one passes through'
    ]) : undefined,
  };
}

function generateEnvironmentalDamage(): EnvironmentalDamage {
  if (Math.random() > 0.5) {
    return { type: 'none' };
  }
  
  const types: Array<EnvironmentalDamage['type']> = ['broken_glass', 'overturned_furniture', 'scorch_marks', 'water_damage', 'chemical_residue', 'biological_matter'];
  const type = randomFrom(types);
  
  const descriptions: Record<string, string[]> = {
    broken_glass: [
      'Window shattered from inside, but blood splatter pattern indicates victim was outside at time of break',
      'Glass fragments embedded in victim\'s hands, but cuts are post-mortem',
      'Mirror broken, but reflection shows clean mirror in security footage from same time'
    ],
    overturned_furniture: [
      'Chair positioned as if thrown, but no impact damage on walls',
      'Table overturned, but items on table found arranged neatly on floor',
      'Bookshelf contents scattered, but dust patterns show books were placed, not fallen'
    ],
    scorch_marks: [
      'Burn pattern suggests localized heat source, no accelerant detected',
      'Cigarette burns on furniture in precise grid pattern',
      'Scorch marks on ceiling, but no corresponding floor damage'
    ],
    water_damage: [
      'Water damage present, but no water source identified',
      'Wet floor, but victim\'s clothing is completely dry',
      'Water stains in pattern that resembles writing'
    ],
    chemical_residue: [
      'Unknown compound, not naturally occurring',
      'Industrial cleaning agent, but residue is underneath body',
      'Chemical burns on floor form deliberate pattern'
    ],
    biological_matter: [
      'Blood splatter belongs to victim, but appears older than death',
      'Organic matter present from unknown source',
      'Biological evidence appears staged—placed, not naturally occurring'
    ],
  };
  
  return {
    type,
    description: randomFrom(descriptions[type]),
    forensicNote: 'Environmental analysis pending—preliminary findings inconsistent',
  };
}

function generateTimeClues(timeOfDeath: Date, difficulty: string): TimeClue[] {
  const clues: TimeClue[] = [];
  const types: Array<TimeClue['type']> = ['watch_stopped', 'last_call', 'receipt', 'witness_sighting', 'security_log', 'digital_trace', 'biological_marker'];
  
  const numClues = randomInt(2, 4);
  const selectedTypes = [...types].sort(() => Math.random() - 0.5).slice(0, numClues);
  
  selectedTypes.forEach(type => {
    const offsetMinutes = randomInt(-90, 90);
    const clueTime = new Date(timeOfDeath.getTime() + offsetMinutes * 60 * 1000);
    const reliability = difficulty === 'expert' 
      ? randomFrom(['questionable', 'contradicted'] as TimeClue['reliability'][])
      : randomFrom(['verified', 'questionable'] as TimeClue['reliability'][]);
    
    const descriptions: Record<TimeClue['type'], string[]> = {
      watch_stopped: [
        'Victim\'s watch stopped—impact damage, but impact angle impossible from fall',
        'Smartwatch last recorded heartbeat, then 47 minutes of "activity"',
        'Watch stopped at exact same time as death in connected case from 2019'
      ],
      last_call: [
        'Final call placed to number that has never existed',
        'Last text sent: single period. Recipient unknown.',
        'Phone records show call in progress at time of death, but both parties deceased'
      ],
      receipt: [
        'Store receipt timestamp contradicts store CCTV',
        'Receipt for item not found at scene or on victim',
        'Transaction declined, but receipt printed anyway'
      ],
      witness_sighting: [
        'Witness claims to have spoken with victim—impossible based on condition',
        'Multiple witnesses place victim in different locations simultaneously',
        'Witness initially certain, now claims "that wasn\'t them"'
      ],
      security_log: [
        'Building access log shows victim entry, but guard doesn\'t remember them',
        'Elevator accessed floor that doesn\'t exist in building',
        'Security system shows arm/disarm by victim after death'
      ],
      digital_trace: [
        'Browser activity continues 6 hours after death',
        'Email sent to self, scheduled delivery 2 weeks post-mortem',
        'Location sharing shows victim still at scene, phone never found'
      ],
      biological_marker: [
        'Stomach contents suggest meal at time victim was observed not eating',
        'Rigor mortis progression inconsistent with ambient temperature',
        'Lividity pattern indicates body was moved, then returned to original position'
      ],
    };
    
    clues.push({
      type,
      time: clueTime,
      description: randomFrom(descriptions[type]),
      reliability,
    });
  });
  
  return clues;
}

function generateContradictions(difficulty: string, evidence: CrimeCase['evidence']): ForensicContradiction[] {
  if (difficulty === 'beginner') return [];
  
  const contradictions: ForensicContradiction[] = [];
  
  const possibleContradictions: ForensicContradiction[] = [
    {
      evidence1: 'Blood spatter pattern',
      evidence2: 'Body position at discovery',
      explanation: 'Spatter directionality impossible from current body position',
      significance: 'major'
    },
    {
      evidence1: 'Time of death estimate',
      evidence2: 'Digital activity timeline',
      explanation: 'Online activity recorded after death',
      significance: 'critical'
    },
    {
      evidence1: 'Weather conditions',
      evidence2: 'Evidence preservation',
      explanation: 'Evidence too well-preserved for reported conditions',
      significance: difficulty === 'expert' ? 'major' : 'minor'
    },
    {
      evidence1: 'Wound pattern',
      evidence2: 'Weapon found',
      explanation: 'Weapon cannot have caused these specific wounds',
      significance: 'critical'
    },
    {
      evidence1: 'Footprint direction',
      evidence2: 'Surveillance footage',
      explanation: 'Movement pattern doesn\'t match recorded entry/exit',
      significance: 'major'
    },
    {
      evidence1: 'Victim\'s clothing',
      evidence2: 'Environmental trace',
      explanation: 'Fibers present don\'t match victim\'s attire or location',
      significance: 'minor'
    },
  ];
  
  const numContradictions = difficulty === 'expert' ? randomInt(2, 4) : randomInt(1, 2);
  return possibleContradictions.sort(() => Math.random() - 0.5).slice(0, numContradictions);
}

function generateHiddenHints(location: LocationType, difficulty: string): HiddenHint[] {
  const hints: HiddenHint[] = [];
  
  const baseHints: HiddenHint[] = [
    {
      location: 'Scene arrangement',
      hint: 'Furniture arranged to create specific sightlines to body',
      indirectSuggestion: 'Killer wanted body discovered from specific angle',
      revealsAfter: 'Reviewing CCTV shows discover positioned as intended'
    },
    {
      location: 'Victim\'s hands',
      hint: 'Fingernails recently trimmed, but victim documented as having long nails',
      indirectSuggestion: 'Evidence was removed from under nails',
    },
    {
      location: 'Timestamp discrepancies',
      hint: 'All clocks in room show slightly different times',
      indirectSuggestion: 'Scene was staged over extended period, clocks not synchronized',
    },
    {
      location: 'Evidence placement',
      hint: 'Key evidence items form geometric pattern when mapped',
      indirectSuggestion: 'Placement was deliberate, carries meaning',
      revealsAfter: 'Pattern matches symbol found in victim\'s research'
    },
    {
      location: 'Victim\'s clothing',
      hint: 'Clothing is correct size but wrong style for victim',
      indirectSuggestion: 'Victim was redressed post-mortem',
    },
    {
      location: 'Peripheral items',
      hint: 'Background items from different time periods',
      indirectSuggestion: 'Scene was constructed, not organic',
    },
    {
      location: 'Documentation',
      hint: 'Victim\'s recent documents reference events that haven\'t occurred yet',
      indirectSuggestion: 'Victim had foreknowledge of something',
      revealsAfter: 'Events in documents begin occurring after investigation starts'
    },
  ];
  
  const numHints = difficulty === 'beginner' ? 2 : difficulty === 'intermediate' ? 4 : 6;
  return baseHints.sort(() => Math.random() - 0.5).slice(0, numHints);
}

function isIndoorLocation(location: LocationType): boolean {
  return ['apartment', 'office', 'factory', 'hotel', 'warehouse', 'basement', 'abandoned_hospital'].includes(location);
}

function generateHiddenSolution(
  location: LocationType,
  weather: Weather,
  footprintType: FootprintType,
  footprintDirection: FootprintDirection,
  bloodPattern: BloodPattern,
  weaponFound: WeaponType | undefined,
  timeOfDeath: Date,
  victim: VictimProfile,
  difficulty: string
): HiddenSolution {
  const isIndoor = isIndoorLocation(location);
  
  let crimeType: CrimeType = 'murder';
  if (weaponFound === 'none' && bloodPattern === 'none' && footprintType === 'none') {
    crimeType = randomFrom(['suicide', 'accident', 'undetermined']);
  } else if (weaponFound === 'poison' || weaponFound === 'chemical') {
    crimeType = Math.random() > 0.6 ? 'suicide' : 'murder';
  }
  
  const hasContradiction = 
    (weather === 'rain' && footprintType === 'barefoot' && !isIndoor) ||
    (bloodPattern === 'pool' && footprintType === 'multiple' && footprintDirection === 'scattered') ||
    (crimeType === 'suicide' && footprintType === 'multiple');
  const isStaged = hasContradiction || Math.random() > 0.65;
  
  let causeOfDeath: string[] = [];
  if (weaponFound === 'knife' || weaponFound === 'sharp_object') {
    causeOfDeath = ['sharp force trauma', 'exsanguination', 'penetrating wound'];
  } else if (weaponFound === 'blunt') {
    causeOfDeath = ['blunt force trauma', 'craniocerebral injury', 'hemorrhage'];
  } else if (weaponFound === 'firearm') {
    causeOfDeath = ['gunshot wound', 'ballistic trauma'];
  } else if (weaponFound === 'poison' || weaponFound === 'chemical') {
    causeOfDeath = ['poisoning', 'toxic ingestion', 'chemical asphyxiation'];
  } else if (weaponFound === 'strangulation') {
    causeOfDeath = ['asphyxiation', 'ligature strangulation', 'mechanical asphyxia'];
  } else {
    causeOfDeath = ['undetermined', 'pending toxicology'];
  }
  
  let suspectDirection: string;
  if (footprintDirection === 'toward_body') {
    suspectDirection = 'entered_only';
  } else if (footprintDirection === 'away_from_body') {
    suspectDirection = 'left_only';
  } else if (footprintType === 'multiple' || footprintDirection === 'scattered' || footprintDirection === 'circular') {
    suspectDirection = 'entered_and_left';
  } else {
    suspectDirection = 'unknown';
  }
  
  const victimMovement = isStaged 
    ? 'Forensic evidence indicates body was relocated post-mortem. Primary crime scene remains unidentified.'
    : 'Evidence consistent with death occurring at discovery location. No signs of post-mortem relocation.';
  
  const hoursAgo = Math.round((Date.now() - timeOfDeath.getTime()) / 3600000);
  
  const fullReconstruction = `OFFICIAL RECONSTRUCTION [CLASSIFIED]\n\n` +
    `Victim: ${victim.name}, age ${victim.age}, ${victim.profession}\n` +
    `Time of Death: Approximately ${hoursAgo} hours before discovery\n` +
    `Cause: ${causeOfDeath[0]}\n` +
    `Classification: ${crimeType.toUpperCase()}\n\n` +
    `${weather !== 'clear' ? `Environmental conditions (${weather}) ${isStaged ? 'were exploited to mask evidence' : 'have impacted evidence preservation'}. ` : ''}` +
    `${bloodPattern !== 'none' ? `Blood evidence (${bloodPattern.replace('_', ' ')}) ${isStaged ? 'appears deliberately arranged' : 'supports preliminary findings'}. ` : ''}` +
    `${isStaged ? 'CRITICAL: Multiple indicators suggest scene manipulation. Evidence reliability compromised.' : 'Scene integrity appears maintained.'}\n\n` +
    `${footprintType !== 'none' ? `Movement analysis: Perpetrator evidence suggests ${suspectDirection.replace(/_/g, ' ')}.` : 'No useful movement evidence recovered.'}\n\n` +
    `[NOTE: This reconstruction is preliminary. Truth may be more disturbing than evidence suggests.]`;

  const trueNarrative = generateTrueNarrative(crimeType, isStaged, victim, location, weaponFound);
  const hiddenHints = generateHiddenHints(location, difficulty);
  
  return {
    causeOfDeath,
    estimatedTimeOfDeath: timeOfDeath,
    crimeType,
    victimMovement,
    isStaged,
    suspectDirection,
    isIndoor,
    fullReconstruction,
    hiddenHints,
    trueNarrative,
  };
}

function generateTrueNarrative(
  crimeType: CrimeType,
  isStaged: boolean,
  victim: VictimProfile,
  location: LocationType,
  weapon: WeaponType | undefined
): string {
  if (crimeType === 'murder' && isStaged) {
    return `${victim.name} was killed elsewhere and brought to the ${location.replace('_', ' ')}. ` +
      `The staging suggests the killer has forensic knowledge. ` +
      `Evidence was deliberately planted to mislead. The true motive remains unknown, but ${victim.profession.toLowerCase()} role suggests access to sensitive information.`;
  }
  if (crimeType === 'murder') {
    return `${victim.name} was killed at this location. ` +
      `The attack appears personal given the ${weapon || 'method'} chosen. ` +
      `Victim's recent behavior changes suggest they knew they were in danger.`;
  }
  if (crimeType === 'suicide' && isStaged) {
    return `Death was self-inflicted, but evidence was arranged post-mortem by unknown party. ` +
      `Someone wanted this to look different than it was. Why protect a suicide? What message was being erased?`;
  }
  return `Truth remains elusive. Evidence contradicts itself. Someone is lying. The dead cannot correct the record.`;
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
  
  const weaponFound = difficulty !== 'beginner' ? randomFrom(weaponTypes) : undefined;
  const bodyPosition = difficulty !== 'beginner' ? randomFrom(bodyPositions) : undefined;
  
  const hiddenSolution = generateHiddenSolution(
    location, weather, footprintType, footprintDirection, 
    bloodPattern, weaponFound, timeOfDeath, victim, difficulty
  );
  
  const evidence: CrimeCase['evidence'] = {
    timeOfDeath,
    weather,
    footprintType,
    footprintDirection,
    bloodPattern,
    bodyPosition,
    weaponFound,
  };
  
  if (difficulty !== 'beginner') {
    evidence.wounds = generateWounds(weaponFound, bloodPattern, difficulty);
    evidence.sceneObjects = sceneObjectsByLocation[location]
      ?.sort(() => Math.random() - 0.5)
      .slice(0, randomInt(3, 5)) || [];
    evidence.surveillance = generateSurveillance(location);
    evidence.digitalEvidence = generateDigitalEvidence();
    evidence.biologicalEvidence = generateBiologicalEvidence(difficulty);
  }
  
  if (difficulty === 'expert') {
    evidence.environmentalDamage = generateEnvironmentalDamage();
    evidence.timeClues = generateTimeClues(timeOfDeath, difficulty);
    evidence.environmentalTrace = generateEnvironmentalTrace();
    evidence.contradictions = generateContradictions(difficulty, evidence);
  }
  
  const redHerrings = difficulty !== 'beginner' ? [
    'Unidentified fabric fibers—lab results pending',
    'Partial print on surface touched by hundreds',
    'Unknown vehicle seen in area—no plates visible',
    'Anonymous tip line received cryptic message',
    'Victim\'s phone contacted unknown number day before death',
    'Security footage shows figure, but timestamp corrupted',
    'Witness claims to have seen something, but story inconsistent',
    'Previous tenant of location died under similar circumstances (unconfirmed)',
  ].sort(() => Math.random() - 0.5).slice(0, difficulty === 'expert' ? randomInt(4, 6) : randomInt(2, 3)) : undefined;
  
  const investigatorNotes = [
    'Something about this scene doesn\'t feel right.',
    'Trust nothing at face value.',
    'Consider who benefits from this interpretation.',
    'The absence of evidence is itself evidence.',
  ];
  
  const warningFlags = difficulty === 'expert' ? [
    '⚠ Multiple evidence contradictions detected',
    '⚠ Timeline inconsistencies require resolution',
    '⚠ Staged scene indicators present',
    '⚠ Digital evidence integrity questionable',
  ].slice(0, randomInt(1, 3)) : undefined;
  
  const storyIntro = randomFrom(storyIntroTemplates[location] || storyIntroTemplates.apartment);
  
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
    investigatorNotes,
    warningFlags,
  };
}
