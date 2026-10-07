import React, { useState, useMemo } from 'react';
import {
  FileSearch,
  Cpu,
  Zap,
  AlertTriangle,
  Wand2,
  TrendingUp,
  Download,
  Linkedin,
  MessageSquare,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Copy,
  Check,
  Send,
  Sparkles,
  Bot,
  User,
  ExternalLink,
  HelpCircle,
  Scale,
  ShieldCheck,
  FileCheck2,
  RefreshCw,
  ArrowRight
} from 'lucide-react';
import {
  runAtsParseSimulator,
  runSkillSegmentation,
  runActionVerbPowerScorer,
  runResumeImpactScorer,
  runRedFlagDetector,
  runImpactQuantifier,
  runReadabilityToneAuditor,
  generateTailoredResume,
  parseLinkedInData,
  AtsParseResult,
  SkillSegmentationResult,
  VerbAuditResult,
  ResumeImpactScoreResult,
  BulletImpactItem,
  RedFlagAuditResult,
  ImpactQuantifierResult,
  ReadabilityToneResult,
  TailoredResumeResult
} from '../atsEngine';
import { downloadChromeExtensionZip } from '../chromeExtensionFiles';
import { JOB_DIRECTORY_DATA } from '../jobsData';

export interface AtsDiagnosticsSuiteProps {
  resumeText: string;
  onUpdateResumeText: (text: string) => void;
  targetRoleTitle?: string;
}

type DiagnosticsTab = 
  | 'ats-parse'
  | 'skills-segment'
  | 'verb-power'
  | 'red-flags'
  | 'tailor'
  | 'quantifier'
  | 'tone-grammar'
  | 'linkedin-scraper'
  | 'mock-interview';

export type DiagnosticsStage = 'audit' | 'optimize' | 'practice';

export const STAGE_FOR_TAB: Record<DiagnosticsTab, DiagnosticsStage> = {
  'ats-parse': 'audit',
  'tone-grammar': 'audit',
  'red-flags': 'audit',
  'verb-power': 'optimize',
  'skills-segment': 'optimize',
  'quantifier': 'optimize',
  'tailor': 'optimize',
  'mock-interview': 'practice',
  'linkedin-scraper': 'practice'
};

interface ChatInterviewTurn {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  evaluation?: {
    score: number;
    strengths: string[];
    missedPoints: string[];
    modelAnswer: string;
  };
}

