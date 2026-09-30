export interface FitScoreResult {
  base: number;
  semantic: number;
  overall: number;
  matchingSkills: string[];
  missingSkills: string[];
}

export function calculateFitScores(
  candidateSkills: string[],
  requiredSkills: string[]
): FitScoreResult {
  const normCandidate = candidateSkills.map(s => s.toLowerCase().trim());
  const matching = requiredSkills.filter(s => 
    normCandidate.includes(s.toLowerCase().trim())
  );
  const missing = requiredSkills.filter(s => 
    !normCandidate.includes(s.toLowerCase().trim())
  );

  const base = Math.round((matching.length / Math.max(1, requiredSkills.length)) * 100);
  
  // Semantic boost simulation based on skill presence
  let semanticBoost = 0;
  if (base > 0) semanticBoost += 10;
  if (candidateSkills.length >= 4) semanticBoost += 6;
  if (candidateSkills.some(s => ['python', 'react', 'aws', 'docker', 'machine learning', 'sql'].includes(s.toLowerCase()))) {
    semanticBoost += 5;
  }

  const semantic = Math.min(99, Math.round(base * 0.8 + semanticBoost + (base > 20 ? 8 : 0)));
  const overall = Math.round((base * 0.35) + (semantic * 0.65));

  return {
    base,
    semantic,
    overall,
    matchingSkills: matching,
    missingSkills: missing
  };
}
