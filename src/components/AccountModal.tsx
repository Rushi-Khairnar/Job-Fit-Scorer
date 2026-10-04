import React, { useState, useEffect } from 'react';
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
  BookmarkCheck,
  Video,
  Play,
  RotateCcw,
  Mail,
  Clock,
  Target,
  FileVideo,
  AlertCircle
} from 'lucide-react';
import { getRoleRoadmapProgress } from '../roadmapUtils';

export interface UserProfile {
  id: string;
  name: string;
  occupation?: string; // What they are doing right now
  email: string;       // Primary contact email address
  title: string;       // Primary target role
  experienceYears: number; // Years of experience
  resumeFileName?: string;
  resumeText?: string;
  videoCvUrl?: string; // Video CV file data / object URL
  videoCvFileName?: string;
  videoCvDate?: string;
  videoCvSize?: string;
  savedSkills: Array<{ name: string; level: 'Beginner' | 'Intermediate' | 'Advanced' }>;
  completedRoadmapMilestones: string[];
  enrolledRoadmapRole?: string;
  enrolledRoadmapDate?: string;
  quizScores: Array<{ quizId: string; title: string; score: number; total: number; date: string }>;
  isDemo?: boolean;
}

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  onSwitchProfile: (profileId: string) => void;
  allProfiles: UserProfile[];
  onCreateProfile: (profileData: {
    name: string;
    occupation: string;
    title: string;
    email: string;
    experienceYears: number;
    resumeFile?: File;
    videoCvFile?: File;
  }) => void;
  onDeleteProfile: (profileId: string) => void;
  onUploadNewResume: (file: File) => void;
  onUploadVideoCv?: (file: File) => void;
  onRemoveVideoCv?: () => void;
  onResetToDemo?: () => void;
  onViewResume?: () => void;
  onContinueRoadmap?: (role: string) => void;
}

