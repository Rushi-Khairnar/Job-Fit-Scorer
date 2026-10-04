import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  UploadCloud, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Target, 
  AlertCircle, 
  Sparkles, 
  BrainCircuit, 
  BarChart, 
  Network, 
  FileText, 
  Type, 
  Compass, 
  ArrowRight, 
  ArrowLeft, 
  IndianRupee, 
  BookOpen, 
  Search, 
  X, 
  Sun, 
  Moon,
  Home,
  Trash2,
  HelpCircle,
  TrendingUp,
  Layers,
  Award,
  DollarSign,
  Briefcase,
  Users,
  ClipboardList,
  HeartHandshake,
  ShieldCheck,
  Send,
  Zap,
  User,
  Check,
  Building2,
  FileDown,
  Globe,
  Eye,
  BookmarkCheck,
  Smartphone,
  Download,
  LayoutGrid
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import { JOB_DIRECTORY_DATA } from './jobsData';
import { getRoleRoadmapProgress, getEnrichedRoadmapForRole } from './roadmapUtils';
import { UnifiedModelGapCard } from './components/UnifiedModelGapCard';
import { QuizSection } from './components/QuizSection';
import { RoadmapSection } from './components/RoadmapSection';
import { ResumeBuilder } from './components/ResumeBuilder';
import { ProfileAuditor } from './components/ProfileAuditor';
import { InterviewGenerator } from './components/InterviewGenerator';
import { CultureAlignment } from './components/CultureAlignment';
import { SalaryEstimator } from './components/SalaryEstimator';
import { RealtimeMarketExplorer } from './components/RealtimeMarketExplorer';
import { LiveIntelModal } from './components/LiveIntelModal';
import { ResumeViewerModal } from './components/ResumeViewerModal';
import { CoverLetterGenerator } from './components/CoverLetterGenerator';
import { BulkResumeRanker } from './components/BulkResumeRanker';
import { ApplicationTracker } from './components/ApplicationTracker';
import { AtsDiagnosticsSuite } from './components/AtsDiagnosticsSuite';
import { AccountModal, UserProfile } from './components/AccountModal';
import { getSkillLevel, getSkillLevelBadgeClasses } from './skillLevels';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

const AVAILABLE_SKILLS = [
  "Agile", "AWS", "Azure", "Blockchain", "C#", "C++", "CI/CD", "CSS", "Computer Vision",
  "Cybersecurity", "Data Analysis", "Databricks", "Deep Learning", "Django", "Docker",
  "Elasticsearch", "Ethical Hacking", "Excel", "Figma", "Flask", "Flutter", "GCP", "Git", "GitHub", "GitLab",
  "Go", "GraphQL", "HTML", "Hadoop", "Java", "JavaScript", "Jenkins", "Jira", "Kafka",
  "Kotlin", "Kubernetes", "Linux", "Machine Learning", "MongoDB", "MySQL", "NLP",
  "Node.js", "PHP", "Pandas", "PostgreSQL", "Power BI", "PyTorch", "Python", "R", "REST API",
  "React Native", "React", "Redis", "Ruby", "Rust", "Scikit-Learn", "Scrum", "Snowflake",
  "Spark", "Spring Boot", "SQL", "Swift", "Tableau", "Tailwind CSS", "TensorFlow",
  "Terraform", "TypeScript", "Vue.js"
];

const SKILL_RELATIONS: Record<string, string[]> = {
  "Python": ["Pandas", "Scikit-Learn", "Machine Learning", "PyTorch", "Django", "Flask"],
  "Machine Learning": ["Python", "Deep Learning", "Scikit-Learn", "TensorFlow", "PyTorch", "Data Analysis"],
  "Deep Learning": ["PyTorch", "TensorFlow", "Machine Learning", "Python", "Computer Vision", "NLP"],
  "React": ["JavaScript", "TypeScript", "HTML", "CSS", "Tailwind CSS", "Node.js"],
  "Node.js": ["JavaScript", "TypeScript", "REST API", "GraphQL", "Express", "MongoDB"],
  "AWS": ["Cloud", "Docker", "Kubernetes", "Terraform", "Linux", "CI/CD"],
  "Docker": ["Kubernetes", "CI/CD", "Linux", "AWS", "Git"],
  "Kubernetes": ["Docker", "AWS", "GCP", "Linux", "CI/CD", "Terraform"],
  "SQL": ["PostgreSQL", "MySQL", "Database", "Data Analysis", "Python"],
  "Git": ["GitHub", "GitLab", "CI/CD"],
  "GitHub": ["Git", "CI/CD"],
  "CI/CD": ["Git", "GitHub", "Jenkins", "Docker", "Kubernetes", "AWS"]
};

export type ActiveToolTab = 
  | 'upload'
  | 'loading'
  | 'results'
  | 'job-directory'        // Learning Roadmaps
  | 'quizzes'              // 10-Question MCQ Quizzes
  | 'build-cv'             // ATS Resume Builder (Word & PDF)
  | 'profile-auditor'      // GitHub & LinkedIn Profile Auditor
  | 'interview-prep'       // Interview Prep Coach (All Roles)
  | 'culture-fit'          // Culture and Values Alignment
  | 'salary-estimator'     // Salary Calculator (India & Global)
  | 'market-explorer'      // Real-Time Search-Grounded Market Explorer
  | 'cover-letter'         // Tailored Cover Letter Writer (Word & PDF)
  | 'bulk-ranker'          // Bulk Candidate Ranker
  | 'application-tracker'  // Application Pipeline Tracker
  | 'ats-diagnostics';     // 10-Tool ATS Diagnostics & Simulator Suite

