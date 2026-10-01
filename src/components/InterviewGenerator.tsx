import React, { useState, useEffect } from 'react';
import { 
  BrainCircuit, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  BookOpen,
  Award,
  Search,
  Check,
  RotateCcw,
  CheckSquare,
  Square
} from 'lucide-react';
import { INTERVIEW_QUESTIONS_DATA, QuestionItem } from '../interviewQuestionsData';

export const InterviewGenerator: React.FC<{
  targetRole?: string;
  missingSkills?: string[];
}> = ({ targetRole = 'Data Scientist', missingSkills = [] }) => {
  const availableRoles = Object.keys(INTERVIEW_QUESTIONS_DATA);

  const [selectedRole, setSelectedRole] = useState(() => {
    if (INTERVIEW_QUESTIONS_DATA[targetRole]) return targetRole;
    return availableRoles[0];
  });

  const [activeCategory, setActiveCategory] = useState<'All' | 'Technical' | 'Behavioral' | 'System Design'>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [userNotes, setUserNotes] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('interview_user_notes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [practicedMap, setPracticedMap] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('interview_practiced_questions');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Save notes to localStorage
  const handleNoteChange = (qId: string, text: string) => {
    const updated = { ...userNotes, [qId]: text };
    setUserNotes(updated);
    try {
      localStorage.setItem('interview_user_notes', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Toggle practiced state
  const handleTogglePracticed = (qId: string) => {
    const updated = { ...practicedMap, [qId]: !practicedMap[qId] };
    setPracticedMap(updated);
    try {
      localStorage.setItem('interview_practiced_questions', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetPracticedForRole = () => {
    const questionsForCurrentRole = INTERVIEW_QUESTIONS_DATA[selectedRole] || [];
    const updated = { ...practicedMap };
    questionsForCurrentRole.forEach(q => {
      delete updated[q.id];
    });
    setPracticedMap(updated);
    try {
      localStorage.setItem('interview_practiced_questions', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const questions = INTERVIEW_QUESTIONS_DATA[selectedRole] || INTERVIEW_QUESTIONS_DATA['Software Engineer'];

  const categoryCounts = {
    All: questions.length,
    Technical: questions.filter(q => q.category === 'Technical').length,
    'System Design': questions.filter(q => q.category === 'System Design').length,
    Behavioral: questions.filter(q => q.category === 'Behavioral').length,
  };

  const practicedCount = questions.filter(q => practicedMap[q.id]).length;
  const practicedPercent = Math.round((practicedCount / questions.length) * 100);

  const filteredQuestions = questions.filter(q => {
    const matchCat = activeCategory === 'All' || q.category === activeCategory;
    const matchSearch = searchQuery.trim() === '' || 
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.targetSkill.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-neutral-800 rounded-3xl p-6 sm:p-8 border border-neutral-200 dark:border-neutral-700 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-2.5 border border-blue-200 dark:border-blue-800">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interview Coaching · <strong>10 In-Depth Questions Per Role</strong></span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white">
              Interview Prep Coach
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1 max-w-2xl">
              10 comprehensive, real-world questions per role across Technical concepts, System Design architectures, and Behavioral STAR scenarios with model answers.
            </p>
          </div>

          {/* Role Picker Dropdown */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider shrink-0">
              Target Role:
            </label>
            <select
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e.target.value);
                setExpandedId(null);
              }}
              className="px-3.5 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-xs font-bold text-neutral-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            >
              {availableRoles.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Practice Progress Bar Banner */}
        <div className="mt-6 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1 w-full sm:w-auto">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span className="text-neutral-700 dark:text-neutral-300 flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                <span>{selectedRole} Practice Progress</span>
              </span>
              <span className="text-blue-600 dark:text-blue-400 font-extrabold">
                {practicedCount} of {questions.length} Questions Practiced ({practicedPercent}%)
              </span>
            </div>
            <div className="w-full bg-neutral-200 dark:bg-neutral-700 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-600 to-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${practicedPercent}%` }}
              />
            </div>
          </div>

          {practicedCount > 0 && (
            <button
              onClick={handleResetPracticedForRole}
              className="text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white flex items-center shrink-0 cursor-pointer transition-colors"
              title="Reset practice checkmarks for this role"
            >
              <RotateCcw className="w-3 h-3 mr-1" /> Reset Progress
            </button>
          )}
        </div>

        {/* Search & Category Filter Bar */}
        <div className="mt-6 pt-6 border-t border-neutral-100 dark:border-neutral-700 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto">
            {(['All', 'Technical', 'System Design', 'Behavioral'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                }`}
              >
                {cat} ({categoryCounts[cat]})
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search questions or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((q, idx) => {
            const isExpanded = expandedId === q.id;
            const isPracticed = !!practicedMap[q.id];
            // Find global index in questions array
            const globalIndex = questions.findIndex(item => item.id === q.id) + 1;

            return (
              <div
                key={q.id}
                className={`bg-white dark:bg-neutral-800 rounded-3xl border transition-all overflow-hidden ${
                  isPracticed 
                    ? 'border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/20 dark:bg-emerald-950/10' 
                    : 'border-neutral-200 dark:border-neutral-700 shadow-xs'
                }`}
              >
                <div
                  className="p-6 flex items-start justify-between gap-4"
                >
                  {/* Practiced Checkbox */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTogglePracticed(q.id);
                    }}
                    className={`mt-1 p-1 rounded-lg transition-colors cursor-pointer shrink-0 ${
                      isPracticed 
                        ? 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40' 
                        : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                    }`}
                    title={isPracticed ? "Mark as unpracticed" : "Mark question as practiced"}
                  >
                    {isPracticed ? (
                      <CheckSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Square className="w-5 h-5" />
                    )}
                  </button>

                  <div 
                    onClick={() => setExpandedId(isExpanded ? null : q.id)}
                    className="space-y-2 flex-1 cursor-pointer"
                  >
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <span className="text-[11px] font-extrabold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                        Question {globalIndex} of {questions.length}
                      </span>
                      <span className="text-neutral-300 dark:text-neutral-700">·</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        q.category === 'Technical'
                          ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                          : q.category === 'System Design'
                            ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                            : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      }`}>
                        {q.category}
                      </span>
                      <span className="text-xs text-neutral-400">·</span>
                      <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">
                        {q.targetSkill}
                      </span>
                      {isPracticed && (
                        <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-md">
                          <Check className="w-3 h-3 mr-0.5" /> Practiced
                        </span>
                      )}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white leading-snug">
                      {q.question}
                    </h3>
                  </div>

                  <button 
                    onClick={() => setExpandedId(isExpanded ? null : q.id)}
                    className="p-2 rounded-xl text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors mt-1 cursor-pointer shrink-0"
                    title={isExpanded ? "Collapse answer" : "Expand answer"}
                  >
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>

                {isExpanded && (
                  <div className="p-6 sm:p-8 border-t border-neutral-100 dark:border-neutral-700/80 bg-neutral-50/60 dark:bg-neutral-900/80 space-y-6">
                    {/* Interviewer Intent */}
                    <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-800/60">
                      <div className="flex items-center space-x-2 text-xs font-bold text-blue-700 dark:text-blue-300 mb-1">
                        <BrainCircuit className="w-4 h-4" />
                        <span>What the Interviewer is Really Listening For:</span>
                      </div>
                      <p className="text-xs leading-relaxed text-neutral-700 dark:text-neutral-300">
                        {q.interviewerIntent}
                      </p>
                    </div>

                    {/* Key Talking Points */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
                        Key Points to Hit in Your Answer
                      </h4>
                      <ul className="space-y-1.5 text-xs text-neutral-700 dark:text-neutral-300">
                        {q.talkingPoints.map((pt, pIdx) => (
                          <li key={pIdx} className="flex items-start space-x-2">
                            <span className="text-blue-600 font-bold shrink-0">✓</span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* STAR Framework (If behavioral) */}
                    {q.starFramework && (
                      <div className="p-5 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 space-y-3 shadow-xs">
                        <div className="flex items-center space-x-2 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                          <Award className="w-4 h-4" />
                          <span>Structured Model Answer (STAR Method)</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                            <strong className="text-neutral-900 dark:text-white block mb-0.5">Situation:</strong>
                            <span className="text-neutral-600 dark:text-neutral-300">{q.starFramework.situation}</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                            <strong className="text-neutral-900 dark:text-white block mb-0.5">Task:</strong>
                            <span className="text-neutral-600 dark:text-neutral-300">{q.starFramework.task}</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                            <strong className="text-neutral-900 dark:text-white block mb-0.5">Action:</strong>
                            <span className="text-neutral-600 dark:text-neutral-300">{q.starFramework.action}</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                            <strong className="text-neutral-900 dark:text-white block mb-0.5">Result:</strong>
                            <span className="text-neutral-600 dark:text-neutral-300">{q.starFramework.result}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Common Traps / Gotchas */}
                    <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60">
                      <div className="flex items-center space-x-2 text-xs font-bold text-amber-700 dark:text-amber-300 mb-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>Common Trap to Avoid:</span>
                      </div>
                      <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                        {q.gotchas}
                      </p>
                    </div>

                    {/* Scratchpad Notes */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Your Practice Answer / Notes:</label>
                      <textarea
                        rows={2}
                        placeholder="Jot down bullet points from your own background for this question..."
                        value={userNotes[q.id] || ''}
                        onChange={(e) => handleNoteChange(q.id, e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-800 dark:text-neutral-200 outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="flex items-center justify-between pt-2">
                      <button
                        type="button"
                        onClick={() => handleTogglePracticed(q.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center transition-all cursor-pointer ${
                          isPracticed
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                            : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700 hover:border-emerald-400'
                        }`}
                      >
                        {isPracticed ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-600 dark:text-emerald-400" />
                            <span>Marked as Ready & Practiced</span>
                          </>
                        ) : (
                          <>
                            <CheckSquare className="w-3.5 h-3.5 mr-1.5 text-neutral-400" />
                            <span>Mark Question as Practiced</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setExpandedId(null)}
                        className="text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-white cursor-pointer"
                      >
                        Collapse
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center bg-white dark:bg-neutral-800 rounded-3xl border border-neutral-200 dark:border-neutral-700">
            <HelpCircle className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-neutral-900 dark:text-white">No questions matched your filter</h4>
            <p className="text-xs text-neutral-500 mt-1">Try selecting "All" or clearing your search term.</p>
          </div>
        )}
      </div>
    </div>
  );
};
