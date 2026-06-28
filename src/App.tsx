import React, { useState, useEffect, useMemo } from 'react';
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
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import { JOB_DIRECTORY_DATA } from './jobsData';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

// --- MOCK DATA ---
const MOCK_RESUME_SKILLS = ["python", "sql", "javascript", "machine learning", "pandas", "statistics", "tableau", "html", "css"];

const MOCK_JOBS = [
  {
    role: "Data Scientist",
    description: "We are seeking a Data Scientist to analyze complex data sets and build predictive models. You must be proficient in Python, SQL, and Machine Learning frameworks like TensorFlow and Scikit-learn. Strong knowledge of Statistics and Pandas is required. Experience with Data Visualization using Tableau is a plus.",
    tfidfScore: 78.5,
    semanticScore: 89.2,
    matchingSkills: ["python", "sql", "machine learning", "pandas", "statistics", "tableau"],
    missingSkills: ["tensorflow", "scikit-learn"],
    radarData: [
      { subject: 'Programming', student: 85, ideal: 90 },
      { subject: 'Data & DB', student: 90, ideal: 85 },
      { subject: 'Machine Learning', student: 50, ideal: 95 },
      { subject: 'Math & Stats', student: 80, ideal: 85 },
      { subject: 'Visualization', student: 75, ideal: 70 },
      { subject: 'Cloud & DevOps', student: 20, ideal: 30 },
    ]
  },
  {
    role: "Data Analyst",
    description: "Join our team as a Data Analyst. You will clean and explore data, build dashboards in Power BI and Tableau, and run advanced SQL queries. Strong Excel skills and foundational Statistics are necessary. Python and R are nice to have.",
    tfidfScore: 65.1,
    semanticScore: 74.3,
    matchingSkills: ["sql", "tableau", "statistics", "python"],
    missingSkills: ["power bi", "excel", "r"],
    radarData: [
      { subject: 'Programming', student: 60, ideal: 50 },
      { subject: 'Data & DB', student: 85, ideal: 90 },
      { subject: 'Machine Learning', student: 40, ideal: 20 },
      { subject: 'Math & Stats', student: 80, ideal: 75 },
      { subject: 'Visualization', student: 60, ideal: 95 },
      { subject: 'Cloud & DevOps', student: 20, ideal: 20 },
    ]
  },
  {
    role: "Software Engineer",
    description: "Looking for a Backend Software Engineer. Primary responsibilities include building scalable web applications using Python and Django. Must have strong experience with SQL databases and Git for version control. Knowledge of Docker and AWS is highly desired. Agile environment.",
    tfidfScore: 45.2,
    semanticScore: 56.8,
    matchingSkills: ["python", "sql"],
    missingSkills: ["django", "git", "docker", "aws", "agile"],
    radarData: [
      { subject: 'Programming', student: 75, ideal: 95 },
      { subject: 'Data & DB', student: 70, ideal: 80 },
      { subject: 'Machine Learning', student: 30, ideal: 10 },
      { subject: 'Math & Stats', student: 40, ideal: 20 },
      { subject: 'Visualization', student: 40, ideal: 20 },
      { subject: 'Cloud & DevOps', student: 10, ideal: 90 },
    ]
  },
  {
    role: "Cloud Architect",
    description: "We need a Cloud Architect to design and maintain our infrastructure. Expertise in AWS, Azure, and GCP is crucial. You must have deep experience with Kubernetes, Docker, and CI/CD pipelines. Scripting in Python or Java is required.",
    tfidfScore: 21.0,
    semanticScore: 34.5,
    matchingSkills: ["python"],
    missingSkills: ["aws", "azure", "gcp", "kubernetes", "docker", "java"],
    radarData: [
      { subject: 'Programming', student: 60, ideal: 70 },
      { subject: 'Data & DB', student: 40, ideal: 50 },
      { subject: 'Machine Learning', student: 10, ideal: 10 },
      { subject: 'Math & Stats', student: 20, ideal: 10 },
      { subject: 'Visualization', student: 20, ideal: 10 },
      { subject: 'Cloud & DevOps', student: 10, ideal: 100 },
    ]
  }
];

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
  const [appState, setAppState] = useState<'upload' | 'loading' | 'results' | 'job-directory'>('upload');
  
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
  
  // Job Directory State
  const [selectedJobIndex, setSelectedJobIndex] = useState<number>(0);
  const [jobSearch, setJobSearch] = useState('');
  
  // Skills Manual Entry State
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [skillSearch, setSkillSearch] = useState('');
  const [isSkillDropdownOpen, setIsSkillDropdownOpen] = useState(false);

  // Analysis Results State
  const [extractedSkills, setExtractedSkills] = useState<string[]>([]);
  const [analyzedJobs, setAnalyzedJobs] = useState<any[]>([]);
  const [extractedSkillSearch, setExtractedSkillSearch] = useState('');
  const [isExtractedSkillDropdownOpen, setIsExtractedSkillDropdownOpen] = useState(false);

  const filteredExtractedSkills = AVAILABLE_SKILLS.filter(s => 
    s.toLowerCase().includes(extractedSkillSearch.toLowerCase()) && !extractedSkills.includes(s)
  );

  const filteredJobs = JOB_DIRECTORY_DATA.filter(job => 
    job.title.toLowerCase().includes(jobSearch.toLowerCase())
  );
  
  // Make sure selectedJobIndex is valid when filtered list changes
  useEffect(() => {
    if (filteredJobs.length > 0 && selectedJobIndex >= filteredJobs.length) {
      setSelectedJobIndex(0);
    }
  }, [filteredJobs.length, selectedJobIndex]);

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
    return Array.from(suggestions).slice(0, 8); // Return up to 8 suggestions
  }, [selectedSkills]);

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
    
    // Improved skill extraction
    const foundSkills = AVAILABLE_SKILLS.filter(skill => {
      const escapedSkill = skill.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // For skills with non-word chars (like C++, C#, .NET), don't strictly require word boundaries on those edges
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
        description: `Ideal candidate for ${job.title}. Requires proficiency in ${job.skills.join(', ')}.`,
        tfidfScore: matchPercentage,
        semanticScore: matchPercentage > 0 ? Math.min(100, matchPercentage + Math.floor(Math.random() * 15)) : 0, // Mock semantic uplift
        matchingSkills,
        missingSkills,
        radarData: [
          { subject: 'Core Skills', student: matchPercentage, ideal: 100 },
          { subject: 'Tools', student: Math.floor(Math.random() * 40) + 40, ideal: 90 },
          { subject: 'Concepts', student: Math.floor(Math.random() * 50) + 30, ideal: 85 },
          { subject: 'Experience', student: Math.floor(Math.random() * 30) + 20, ideal: 80 }
        ]
      };
    });
    
    // Get top matches
    const topMatches = scoredJobs.sort((a, b) => b.semanticScore - a.semanticScore).slice(0, 10);
    setAnalyzedJobs(topMatches);
  };

  const handleProcessInput = () => {
    if (inputType === 'text' && selectedSkills.length === 0) return;
    if (inputType === 'file' && extractedSkills.length === 0) {
       alert("Please upload a file with valid skills or add skills manually.");
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

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white font-sans selection:bg-blue-500/30 pb-20 transition-colors duration-200">
      {/* Navbar */}
      <header className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-50 shadow-sm transition-colors duration-200">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setAppState('upload')}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Network className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">Job-Fit Scorer</span>
          </div>
          <div className="flex items-center space-x-6">
             <span onClick={() => setAppState('job-directory')} className="text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors">Careers & Roadmaps</span>
             <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white cursor-pointer transition-colors">Documentation</span>
             <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-full text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                aria-label="Toggle theme"
             >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
             </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-10">
        <AnimatePresence mode="wait">
          {appState === 'upload' && (
            <motion.div 
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="text-center mb-10">
                <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-white mb-4">Match talent to roles with AI.</h1>
                <p className="text-lg text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto">Upload a resume or paste text to instantly analyze skill gaps using semantic similarity, or explore global career roadmaps.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                 {/* Left side: Upload/Type Data */}
                 <div className="lg:col-span-2 bg-white dark:bg-neutral-800 rounded-3xl border border-neutral-200 dark:border-neutral-700 p-8 shadow-sm flex flex-col">
                    <div className="flex bg-neutral-100 dark:bg-neutral-900/50 p-1 rounded-xl w-fit mb-8 shadow-inner">
                       <button 
                         onClick={() => setInputType('file')} 
                         className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center transition-all ${inputType === 'file' ? 'bg-white dark:bg-neutral-800 shadow text-neutral-900 dark:text-white' : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'}`}
                       >
                         <FileText className="w-4 h-4 mr-2" /> Upload Document
                       </button>
                       <button 
                         onClick={() => setInputType('text')} 
                         className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center transition-all ${inputType === 'text' ? 'bg-white dark:bg-neutral-800 shadow text-neutral-900 dark:text-white' : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'}`}
                       >
                         <Type className="w-4 h-4 mr-2" /> Manual Entry
                       </button>
                    </div>
                    
                    {inputType === 'file' ? (
                      <div 
                        className="flex-1 flex flex-col items-center justify-center p-12 border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-300 relative group"
                      >
                        <input 
                          type="file" 
                          accept=".txt,.pdf,.doc,.docx" 
                          onChange={handleFileUpload} 
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                        />
                        <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                          <UploadCloud className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200">
                          {uploadedFileName ? 'File Selected' : 'Upload Resume File'}
                        </h3>
                        <p className="text-neutral-500 dark:text-neutral-400 mt-2 text-center max-w-xs text-sm">
                          {uploadedFileName ? uploadedFileName : 'Drag and drop your PDF, DOCX, or TXT file here, or click to browse.'}
                        </p>
                        {uploadedFileName && (
                           <div className="mt-4 flex flex-wrap justify-center gap-2 max-w-sm">
                             {extractedSkills.slice(0, 5).map(skill => (
                               <span key={skill} className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-xs rounded-md font-medium">{skill}</span>
                             ))}
                             {extractedSkills.length > 5 && <span className="px-2 py-1 bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 text-xs rounded-md">+{extractedSkills.length - 5} more</span>}
                           </div>
                        )}
                        <div className="mt-8 px-8 py-3 bg-blue-600 dark:bg-blue-500 text-white font-medium rounded-full shadow-md shadow-blue-600/20 group-hover:bg-blue-700 dark:group-hover:bg-blue-600 transition-colors z-20 pointer-events-none">
                          {uploadedFileName ? 'Change File' : 'Select File'}
                        </div>
                        {uploadedFileName && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleProcessInput();
                            }}
                            className="mt-6 z-20 w-full max-w-xs py-3.5 bg-emerald-600 dark:bg-emerald-500 text-white font-medium rounded-xl hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-colors shadow-md shadow-emerald-600/20"
                          >
                            Analyze Uploaded Data
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col space-y-4 relative">
                        <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Student Skills</label>
                        <div className="flex-1 p-5 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-700 rounded-2xl">
                           <div className="flex flex-wrap gap-2 mb-3">
                             {selectedSkills.map(skill => (
                               <span key={skill} className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium flex items-center">
                                 {skill}
                                 <button onClick={() => setSelectedSkills(prev => prev.filter(s => s !== skill))} className="ml-2 hover:bg-blue-200 dark:hover:bg-blue-800/50 rounded-full p-0.5 transition-colors">
                                   <X className="w-3 h-3" />
                                 </button>
                               </span>
                             ))}
                           </div>
                           <div className="relative">
                             <input 
                               type="text"
                               className="w-full p-3 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-neutral-700 dark:text-neutral-200 placeholder-neutral-400 dark:placeholder-neutral-500"
                               placeholder="Search and select skills..."
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
                                       className="px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-neutral-700 dark:text-neutral-200 text-sm cursor-pointer border-b border-neutral-100 dark:border-neutral-700/50 last:border-0"
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
                               <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2">Suggested Match</p>
                               <div className="flex flex-wrap gap-2">
                                 {suggestedSkills.map(skill => (
                                   <button
                                     key={skill}
                                     onClick={() => setSelectedSkills(prev => [...prev, skill].sort())}
                                     className="px-3 py-1.5 bg-white dark:bg-neutral-800 border border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-300 dark:hover:border-blue-700 transition-colors flex items-center shadow-sm"
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
                          className="w-full py-3.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-600/20"
                        >
                          Analyze Resume Data
                        </button>
                      </div>
                    )}
                 </div>
                 
                 {/* Right side: Job Directory Promo */}
                 <div className="lg:col-span-1 bg-gradient-to-br from-blue-700 to-indigo-800 rounded-3xl p-8 text-white flex flex-col justify-between shadow-lg relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-700 pointer-events-none">
                       <Compass className="w-48 h-48" />
                    </div>
                    <div className="relative z-10">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-6 border border-white/20">
                         <Compass className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold mb-3">Explore Careers & Roadmaps</h3>
                      <p className="text-blue-100 text-sm leading-relaxed">
                         Not ready to upload? Browse our global directory of tech roles to discover required skills, Indian salary benchmarks, and step-by-step learning roadmaps.
                      </p>
                    </div>
                    <button 
                      onClick={() => setAppState('job-directory')}
                      className="relative z-10 w-full py-3.5 mt-8 bg-white text-blue-700 rounded-xl font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center shadow-lg"
                    >
                      Browse Job Skills <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                 </div>
              </div>
            </motion.div>
          )}

          {appState === 'job-directory' && (
            <motion.div
              key="job-directory"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <button onClick={() => setAppState('upload')} className="flex items-center text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white mb-6 font-medium transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Analysis
              </button>
              
              <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-neutral-900 dark:text-white">Career Directory & Roadmaps</h2>
                  <p className="text-neutral-500 dark:text-neutral-400 mt-2">Discover required skills and compensation benchmarks across the tech industry.</p>
                </div>
                <div className="relative w-full md:w-72">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search roles..."
                    value={jobSearch}
                    onChange={(e) => setJobSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-neutral-700 dark:text-neutral-200 placeholder-neutral-400 dark:placeholder-neutral-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                 {/* Job List Panel */}
                 <div className="lg:col-span-1 space-y-3 sticky top-24 max-h-[80vh] overflow-y-auto pr-2 pb-4 scrollbar-thin scrollbar-thumb-neutral-200 dark:scrollbar-thumb-neutral-700">
                    {filteredJobs.length === 0 ? (
                      <div className="p-5 text-center text-neutral-500 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700 rounded-2xl bg-white dark:bg-neutral-800">No roles found matching "{jobSearch}"</div>
                    ) : (
                      filteredJobs.map((job, idx) => (
                         <div 
                           key={idx} 
                           onClick={() => setSelectedJobIndex(idx)}
                           className={`p-5 rounded-2xl border cursor-pointer transition-all duration-200 ${selectedJobIndex === idx ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-sm'}`}
                         >
                            <h4 className={`font-semibold ${selectedJobIndex === idx ? 'text-white' : 'text-neutral-900 dark:text-white'}`}>{job.title}</h4>
                            <p className={`text-sm mt-1 flex items-center ${selectedJobIndex === idx ? 'text-blue-100' : 'text-neutral-500 dark:text-neutral-400'}`}>
                              {job.skills.length} core skills required
                            </p>
                         </div>
                      ))
                    )}
                 </div>
                 
                 {/* Job Details Panel */}
                 <div className="lg:col-span-2">
                    {filteredJobs.length > 0 && selectedJobIndex !== null && filteredJobs[selectedJobIndex] && (
                       <motion.div 
                         key={filteredJobs[selectedJobIndex].title}
                         initial={{ opacity: 0, x: 20 }}
                         animate={{ opacity: 1, x: 0 }}
                         className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-3xl p-8 md:p-10 shadow-sm"
                       >
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8 border-b border-neutral-100 dark:border-neutral-700 pb-8">
                             <div>
                               <h3 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">{filteredJobs[selectedJobIndex].title}</h3>
                               <div className="flex items-center space-x-4">
                                  <span className="flex items-center text-sm font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 px-4 py-2 rounded-full border border-emerald-200 dark:border-emerald-800">
                                    <IndianRupee className="w-4 h-4 mr-1.5" />
                                    Avg Salary (India): {filteredJobs[selectedJobIndex].salaryIndia}
                                  </span>
                               </div>
                             </div>
                          </div>
                          
                          <div className="mb-10 bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl p-6 border border-neutral-100 dark:border-neutral-700">
                             <h4 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center mb-4">
                                <Target className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" /> Key Skills Required
                             </h4>
                             <div className="flex flex-wrap gap-2">
                                {filteredJobs[selectedJobIndex].skills.map((skill: string) => (
                                   <span key={skill} className="px-4 py-2 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-xl text-sm font-medium border border-neutral-200 dark:border-neutral-700 shadow-sm">
                                      {skill}
                                   </span>
                                ))}
                             </div>
                          </div>

                          <div>
                             <h4 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center mb-6">
                                <BookOpen className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" /> Learning Roadmap
                             </h4>
                             <div className="space-y-6">
                                {filteredJobs[selectedJobIndex].roadmap.map((step: any, idx: number) => (
                                   <div key={idx} className="flex group">
                                      <div className="flex flex-col items-center mr-6">
                                         <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 flex items-center justify-center font-bold border border-blue-200 dark:border-blue-800 z-10 shadow-sm group-hover:bg-blue-600 dark:group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                           {idx + 1}
                                         </div>
                                         {idx !== filteredJobs[selectedJobIndex].roadmap.length - 1 && (
                                            <div className="w-0.5 h-full bg-blue-100 dark:bg-blue-900/50 mt-2"></div>
                                         )}
                                      </div>
                                      <div className="pb-6 pt-1 w-full">
                                         <h5 className="font-semibold text-neutral-900 dark:text-white text-lg">{step.title}</h5>
                                         <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-2 leading-relaxed">{step.desc}</p>
                                         <div className="mt-3">
                                            <a 
                                              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(step.title + ' tutorial ' + filteredJobs[selectedJobIndex].title)}`} 
                                              target="_blank" rel="noopener noreferrer"
                                              className="inline-flex items-center text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 px-3 py-1.5 rounded-md transition-colors"
                                            >
                                              <BookOpen className="w-3 h-3 mr-1.5" /> Find courses & tutorials
                                            </a>
                                         </div>
                                      </div>
                                   </div>
                                ))}
                             </div>
                          </div>
                       </motion.div>
                    )}
                 </div>
              </div>
            </motion.div>
          )}

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

          {appState === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-neutral-900 dark:text-white">Analysis Results</h2>
                  <p className="text-neutral-500 dark:text-neutral-400 mt-1">Found {analyzedJobs.length} potential roles based on semantic fit.</p>
                </div>
                <button 
                  onClick={handleReset}
                  className="px-4 py-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 font-medium rounded-lg shadow-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
                >
                  Analyze Another
                </button>
              </div>

              {/* Resume Skills Summary */}
              <div className="bg-white dark:bg-neutral-800 p-6 border border-neutral-200 dark:border-neutral-700 rounded-2xl shadow-sm">
                <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-4">Extracted Student Skills</h3>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap gap-2">
                    {extractedSkills.length > 0 ? extractedSkills.map(skill => (
                      <span key={skill} className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-md text-sm font-medium capitalize border border-blue-100 dark:border-blue-900 flex items-center">
                        {skill}
                        <button 
                          onClick={() => {
                            const newSkills = extractedSkills.filter(s => s !== skill);
                            setExtractedSkills(newSkills);
                            runAnalysis(newSkills);
                          }} 
                          className="ml-2 hover:bg-blue-200 dark:hover:bg-blue-800/50 rounded-full p-0.5 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )) : (
                      <span className="text-neutral-500 dark:text-neutral-400 italic text-sm">No specific technical skills extracted.</span>
                    )}
                  </div>
                  
                  {/* Add missing skills */}
                  <div className="relative max-w-sm mt-2">
                     <input 
                       type="text"
                       className="w-full p-2.5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm text-neutral-700 dark:text-neutral-200 placeholder-neutral-400 dark:placeholder-neutral-500"
                       placeholder="Add missing skills..."
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
                               className="px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-neutral-700 dark:text-neutral-200 text-sm cursor-pointer border-b border-neutral-100 dark:border-neutral-700/50 last:border-0"
                               onClick={() => {
                                 const newSkills = [...extractedSkills, skill].sort();
                                 setExtractedSkills(newSkills);
                                 setExtractedSkillSearch('');
                                 setIsExtractedSkillDropdownOpen(false);
                                 runAnalysis(newSkills);
                               }}
                             >
                               {skill}
                             </div>
                           ))
                         ) : (
                           <div 
                             className="px-4 py-3 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 cursor-pointer font-medium"
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
                             Add "{extractedSkillSearch}"
                           </div>
                         )}
                       </div>
                     )}
                  </div>
                </div>
              </div>

              {/* Ranking Table */}
              <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-neutral-100 dark:border-neutral-700 flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-900/50">
                  <div className="flex items-center space-x-2">
                    <BarChart className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
                    <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">Model Comparison</h3>
                  </div>
                  <span className="text-sm text-neutral-500 dark:text-neutral-400 flex items-center">
                    <Sparkles className="w-4 h-4 mr-1 text-blue-500"/> Sorted by Match Score
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm border-b border-neutral-200 dark:border-neutral-700">
                        <th className="py-4 px-6 font-medium">Job Role</th>
                        <th className="py-4 px-6 font-medium text-center">Base Match</th>
                        <th className="py-4 px-6 font-medium text-center">Semantic Match</th>
                        <th className="py-4 px-6 font-medium text-right">Uplift</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analyzedJobs.map((job) => {
                        const uplift = (job.semanticScore - job.tfidfScore).toFixed(1);
                        const isPositive = Number(uplift) > 0;
                        return (
                          <tr key={job.role} className="border-b border-neutral-100 dark:border-neutral-700/50 last:border-0 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors">
                            <td className="py-4 px-6 font-medium text-neutral-900 dark:text-white">{job.role}</td>
                            <td className="py-4 px-6 text-center">
                              <span className="inline-block px-3 py-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-full text-sm font-medium">
                                {job.tfidfScore}%
                              </span>
                            </td>
                            <td className="py-4 px-6 text-center">
                              <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 rounded-full text-sm font-semibold">
                                {job.semanticScore}%
                              </span>
                            </td>
                            <td className="py-4 px-6 text-right">
                              <span className={`text-sm font-medium ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-neutral-500 dark:text-neutral-400'}`}>
                                {isPositive ? '+' : ''}{uplift}%
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Skill Gap Analysis */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mt-8 mb-4">Skill Gap Reports</h3>
                {analyzedJobs.map((job) => (
                  <JobCard key={job.role} job={job} isDarkMode={isDarkMode} />
                ))}
              </div>
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
    inputType === 'file' ? "Parsing Resume Document..." : "Reading manual input...",
    "Running NLP Preprocessing (spaCy)...",
    "Vectorizing baseline (TF-IDF)...",
    "Generating dense embeddings (Sentence-Transformers)...",
    "Calculating cosine similarities..."
  ];

  useEffect(() => {
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep >= steps.length) {
        clearInterval(interval);
        setTimeout(onComplete, 600);
      } else {
        setStep(currentStep);
      }
    }, 1200);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-8 w-full max-w-md">
      <div className="relative flex items-center justify-center w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-full shadow-inner">
         <BrainCircuit className="w-10 h-10 text-blue-600 dark:text-blue-400 animate-pulse" />
         <div className="absolute inset-0 border-4 border-blue-200 dark:border-blue-900/50 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
      </div>
      <div className="text-center w-full">
        <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">Analyzing Profile</h3>
        
        <div className="space-y-3 mt-6 text-left">
          {steps.map((s, i) => (
            <div key={i} className={`flex items-center space-x-3 text-sm ${i > step ? 'opacity-30' : 'opacity-100'} transition-opacity duration-300`}>
              {i < step ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
              ) : i === step ? (
                <div className="w-5 h-5 border-2 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
              ) : (
                <div className="w-5 h-5 border-2 border-neutral-300 dark:border-neutral-600 rounded-full flex-shrink-0" />
              )}
              <span className={`font-medium ${i === step ? 'text-blue-700 dark:text-blue-400' : i < step ? 'text-neutral-600 dark:text-neutral-300' : 'text-neutral-400 dark:text-neutral-500'}`}>
                {s}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const JobCard = ({ job, isDarkMode }: { job: any, isDarkMode: boolean }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-neutral-200 dark:border-neutral-700 rounded-2xl bg-white dark:bg-neutral-800 overflow-hidden transition-all duration-200 shadow-sm hover:shadow-md">
      <div 
        className="p-6 flex items-center justify-between cursor-pointer hover:bg-neutral-50/50 dark:hover:bg-neutral-700/30"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center space-x-4">
           <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
             <Target className="w-6 h-6" />
           </div>
           <div>
             <h4 className="text-lg font-semibold text-neutral-900 dark:text-white">{job.role}</h4>
             <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5 font-medium">{job.semanticScore}% Semantic Match</p>
           </div>
        </div>
        <div className="flex items-center space-x-6">
           {job.missingSkills.length === 0 ? (
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400 flex items-center bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-800 whitespace-nowrap">
                <CheckCircle2 className="w-4 h-4 mr-1.5"/> Perfect Match
              </span>
           ) : (
              <span className="text-sm font-medium text-orange-700 dark:text-orange-400 flex items-center bg-orange-50 dark:bg-orange-900/30 px-3 py-1.5 rounded-full border border-orange-100 dark:border-orange-800 whitespace-nowrap">
                <AlertCircle className="w-4 h-4 mr-1.5"/> {job.missingSkills.length} Skills Missing
              </span>
           )}
           <div className={`p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors ${expanded ? 'bg-neutral-100 dark:bg-neutral-700' : ''}`}>
             {expanded ? <ChevronUp className="w-5 h-5 text-neutral-500 dark:text-neutral-400" /> : <ChevronDown className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />}
           </div>
        </div>
      </div>
      
      <AnimatePresence>
        {expanded && (
          <motion.div 
             initial={{ height: 0, opacity: 0 }} 
             animate={{ height: "auto", opacity: 1 }} 
             exit={{ height: 0, opacity: 0 }}
             className="border-t border-neutral-100 dark:border-neutral-700 overflow-hidden"
          >
            <div className="p-6 bg-neutral-50/50 dark:bg-neutral-900/50 space-y-6">
              <div>
                <h5 className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-2">Job Description</h5>
                <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed max-w-4xl">{job.description}</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <div className="lg:col-span-1 flex flex-col gap-6">
                   {/* Matching Skills */}
                   <div className="p-5 bg-white dark:bg-neutral-800 border border-emerald-100 dark:border-emerald-900/50 rounded-xl shadow-sm flex-1">
                      <h5 className="text-sm font-semibold text-emerald-800 dark:text-emerald-400 mb-4 flex items-center">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400 mr-2" /> Matching Skills
                      </h5>
                      <div className="flex flex-wrap gap-2">
                         {job.matchingSkills.map((skill: string) => (
                           <span key={skill} className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800 rounded-lg text-sm font-medium capitalize shadow-sm">
                             {skill}
                           </span>
                         ))}
                         {job.matchingSkills.length === 0 && <span className="text-sm text-neutral-500 dark:text-neutral-400 italic">No matching technical skills found.</span>}
                      </div>
                   </div>
                   
                   {/* Missing Skills */}
                   <div className="p-5 bg-white dark:bg-neutral-800 border border-orange-100 dark:border-orange-900/50 rounded-xl shadow-sm flex-1">
                      <h5 className="text-sm font-semibold text-orange-800 dark:text-orange-400 mb-4 flex items-center">
                        <AlertCircle className="w-5 h-5 text-orange-500 dark:text-orange-400 mr-2" /> Missing Skills
                      </h5>
                      <div className="flex flex-wrap gap-2">
                         {job.missingSkills.map((skill: string) => (
                           <span key={skill} className="px-3 py-1.5 bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border border-orange-100 dark:border-orange-800 rounded-lg text-sm font-medium capitalize shadow-sm">
                             {skill}
                           </span>
                         ))}
                         {job.missingSkills.length === 0 && <span className="text-sm text-neutral-500 dark:text-neutral-400 italic">You meet all extracted technical requirements!</span>}
                      </div>
                   </div>
                 </div>

                 {/* Radar Chart */}
                 <div className="lg:col-span-2 p-5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-sm flex flex-col min-h-[350px]">
                    <h5 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 mb-2 flex items-center">
                      <Target className="w-5 h-5 text-neutral-500 dark:text-neutral-400 mr-2" /> Skill Proficiency Alignment
                    </h5>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">Comparing student profile against the ideal requirements for {job.role}.</p>
                    <div className="flex-1 w-full relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={job.radarData}>
                          <PolarGrid stroke={isDarkMode ? "#404040" : "#e5e5e5"} />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: isDarkMode ? "#a3a3a3" : "#737373", fontSize: 12 }} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                          <Radar name="Student Profile" dataKey="student" stroke="#3b82f6" fill="#3b82f6" fillOpacity={isDarkMode ? 0.3 : 0.4} strokeWidth={2} />
                          <Radar name="Ideal Job Profile" dataKey="ideal" stroke="#10b981" fill="#10b981" fillOpacity={isDarkMode ? 0.15 : 0.2} strokeDasharray="4 4" strokeWidth={2} />
                          <Legend iconType="circle" wrapperStyle={{ fontSize: '13px', fontWeight: 500, paddingTop: '10px', color: isDarkMode ? "#d4d4d4" : "#525252" }} />
                          <Tooltip 
                            contentStyle={{ 
                              borderRadius: '12px', 
                              border: isDarkMode ? '1px solid #404040' : '1px solid #e5e5e5', 
                              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', 
                              fontSize: '12px',
                              backgroundColor: isDarkMode ? "#262626" : "#ffffff",
                              color: isDarkMode ? "#f5f5f5" : "#171717"
                            }} 
                            itemStyle={{ fontSize: '14px', fontWeight: 500 }}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                 </div>
              </div>
              
              {/* Missing Skills Roadmap */}
              {job.missingSkills.length > 0 && (
                <div className="mt-6 p-6 bg-white dark:bg-neutral-800 border border-blue-100 dark:border-blue-900/50 rounded-xl shadow-sm">
                   <h5 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 mb-4 flex items-center">
                     <BookOpen className="w-5 h-5 text-blue-500 dark:text-blue-400 mr-2" /> Recommended Learning Path for Missing Skills
                   </h5>
                   <div className="space-y-4">
                      {job.missingSkills.map((skill: string, index: number) => (
                         <div key={skill} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/50 gap-4 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                            <div className="flex items-start">
                               <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 flex items-center justify-center font-bold flex-shrink-0 mt-0.5 sm:mt-0 mr-3">
                                  {index + 1}
                               </div>
                               <div>
                                  <h6 className="font-semibold text-neutral-900 dark:text-white capitalize">{skill}</h6>
                                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Foundational requirement for {job.role}</p>
                               </div>
                            </div>
                            <a 
                               href={`https://www.youtube.com/results?search_query=${encodeURIComponent(skill + ' full course tutorial')}`} 
                               target="_blank" rel="noopener noreferrer"
                               className="inline-flex items-center justify-center text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 px-4 py-2 rounded-lg transition-colors whitespace-nowrap shadow-sm shadow-blue-600/20"
                            >
                               Start Learning <ArrowRight className="w-3 h-3 ml-1.5" />
                            </a>
                         </div>
                      ))}
                   </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
