import React, { useState } from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  Search, 
  Clock, 
  Target, 
  ExternalLink, 
  CheckSquare, 
  Square,
  Sparkles,
  Award,
  Layers
} from 'lucide-react';
import { JOB_DIRECTORY_DATA } from '../jobsData';
import { getSkillLevel, getSkillLevelBadgeClasses } from '../skillLevels';

interface RoadmapSectionProps {
  initialRole?: string;
  onTakeQuiz?: (role: string) => void;
  onBuildCV?: (role: string, skills: string[]) => void;
  onBackToHome?: () => void;
  completedMilestones?: string[];
  onToggleMilestone?: (milestoneKey: string) => void;
}

export const RoadmapSection: React.FC<RoadmapSectionProps> = ({
  initialRole,
  onTakeQuiz,
  onBuildCV,
  onBackToHome,
  completedMilestones,
  onToggleMilestone
}) => {
  const [selectedRoleTitle, setSelectedRoleTitle] = useState<string>(() => {
    if (initialRole) {
      const match = JOB_DIRECTORY_DATA.find(j => j.title.toLowerCase().includes(initialRole.toLowerCase()));
      if (match) return match.title;
    }
    return JOB_DIRECTORY_DATA[0].title;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  const filteredRoles = JOB_DIRECTORY_DATA.filter(role => 
    role.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentRole = JOB_DIRECTORY_DATA.find(r => r.title === selectedRoleTitle) || JOB_DIRECTORY_DATA[0];

  const isStepCompleted = (stepKey: string) => {
    if (completedMilestones) {
      return completedMilestones.includes(stepKey);
    }
    return !!completedSteps[stepKey];
  };

  const toggleStep = (stepKey: string) => {
    if (onToggleMilestone) {
      onToggleMilestone(stepKey);
    }
    setCompletedSteps(prev => ({ ...prev, [stepKey]: !prev[stepKey] }));
  };

  // Structured multi-stage milestone roadmap
  const enrichedRoadmapStages = [
    {
      stage: 'Phase 1: Foundations & Core Concepts',
      duration: 'Weeks 1 – 4',
      milestones: [
        {
          title: currentRole.roadmap[0]?.title || 'Fundamental Principles',
          description: currentRole.roadmap[0]?.desc || 'Core programming logic, basic data structures, and algorithmic foundations.',
          keySkills: currentRole.skills.slice(0, 2)
        },
        {
          title: 'Version Control & Clean Code Habits',
          description: 'Git branching, commit hygiene, semantic versioning, and command line productivity.',
          keySkills: ['Git', 'Command Line']
        }
      ]
    },
    {
      stage: 'Phase 2: Frameworks, Tooling & Databases',
      duration: 'Weeks 5 – 8',
      milestones: [
        {
          title: currentRole.roadmap[1]?.title || 'Industry Frameworks',
          description: currentRole.roadmap[1]?.desc || 'Working with professional libraries, API integration, and database schemas.',
          keySkills: currentRole.skills.slice(1, 4)
        },
        {
          title: 'Database & State Management',
          description: 'Relational or NoSQL storage, indexing, data normalization, and asynchronous handling.',
          keySkills: ['SQL', 'Data Modeling']
        }
      ]
    },
    {
      stage: 'Phase 3: Real-World Architecture & Deployment',
      duration: 'Weeks 9 – 12',
      milestones: [
        {
          title: currentRole.roadmap[2]?.title || 'System Architecture',
          description: currentRole.roadmap[2]?.desc || 'Containerization, automated unit tests, and production cloud setup.',
          keySkills: currentRole.skills.slice(2, 5)
        },
        {
          title: 'Cloud & CI/CD Pipelines',
          description: 'Automated GitHub Actions workflows, container build, and deployment monitoring.',
          keySkills: ['Docker', 'CI/CD']
        }
      ]
    },
    {
      stage: 'Phase 4: Capstone Portfolio & Interview Prep',
      duration: 'Weeks 13 – 16',
      milestones: [
        {
          title: 'End-to-End Production Capstone',
          description: `Build and deploy a complete production-grade application showcasing ${currentRole.title} best practices.`,
          keySkills: currentRole.skills.slice(0, 4)
        },
        {
          title: 'Technical Interview & System Design',
          description: 'Mock interviews, scenario analysis, portfolio documentation, and live resume optimization.',
          keySkills: ['System Design', 'Communication']
        }
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div className="bg-white dark:bg-neutral-800 rounded-3xl p-6 md:p-8 border border-neutral-200 dark:border-neutral-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold mb-2 border border-blue-200 dark:border-blue-800">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Step-by-Step Learning <span className="opacity-70 font-normal">[Role Roadmaps]</span></span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white">Learning Roadmaps</h2>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">
            Easy step-by-step guides showing exactly what to study, week-by-week, to land your dream job.
          </p>
        </div>

        {/* Quick Search */}
        <div className="relative min-w-[280px]">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search any job role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-neutral-800 dark:text-neutral-200"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Role Selector Directory */}
        <div className="lg:col-span-4 bg-white dark:bg-neutral-800 rounded-3xl p-4 border border-neutral-200 dark:border-neutral-700 shadow-sm max-h-[700px] overflow-y-auto space-y-2">
          <div className="px-3 py-2 text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
            Available Career Paths ({filteredRoles.length})
          </div>
          {filteredRoles.map(role => {
            const isSelected = role.title === currentRole.title;
            return (
              <button
                key={role.title}
                onClick={() => setSelectedRoleTitle(role.title)}
                className={`w-full text-left p-3.5 rounded-2xl transition-all border ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100 shadow-xs' 
                    : 'border-transparent hover:border-neutral-200 dark:hover:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm">{role.title}</h4>
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    {role.salaryIndia.split('-')[0].trim()}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {role.skills.slice(0, 3).map(skill => (
                    <span key={skill} className="text-[10px] px-2 py-0.5 rounded-md bg-white dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 border border-neutral-200/60 dark:border-neutral-600">
                      {skill}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column: Detailed Roadmap Timeline */}
        <div className="lg:col-span-8 space-y-6">
          {/* Current Role Banner */}
          <div className="bg-white dark:bg-neutral-800 rounded-3xl p-6 md:p-8 border border-neutral-200 dark:border-neutral-700 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 dark:border-neutral-700 pb-6">
              <div>
                <h3 className="text-2xl font-bold text-neutral-900 dark:text-white flex items-center">
                  <Target className="w-6 h-6 text-blue-600 mr-2" />
                  {currentRole.title} Roadmap
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  Average compensation range in India: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{currentRole.salaryIndia}</span>
                </p>
              </div>

              <div className="flex items-center space-x-2">
                {onTakeQuiz && (
                  <button
                    onClick={() => onTakeQuiz(currentRole.title)}
                    className="px-3.5 py-2 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-xs font-semibold rounded-xl hover:bg-purple-100 transition-colors border border-purple-200 dark:border-purple-800"
                  >
                    Take Role Quiz
                  </button>
                )}
                {onBuildCV && (
                  <button
                    onClick={() => onBuildCV(currentRole.title, currentRole.skills)}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
                  >
                    Build CV for Role
                  </button>
                )}
              </div>
            </div>

            {/* Core Required Skills with Level Badges */}
            <div className="pt-6">
              <h4 className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-3">
                Key Required Skills & Proficiency Level
              </h4>
              <div className="flex flex-wrap gap-2">
                {currentRole.skills.map(skill => {
                  const level = getSkillLevel(skill);
                  const badgeStyle = getSkillLevelBadgeClasses(level);
                  return (
                    <div 
                      key={skill}
                      className={`px-3 py-1.5 rounded-xl border ${badgeStyle.border} ${badgeStyle.bg} flex items-center space-x-2`}
                    >
                      <span className="text-xs font-semibold capitalize text-neutral-800 dark:text-neutral-200">{skill}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-white/80 dark:bg-black/40 ${badgeStyle.text}`}>
                        {level}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 4-Stage Timeline */}
          <div className="space-y-6">
            {enrichedRoadmapStages.map((stage, sIdx) => (
              <div 
                key={sIdx}
                className="bg-white dark:bg-neutral-800 rounded-3xl p-6 md:p-8 border border-neutral-200 dark:border-neutral-700 shadow-sm relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-100 dark:border-neutral-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
                      {sIdx + 1}
                    </div>
                    <h4 className="font-bold text-lg text-neutral-900 dark:text-white">{stage.stage}</h4>
                  </div>
                  <div className="flex items-center text-xs font-semibold text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-700 px-3 py-1.5 rounded-full">
                    <Clock className="w-3.5 h-3.5 mr-1" />
                    {stage.duration}
                  </div>
                </div>

                <div className="space-y-5">
                  {stage.milestones.map((m, mIdx) => {
                    const stepKey = `${currentRole.title}-${sIdx}-${mIdx}`;
                    const isDone = isStepCompleted(stepKey);

                    return (
                      <div 
                        key={mIdx}
                        className={`p-4 rounded-2xl border transition-all ${
                          isDone 
                            ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60' 
                            : 'bg-neutral-50/50 dark:bg-neutral-800/60 border-neutral-200/80 dark:border-neutral-700/60'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start space-x-3">
                            <button
                              onClick={() => toggleStep(stepKey)}
                              className="mt-0.5 text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                              title={isDone ? "Mark as in-progress" : "Mark as completed"}
                            >
                              {isDone ? (
                                <CheckSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                              ) : (
                                <Square className="w-5 h-5" />
                              )}
                            </button>
                            <div>
                              <h5 className={`font-semibold text-base ${isDone ? 'line-through text-neutral-500' : 'text-neutral-900 dark:text-white'}`}>
                                {m.title}
                              </h5>
                              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                                {m.description}
                              </p>
                              <div className="flex flex-wrap items-center gap-2 mt-3">
                                {m.keySkills.map(sk => (
                                  <span key={sk} className="text-xs px-2.5 py-0.5 bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-md font-medium text-neutral-700 dark:text-neutral-300">
                                    {sk}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          <a
                            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${m.title} ${currentRole.title} full course tutorial`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition-colors flex-shrink-0"
                          >
                            <ExternalLink className="w-3.5 h-3.5 mr-1" /> Tutorials
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
