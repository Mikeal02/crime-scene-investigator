import { CrimeCase, UserReconstruction, ValidationResult } from '@/types/crime';

export function validateReconstruction(
  crimeCase: CrimeCase,
  userReconstruction: UserReconstruction
): ValidationResult {
  const correctDeductions: string[] = [];
  const incorrectDeductions: string[] = [];
  const missingReasoning: string[] = [];
  let score = 0;

  const { evidence, correctAnswers } = crimeCase;

  // Validate cause of death (30 points)
  const userCause = userReconstruction.causeOfDeath.toLowerCase();
  const causeMatch = correctAnswers.causeOfDeath.some(cause => 
    userCause.includes(cause.toLowerCase())
  );
  
  if (causeMatch) {
    correctDeductions.push(`Correct cause of death identified based on ${evidence.bloodPattern} blood pattern${evidence.weaponFound ? ` and ${evidence.weaponFound} found at scene` : ''}.`);
    score += 30;
  } else {
    incorrectDeductions.push(`Cause of death "${userReconstruction.causeOfDeath}" doesn't match evidence. The ${evidence.bloodPattern} blood pattern ${evidence.weaponFound ? `combined with ${evidence.weaponFound}` : ''} suggests ${correctAnswers.causeOfDeath[0]}.`);
  }

  // Validate suspect direction (25 points)
  if (userReconstruction.suspectDirection === correctAnswers.suspectDirection) {
    correctDeductions.push(`Suspect movement correctly deduced from ${evidence.footprintType} footprints ${evidence.footprintDirection !== 'none' ? `pointing ${evidence.footprintDirection.replace('_', ' ')}` : ''}.`);
    score += 25;
  } else {
    incorrectDeductions.push(`Suspect direction analysis incorrect. ${evidence.footprintType} footprints ${evidence.footprintDirection !== 'none' ? `heading ${evidence.footprintDirection.replace('_', ' ')}` : ''} indicate ${correctAnswers.suspectDirection.replace('_', ' ')}.`);
  }

  // Validate staging assessment (25 points)
  if (userReconstruction.isStaged === correctAnswers.isStaged) {
    if (correctAnswers.isStaged) {
      correctDeductions.push('Correctly identified scene as staged. Evidence inconsistencies detected.');
    } else {
      correctDeductions.push('Correctly identified scene as genuine crime scene.');
    }
    score += 25;
  } else {
    if (correctAnswers.isStaged) {
      incorrectDeductions.push('Scene appears staged but was marked as genuine. Look for contradictory evidence patterns.');
    } else {
      incorrectDeductions.push('Scene is genuine but was marked as staged. Evidence patterns are consistent.');
    }
  }

  // Validate indoor/outdoor (20 points)
  if (userReconstruction.isIndoor === correctAnswers.isIndoor) {
    correctDeductions.push(`Correctly identified ${correctAnswers.isIndoor ? 'indoor' : 'outdoor'} scene based on ${evidence.weather} conditions and evidence preservation.`);
    score += 20;
  } else {
    incorrectDeductions.push(`Location analysis incorrect. ${evidence.weather} weather with ${evidence.footprintType !== 'none' ? 'preserved' : 'absent'} footprints suggests ${correctAnswers.isIndoor ? 'indoor' : 'outdoor'} crime scene.`);
  }

  // Check for logical contradictions in user's reasoning
  if (evidence.weather === 'rain' && !userReconstruction.isIndoor && evidence.footprintType !== 'none') {
    missingReasoning.push('Consider: Clear footprints in rainy weather typically indicate indoor crime or recent activity.');
  }

  if (evidence.bloodPattern === 'splash' && userReconstruction.causeOfDeath.toLowerCase().includes('poison')) {
    missingReasoning.push('Blood splash patterns are inconsistent with poisoning. Consider violent trauma.');
  }

  if (evidence.footprintType === 'multiple' && userReconstruction.suspectDirection === 'unknown') {
    missingReasoning.push('Multiple footprints provide directional evidence. Analyze their patterns.');
  }

  // Determine verdict
  let verdict: 'consistent' | 'partial' | 'illogical';
  if (score >= 80) {
    verdict = 'consistent';
  } else if (score >= 50) {
    verdict = 'partial';
  } else {
    verdict = 'illogical';
  }

  // Generate official reconstruction
  const officialReconstruction = generateOfficialReconstruction(crimeCase);

  return {
    score,
    verdict,
    correctDeductions,
    incorrectDeductions,
    missingReasoning,
    officialReconstruction,
  };
}

function generateOfficialReconstruction(crimeCase: CrimeCase): string {
  const { evidence, correctAnswers } = crimeCase;
  const timeStr = evidence.timeOfDeath.toLocaleString();

  const parts = [
    `Based on forensic analysis, the victim died approximately at ${timeStr}.`,
    `Weather conditions were ${evidence.weather}, which ${correctAnswers.isIndoor ? 'did not affect the indoor crime scene' : 'influenced evidence preservation'}.`,
    `${evidence.footprintType !== 'none' ? `${evidence.footprintType.charAt(0).toUpperCase() + evidence.footprintType.slice(1)} prints ${evidence.footprintDirection !== 'none' ? `leading ${evidence.footprintDirection.replace('_', ' ')}` : 'were found at the scene'}` : 'No footprints were recovered'}.`,
    `Blood evidence shows ${evidence.bloodPattern !== 'none' ? `a ${evidence.bloodPattern} pattern` : 'minimal blood'}, consistent with ${correctAnswers.causeOfDeath[0]}.`,
    evidence.weaponFound && evidence.weaponFound !== 'none' ? `A ${evidence.weaponFound} was recovered as the likely murder weapon.` : '',
    evidence.bodyPosition ? `The body was found ${evidence.bodyPosition.replace('_', ' ')}.` : '',
    `The crime scene ${correctAnswers.isStaged ? 'shows signs of staging and evidence manipulation' : 'appears to be undisturbed'}.`,
    `Classification: ${correctAnswers.isIndoor ? 'Indoor' : 'Outdoor'} homicide.`,
  ];

  return parts.filter(Boolean).join(' ');
}
