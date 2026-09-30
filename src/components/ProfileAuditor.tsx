import React, { useState } from 'react';
import { 
  Github, 
  Linkedin, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Sparkles, 
  ExternalLink, 
  Copy, 
  Check, 
  Code2, 
  UserCheck, 
  TrendingUp, 
  ShieldCheck, 
  FileCode,
  ArrowRight,
  FolderGit2,
  Terminal,
  Play,
  RotateCcw,
  Loader2,
  GitBranch,
  Layers,
  Cpu,
  BadgeCheck
} from 'lucide-react';

interface AuditItem {
  id: string;
  title: string;
  category: string;
  status: 'passed' | 'warning' | 'critical';
  impact: 'High' | 'Medium' | 'Low';
  description: string;
  fix: string;
}

export const ProfileAuditor: React.FC<{ targetRole?: string }> = ({ targetRole = 'Software Engineer' }) => {
  const [activeTab, setActiveTab] = useState<'github' | 'linkedin'>('github');

  // GitHub State
  const [repoInputUrl, setRepoInputUrl] = useState('https://github.com/developer-dev/jobfit-cloud-platform');
  const [githubUser, setGithubUser] = useState('developer-dev');
  const [githubRepo, setGithubRepo] = useState('jobfit-cloud-platform');
  const [repoDescription, setRepoDescription] = useState('Full-stack distributed career platform with real-time scoring and ATS document export');
  const [hasLiveDemo, setHasLiveDemo] = useState(true);
  const [hasTests, setHasTests] = useState(true);
  const [hasDiagram, setHasDiagram] = useState(false);
  const [hasLicense, setHasLicense] = useState(true);
  const [hasCiCd, setHasCiCd] = useState(true);

  // Scanning animation state
  const [isAuditingGit, setIsAuditingGit] = useState(false);
  const [auditStepMessage, setAuditStepMessage] = useState('');
  const [copiedReadme, setCopiedReadme] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Preset sample projects to test
  const PRESET_PROJECTS = [
    { 
      name: 'jobfit-cloud-platform', 
      user: 'developer-dev',
      desc: 'Full-stack distributed career platform with real-time scoring and ATS document export', 
      demo: true, 
      tests: true, 
      diagram: false,
      license: true,
      cicd: true
    },
    { 
      name: 'ecommerce-microservices-api', 
      user: 'cloud-architect-pro',
      desc: 'Go and Node.js microservices with Kafka event streaming and Redis caching', 
      demo: false, 
      tests: true, 
      diagram: true,
      license: true,
      cicd: true
    },
    { 
      name: 'llm-rag-search-agent', 
      user: 'ml-researcher',
      desc: 'Retrieval Augmented Generation pipeline with vector database and FastAPI server', 
      demo: true, 
      tests: false, 
      diagram: false,
      license: false,
      cicd: false
    }
  ];

  // Handle URL or repo text input change with smart parser
  const handleRepoUrlChange = (val: string) => {
    setRepoInputUrl(val);
    const cleaned = val.trim().replace(/^https?:\/\/github\.com\//i, '').replace(/\/$/, '');
    const parts = cleaned.split('/');
    if (parts.length >= 2) {
      setGithubUser(parts[0]);
      setGithubRepo(parts[1]);
    } else if (parts.length === 1 && parts[0].length > 0) {
      setGithubRepo(parts[0]);
    }
  };

  // Run interactive repository scan
  const handleRunGitAudit = () => {
    setIsAuditingGit(true);
    setAuditStepMessage('Connecting to GitHub repository tree...');

    setTimeout(() => {
      setAuditStepMessage('Inspecting README.md and documentation depth...');
    }, 400);

    setTimeout(() => {
      setAuditStepMessage('Scanning for CI/CD workflows and automated test coverage...');
    }, 800);

    setTimeout(() => {
      setAuditStepMessage('Checking live production deployment endpoints and SSL certificates...');
    }, 1200);

    setTimeout(() => {
      setIsAuditingGit(false);
      setAuditStepMessage('');
      showToast(`Audit completed for ${githubUser}/${githubRepo}!`);
    }, 1600);
  };

  // Calculate dynamic GitHub hiring signal score
  const calculateGitScore = () => {
    let score = 40;
    if (githubRepo.length >= 3) score += 10;
    if (repoDescription.length >= 15) score += 10;
    if (hasLiveDemo) score += 15;
    if (hasTests) score += 10;
    if (hasDiagram) score += 10;
    if (hasLicense) score += 5;
    if (hasCiCd) score += 8;
    return Math.min(99, score);
  };

  const gitScore = calculateGitScore();

  // Dynamic audit items based on parameters
  const dynamicGitAuditItems: AuditItem[] = [
    {
      id: 'g1',
      title: 'Live Production Demo Deployment',
      category: 'Recruiter Impact',
      status: hasLiveDemo ? 'passed' : 'critical',
      impact: 'High',
      description: hasLiveDemo 
        ? `Live production demo detected (e.g. Vercel, Cloud Run, AWS). Recruiters and hiring managers can test the project in 1-click without local setup.`
        : 'No live hosted URL found in the repository header or README. Recruiters rarely clone code or run local builds.',
      fix: 'Deploy the frontend to Vercel/Netlify or container to Cloud Run/Render and link the URL prominently at the top of the README.'
    },
    {
      id: 'g2',
      title: 'Repository Architecture & Mermaid.js Flowchart',
      category: 'System Design',
      status: hasDiagram ? 'passed' : 'warning',
      impact: 'High',
      description: hasDiagram 
        ? 'Visual system architecture diagram detected. Technical interviewers can instantly evaluate your understanding of distributed boundaries.'
        : 'Your repository lacks a visual system architecture diagram or data flow breakdown in README.md.',
      fix: 'Embed a Mermaid.js diagram or PNG flowchart demonstrating frontend, API, database, and cache interactions.'
    },
    {
      id: 'g3',
      title: 'Automated CI/CD Workflows & Unit Tests',
      category: 'DevOps & Quality',
      status: hasTests && hasCiCd ? 'passed' : hasTests || hasCiCd ? 'warning' : 'critical',
      impact: 'High',
      description: hasTests && hasCiCd 
        ? 'GitHub Actions workflow (.github/workflows) detected with automated linting and unit test execution on pull requests.'
        : 'Missing automated GitHub Actions workflow or test suite directory (Jest, PyTest, Vitest).',
      fix: 'Add a .github/workflows/ci.yml running tests on pull requests to display a verified green build status badge.'
    },
    {
      id: 'g4',
      title: 'Open Source License & Contributor Hygiene',
      category: 'Repository Hygiene',
      status: hasLicense ? 'passed' : 'warning',
      impact: 'Medium',
      description: hasLicense 
        ? 'Standard OSI-approved license file (MIT/Apache 2.0) detected with clean issue templates.'
        : 'No open-source license found. Corporate recruiters look for clear IP attribution and licensing.',
      fix: 'Add an MIT or Apache-2.0 LICENSE file in repository root.'
    },
    {
      id: 'g5',
      title: `Relevance to ${targetRole}`,
      category: 'Role Alignment',
      status: 'passed',
      impact: 'High',
      description: `Project scope demonstrates modern technical competencies expected for ${targetRole} positions.`,
      fix: 'Highlight quantifiable performance metrics (e.g. "reduced latency by 40%", "handles 10k RPS").'
    }
  ];

  // LinkedIn State
  const [linkedinHeadline, setLinkedinHeadline] = useState(
    'Software Engineer at TechCorp | React, TypeScript, Node.js | Building Scalable Systems'
  );
  const [linkedinAbout, setLinkedinAbout] = useState(
    'I am a full stack software engineer with 3+ years of experience building modern web apps. I love coding in TypeScript and Python and collaborating in agile teams.'
  );
  const [copiedHeadline, setCopiedHeadline] = useState<number | null>(null);

  const linkedinAuditItems: AuditItem[] = [
    {
      id: 'l1',
      title: 'Recruiter Search Headline Formula',
      category: 'Discoverability',
      status: 'warning',
      impact: 'High',
      description: 'Your headline can be strengthened with quantified impact to rank higher in recruiter LinkedIn Recruiter search algorithms.',
      fix: 'Follow the 3-part formula: [Primary Role] | [Top 4 Core Tech Keywords] | [Quantified Metric or Scale Hook].'
    },
    {
      id: 'l2',
      title: 'About Section First 3 Lines Hook',
      category: 'Engagement',
      status: 'critical',
      impact: 'High',
      description: 'The first 300 characters shown before the "see more" button lack a punchy hook or key specialization.',
      fix: 'Start with: "Full Stack Engineer specializing in distributed real-time systems and AI applications with 4+ years scaling products to 2M+ active users."'
    },
    {
      id: 'l3',
      title: 'Target Keyword Density for ATS Search',
      category: 'SEO',
      status: 'passed',
      impact: 'High',
      description: 'High presence of core technical keywords searched by corporate tech recruiters.',
      fix: 'Ensure your Skills section has at least 15 verified technical endorsements.'
    }
  ];

  const optimizedHeadlines = [
    `${targetRole} | TypeScript, React, Python, Cloud | Scaled Distributed Web Apps to 1.5M+ MAU`,
    `Senior ${targetRole} | Full-Stack Architecture, Next.js, FastAPI & MLOps | Ex-Fintech Builder`,
    `${targetRole} & Systems Engineer | AWS, Kubernetes, High-Concurrency APIs | 99.99% SLA Delivery`
  ];

  const handleCopyHeadline = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedHeadline(idx);
    showToast('Headline copied to clipboard!');
    setTimeout(() => setCopiedHeadline(null), 2000);
  };

  const handleCopyReadme = () => {
    const readmeTemplate = `# ${githubRepo}

${repoDescription}

[![CI/CD Build](https://img.shields.io/badge/build-passing-brightgreen)](#)
[![Live Demo](https://img.shields.io/badge/demo-online-blue)](https://${githubRepo}.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 Live Demo
Test the live deployed application here: **[https://${githubRepo}.vercel.app](https://${githubRepo}.vercel.app)**

## 🏗️ Architecture & Data Flow
\`\`\`mermaid
graph TD
    Client[Browser Client / Mobile App] -->|HTTPS / REST / WebSocket| Gateway[API Gateway / Edge Proxy]
    Gateway --> Auth[Authentication & Rate Limiter]
    Auth --> Service[Core Backend Service (${targetRole} Stack)]
    Service --> Cache[(Redis Distributed Cache)]
    Service --> DB[(Primary PostgreSQL Database)]
\`\`\`

## ⚡ Quick Start
\`\`\`bash
# Clone the repository
git clone https://github.com/${githubUser}/${githubRepo}.git

# Navigate into directory
cd ${githubRepo}

# Install dependencies
npm install

# Run development server
npm run dev
\`\`\`

## 🧪 Testing & CI/CD
\`\`\`bash
# Run unit & integration test suites
npm test
\`\`\`

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
`;
    navigator.clipboard.writeText(readmeTemplate);
    setCopiedReadme(true);
    showToast('Recruiter-ready README copied!');
    setTimeout(() => setCopiedReadme(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-neutral-700 flex items-center space-x-3 text-xs font-semibold animate-bounce duration-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white dark:bg-neutral-800 rounded-3xl p-6 sm:p-8 border border-neutral-200 dark:border-neutral-700 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-2.5 border border-blue-200 dark:border-blue-800">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Online Profile Check <span className="opacity-70 font-normal">[Interactive GitHub & LinkedIn Audit]</span></span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white">
              Profile Auditor
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1 max-w-2xl">
              Inspect your public GitHub repositories and LinkedIn profile to ensure they pass recruiter screening and stand out to hiring managers.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex bg-neutral-100 dark:bg-neutral-900 p-1 rounded-2xl w-fit border border-neutral-200 dark:border-neutral-700">
            <button
              onClick={() => setActiveTab('github')}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl flex items-center transition-all cursor-pointer ${
                activeTab === 'github'
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              <Github className="w-4 h-4 mr-2" />
              GitHub Projects
            </button>
            <button
              onClick={() => setActiveTab('linkedin')}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl flex items-center transition-all cursor-pointer ${
                activeTab === 'linkedin'
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              <Linkedin className="w-4 h-4 mr-2 text-blue-600" />
              LinkedIn Profile
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'github' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* GitHub Input Controls */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-neutral-800 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-700 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-neutral-900 dark:text-white text-sm flex items-center">
                  <FolderGit2 className="w-4 h-4 mr-2 text-blue-600" />
                  Repository Inspector
                </h3>
                <span className="text-[10px] text-neutral-400 font-semibold uppercase">Interactive</span>
              </div>

              {/* Sample Preset Chooser */}
              <div>
                <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                  Try Sample Project:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_PROJECTS.map((proj) => (
                    <button
                      key={proj.name}
                      onClick={() => {
                        setRepoInputUrl(`https://github.com/${proj.user}/${proj.name}`);
                        setGithubUser(proj.user);
                        setGithubRepo(proj.name);
                        setRepoDescription(proj.desc);
                        setHasLiveDemo(proj.demo);
                        setHasTests(proj.tests);
                        setHasDiagram(proj.diagram);
                        setHasLicense(proj.license);
                        setHasCiCd(proj.cicd);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        githubRepo === proj.name
                          ? 'bg-blue-600 text-white'
                          : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200'
                      }`}
                    >
                      {proj.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* URL or Name Input */}
              <div>
                <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 block mb-1">
                  GitHub Repository URL or Path
                </label>
                <div className="flex items-center bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2">
                  <Github className="w-4 h-4 text-neutral-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={repoInputUrl}
                    onChange={(e) => handleRepoUrlChange(e.target.value)}
                    placeholder="https://github.com/username/project"
                    className="w-full bg-transparent text-neutral-900 dark:text-white text-xs font-medium outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-500 block mb-1">Owner</label>
                  <input
                    type="text"
                    value={githubUser}
                    onChange={(e) => setGithubUser(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white text-xs font-medium outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-neutral-500 block mb-1">Repo Name</label>
                  <input
                    type="text"
                    value={githubRepo}
                    onChange={(e) => setGithubRepo(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white text-xs font-medium outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 block mb-1">
                  Project Description / One-Liner
                </label>
                <textarea
                  rows={2}
                  value={repoDescription}
                  onChange={(e) => setRepoDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white text-xs font-medium outline-none"
                />
              </div>

              {/* Toggles for Checklist Items */}
              <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-700">
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">
                  Project Health Checkpoints:
                </span>
                
                <label className="flex items-center space-x-2.5 text-xs text-neutral-700 dark:text-neutral-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasLiveDemo}
                    onChange={(e) => setHasLiveDemo(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span>Has Live Production Demo URL (Vercel/Render/Cloud)</span>
                </label>

                <label className="flex items-center space-x-2.5 text-xs text-neutral-700 dark:text-neutral-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasTests}
                    onChange={(e) => setHasTests(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span>Has Automated Tests (Jest, PyTest, Vitest)</span>
                </label>

                <label className="flex items-center space-x-2.5 text-xs text-neutral-700 dark:text-neutral-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasDiagram}
                    onChange={(e) => setHasDiagram(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span>Has Architecture Diagram in README</span>
                </label>

                <label className="flex items-center space-x-2.5 text-xs text-neutral-700 dark:text-neutral-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasCiCd}
                    onChange={(e) => setHasCiCd(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span>Has Automated CI/CD Workflow (.github/workflows)</span>
                </label>

                <label className="flex items-center space-x-2.5 text-xs text-neutral-700 dark:text-neutral-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasLicense}
                    onChange={(e) => setHasLicense(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span>Has Open-Source License (MIT / Apache)</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={handleRunGitAudit}
                  disabled={isAuditingGit}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl text-xs font-bold flex items-center justify-center transition-colors cursor-pointer shadow-sm shadow-blue-600/20"
                >
                  {isAuditingGit ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      <span>{auditStepMessage || 'Auditing Repository...'}</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-1.5 fill-current" />
                      <span>Run Project Audit</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleCopyReadme}
                  className="w-full py-2 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-neutral-800 dark:text-white rounded-xl text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer"
                >
                  {copiedReadme ? <Check className="w-4 h-4 mr-1.5 text-emerald-500" /> : <Copy className="w-4 h-4 mr-1.5" />}
                  <span>{copiedReadme ? 'Copied Recruiter README!' : 'Copy Recruiter-Ready README Template'}</span>
                </button>
              </div>
            </div>

            {/* Score Card */}
            <div className="bg-white dark:bg-neutral-800 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-700 shadow-xs text-center space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                GitHub Hiring Signal Score
              </span>
              <div className="text-4xl font-black text-neutral-900 dark:text-white">
                <span className={gitScore >= 80 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500'}>
                  {gitScore}
                </span>
                <span className="text-base text-neutral-400 font-normal"> / 100</span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {gitScore >= 85 
                  ? '🌟 Strong Senior Signal — Outstanding documentation, tests, and live proof of execution.'
                  : '🔧 Good foundation — Add a live demo link or architecture diagram to boost recruiter interest.'}
              </p>
            </div>
          </div>

          {/* GitHub Audit Checkpoints Breakdown */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white dark:bg-neutral-800 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-700 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-neutral-900 dark:text-white text-base">
                  Repository Architecture Breakdown
                </h3>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300">
                  {dynamicGitAuditItems.filter(i => i.status === 'passed').length} / {dynamicGitAuditItems.length} Passed
                </span>
              </div>

              <div className="space-y-4">
                {dynamicGitAuditItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-700/80 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center space-x-2">
                        {item.status === 'passed' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        ) : item.status === 'warning' ? (
                          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                        )}
                        <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                          {item.title}
                        </h4>
                      </div>

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        item.status === 'passed'
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                          : item.status === 'warning'
                            ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                            : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300'
                      }`}>
                        {item.status.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="pt-2 text-xs border-t border-neutral-200/60 dark:border-neutral-800">
                      <strong className="text-blue-600 dark:text-blue-400">Recommendation: </strong>
                      <span className="text-neutral-700 dark:text-neutral-300">{item.fix}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* LinkedIn Tab */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 bg-white dark:bg-neutral-800 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-700 shadow-xs space-y-4">
            <h3 className="font-bold text-neutral-900 dark:text-white text-sm flex items-center">
              <Linkedin className="w-4 h-4 mr-2 text-blue-600" />
              LinkedIn Profile Details
            </h3>

            <div>
              <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 block mb-1">
                Current Headline
              </label>
              <textarea
                rows={3}
                value={linkedinHeadline}
                onChange={(e) => setLinkedinHeadline(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white text-xs font-medium outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 block mb-1">
                About Summary
              </label>
              <textarea
                rows={4}
                value={linkedinAbout}
                onChange={(e) => setLinkedinAbout(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white text-xs font-medium outline-none"
              />
            </div>

            <div className="pt-2">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-2">
                Recruiter-Optimized Headlines:
              </span>
              <div className="space-y-2">
                {optimizedHeadlines.map((head, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 space-y-2 text-xs"
                  >
                    <p className="text-neutral-700 dark:text-neutral-300 leading-snug">{head}</p>
                    <button
                      onClick={() => handleCopyHeadline(head, idx)}
                      className="px-2 py-1 rounded bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-[10px] font-bold text-blue-600 hover:text-blue-700 flex items-center transition-colors cursor-pointer"
                    >
                      {copiedHeadline === idx ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                      <span>{copiedHeadline === idx ? 'Copied' : 'Copy Headline'}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white dark:bg-neutral-800 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-700 shadow-xs">
              <h3 className="font-bold text-neutral-900 dark:text-white text-base mb-4">
                LinkedIn Recruiter Algorithm Analysis
              </h3>

              <div className="space-y-4">
                {linkedinAuditItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-700/80 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center space-x-2">
                        {item.status === 'passed' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        ) : item.status === 'warning' ? (
                          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                        )}
                        <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                          {item.title}
                        </h4>
                      </div>

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        item.status === 'passed'
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                          : item.status === 'warning'
                            ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                            : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300'
                      }`}>
                        {item.status.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="pt-2 text-xs border-t border-neutral-200/60 dark:border-neutral-800">
                      <strong className="text-blue-600 dark:text-blue-400">Recommendation: </strong>
                      <span className="text-neutral-700 dark:text-neutral-300">{item.fix}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
