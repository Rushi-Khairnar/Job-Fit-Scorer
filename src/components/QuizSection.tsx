import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Award, 
  ArrowRight, 
  BrainCircuit, 
  Code, 
  Database, 
  Cloud, 
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { QUIZ_COLLECTION, SkillQuiz } from '../quizData';

interface QuizSectionProps {
  initialQuizId?: string;
  onBackToHome?: () => void;
}

export const QuizSection: React.FC<QuizSectionProps> = ({ initialQuizId, onBackToHome }) => {
  const [selectedQuiz, setSelectedQuiz] = useState<SkillQuiz>(() => {
    if (initialQuizId) {
      const found = QUIZ_COLLECTION.find(q => q.id === initialQuizId || q.title.toLowerCase().includes(initialQuizId.toLowerCase()));
      if (found) return found;
    }
    return QUIZ_COLLECTION[0];
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);

  const currentQuestion = selectedQuiz.questions[currentQuestionIndex];

  const handleSelectOption = (index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(index);
    setIsAnswerSubmitted(true);
    setUserAnswers(prev => [...prev, index]);
  };

  const handleNext = () => {
    if (currentQuestionIndex + 1 < selectedQuiz.questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsQuizCompleted(true);
    }
  };

  const handleRestart = (quiz?: SkillQuiz) => {
    if (quiz) setSelectedQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setUserAnswers([]);
    setIsQuizCompleted(false);
  };

  const score = userAnswers.reduce((total, ans, idx) => {
    return ans === selectedQuiz.questions[idx].correctIndex ? total + 1 : total;
  }, 0);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'BrainCircuit': return <BrainCircuit className="w-5 h-5" />;
      case 'Database': return <Database className="w-5 h-5" />;
      case 'Code': return <Code className="w-5 h-5" />;
      case 'Cloud': return <Cloud className="w-5 h-5" />;
      default: return <HelpCircle className="w-5 h-5" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Header & Quiz Selector */}
      <div className="bg-white dark:bg-neutral-800 rounded-3xl p-6 md:p-8 border border-neutral-200 dark:border-neutral-700 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 rounded-full text-xs font-semibold mb-2 border border-purple-200 dark:border-purple-800">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Skill Practice & Verification</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white">Technical MCQ Skill Quizzes</h2>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">
              5 focused questions with instant feedback and deep architectural explanations.
            </p>
          </div>

          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              ← Back to Scorer
            </button>
          )}
        </div>

        {/* Quiz Track Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {QUIZ_COLLECTION.map(quiz => {
            const isSelected = quiz.id === selectedQuiz.id;
            return (
              <button
                key={quiz.id}
                onClick={() => handleRestart(quiz)}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 shadow-xs ring-2 ring-blue-500/20' 
                    : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 bg-neutral-50/50 dark:bg-neutral-850/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-xl ${isSelected ? 'bg-blue-600 text-white' : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300'}`}>
                    {getIcon(quiz.iconName)}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300">
                    {quiz.level}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-neutral-900 dark:text-white truncate">{quiz.title}</h4>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 truncate">{quiz.roleTag}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Question Box or Results */}
      {!isQuizCompleted ? (
        <div className="bg-white dark:bg-neutral-800 rounded-3xl p-6 md:p-8 border border-neutral-200 dark:border-neutral-700 shadow-sm space-y-6">
          {/* Progress Header */}
          <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-700 pb-4">
            <div>
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                Question {currentQuestionIndex + 1} of {selectedQuiz.questions.length}
              </span>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white mt-1">
                {selectedQuiz.title}
              </h3>
            </div>
            <div className="flex items-center space-x-1.5">
              {selectedQuiz.questions.map((_, i) => (
                <div
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    i === currentQuestionIndex 
                      ? 'bg-blue-600 w-6' 
                      : i < userAnswers.length
                        ? userAnswers[i] === selectedQuiz.questions[i].correctIndex
                          ? 'bg-emerald-500'
                          : 'bg-rose-500'
                        : 'bg-neutral-200 dark:bg-neutral-700'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Question Prompt */}
          <div className="py-2">
            <span className="inline-block px-2.5 py-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-md text-xs font-medium mb-3">
              Skill: {currentQuestion.skillTag}
            </span>
            <p className="text-lg md:text-xl font-semibold text-neutral-900 dark:text-white leading-relaxed">
              {currentQuestion.question}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => {
              const isChosen = selectedOption === idx;
              const isCorrect = idx === currentQuestion.correctIndex;
              let btnStyle = "border-neutral-200 dark:border-neutral-700 hover:border-blue-400 dark:hover:border-blue-600 bg-neutral-50/50 dark:bg-neutral-850/50 text-neutral-800 dark:text-neutral-200";

              if (isAnswerSubmitted) {
                if (isCorrect) {
                  btnStyle = "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-medium ring-2 ring-emerald-500/20";
                } else if (isChosen && !isCorrect) {
                  btnStyle = "border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 font-medium ring-2 ring-rose-500/20";
                } else {
                  btnStyle = "border-neutral-200 dark:border-neutral-700 opacity-50 bg-white dark:bg-neutral-800 text-neutral-400";
                }
              }

              const letters = ['A', 'B', 'C', 'D'];

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswerSubmitted}
                  className={`w-full p-4 rounded-2xl border text-left flex items-start space-x-3.5 transition-all ${btnStyle}`}
                >
                  <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${
                    isAnswerSubmitted && isCorrect
                      ? 'bg-emerald-600 text-white'
                      : isAnswerSubmitted && isChosen
                        ? 'bg-rose-600 text-white'
                        : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
                  }`}>
                    {letters[idx]}
                  </span>
                  <div className="flex-1 text-sm md:text-base leading-snug pt-0.5">
                    {option}
                  </div>
                  {isAnswerSubmitted && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  )}
                  {isAnswerSubmitted && isChosen && !isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Instant Explanation Box */}
          {isAnswerSubmitted && (
            <div className={`p-4 rounded-2xl border text-sm leading-relaxed ${
              selectedOption === currentQuestion.correctIndex 
                ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200' 
                : 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
            }`}>
              <div className="font-bold mb-1 flex items-center">
                {selectedOption === currentQuestion.correctIndex ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-600" />
                    Correct Explanation:
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 mr-1.5 text-amber-600" />
                    Incorrect — Concept Review:
                  </>
                )}
              </div>
              <p>{currentQuestion.explanation}</p>
            </div>
          )}

          {/* Action Row */}
          {isAnswerSubmitted && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-md shadow-blue-600/20 flex items-center"
              >
                {currentQuestionIndex + 1 < selectedQuiz.questions.length ? 'Next Question' : 'View Quiz Results'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Quiz Complete Screen */
        <div className="bg-white dark:bg-neutral-800 rounded-3xl p-8 md:p-12 border border-neutral-200 dark:border-neutral-700 shadow-sm text-center space-y-8">
          <div className="w-20 h-20 mx-auto rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Award className="w-10 h-10" />
          </div>

          <div>
            <h3 className="text-3xl font-extrabold text-neutral-900 dark:text-white">Quiz Completed!</h3>
            <p className="text-neutral-500 dark:text-neutral-400 text-base mt-2">
              You scored <span className="font-bold text-blue-600 dark:text-blue-400">{score}</span> out of <span className="font-bold">{selectedQuiz.questions.length}</span> ({Math.round((score / selectedQuiz.questions.length) * 100)}%)
            </p>
            <div className="mt-3 inline-block px-4 py-1.5 rounded-full text-sm font-semibold border bg-neutral-100 dark:bg-neutral-700 border-neutral-200 dark:border-neutral-600 text-neutral-800 dark:text-neutral-200">
              {score === 5 ? '🌟 Outstanding Mastery — Role Ready!' : score >= 3 ? '👍 Solid Foundation — Minor gaps to review' : '📚 Needs Practice — Check the career roadmap'}
            </div>
          </div>

          {/* Question by Question Review */}
          <div className="text-left space-y-4 max-w-2xl mx-auto pt-4 border-t border-neutral-100 dark:border-neutral-700">
            <h4 className="text-sm font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">Detailed Review</h4>
            {selectedQuiz.questions.map((q, idx) => {
              const isCorrect = userAnswers[idx] === q.correctIndex;
              return (
                <div key={q.id} className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-700/60 text-sm">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                      {idx + 1}. {q.question}
                    </span>
                    {isCorrect ? (
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center flex-shrink-0">
                        <CheckCircle2 className="w-4 h-4 mr-1" /> Correct
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center flex-shrink-0">
                        <XCircle className="w-4 h-4 mr-1" /> Missed
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                    <span className="font-semibold text-neutral-700 dark:text-neutral-300">Answer:</span> {q.options[q.correctIndex]}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => handleRestart()}
              className="px-6 py-3 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-neutral-800 dark:text-neutral-200 font-semibold rounded-xl transition-colors flex items-center"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Retake This Quiz
            </button>
            <button
              onClick={() => {
                const nextIndex = (QUIZ_COLLECTION.findIndex(q => q.id === selectedQuiz.id) + 1) % QUIZ_COLLECTION.length;
                handleRestart(QUIZ_COLLECTION[nextIndex]);
              }}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-md shadow-blue-600/20 flex items-center"
            >
              Try Next Quiz Track
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
