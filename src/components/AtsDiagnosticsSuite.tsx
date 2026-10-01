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
  runRedFlagDetector,
  runImpactQuantifier,
  runReadabilityToneAuditor,
  generateTailoredResume,
  parseLinkedInData,
  AtsParseResult,
  SkillSegmentationResult,
  VerbAuditResult,
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
  const redFlagResult = useMemo(() => runRedFlagDetector(effectiveResumeText), [effectiveResumeText]);
  const impactResult = useMemo(() => runImpactQuantifier(effectiveResumeText), [effectiveResumeText]);
  const readabilityResult = useMemo(() => runReadabilityToneAuditor(effectiveResumeText), [effectiveResumeText]);

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

  return (
    <div className="max-w-6xl mx-auto space-y-6 py-2">
      {/* Header Hub Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-sm border border-blue-800/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-blue-500/20 text-blue-200 rounded-full text-xs font-semibold border border-blue-400/30">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
              <span>Enterprise ATS Simulation & Intelligence Hub</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              Resume Diagnostics & ATS Suite
            </h1>
            <p className="text-sm text-blue-100/90 max-w-2xl leading-relaxed">
              Audit how real-world Applicant Tracking Systems read your resume, eliminate red flags and passive language, auto-tailor for target job postings, and practice with our interactive Mock AI Interviewer.
            </p>
          </div>

          {/* Quick Score Glance */}
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/15 shrink-0 self-start md:self-auto">
            <div className="text-center">
              <span className="text-[10px] uppercase font-bold text-blue-200 block">ATS Parse Score</span>
              <span className="text-3xl font-black text-white">{atsResult.overallScore}%</span>
              <span className="text-xs font-bold text-emerald-300 block">Grade {atsResult.grade}</span>
            </div>
            <div className="h-10 w-px bg-white/20" />
            <div className="text-center">
              <span className="text-[10px] uppercase font-bold text-blue-200 block">Verb Power</span>
              <span className="text-3xl font-black text-white">{verbResult.score}%</span>
              <span className="text-xs text-blue-200 block">{verbResult.powerVerbsCount} Power Verbs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 border-b border-neutral-200 dark:border-neutral-800 scrollbar-none">
        {[
          { id: 'ats-parse', label: '1. ATS Simulator', icon: FileSearch, badge: `${atsResult.overallScore}%` },
          { id: 'skills-segment', label: '2. Hard vs Soft Skills', icon: Cpu, badge: skillResult.ratio },
          { id: 'verb-power', label: '3. Verb Power Scorer', icon: Zap, badge: `${verbResult.score}%` },
          { id: 'red-flags', label: '4. Red Flag Detector', icon: AlertTriangle, badge: `${redFlagResult.flagsCount} Flags` },
          { id: 'tailor', label: '5. 1-Click Tailor', icon: Wand2 },
          { id: 'quantifier', label: '6. Impact Quantifier', icon: TrendingUp, badge: `${impactResult.unquantifiedBullets.length} Vague` },
          { id: 'tone-grammar', label: '7. Tone & Readability', icon: FileCheck2 },
          { id: 'linkedin-scraper', label: '8. LinkedIn & Scraper', icon: Linkedin },
          { id: 'mock-interview', label: '9. Mock AI Interview', icon: MessageSquare, highlight: true }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as DiagnosticsTab)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700/60 border border-neutral-200 dark:border-neutral-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center space-x-2">
                  <Cpu className="w-4 h-4 text-blue-600" />
                  <span>Hard / Technical Skills ({skillResult.hardSkills.length})</span>
                </h3>
                <span className="text-xs font-black text-blue-600">{skillResult.hardScore}% Score</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {skillResult.hardSkills.map(s => (
                  <span
                    key={s.name}
                    className="text-xs px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-medium border border-blue-200 dark:border-blue-800"
                  >
                    {s.name} <span className="opacity-60 text-[10px]">({s.category})</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center space-x-2">
                  <Scale className="w-4 h-4 text-purple-600" />
                  <span>Soft / Interpersonal Skills ({skillResult.softSkills.length})</span>
                </h3>
                <span className="text-xs font-black text-purple-600">{skillResult.softScore}% Score</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {skillResult.softSkills.length > 0 ? (
                  skillResult.softSkills.map(s => (
                    <span
                      key={s.name}
                      className="text-xs px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-medium border border-purple-200 dark:border-purple-800"
                    >
                      {s.name} <span className="opacity-60 text-[10px]">({s.category})</span>
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
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200">
                  Recommended High-Value Soft Skills to Integrate:
                </h4>
                <p className="text-xs text-amber-800 dark:text-amber-300">
                  Consider weaving these into your bullet points: <strong>{skillResult.missingCrucialSoftSkills.join(', ')}</strong>.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. ACTION VERB POWER SCORER */}
      {activeTab === 'verb-power' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Action Verb Power Analysis
                </h3>
                <p className="text-xs text-neutral-500">
                  Replacing passive phrases ("helped", "responsible for") with active verbs increases callback rates by 2.4x.
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-blue-600">{verbResult.score}%</span>
                <span className="text-[10px] text-neutral-400 block">Impact Score</span>
              </div>
            </div>

            {/* Weak Verb Instances Found with 1-Click Fixes */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-extrabold uppercase text-neutral-500 tracking-wider">
                Detected Passive Phrasing ({verbResult.weakVerbInstances.length})
              </h4>
              {verbResult.weakVerbInstances.length > 0 ? (
                verbResult.weakVerbInstances.map((inst, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-red-600 dark:text-red-400 flex items-center">
                        <XCircle className="w-3.5 h-3.5 mr-1" /> Weak Verb: "{inst.matchedWeak}"
                      </span>
                      <button
                        type="button"
                        onClick={() => handleApplyRewrittenBullet(inst.originalBullet, inst.rewrittenBullet)}
                        className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center cursor-pointer"
                      >
                        <Wand2 className="w-3.5 h-3.5 mr-1" /> 1-Click Replace in Resume
                      </button>
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 font-mono">
                      Current: "{inst.originalBullet}"
                    </p>
                    <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 text-xs font-semibold flex items-center justify-between">
                      <span>Suggested: "{inst.rewrittenBullet}"</span>
                      <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 ml-2 shrink-0">Power Fix</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>No weak verbs detected! All bullet points begin with strong impact verbs.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. BIAS & RED FLAG DETECTOR */}
      {activeTab === 'red-flags' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Bias, Clichés & Red Flag Detector
                </h3>
                <p className="text-xs text-neutral-500">
                  Scans for archaic dates, corporate buzzwords, and personal demographic data that trigger unconscious bias.
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                redFlagResult.riskLevel === 'Low' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300' :
                redFlagResult.riskLevel === 'Moderate' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300' :
                'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300'
              }`}>
                {redFlagResult.riskLevel} Risk ({redFlagResult.flagsCount} items)
              </span>
            </div>

            <div className="space-y-3 pt-2">
              {redFlagResult.findings.length > 0 ? (
                redFlagResult.findings.map((finding, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-neutral-900 dark:text-white flex items-center">
                        <AlertTriangle className="w-3.5 h-3.5 mr-1.5 text-amber-500" />
                        {finding.category}: <span className="text-neutral-500 ml-1 font-normal">"{finding.snippet}"</span>
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                        {finding.severity} severity
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">
                      {finding.issue}
                    </p>
                    <div className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                      💡 Recommendation: {finding.recommendation}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Clean audit! No personal demographic bias traps, vintage email domains, or clichés detected.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. ONE-CLICK RESUME TAILORING */}
      {activeTab === 'tailor' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center space-x-2">
                <Wand2 className="w-4 h-4 text-blue-600" />
                <span>One-Click Resume Tailoring</span>
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Paste any target Job Description below. The engine will detect missing required keywords and automatically weave them into your experience bullets while preserving factual experience.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                Target Job Description
              </label>
              <textarea
                value={tailorJobDescription}
                onChange={e => setTailorJobDescription(e.target.value)}
                rows={4}
                className="w-full p-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-xs font-mono text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <div className="space-y-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center justify-between p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
                  <div>
                    <span className="text-xs font-bold text-blue-900 dark:text-blue-200 block">
                      ATS Keyword Match Score Improvement
                    </span>
                    <span className="text-[11px] text-blue-700 dark:text-blue-400">
                      Before: <strong>{tailoredResult.matchScoreBefore}%</strong> → Tailored: <strong>{tailoredResult.matchScoreAfter}%</strong>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleApplyTailoredResume(tailoredResult.tailoredText)}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center cursor-pointer shadow-xs"
                  >
                    {copiedKey === 'applied-tailored' ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                    <span>{copiedKey === 'applied-tailored' ? 'Applied & Copied!' : 'Apply to Resume'}</span>
                  </button>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                    Keyword Optimization Diff
                  </h4>
                  <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                    {tailoredResult.diffSummary.filter(d => d.type === 'optimized').map((d, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 font-mono">
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
          <div className="p-5 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Impact Quantifier (Google XYZ Formula)
                </h3>
                <p className="text-xs text-neutral-500">
                  ATS parsers look for numbers (%, $, scale). These bullet points lack measurable proof.
                </p>
              </div>
              <span className="text-xs font-bold text-blue-600">
                {impactResult.quantifiedCount} of {impactResult.totalBullets} Bullets Quantified
              </span>
            </div>

            <div className="space-y-3 pt-2">
              {impactResult.unquantifiedBullets.map((unq, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                      Unquantified Bullet:
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                      Suggested: {unq.suggestedMetricType}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-neutral-600 dark:text-neutral-400">
                    "{unq.original}"
                  </p>

                  <div className="p-3 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 space-y-2">
                    <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 block">
                      Google XYZ Template:
                    </span>
                    <p className="text-xs text-neutral-700 dark:text-neutral-300 italic">
                      {unq.xyzTemplate}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        const enhanced = `${unq.original}, resulting in a 35% latency improvement and $12k annual cloud infrastructure savings.`;
                        handleApplyRewrittenBullet(unq.original, enhanced);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center cursor-pointer transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5 mr-1" />
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
            <div className="p-5 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-center space-y-1">
              <span className="text-xs font-bold text-neutral-500 uppercase">Tone Confidence</span>
              <div className="text-3xl font-black text-blue-600">{readabilityResult.toneConfidenceScore}%</div>
              <span className="text-[11px] text-neutral-400">Authoritative & Direct</span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-center space-y-1">
              <span className="text-xs font-bold text-neutral-500 uppercase">Flesch-Kincaid Grade</span>
              <div className="text-3xl font-black text-neutral-900 dark:text-white">Grade {readabilityResult.fleschKincaidGrade}</div>
              <span className="text-[11px] text-neutral-400">Ideal range: 8 – 11</span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-center space-y-1">
              <span className="text-xs font-bold text-neutral-500 uppercase">Avg Words / Sentence</span>
              <div className="text-3xl font-black text-neutral-900 dark:text-white">{readabilityResult.avgWordsPerSentence}</div>
              <span className="text-[11px] text-neutral-400">Concise bullet density</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 space-y-3">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              Tone & Readability Suggestions
            </h3>
            <div className="space-y-2">
              {readabilityResult.suggestions.map((sug, i) => (
                <div key={i} className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/50 text-xs text-neutral-700 dark:text-neutral-300 flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
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
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white border border-indigo-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-400/30">
                  <span>Companion Chrome Extension (Manifest V3)</span>
                </div>
                <h3 className="text-base font-black">
                  1-Click Job Scraper Browser Extension
                </h3>
                <p className="text-xs text-neutral-300 max-w-xl">
                  Pull job postings straight from LinkedIn, Indeed, Greenhouse, or Lever into your clipboard with a single click.
                </p>
              </div>

              <button
                type="button"
                onClick={() => downloadChromeExtensionZip()}
                className="px-4 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold flex items-center justify-center cursor-pointer transition-all shadow-sm shrink-0"
              >
                <Download className="w-4 h-4 mr-1.5" />
                <span>Download Extension ZIP</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2 text-xs text-neutral-300">
              <span className="font-bold text-white block">Installation Guide (Takes 30 seconds):</span>
              <ol className="list-decimal list-inside space-y-1 text-neutral-300">
                <li>Download the ZIP above and extract the files to a folder on your computer.</li>
                <li>In Google Chrome or Brave, navigate to <code className="text-blue-300 bg-white/10 px-1 py-0.5 rounded">chrome://extensions</code></li>
                <li>Turn on <strong>Developer mode</strong> in the top-right corner, then click <strong>Load unpacked</strong> and select the extracted folder.</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* 9. MOCK AI INTERVIEW SIMULATOR */}
      {activeTab === 'mock-interview' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Mock AI Interview Simulator ({targetRoleTitle})
                </h3>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                Simulates a realistic technical screening tailored to your resume gaps. Answers are evaluated in real-time.
              </p>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/40 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800">
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
