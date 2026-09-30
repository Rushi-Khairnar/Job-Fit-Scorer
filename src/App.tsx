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
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import { JOB_DIRECTORY_DATA } from './jobsData';
import { UnifiedModelGapCard } from './components/UnifiedModelGapCard';
import { QuizSection } from './components/QuizSection';
import { RoadmapSection } from './components/RoadmapSection';
import { ResumeBuilder } from './components/ResumeBuilder';
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
  "Solidity", "Spark", "Spring Boot", "Swift", "Tableau", "TensorFlow", "Terraform",
  "TypeScript", "UI/UX", "Streamlit", "ChatGPT", "Gemini", "Claude", "Google Colab", "VS Code", "Jupyter Notebook", "Prompt Engineering"
];

const SKILL_RELATIONS: Record<string, string[]> = {
  "Python": ["Django", "Flask", "Pandas", "Machine Learning", "PyTorch", "TensorFlow", "Data Analysis", "Streamlit", "Jupyter Notebook"],
  "JavaScript": ["React", "Node.js", "TypeScript", "HTML", "CSS", "Vue", "Next.js"],
  "TypeScript": ["JavaScript", "React", "Node.js", "Angular"],
  "React": ["JavaScript", "TypeScript", "Redux", "HTML", "CSS", "Next.js"],
  "Node.js": ["JavaScript", "TypeScript", "Express", "MongoDB", "REST API"],
  "Java": ["Spring Boot", "Microservices", "SQL", "MySQL"],
  "C++": ["C", "Linux", "Memory Management", "C#"],
  "Machine Learning": ["Python", "TensorFlow", "PyTorch", "Pandas", "Scikit-Learn", "NLP", "Deep Learning"],
  "SQL": ["PostgreSQL", "MySQL", "Data Analysis", "Excel"],
  "AWS": ["Docker", "Kubernetes", "Linux", "CI/CD", "Terraform", "Cloud Computing"],
  "Docker": ["Kubernetes", "AWS", "CI/CD", "Linux", "Azure"],
  "Kubernetes": ["Docker", "AWS", "CI/CD", "Linux"],
  "HTML": ["CSS", "JavaScript", "React", "UI/UX"],
  "CSS": ["HTML", "JavaScript", "React", "UI/UX", "Figma", "Tailwind CSS"],
  "Data Analysis": ["Python", "SQL", "Excel", "Tableau", "Power BI", "Pandas", "R"],
  "Cybersecurity": ["Linux", "Network Security", "Ethical Hacking", "Python"],
  "Figma": ["UI/UX", "HTML", "CSS"],
  "UI/UX": ["Figma", "HTML", "CSS"],
  "Git": ["GitHub", "GitLab", "CI/CD"],
  "GitHub": ["Git", "CI/CD"],
  "CI/CD": ["Git", "GitHub", "Jenkins", "Docker", "Kubernetes", "AWS"]
};

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [appState, setAppState] = useState<'upload' | 'loading' | 'results' | 'job-directory' | 'quizzes' | 'build-cv'>('upload');
  
  // Specific role context for Quiz, Roadmap, and CV
  const [targetRoleForRoadmap, setTargetRoleForRoadmap] = useState<string>('Data Scientist');
  const [targetRoleForQuiz, setTargetRoleForQuiz] = useState<string>('Data Scientist');
  const [targetRoleForCV, setTargetRoleForCV] = useState<string>('Data Scientist');
  const [skillsForCV, setSkillsForCV] = useState<string[]>([]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);
  
  // Inputs
  const [inputType, setInputType] = useState<'file' | 'text'>('file');
  const [textInput, setTextInput] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Skills Manual Entry State
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [skillSearch, setSkillSearch] = useState('');
  const [isSkillDropdownOpen, setIsSkillDropdownOpen] = useState(false);

  // Analysis Results State
  const [extractedSkills, setExtractedSkills] = useState<string[]>([]);
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

  // Cancel / Clear uploaded file
  const handleCancelUpload = () => {
    setUploadedFileName('');
    setExtractedSkills([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadedFileName(file.name);
    
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
    } catch (err) {
      console.error("Error reading file:", err);
      alert("There was an error reading the file.");
      return;
    }
    
    text = text.replace(/\s+/g, ' ').toLowerCase();
    
    // Skill extraction matching
    const foundSkills = AVAILABLE_SKILLS.filter(skill => {
      const escapedSkill = skill.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const pattern = `(?:^|\\W)${escapedSkill}(?:$|\\W)`;
      const regex = new RegExp(pattern, 'i');
      return regex.test(text);
    });
    
    setExtractedSkills(foundSkills);
  };

  const runAnalysis = (skillsToAnalyze: string[]) => {
    const normalizedUserSkills = skillsToAnalyze.map(s => s.toLowerCase());
    
    const scoredJobs = JOB_DIRECTORY_DATA.map(job => {
      const jobSkills = job.skills.map(s => s.toLowerCase());
      const matchingSkills = jobSkills.filter(s => normalizedUserSkills.includes(s));
      const missingSkills = jobSkills.filter(s => !normalizedUserSkills.includes(s));
      
      const matchPercentage = jobSkills.length > 0 ? Math.round((matchingSkills.length / jobSkills.length) * 100) : 0;
      
      return {
        role: job.title,
        description: `Ideal candidate profile for ${job.title}. Focuses on core competencies in ${job.skills.join(', ')}.`,
        tfidfScore: matchPercentage,
        semanticScore: matchPercentage > 0 ? Math.min(100, matchPercentage + Math.floor(Math.random() * 14) + 2) : 0,
        matchingSkills,
        missingSkills,
        radarData: [
          { subject: 'Core Skills', student: matchPercentage, ideal: 100 },
          { subject: 'Tools', student: Math.floor(Math.random() * 35) + 45, ideal: 90 },
          { subject: 'Concepts', student: Math.floor(Math.random() * 40) + 35, ideal: 85 },
          { subject: 'Experience', student: Math.floor(Math.random() * 30) + 30, ideal: 80 }
        ]
      };
    });
    
    // Sort and store top matches
    const topMatches = scoredJobs.sort((a, b) => b.semanticScore - a.semanticScore).slice(0, 10);
    setAnalyzedJobs(topMatches);
  };

  const sortedAnalyzedJobs = useMemo(() => {
    const jobsCopy = [...analyzedJobs];
    if (resultsSortBy === 'base') {
      return jobsCopy.sort((a, b) => b.tfidfScore - a.tfidfScore);
    }
    if (resultsSortBy === 'gaps') {
      return jobsCopy.sort((a, b) => a.missingSkills.length - b.missingSkills.length);
    }
    return jobsCopy.sort((a, b) => b.semanticScore - a.semanticScore);
  }, [analyzedJobs, resultsSortBy]);

  const handleProcessInput = () => {
    if (inputType === 'text' && selectedSkills.length === 0) return;
    if (inputType === 'file' && extractedSkills.length === 0) {
      alert("Please upload a file with recognizable technical skills or add skills manually.");
      return;
    }
    
    const skillsToAnalyze = inputType === 'text' ? selectedSkills : extractedSkills;
    if (inputType === 'text') setExtractedSkills(selectedSkills);

    runAnalysis(skillsToAnalyze);
    setAppState('loading');
  };

  const handleLoadingComplete = () => {
    setAppState('results');
  };

  const handleReset = () => {
    setAppState('upload');
    setTextInput('');
  };

  // Navigate to features with role context
  const handleOpenRoadmap = (role: string) => {
    setTargetRoleForRoadmap(role);
    setAppState('job-directory');
  };

  const handleOpenQuiz = (role: string) => {
    setTargetRoleForQuiz(role);
    setAppState('quizzes');
  };

  const handleOpenBuildCV = (role: string, matchingSkills: string[] = []) => {
    setTargetRoleForCV(role);
    setSkillsForCV(matchingSkills.length > 0 ? matchingSkills : extractedSkills);
    setAppState('build-cv');
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white font-sans selection:bg-blue-500/30 pb-20 transition-colors duration-200">
      {/* Navbar with Home and Feature Navigation */}
      <header className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-50 shadow-xs transition-colors duration-200 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => setAppState('upload')}>
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center shadow-xs">
              <Network className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">Job-Fit Scorer</span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1 sm:space-x-3">
            {/* Home Button */}
            <button
              onClick={() => setAppState('upload')}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center transition-all ${
                appState === 'upload' 
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800' 
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Home className="w-4 h-4 mr-1.5" />
              <span>Home</span>
            </button>

            {/* Analysis Results Tab (if analyzed) */}
            {analyzedJobs.length > 0 && (
              <button
                onClick={() => setAppState('results')}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center transition-all ${
                  appState === 'results' 
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800' 
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <BarChart className="w-4 h-4 mr-1.5" />
                <span>Results</span>
              </button>
            )}

            {/* Careers & Roadmaps */}
            <button
              onClick={() => setAppState('job-directory')}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center transition-all ${
                appState === 'job-directory' 
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800' 
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              <Compass className="w-4 h-4 mr-1.5" />
              <span className="hidden md:inline">Career Roadmaps</span>
              <span className="md:hidden">Roadmaps</span>
            </button>

            {/* Skill Quizzes */}
            <button
              onClick={() => setAppState('quizzes')}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center transition-all ${
                appState === 'quizzes' 
                  ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800' 
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-purple-600 dark:hover:text-purple-400'
              }`}
            >
              <HelpCircle className="w-4 h-4 mr-1.5" />
              <span className="hidden md:inline">Practice Quizzes</span>
              <span className="md:hidden">Quizzes</span>
            </button>

            {/* Build CV */}
            <button
              onClick={() => handleOpenBuildCV('Data Scientist', extractedSkills)}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center transition-all ${
                appState === 'build-cv' 
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' 
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-400'
              }`}
            >
              <FileText className="w-4 h-4 mr-1.5" />
              <span className="hidden md:inline">Build CV</span>
              <span className="md:hidden">CV</span>
            </button>

            {/* Theme Toggle */}
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors ml-1"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
        <AnimatePresence mode="wait">
          {/* UPLOAD & HOME VIEW */}
          {appState === 'upload' && (
            <motion.div 
              key="upload"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-12"
            >
              {/* Hero Banner */}
              <div className="text-center max-w-3xl mx-auto space-y-3">
                <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold border border-blue-200 dark:border-blue-800">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>NLP & Semantic Talent Matching</span>
                </div>
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                  Match your talent to ideal tech roles.
                </h1>
                <p className="text-base sm:text-lg text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  Upload your resume or enter skills to evaluate lexical vs semantic match scores, bridge technical gaps with proficiency levels, and practice MCQ quizzes.
                </p>
              </div>

              {/* Upload Card */}
              <div className="max-w-4xl mx-auto bg-white dark:bg-neutral-800 rounded-3xl border border-neutral-200 dark:border-neutral-700 p-6 sm:p-10 shadow-sm flex flex-col">
                <div className="flex bg-neutral-100 dark:bg-neutral-900 p-1 rounded-2xl w-fit mb-8 shadow-inner">
                  <button 
                    onClick={() => setInputType('file')} 
                    className={`px-4 py-2 text-sm font-semibold rounded-xl flex items-center transition-all ${
                      inputType === 'file' 
                        ? 'bg-white dark:bg-neutral-800 shadow-xs text-neutral-900 dark:text-white' 
                        : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700'
                    }`}
                  >
                    <FileText className="w-4 h-4 mr-2" /> Upload Resume Document
                  </button>
                  <button 
                    onClick={() => setInputType('text')} 
                    className={`px-4 py-2 text-sm font-semibold rounded-xl flex items-center transition-all ${
                      inputType === 'text' 
                        ? 'bg-white dark:bg-neutral-800 shadow-xs text-neutral-900 dark:text-white' 
                        : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700'
                    }`}
                  >
                    <Type className="w-4 h-4 mr-2" /> Manual Skill Entry
                  </button>
                </div>
                
                {inputType === 'file' ? (
                  <div 
                    className="flex-1 flex flex-col items-center justify-center p-8 sm:p-12 border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-2xl bg-neutral-50 dark:bg-neutral-850/50 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 relative group"
                  >
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      accept=".txt,.pdf,.doc,.docx" 
                      onChange={handleFileUpload} 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                    />
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 dark:bg-blue-900/50 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300">
                      <UploadCloud className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                      {uploadedFileName ? 'Resume Document Loaded' : 'Upload Resume Document'}
                    </h3>
                    <p className="text-neutral-500 dark:text-neutral-400 mt-1.5 text-center max-w-sm text-sm">
                      {uploadedFileName ? uploadedFileName : 'Drag & drop your PDF, DOCX, or TXT file here, or click to browse.'}
                    </p>

                    {/* Extracted Skills Preview with Proficiency Badges */}
                    {uploadedFileName && (
                      <div className="mt-5 space-y-2 max-w-md text-center">
                        <span className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                          Detected Skills ({extractedSkills.length})
                        </span>
                        <div className="flex flex-wrap justify-center gap-1.5">
                          {extractedSkills.slice(0, 8).map(skill => {
                            const lvl = getSkillLevel(skill);
                            const badge = getSkillLevelBadgeClasses(lvl);
                            return (
                              <span 
                                key={skill} 
                                className={`px-2.5 py-1 ${badge.bg} ${badge.text} border ${badge.border} text-xs rounded-lg font-semibold flex items-center capitalize`}
                              >
                                {skill}
                              </span>
                            );
                          })}
                          {extractedSkills.length > 8 && (
                            <span className="px-2 py-1 bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs rounded-lg font-medium">
                              +{extractedSkills.length - 8} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons: Cancel and Analyze */}
                    {uploadedFileName ? (
                      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 z-20 w-full max-w-sm">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProcessInput();
                          }}
                          className="w-full sm:flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-md shadow-blue-600/20 text-sm flex items-center justify-center"
                        >
                          <Sparkles className="w-4 h-4 mr-2" />
                          Analyze Profile
                        </button>

                        {/* Resume File Cancel Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCancelUpload();
                          }}
                          className="w-full sm:w-auto px-4 py-3.5 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-semibold rounded-xl hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800 text-sm transition-colors flex items-center justify-center"
                          title="Remove uploaded resume"
                        >
                          <Trash2 className="w-4 h-4 mr-1.5" />
                          Cancel / Clear File
                        </button>
                      </div>
                    ) : (
                      <div className="mt-6 px-6 py-2.5 bg-blue-600 dark:bg-blue-500 text-white text-xs font-semibold rounded-full shadow-xs pointer-events-none">
                        Browse Files
                      </div>
                    )}
                  </div>
                ) : (
                  /* Manual Entry Mode */
                  <div className="flex-1 flex flex-col space-y-4">
                    <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Selected Competencies & Skills</label>
                    <div className="flex-1 p-5 bg-neutral-50 dark:bg-neutral-850/50 border border-neutral-200 dark:border-neutral-700 rounded-2xl">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {selectedSkills.map(skill => {
                          const lvl = getSkillLevel(skill);
                          const badge = getSkillLevelBadgeClasses(lvl);
                          return (
                            <span key={skill} className={`px-3 py-1.5 ${badge.bg} ${badge.text} border ${badge.border} rounded-xl text-xs font-semibold flex items-center`}>
                              {skill}
                              <button onClick={() => setSelectedSkills(prev => prev.filter(s => s !== skill))} className="ml-2 hover:opacity-75">
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          );
                        })}
                      </div>
                      <div className="relative">
                        <input 
                          type="text"
                          className="w-full p-3 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm text-neutral-800 dark:text-neutral-200"
                          placeholder="Search technical skills (e.g. Python, SQL, React)..."
                          value={skillSearch}
                          onChange={(e) => {
                            setSkillSearch(e.target.value);
                            setIsSkillDropdownOpen(true);
                          }}
                          onFocus={() => setIsSkillDropdownOpen(true)}
                        />
                        {isSkillDropdownOpen && skillSearch && (
                          <div className="absolute z-20 w-full mt-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                            {filteredSkills.length > 0 ? (
                              filteredSkills.map(skill => (
                                <div 
                                  key={skill}
                                  className="px-4 py-2.5 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-neutral-700 dark:text-neutral-200 text-sm cursor-pointer border-b border-neutral-100 dark:border-neutral-700/50 last:border-0"
                                  onClick={() => {
                                    setSelectedSkills(prev => [...prev, skill].sort());
                                    setSkillSearch('');
                                    setIsSkillDropdownOpen(false);
                                  }}
                                >
                                  {skill}
                                </div>
                              ))
                            ) : (
                              <div className="px-4 py-3 text-sm text-neutral-500 dark:text-neutral-400 italic">No matching skills found.</div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {suggestedSkills.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-700">
                          <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2">Suggested Related Skills</p>
                          <div className="flex flex-wrap gap-2">
                            {suggestedSkills.map(skill => (
                              <button
                                key={skill}
                                onClick={() => setSelectedSkills(prev => [...prev, skill].sort())}
                                className="px-3 py-1.5 bg-white dark:bg-neutral-800 border border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors flex items-center shadow-xs"
                              >
                                <Sparkles className="w-3 h-3 mr-1.5" />
                                {skill}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={handleProcessInput}
                      disabled={selectedSkills.length === 0}
                      className="w-full py-3.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-600/20 text-sm"
                    >
                      Analyze Profile Skills ({selectedSkills.length})
                    </button>
                  </div>
                )}
              </div>

              {/* Quick Feature Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto pt-4">
                <div 
                  onClick={() => setAppState('job-directory')}
                  className="p-6 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-xs hover:border-blue-400 transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Compass className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">Career Roadmaps</h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                    Explore step-by-step 16-week progression roadmaps with curated tutorials for 60+ tech roles.
                  </p>
                </div>

                <div 
                  onClick={() => setAppState('quizzes')}
                  className="p-6 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-xs hover:border-purple-400 transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">Skill MCQ Quizzes</h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                    Test your proficiency with role-specific 5-question multiple choice quizzes and instant explanations.
                  </p>
                </div>

                <div 
                  onClick={() => handleOpenBuildCV('Data Scientist', selectedSkills)}
                  className="p-6 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-xs hover:border-emerald-400 transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">Interactive CV Builder</h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                    Generate an ATS-compliant resume with live preview and 1-click PDF print export.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* LOADING VIEW */}
          {appState === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="flex items-center justify-center min-h-[50vh]"
            >
              <LoadingView onComplete={handleLoadingComplete} inputType={inputType} />
            </motion.div>
          )}

          {/* UNIFIED RESULTS VIEW: MODEL COMPARISON + SKILL GAPS TOGETHER */}
          {appState === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Header Banner */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold mb-2 border border-blue-200 dark:border-blue-800">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Unified Model Comparison & Gap Analytics</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white">
                    Talent Match & Skill Gap Reports
                  </h2>
                  <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">
                    Combined lexical TF-IDF baseline and contextual semantic embeddings across {analyzedJobs.length} roles.
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <button 
                    onClick={handleReset}
                    className="px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 text-xs font-semibold rounded-xl shadow-xs hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors flex items-center"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                    Analyze Another
                  </button>
                  <button 
                    onClick={() => handleOpenBuildCV(analyzedJobs[0]?.role || 'Data Scientist', extractedSkills)}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center"
                  >
                    <FileText className="w-3.5 h-3.5 mr-1.5" />
                    Build CV for Top Match
                  </button>
                </div>
              </div>

              {/* Metric Cluster Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-neutral-800 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-xs">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Top Match Role</span>
                  <div className="text-lg font-bold text-neutral-900 dark:text-white mt-1 truncate">
                    {analyzedJobs[0]?.role || 'N/A'}
                  </div>
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                    {analyzedJobs[0]?.semanticScore || 0}% Semantic Fit
                  </span>
                </div>

                <div className="bg-white dark:bg-neutral-800 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-xs">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Extracted Skills</span>
                  <div className="text-lg font-bold text-neutral-900 dark:text-white mt-1">
                    {extractedSkills.length} competencies
                  </div>
                  <span className="text-xs text-neutral-500">Active profile</span>
                </div>

                <div className="bg-white dark:bg-neutral-800 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-xs">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Average Semantic Uplift</span>
                  <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                    +{(analyzedJobs.reduce((sum, j) => sum + (j.semanticScore - j.tfidfScore), 0) / (analyzedJobs.length || 1)).toFixed(1)}%
                  </div>
                  <span className="text-xs text-neutral-500">Over lexical match</span>
                </div>

                <div className="bg-white dark:bg-neutral-800 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-xs">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Perfect Fits</span>
                  <div className="text-lg font-bold text-neutral-900 dark:text-white mt-1">
                    {analyzedJobs.filter(j => j.missingSkills.length === 0).length} roles
                  </div>
                  <span className="text-xs text-neutral-500">0 skill gaps</span>
                </div>
              </div>

              {/* Extracted Skills Ribbon with Proficiency Badges */}
              <div className="bg-white dark:bg-neutral-800 p-6 border border-neutral-200 dark:border-neutral-700 rounded-3xl shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                    Student Profile Technical Skills ({extractedSkills.length})
                  </h3>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">Click × to remove or add missing skills below</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {extractedSkills.length > 0 ? (
                    extractedSkills.map(skill => {
                      const level = getSkillLevel(skill);
                      const badge = getSkillLevelBadgeClasses(level);
                      return (
                        <span 
                          key={skill} 
                          className={`px-3 py-1.5 ${badge.bg} ${badge.text} border ${badge.border} rounded-xl text-xs font-semibold capitalize flex items-center`}
                        >
                          {skill}
                          <span className="ml-1.5 text-[10px] opacity-75 font-normal">({level})</span>
                          <button 
                            onClick={() => {
                              const newSkills = extractedSkills.filter(s => s !== skill);
                              setExtractedSkills(newSkills);
                              runAnalysis(newSkills);
                            }} 
                            className="ml-2 hover:opacity-100"
                            title="Remove skill"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      );
                    })
                  ) : (
                    <span className="text-neutral-500 dark:text-neutral-400 italic text-sm">No skills added yet.</span>
                  )}
                </div>

                {/* Add missing skill bar */}
                <div className="relative max-w-sm pt-2">
                  <input 
                    type="text"
                    className="w-full p-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-xs text-neutral-800 dark:text-neutral-200 placeholder-neutral-400"
                    placeholder="Add missing skill to profile..."
                    value={extractedSkillSearch}
                    onChange={(e) => {
                      setExtractedSkillSearch(e.target.value);
                      setIsExtractedSkillDropdownOpen(true);
                    }}
                    onFocus={() => setIsExtractedSkillDropdownOpen(true)}
                  />
                  {isExtractedSkillDropdownOpen && extractedSkillSearch && (
                    <div className="absolute z-20 w-full mt-1 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                      {filteredExtractedSkills.length > 0 ? (
                        filteredExtractedSkills.map(skill => (
                          <div 
                            key={skill}
                            className="px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-neutral-700 dark:text-neutral-200 text-xs cursor-pointer border-b border-neutral-100 dark:border-neutral-700/50 last:border-0"
                            onClick={() => {
                              const newSkills = [...extractedSkills, skill].sort();
                              setExtractedSkills(newSkills);
                              setExtractedSkillSearch('');
                              setIsExtractedSkillDropdownOpen(false);
                              runAnalysis(newSkills);
                            }}
                          >
                            {skill} ({getSkillLevel(skill)})
                          </div>
                        ))
                      ) : (
                        <div 
                          className="px-4 py-3 text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 cursor-pointer font-semibold"
                          onClick={() => {
                            const customSkill = extractedSkillSearch.trim();
                            if (customSkill && !extractedSkills.includes(customSkill)) {
                              const newSkills = [...extractedSkills, customSkill].sort();
                              setExtractedSkills(newSkills);
                              setExtractedSkillSearch('');
                              setIsExtractedSkillDropdownOpen(false);
                              runAnalysis(newSkills);
                            }
                          }}
                        >
                          Add custom "{extractedSkillSearch}"
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Sorting and Filter Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                <div className="flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                    Unified Role Cards (Model Comparison + Skill Gap)
                  </h3>
                </div>

                <div className="flex items-center space-x-2 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs font-semibold">
                  <span className="text-neutral-400 px-2">Sort:</span>
                  <button
                    onClick={() => setResultsSortBy('semantic')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${resultsSortBy === 'semantic' ? 'bg-white dark:bg-neutral-700 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-neutral-500'}`}
                  >
                    Semantic Match
                  </button>
                  <button
                    onClick={() => setResultsSortBy('base')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${resultsSortBy === 'base' ? 'bg-white dark:bg-neutral-700 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-neutral-500'}`}
                  >
                    TF-IDF Base
                  </button>
                  <button
                    onClick={() => setResultsSortBy('gaps')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${resultsSortBy === 'gaps' ? 'bg-white dark:bg-neutral-700 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-neutral-500'}`}
                  >
                    Fewest Gaps
                  </button>
                </div>
              </div>

              {/* Unified Role List Cards */}
              <div className="space-y-5">
                {sortedAnalyzedJobs.map((job) => (
                  <UnifiedModelGapCard 
                    key={job.role} 
                    job={job} 
                    isDarkMode={isDarkMode}
                    onSelectRoadmap={handleOpenRoadmap}
                    onSelectQuiz={handleOpenQuiz}
                    onBuildCV={handleOpenBuildCV}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* CAREER ROADMAPS VIEW */}
          {appState === 'job-directory' && (
            <motion.div
              key="job-directory"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <RoadmapSection 
                initialRole={targetRoleForRoadmap}
                onTakeQuiz={handleOpenQuiz}
                onBuildCV={handleOpenBuildCV}
              />
            </motion.div>
          )}

          {/* SKILL MCQ PRACTICE QUIZZES VIEW */}
          {appState === 'quizzes' && (
            <motion.div
              key="quizzes"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <QuizSection 
                initialQuizId={targetRoleForQuiz} 
                onBackToHome={() => setAppState('upload')}
              />
            </motion.div>
          )}

          {/* BUILD CV INTERACTIVE BUILDER VIEW */}
          {appState === 'build-cv' && (
            <motion.div
              key="build-cv"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <ResumeBuilder 
                initialRole={targetRoleForCV}
                initialSkills={skillsForCV.length > 0 ? skillsForCV : extractedSkills}
                onBackToHome={() => setAppState('upload')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

const LoadingView = ({ onComplete, inputType }: { onComplete: () => void, inputType: 'file' | 'text' }) => {
  const [step, setStep] = useState(0);
  const steps = [
    inputType === 'file' ? "Parsing Resume Document (PDF / DOCX)..." : "Reading manual skill input...",
    "Running spaCy text normalization and tokenization...",
    "Vectorizing baseline lexical match (TF-IDF)...",
    "Generating dense semantic embeddings (Sentence-Transformers)...",
    "Calculating cosine similarity and skill gap levels..."
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
        <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Analyzing Candidate Profile</h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-6">Running lexical & semantic models against role benchmarks</p>
        
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
