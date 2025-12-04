import { CrimeCase, UserReconstruction, ValidationResult } from '@/types/crime';

export function validateReconstruction(
  crimeCase: CrimeCase,
  userReconstruction: UserReconstruction
): ValidationResult {
  const correctDeductions: string[] = [];
  const incorrectDeductions: string[] = [];
  const missingReasoning: string[] = [];
  let score = 0;
  
  const { hiddenSolution, evidence } = crimeCase;
  
  // Validate cause of death (30 points)
  const causeMatch = hiddenSolution.causeOfDeath.some(
    cause => userReconstruction.causeOfDeath.toLowerCase().includes(cause.toLowerCase())
  );
  
  if (causeMatch) {
    correctDeductions.push('Correctly identified the cause of death');
    score += 30;
  } else {
    incorrectDeductions.push(`Cause of death was ${hiddenSolution.causeOfDeath[0]}, not "${userReconstruction.causeOfDeath}"`);
  }
  
  // Validate suspect direction (20 points)
  if (userReconstruction.suspectDirection === hiddenSolution.suspectDirection) {
    correctDeductions.push('Correctly deduced suspect movement pattern');
    score += 20;
  } else {
    incorrectDeductions.push(`Evidence suggests suspect ${hiddenSolution.suspectDirection.replace('_', ' ')}`);
  }
  
  // Validate staged determination (25 points)
  if (userReconstruction.isStaged === hiddenSolution.isStaged) {
    correctDeductions.push(
      hiddenSolution.isStaged 
        ? 'Correctly identified scene was staged' 
        : 'Correctly determined scene was genuine'
    );
    score += 25;
  } else {
    incorrectDeductions.push(
      hiddenSolution.isStaged 
        ? 'Scene was staged - contradictions in evidence indicate manipulation' 
        : 'Scene was genuine - no evidence of staging found'
    );
  }
  
  // Validate indoor/outdoor (15 points)
  if (userReconstruction.isIndoor === hiddenSolution.isIndoor) {
    correctDeductions.push('Correctly determined crime scene location type');
    score += 15;
  } else {
    incorrectDeductions.push(
      hiddenSolution.isIndoor 
        ? 'Evidence indicates an indoor crime scene' 
        : 'Evidence indicates an outdoor crime scene'
    );
  }
  
  // Validate crime type if provided (10 points)
  if (userReconstruction.crimeType) {
    if (userReconstruction.crimeType === hiddenSolution.crimeType) {
      correctDeductions.push(`Correctly identified as ${hiddenSolution.crimeType}`);
      score += 10;
    } else {
      incorrectDeductions.push(`This was a ${hiddenSolution.crimeType}, not ${userReconstruction.crimeType}`);
    }
  }
  
  // Check for logical consistency issues
  const { weather, footprintType, bloodPattern } = evidence;
  
  // Weather and footprint consistency
  if (weather === 'rain' && footprintType === 'barefoot' && !userReconstruction.isIndoor) {
    if (userReconstruction.isStaged) {
      correctDeductions.push('Correctly noted inconsistency: barefoot prints in rain suggests staging');
    } else {
      missingReasoning.push('Barefoot prints in heavy rain is inconsistent for outdoor crime');
    }
  }
  
  // Blood pattern and timeline consistency
  if (bloodPattern === 'pool' && userReconstruction.timeline.toLowerCase().includes('quick')) {
    missingReasoning.push('Blood pool formation suggests victim was stationary - contradicts quick timeline');
  }
  
  // Weapon and cause consistency
  if (evidence.weaponFound === 'firearm' && !userReconstruction.causeOfDeath.toLowerCase().includes('gun') && !userReconstruction.causeOfDeath.toLowerCase().includes('shot')) {
    missingReasoning.push('Firearm found at scene should be considered in cause of death');
  }
  
  if (evidence.weaponFound === 'knife' && !userReconstruction.causeOfDeath.toLowerCase().includes('stab') && !userReconstruction.causeOfDeath.toLowerCase().includes('cut')) {
    missingReasoning.push('Sharp weapon at scene suggests stabbing or cutting injuries');
  }
  
  // Surveillance evidence
  if (evidence.surveillance?.available && evidence.surveillance.timeGap) {
    if (!userReconstruction.timeline.toLowerCase().includes('gap') && 
        !userReconstruction.timeline.toLowerCase().includes('missing')) {
      missingReasoning.push('Surveillance footage gap should be accounted for in timeline');
    }
  }
  
  // Determine verdict
  let verdict: 'consistent' | 'partial' | 'illogical';
  if (score >= 80 && missingReasoning.length === 0) {
    verdict = 'consistent';
  } else if (score >= 50) {
    verdict = 'partial';
  } else {
    verdict = 'illogical';
  }
  
  return {
    score,
    verdict,
    correctDeductions,
    incorrectDeductions,
    missingReasoning,
    officialReconstruction: hiddenSolution.fullReconstruction,
  };
}