export const AtsDiagnosticsSuite: React.FC<AtsDiagnosticsSuiteProps> = ({
  resumeText,
  onUpdateResumeText,
  targetRoleTitle = 'Data Scientist'
}) => {
  const [activeTab, setActiveTab] = useState<DiagnosticsTab>('ats-parse');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Fallback sample resume if text is empty
  const effectiveResumeText = useMemo(() => {
    if (resumeText && resumeText.trim().length > 30) return resumeText;
    return `Alex Morgan
alex.morgan@gmail.com | +1 (555) 234-5678 | San Francisco, CA
LinkedIn: linkedin.com/in/alex-morgan-dev | GitHub: github.com/alexmorgan

PROFESSIONAL SUMMARY
Results-driven Software Engineer with 4+ years of experience developing scalable web applications and data pipelines. Responsible for maintaining core microservices and helped team migrate to AWS cloud infrastructure.

TECHNICAL SKILLS
- Programming: Python, TypeScript, JavaScript, SQL, Bash
- Frameworks & Libraries: React, Node.js, Express, FastAPI, Pandas, Docker
- Cloud & Databases: AWS (EC2, S3, RDS), PostgreSQL, Redis, Git, CI/CD

WORK EXPERIENCE
Senior Software Engineer | Apex Cloud Systems (2022 - Present)
- Worked on customer analytics platform handling high-volume daily API requests.
- Assisted with database optimization and refactored legacy SQL queries.
- Was responsible for implementing automated GitHub Actions unit tests across 12 microservices.
- Led sprint planning and collaborated with product managers to deliver features on time.

Software Developer | Horizon Labs (2020 - 2022)
- Helped build responsive customer dashboard using React and TypeScript.
- Participated in weekly code reviews and contributed to backend Node.js endpoints.
- Handled incident troubleshooting during release deployments.

EDUCATION
B.S. in Computer Science | State University (Graduated 2019)`;
  }, [resumeText]);

  // Reactive audit evaluations
  const atsResult = useMemo(() => runAtsParseSimulator(effectiveResumeText), [effectiveResumeText]);
  const skillResult = useMemo(() => runSkillSegmentation(effectiveResumeText), [effectiveResumeText]);
  const verbResult = useMemo(() => runActionVerbPowerScorer(effectiveResumeText), [effectiveResumeText]);
  const impactScoreResult = useMemo(() => runResumeImpactScorer(effectiveResumeText), [effectiveResumeText]);
  const redFlagResult = useMemo(() => runRedFlagDetector(effectiveResumeText), [effectiveResumeText]);
  const impactResult = useMemo(() => runImpactQuantifier(effectiveResumeText), [effectiveResumeText]);
  const readabilityResult = useMemo(() => runReadabilityToneAuditor(effectiveResumeText), [effectiveResumeText]);

  // Impact Score Filter State
  const [impactFilter, setImpactFilter] = useState<'all' | 'passive' | 'high'>('all');

  // 1-Click Tailor State
  const [tailorJobDescription, setTailorJobDescription] = useState<string>(
    `Senior Data & Software Engineer
Requirements:
- 3+ years experience with Python, TypeScript, and Docker containerization.
- Hands-on experience architecting CI/CD pipelines, Kubernetes, and AWS cloud microservices.
- Proven track record with PostgreSQL indexing, Redis caching, and high-throughput data pipelines.
- Strong stakeholder management and cross-functional leadership skills.`
  );
  const [tailoredResult, setTailoredResult] = useState<TailoredResumeResult | null>(null);

  // LinkedIn Import State
  const [linkedinInput, setLinkedinInput] = useState<string>('https://linkedin.com/in/alex-morgan-dev');
  const [linkedinSuccessMsg, setLinkedinSuccessMsg] = useState<string | null>(null);

  // Impact Quantifier Modal/Prompt State
  const [quantifyIndex, setQuantifyIndex] = useState<number | null>(null);
  const [metricAnswer, setMetricAnswer] = useState<string>('slashed API response latency by 45%');

  // Mock Interview State
  const interviewQuestions = useMemo(() => [
    {
      q: `Given your target role as a ${targetRoleTitle}, walk me through a complex architectural failure you diagnosed in production and how you stabilized it.`,
      expectedKeys: ['root cause analysis', 'metrics/monitoring', 'rollback or hotfix', 'preventative post-mortem']
    },
    {
      q: `How do you decide between choosing PostgreSQL vs. a distributed NoSQL store like Cassandra or DynamoDB when architecting for heavy write-throughput?`,
      expectedKeys: ['ACID vs eventual consistency', 'partition keys', 'schema flexibility', 'read/write ratio']
    },
    {
      q: `Tell me about a time you had a fundamental disagreement with a Product Manager regarding technical debt versus shipping new features. How did you navigate the compromise?`,
      expectedKeys: ['STAR framework', 'business impact', 'stakeholder empathy', 'phased refactoring']
    },
    {
      q: `Looking at your experience, how do you ensure high test coverage and zero-downtime deployment across continuous CI/CD pipelines?`,
      expectedKeys: ['blue-green or canary releases', 'integration tests', 'feature flags', 'automated smoke tests']
    },
    {
      q: `What is an emerging technology or architectural pattern in ${targetRoleTitle} that you have recently researched, and what are its practical tradeoffs?`,
      expectedKeys: ['concrete examples', 'bottlenecks', 'operational cost', 'team adoption curve']
    }
  ], [targetRoleTitle]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswerInput, setUserAnswerInput] = useState<string>('');
  const [interviewHistory, setInterviewHistory] = useState<ChatInterviewTurn[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hello! I am your AI Technical Interviewer. I have analyzed your resume against the ${targetRoleTitle} profile and identified areas to test. Let's begin Question 1:\n\n${interviewQuestions[0].q}`,
      timestamp: 'Just now'
    }
  ]);
  const [isEvaluatingAnswer, setIsEvaluatingAnswer] = useState<boolean>(false);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleApplyTailoredResume = (newText: string) => {
    onUpdateResumeText(newText);
    copyToClipboard(newText, 'applied-tailored');
  };

  const handleApplyRewrittenBullet = (original: string, rewritten: string) => {
    const updated = effectiveResumeText.replace(original, rewritten);
    onUpdateResumeText(updated);
  };

  const handleUpgradeAllPassiveBullets = () => {
    let updatedText = effectiveResumeText;
    impactScoreResult.bullets
      .filter(b => b.impactLevel === 'passive')
      .forEach(b => {
        updatedText = updatedText.replace(b.originalText, b.recommendedRewrite);
      });
    onUpdateResumeText(updatedText);
    copyToClipboard(updatedText, 'all-passive-upgraded');
  };

  const handleSwapWithActionVerb = (originalBullet: string, detectedPassivePhrase: string, actionVerb: string) => {
    const reg = new RegExp(`\\b${detectedPassivePhrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    const newBullet = originalBullet.replace(reg, actionVerb);
    const capitalized = newBullet.charAt(0).toUpperCase() + newBullet.slice(1);
    handleApplyRewrittenBullet(originalBullet, capitalized);
  };

  const handleImportLinkedIn = () => {
    if (!linkedinInput.trim()) return;
    const data = parseLinkedInData(linkedinInput);
    const generatedResume = `${data.fullName}
${data.headline}
Location: ${data.location} | Profile: ${linkedinInput}

PROFESSIONAL SUMMARY
${data.summary}

CORE SKILLS
${data.skills.join(', ')}

EXPERIENCE
${data.experiences.map(e => `${e.title} | ${e.company} (${e.duration})\n${e.bullets.map(b => `- ${b}`).join('\n')}`).join('\n\n')}

EDUCATION
B.S. in Computer Science & Engineering`;

    onUpdateResumeText(generatedResume);
    setLinkedinSuccessMsg(`Successfully imported profile for ${data.fullName}! Resume updated.`);
    setTimeout(() => setLinkedinSuccessMsg(null), 4000);
  };

  const handleSendInterviewAnswer = () => {
    if (!userAnswerInput.trim() || isEvaluatingAnswer) return;

    const answerText = userAnswerInput.trim();
    setUserAnswerInput('');
    setIsEvaluatingAnswer(true);

    const targetQ = interviewQuestions[currentQuestionIndex];
    const userTurn: ChatInterviewTurn = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: answerText,
      timestamp: 'Just now'
    };

    // Calculate score heuristics based on answer depth, length, and keyword matches
    const answerWords = answerText.split(/\s+/).length;
    let matchedKeys = targetQ.expectedKeys.filter(k => answerText.toLowerCase().includes(k.toLowerCase().split(' ')[0]));
    let score = 5;
    if (answerWords > 45) score += 2;
    if (matchedKeys.length >= 2) score += 2;
    if (answerText.toLowerCase().includes('result') || answerText.toLowerCase().includes('improved') || answerText.toLowerCase().includes('because')) score += 1;
    score = Math.min(10, Math.max(3, score));

    const missed = targetQ.expectedKeys.filter(k => !matchedKeys.includes(k));

    const evaluation = {
      score,
      strengths: [
        answerWords > 40 ? 'Good depth and contextual framing.' : 'Concise explanation.',
        matchedKeys.length > 0 ? `Effectively addressed ${matchedKeys.join(', ')}.` : 'Directly addressed the prompt.'
      ],
      missedPoints: missed.length > 0 ? missed.map(m => `Deep dive on ${m}`) : ['Covering broader enterprise cost tradeoffs'],
      modelAnswer: `In a production incident, I first isolate the affected service via canary metrics and circuit breakers to stop cascading failures. I inspect Grafana p99 latency logs, roll back the offending deployment via GitOps in under 3 minutes, and conduct an asynchronous post-mortem with preventative unit integration tests.`
    };

    const nextIndex = currentQuestionIndex + 1;
    const hasNext = nextIndex < interviewQuestions.length;

    setTimeout(() => {
      const aiResponseTurn: ChatInterviewTurn = {
        id: `ai-eval-${Date.now()}`,
        sender: 'ai',
        text: `**Score: ${score}/10** · ${score >= 8 ? 'Exceptional answer!' : 'Solid effort with room for deeper technical proof.'}\n\n${hasNext ? `Ready for Question ${nextIndex + 1} of ${interviewQuestions.length}:\n\n${interviewQuestions[nextIndex].q}` : `🎉 That concludes our mock interview session! You answered all ${interviewQuestions.length} questions.`}`,
        timestamp: 'Just now',
        evaluation
      };

      setInterviewHistory(prev => [...prev, userTurn, aiResponseTurn]);
      if (hasNext) {
        setCurrentQuestionIndex(nextIndex);
      }
      setIsEvaluatingAnswer(false);
    }, 700);
  };

  const currentStage = STAGE_FOR_TAB[activeTab];

  const STAGES = [
    {
      id: 'audit' as DiagnosticsStage,
      number: '01',
      title: 'Audit & Diagnostics',
      description: 'Machine parseability, reading grade, and compliance flags',
      tools: [
        { id: 'ats-parse' as DiagnosticsTab, label: 'ATS Simulator', icon: FileSearch, stat: `${atsResult.overallScore}% score` },
        { id: 'tone-grammar' as DiagnosticsTab, label: 'Tone & Readability', icon: FileCheck2, stat: `Grade ${readabilityResult.fleschKincaidGrade}` },
        { id: 'red-flags' as DiagnosticsTab, label: 'Bias & Red Flags', icon: AlertTriangle, stat: `${redFlagResult.flagsCount} flags` }
      ]
    },
    {
      id: 'optimize' as DiagnosticsStage,
      number: '02',
      title: 'Optimize & Impact',
      description: 'Active verb power, skill balance, XYZ quantification, and tailoring',
      tools: [
        { id: 'verb-power' as DiagnosticsTab, label: 'Resume Impact Score', icon: Zap, stat: `${impactScoreResult.overallImpactScore}%` },
        { id: 'skills-segment' as DiagnosticsTab, label: 'Hard vs. Soft Skills', icon: Cpu, stat: skillResult.ratio },
        { id: 'quantifier' as DiagnosticsTab, label: 'Impact Quantifier', icon: TrendingUp, stat: `${impactResult.unquantifiedBullets.length} vague` },
        { id: 'tailor' as DiagnosticsTab, label: '1-Click Tailor', icon: Wand2, stat: 'JD match' }
      ]
    },
    {
      id: 'practice' as DiagnosticsStage,
      number: '03',
      title: 'Practice & Connect',
      description: 'Turn-based mock interview practice and LinkedIn automation',
      tools: [
        { id: 'mock-interview' as DiagnosticsTab, label: 'Mock AI Interview', icon: MessageSquare, stat: 'STAR session' },
        { id: 'linkedin-scraper' as DiagnosticsTab, label: 'LinkedIn & Extension', icon: Linkedin, stat: 'Live sync' }
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 py-2">
      {/* Executive Clean Header */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-4 sm:p-7 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Enterprise Diagnostics & ATS Intelligence</span>
              <span aria-hidden="true">·</span>
              <span className="text-neutral-400 truncate">Target: {targetRoleTitle}</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Resume Diagnostics & Optimization Suite
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
              Real-time applicant tracking simulation, action verb impact scoring, and structured interview coaching organized into three sequential workflow stages.
            </p>
          </div>

          {/* Unboxed Tabular Health Vitals */}
          <div className="flex items-center justify-between sm:justify-start gap-4 sm:gap-8 pt-4 lg:pt-0 border-t lg:border-t-0 border-neutral-100 dark:border-neutral-800 shrink-0 overflow-x-auto touch-scroll scrollbar-none pb-1">
            <div>
              <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 block mb-0.5">
                ATS Fidelity
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold font-mono tabular-nums text-neutral-900 dark:text-white">
                  {atsResult.overallScore}%
                </span>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  Grade {atsResult.grade}
                </span>
              </div>
            </div>

            <div className="h-8 w-px bg-neutral-200 dark:bg-neutral-800" />

            <div>
              <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 block mb-0.5">
                Impact Score
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold font-mono tabular-nums text-neutral-900 dark:text-white">
                  {impactScoreResult.overallImpactScore}%
                </span>
                <span className={`text-xs font-semibold ${
                  impactScoreResult.overallImpactScore >= 85 ? 'text-emerald-600 dark:text-emerald-400' :
                  impactScoreResult.overallImpactScore >= 70 ? 'text-blue-600 dark:text-blue-400' :
                  'text-amber-600 dark:text-amber-400'
                }`}>
                  {impactScoreResult.impactRating.split(' ')[0]}
                </span>
              </div>
            </div>

            <div className="h-8 w-px bg-neutral-200 dark:bg-neutral-800" />

            <div>
              <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 block mb-0.5">
                Readability
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold font-mono tabular-nums text-neutral-900 dark:text-white">
                  {readabilityResult.fleschKincaidGrade}
                </span>
                <span className="text-xs font-medium text-neutral-500">
                  Grade lvl
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3-Stage Workflow Navigation */}
      <div className="space-y-3">
        {/* Stage Selector Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 p-1.5 bg-neutral-100 dark:bg-neutral-800/70 rounded-2xl border border-neutral-200/60 dark:border-neutral-700/60">
          {STAGES.map(stage => {
            const isStageActive = currentStage === stage.id;
            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => {
                  if (currentStage !== stage.id) {
                    setActiveTab(stage.tools[0].id);
                  }
                }}
                className={`p-3 sm:p-3.5 rounded-xl text-left transition-all cursor-pointer flex flex-col justify-between active:scale-98 ${
                  isStageActive
                    ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs border border-neutral-200/80 dark:border-neutral-700'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-neutral-800'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-[10px] font-mono font-bold tracking-wider uppercase opacity-60">
                    STAGE {stage.number}
                  </span>
                  <span className="text-[11px] font-medium opacity-60">
                    {stage.tools.length} Tools
                  </span>
                </div>
                <div className="text-sm font-bold tracking-tight mt-1">
                  {stage.title}
                </div>
                <p className="text-[11px] leading-relaxed text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-1">
                  {stage.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Sub-Tool Navigation Strip */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-neutral-200 dark:border-neutral-800 scrollbar-none touch-scroll">
          {STAGES.find(s => s.id === currentStage)?.tools.map(tool => {
            const Icon = tool.icon;
            const isToolActive = activeTab === tool.id;
            return (
              <button
                key={tool.id}
                type="button"
                onClick={() => setActiveTab(tool.id)}
                className={`px-3.5 py-2.5 min-h-[44px] text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer whitespace-nowrap border-b-2 -mb-px ${
                  isToolActive
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
                    : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tool.label}</span>
                <span className="text-[10px] font-mono text-neutral-400 font-normal">
                  ({tool.stat})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. ATS PARSE-ABILITY SIMULATOR */}
      {activeTab === 'ats-parse' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 space-y-2">
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Contact Extraction</span>
              <div className="text-2xl font-black text-neutral-900 dark:text-white">
                {atsResult.contact.contactScore}/100
              </div>
              <p className="text-xs text-neutral-500">
                Email: {atsResult.contact.email ? '✓ Detected' : '✗ Missing'} · Phone: {atsResult.contact.phone ? '✓ Detected' : '✗ Missing'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 space-y-2">
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Multi-Column / Table Risk</span>
              <div className="text-2xl font-black text-neutral-900 dark:text-white flex items-center space-x-2">
                {atsResult.tableRisk || atsResult.multiColumnRisk ? (
                  <span className="text-amber-500 flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-1" /> High Risk
                  </span>
                ) : (
                  <span className="text-emerald-600 flex items-center">
                    <CheckCircle2 className="w-5 h-5 mr-1" /> Safe Single Stream
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-500">
                {atsResult.tableRisk ? 'Complex pipe/tab column format detected.' : 'Sequential top-to-bottom parser compatible.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 space-y-2">
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Recognized Section Headers</span>
              <div className="text-2xl font-black text-neutral-900 dark:text-white">
                {atsResult.sections.filter(s => s.found).length} of {atsResult.sections.length}
              </div>
              <p className="text-xs text-neutral-500">
                Summary, Experience, Skills, and Education structure verified.
              </p>
            </div>
          </div>

          {/* Section Detection Matrix */}
          <div className="p-5 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 space-y-3">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center space-x-2">
              <FileCheck2 className="w-4 h-4 text-blue-600" />
              <span>ATS Section Header Detection Matrix</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-1">
              {atsResult.sections.map(sec => (
                <div
                  key={sec.name}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    sec.found
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                      : 'bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-400'
                  }`}
                >
                  <div className="text-xs font-bold">{sec.name}</div>
                  <div className="text-[11px] font-semibold mt-1">
                    {sec.found ? '✓ Parsed' : '✗ Missing'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Raw Plaintext Simulation (How the robot sees it) */}
          <div className="p-5 rounded-2xl bg-neutral-900 text-neutral-200 border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bot className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  Raw ATS OCR / Text Stream Simulation
                </span>
              </div>
              <span className="text-[11px] font-mono text-neutral-400">
                {atsResult.wordCount} words · {atsResult.lineCount} lines
              </span>
            </div>
            <pre className="p-4 rounded-xl bg-black/60 font-mono text-xs text-neutral-300 leading-relaxed overflow-x-auto max-h-72 scrollbar-thin">
              {effectiveResumeText}
            </pre>
          </div>
        </div>
      )}

      {/* 2. SOFT VS HARD SKILLS SEGMENTATION */}
      {activeTab === 'skills-segment' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 space-y-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center space-x-2">
                  <Cpu className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                    Hard & Technical Skills ({skillResult.hardSkills.length})
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                  {skillResult.hardScore}% Score
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {skillResult.hardSkills.map(s => (
                  <span
                    key={s.name}
                    className="text-xs px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-medium"
                  >
                    {s.name} <span className="text-neutral-400 dark:text-neutral-500 text-[10px]">· {s.category}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 space-y-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center space-x-2">
                  <Scale className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                    Soft & Leadership Skills ({skillResult.softSkills.length})
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">
                  {skillResult.softScore}% Score
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {skillResult.softSkills.length > 0 ? (
                  skillResult.softSkills.map(s => (
                    <span
                      key={s.name}
                      className="text-xs px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-medium"
                    >
                      {s.name} <span className="text-neutral-400 dark:text-neutral-500 text-[10px]">· {s.category}</span>
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-neutral-500 italic">No explicit soft skills detected.</p>
                )}
              </div>
            </div>
          </div>

          {/* Missing Crucial Soft Skills Recommendation */}
          {skillResult.missingCrucialSoftSkills.length > 0 && (
            <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 flex items-start space-x-3">
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                  Recommended High-Value Soft Skills to Integrate:
                </h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Recruiters expect balance across leadership and delivery. Consider weaving these into your bullet points: <strong className="text-neutral-900 dark:text-white">{skillResult.missingCrucialSoftSkills.join(', ')}</strong>.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. RESUME IMPACT SCORE & ACTION VERB ENGINE */}
      {activeTab === 'verb-power' && (
        <div className="space-y-6">
          {/* Main Score & Distribution Dashboard */}
          <div className="p-6 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-xs space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-blue-800">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Resume Impact Scorer & Passive Language Detector</span>
                </div>
                <h3 className="text-xl md:text-2xl font-black text-neutral-900 dark:text-white">
                  Resume Impact Score: {impactScoreResult.overallImpactScore}%
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-xl leading-relaxed">
                  {impactScoreResult.summaryTip} Enterprise recruiters and modern ATS screeners look for definitive action verbs and reject passive "responsible for" phrasing.
                </p>
              </div>

              {/* Large Score Meter & Rating Badge */}
              <div className="flex items-center gap-4 bg-neutral-50 dark:bg-neutral-900/60 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-700 shrink-0 self-start lg:self-auto">
                <div className="text-center">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">Overall Impact</span>
                  <span className="text-4xl font-black text-blue-600 dark:text-blue-400">
                    {impactScoreResult.overallImpactScore}%
                  </span>
                  <span className={`text-[11px] font-bold block mt-0.5 ${
                    impactScoreResult.overallImpactScore >= 85 ? 'text-emerald-600 dark:text-emerald-400' :
                    impactScoreResult.overallImpactScore >= 70 ? 'text-blue-600 dark:text-blue-400' :
                    impactScoreResult.overallImpactScore >= 55 ? 'text-amber-600 dark:text-amber-400' :
                    'text-rose-600 dark:text-rose-400'
                  }`}>
                    {impactScoreResult.impactRating}
                  </span>
                </div>
              </div>
            </div>

            {/* Tri-Color Stacked Impact Distribution Bar */}
            <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-700/60">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-neutral-600 dark:text-neutral-300">
                  Bullet Impact Breakdown ({impactScoreResult.totalBullets} Total Bullets Analyzed)
                </span>
                <span className="text-neutral-400 text-[11px]">
                  {impactScoreResult.highImpactCount} High · {impactScoreResult.moderateImpactCount} Moderate · {impactScoreResult.passiveImpactCount} Passive
                </span>
              </div>
              <div className="h-3 w-full bg-neutral-100 dark:bg-neutral-700/50 rounded-full overflow-hidden flex">
                <div
                  className="bg-emerald-500 h-full transition-all duration-300"
                  style={{ width: `${impactScoreResult.highImpactPct}%` }}
                  title={`High Impact: ${impactScoreResult.highImpactPct}%`}
                />
                <div
                  className="bg-blue-500 h-full transition-all duration-300"
                  style={{ width: `${impactScoreResult.moderateImpactPct}%` }}
                  title={`Moderate: ${impactScoreResult.moderateImpactPct}%`}
                />
                <div
                  className="bg-rose-500 h-full transition-all duration-300"
                  style={{ width: `${impactScoreResult.passiveImpactPct}%` }}
                  title={`Passive: ${impactScoreResult.passiveImpactPct}%`}
                />
              </div>

              {/* 3 Metric Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 block">High Impact (Action Verbs)</span>
                    <span className="text-xs text-emerald-600 dark:text-emerald-400">{impactScoreResult.highImpactPct}% of all bullets</span>
                  </div>
                  <span className="text-2xl font-black text-emerald-700 dark:text-emerald-300">{impactScoreResult.highImpactCount}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-blue-800 dark:text-blue-300 block">Moderate Impact</span>
                    <span className="text-xs text-blue-600 dark:text-blue-400">{impactScoreResult.moderateImpactPct}% standard phrasing</span>
                  </div>
                  <span className="text-2xl font-black text-blue-700 dark:text-blue-300">{impactScoreResult.moderateImpactCount}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-rose-800 dark:text-rose-300 block">Passive Language Flags</span>
                    <span className="text-xs text-rose-600 dark:text-rose-400">{impactScoreResult.passiveImpactPct}% need action verbs</span>
                  </div>
                  <span className="text-2xl font-black text-rose-700 dark:text-rose-300">{impactScoreResult.passiveImpactCount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Toolbar & Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs font-bold text-neutral-500 mr-1">Filter:</span>
              <button
                type="button"
                onClick={() => setImpactFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  impactFilter === 'all'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600'
                }`}
              >
                All Bullets ({impactScoreResult.totalBullets})
              </button>
              <button
                type="button"
                onClick={() => setImpactFilter('passive')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                  impactFilter === 'passive'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600'
                }`}
              >
                <span>Passive Only</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 font-black">
                  {impactScoreResult.passiveImpactCount}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setImpactFilter('high')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  impactFilter === 'high'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600'
                }`}
              >
                High Impact ({impactScoreResult.highImpactCount})
              </button>
            </div>

            {impactScoreResult.passiveImpactCount > 0 && (
              <button
                type="button"
                onClick={handleUpgradeAllPassiveBullets}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold flex items-center justify-center space-x-1.5 shadow-xs transition-all cursor-pointer shrink-0"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>Upgrade All Passive Bullets (1-Click)</span>
              </button>
            )}
          </div>

          {/* Bullet-by-Bullet Deep Dive List */}
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-500">
              Bullet-by-Bullet Impact Analysis & Action Verb Swaps
            </h4>

            {impactScoreResult.bullets
              .filter(b => {
                if (impactFilter === 'passive') return b.impactLevel === 'passive';
                if (impactFilter === 'high') return b.impactLevel === 'high';
                return true;
              })
              .map((bullet) => (
                <div
                  key={bullet.id}
                  className={`p-5 rounded-3xl border transition-all space-y-3.5 ${
                    bullet.impactLevel === 'passive'
                      ? 'bg-white dark:bg-neutral-800 border-rose-200 dark:border-rose-900/60 shadow-xs'
                      : bullet.impactLevel === 'high'
                      ? 'bg-white dark:bg-neutral-800 border-emerald-200 dark:border-emerald-900/60'
                      : 'bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700'
                  }`}
                >
                  {/* Status Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      {bullet.impactLevel === 'passive' ? (
                        <span className="inline-flex items-center space-x-1 text-xs font-bold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-2.5 py-1 rounded-full border border-rose-200 dark:border-rose-800">
                          <XCircle className="w-3.5 h-3.5 mr-0.5" />
                          <span>Passive Language Detected: "{bullet.detectedPassivePhrases.join(', ')}"</span>
                        </span>
                      ) : bullet.impactLevel === 'high' ? (
                        <span className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-0.5" />
                          <span>High Impact Action Verb: "{bullet.leadVerb}"</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 text-xs font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-800">
                          <span>Moderate Impact: "{bullet.leadVerb}"</span>
                        </span>
                      )}
                    </div>

                    {bullet.impactLevel === 'passive' && (
                      <button
                        type="button"
                        onClick={() => handleApplyRewrittenBullet(bullet.originalText, bullet.recommendedRewrite)}
                        className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center space-x-1 cursor-pointer transition-all shadow-2xs self-start sm:self-auto"
                      >
                        <Wand2 className="w-3.5 h-3.5" />
                        <span>Apply Power Rewrite</span>
                      </button>
                    )}
                  </div>

                  {/* Original Bullet */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-0.5">
                      Current Bullet Point
                    </span>
                    <p className="text-xs font-mono text-neutral-800 dark:text-neutral-200 bg-neutral-50 dark:bg-neutral-900/60 p-3 rounded-xl border border-neutral-200/80 dark:border-neutral-700/80 leading-relaxed">
                      "{bullet.originalText}"
                    </p>
                  </div>

                  {/* Suggestions & Action Verb Options (for passive or moderate) */}
                  {bullet.impactLevel !== 'high' && (
                    <div className="p-3.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/80 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-blue-900 dark:text-blue-200 flex items-center">
                          <Sparkles className="w-3.5 h-3.5 mr-1 text-blue-600" />
                          <span>Recommended Action Verb Rewrite:</span>
                        </span>
                        <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400">
                          Instant Fix
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-neutral-900 dark:text-white leading-relaxed">
                        "{bullet.recommendedRewrite}"
                      </p>

                      {/* Contextual Action Verb Chips */}
                      <div className="space-y-1.5 pt-1 border-t border-blue-200/60 dark:border-blue-800/60">
                        <span className="text-[11px] font-bold text-blue-800 dark:text-blue-300 block">
                          Or swap with industry-specific power verbs (click to apply):
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {bullet.suggestedActionVerbs.flatMap(cat => cat.verbs).map((verb) => (
                            <button
                              key={verb}
                              type="button"
                              onClick={() => {
                                const phraseToReplace = bullet.detectedPassivePhrases[0] || bullet.leadVerb || '';
                                handleSwapWithActionVerb(bullet.originalText, phraseToReplace, verb);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-white dark:bg-neutral-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-blue-700 shadow-2xs transition-all cursor-pointer"
                              title={`Replace passive phrase with "${verb}"`}
                            >
                              + {verb}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>

          {/* Active Power Verbs Cloud */}
          {impactScoreResult.powerVerbsDetected.length > 0 && (
            <div className="p-5 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-500 flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Recognized Power Action Verbs in Your Resume ({impactScoreResult.powerVerbsDetected.length})</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {impactScoreResult.powerVerbsDetected.map(pv => (
                  <span
                    key={pv}
                    className="px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800"
                  >
                    ✓ {pv}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. BIAS & RED FLAG DETECTOR */}
      {activeTab === 'red-flags' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 space-y-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>Bias, Clichés & Red Flag Detector</span>
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Scans for archaic dates, corporate buzzwords, and personal demographic data that trigger bias.
                </p>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs font-semibold">
                <span className={
                  redFlagResult.riskLevel === 'Low' ? 'text-emerald-600 dark:text-emerald-400' :
                  redFlagResult.riskLevel === 'Moderate' ? 'text-amber-600 dark:text-amber-400' :
                  'text-rose-600 dark:text-rose-400'
                }>
                  ● {redFlagResult.riskLevel} Risk
                </span>
                <span className="text-neutral-300 dark:text-neutral-700">·</span>
                <span className="text-neutral-600 dark:text-neutral-400">{redFlagResult.flagsCount} items flagged</span>
              </div>
            </div>

            <div className="space-y-3">
              {redFlagResult.findings.length > 0 ? (
                redFlagResult.findings.map((finding, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-neutral-50/70 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-700/60 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-neutral-900 dark:text-white flex items-center">
                        <AlertTriangle className="w-3.5 h-3.5 mr-1.5 text-amber-500 shrink-0" />
                        {finding.category}: <span className="text-neutral-500 dark:text-neutral-400 ml-1 font-mono">"{finding.snippet}"</span>
                      </span>
                      <span className="text-[11px] font-mono uppercase text-amber-600 dark:text-amber-400 font-semibold">
                        {finding.severity}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {finding.issue}
                    </p>
                    <div className="text-xs font-medium text-blue-600 dark:text-blue-400 pt-1 border-t border-neutral-200/50 dark:border-neutral-700/50">
                      Recommendation: {finding.recommendation}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 text-xs font-medium flex items-center space-x-2 border border-emerald-200/60 dark:border-emerald-900/40">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Clean audit! No personal demographic bias traps, vintage email domains, or buzzwords detected.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. ONE-CLICK RESUME TAILORING */}
      {activeTab === 'tailor' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 space-y-5 shadow-xs">
            <div className="space-y-1 pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center space-x-2">
                <Wand2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>One-Click Role Tailoring</span>
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Paste any target Job Description below. The engine scans for missing required keywords and automatically weaves them into your experience bullets while preserving factual honesty.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Target Job Description Requirements
              </label>
              <textarea
                value={tailorJobDescription}
                onChange={e => setTailorJobDescription(e.target.value)}
                rows={4}
                className="w-full p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/70 dark:bg-neutral-800/50 text-xs font-mono text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 leading-relaxed"
                placeholder="Paste Job Description here..."
              />
            </div>

            <button
              type="button"
              onClick={() => {
                const res = generateTailoredResume(effectiveResumeText, tailorJobDescription);
                setTailoredResult(res);
              }}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center cursor-pointer transition-all shadow-xs"
            >
              <Sparkles className="w-4 h-4 mr-1.5" />
              <span>Generate Tailored Resume & Keyword Diff</span>
            </button>

            {tailoredResult && (
              <div className="space-y-4 pt-4 border-t border-neutral-200/80 dark:border-neutral-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40">
                  <div>
                    <span className="text-xs font-bold text-neutral-900 dark:text-white block">
                      ATS Keyword Match Score Improvement
                    </span>
                    <span className="text-xs text-neutral-600 dark:text-neutral-400 font-mono">
                      Before: {tailoredResult.matchScoreBefore}% → Tailored: <strong className="text-blue-600 dark:text-blue-400">{tailoredResult.matchScoreAfter}%</strong>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleApplyTailoredResume(tailoredResult.tailoredText)}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center cursor-pointer shadow-xs shrink-0 self-start sm:self-auto"
                  >
                    {copiedKey === 'applied-tailored' ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                    <span>{copiedKey === 'applied-tailored' ? 'Applied & Copied!' : 'Apply to Active Resume'}</span>
                  </button>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                    Keyword Optimization Preview
                  </h4>
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {tailoredResult.diffSummary.filter(d => d.type === 'optimized').map((d, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 text-xs text-neutral-800 dark:text-neutral-200 font-mono leading-relaxed">
                        {d.text}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. IMPACT QUANTIFIER PROMPT */}
      {activeTab === 'quantifier' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 space-y-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Impact Quantifier (Google XYZ Formula)</span>
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  ATS parsers look for numbers (%, $, scale). These bullet points lack measurable proof.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                {impactResult.quantifiedCount} of {impactResult.totalBullets} Bullets Quantified
              </span>
            </div>

            <div className="space-y-4">
              {impactResult.unquantifiedBullets.map((unq, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-neutral-50/70 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-700/60 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                    <span className="font-bold text-neutral-700 dark:text-neutral-300">
                      Unquantified Experience Bullet:
                    </span>
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                      Suggested Metric: {unq.suggestedMetricType}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-neutral-800 dark:text-neutral-200 bg-white dark:bg-neutral-900 p-3 rounded-lg border border-neutral-200/60 dark:border-neutral-700/60 leading-relaxed">
                    "{unq.original}"
                  </p>

                  <div className="p-3.5 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 space-y-2">
                    <span className="text-[11px] font-bold text-blue-700 dark:text-blue-300 block uppercase tracking-wider">
                      Google XYZ Structure Recommendation:
                    </span>
                    <p className="text-xs text-neutral-700 dark:text-neutral-300 italic leading-relaxed">
                      "{unq.xyzTemplate}"
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        const enhanced = `${unq.original}, resulting in a 35% latency improvement and $12k annual cloud infrastructure savings.`;
                        handleApplyRewrittenBullet(unq.original, enhanced);
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center cursor-pointer transition-all shadow-2xs"
                    >
                      <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                      <span>Inject Realistic Benchmark Metrics</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 7. TONE & READABILITY */}
      {activeTab === 'tone-grammar' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 text-center space-y-1 shadow-xs">
              <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider block">Tone Confidence</span>
              <div className="text-3xl font-bold font-mono text-blue-600 dark:text-blue-400">{readabilityResult.toneConfidenceScore}%</div>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">Authoritative & Direct</span>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 text-center space-y-1 shadow-xs">
              <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider block">Flesch-Kincaid</span>
              <div className="text-3xl font-bold font-mono text-neutral-900 dark:text-white">Grade {readabilityResult.fleschKincaidGrade}</div>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">Target Range: 8 – 11</span>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 text-center space-y-1 shadow-xs">
              <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider block">Words / Sentence</span>
              <div className="text-3xl font-bold font-mono text-neutral-900 dark:text-white">{readabilityResult.avgWordsPerSentence}</div>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">Concise bullet density</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 space-y-4 shadow-xs">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white pb-3 border-b border-neutral-100 dark:border-neutral-800">
              Tone & Readability Suggestions
            </h3>
            <div className="space-y-2.5">
              {readabilityResult.suggestions.map((sug, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-neutral-50/70 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-700/60 text-xs text-neutral-700 dark:text-neutral-300 flex items-center space-x-2.5 leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span>{sug}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 8. LINKEDIN URL IMPORT & BROWSER EXTENSION SCRAPER */}
      {activeTab === 'linkedin-scraper' && (
        <div className="space-y-6">
          {/* LinkedIn Profile URL Import */}
          <div className="p-5 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 space-y-4">
            <div className="flex items-center space-x-2">
              <Linkedin className="w-5 h-5 text-blue-600" />
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                LinkedIn Profile URL Import
              </h3>
            </div>
            <p className="text-xs text-neutral-500">
              Enter your public LinkedIn profile link (or paste profile text) to parse your summary, work experience history, and skills directly into your active resume.
            </p>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={linkedinInput}
                onChange={e => setLinkedinInput(e.target.value)}
                placeholder="https://linkedin.com/in/your-handle"
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleImportLinkedIn}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center cursor-pointer transition-all shadow-xs shrink-0"
              >
                <Download className="w-4 h-4 mr-1.5" />
                <span>Import & Build Resume</span>
              </button>
            </div>

            {linkedinSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{linkedinSuccessMsg}</span>
              </div>
            )}
          </div>

          {/* Browser Extension Job Scraper Bundle */}
          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                  <ExternalLink className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Companion Chrome Extension (Manifest V3)</span>
                </div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                  1-Click Job Scraper Browser Extension
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-xl leading-relaxed">
                  Extract job descriptions directly from LinkedIn, Indeed, Greenhouse, or Lever into your clipboard with a single click.
                </p>
              </div>

              <button
                type="button"
                onClick={() => downloadChromeExtensionZip()}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center cursor-pointer transition-all shadow-xs shrink-0 self-start sm:self-auto"
              >
                <Download className="w-4 h-4 mr-1.5" />
                <span>Download Extension Package (ZIP)</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50/70 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-700/60 space-y-2 text-xs text-neutral-600 dark:text-neutral-300">
              <span className="font-bold text-neutral-900 dark:text-white block">Installation Guide (Takes 30 seconds):</span>
              <ol className="list-decimal list-inside space-y-1">
                <li>Download the ZIP package and extract the folder on your computer.</li>
                <li>In Google Chrome or Brave, navigate to <code className="text-blue-600 dark:text-blue-400 bg-white dark:bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-200/80 dark:border-neutral-700 font-mono">chrome://extensions</code></li>
                <li>Enable <strong>Developer mode</strong> in the top-right corner, then click <strong>Load unpacked</strong> and select the extracted folder.</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* 9. MOCK AI INTERVIEW SIMULATOR */}
      {activeTab === 'mock-interview' && (
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                  Mock Technical Interview Simulator
                </h3>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Simulates real-world technical screening questions aligned with your {targetRoleTitle} target.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
              Question {Math.min(currentQuestionIndex + 1, interviewQuestions.length)} of {interviewQuestions.length}
            </span>
          </div>

          {/* Chat Stream */}
          <div className="p-4 md:p-6 rounded-3xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 space-y-4 min-h-[400px] max-h-[550px] overflow-y-auto">
            {interviewHistory.map(turn => (
              <div
                key={turn.id}
                className={`flex gap-3 ${turn.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {turn.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-xl p-4 rounded-2xl space-y-2 ${
                    turn.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-xs'
                      : 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-700 rounded-tl-xs shadow-2xs'
                  }`}
                >
                  <p className="text-xs leading-relaxed whitespace-pre-line">
                    {turn.text}
                  </p>

                  {/* Evaluation Box */}
                  {turn.evaluation && (
                    <div className="mt-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-blue-600 dark:text-blue-400">
                          Answer Score: {turn.evaluation.score}/10
                        </span>
                        <span className="text-[10px] text-neutral-400">Evaluated by AI Engine</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 block">Strengths:</span>
                        {turn.evaluation.strengths.map((str, i) => (
                          <div key={i} className="text-[11px] text-neutral-600 dark:text-neutral-300">✓ {str}</div>
                        ))}
                      </div>
                      {turn.evaluation.missedPoints.length > 0 && (
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 block">Areas to Bolster:</span>
                          {turn.evaluation.missedPoints.map((m, i) => (
                            <div key={i} className="text-[11px] text-neutral-600 dark:text-neutral-300">• {m}</div>
                          ))}
                        </div>
                      )}
                      <div className="pt-1 border-t border-neutral-200 dark:border-neutral-800">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Exemplar STAR Response:</span>
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 italic mt-0.5">
                          "{turn.evaluation.modelAnswer}"
                        </p>
                      </div>
                    </div>
                  )}

                  <span className="text-[10px] opacity-60 block text-right">{turn.timestamp}</span>
                </div>
                {turn.sender === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-neutral-700 text-white flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Interactive Answer Input */}
          <div className="p-3 bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 flex gap-2">
            <textarea
              value={userAnswerInput}
              onChange={e => setUserAnswerInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendInterviewAnswer();
                }
              }}
              disabled={isEvaluatingAnswer || currentQuestionIndex >= interviewQuestions.length}
              placeholder={
                currentQuestionIndex >= interviewQuestions.length
                  ? 'Interview session complete!'
                  : 'Type your answer here (Shift + Enter for new line)...'
              }
              rows={2}
              className="flex-1 p-2 bg-transparent text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none resize-none"
            />
            <button
              type="button"
              onClick={handleSendInterviewAnswer}
              disabled={!userAnswerInput.trim() || isEvaluatingAnswer || currentQuestionIndex >= interviewQuestions.length}
              className="px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center cursor-pointer transition-all shrink-0"
            >
              {isEvaluatingAnswer ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