const COMMON_TARGET_ROLES = [
  'Software Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Data Scientist',
  'Machine Learning Engineer',
  'DevOps Engineer',
  'Cloud Architect',
  'Product Manager',
  'Mobile Developer'
];

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
  onUploadVideoCv,
  onRemoveVideoCv,
  onResetToDemo,
  onViewResume,
  onContinueRoadmap
}) => {
  // Current Profile Form State (synced with currentProfile)
  const [name, setName] = useState(currentProfile.name);
  const [occupation, setOccupation] = useState(currentProfile.occupation || '');
  const [email, setEmail] = useState(currentProfile.email);
  const [title, setTitle] = useState(currentProfile.title);
  const [experienceYears, setExperienceYears] = useState(currentProfile.experienceYears);

  // Synchronize local form when switched to a different profile
  useEffect(() => {
    setName(currentProfile.name);
    setOccupation(currentProfile.occupation || '');
    setEmail(currentProfile.email);
    setTitle(currentProfile.title);
    setExperienceYears(currentProfile.experienceYears);
  }, [currentProfile.id, currentProfile]);

  // New Profile Creation Form State
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newOccupation, setNewOccupation] = useState('');
  const [newTitle, setNewTitle] = useState('Full Stack Developer');
  const [newEmail, setNewEmail] = useState('');
  const [newExperienceYears, setNewExperienceYears] = useState<number>(2);
  const [newResumeFile, setNewResumeFile] = useState<File | null>(null);
  const [newVideoCvFile, setNewVideoCvFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [createError, setCreateError] = useState('');

  // Generate preview object URL when video CV is chosen during profile creation
  useEffect(() => {
    if (newVideoCvFile) {
      const url = URL.createObjectURL(newVideoCvFile);
      setVideoPreviewUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setVideoPreviewUrl(null);
    }
  }, [newVideoCvFile]);

  // Feedback notifications
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [switchFeedback, setSwitchFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveProfile({
      ...currentProfile,
      name,
      occupation,
      email,
      title,
      experienceYears
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      setCreateError('Please enter your full name.');
      return;
    }
    if (!newEmail.trim() || !newEmail.includes('@')) {
      setCreateError('Please enter a valid email address.');
      return;
    }
    if (!newTitle.trim()) {
      setCreateError('Please specify your primary target role.');
      return;
    }

    setCreateError('');
    onCreateProfile({
      name: newName.trim(),
      occupation: newOccupation.trim() || 'Software Professional',
      title: newTitle.trim(),
      email: newEmail.trim(),
      experienceYears: Number(newExperienceYears) || 0,
      resumeFile: newResumeFile || undefined,
      videoCvFile: newVideoCvFile || undefined
    });

    // Reset creation fields
    setNewName('');
    setNewOccupation('');
    setNewTitle('Full Stack Developer');
    setNewEmail('');
    setNewExperienceYears(2);
    setNewResumeFile(null);
    setNewVideoCvFile(null);
    setIsCreating(false);

    setSwitchFeedback(`Created and signed in to ${newName.trim()}'s account. All previous session data cleared.`);
    setTimeout(() => setSwitchFeedback(null), 3500);
  };

  const handleProfileSwitch = (profileId: string) => {
    if (profileId === currentProfile.id) return;
    onSwitchProfile(profileId);
    const target = allProfiles.find(p => p.id === profileId);
    setSwitchFeedback(`Switched to ${target ? target.name : 'profile'}. Active session loaded cleanly.`);
    setTimeout(() => setSwitchFeedback(null), 3000);
  };

  const handleVideoUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUploadVideoCv) {
      onUploadVideoCv(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div 
        className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-6 md:p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white">Career Profile & Vault</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Multi-account career isolation with PDF resume & Video CV storage.
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Notification Banner */}
        {switchFeedback && (
          <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200 text-xs font-semibold flex items-center space-x-2 animate-in fade-in slide-in-from-top-1">
            <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>{switchFeedback}</span>
          </div>
        )}

        {/* Profile Switcher & Account Selector */}
        <div className="bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-2xl border border-neutral-200/80 dark:border-neutral-700/80 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Active Accounts ({allProfiles.length})
            </span>
            <div className="flex items-center space-x-2">
              {currentProfile.id !== 'prof_default' && onResetToDemo && (
                <button
                  type="button"
                  onClick={onResetToDemo}
                  className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center transition-colors cursor-pointer"
                  title="Switch back to clean demo account"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1 text-neutral-500" />
                  <span>Switch to Demo</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsCreating(!isCreating)}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                <span>{isCreating ? 'Cancel Creation' : 'New Profile'}</span>
              </button>
            </div>
          </div>

          {/* Account Pills List */}
          <div className="flex flex-wrap gap-2">
            {allProfiles.map(p => {
              const isActive = p.id === currentProfile.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleProfileSwitch(p.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-2 cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 hover:border-blue-400 dark:hover:border-blue-500'
                  }`}
                >
                  <span>{p.name}</span>
                  {p.isDemo && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold uppercase ${
                      isActive ? 'bg-white/20 text-white' : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-500'
                    }`}>
                      Demo
                    </span>
                  )}
                  <span className="text-[10px] opacity-75">
                    ({p.title || p.occupation || 'Candidate'})
                  </span>
                  {p.videoCvFileName && (
                    <span className={`p-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'text-purple-500'}`} title="Video CV attached">
                      <Video className="w-3 h-3" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Candidate Session Overview Card */}
          <div className="p-4 rounded-2xl bg-white dark:bg-neutral-800/80 border border-neutral-200/90 dark:border-neutral-700/80 space-y-2.5 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-neutral-900 dark:text-white">
                    {currentProfile.name}
                  </span>
                  {currentProfile.isDemo ? (
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                      Demo Account
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                      Active Account
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
                  <span className="font-semibold text-neutral-700 dark:text-neutral-300">Doing Right Now:</span> {currentProfile.occupation || 'Software Professional'}
                </p>
              </div>

              <div className="text-xs text-neutral-600 dark:text-neutral-400 sm:text-right space-y-0.5">
                <div>
                  <span className="font-semibold text-neutral-700 dark:text-neutral-300">Primary Target:</span> {currentProfile.title}
                </div>
                <div>
                  <span className="font-semibold text-neutral-700 dark:text-neutral-300">Target Email:</span> {currentProfile.email}
                </div>
                <div>
                  <span className="font-semibold text-neutral-700 dark:text-neutral-300">Experience:</span> {currentProfile.experienceYears} {currentProfile.experienceYears === 1 ? 'Year' : 'Years'}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-700/60 text-[11px]">
              <span className={`px-2.5 py-1 rounded-lg flex items-center font-medium ${
                currentProfile.resumeFileName 
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800' 
                  : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-500'
              }`}>
                <FileText className="w-3.5 h-3.5 mr-1 text-blue-500" />
                {currentProfile.resumeFileName ? `Resume: ${currentProfile.resumeFileName}` : 'No Written Resume'}
              </span>

              <span className={`px-2.5 py-1 rounded-lg flex items-center font-medium ${
                currentProfile.videoCvFileName 
                  ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800' 
                  : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-500'
              }`}>
                <Video className="w-3.5 h-3.5 mr-1 text-purple-500" />
                {currentProfile.videoCvFileName ? `Video CV: ${currentProfile.videoCvFileName}` : 'No Video CV Uploaded'}
              </span>

              {currentProfile.id !== 'prof_default' && onResetToDemo && (
                <button
                  type="button"
                  onClick={onResetToDemo}
                  className="ml-auto text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3 mr-1" />
                  <span>Restore Demo Account</span>
                </button>
              )}
            </div>
          </div>

          {/* Full-Featured New Profile Creation Panel */}
          {isCreating && (
            <form onSubmit={handleCreateSubmit} className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700 space-y-4 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
                    Create New Isolated Candidate Account
                  </h4>
                </div>
                <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  Previous session data will be cleared
                </span>
              </div>

              {createError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{createError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Candidate Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rao Varma"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Current Occupation / What You Do Right Now <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Software Engineer, CS Student, Freelancer"
                    value={newOccupation}
                    onChange={(e) => setNewOccupation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Primary Target Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. rao.varma@example.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Years of Experience <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={newExperienceYears}
                    onChange={(e) => setNewExperienceYears(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={0}>0 Years (Entry Level / Student / Fresher)</option>
                    <option value={1}>1 Year of Experience</option>
                    <option value={2}>2 Years of Experience</option>
                    <option value={3}>3 Years of Experience</option>
                    <option value={4}>4 Years of Experience</option>
                    <option value={5}>5+ Years (Senior)</option>
                    <option value={8}>8+ Years (Lead / Staff)</option>
                    <option value={12}>12+ Years (Principal / Director)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Primary Target Role <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Full Stack Developer, Data Scientist"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="text-[10px] text-neutral-400 font-medium self-center">Popular:</span>
                  {COMMON_TARGET_ROLES.slice(0, 5).map(role => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setNewTitle(role)}
                      className={`text-[10px] px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer ${
                        newTitle === role
                          ? 'bg-blue-600 text-white'
                          : 'bg-neutral-200/70 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              {/* Attach Initial Resume & Video CV during Profile Creation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 space-y-2">
                  <span className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 flex items-center">
                    <FileText className="w-3.5 h-3.5 mr-1 text-blue-600" />
                    Attach Resume (Optional)
                  </span>
                  <label className="flex items-center justify-center p-2.5 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-600 hover:border-blue-500 cursor-pointer text-xs text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-800/40">
                    <Upload className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
                    <span className="truncate max-w-[180px]">
                      {newResumeFile ? newResumeFile.name : 'Choose PDF / Word'}
                    </span>
                    <input
                      type="file"
                      accept=".pdf,.docx,.doc,.txt"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) setNewResumeFile(f);
                      }}
                    />
                  </label>
                  {newResumeFile && (
                    <div className="flex items-center justify-between text-[10px] text-neutral-500">
                      <span className="truncate max-w-[140px] font-medium text-blue-600">{newResumeFile.name}</span>
                      <button
                        type="button"
                        onClick={() => setNewResumeFile(null)}
                        className="text-rose-500 hover:underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 flex items-center">
                      <Video className="w-3.5 h-3.5 mr-1 text-purple-600" />
                      Attach Video CV (Optional)
                    </span>
                    {newVideoCvFile && (
                      <button
                        type="button"
                        onClick={() => setNewVideoCvFile(null)}
                        className="text-[10px] text-rose-500 hover:text-rose-600 font-medium cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  {videoPreviewUrl ? (
                    <div className="space-y-2">
                      <div className="rounded-lg overflow-hidden bg-black aspect-video max-h-36 flex items-center justify-center">
                        <video src={videoPreviewUrl} controls className="w-full h-full object-contain" />
                      </div>
                      <div className="text-[10px] text-neutral-500 flex items-center justify-between">
                        <span className="truncate max-w-[140px] font-medium text-purple-600">{newVideoCvFile?.name}</span>
                        <span>{newVideoCvFile ? (newVideoCvFile.size / (1024 * 1024)).toFixed(1) + ' MB' : ''}</span>
                      </div>
                    </div>
                  ) : (
                    <label className="flex items-center justify-center p-2.5 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-600 hover:border-purple-500 cursor-pointer text-xs text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-800/40">
                      <Video className="w-3.5 h-3.5 mr-1.5 text-purple-500" />
                      <span className="truncate max-w-[180px]">
                        Choose Video (.mp4, .webm)
                      </span>
                      <input
                        type="file"
                        accept="video/mp4,video/webm,video/ogg,video/quicktime"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) setNewVideoCvFile(f);
                        }}
                      />
                    </label>
                  )}
                  <p className="text-[10px] text-neutral-500 dark:text-neutral-400">
                    Upload a 30-90s elevator pitch video introducing yourself to recruiters.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center"
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  <span>Create Account & Start Session</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Current Profile Details Form */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-1 border-b border-neutral-100 dark:border-neutral-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Active Candidate Information
            </h4>
            <span className="text-[11px] font-mono text-neutral-400">
              ID: {currentProfile.id}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                Full Name
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
                Current Occupation / Doing Right Now
              </label>
              <input
                type="text"
                placeholder="e.g. Associate Engineer, Student"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs text-neutral-900 dark:text-white font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                Primary Target Email Address
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
                Years of Experience
              </label>
              <select
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs text-neutral-900 dark:text-white font-medium"
              >
                <option value={0}>0 Years (Fresher / Student)</option>
                <option value={1}>1 Year of Experience</option>
                <option value={2}>2 Years of Experience</option>
                <option value={3}>3 Years of Experience</option>
                <option value={4}>4 Years of Experience</option>
                <option value={5}>5+ Years (Senior)</option>
                <option value={8}>8+ Years (Lead / Staff)</option>
                <option value={12}>12+ Years (Principal / Director)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
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
          </div>
        </div>

        {/* Document & Video Media Vault */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Document & Video Media Vault
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Traditional Written CV Card */}
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-xl text-blue-700 dark:text-blue-300">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-neutral-900 dark:text-white">
                      Traditional Written CV
                    </div>
                    <div className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate max-w-[180px]">
                      {currentProfile.resumeFileName ? currentProfile.resumeFileName : 'No Resume Uploaded'}
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  {currentProfile.resumeFileName 
                    ? 'Persisted in candidate profile. Automatically analyzed for ATS scoring & role matches.'
                    : 'Upload your PDF or Word resume to activate keyword matching and ATS audits.'}
                </p>
              </div>

              <div className="flex items-center space-x-2 pt-2 border-t border-neutral-200/60 dark:border-neutral-700/60">
                {currentProfile.resumeFileName && onViewResume && (
                  <button
                    type="button"
                    onClick={onViewResume}
                    className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/60 flex items-center justify-center transition-all cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 mr-1" />
                    <span>View CV</span>
                  </button>
                )}

                <label className="flex-1 cursor-pointer py-2 px-3 rounded-xl text-xs font-semibold bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700 hover:border-blue-500 flex items-center justify-center transition-all text-center">
                  <Upload className="w-3.5 h-3.5 mr-1 text-blue-600" />
                  <span>{currentProfile.resumeFileName ? 'Replace' : 'Upload CV'}</span>
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

            {/* 2. Video CV / Video Pitch Card */}
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-xl text-purple-700 dark:text-purple-300">
                      <Video className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-neutral-900 dark:text-white">
                        Video CV / Video Pitch
                      </div>
                      <div className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate max-w-[180px]">
                        {currentProfile.videoCvFileName ? currentProfile.videoCvFileName : 'No Video Attached'}
                      </div>
                    </div>
                  </div>
                  {currentProfile.videoCvFileName && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
                      Attached
                    </span>
                  )}
                </div>

                {currentProfile.videoCvUrl ? (
                  <div className="space-y-2">
                    <div className="rounded-xl overflow-hidden bg-black/90 aspect-video flex items-center justify-center">
                      <video
                        src={currentProfile.videoCvUrl}
                        controls
                        className="w-full h-full object-contain"
                        preload="metadata"
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-neutral-400">
                      <span>{currentProfile.videoCvDate || 'Recently uploaded'}</span>
                      <span>{currentProfile.videoCvSize || ''}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                    Upload a 30-90 second elevator video pitch introducing yourself and your top projects to tech recruiters.
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2 pt-2 border-t border-neutral-200/60 dark:border-neutral-700/60">
                {currentProfile.videoCvUrl && onViewResume && (
                  <button
                    type="button"
                    onClick={onViewResume}
                    className="py-2 px-3 rounded-xl text-xs font-semibold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/60 flex items-center justify-center transition-all cursor-pointer"
                    title="Watch in Viewer Modal"
                  >
                    <Eye className="w-3.5 h-3.5 mr-1" />
                    <span>Watch Full</span>
                  </button>
                )}

                <label className="flex-1 cursor-pointer py-2 px-3 rounded-xl text-xs font-semibold bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700 hover:border-purple-500 flex items-center justify-center transition-all text-center">
                  <Video className="w-3.5 h-3.5 mr-1 text-purple-600" />
                  <span>{currentProfile.videoCvUrl ? 'Replace Video' : 'Upload Video CV'}</span>
                  <input
                    type="file"
                    accept="video/mp4,video/webm,video/ogg,video/quicktime"
                    className="hidden"
                    onChange={handleVideoUploadChange}
                  />
                </label>

                {currentProfile.videoCvUrl && onRemoveVideoCv && (
                  <button
                    type="button"
                    onClick={onRemoveVideoCv}
                    className="py-2 px-3 rounded-xl text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-neutral-300 dark:border-neutral-700 transition-colors cursor-pointer"
                    title="Remove Video CV"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Active Learning Path Progress Tracker */}
        <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 space-y-3">
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
                    Step-by-step milestone progress towards your target role.
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
                      <div className="w-full bg-neutral-200 dark:bg-neutral-700 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-blue-600 h-full rounded-full transition-all duration-300"
                          style={{ width: `${progress.percent}%` }}
                        />
                      </div>
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

        {/* Action Buttons */}
        <div className="flex items-center justify-between border-t border-neutral-100 dark:border-neutral-800 pt-4">
          {allProfiles.length > 1 ? (
            <button
              type="button"
              onClick={() => onDeleteProfile(currentProfile.id)}
              className="text-xs text-rose-600 hover:text-rose-700 dark:hover:text-rose-400 flex items-center font-medium cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete Profile
            </button>
          ) : <div />}

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs flex items-center transition-all cursor-pointer"
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
