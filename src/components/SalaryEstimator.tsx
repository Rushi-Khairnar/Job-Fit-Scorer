import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  MapPin, 
  Briefcase, 
  Sparkles, 
  Award, 
  Layers, 
  BarChart3, 
  CheckCircle2, 
  ArrowUpRight,
  RefreshCw,
  Globe2
} from 'lucide-react';
import { JOB_DIRECTORY_DATA } from '../jobsData';

interface SalaryEstimatorProps {
  initialRole?: string;
  userSkills?: string[];
}

export type CurrencyType = 'INR' | 'USD' | 'EUR' | 'GBP';

export const SalaryEstimator: React.FC<SalaryEstimatorProps> = ({ 
  initialRole = 'Data Scientist',
  userSkills = []
}) => {
  const [role, setRole] = useState(initialRole);
  const [level, setLevel] = useState<'Junior' | 'Mid' | 'Senior' | 'Lead' | 'Staff'>('Senior');
  const [locationKey, setLocationKey] = useState<string>('india-bangalore');
  const [currency, setCurrency] = useState<CurrencyType>('INR');
  const [activeSkills, setActiveSkills] = useState<string[]>(['Python', 'SQL', 'Machine Learning']);

  const BASE_RATES_USD: Record<string, { base: number; bonus: number; equity: number }> = {
    'Data Scientist': { base: 140000, bonus: 18000, equity: 32000 },
    'Software Engineer': { base: 135000, bonus: 15000, equity: 30000 },
    'Frontend Developer': { base: 125000, bonus: 14000, equity: 24000 },
    'Backend Developer': { base: 138000, bonus: 16000, equity: 28000 },
    'Full Stack Developer': { base: 135000, bonus: 15000, equity: 28000 },
    'Cloud Architect': { base: 165000, bonus: 24000, equity: 48000 },
    'DevOps Engineer': { base: 145000, bonus: 17000, equity: 32000 },
    'Machine Learning Engineer': { base: 155000, bonus: 22000, equity: 45000 },
    'Cyber Security Analyst': { base: 130000, bonus: 14000, equity: 22000 },
    'Data Analyst': { base: 98000, bonus: 10000, equity: 12000 },
    'Product Manager': { base: 148000, bonus: 20000, equity: 38000 }
  };

  const LEVEL_MULTIPLIERS = {
    Junior: 0.65,
    Mid: 1.0,
    Senior: 1.40,
    Lead: 1.70,
    Staff: 2.05
  };

  // Locations with regional cost-of-labor indices and default currencies
  const LOCATIONS: Record<string, { label: string; country: string; laborMult: number; defaultCurrency: CurrencyType }> = {
    'india-bangalore': { label: 'Bengaluru (Bangalore Tech Corridor)', country: 'India', laborMult: 0.28, defaultCurrency: 'INR' },
    'india-hyderabad': { label: 'Hyderabad (HITEC City & Gachibowli)', country: 'India', laborMult: 0.26, defaultCurrency: 'INR' },
    'india-pune': { label: 'Pune (Hinjawadi & Magarpatta)', country: 'India', laborMult: 0.24, defaultCurrency: 'INR' },
    'india-mumbai': { label: 'Mumbai & MMR (Fintech & Cloud)', country: 'India', laborMult: 0.26, defaultCurrency: 'INR' },
    'india-delhi': { label: 'Delhi-NCR (Gurgaon & Noida Hub)', country: 'India', laborMult: 0.25, defaultCurrency: 'INR' },
    'india-chennai': { label: 'Chennai (OMR & Tidel Park)', country: 'India', laborMult: 0.23, defaultCurrency: 'INR' },
    'us-bayarea': { label: 'US - San Francisco Bay Area & Silicon Valley', country: 'USA', laborMult: 1.15, defaultCurrency: 'USD' },
    'us-nyc': { label: 'US - New York City Metro', country: 'USA', laborMult: 1.05, defaultCurrency: 'USD' },
    'us-remote': { label: 'US - Remote / Tier 2 Hubs (Austin, Seattle, Denver)', country: 'USA', laborMult: 0.90, defaultCurrency: 'USD' },
    'uk-london': { label: 'United Kingdom - London Silicon Roundabout', country: 'UK', laborMult: 0.72, defaultCurrency: 'GBP' },
    'germany-berlin': { label: 'Germany - Berlin & Munich Tech Hub', country: 'Germany', laborMult: 0.68, defaultCurrency: 'EUR' },
    'canada-toronto': { label: 'Canada - Toronto & Vancouver', country: 'Canada', laborMult: 0.75, defaultCurrency: 'USD' },
    'singapore': { label: 'Singapore & Southeast Asia HQ', country: 'Singapore', laborMult: 0.85, defaultCurrency: 'USD' },
    'global-remote': { label: 'Global Remote (Worldwide Distributed)', country: 'Global', laborMult: 0.70, defaultCurrency: 'USD' }
  };

  const SKILL_PREMIUMS: Record<string, number> = {
    'Machine Learning': 0.14,
    'Kubernetes': 0.12,
    'Distributed Systems': 0.15,
    'React': 0.08,
    'TypeScript': 0.09,
    'AWS': 0.10,
    'Python': 0.08,
    'SQL': 0.06,
    'Docker': 0.07,
    'Cybersecurity': 0.12
  };

  // Conversion rates baseline (1 USD equals)
  const EXCHANGE_RATES: Record<CurrencyType, number> = {
    USD: 1.0,
    INR: 84.5, // 1 USD = ~84.5 INR
    EUR: 0.92,
    GBP: 0.78
  };

  const selectedLoc = LOCATIONS[locationKey] || LOCATIONS['india-bangalore'];
  const roleData = BASE_RATES_USD[role] || BASE_RATES_USD['Software Engineer'];
  const levelMult = LEVEL_MULTIPLIERS[level];

  // Calculate skill bonus
  const skillBonusPercent = activeSkills.reduce((acc, s) => acc + (SKILL_PREMIUMS[s] || 0), 0);
  const totalMult = levelMult * selectedLoc.laborMult * (1 + Math.min(0.35, skillBonusPercent));

  const baseUSD = Math.round(roleData.base * totalMult);
  const bonusUSD = Math.round(roleData.bonus * totalMult);
  const equityUSD = Math.round(roleData.equity * totalMult);
  const totalUSD = baseUSD + bonusUSD + equityUSD;

  // Convert USD amount to active currency
  const convertAmount = (amountUSD: number, targetCurr: CurrencyType): number => {
    return Math.round(amountUSD * EXCHANGE_RATES[targetCurr]);
  };

  const formatCurrency = (amountUSD: number, targetCurr: CurrencyType): string => {
    const rate = EXCHANGE_RATES[targetCurr];
    const converted = amountUSD * rate;

    if (targetCurr === 'INR') {
      const lakhs = converted / 100000;
      if (lakhs >= 100) {
        const crores = (lakhs / 100).toFixed(2);
        return `₹${crores} Cr`;
      }
      return `₹${lakhs.toFixed(1)} Lakhs`;
    }

    if (targetCurr === 'USD') return `$${Math.round(converted).toLocaleString()}`;
    if (targetCurr === 'EUR') return `€${Math.round(converted).toLocaleString()}`;
    if (targetCurr === 'GBP') return `£${Math.round(converted).toLocaleString()}`;
    return `${Math.round(converted).toLocaleString()}`;
  };

  const toggleSkill = (skill: string) => {
    if (activeSkills.includes(skill)) {
      setActiveSkills(activeSkills.filter(s => s !== skill));
    } else {
      setActiveSkills([...activeSkills, skill]);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-neutral-800 rounded-3xl p-6 sm:p-8 border border-neutral-200 dark:border-neutral-700 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 text-xs font-semibold mb-2.5 border border-amber-200 dark:border-amber-800">
              <DollarSign className="w-3.5 h-3.5" />
              <span>Real-Time Market Pay <span className="opacity-70 font-normal">[India Metro Hubs & Global Remote]</span></span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white">
              Salary Calculator
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1 max-w-2xl">
              Calculate market compensation benchmarks across Indian tech hubs and global markets, with instant INR (Lakhs) and USD ($) conversion.
            </p>
          </div>

          {/* Currency Switcher */}
          <div className="flex flex-col items-start sm:items-end gap-1.5">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
              Display Currency:
            </span>
            <div className="flex bg-neutral-100 dark:bg-neutral-900 p-1 rounded-2xl border border-neutral-200 dark:border-neutral-700">
              {(['INR', 'USD', 'EUR', 'GBP'] as CurrencyType[]).map((curr) => (
                <button
                  key={curr}
                  onClick={() => setCurrency(curr)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    currency === curr
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  {curr === 'INR' ? '₹ INR (Lakhs)' : curr === 'USD' ? '$ USD' : curr === 'EUR' ? '€ EUR' : '£ GBP'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-neutral-100 dark:border-neutral-700">
          {/* Target Role */}
          <div>
            <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 block mb-1">
              Target Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-xs font-bold text-neutral-900 dark:text-white outline-none"
            >
              {Object.keys(BASE_RATES_USD).map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Experience Level */}
          <div>
            <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 block mb-1">
              Seniority / Experience
            </label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-xs font-bold text-neutral-900 dark:text-white outline-none"
            >
              <option value="Junior">Junior (0 - 2 years)</option>
              <option value="Mid">Mid-Level (2 - 5 years)</option>
              <option value="Senior">Senior (5 - 8 years)</option>
              <option value="Lead">Lead / Staff (8 - 12 years)</option>
              <option value="Staff">Principal / Director (12+ years)</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 block mb-1">
              Job Location
            </label>
            <select
              value={locationKey}
              onChange={(e) => {
                const newLoc = e.target.value;
                setLocationKey(newLoc);
                if (LOCATIONS[newLoc]) {
                  setCurrency(LOCATIONS[newLoc].defaultCurrency);
                }
              }}
              className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-xs font-bold text-neutral-900 dark:text-white outline-none"
            >
              <optgroup label="India Tech Hubs">
                <option value="india-bangalore">Bengaluru / Bangalore (Top Hub)</option>
                <option value="india-hyderabad">Hyderabad (Cyberabad)</option>
                <option value="india-pune">Pune (IT & Product)</option>
                <option value="india-mumbai">Mumbai & MMR (Fintech)</option>
                <option value="india-delhi">Delhi-NCR (Gurgaon/Noida)</option>
                <option value="india-chennai">Chennai (OMR Hub)</option>
              </optgroup>
              <optgroup label="United States & Americas">
                <option value="us-bayarea">US - San Francisco Bay Area (Tier 1)</option>
                <option value="us-nyc">US - New York City</option>
                <option value="us-remote">US - Remote / Tier 2 Hubs</option>
                <option value="canada-toronto">Canada - Toronto / Vancouver</option>
              </optgroup>
              <optgroup label="Europe & APAC">
                <option value="uk-london">United Kingdom - London</option>
                <option value="germany-berlin">Germany - Berlin & Munich</option>
                <option value="singapore">Singapore APAC Hub</option>
                <option value="global-remote">Global Remote (Distributed)</option>
              </optgroup>
            </select>
          </div>
        </div>
      </div>

      {/* Salary Overview Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Total Compensation Big Highlight */}
        <div className="lg:col-span-7 bg-white dark:bg-neutral-800 rounded-3xl p-6 sm:p-8 border border-neutral-200 dark:border-neutral-700 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-700 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Estimated Annual Total Compensation
              </span>
              <div className="flex items-baseline space-x-3 mt-1 flex-wrap">
                <h3 className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white tracking-tight">
                  {formatCurrency(totalUSD, currency)}
                </h3>
                <span className="text-xs font-semibold text-neutral-500">/ year</span>
              </div>

              {/* Dual-currency instant conversion indicator */}
              <div className="mt-2 flex items-center space-x-2 text-xs font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-3 py-1 rounded-xl w-fit border border-amber-200 dark:border-amber-800">
                <RefreshCw className="w-3.5 h-3.5 mr-1" />
                {currency === 'INR' ? (
                  <span>Equivalent: <strong>${Math.round(totalUSD).toLocaleString()} USD / yr</strong></span>
                ) : (
                  <span>Equivalent: <strong>₹{(totalUSD * 84.5 / 100000).toFixed(1)} Lakhs INR / yr</strong></span>
                )}
              </div>
            </div>

            <div className="text-right hidden sm:block">
              <span className="text-xs font-semibold text-neutral-400 block">{selectedLoc.country}</span>
              <span className="text-xs font-bold text-neutral-700 dark:text-neutral-200">
                {level} Level
              </span>
            </div>
          </div>

          {/* Breakdown: Base, Bonus, Equity */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-center">
              <span className="text-[11px] text-neutral-500 block mb-1">Base Salary</span>
              <span className="text-base font-bold text-neutral-900 dark:text-white">
                {formatCurrency(baseUSD, currency)}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-center">
              <span className="text-[11px] text-neutral-500 block mb-1">Annual Bonus</span>
              <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                {formatCurrency(bonusUSD, currency)}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-center">
              <span className="text-[11px] text-neutral-500 block mb-1">Stock / Equity</span>
              <span className="text-base font-bold text-purple-600 dark:text-purple-400">
                {formatCurrency(equityUSD, currency)}
              </span>
            </div>
          </div>

          {/* Market Insight Note */}
          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700/80 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
            <strong className="text-neutral-900 dark:text-white">Market Insight: </strong>
            In {selectedLoc.label}, senior tech professionals with demonstrated expertise in cloud architecture and distributed systems command up to a 25% premium above baseline bands.
          </div>
        </div>

        {/* Skill Premium Multipliers */}
        <div className="lg:col-span-5 bg-white dark:bg-neutral-800 rounded-3xl p-6 sm:p-8 border border-neutral-200 dark:border-neutral-700 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center">
              <TrendingUp className="w-4 h-4 text-emerald-600 mr-2" />
              High-Demand Skill Bonuses
            </h4>
            <span className="text-[11px] text-neutral-400">Click to toggle</span>
          </div>

          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Adding validated high-demand technical capabilities increases your estimated compensation:
          </p>

          <div className="flex flex-wrap gap-2">
            {Object.entries(SKILL_PREMIUMS).map(([sk, prem]) => {
              const isSelected = activeSkills.includes(sk);
              return (
                <button
                  key={sk}
                  onClick={() => toggleSkill(sk)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 hover:border-emerald-400'
                  }`}
                >
                  <span>{sk}</span>
                  <span className={`text-[10px] font-bold ${isSelected ? 'text-emerald-100' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    +{Math.round(prem * 100)}%
                  </span>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-neutral-100 dark:border-neutral-700 flex items-center justify-between text-xs">
            <span className="text-neutral-500">Cumulative Skill Uplift:</span>
            <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
              +{Math.min(35, Math.round(skillBonusPercent * 100))}% Max
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
