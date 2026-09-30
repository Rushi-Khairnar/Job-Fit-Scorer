import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  Target, 
  Sparkles, 
  TrendingUp, 
  BookOpen, 
  HelpCircle, 
  FileText,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { getSkillLevel, getSkillLevelBadgeClasses } from '../skillLevels';

interface UnifiedModelGapCardProps {
  job: {
    role: string;
    description: string;
    tfidfScore: number;
    semanticScore: number;
    matchingSkills: string[];
    missingSkills: string[];
    radarData: Array<{ subject: string; student: number; ideal: number }>;
  };
  isDarkMode: boolean;
  onSelectRoadmap?: (role: string) => void;
  onSelectQuiz?: (role: string) => void;
  onBuildCV?: (role: string, matchingSkills: string[]) => void;
}

export const UnifiedModelGapCard: React.FC<UnifiedModelGapCardProps> = ({
  job,
  isDarkMode,
  onSelectRoadmap,
  onSelectQuiz,
  onBuildCV
}) => {
  const [expanded, setExpanded] = useState(false);
  const uplift = (job.semanticScore - job.tfidfScore).toFixed(1);
  const isPositive = Number(uplift) > 0;
  const isPerfectMatch = job.missingSkills.length === 0;

  return (
    <div className="border border-neutral-200 dark:border-neutral-700/80 rounded-2xl bg-white dark:bg-neutral-800 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Header Summary Row */}
      <div 
        className="p-6 cursor-pointer select-none hover:bg-neutral-50/60 dark:hover:bg-neutral-750/30 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Role & Match Status */}
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-3 flex-wrap">
                <h4 className="text-xl font-bold text-neutral-900 dark:text-white tracking-tight">{job.role}</h4>
                {isPerfectMatch ? (
                  <span className="inline-flex items-center text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Perfect Match
                  </span>
                ) : (
                  <span className="inline-flex items-center text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/40 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-800">
                    <AlertCircle className="w-3.5 h-3.5 mr-1" /> {job.missingSkills.length} Skills to Learn
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-1">
                {job.description}
              </p>
            </div>
          </div>

          {/* Unified Model Comparison Metric Cluster */}
          <div className="flex items-center space-x-3 sm:space-x-5 flex-wrap">
            {/* TF-IDF Baseline */}
            <div className="bg-neutral-100/80 dark:bg-neutral-900/60 px-3.5 py-2 rounded-xl border border-neutral-200/70 dark:border-neutral-700/60 text-center min-w-[90px]">
              <span className="block text-[11px] font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Base TF-IDF</span>
              <span className="text-base font-bold text-neutral-800 dark:text-neutral-200">{job.tfidfScore}%</span>
            </div>

            {/* Semantic Model Score */}
            <div className="bg-blue-50/90 dark:bg-blue-950/40 px-4 py-2 rounded-xl border border-blue-200 dark:border-blue-800/70 text-center min-w-[105px]">
              <span className="block text-[11px] font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center justify-center">
                <Sparkles className="w-3 h-3 mr-1" /> Semantic
              </span>
              <span className="text-base font-extrabold text-blue-700 dark:text-blue-300">{job.semanticScore}%</span>
            </div>

            {/* Semantic Uplift */}
            <div className="hidden sm:flex flex-col items-center justify-center min-w-[75px]">
              <span className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500 uppercase">Uplift</span>
              <span className={`text-sm font-semibold flex items-center ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-neutral-500'}`}>
                <TrendingUp className="w-3.5 h-3.5 mr-1" />
                {isPositive ? `+${uplift}%` : `${uplift}%`}
              </span>
            </div>

            {/* Toggle Arrow */}
            <div className={`p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors ml-2 ${expanded ? 'bg-neutral-100 dark:bg-neutral-700 text-blue-600' : 'text-neutral-400'}`}>
              {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </div>
        </div>

        {/* Quick Skills Preview Bar */}
        <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-700/50 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wide mr-2 flex items-center">
            <Layers className="w-3.5 h-3.5 mr-1" /> Snapshot:
          </span>
          {job.matchingSkills.slice(0, 3).map(skill => (
            <span key={skill} className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40 capitalize">
              ✓ {skill}
            </span>
          ))}
          {job.missingSkills.slice(0, 3).map(skill => (
            <span key={skill} className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/40 capitalize">
              ✕ {skill} ({getSkillLevel(skill)})
            </span>
          ))}
          {(job.matchingSkills.length + job.missingSkills.length > 6) && (
            <span className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">
              +{job.matchingSkills.length + job.missingSkills.length - 6} more
            </span>
          )}
        </div>
      </div>

      {/* Expanded Deep-Dive Details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="border-t border-neutral-200/80 dark:border-neutral-700/80 bg-neutral-50/50 dark:bg-neutral-850/50"
          >
            <div className="p-6 md:p-8 space-y-8">
              {/* Side-by-Side Skill Breakdown with Needed Levels */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Matching Skills */}
                <div className="bg-white dark:bg-neutral-800 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="font-bold text-neutral-900 dark:text-white flex items-center text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2" />
                      Matching Profile Skills ({job.matchingSkills.length})
                    </h5>
                    <span className="text-xs text-neutral-400 dark:text-neutral-500">Acquired</span>
                  </div>
                  {job.matchingSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {job.matchingSkills.map(skill => {
                        const level = getSkillLevel(skill);
                        const badgeStyle = getSkillLevelBadgeClasses(level);
                        return (
                          <div 
                            key={skill}
                            className={`px-3 py-1.5 rounded-xl border ${badgeStyle.border} ${badgeStyle.bg} flex items-center space-x-2`}
                          >
                            <span className="text-xs font-semibold capitalize text-neutral-800 dark:text-neutral-100">{skill}</span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-white/70 dark:bg-black/40 ${badgeStyle.text}`}>
                              {level}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 italic">No matching skills detected for this role.</p>
                  )}
                </div>

                {/* Skill Gaps (Missing) with Needed Proficiency Level */}
                <div className="bg-white dark:bg-neutral-800 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="font-bold text-neutral-900 dark:text-white flex items-center text-sm">
                      <AlertCircle className="w-4 h-4 text-rose-500 mr-2" />
                      Skill Gaps & Required Level ({job.missingSkills.length})
                    </h5>
                    <span className="text-xs text-rose-600 dark:text-rose-400 font-medium">Needed</span>
                  </div>
                  {job.missingSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {job.missingSkills.map(skill => {
                        const neededLevel = getSkillLevel(skill);
                        const badgeStyle = getSkillLevelBadgeClasses(neededLevel);
                        return (
                          <div 
                            key={skill}
                            className="px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/70 dark:bg-rose-950/30 flex items-center space-x-2"
                          >
                            <span className="text-xs font-semibold capitalize text-rose-900 dark:text-rose-200">{skill}</span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${badgeStyle.bg} ${badgeStyle.text} border ${badgeStyle.border}`}>
                              Need: {neededLevel}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-1.5" /> Congratulations! You meet all listed technical requirements for this role.
                    </p>
                  )}
                </div>
              </div>

              {/* Radar Chart & Role Analytics */}
              <div className="bg-white dark:bg-neutral-800 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-xs">
                <h5 className="font-bold text-neutral-900 dark:text-white text-sm mb-4 flex items-center">
                  <Sparkles className="w-4 h-4 text-blue-500 mr-2" />
                  Candidate Proficiency vs Ideal Role Benchmark
                </h5>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={job.radarData}>
                      <PolarGrid stroke={isDarkMode ? "#374151" : "#e5e7eb"} />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: isDarkMode ? '#9ca3af' : '#4b5563', fontSize: 12 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} stroke={isDarkMode ? "#4b5563" : "#d1d5db"} />
                      <Radar name="Student Proficiency" dataKey="student" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.4} />
                      <Radar name="Target Benchmark" dataKey="ideal" stroke="#10b981" fill="#10b981" fillOpacity={0.15} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: isDarkMode ? '#1f2937' : '#ffffff', 
                          borderColor: isDarkMode ? '#374151' : '#e5e7eb',
                          color: isDarkMode ? '#ffffff' : '#000000',
                          borderRadius: '8px'
                        }} 
                      />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Action Toolbar for the Role */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="text-xs text-neutral-500 dark:text-neutral-400">
                  Ready to bridge these gaps or target this role?
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {onSelectRoadmap && (
                    <button
                      onClick={() => onSelectRoadmap(job.role)}
                      className="px-3.5 py-2 bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors flex items-center border border-blue-200 dark:border-blue-800"
                    >
                      <BookOpen className="w-3.5 h-3.5 mr-1.5" />
                      View Learning Roadmap
                    </button>
                  )}
                  {onSelectQuiz && (
                    <button
                      onClick={() => onSelectQuiz(job.role)}
                      className="px-3.5 py-2 bg-purple-50 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs font-semibold rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/60 transition-colors flex items-center border border-purple-200 dark:border-purple-800"
                    >
                      <HelpCircle className="w-3.5 h-3.5 mr-1.5" />
                      Practice MCQ Quiz
                    </button>
                  )}
                  {onBuildCV && (
                    <button
                      onClick={() => onBuildCV(job.role, job.matchingSkills)}
                      className="px-3.5 py-2 bg-emerald-600 dark:bg-emerald-500 text-white text-xs font-semibold rounded-xl hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-colors flex items-center shadow-sm"
                    >
                      <FileText className="w-3.5 h-3.5 mr-1.5" />
                      Build CV for this Role
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
