import React, { useState } from 'react';
import { 
  User, 
  FileText, 
  Upload, 
  Trash2, 
  CheckCircle2, 
  Award, 
  Compass, 
  Briefcase, 
  Save, 
  X,
  Plus,
  RefreshCw,
  Sparkles,
  Eye,
  ArrowRight,
  BookmarkCheck
} from 'lucide-react';
import { getRoleRoadmapProgress } from '../roadmapUtils';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  title: string;
  experienceYears: number;
  resumeFileName?: string;
  resumeText?: string;
  savedSkills: Array<{ name: string; level: 'Beginner' | 'Intermediate' | 'Advanced' }>;
  completedRoadmapMilestones: string[]; // e.g. "Data Scientist-1"
  enrolledRoadmapRole?: string;        // Active enrolled learning path (e.g. "Data Scientist")
  enrolledRoadmapDate?: string;        // e.g. "2026-10-01"
  quizScores: Array<{ quizId: string; title: string; score: number; total: number; date: string }>;
}

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  onSwitchProfile: (profileId: string) => void;
  allProfiles: UserProfile[];
  onCreateProfile: (name: string, title: string) => void;
  onDeleteProfile: (profileId: string) => void;
  onUploadNewResume: (file: File) => void;
  onViewResume?: () => void;
  onContinueRoadmap?: (role: string) => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onSaveProfile,
  onSwitchProfile,
  allProfiles,
  onCreateProfile,
  onDeleteProfile,
  onUploadNewResume,
  onViewResume,
  onContinueRoadmap
}) => {
  const [name, setName] = useState(currentProfile.name);
  const [email, setEmail] = useState(currentProfile.email);
  const [title, setTitle] = useState(currentProfile.title);
  const [experienceYears, setExperienceYears] = useState(currentProfile.experienceYears);
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileTitle, setNewProfileTitle] = useState('Software Engineer');
  const [isCreating, setIsCreating] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveProfile({
      ...currentProfile,
      name,
      email,
      title,
      experienceYears
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleCreate = () => {
    if (!newProfileName.trim()) return;
    onCreateProfile(newProfileName.trim(), newProfileTitle);
    setNewProfileName('');
    setIsCreating(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div 
        className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 md:p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white">Career Account & Vault</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Your resume, quiz history, and roadmaps are saved safely in your browser.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Switcher Row */}
        <div className="bg-neutral-50 dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Active Profile ({allProfiles.length})
            </span>
            <button
              onClick={() => setIsCreating(!isCreating)}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> New Profile
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {allProfiles.map(p => (
              <button
                key={p.id}
                onClick={() => onSwitchProfile(p.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-2 ${
                  p.id === currentProfile.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 hover:border-blue-400'
                }`}
              >
                <span>{p.name}</span>
                <span className="text-[10px] opacity-75">({p.title})</span>
              </button>
            ))}
          </div>

          {isCreating && (
            <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-700 flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Profile Name (e.g. Maria - ML)"
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
                className="px-3 py-1.5 rounded-xl text-xs bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 flex-1"
              />
              <input
                type="text"
                placeholder="Target Role"
                value={newProfileTitle}
                onChange={(e) => setNewProfileTitle(e.target.value)}
                className="px-3 py-1.5 rounded-xl text-xs bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 flex-1"
              />
              <button
                onClick={handleCreate}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold"
              >
                Create
              </button>
            </div>
          )}
        </div>

        {/* Profile Details Form */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                Your Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs text-neutral-900 dark:text-white font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs text-neutral-900 dark:text-white font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                Primary Target Role
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs text-neutral-900 dark:text-white font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                Years of Experience
              </label>
              <input
                type="number"
                min="0"
                max="40"
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs text-neutral-900 dark:text-white font-medium"
              />
            </div>
          </div>
        </div>

        {/* Saved Resume Storage Card */}
        <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-100 dark:bg-blue-900/50 rounded-xl text-blue-700 dark:text-blue-300">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-neutral-900 dark:text-white">
                {currentProfile.resumeFileName ? currentProfile.resumeFileName : 'No Resume Saved Yet'}
              </div>
              <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                {currentProfile.resumeFileName ? 'Persisted locally. Used automatically across all tools.' : 'Upload your PDF or Word resume once to store.'}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {currentProfile.resumeFileName && onViewResume && (
              <button
                type="button"
                onClick={onViewResume}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/60 flex items-center transition-all cursor-pointer shadow-2xs"
              >
                <Eye className="w-3.5 h-3.5 mr-1.5" />
                <span>View / Read CV</span>
              </button>
            )}

            <label className="cursor-pointer px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700 hover:border-blue-500 flex items-center transition-all shadow-2xs">
              <Upload className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
              <span>{currentProfile.resumeFileName ? 'Replace' : 'Upload Resume'}</span>
              <input
                type="file"
                accept=".pdf,.docx,.doc,.txt"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) onUploadNewResume(f);
                }}
              />
            </label>
          </div>
        </div>

        {/* Active Learning Path Progress Tracker */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200 dark:border-blue-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookmarkCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                Active Learning Path
              </span>
            </div>
            {currentProfile.enrolledRoadmapRole ? (
              <span className="text-[11px] font-semibold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/60 px-2.5 py-0.5 rounded-full">
                Enrolled {currentProfile.enrolledRoadmapDate ? `· ${currentProfile.enrolledRoadmapDate}` : ''}
              </span>
            ) : (
              <span className="text-[11px] font-medium text-neutral-500">
                Not Enrolled
              </span>
            )}
          </div>

          {currentProfile.enrolledRoadmapRole ? (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm font-extrabold text-neutral-900 dark:text-white">
                    {currentProfile.enrolledRoadmapRole} Roadmap
                  </h4>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    Track your step-by-step milestone progress towards this target career.
                  </p>
                </div>
                {onContinueRoadmap && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onContinueRoadmap(currentProfile.enrolledRoadmapRole!);
                    }}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center transition-all cursor-pointer shadow-xs shrink-0 self-start sm:self-auto"
                  >
                    <span>Continue Path</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </button>
                )}
              </div>

              {/* Progress Bar & Next Upcoming Step */}
              <div>
                {(() => {
                  const progress = getRoleRoadmapProgress(
                    currentProfile.enrolledRoadmapRole!,
                    currentProfile.completedRoadmapMilestones
                  );

                  return (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-neutral-600 dark:text-neutral-300">
                          {progress.completedCount} of {progress.totalCount} Milestones Completed
                        </span>
                        <span className="font-extrabold text-blue-700 dark:text-blue-300">
                          {progress.percent}%
                        </span>
                      </div>
                      <div className="w-full bg-blue-200/60 dark:bg-blue-900/60 h-2.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-blue-600 to-emerald-500 h-full rounded-full transition-all duration-300"
                          style={{ width: `${progress.percent}%` }}
                        />
                      </div>

                      {/* Next Upcoming Step Highlight Box */}
                      {progress.nextMilestone ? (
                        <div className="p-3 rounded-2xl bg-white dark:bg-neutral-800/90 border border-blue-200 dark:border-blue-800/80 shadow-2xs space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center">
                              <Sparkles className="w-3 h-3 mr-1" /> Next Up to Learn
                            </span>
                            <span className="text-[10px] text-neutral-400">
                              {progress.nextMilestone.phaseTitle.split(':')[0]}
                            </span>
                          </div>
                          <div className="text-xs font-bold text-neutral-900 dark:text-white">
                            {progress.nextMilestone.title}
                          </div>
                          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-snug">
                            {progress.nextMilestone.description}
                          </p>
                          <div className="flex flex-wrap gap-1 pt-0.5">
                            {progress.nextMilestone.keySkills.map(sk => (
                              <span key={sk} className="text-[10px] px-1.5 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 font-medium">
                                {sk}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : progress.isFullyCompleted ? (
                        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 flex items-center space-x-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <div className="text-xs font-bold text-emerald-800 dark:text-emerald-200">
                            Roadmap 100% Completed! You have mastered all core milestones for this role.
                          </div>
                        </div>
                      ) : null}
                    </div>
                  );
                })()}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between text-xs py-1">
              <span className="text-neutral-600 dark:text-neutral-400">
                No active learning path set. Visit Learning Roadmaps to pick a target job!
              </span>
              {onContinueRoadmap && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onContinueRoadmap('Data Scientist');
                  }}
                  className="px-3 py-1 rounded-xl text-xs font-bold bg-white dark:bg-neutral-800 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-700 hover:bg-blue-50 cursor-pointer transition-colors shrink-0"
                >
                  Browse Roadmaps
                </button>
              )}
            </div>
          )}
        </div>

        {/* Stats & Progress Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-center">
            <span className="text-[11px] text-neutral-500 block">Saved Skills</span>
            <span className="text-lg font-bold text-neutral-900 dark:text-white">
              {currentProfile.savedSkills.length}
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-center">
            <span className="text-[11px] text-neutral-500 block">Roadmap Milestones</span>
            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {currentProfile.completedRoadmapMilestones.length}
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-center col-span-2 sm:col-span-1">
            <span className="text-[11px] text-neutral-500 block">Quizzes Taken</span>
            <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
              {currentProfile.quizScores.length}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between border-t border-neutral-100 dark:border-neutral-800 pt-4">
          {allProfiles.length > 1 ? (
            <button
              onClick={() => onDeleteProfile(currentProfile.id)}
              className="text-xs text-rose-600 hover:text-rose-700 dark:hover:text-rose-400 flex items-center font-medium"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete Profile
            </button>
          ) : <div />}

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900"
            >
              Close
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs flex items-center transition-all"
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-300" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-1.5" />
                  <span>Save Profile</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
