import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Search, 
  TrendingUp, 
  DollarSign, 
  Briefcase, 
  Building2, 
  CheckCircle2, 
  ExternalLink, 
  Sparkles, 
  RefreshCw, 
  ArrowUpRight, 
  ShieldCheck, 
  MapPin, 
  ChevronRight,
  BookOpen,
  HelpCircle,
  FileText,
  Layers,
  ArrowLeft
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { RealtimeMarketIntel } from '../types/marketIntel';
import { 
  SUPPORTED_LOCATIONS, 
  formatCurrency, 
  fetchMarketIntel 
} from '../services/marketIntelService';
import { JOB_DIRECTORY_DATA } from '../jobsData';

interface RealtimeMarketExplorerProps {
  initialRole?: string;
  initialLocationKey?: string;
  isDarkMode?: boolean;
  onSelectRoadmap?: (role: string) => void;
  onSelectQuiz?: (role: string) => void;
  onBuildCV?: (role: string) => void;
  onBackToHome?: () => void;
}

export const RealtimeMarketExplorer: React.FC<RealtimeMarketExplorerProps> = ({
  initialRole = 'Data Scientist',
  initialLocationKey = 'india-bangalore',
  isDarkMode = false,
  onSelectRoadmap,
  onSelectQuiz,
  onBuildCV,
  onBackToHome
}) => {
  const [selectedRole, setSelectedRole] = useState<string>(initialRole);
  const [customRoleInput, setCustomRoleInput] = useState<string>('');
  const [selectedLocationKey, setSelectedLocationKey] = useState<string>(initialLocationKey);
  const [experienceLevel, setExperienceLevel] = useState<'Junior' | 'Mid' | 'Senior' | 'Lead / Staff'>('Senior');
  const [intel, setIntel] = useState<RealtimeMarketIntel | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Suggested roles from existing job directory
  const POPULAR_ROLES = [
    'Data Scientist',
    'Machine Learning Engineer',
    'Software Engineer',
    'Cloud Architect',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'DevOps Engineer',
    'Cyber Security Analyst',
    'Data Analyst',
    'Product Manager'
  ];

  const loadData = (roleToFetch: string, locKey: string, lvl: 'Junior' | 'Mid' | 'Senior' | 'Lead / Staff') => {
    setLoading(true);
    setError(null);

    fetchMarketIntel({
      role: roleToFetch,
      locationKey: locKey,
      experienceLevel: lvl
    })
      .then((data) => {
        setIntel(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to fetch market intel');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData(selectedRole, selectedLocationKey, experienceLevel);
  }, [selectedRole, selectedLocationKey, experienceLevel]);

  const handleCustomSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (customRoleInput.trim()) {
      setSelectedRole(customRoleInput.trim());
      setCustomRoleInput('');
    }
  };

  // Prepare chart data for Recharts
  const chartData = intel ? [
    {
      name: '25th Percentile',
      Base: intel.compensation.entryLevel,
      Bonus: intel.compensation.bonusAvg * 0.7,
      Equity: intel.compensation.equityAvg * 0.5,
    },
    {
      name: 'Median (50th)',
      Base: intel.compensation.median,
      Bonus: intel.compensation.bonusAvg,
      Equity: intel.compensation.equityAvg,
    },
    {
      name: 'Top 10% (90th)',
      Base: intel.compensation.topTier,
      Bonus: intel.compensation.bonusAvg * 1.5,
      Equity: intel.compensation.equityAvg * 2.0,
    }
  ] : [];

  return (
    <div className="space-y-8 animate-in fade-in duration-200 pb-16">
      {/* Top Breadcrumb & Hero */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="inline-flex items-center text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white mb-2 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              Back to Career Tools
            </button>
          )}
          <div className="flex items-center space-x-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
            <Globe className="w-4 h-4 animate-spin-slow" />
            <span>Real-Time Market & Compensation Intelligence</span>
            <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">·</span>
            <span className="text-neutral-500 dark:text-neutral-400">Search Grounded with Gemini 3.5 Flash</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-neutral-950 dark:text-white tracking-tight mt-1">
            Real-Time Market Explorer
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 max-w-2xl">
            Live compensation benchmarks, hiring demand velocity, and emerging skill requirements extracted from real-time web data.
          </p>
        </div>

        <button
          onClick={() => loadData(selectedRole, selectedLocationKey, experienceLevel)}
          disabled={loading}
          className="self-start sm:self-auto inline-flex items-center px-4 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-2 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Live Data</span>
        </button>
      </div>

      {/* Control Strip: Role Select, Custom Search, Location, Experience Level */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-xs space-y-4">
        {/* Custom Search & Preset Role Selector */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          {/* Custom Search Form */}
          <form onSubmit={handleCustomSearch} className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={customRoleInput}
              onChange={(e) => setCustomRoleInput(e.target.value)}
              placeholder="Type any job title (e.g. AI Research Scientist, SRE, Tech Lead)..."
              className="w-full pl-10 pr-24 py-2 rounded-xl text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              Analyze
            </button>
          </form>

          {/* Location Dropdown */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 flex items-center flex-shrink-0">
              <MapPin className="w-3.5 h-3.5 mr-1" /> Location:
            </span>
            <select
              value={selectedLocationKey}
              onChange={(e) => setSelectedLocationKey(e.target.value)}
              className="bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs font-medium text-neutral-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {SUPPORTED_LOCATIONS.map((loc) => (
                <option key={loc.key} value={loc.key}>
                  {loc.label} ({loc.currencySymbol} {loc.currency})
                </option>
              ))}
            </select>
          </div>

          {/* Experience Level Segmented Control */}
          <div className="flex items-center space-x-1 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl">
            {(['Junior', 'Mid', 'Senior', 'Lead / Staff'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setExperienceLevel(lvl)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  experienceLevel === lvl
                    ? 'bg-white dark:bg-neutral-700 text-neutral-950 dark:text-white shadow-xs font-semibold'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Popular Roles Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 text-xs">
          <span className="text-neutral-400 dark:text-neutral-500 mr-1 flex-shrink-0">Trending Roles:</span>
          {POPULAR_ROLES.map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRole(r)}
              className={`px-3 py-1 rounded-lg text-xs whitespace-nowrap transition-colors cursor-pointer ${
                selectedRole === r
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-16 text-center space-y-4 shadow-xs">
          <RefreshCw className="w-10 h-10 text-blue-600 dark:text-blue-400 animate-spin mx-auto" />
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
            Grounding Market Data with Google Search...
          </h3>
          <p className="text-xs text-neutral-500 max-w-md mx-auto">
            Extracting 2026 verified salary distributions, hiring velocity, remote availability, and in-demand skills for {selectedRole} in {selectedLocationKey}.
          </p>
        </div>
      ) : error ? (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl p-6 text-xs text-amber-800 dark:text-amber-300">
          <p className="font-bold">Error loading live market data</p>
          <p className="mt-1">{error}</p>
        </div>
      ) : intel ? (
        <div className="space-y-6">
          {/* Header Summary Banner */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2 text-xs">
                  <span className={`font-semibold ${intel.isLiveGrounded ? 'text-emerald-600 dark:text-emerald-400' : 'text-neutral-500'}`}>
                    {intel.isLiveGrounded ? '● Live Search Grounded (Gemini 3.5 Flash)' : '○ Verified Market Baseline'}
                  </span>
                  <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">·</span>
                  <span className="text-neutral-500">{intel.locationLabel}</span>
                  <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">·</span>
                  <span className="text-neutral-500">{intel.experienceLevel} Level</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-neutral-950 dark:text-white tracking-tight mt-1">
                  {intel.role}
                </h2>
              </div>

              {/* Action Jump to Other Tools */}
              <div className="flex flex-wrap items-center gap-2">
                {onSelectRoadmap && (
                  <button
                    onClick={() => onSelectRoadmap(intel.role)}
                    className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-semibold border border-blue-200 dark:border-blue-800 flex items-center transition-colors cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5 mr-1.5" />
                    Roadmap
                  </button>
                )}
                {onSelectQuiz && (
                  <button
                    onClick={() => onSelectQuiz(intel.role)}
                    className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 text-xs font-semibold border border-purple-200 dark:border-purple-800 flex items-center transition-colors cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5 mr-1.5" />
                    Quiz
                  </button>
                )}
                {onBuildCV && (
                  <button
                    onClick={() => onBuildCV(intel.role)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center transition-colors shadow-xs cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 mr-1.5" />
                    Build Resume
                  </button>
                )}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed max-w-4xl">
              {intel.overview}
            </p>
          </div>

          {/* Compensation Metric Triad */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 25th Percentile */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xs space-y-2">
              <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block">
                25th Percentile / Competitive Entry
              </span>
              <div className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white">
                {formatCurrency(intel.compensation.entryLevel, intel.compensation.currency, intel.compensation.currencySymbol)}
              </div>
              <p className="text-xs text-neutral-500">
                Baseline entry threshold for {intel.experienceLevel} engineers in this geography.
              </p>
            </div>

            {/* Median / 50th Percentile */}
            <div className="bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/80 rounded-2xl p-6 shadow-xs space-y-2 relative">
              <div className="absolute top-4 right-4 text-[10px] font-bold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/60 px-2.5 py-0.5 rounded-full">
                Market Target
              </div>
              <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                Median Total Compensation
              </span>
              <div className="text-2xl sm:text-3xl font-black text-blue-700 dark:text-blue-300">
                {formatCurrency(intel.compensation.median, intel.compensation.currency, intel.compensation.currencySymbol)}
              </div>
              <div className="text-xs text-blue-600/90 dark:text-blue-400/90 flex items-center space-x-2">
                <span>Avg Bonus: {formatCurrency(intel.compensation.bonusAvg, intel.compensation.currency, intel.compensation.currencySymbol)}</span>
                <span aria-hidden="true">·</span>
                <span>Equity: {formatCurrency(intel.compensation.equityAvg, intel.compensation.currency, intel.compensation.currencySymbol)}</span>
              </div>
            </div>

            {/* Top Tier / 90th Percentile */}
            <div className="bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-2xl p-6 shadow-xs space-y-2">
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                90th Percentile / Top Tier
              </span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-700 dark:text-emerald-300">
                {formatCurrency(intel.compensation.topTier, intel.compensation.currency, intel.compensation.currencySymbol)}
              </div>
              <p className="text-xs text-emerald-600/90 dark:text-emerald-400/90">
                Premium packages at tier-1 product organizations and high-scale tech firms.
              </p>
            </div>
          </div>

          {/* Visual Compensation Breakdown Chart & Market Indicators */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recharts Bar Chart */}
            <div className="lg:col-span-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                    Compensation Structure Breakdown
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Base Salary, Estimated Bonus, and Annual Equity ({intel.compensation.currency})
                  </p>
                </div>
              </div>

              <div className="h-64 sm:h-72 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis 
                      tick={{ fontSize: 11 }} 
                      tickFormatter={(val) => {
                        if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
                        if (val >= 1000) return `${(val / 1000).toFixed(0)}k`;
                        return `${val}`;
                      }}
                    />
                    <Tooltip 
                      formatter={(val: any) => formatCurrency(Number(val), intel.compensation.currency, intel.compensation.currencySymbol)}
                      contentStyle={{ 
                        borderRadius: '0.75rem',
                        fontSize: '12px',
                        backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                        borderColor: isDarkMode ? '#334155' : '#e2e8f0',
                        color: isDarkMode ? '#f8fafc' : '#0f172a'
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Bar dataKey="Base" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Base Salary" />
                    <Bar dataKey="Bonus" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Annual Bonus" />
                    <Bar dataKey="Equity" fill="#10b981" radius={[4, 4, 0, 0]} name="Stock / Equity" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Market Demand Indicators Card */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                  2026 Market Dynamics
                </h3>
                <p className="text-xs text-neutral-500">
                  Hiring conditions in {intel.locationLabel}
                </p>
              </div>

              <div className="space-y-3 flex-1 justify-center flex flex-col">
                <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800 text-xs">
                  <span className="text-neutral-500">Hiring Momentum</span>
                  <span className="font-bold text-neutral-900 dark:text-white">{intel.demandMetrics.demandScore}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800 text-xs">
                  <span className="text-neutral-500">YoY Salary Growth</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{intel.demandMetrics.growthRateYoY}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800 text-xs">
                  <span className="text-neutral-500">Remote Availability</span>
                  <span className="font-bold text-neutral-900 dark:text-white">{intel.demandMetrics.remoteAvailability}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800 text-xs">
                  <span className="text-neutral-500">Applicant Competition</span>
                  <span className="font-bold text-neutral-900 dark:text-white">{intel.demandMetrics.competitionIndex}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800 text-xs">
                  <span className="text-neutral-500">Average Time to Offer</span>
                  <span className="font-bold text-neutral-900 dark:text-white">{intel.demandMetrics.typicalTimeToHire}</span>
                </div>
              </div>
            </div>
          </div>

          {/* In-Demand Skills & Benefits Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top In-Demand Skills */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xs space-y-4">
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                  High-Impact Skill Premiums
                </h3>
                <p className="text-xs text-neutral-500">
                  Skills that correlate with higher compensation brackets in active listings
                </p>
              </div>

              <div className="space-y-2">
                {intel.topSkills.map((sk, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="font-semibold text-neutral-900 dark:text-white">{sk.skill}</span>
                    </div>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {sk.salaryImpact}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Employers & Common Benefits */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xs space-y-6">
              {/* Employers */}
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-1">
                  Active Hiring Employers
                </h3>
                <p className="text-xs text-neutral-500 mb-3">
                  Companies with recent hiring postings for this role
                </p>
                <div className="flex flex-wrap gap-2">
                  {intel.topHiringCompanies.map((comp, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center text-xs font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700"
                    >
                      <Building2 className="w-3.5 h-3.5 mr-1.5 text-neutral-400" />
                      {comp}
                    </span>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-1">
                  Typical Benefits & Perks Package
                </h3>
                <p className="text-xs text-neutral-500 mb-3">
                  Standard compensation extras identified across verified listings
                </p>
                <div className="space-y-1.5 text-xs text-neutral-700 dark:text-neutral-300">
                  {intel.commonBenefits.map((ben, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>{ben}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Google Search Grounding Sources Footnote */}
          {intel.sources && intel.sources.length > 0 && (
            <div className="bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 space-y-3">
              <div className="flex items-center space-x-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Verified Google Search Grounding Citations</span>
              </div>
              <p className="text-xs text-neutral-500">
                Market data is dynamically grounded in current 2026 salary reports, hiring records, and economic graphs retrieved through Gemini 3.5 Flash:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
                {intel.sources.map((src, idx) => (
                  <a
                    key={idx}
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700/80 hover:border-blue-400 dark:hover:border-blue-500 text-xs text-neutral-800 dark:text-neutral-200 hover:text-blue-600 dark:hover:text-blue-400 flex items-center justify-between transition-all group"
                  >
                    <span className="truncate mr-2 font-medium">{src.title}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 flex-shrink-0 text-neutral-400 group-hover:text-blue-600 transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
