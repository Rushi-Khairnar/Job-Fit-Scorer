export interface CompensationBreakdown {
  currency: string;
  currencySymbol: string;
  entryLevel: number;
  median: number;
  topTier: number;
  bonusAvg: number;
  equityAvg: number;
  period: 'yearly' | 'monthly';
}

export interface DemandMetrics {
  demandScore: 'Surging' | 'High' | 'Moderate' | 'Niche';
  growthRateYoY: string;
  remoteAvailability: string;
  competitionIndex: 'Low' | 'Moderate' | 'High' | 'Fierce';
  typicalTimeToHire: string;
}

export interface GroundingSource {
  title: string;
  url: string;
}

export interface SkillDemandItem {
  skill: string;
  importance: 'Essential' | 'High Demand' | 'Emerging' | 'Preferred';
  salaryImpact: string;
}

export interface RealtimeMarketIntel {
  role: string;
  location: string;
  locationLabel: string;
  currency: string;
  experienceLevel: 'Junior' | 'Mid' | 'Senior' | 'Lead / Staff';
  overview: string;
  lastUpdated: string;
  isLiveGrounded: boolean;
  compensation: CompensationBreakdown;
  demandMetrics: DemandMetrics;
  topSkills: SkillDemandItem[];
  topHiringCompanies: string[];
  commonBenefits: string[];
  sources: GroundingSource[];
}

export interface MarketIntelRequest {
  role: string;
  locationKey: string;
  experienceLevel: 'Junior' | 'Mid' | 'Senior' | 'Lead / Staff';
}