const DEFAULT_PROFILE: UserProfile = {
  id: 'prof_default',
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  title: 'Data Scientist',
  experienceYears: 3,
  resumeFileName: 'Alex_Johnson_Resume.pdf',
  resumeText: 'Experienced Data Scientist with 3+ years in Python, SQL, Machine Learning, and Cloud Analytics.',
  savedSkills: [
    { name: 'Python', level: 'Advanced' },
    { name: 'SQL', level: 'Intermediate' },
    { name: 'Machine Learning', level: 'Intermediate' },
    { name: 'Data Analysis', level: 'Advanced' },
    { name: 'Git', level: 'Intermediate' }
  ],
  completedRoadmapMilestones: [],
  enrolledRoadmapRole: 'Data Scientist',
  enrolledRoadmapDate: 'Oct 1, 2026',
  quizScores: []
};

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('jobfit_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [appState, setAppState] = useState<ActiveToolTab>('upload');
  const [returnState, setReturnState] = useState<ActiveToolTab>('upload');
  
  // Specific role context for Quiz, Roadmap, CV, Cover Letter
  const [targetRole, setTargetRole] = useState<string>('Data Scientist');
  const [skillsForCV, setSkillsForCV] = useState<string[]>([]);

  // User Accounts & Local Vault
  const [allProfiles, setAllProfiles] = useState<UserProfile[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('jobfit_user_profiles');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (e) {}
      }
    }
    return [DEFAULT_PROFILE];
  });

  const [currentProfileId, setCurrentProfileId] = useState<string>(() => {
    return allProfiles[0]?.id || 'prof_default';
  });

  const currentProfile = useMemo(() => {
    return allProfiles.find(p => p.id === currentProfileId) || allProfiles[0] || DEFAULT_PROFILE;
  }, [allProfiles, currentProfileId]);

  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isCareerToolsOpen, setIsCareerToolsOpen] = useState(false);
  const toolsDropdownRef = useRef<HTMLDivElement>(null);

  // Live Market Intel State
  const [isLiveIntelModalOpen, setIsLiveIntelModalOpen] = useState(false);
  const [liveIntelRole, setLiveIntelRole] = useState('Data Scientist');
  const [selectedIntelLocationKey, setSelectedIntelLocationKey] = useState('india-bangalore');

  // Resume Viewer State
  const [isResumeViewerOpen, setIsResumeViewerOpen] = useState(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [uploadedFileText, setUploadedFileText] = useState<string>(currentProfile.resumeText || '');

  const handleOpenLiveIntel = (role: string) => {
    setLiveIntelRole(role);
    setIsLiveIntelModalOpen(true);
  };

  // Sync profiles to localStorage
  useEffect(() => {
    localStorage.setItem('jobfit_user_profiles', JSON.stringify(allProfiles));
  }, [allProfiles]);

  // Apply dark mode reliably
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('jobfit_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('jobfit_theme', 'light');
    }
  }, [isDarkMode]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (toolsDropdownRef.current && !toolsDropdownRef.current.contains(e.target as Node)) {
        setIsCareerToolsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Android & Mobile PWA Install state
  const [isMobileToolsOpen, setIsMobileToolsOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isPwaInstalled, setIsPwaInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    const handleAppInstalled = () => {
      setIsPwaInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallPwa = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice && choice.outcome === 'accepted') {
        setIsPwaInstalled(true);
      }
      setDeferredPrompt(null);
    }
  };
  
  // Inputs
  const [inputType, setInputType] = useState<'file' | 'text'>('file');
  const [textInput, setTextInput] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState<string>(currentProfile.resumeFileName || '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Skills Manual Entry State with Proficiency Levels
  const [skillProficiencies, setSkillProficiencies] = useState<Record<string, 'Beginner' | 'Intermediate' | 'Advanced'>>(() => {
    const init: Record<string, 'Beginner' | 'Intermediate' | 'Advanced'> = {};
    currentProfile.savedSkills.forEach(s => {
      init[s.name] = s.level;
    });
    return init;
  });

  const [selectedSkills, setSelectedSkills] = useState<string[]>(() => {
    return currentProfile.savedSkills.map(s => s.name);
  });

  const [skillSearch, setSkillSearch] = useState('');
  const [isSkillDropdownOpen, setIsSkillDropdownOpen] = useState(false);

  // Analysis Results State
  const [extractedSkills, setExtractedSkills] = useState<string[]>(() => {
    return currentProfile.savedSkills.map(s => s.name);
  });
  const [analyzedJobs, setAnalyzedJobs] = useState<any[]>([]);
  const [resultsSortBy, setResultsSortBy] = useState<'semantic' | 'base' | 'gaps'>('semantic');
  const [extractedSkillSearch, setExtractedSkillSearch] = useState('');
  const [isExtractedSkillDropdownOpen, setIsExtractedSkillDropdownOpen] = useState(false);

  const filteredExtractedSkills = AVAILABLE_SKILLS.filter(s => 
    s.toLowerCase().includes(extractedSkillSearch.toLowerCase()) && !extractedSkills.includes(s)
  );

  const filteredSkills = AVAILABLE_SKILLS.filter(s => 
    s.toLowerCase().includes(skillSearch.toLowerCase()) && !selectedSkills.includes(s)
  );

  const suggestedSkills = useMemo(() => {
    const suggestions = new Set<string>();
    selectedSkills.forEach(skill => {
      const related = SKILL_RELATIONS[skill];
      if (related) {
        related.forEach(r => {
          if (!selectedSkills.includes(r) && AVAILABLE_SKILLS.includes(r)) {
            suggestions.add(r);
          }
        });
      }
    });
    return Array.from(suggestions).slice(0, 8);
  }, [selectedSkills]);

  // Skill Level Setting handler
  const handleSetSkillLevel = (skillName: string, level: 'Beginner' | 'Intermediate' | 'Advanced') => {
    setSkillProficiencies(prev => ({
      ...prev,
      [skillName]: level
    }));

    // Update current profile
    setAllProfiles(prev => prev.map(p => {
      if (p.id === currentProfile.id) {
        const updatedSkills = p.savedSkills.map(s => s.name === skillName ? { ...s, level } : s);
        if (!updatedSkills.some(s => s.name === skillName)) {
          updatedSkills.push({ name: skillName, level });
        }
        return { ...p, savedSkills: updatedSkills };
      }
      return p;
    }));
  };

  const handleAddSkill = (skill: string) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills(prev => [...prev, skill]);
      const defaultLevel = getSkillLevel(skill) as 'Beginner' | 'Intermediate' | 'Advanced';
      setSkillProficiencies(prev => ({ ...prev, [skill]: defaultLevel }));

      setAllProfiles(prev => prev.map(p => {
        if (p.id === currentProfile.id) {
          return {
            ...p,
            savedSkills: [...p.savedSkills.filter(s => s.name !== skill), { name: skill, level: defaultLevel }]
          };
        }
        return p;
      }));
    }
    setSkillSearch('');
    setIsSkillDropdownOpen(false);
  };

  const handleRemoveSkill = (skill: string) => {
    setSelectedSkills(prev => prev.filter(s => s !== skill));
    setSkillProficiencies(prev => {
      const next = { ...prev };
      delete next[skill];
      return next;
    });

    setAllProfiles(prev => prev.map(p => {
      if (p.id === currentProfile.id) {
        return {
          ...p,
          savedSkills: p.savedSkills.filter(s => s.name !== skill)
        };
      }
      return p;
    }));
  };

  // Cancel / Clear uploaded file
  const handleCancelUpload = () => {
    setUploadedFileName('');
    setExtractedSkills([]);
    setUploadedFileUrl(null);
    setUploadedFileText('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadedFileName(file.name);
    const objectUrl = URL.createObjectURL(file);
    setUploadedFileUrl(objectUrl);
    
    let text = "";
    try {
      if (file.name.toLowerCase().endsWith('.pdf')) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let pdfText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          pdfText += content.items.map((item: any) => item.str).join(" ") + " ";
        }
        text = pdfText;
      } else if (file.name.toLowerCase().endsWith('.docx') || file.name.toLowerCase().endsWith('.doc')) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        text = result.value;
      } else {
        text = await file.text();
      }

      setUploadedFileText(text);

      // Simple regex match for skills
      const found = new Set<string>();
      AVAILABLE_SKILLS.forEach(skill => {
        const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        if (regex.test(text)) {
          found.add(skill);
        }
      });

      if (found.size === 0) {
        ["Python", "SQL", "Git", "Machine Learning"].forEach(s => found.add(s));
      }

      const extractedList = Array.from(found);
      setExtractedSkills(extractedList);

      // Save into active profile vault
      setAllProfiles(prev => prev.map(p => {
        if (p.id === currentProfile.id) {
          return {
            ...p,
            resumeFileName: file.name,
            resumeText: text.slice(0, 10000),
            savedSkills: extractedList.map(s => ({ name: s, level: getSkillLevel(s) as any }))
          };
        }
        return p;
      }));
    } catch (err) {
      console.error("File parse error:", err);
      setExtractedSkills(["Python", "SQL", "Data Analysis", "Git"]);
    }
  };

  const handleProcessInput = () => {
    setAppState('loading');
  };

  const runAnalysis = () => {
    const activeSkills = inputType === 'file' 
      ? (extractedSkills.length > 0 ? extractedSkills : ["Python", "SQL", "Data Analysis", "Git"]) 
      : selectedSkills;
    
    const results = JOB_DIRECTORY_DATA.map(job => {
      const match = job.skills.filter(s => activeSkills.includes(s));
      const missing = job.skills.filter(s => !activeSkills.includes(s));
      
      // Calculate weighted score based on proficiency levels
      let weightedMatchSum = 0;
      match.forEach(sk => {
        const lvl = skillProficiencies[sk] || getSkillLevel(sk);
        const weight = lvl === 'Advanced' ? 1.0 : lvl === 'Intermediate' ? 0.85 : 0.60;
        weightedMatchSum += weight;
      });

      const baseScore = Math.round((weightedMatchSum / job.skills.length) * 100);
      
      let semanticBoost = 0;
      activeSkills.forEach(skill => {
        const related = SKILL_RELATIONS[skill] || [];
        related.forEach(rel => {
          if (missing.includes(rel)) {
            semanticBoost += 4;
          }
        });
      });

      const semanticScore = Math.min(99, Math.round(baseScore * 0.8 + semanticBoost + (baseScore > 0 ? 15 : 0)));
      
      return {
        ...job,
        matchingSkills: match,
        missingSkills: missing,
        baseMatch: baseScore,
        semanticMatch: semanticScore,
        radarData: [
          { subject: 'Languages', candidate: match.length * 20, benchmark: 80 },
          { subject: 'Frameworks', candidate: match.length * 15, benchmark: 75 },
          { subject: 'Databases', candidate: match.includes('SQL') || match.includes('PostgreSQL') ? 90 : 30, benchmark: 70 },
          { subject: 'DevOps & Cloud', candidate: match.includes('AWS') || match.includes('Docker') ? 85 : 40, benchmark: 85 },
          { subject: 'Architecture', candidate: Math.min(100, semanticScore + 10), benchmark: 80 },
        ]
      };
    });

    setAnalyzedJobs(results);
    setAppState('results');
  };

  const handleOpenRoadmap = (role: string) => {
    setTargetRole(role);
    setAppState('job-directory');
  };

  const handleOpenQuiz = (role: string) => {
    setTargetRole(role);
    setAppState('quizzes');
  };

  // Context-aware Resume Builder navigation
  const handleOpenBuildCV = (role: string, matchingSkills: string[] = []) => {
    setReturnState(appState === 'results' ? 'results' : 'upload');
    setTargetRole(role);
    setSkillsForCV(matchingSkills.length > 0 ? matchingSkills : extractedSkills);
    setAppState('build-cv');
  };

  // Record quiz score into profile
  const handleRecordQuizScore = (quizId: string, title: string, score: number, total: number) => {
    setAllProfiles(prev => prev.map(p => {
      if (p.id === currentProfile.id) {
        return {
          ...p,
          quizScores: [
            ...p.quizScores.filter(q => q.quizId !== quizId),
            { quizId, title, score, total, date: new Date().toLocaleDateString() }
          ]
        };
      }
      return p;
    }));
  };

  // Toggle roadmap milestone
  const handleToggleRoadmapMilestone = (milestoneKey: string) => {
    setAllProfiles(prev => prev.map(p => {
      if (p.id === currentProfile.id) {
        const exists = p.completedRoadmapMilestones.includes(milestoneKey);
        return {
          ...p,
          completedRoadmapMilestones: exists
            ? p.completedRoadmapMilestones.filter(k => k !== milestoneKey)
            : [...p.completedRoadmapMilestones, milestoneKey]
        };
      }
      return p;
    }));
  };

  // Enroll in active career roadmap
  const handleEnrollRoadmap = (role: string) => {
    setAllProfiles(prev => prev.map(p => {
      if (p.id === currentProfile.id) {
        return {
          ...p,
          enrolledRoadmapRole: role,
          enrolledRoadmapDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        };
      }
      return p;
    }));
  };

  const handleUpdateProfile = (partial: Partial<UserProfile>) => {
    setAllProfiles(prev => prev.map(p => p.id === currentProfile.id ? { ...p, ...partial } : p));
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-sans selection:bg-blue-500/30 pb-20 transition-colors duration-200">
      {/* Account Modal */}
      <AccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        currentProfile={currentProfile}
        allProfiles={allProfiles}
        onSaveProfile={(updated) => {
          setAllProfiles(prev => prev.map(p => p.id === updated.id ? updated : p));
        }}
        onSwitchProfile={(id) => {
          setCurrentProfileId(id);
          const p = allProfiles.find(x => x.id === id);
          if (p) {
            setSelectedSkills(p.savedSkills.map(s => s.name));
            setUploadedFileName(p.resumeFileName || '');
          }
        }}
        onCreateProfile={(name, title) => {
          const newP: UserProfile = {
            id: `prof_${Date.now()}`,
            name,
            email: `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
            title,
            experienceYears: 2,
            savedSkills: [{ name: 'Python', level: 'Intermediate' }, { name: 'SQL', level: 'Beginner' }],
            completedRoadmapMilestones: [],
            enrolledRoadmapRole: title || 'Software Engineer',
            enrolledRoadmapDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            quizScores: []
          };
          setAllProfiles(prev => [...prev, newP]);
          setCurrentProfileId(newP.id);
        }}
        onDeleteProfile={(id) => {
          if (allProfiles.length <= 1) return;
          setAllProfiles(prev => prev.filter(p => p.id !== id));
          setCurrentProfileId(allProfiles[0].id);
        }}
        onUploadNewResume={(file) => {
          setUploadedFileName(file.name);
          handleFileUpload({ target: { files: [file] } } as any);
        }}
        onViewResume={() => setIsResumeViewerOpen(true)}
        onContinueRoadmap={(role) => handleOpenRoadmap(role)}
      />

      {/* Real-Time Search-Grounded Intel Modal */}
      <LiveIntelModal
        role={liveIntelRole}
        isOpen={isLiveIntelModalOpen}
        onClose={() => setIsLiveIntelModalOpen(false)}
        onOpenFullExplorer={(role, locKey) => {
          setTargetRole(role);
          setSelectedIntelLocationKey(locKey);
          setAppState('market-explorer');
        }}
        isDarkMode={isDarkMode}
      />

      {/* Resume PDF & Text Viewer Modal */}
      <ResumeViewerModal
        isOpen={isResumeViewerOpen}
        onClose={() => setIsResumeViewerOpen(false)}
        fileName={uploadedFileName || currentProfile.resumeFileName || 'Resume.pdf'}
        fileUrl={uploadedFileUrl}
        resumeText={uploadedFileText || currentProfile.resumeText || ''}
        detectedSkills={extractedSkills.length > 0 ? extractedSkills : currentProfile.savedSkills.map(s => s.name)}
        isDarkMode={isDarkMode}
      />

      {/* Primary Top Navbar */}
      <header className="bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-b border-neutral-200/90 dark:border-neutral-800 sticky top-0 z-40 shadow-2xs transition-colors duration-200 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2.5 cursor-pointer select-none" 
            onClick={() => setAppState('upload')}
          >
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-xs">
              <Network className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-neutral-950 dark:text-white leading-tight">JobFit Studio</span>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">Career Intelligence Suite</span>
            </div>
          </div>

          {/* Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center space-x-1 sm:space-x-2">
            {/* Home Button */}
            <button
              onClick={() => setAppState('upload')}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center transition-all cursor-pointer ${
                appState === 'upload' 
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800' 
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              <Home className="w-4 h-4 mr-1.5" />
              <span>Home</span>
            </button>

            {/* Analysis Results Tab (if analyzed) */}
            {analyzedJobs.length > 0 && (
              <button
                onClick={() => setAppState('results')}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center transition-all cursor-pointer ${
                  appState === 'results' 
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800' 
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                <BarChart className="w-4 h-4 mr-1.5" />
                <span>Job Matches</span>
              </button>
            )}

            {/* Dedicated ATS & Resume Diagnostics Suite Tab */}
            <button
              onClick={() => setAppState('ats-diagnostics')}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center transition-all cursor-pointer ${
                appState === 'ats-diagnostics' 
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800' 
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              <ShieldCheck className="w-4 h-4 mr-1.5 text-blue-600 dark:text-blue-400" />
              <span>ATS Diagnostics</span>
              <span className="ml-1.5 px-1.5 py-0.2 text-[9px] bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 rounded font-bold">10 Tools</span>
            </button>

            {/* Single Consolidated Career Tools Dropdown */}
            <div className="relative" ref={toolsDropdownRef}>
              <button
                onClick={() => setIsCareerToolsOpen(!isCareerToolsOpen)}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center transition-all border cursor-pointer ${
                  isCareerToolsOpen || !['upload', 'loading', 'results'].includes(appState)
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 hover:border-neutral-300 dark:hover:border-neutral-600 hover:bg-neutral-200/60 dark:hover:bg-neutral-700/60'
                }`}
              >
                <Layers className="w-4 h-4 mr-1.5" />
                <span>Career Tools</span>
                <ChevronDown className={`w-3.5 h-3.5 ml-1 transition-transform ${isCareerToolsOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Floating Categorized Menu */}
              {isCareerToolsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="space-y-3">
                    {/* Category: Assessment */}
                    <div>
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider px-3 mb-1 block">
                        Assess & Analyze
                      </span>
                      <div className="space-y-0.5">
                        <button
                          onClick={() => { setAppState('ats-diagnostics'); setIsCareerToolsOpen(false); }}
                          className="w-full p-2.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 text-left flex items-center space-x-3 transition-colors cursor-pointer"
                        >
                          <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                            <ShieldCheck className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-neutral-900 dark:text-white flex items-center">
                              <span>ATS Diagnostics & Tailor Suite</span>
                              <span className="ml-1.5 px-1.5 py-0.2 text-[9px] bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 rounded font-semibold">10 In-1</span>
                            </div>
                            <div className="text-[11px] text-neutral-500">Parse simulator, red flags, & mock chat</div>
                          </div>
                        </button>

                        <button
                          onClick={() => { setAppState('upload'); setIsCareerToolsOpen(false); }}
                          className="w-full p-2.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 text-left flex items-center space-x-3 transition-colors cursor-pointer"
                        >
                          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                            <Network className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-neutral-900 dark:text-white">Job Matcher</div>
                            <div className="text-[11px] text-neutral-500">Keywords & AI fit analysis</div>
                          </div>
                        </button>

                        <button
                          onClick={() => { setAppState('profile-auditor'); setIsCareerToolsOpen(false); }}
                          className="w-full p-2.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 text-left flex items-center space-x-3 transition-colors cursor-pointer"
                        >
                          <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                            <ShieldCheck className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-neutral-900 dark:text-white">Profile Auditor</div>
                            <div className="text-[11px] text-neutral-500">GitHub projects & LinkedIn check</div>
                          </div>
                        </button>

                        <button
                          onClick={() => { setAppState('culture-fit'); setIsCareerToolsOpen(false); }}
                          className="w-full p-2.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 text-left flex items-center space-x-3 transition-colors cursor-pointer"
                        >
                          <div className="p-2 rounded-lg bg-pink-50 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400">
                            <HeartHandshake className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-neutral-900 dark:text-white">Work Culture Fit</div>
                            <div className="text-[11px] text-neutral-500">Startup, Big Tech or Remote match</div>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Category: Practice & Benchmarks */}
                    <div className="border-t border-neutral-100 dark:border-neutral-800 pt-2">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider px-3 mb-1 block">
                        Prepare & Benchmark
                      </span>
                      <div className="space-y-0.5">
                        <button
                          onClick={() => { setAppState('job-directory'); setIsCareerToolsOpen(false); }}
                          className="w-full p-2.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 text-left flex items-center space-x-3 transition-colors cursor-pointer"
                        >
                          <div className="p-2 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
                            <Compass className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-neutral-900 dark:text-white">Learning Roadmaps</div>
                            <div className="text-[11px] text-neutral-500">Step-by-step milestones & tutorials</div>
                          </div>
                        </button>

                        <button
                          onClick={() => { setAppState('quizzes'); setIsCareerToolsOpen(false); }}
                          className="w-full p-2.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 text-left flex items-center space-x-3 transition-colors cursor-pointer"
                        >
                          <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                            <HelpCircle className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-neutral-900 dark:text-white">Skill Quizzes (10 Questions Each)</div>
                            <div className="text-[11px] text-neutral-500">10 topics with roadmap guidance</div>
                          </div>
                        </button>

                        <button
                          onClick={() => { setAppState('interview-prep'); setIsCareerToolsOpen(false); }}
                          className="w-full p-2.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 text-left flex items-center space-x-3 transition-colors cursor-pointer"
                        >
                          <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                            <BrainCircuit className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-neutral-900 dark:text-white">Interview Prep (All Roles)</div>
                            <div className="text-[11px] text-neutral-500">STAR questions & model answers</div>
                          </div>
                        </button>

                        <button
                          onClick={() => { setAppState('salary-estimator'); setIsCareerToolsOpen(false); }}
                          className="w-full p-2.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 text-left flex items-center space-x-3 transition-colors cursor-pointer"
                        >
                          <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                            <DollarSign className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-neutral-900 dark:text-white">Salary Calculator</div>
                            <div className="text-[11px] text-neutral-500">India metro hubs, global & currency</div>
                          </div>
                        </button>

                        <button
                          onClick={() => { setAppState('market-explorer'); setIsCareerToolsOpen(false); }}
                          className="w-full p-2.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 text-left flex items-center space-x-3 transition-colors cursor-pointer"
                        >
                          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                            <Globe className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-neutral-900 dark:text-white flex items-center">
                              <span>Market Explorer</span>
                              <span className="ml-1.5 px-1.5 py-0.2 text-[9px] bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 rounded font-semibold">Live Grounded</span>
                            </div>
                            <div className="text-[11px] text-neutral-500">Real-time 2026 salary, demand & skills</div>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Category: Documents & Applications */}
                    <div className="border-t border-neutral-100 dark:border-neutral-800 pt-2">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider px-3 mb-1 block">
                        Documents & Tracking
                      </span>
                      <div className="space-y-0.5">
                        <button
                          onClick={() => { handleOpenBuildCV(targetRole, extractedSkills); setIsCareerToolsOpen(false); }}
                          className="w-full p-2.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 text-left flex items-center space-x-3 transition-colors cursor-pointer"
                        >
                          <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-neutral-900 dark:text-white">Resume Builder</div>
                            <div className="text-[11px] text-neutral-500">1-click Word (.docx) & PDF (.pdf)</div>
                          </div>
                        </button>

                        <button
                          onClick={() => { setAppState('cover-letter'); setIsCareerToolsOpen(false); }}
                          className="w-full p-2.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 text-left flex items-center space-x-3 transition-colors cursor-pointer"
                        >
                          <div className="p-2 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400">
                            <Send className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-neutral-900 dark:text-white">Cover Letter Writer</div>
                            <div className="text-[11px] text-neutral-500">Word (.docx) & PDF exports</div>
                          </div>
                        </button>

                        <button
                          onClick={() => { setAppState('application-tracker'); setIsCareerToolsOpen(false); }}
                          className="w-full p-2.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 text-left flex items-center space-x-3 transition-colors cursor-pointer"
                        >
                          <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                            <ClipboardList className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-neutral-900 dark:text-white">Application Tracker</div>
                            <div className="text-[11px] text-neutral-500">Pipeline, interviews & offers</div>
                          </div>
                        </button>

                        <button
                          onClick={() => { setAppState('bulk-ranker'); setIsCareerToolsOpen(false); }}
                          className="w-full p-2.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 text-left flex items-center space-x-3 transition-colors cursor-pointer"
                        >
                          <div className="p-2 rounded-lg bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400">
                            <Users className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-neutral-900 dark:text-white">Candidate Ranker</div>
                            <div className="text-[11px] text-neutral-500">Batch compare resumes</div>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            {/* Android / Desktop PWA Install Button */}
            {deferredPrompt && (
              <button
                type="button"
                onClick={handleInstallPwa}
                className="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 flex items-center transition-all cursor-pointer min-h-[38px]"
                title="Install Android App to your Home Screen"
              >
                <Smartphone className="w-3.5 h-3.5 mr-1 text-emerald-600 dark:text-emerald-400" />
                <span className="hidden sm:inline">Install App</span>
                <span className="sm:hidden">Install</span>
              </button>
            )}

            {/* Profile Vault Button */}
            <button
              type="button"
              onClick={() => setIsAccountModalOpen(true)}
              className="px-3 py-1.5 min-h-[38px] rounded-xl text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-neutral-200/60 dark:hover:bg-neutral-700/60 flex items-center transition-all cursor-pointer"
              title="Career Vault & Saved Resumes"
            >
              <User className="w-3.5 h-3.5 mr-1.5 text-blue-600 dark:text-blue-400" />
              <span className="hidden sm:inline">{currentProfile.name.split(' ')[0]}</span>
              <span className="sm:hidden">Account</span>
            </button>

            {/* Dark Mode Toggle */}
            <button 
              type="button"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 min-h-[38px] min-w-[38px] rounded-xl text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Toggle theme"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-600" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 pb-24 md:pb-12">
        <AnimatePresence mode="wait">
          {/* UPLOAD & MANUAL ENTRY VIEW */}
          {appState === 'upload' && (
            <motion.div 
              key="upload"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-10"
            >
              {/* Hero Banner */}
              <div className="text-center max-w-3xl mx-auto space-y-3 pt-4">
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-1 border border-blue-200 dark:border-blue-800">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Interactive Career Platform</span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-neutral-950 dark:text-white leading-tight">
                  Find Your Perfect Job Fit
                </h1>
                <p className="text-base text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                  Upload your resume or pick your skills to see where you stand, practice 10-question quizzes, prepare for interviews, and build recruiter-ready resumes in Word and PDF.
                </p>
              </div>

              {/* Quick-Resume Enrolled Roadmap Banner */}
              {/* Quick-Resume Enrolled Roadmap Banner */}
              {currentProfile.enrolledRoadmapRole && (
                <div className="max-w-3xl mx-auto p-6 sm:p-7 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-xs space-y-5">
                  {(() => {
                    const progress = getRoleRoadmapProgress(
                      currentProfile.enrolledRoadmapRole!,
                      currentProfile.completedRoadmapMilestones
                    );
                    const { allMilestones } = getEnrichedRoadmapForRole(currentProfile.enrolledRoadmapRole!);

                    return (
                      <>
                        {/* Header & Action Button */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                              <BookmarkCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                              <span>Enrolled Learning Track</span>
                              <span aria-hidden="true">·</span>
                              <span className="font-mono tabular-nums text-neutral-400">
                                {progress.completedCount}/{progress.totalCount} Milestones
                              </span>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                              {currentProfile.enrolledRoadmapRole} Career Track
                            </h2>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                              Targeted industry milestones to bridge skill gaps and master high-demand capabilities.
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleOpenRoadmap(currentProfile.enrolledRoadmapRole!)}
                            className="px-4 py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 font-semibold text-xs transition-all shadow-xs flex items-center justify-center cursor-pointer shrink-0 self-start sm:self-center"
                          >
                            <span>Continue Track</span>
                            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                          </button>
                        </div>

                        {/* Refined Minimal Progress Visual with Subtle Dashed-Line Indicator */}
                        <div className="space-y-3 pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
                          {/* Top Metric Row */}
                          <div className="flex items-baseline justify-between text-xs">
                            <span className="font-medium text-neutral-500 dark:text-neutral-400">
                              Curriculum Progression
                            </span>
                            <div className="flex items-baseline gap-1.5">
                              <span className="font-mono tabular-nums font-bold text-base text-neutral-900 dark:text-white">
                                {progress.percent}%
                              </span>
                              <span className="text-[11px] text-neutral-400">
                                completed
                              </span>
                            </div>
                          </div>

                          {/* Minimal Progress Bar with Dashed Segment for Upcoming Milestones */}
                          <div className="relative py-2">
                            {/* Base track: subtle dashed line indicating upcoming milestones */}
                            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0 border-t-2 border-dashed border-neutral-200 dark:border-neutral-700" />

                            {/* Completed track: crisp solid line */}
                            <div
                              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-neutral-900 dark:bg-white rounded-full transition-all duration-300"
                              style={{ width: `${progress.percent}%` }}
                            />

                            {/* Milestone Nodes Along the Track */}
                            <div className="relative flex justify-between items-center w-full">
                              {allMilestones.map((m) => {
                                const isCompleted = currentProfile.completedRoadmapMilestones.includes(m.key);
                                const isCurrentNext = progress.nextMilestone?.key === m.key;

                                return (
                                  <div
                                    key={m.key}
                                    className="relative flex flex-col items-center group cursor-pointer"
                                    onClick={() => handleOpenRoadmap(currentProfile.enrolledRoadmapRole!)}
                                    title={`${m.title} (${isCompleted ? 'Completed' : isCurrentNext ? 'Next up' : 'Upcoming'})`}
                                  >
                                    {isCompleted ? (
                                      <div className="w-2.5 h-2.5 rounded-full bg-neutral-900 dark:bg-white ring-4 ring-white dark:ring-neutral-900 transition-transform group-hover:scale-125" />
                                    ) : isCurrentNext ? (
                                      <div className="relative">
                                        <div className="w-3.5 h-3.5 rounded-full border-2 border-neutral-900 dark:border-white bg-white dark:bg-neutral-900 ring-4 ring-white dark:ring-neutral-900 transition-transform group-hover:scale-125" />
                                        <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping" />
                                      </div>
                                    ) : (
                                      <div className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-600 ring-2 ring-white dark:ring-neutral-900 transition-transform group-hover:scale-125" />
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Bottom Contextual Status Callout */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs pt-1">
                            {progress.nextMilestone ? (
                              <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300">
                                <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-semibold">
                                  Next Milestone:
                                </span>
                                <strong className="font-semibold text-neutral-900 dark:text-white">
                                  {progress.nextMilestone.title}
                                </strong>
                                <span className="text-neutral-400 dark:text-neutral-500 text-[11px]">
                                  ({progress.nextMilestone.phaseTitle.split(':')[0]})
                                </span>
                              </div>
                            ) : progress.isFullyCompleted ? (
                              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center">
                                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                                <span>All curriculum milestones completed. You are recruiter-ready!</span>
                              </div>
                            ) : null}

                            <span className="text-[11px] font-mono text-neutral-400 dark:text-neutral-500 shrink-0">
                              {progress.totalCount - progress.completedCount} milestone{progress.totalCount - progress.completedCount === 1 ? '' : 's'} remaining
                            </span>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}

              {/* Mode Toggle & Input Workspace */}
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 rounded-3xl p-6 md:p-8 shadow-xs max-w-3xl mx-auto">
                {/* Mode Selector Tabs */}
                <div className="flex bg-neutral-100 dark:bg-neutral-800 p-1.5 rounded-2xl mb-6 border border-neutral-200 dark:border-neutral-700 max-w-sm mx-auto">
                  <button 
                    onClick={() => setInputType('file')}
                    className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center transition-all cursor-pointer ${
                      inputType === 'file' 
                        ? 'bg-white dark:bg-neutral-900 text-neutral-950 dark:text-white shadow-xs' 
                        : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50'
                    }`}
                  >
                    <UploadCloud className="w-4 h-4 mr-2" />
                    Upload Resume
                  </button>
                  <button 
                    onClick={() => setInputType('text')}
                    className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center transition-all cursor-pointer ${
                      inputType === 'text' 
                        ? 'bg-white dark:bg-neutral-900 text-neutral-950 dark:text-white shadow-xs' 
                        : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50'
                    }`}
                  >
                    <Type className="w-4 h-4 mr-2" />
                    Pick Skills & Levels
                  </button>
                </div>

                {inputType === 'file' ? (
                  /* File Upload Dropzone */
                  <div className="space-y-4">
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-blue-500 dark:hover:border-blue-400 bg-neutral-50/50 dark:bg-neutral-900/50 hover:bg-blue-50/20 dark:hover:bg-neutral-800/40 rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-3 group"
                    >
                      <input 
                        ref={fileInputRef} 
                        type="file" 
                        accept=".pdf,.docx,.doc,.txt" 
                        onChange={handleFileUpload} 
                        className="hidden" 
                      />
                      <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
                        <UploadCloud className="w-7 h-7" />
                      </div>
                      <div>
                        <span className="text-sm font-bold text-neutral-900 dark:text-white block">
                          Drop your resume file here or click to browse
                        </span>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 block">
                          Supports PDF, Word (.docx), or plain text. Saved securely to your local profile.
                        </span>
                      </div>
                    </div>

                    {uploadedFileName && (
                      <div className="p-4 bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-2xl space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-xs font-semibold text-blue-900 dark:text-blue-200">
                            <FileText className="w-4 h-4 text-blue-600" />
                            <span>Active Resume: <strong>{uploadedFileName}</strong></span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => setIsResumeViewerOpen(true)}
                              className="text-xs text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 bg-blue-100 dark:bg-blue-900/60 hover:bg-blue-200 dark:hover:bg-blue-800 px-2.5 py-1 rounded-lg transition-colors flex items-center cursor-pointer font-semibold"
                            >
                              <Eye className="w-3.5 h-3.5 mr-1" /> View / Read Resume
                            </button>
                            <button
                              onClick={handleCancelUpload}
                              className="text-xs text-neutral-500 dark:text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 px-2 py-1 rounded-lg transition-colors flex items-center cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove
                            </button>
                          </div>
                        </div>

                        {extractedSkills.length > 0 && (
                          <div className="pt-2 border-t border-blue-100 dark:border-blue-900/50">
                            <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block mb-2">
                              Detected Skills ({extractedSkills.length}):
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {extractedSkills.map(sk => (
                                <span key={sk} className="text-xs font-medium px-2.5 py-1 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200">
                                  {sk}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <button 
                          onClick={handleProcessInput}
                          className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md shadow-blue-600/20 text-xs flex items-center justify-center cursor-pointer"
                        >
                          <Sparkles className="w-4 h-4 mr-2" />
                          Run Match Analysis Against 10+ Tech Roles
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Manual Entry Mode with Interactive Clickable Proficiency Levels */
                  <div className="space-y-5">
                    <div>
                      <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-2">
                        Search & Add Your Skills:
                      </label>
                      
                      {/* Search Bar */}
                      <div className="relative">
                        <div className="flex items-center bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2.5">
                          <Search className="w-4 h-4 text-neutral-400 mr-2" />
                          <input 
                            type="text" 
                            placeholder="Search and add any skill (e.g. Python, SQL, React, AWS, Docker)..." 
                            value={skillSearch}
                            onChange={(e) => setSkillSearch(e.target.value)}
                            onFocus={() => setIsSkillDropdownOpen(true)}
                            className="bg-transparent flex-1 text-xs text-neutral-900 dark:text-white outline-none"
                          />
                        </div>

                        {isSkillDropdownOpen && filteredSkills.length > 0 && (
                          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl shadow-xl max-h-56 overflow-y-auto z-30 p-2">
                            {filteredSkills.slice(0, 12).map(skill => (
                              <button 
                                key={skill}
                                onClick={() => handleAddSkill(skill)}
                                className="w-full text-left px-3 py-2 text-xs hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-xl text-neutral-900 dark:text-white flex items-center justify-between cursor-pointer"
                              >
                                <span className="font-semibold">{skill}</span>
                                <span className="text-[10px] text-neutral-400">Add to Profile</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Selected Skills Cards with Interactive Level Chips */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                          Selected Skills with Proficiency Levels ({selectedSkills.length}):
                        </span>
                        <span className="text-[11px] text-neutral-400">Click a level to adjust fit</span>
                      </div>

                      {selectedSkills.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {selectedSkills.map(skill => {
                            const currentLvl = skillProficiencies[skill] || 'Intermediate';
                            return (
                              <div
                                key={skill}
                                className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 flex flex-col justify-between gap-2 shadow-2xs"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-neutral-900 dark:text-white capitalize">
                                    {skill}
                                  </span>
                                  <button
                                    onClick={() => handleRemoveSkill(skill)}
                                    className="p-1 rounded-md text-neutral-400 hover:text-rose-500 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                                    title="Remove skill"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>

                                {/* Clickable Beginner, Intermediate, Advanced Chips */}
                                <div className="flex items-center space-x-1.5 pt-1">
                                  {(['Beginner', 'Intermediate', 'Advanced'] as const).map(lvl => {
                                    const isChosen = currentLvl === lvl;
                                    let chipStyle = "bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800";
                                    if (isChosen) {
                                      if (lvl === 'Beginner') chipStyle = "bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 font-bold shadow-2xs hover:bg-amber-100/80 dark:hover:bg-amber-900/60";
                                      if (lvl === 'Intermediate') chipStyle = "bg-blue-50 dark:bg-blue-950/60 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 font-bold shadow-2xs hover:bg-blue-100/80 dark:hover:bg-blue-900/60";
                                      if (lvl === 'Advanced') chipStyle = "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 font-bold shadow-2xs hover:bg-emerald-100/80 dark:hover:bg-emerald-900/60";
                                    }
                                    return (
                                      <button
                                        key={lvl}
                                        type="button"
                                        onClick={() => handleSetSkillLevel(skill, lvl)}
                                        className={`px-2 py-1 rounded-lg text-[10px] border transition-all cursor-pointer flex-1 flex items-center justify-center space-x-1 ${chipStyle}`}
                                      >
                                        {isChosen && <Check className="w-2.5 h-2.5" />}
                                        <span>{lvl}</span>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="p-8 text-center border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl text-xs text-neutral-400">
                          No skills selected yet. Type in the search box above to add your core tech skills.
                        </div>
                      )}
                    </div>

                    {/* Quick Suggestions */}
                    {suggestedSkills.length > 0 && (
                      <div className="pt-2">
                        <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-2">
                          Popular Additions:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {suggestedSkills.map(s => (
                            <button
                              key={s}
                              onClick={() => handleAddSkill(s)}
                              className="px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all cursor-pointer"
                            >
                              + {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <button 
                      onClick={handleProcessInput}
                      disabled={selectedSkills.length === 0}
                      className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-2xl transition-all shadow-md shadow-blue-600/20 text-xs mt-4 flex items-center justify-center cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Check My Job Matches ({selectedSkills.length} skills)
                    </button>
                  </div>
                )}
              </div>

              {/* 11 Simple & Powerful Career Tools Grid (Resume Rewriter completely removed) */}
              <div className="space-y-6 pt-6">
                <div className="text-center max-w-2xl mx-auto space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white">
                    Integrated Career Tool Suite
                  </h2>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Everything you need to benchmark your skills, prepare for technical rounds, and land the role you want.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {[
                    {
                      id: 'upload',
                      num: '01',
                      title: 'Job Matcher',
                      tag: 'Keywords & Meaning',
                      desc: 'See how well your skills match real job openings using both direct keyword matches and related background.',
                      icon: Network,
                      color: 'text-blue-500',
                      bg: 'bg-blue-50 dark:bg-blue-950/50'
                    },
                    {
                      id: 'results',
                      num: '02',
                      title: 'Skill Gap Finder',
                      tag: 'Proficiency Levels',
                      desc: 'Quickly find out which skills you already have and which beginner, intermediate, or advanced skills to learn next.',
                      icon: Target,
                      color: 'text-rose-500',
                      bg: 'bg-rose-50 dark:bg-rose-950/50'
                    },
                    {
                      id: 'profile-auditor',
                      num: '03',
                      title: 'Profile Auditor',
                      tag: 'GitHub & LinkedIn',
                      desc: 'Review your public code projects and LinkedIn profile with clear tips to look professional and rank higher.',
                      icon: ShieldCheck,
                      color: 'text-emerald-500',
                      bg: 'bg-emerald-50 dark:bg-emerald-950/50'
                    },
                    {
                      id: 'interview-prep',
                      num: '04',
                      title: 'Interview Prep Coach',
                      tag: 'STAR & Tech Questions',
                      desc: 'Practice real interview questions covering all 10 roles in the app, with sample answers and common gotchas.',
                      icon: BrainCircuit,
                      color: 'text-indigo-500',
                      bg: 'bg-indigo-50 dark:bg-indigo-950/50'
                    },
                    {
                      id: 'build-cv',
                      num: '05',
                      title: 'Resume Builder',
                      tag: 'Word & PDF Downloads',
                      desc: 'Create clean, modern resumes that easily pass hiring software and download directly as Word (.docx) or PDF.',
                      icon: FileText,
                      color: 'text-teal-500',
                      bg: 'bg-teal-50 dark:bg-teal-950/50'
                    },
                    {
                      id: 'culture-fit',
                      num: '06',
                      title: 'Work Culture Fit',
                      tag: 'Team & Style Match',
                      desc: 'Discover what kind of work environment fits you best—from fast-paced startups to established enterprises.',
                      icon: HeartHandshake,
                      color: 'text-pink-500',
                      bg: 'bg-pink-50 dark:bg-pink-950/50'
                    },
                    {
                      id: 'job-directory',
                      num: '07',
                      title: 'Learning Roadmaps',
                      tag: 'Step-by-Step Milestones',
                      desc: 'Follow clear, step-by-step learning paths with free tutorials and track your milestone progress.',
                      icon: Compass,
                      color: 'text-sky-500',
                      bg: 'bg-sky-50 dark:bg-sky-950/50'
                    },
                    {
                      id: 'salary-estimator',
                      num: '08',
                      title: 'Salary Calculator',
                      tag: 'India Metro & Global',
                      desc: 'Check realistic pay ranges for your target role, with breakdowns for experience level, bonuses, and INR/USD conversion.',
                      icon: DollarSign,
                      color: 'text-amber-500',
                      bg: 'bg-amber-50 dark:bg-amber-950/50'
                    },
                    {
                      id: 'cover-letter',
                      num: '09',
                      title: 'Cover Letter Writer',
                      tag: 'Word & PDF Exports',
                      desc: 'Write personalized, engaging cover letters tailored to specific companies and download in Word (.docx) or PDF.',
                      icon: Send,
                      color: 'text-cyan-500',
                      bg: 'bg-cyan-50 dark:bg-cyan-950/50'
                    },
                    {
                      id: 'quizzes',
                      num: '10',
                      title: 'Skill Quizzes',
                      tag: '10 Questions Each',
                      desc: 'Test your technical readiness across 10 in-depth subjects with instant explanations and roadmap recommendations.',
                      icon: HelpCircle,
                      color: 'text-purple-500',
                      bg: 'bg-purple-50 dark:bg-purple-950/50'
                    },
                    {
                      id: 'application-tracker',
                      num: '11',
                      title: 'Application Tracker',
                      tag: 'Job Pipeline',
                      desc: 'Keep track of every job you apply to, monitor your match scores, and stay organized through interviews.',
                      icon: ClipboardList,
                      color: 'text-emerald-500',
                      bg: 'bg-emerald-50 dark:bg-emerald-950/50'
                    },
                    {
                      id: 'market-explorer',
                      num: '12',
                      title: 'Live Market Explorer',
                      tag: 'Search Grounded (2026)',
                      desc: 'Real-time compensation percentiles, hiring velocity, remote flexibility, and emerging skill demand verified via Google Search.',
                      icon: Globe,
                      color: 'text-blue-500',
                      bg: 'bg-blue-50 dark:bg-blue-950/50'
                    }
                  ].map((card) => {
                    const Icon = card.icon;
                    return (
                      <div
                        key={card.id}
                        onClick={() => {
                          if (card.id === 'results' && analyzedJobs.length === 0) {
                            setAppState('upload');
                          } else {
                            setAppState(card.id as ActiveToolTab);
                          }
                        }}
                        className="p-6 rounded-3xl bg-white dark:bg-neutral-900 hover:bg-neutral-50/70 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 hover:border-blue-400 dark:hover:border-blue-500 shadow-2xs hover:shadow-lg dark:hover:shadow-black/50 transition-all cursor-pointer group flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className={`p-3 rounded-2xl ${card.bg}`}>
                              <Icon className={`w-5 h-5 ${card.color}`} />
                            </div>
                            <span className="text-[11px] font-bold text-neutral-400">
                              {card.num}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-bold text-base text-neutral-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {card.title}
                              </h3>
                            </div>
                            <span className="inline-block text-[10px] font-semibold text-neutral-500 dark:text-neutral-400 mt-0.5">
                              [{card.tag}]
                            </span>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 leading-relaxed">
                              {card.desc}
                            </p>
                          </div>
                        </div>

                        <div className="pt-4 mt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
                          <span>Open Tool</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* LOADING VIEW */}
          {appState === 'loading' && (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center py-20"
            >
              <LoadingView onComplete={runAnalysis} inputType={inputType} />
            </motion.div>
          )}

          {/* RESULTS VIEW */}
          {appState === 'results' && (
            <motion.div 
              key="results"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              {/* Results Top Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-2xs">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                      Analysis Results
                    </span>
                    <span className="text-neutral-300 dark:text-neutral-700">·</span>
                    <span className="text-xs text-neutral-500">
                      {analyzedJobs.length} Positions Evaluated
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-neutral-950 dark:text-white">
                    Your Job Match Breakdown
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {(uploadedFileName || currentProfile.resumeFileName) && (
                    <button
                      type="button"
                      onClick={() => setIsResumeViewerOpen(true)}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/60 flex items-center transition-all cursor-pointer shadow-2xs"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1.5" />
                      <span>View CV Document</span>
                    </button>
                  )}

                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-semibold text-neutral-500">Sort By:</span>
                    <div className="flex bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs">
                      {(['semantic', 'base', 'gaps'] as const).map((s) => (
                        <button
                          key={s}
                          onClick={() => setResultsSortBy(s)}
                          className={`px-3 py-1 rounded-lg font-bold capitalize transition-all cursor-pointer ${
                            resultsSortBy === s
                              ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs'
                              : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white hover:bg-neutral-200/50 dark:hover:bg-neutral-700/60'
                          }`}
                        >
                          {s === 'semantic' ? 'Smart Fit' : s === 'base' ? 'Exact Match' : 'Least Gaps'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Cards Grid */}
              <div className="space-y-4">
                {[...analyzedJobs]
                  .sort((a, b) => {
                    if (resultsSortBy === 'semantic') return b.semanticMatch - a.semanticMatch;
                    if (resultsSortBy === 'base') return b.baseMatch - a.baseMatch;
                    return a.missingSkills.length - b.missingSkills.length;
                  })
                  .map((job) => (
                    <UnifiedModelGapCard
                      key={job.title}
                      job={{
                        role: job.title,
                        description: `Market compensation: ${job.salaryIndia} in India metro hubs.`,
                        tfidfScore: job.baseMatch,
                        semanticScore: job.semanticMatch,
                        matchingSkills: job.matchingSkills,
                        missingSkills: job.missingSkills,
                        radarData: job.radarData
                      }}
                      isDarkMode={isDarkMode}
                      onSelectRoadmap={() => handleOpenRoadmap(job.title)}
                      onSelectQuiz={() => handleOpenQuiz(job.title)}
                      onBuildCV={() => handleOpenBuildCV(job.title, job.matchingSkills)}
                      onOpenLiveIntel={() => handleOpenLiveIntel(job.title)}
                    />
                  ))}
              </div>
            </motion.div>
          )}

          {/* ROADMAPS VIEW */}
          {appState === 'job-directory' && (
            <motion.div
              key="job-directory"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <RoadmapSection
                initialRole={targetRole}
                onTakeQuiz={handleOpenQuiz}
                onBuildCV={handleOpenBuildCV}
                onBackToHome={() => setAppState('upload')}
                completedMilestones={currentProfile.completedRoadmapMilestones}
                onToggleMilestone={handleToggleRoadmapMilestone}
                enrolledRole={currentProfile.enrolledRoadmapRole}
                onEnrollRole={handleEnrollRoadmap}
              />
            </motion.div>
          )}

          {/* RESUME BUILDER (With fixed Context-Aware Back Button!) */}
          {appState === 'build-cv' && (
            <motion.div
              key="build-cv"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <ResumeBuilder
                initialRole={targetRole}
                initialSkills={skillsForCV.length > 0 ? skillsForCV : extractedSkills}
                onBack={() => setAppState(returnState)}
                backButtonLabel={returnState === 'results' ? '← Back to Job Matches' : '← Back to Home'}
                onOpenAtsDiagnostics={() => setAppState('ats-diagnostics')}
              />
            </motion.div>
          )}

          {/* ATS DIAGNOSTICS & SIMULATOR SUITE */}
          {appState === 'ats-diagnostics' && (
            <motion.div
              key="ats-diagnostics"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <AtsDiagnosticsSuite
                resumeText={currentProfile.resumeText || ''}
                onUpdateResumeText={(newText) => {
                  handleUpdateProfile({ resumeText: newText });
                }}
                targetRoleTitle={currentProfile.enrolledRoadmapRole || targetRole || 'Data Scientist'}
              />
            </motion.div>
          )}

          {/* PROFILE AUDITOR */}
          {appState === 'profile-auditor' && (
            <motion.div
              key="profile-auditor"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <ProfileAuditor targetRole={targetRole} />
            </motion.div>
          )}

          {/* INTERVIEW PREP */}
          {appState === 'interview-prep' && (
            <motion.div
              key="interview-prep"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <InterviewGenerator targetRole={targetRole} />
            </motion.div>
          )}

          {/* WORK CULTURE FIT */}
          {appState === 'culture-fit' && (
            <motion.div
              key="culture-fit"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <CultureAlignment />
            </motion.div>
          )}

          {/* SALARY CALCULATOR */}
          {appState === 'salary-estimator' && (
            <motion.div
              key="salary-estimator"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <SalaryEstimator initialRole={targetRole} userSkills={extractedSkills} />
            </motion.div>
          )}

          {/* REAL-TIME SEARCH-GROUNDED MARKET EXPLORER */}
          {appState === 'market-explorer' && (
            <motion.div
              key="market-explorer"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <RealtimeMarketExplorer
                initialRole={targetRole}
                initialLocationKey={selectedIntelLocationKey}
                isDarkMode={isDarkMode}
                onSelectRoadmap={handleOpenRoadmap}
                onSelectQuiz={handleOpenQuiz}
                onBuildCV={(role) => handleOpenBuildCV(role, extractedSkills)}
                onBackToHome={() => setAppState('upload')}
              />
            </motion.div>
          )}

          {/* COVER LETTER WRITER */}
          {appState === 'cover-letter' && (
            <motion.div
              key="cover-letter"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <CoverLetterGenerator initialRole={targetRole} userSkills={extractedSkills} />
            </motion.div>
          )}

          {/* CANDIDATE RANKER */}
          {appState === 'bulk-ranker' && (
            <motion.div
              key="bulk-ranker"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <BulkResumeRanker />
            </motion.div>
          )}

          {/* APPLICATION TRACKER */}
          {appState === 'application-tracker' && (
            <motion.div
              key="application-tracker"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <ApplicationTracker 
                currentAnalysisMatch={{ role: targetRole, score: 88 }} 
              />
            </motion.div>
          )}

          {/* PRACTICE MCQ QUIZZES */}
          {appState === 'quizzes' && (
            <motion.div 
              key="quizzes"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <QuizSection 
                initialQuizId={targetRole} 
                onBackToHome={() => setAppState('upload')}
                onSelectRoadmap={handleOpenRoadmap}
                onRecordQuizScore={handleRecordQuizScore}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Android & Mobile Fixed Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-t border-neutral-200/90 dark:border-neutral-800 pb-[env(safe-area-inset-bottom,0px)] shadow-lg print:hidden">
        <div className="grid grid-cols-5 items-center h-16 px-1">
          <button
            type="button"
            onClick={() => setAppState('upload')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors cursor-pointer ${
              appState === 'upload' || appState === 'loading'
                ? 'text-blue-600 dark:text-blue-400 font-bold'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Network className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight">Match</span>
          </button>

          <button
            type="button"
            onClick={() => setAppState('ats-diagnostics')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors cursor-pointer ${
              appState === 'ats-diagnostics'
                ? 'text-blue-600 dark:text-blue-400 font-bold'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <ShieldCheck className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight">ATS Suite</span>
          </button>

          <button
            type="button"
            onClick={() => setAppState('job-directory')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors cursor-pointer ${
              appState === 'job-directory'
                ? 'text-blue-600 dark:text-blue-400 font-bold'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Compass className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight">Roadmaps</span>
          </button>

          <button
            type="button"
            onClick={() => setAppState('interview-prep')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors cursor-pointer ${
              appState === 'interview-prep'
                ? 'text-blue-600 dark:text-blue-400 font-bold'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <BrainCircuit className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight">Interview</span>
          </button>

          <button
            type="button"
            onClick={() => setIsMobileToolsOpen(true)}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors cursor-pointer ${
              isMobileToolsOpen || !['upload', 'loading', 'results', 'ats-diagnostics', 'job-directory', 'interview-prep'].includes(appState)
                ? 'text-blue-600 dark:text-blue-400 font-bold'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <LayoutGrid className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight">Tools</span>
          </button>
        </div>
      </nav>

      {/* Mobile Tools Drawer (Bottom Sheet) */}
      <AnimatePresence>
        {isMobileToolsOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileToolsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="relative z-10 bg-white dark:bg-neutral-900 rounded-t-3xl border-t border-neutral-200 dark:border-neutral-800 p-5 space-y-4 max-h-[85vh] overflow-y-auto overscroll-contain shadow-2xl"
            >
              {/* Grab Handle */}
              <div className="w-12 h-1.5 bg-neutral-300 dark:bg-neutral-700 rounded-full mx-auto" />

              <div className="flex items-center justify-between pt-1">
                <div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                    Career Suite & Tools
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Document generators, assessments, and interview prep
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileToolsOpen(false)}
                  className="p-2 min-h-[44px] min-w-[44px] rounded-full text-neutral-400 hover:text-neutral-900 dark:hover:text-white flex items-center justify-center cursor-pointer"
                  aria-label="Close tools menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Install PWA Prompt for Android */}
              {deferredPrompt && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between gap-3">
                  <div className="flex items-center space-x-2.5">
                    <Smartphone className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-emerald-900 dark:text-emerald-200">Install Android App</div>
                      <div className="text-[11px] text-emerald-700 dark:text-emerald-400">Add to home screen for full-screen offline use</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => { handleInstallPwa(); setIsMobileToolsOpen(false); }}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shrink-0 cursor-pointer shadow-xs"
                  >
                    Install
                  </button>
                </div>
              )}

              {/* Tools List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {[
                  {
                    id: 'ats-diagnostics',
                    label: 'ATS Diagnostics (10-in-1)',
                    sub: 'Parser simulator & impact scorer',
                    icon: ShieldCheck,
                    color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-400',
                    action: () => setAppState('ats-diagnostics')
                  },
                  {
                    id: 'build-cv',
                    label: 'Resume Builder',
                    sub: '1-click Word (.docx) & PDF (.pdf)',
                    icon: FileText,
                    color: 'text-teal-600 bg-teal-50 dark:bg-teal-950/60 dark:text-teal-400',
                    action: () => handleOpenBuildCV(targetRole, extractedSkills)
                  },
                  {
                    id: 'cover-letter',
                    label: 'Cover Letter Writer',
                    sub: 'Tailored letters for any tech role',
                    icon: Send,
                    color: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-950/60 dark:text-cyan-400',
                    action: () => setAppState('cover-letter')
                  },
                  {
                    id: 'application-tracker',
                    label: 'Application Tracker',
                    sub: 'Pipeline, interviews & offers',
                    icon: ClipboardList,
                    color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400',
                    action: () => setAppState('application-tracker')
                  },
                  {
                    id: 'quizzes',
                    label: 'Skill Quizzes (10 Questions Each)',
                    sub: '10 skill categories with scoring',
                    icon: HelpCircle,
                    color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/60 dark:text-purple-400',
                    action: () => setAppState('quizzes')
                  },
                  {
                    id: 'interview-prep',
                    label: 'Interview Practice',
                    sub: 'Role STAR questions & answers',
                    icon: BrainCircuit,
                    color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-400',
                    action: () => setAppState('interview-prep')
                  },
                  {
                    id: 'salary-estimator',
                    label: 'Salary Calculator',
                    sub: 'India metro hubs & global rates',
                    icon: DollarSign,
                    color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-400',
                    action: () => setAppState('salary-estimator')
                  },
                  {
                    id: 'market-explorer',
                    label: 'Market Explorer (Live)',
                    sub: 'Live 2026 hiring trends & tech stack',
                    icon: Globe,
                    color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/60 dark:text-blue-400',
                    action: () => setAppState('market-explorer')
                  },
                  {
                    id: 'culture-fit',
                    label: 'Work Culture Fit',
                    sub: 'Startup, Big Tech, or Remote',
                    icon: HeartHandshake,
                    color: 'text-pink-600 bg-pink-50 dark:bg-pink-950/60 dark:text-pink-400',
                    action: () => setAppState('culture-fit')
                  },
                  {
                    id: 'bulk-ranker',
                    label: 'Candidate Ranker',
                    sub: 'Batch compare multiple resumes',
                    icon: Users,
                    color: 'text-violet-600 bg-violet-50 dark:bg-violet-950/60 dark:text-violet-400',
                    action: () => setAppState('bulk-ranker')
                  },
                  {
                    id: 'profile-auditor',
                    label: 'Profile Auditor',
                    sub: 'GitHub projects & LinkedIn check',
                    icon: ShieldCheck,
                    color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400',
                    action: () => setAppState('profile-auditor')
                  }
                ].map(tool => {
                  const Icon = tool.icon;
                  return (
                    <button
                      key={tool.id}
                      type="button"
                      onClick={() => { tool.action(); setIsMobileToolsOpen(false); }}
                      className="w-full p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700/60 flex items-center space-x-3 text-left transition-colors cursor-pointer min-h-[48px]"
                    >
                      <div className={`p-2 rounded-xl shrink-0 ${tool.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                          {tool.label}
                        </div>
                        <div className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                          {tool.sub}
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

const LoadingView = ({ onComplete, inputType }: { onComplete: () => void, inputType: 'file' | 'text' }) => {
  const [step, setStep] = useState(0);
  const steps = [
    inputType === 'file' ? "Reading your resume file... [File Parser]" : "Reading your selected skills...",
    "Finding and organizing key skills... [Text Normalization]",
    "Matching exact skill keywords with open jobs... [Direct Keyword Match]",
    "Understanding related skills and experience... [Smart Semantic Match]",
    "Calculating match scores and finding skill gaps... [Fit Scoring]"
  ];

  useEffect(() => {
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep >= steps.length) {
        clearInterval(interval);
        setTimeout(onComplete, 500);
      } else {
        setStep(currentStep);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-8 w-full max-w-md">
      <div className="relative flex items-center justify-center w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-3xl shadow-inner">
         <BrainCircuit className="w-10 h-10 text-blue-600 dark:text-blue-400 animate-pulse" />
         <div className="absolute inset-0 border-4 border-blue-200 dark:border-blue-900/50 border-t-blue-600 dark:border-t-blue-400 rounded-3xl animate-spin"></div>
      </div>
      <div className="text-center w-full">
        <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Analyzing Your Profile</h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-6">Comparing your skills with target tech jobs in everyday language</p>
        
        <div className="space-y-3 text-left">
          {steps.map((s, i) => (
            <div key={i} className={`flex items-center space-x-3 text-sm ${i > step ? 'opacity-30' : 'opacity-100'} transition-opacity duration-300`}>
              {i < step ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
              ) : i === step ? (
                <div className="w-5 h-5 border-2 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
              ) : (
                <div className="w-5 h-5 border-2 border-neutral-300 dark:border-neutral-600 rounded-full flex-shrink-0" />
              )}
              <span className={`font-medium ${i === step ? 'text-blue-700 dark:text-blue-400 font-semibold' : i < step ? 'text-neutral-600 dark:text-neutral-300' : 'text-neutral-400 dark:text-neutral-500'}`}>
                {s}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
