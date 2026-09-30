import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Sparkles, 
  Compass, 
  Building2, 
  Rocket, 
  ShieldCheck, 
  Layers, 
  CheckCircle2, 
  HelpCircle,
  TrendingUp,
  Zap,
  Users,
  Briefcase
} from 'lucide-react';

interface CultureQuestion {
  id: string;
  category: string;
  question: string;
  optionA: { label: string; desc: string; startupPts: number; bigTechPts: number; remotePts: number };
  optionB: { label: string; desc: string; startupPts: number; bigTechPts: number; remotePts: number };
}

export const CultureAlignment: React.FC = () => {
  const [answers, setAnswers] = useState<Record<string, 'A' | 'B'>>({
    q1: 'A',
    q2: 'A',
    q3: 'A',
    q4: 'B',
    q5: 'A'
  });

  const QUESTIONS: CultureQuestion[] = [
    {
      id: 'q1',
      category: 'Shipping Pace & Velocity',
      question: 'When developing features, which approach feels most natural to you?',
      optionA: {
        label: 'Fast MVP Iteration',
        desc: 'Ship functional code quickly, test with real users, and refine based on live feedback.',
        startupPts: 25,
        bigTechPts: 5,
        remotePts: 15
      },
      optionB: {
        label: 'High-Rigor Quality Assurance',
        desc: 'Take extra time upfront for extensive automated tests, RFC reviews, and zero-defect stability.',
        startupPts: 5,
        bigTechPts: 25,
        remotePts: 15
      }
    },
    {
      id: 'q2',
      category: 'Workstyle & Autonomy',
      question: 'How do you prefer project tasks and priorities to be structured?',
      optionA: {
        label: 'High Autonomy & Open Ambiguity',
        desc: 'Given a high-level outcome, you figure out the architecture, tools, and execution steps yourself.',
        startupPts: 25,
        bigTechPts: 10,
        remotePts: 25
      },
      optionB: {
        label: 'Defined Specs & Clear Guidelines',
        desc: 'Prefer well-scoped user stories, established engineering standards, and clear sprint roadmaps.',
        startupPts: 5,
        bigTechPts: 25,
        remotePts: 10
      }
    },
    {
      id: 'q3',
      category: 'Daily Communication',
      question: 'What is your ideal balance of meetings vs deep focused work?',
      optionA: {
        label: 'Async-First & Minimal Meetings',
        desc: 'Write clear PR descriptions, use Slack/Loom, and protect long blocks of uninterrupted focus time.',
        startupPts: 15,
        bigTechPts: 10,
        remotePts: 30
      },
      optionB: {
        label: 'Interactive Daily Collaboration',
        desc: 'Frequent syncs, pair programming, whiteboard brainstorming, and quick spontaneous calls.',
        startupPts: 20,
        bigTechPts: 20,
        remotePts: 5
      }
    },
    {
      id: 'q4',
      category: 'Company Environment',
      question: 'Which organization size and team structure excites you most?',
      optionA: {
        label: 'Small Tight-Knit Team (< 25 people)',
        desc: 'Everyone wears multiple hats, you touch everything, and your code impacts the entire company tomorrow.',
        startupPts: 30,
        bigTechPts: 0,
        remotePts: 15
      },
      optionB: {
        label: 'Established Enterprise (> 500 people)',
        desc: 'Specialized roles, dedicated infrastructure/security teams, clear career leveling ladders, and high stability.',
        startupPts: 5,
        bigTechPts: 30,
        remotePts: 15
      }
    },
    {
      id: 'q5',
      category: 'Risk & Compensation',
      question: 'What compensation package would you rather negotiate?',
      optionA: {
        label: 'Equity Upside & High Ownership',
        desc: 'Willing to accept reasonable salary if paired with meaningful stock options with 10x-50x growth potential.',
        startupPts: 25,
        bigTechPts: 10,
        remotePts: 15
      },
      optionB: {
        label: 'High Base Salary & Predictability',
        desc: 'Prioritize top-tier base pay, generous bonuses, 401(k)/PF matching, and predictable benefits.',
        startupPts: 5,
        bigTechPts: 30,
        remotePts: 15
      }
    }
  ];

  // Calculate scores
  let startupScore = 20;
  let bigTechScore = 20;
  let remoteScore = 25;

  QUESTIONS.forEach((q) => {
    const choice = answers[q.id];
    const data = choice === 'A' ? q.optionA : q.optionB;
    startupScore += data.startupPts;
    bigTechScore += data.bigTechPts;
    remoteScore += data.remotePts;
  });

  const total = startupScore + bigTechScore + remoteScore;
  const startupPct = Math.round((startupScore / total) * 100);
  const bigTechPct = Math.round((bigTechScore / total) * 100);
  const remotePct = Math.round((remoteScore / total) * 100);

  // Highest match
  const bestMatch = startupPct >= bigTechPct && startupPct >= remotePct
    ? { title: 'Early-Stage Startup & High-Growth Scale-Up', icon: Rocket, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/40', border: 'border-amber-200 dark:border-amber-800' }
    : bigTechPct >= remotePct
      ? { title: 'Big Tech & Established Enterprise', icon: Building2, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/40', border: 'border-blue-200 dark:border-blue-800' }
      : { title: 'Async-First Distributed & Remote Teams', icon: Compass, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/40', border: 'border-emerald-200 dark:border-emerald-800' };

  const BestIcon = bestMatch.icon;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-neutral-800 rounded-3xl p-6 sm:p-8 border border-neutral-200 dark:border-neutral-700 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-pink-50 dark:bg-pink-950/50 text-pink-700 dark:text-pink-300 text-xs font-semibold mb-2.5 border border-pink-200 dark:border-pink-800">
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>Work Environment Fit <span className="opacity-70 font-normal">[Culture Alignment]</span></span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white">
              Work Culture Fit Assessment
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1 max-w-2xl">
              Answer 5 simple everyday preferences to find whether you will thrive most in a fast-paced Startup, established Big Tech, or an Async Remote team.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Questions List */}
        <div className="lg:col-span-7 space-y-4">
          {QUESTIONS.map((q, idx) => {
            const currentChoice = answers[q.id];
            return (
              <div
                key={q.id}
                className="bg-white dark:bg-neutral-800 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-700 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                    Question {idx + 1} of {QUESTIONS.length} · {q.category}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white">
                  {q.question}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Option A */}
                  <button
                    type="button"
                    onClick={() => setAnswers({ ...answers, [q.id]: 'A' })}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      currentChoice === 'A'
                        ? 'bg-blue-50/80 dark:bg-blue-950/50 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                        : 'bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-neutral-900 dark:text-white">
                        {q.optionA.label}
                      </span>
                      {currentChoice === 'A' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                    </div>
                    <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {q.optionA.desc}
                    </p>
                  </button>

                  {/* Option B */}
                  <button
                    type="button"
                    onClick={() => setAnswers({ ...answers, [q.id]: 'B' })}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      currentChoice === 'B'
                        ? 'bg-blue-50/80 dark:bg-blue-950/50 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                        : 'bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-neutral-900 dark:text-white">
                        {q.optionB.label}
                      </span>
                      {currentChoice === 'B' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                    </div>
                    <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {q.optionB.desc}
                    </p>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Culture Fit Results Card */}
        <div className="lg:col-span-5 bg-white dark:bg-neutral-800 rounded-3xl p-6 sm:p-8 border border-neutral-200 dark:border-neutral-700 shadow-xs space-y-6 sticky top-24">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Your Primary Workstyle Match
            </span>
            <div className={`mt-3 p-4 rounded-2xl ${bestMatch.bg} border ${bestMatch.border} flex items-center space-x-3.5`}>
              <div className={`p-2.5 rounded-xl bg-white dark:bg-neutral-800 shadow-xs ${bestMatch.color}`}>
                <BestIcon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-neutral-900 dark:text-white leading-tight">
                  {bestMatch.title}
                </h4>
                <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  Best match based on your answers
                </span>
              </div>
            </div>
          </div>

          {/* Breakdown Bars */}
          <div className="space-y-4 pt-2 border-t border-neutral-100 dark:border-neutral-700">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Company Archetype Breakdown
            </h4>

            {/* Startup */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="flex items-center text-neutral-800 dark:text-neutral-200">
                  <Rocket className="w-3.5 h-3.5 mr-1.5 text-amber-500" /> Startups & Early Scale-Ups
                </span>
                <span>{startupPct}%</span>
              </div>
              <div className="h-2 rounded-full bg-neutral-100 dark:bg-neutral-900 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${startupPct}%` }} />
              </div>
            </div>

            {/* Big Tech */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="flex items-center text-neutral-800 dark:text-neutral-200">
                  <Building2 className="w-3.5 h-3.5 mr-1.5 text-blue-500" /> Big Tech & Enterprise
                </span>
                <span>{bigTechPct}%</span>
              </div>
              <div className="h-2 rounded-full bg-neutral-100 dark:bg-neutral-900 overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${bigTechPct}%` }} />
              </div>
            </div>

            {/* Remote */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="flex items-center text-neutral-800 dark:text-neutral-200">
                  <Compass className="w-3.5 h-3.5 mr-1.5 text-emerald-500" /> Distributed Async Remote
                </span>
                <span>{remotePct}%</span>
              </div>
              <div className="h-2 rounded-full bg-neutral-100 dark:bg-neutral-900 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${remotePct}%` }} />
              </div>
            </div>
          </div>

          {/* Reverse Questions to Ask in Interviews */}
          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700/80 space-y-2">
            <span className="text-xs font-bold text-neutral-800 dark:text-white block">
              💡 Reverse Question to Ask Interviewers:
            </span>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 italic leading-relaxed">
              "How are disagreements resolved when engineering and product leadership disagree on technical debt vs shipping speed?"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
