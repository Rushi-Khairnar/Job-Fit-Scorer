import React, { useState, useEffect } from 'react';
import { 
  X, 
  Globe, 
  TrendingUp, 
  Briefcase, 
  Building2, 
  CheckCircle2, 
  ExternalLink, 
  Sparkles, 
  RefreshCw, 
  DollarSign, 
  Compass, 
  ArrowUpRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { RealtimeMarketIntel } from '../types/marketIntel';
import { 
  SUPPORTED_LOCATIONS, 
  formatCurrency, 
  fetchMarketIntel 
} from '../services/marketIntelService';

interface LiveIntelModalProps {
  role: string;
  isOpen: boolean;
  onClose: () => void;
  onOpenFullExplorer?: (role: string, locationKey: string) => void;
  isDarkMode?: boolean;
}

export const LiveIntelModal: React.FC<LiveIntelModalProps> = ({
  role,
  isOpen,
  onClose,
  onOpenFullExplorer,
  isDarkMode = false
}) => {
  const [selectedLocationKey, setSelectedLocationKey] = useState<string>('india-bangalore');
  const [experienceLevel, setExperienceLevel] = useState<'Junior' | 'Mid' | 'Senior' | 'Lead / Staff'>('Senior');
  const [intel, setIntel] = useState<RealtimeMarketIntel | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !role) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    fetchMarketIntel({
      role,
      locationKey: selectedLocationKey,
      experienceLevel
    })
      .then((data) => {
        if (isMounted) {
          setIntel(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Failed to load intelligence');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [role, selectedLocationKey, experienceLevel, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 sm:p-6 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-xs text-blue-600 dark:text-blue-400 font-medium">
              <Globe className="w-3.5 h-3.5 animate-pulse" />
              <span>Real-Time Google Search Grounding</span>
              <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">·</span>
              <span className="text-neutral-500 dark:text-neutral-400">Gemini 3.5 Flash</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-neutral-950 dark:text-white tracking-tight">
              {role}
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Live compensation bands, market demand velocity, and verified tech requirements.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-200/50 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls Row */}
        <div className="px-5 sm:px-6 py-3 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/30 dark:bg-neutral-900/30 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 flex-1 min-w-[200px]">
            <span className="text-neutral-500 dark:text-neutral-400 font-medium">Location:</span>
            <select
              value={selectedLocationKey}
              onChange={(e) => setSelectedLocationKey(e.target.value)}
              className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-1.5 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium cursor-pointer"
            >
              {SUPPORTED_LOCATIONS.map((loc) => (
                <option key={loc.key} value={loc.key}>
                  {loc.label} ({loc.currencySymbol} {loc.currency})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-1 bg-neutral-200/50 dark:bg-neutral-800/80 p-1 rounded-xl">
            {(['Junior', 'Mid', 'Senior', 'Lead / Staff'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setExperienceLevel(lvl)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  experienceLevel === lvl
                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {loading ? (
            <div className="py-16 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin mx-auto" />
              <div className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                Grounding with Google Search...
              </div>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Extracting current 2026 market benchmarks, hiring velocity, and compensation percentiles for {role}.
              </p>
            </div>
          ) : error ? (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 flex items-start space-x-3 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Unable to fetch live search grounding</p>
                <p className="mt-1">{error}</p>
              </div>
            </div>
          ) : intel ? (
            <>
              {/* Overview Prose */}
              <div className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-2xl border border-neutral-100 dark:border-neutral-800">
                <p>{intel.overview}</p>
                <div className="mt-2 flex items-center gap-2 text-[11px] text-neutral-500">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {intel.isLiveGrounded ? '● Live Search Grounded' : '○ Verified Market Baseline'}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{intel.locationLabel}</span>
                  <span aria-hidden="true">·</span>
                  <span>{intel.demandMetrics.growthRateYoY}</span>
                </div>
              </div>

              {/* Compensation Triad */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    2026 Compensation Range ({intel.compensation.currency})
                  </span>
                  <span className="text-xs text-neutral-500">
                    Annual Total Target Compensation
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* 25th Percentile */}
                  <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/70 border border-neutral-200/70 dark:border-neutral-700/60">
                    <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block">
                      Entry / 25th Percentile
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white mt-1 block">
                      {formatCurrency(intel.compensation.entryLevel, intel.compensation.currency, intel.compensation.currencySymbol)}
                    </span>
                    <span className="text-[11px] text-neutral-500 mt-1 block">Baseline competitive entry</span>
                  </div>

                  {/* Median / 50th Percentile */}
                  <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/80 relative">
                    <div className="absolute top-2.5 right-2.5 text-[10px] font-bold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/60 px-2 py-0.5 rounded-full">
                      Market Median
                    </div>
                    <span className="text-[11px] font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                      Typical / 50th Percentile
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-blue-700 dark:text-blue-300 mt-1 block">
                      {formatCurrency(intel.compensation.median, intel.compensation.currency, intel.compensation.currencySymbol)}
                    </span>
                    <span className="text-[11px] text-blue-600/80 dark:text-blue-400/80 mt-1 block">
                      Avg. Bonus: {formatCurrency(intel.compensation.bonusAvg, intel.compensation.currency, intel.compensation.currencySymbol)}
                    </span>
                  </div>

                  {/* Top Tier / 90th Percentile */}
                  <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80">
                    <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                      Top 10% / High Tier
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-emerald-700 dark:text-emerald-300 mt-1 block">
                      {formatCurrency(intel.compensation.topTier, intel.compensation.currency, intel.compensation.currencySymbol)}
                    </span>
                    <span className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 mt-1 block">
                      Stock / Equity: ~{formatCurrency(intel.compensation.equityAvg, intel.compensation.currency, intel.compensation.currencySymbol)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Demand & Velocity Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700/60 text-center">
                  <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">Hiring Velocity</span>
                  <span className="text-sm font-bold text-neutral-900 dark:text-white mt-0.5 block">{intel.demandMetrics.demandScore}</span>
                </div>
                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700/60 text-center">
                  <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">Remote Flex</span>
                  <span className="text-sm font-bold text-neutral-900 dark:text-white mt-0.5 block">{intel.demandMetrics.remoteAvailability}</span>
                </div>
                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700/60 text-center">
                  <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">Competition</span>
                  <span className="text-sm font-bold text-neutral-900 dark:text-white mt-0.5 block">{intel.demandMetrics.competitionIndex}</span>
                </div>
                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700/60 text-center">
                  <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">Time to Offer</span>
                  <span className="text-sm font-bold text-neutral-900 dark:text-white mt-0.5 block">{intel.demandMetrics.typicalTimeToHire}</span>
                </div>
              </div>

              {/* In-Demand Skills & Salary Impact */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 block">
                  Top High-Leverage Skills in Active Postings
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {intel.topSkills.map((sk, idx) => (
                    <div 
                      key={idx}
                      className="p-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700/80 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        <span className="font-semibold text-neutral-900 dark:text-white">{sk.skill}</span>
                      </div>
                      <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                        {sk.salaryImpact}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Hiring Companies */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 block">
                  Leading Employers Actively Hiring
                </span>
                <div className="flex flex-wrap gap-2">
                  {intel.topHiringCompanies.map((comp, idx) => (
                    <span 
                      key={idx}
                      className="inline-flex items-center text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700"
                    >
                      <Building2 className="w-3.5 h-3.5 mr-1.5 text-neutral-400" />
                      {comp}
                    </span>
                  ))}
                </div>
              </div>

              {/* Grounding Source Links Footnote */}
              {intel.sources && intel.sources.length > 0 && (
                <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 space-y-2">
                  <div className="flex items-center space-x-1.5 text-[11px] text-neutral-500 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Grounding Sources Verified via Google Search:</span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {intel.sources.map((src, idx) => (
                      <a
                        key={idx}
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-700 dark:hover:text-blue-300"
                      >
                        <span>{src.title}</span>
                        <ArrowUpRight className="w-3 h-3 ml-0.5" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-neutral-500">
            Real-time data grounded via Google Search & Gemini 3.5 Flash
          </div>
          <div className="flex items-center space-x-2">
            {onOpenFullExplorer && (
              <button
                onClick={() => {
                  onClose();
                  onOpenFullExplorer(role, selectedLocationKey);
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center transition-colors shadow-xs cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5 mr-1.5" />
                Open Full Market Explorer
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
