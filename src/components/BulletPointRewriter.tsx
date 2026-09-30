import React, { useState } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  ArrowRight, 
  RotateCcw, 
  HelpCircle, 
  Layers, 
  TrendingUp,
  Sliders,
  CheckCircle2,
  AlertCircle,
  FileText
} from 'lucide-react';

interface RewrittenSample {
  category: string;
  original: string;
  rewritten: string;
  metric: string;
  actionVerb: string;
  impactType: string;
}

const PRESET_EXAMPLES: RewrittenSample[] = [
  {
    category: 'Machine Learning',
    original: 'Built machine learning model for churn prediction.',
    rewritten: 'Engineered an ensemble XGBoost churn prediction pipeline, reducing customer churn by 18% and retaining $2.4M ARR by implementing proactive retention interventions.',
    metric: '18% churn reduction ($2.4M ARR)',
    actionVerb: 'Engineered',
    impactType: 'Revenue & Retention'
  },
  {
    category: 'Full Stack & Web',
    original: 'Worked on React web application and fixed API bugs.',
    rewritten: 'Architected modular React state layer and optimized Node.js GraphQL endpoints, slashing page load latency by 42% (2.8s to 1.6s) across 1.2M active monthly users.',
    metric: '42% latency reduction (1.2M MAU)',
    actionVerb: 'Architected',
    impactType: 'Performance & Scale'
  },
  {
    category: 'Data Engineering & Cloud',
    original: 'Helped build ETL pipeline in AWS for data team.',
    rewritten: 'Orchestrated automated Apache Spark ETL pipelines in AWS (Glue, S3, Redshift), accelerating daily reporting ingestion by 65% and reducing infrastructure cloud costs by $35,000/yr.',
    metric: '65% faster ETL & $35k cloud savings',
    actionVerb: 'Orchestrated',
    impactType: 'Cost & Efficiency'
  },
  {
    category: 'DevOps & Reliability',
    original: 'Managed Kubernetes clusters and deployment scripts.',
    rewritten: 'Spearheaded zero-downtime CI/CD containerization using Docker & Kubernetes across 14 microservices, elevating deployment frequency from bi-weekly to 8x daily with 99.99% uptime.',
    metric: '16x deploy frequency & 99.99% uptime',
    actionVerb: 'Spearheaded',
    impactType: 'Reliability & Velocity'
  }
];

const ACTION_VERBS = [
  'Architected', 'Spearheaded', 'Orchestrated', 'Engineered', 'Optimized',
  'Automated', 'Scaled', 'Pioneered', 'Revitalized', 'Standardized'
];

interface BulletPointRewriterProps {
  onInsertToCV?: (bullet: string) => void;
  suggestedRole?: string;
}

export const BulletPointRewriter: React.FC<BulletPointRewriterProps> = ({ 
  onInsertToCV,
  suggestedRole = 'Software Engineer' 
}) => {
  const [inputBullet, setInputBullet] = useState('');
  const [metricValue, setMetricValue] = useState('35%');
  const [metricUnit, setMetricUnit] = useState('speed improvement');
  const [targetImpact, setTargetImpact] = useState<'performance' | 'cost' | 'revenue' | 'scale'>('performance');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [generatedBullets, setGeneratedBullets] = useState<Array<{ text: string; formula: string; verb: string; metric: string }>>([]);
  const [bulletScore, setBulletScore] = useState<{ overall: number; actionScore: number; metricScore: number; techScore: number } | null>(null);

  // Score live bullet
  const analyzeBulletQuality = (text: string) => {
    if (!text.trim()) {
      setBulletScore(null);
      return;
    }
    const lower = text.toLowerCase();
    
    // Check strong verbs
    const strongVerbsList = ['architected', 'spearheaded', 'orchestrated', 'engineered', 'optimized', 'automated', 'scaled', 'pioneered', 'implemented', 'designed', 'accelerated', 'slashed', 'boosted', 'delivered'];
    const weakVerbsList = ['worked on', 'helped', 'assisted', 'responsible for', 'handled', 'did', 'made', 'participated'];
    
    let actionScore = 40;
    if (strongVerbsList.some(v => lower.includes(v))) actionScore = 95;
    else if (weakVerbsList.some(v => lower.includes(v))) actionScore = 30;

    // Check metric presence (% $ ms x times k m)
    const metricPattern = /(\d+%\b|\$\d+|\b\d+x\b|\b\d+\s*(ms|s|k|m|million|billion|users|customers|hours|days)\b)/i;
    let metricScore = metricPattern.test(text) ? 95 : 25;

    // Check tech keywords
    const techWords = ['python', 'react', 'sql', 'aws', 'docker', 'kubernetes', 'pipeline', 'api', 'database', 'algorithm', 'system', 'model', 'cache', 'ci/cd', 'frontend', 'backend'];
    const techCount = techWords.filter(w => lower.includes(w)).length;
    let techScore = Math.min(100, Math.max(30, techCount * 25));

    const overall = Math.round((actionScore * 0.35) + (metricScore * 0.40) + (techScore * 0.25));
    setBulletScore({ overall, actionScore, metricScore, techScore });
  };

  const handleRewrite = () => {
    if (!inputBullet.trim()) return;

    analyzeBulletQuality(inputBullet);

    const verbs = {
      performance: ['Optimized', 'Streamlined', 'Accelerated', 'Architected'],
      cost: ['Slashed', 'Curtailed', 'Minimized', 'Orchestrated'],
      revenue: ['Accelerated', 'Delivered', 'Engineered', 'Spearheaded'],
      scale: ['Scaled', 'Expanded', 'Automated', 'Pioneered']
    }[targetImpact];

    const results = [
      {
        verb: verbs[0],
        metric: metricValue ? `${metricValue} ${metricUnit}` : '38% operational speedup',
        formula: 'Accomplished [X] measured by [Y], by doing [Z]',
        text: `${verbs[0]} core ${suggestedRole.toLowerCase()} architecture, improving performance by ${metricValue || '35%'} through modernized execution strategies, modular data pipelines, and automated caching.`
      },
      {
        verb: verbs[1],
        metric: metricValue ? `${metricValue} ${metricUnit}` : '$45,000 cost savings',
        formula: 'Accomplished [X] measured by [Y], by doing [Z]',
        text: `${verbs[1]} end-to-end delivery workflow, generating a ${metricValue || '28%'} efficiency lift by refactoring legacy bottlenecks and implementing resilient automated testing suites.`
      },
      {
        verb: verbs[2],
        metric: metricValue ? `${metricValue} ${metricUnit}` : '99.95% reliability',
        formula: 'Accomplished [X] measured by [Y], by doing [Z]',
        text: `${verbs[2]} critical service components handling high concurrency, sustaining a ${metricValue || '45%'} latency reduction across enterprise endpoints by adopting asynchronous processing.`
      }
    ];

    setGeneratedBullets(results);
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleLoadExample = (example: RewrittenSample) => {
    setInputBullet(example.original);
    analyzeBulletQuality(example.original);
    setGeneratedBullets([
      {
        verb: example.actionVerb,
        metric: example.metric,
        formula: 'Google X-Y-Z (Accomplished X, measured by Y, by doing Z)',
        text: example.rewritten
      }
    ]);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-neutral-800 rounded-3xl p-6 sm:p-8 border border-neutral-200 dark:border-neutral-700 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-2.5 border border-blue-200 dark:border-blue-800">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Resume Bullet Formula <span className="opacity-70 font-normal">[Google X-Y-Z: Did X, measured by Y, by doing Z]</span></span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white">
              Resume Rewriter
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1 max-w-2xl">
              Turn simple task descriptions into impressive accomplishment statements: <span className="font-semibold text-neutral-800 dark:text-neutral-200">&ldquo;Accomplished [X] measured by [Y], by doing [Z]&rdquo;</span>.
            </p>
          </div>

          <div className="flex items-center gap-2 p-3 bg-neutral-50 dark:bg-neutral-900/60 rounded-2xl border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-600 dark:text-neutral-300">
            <HelpCircle className="w-4 h-4 text-blue-500 shrink-0" />
            <span>Targeting role: <strong className="text-neutral-900 dark:text-white">{suggestedRole}</strong></span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input and Parameters */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white dark:bg-neutral-800 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-700 shadow-xs space-y-5">
            <h3 className="font-bold text-neutral-900 dark:text-white text-base flex items-center">
              <FileText className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
              Type or Paste a Resume Bullet Point
            </h3>

            <div>
              <textarea
                value={inputBullet}
                onChange={(e) => {
                  setInputBullet(e.target.value);
                  analyzeBulletQuality(e.target.value);
                }}
                placeholder="e.g. Worked on the website and helped fix bugs for the team..."
                rows={4}
                className="w-full p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-400 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden transition-all resize-none"
              />
            </div>

            {/* Quality Meter if bullet typed */}
            {bulletScore && (
              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-700 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-neutral-700 dark:text-neutral-300">Bullet Strength Rating [Action + Numbers + Tech]</span>
                  <span className={`font-extrabold px-2 py-0.5 rounded-full ${
                    bulletScore.overall >= 80 
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300' 
                      : bulletScore.overall >= 50 
                        ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300' 
                        : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                  }`}>
                    {bulletScore.overall} / 100
                  </span>
                </div>

                <div className="w-full bg-neutral-200 dark:bg-neutral-700 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      bulletScore.overall >= 80 ? 'bg-emerald-500' : bulletScore.overall >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${bulletScore.overall}%` }}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 text-[11px] text-center pt-1">
                  <div className="p-1.5 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                    <div className="text-neutral-500 dark:text-neutral-400">Action Word</div>
                    <div className="font-bold text-neutral-800 dark:text-neutral-200">{bulletScore.actionScore}%</div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                    <div className="text-neutral-500 dark:text-neutral-400">Numbers & Results</div>
                    <div className="font-bold text-neutral-800 dark:text-neutral-200">{bulletScore.metricScore}%</div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                    <div className="text-neutral-500 dark:text-neutral-400">Tools & Skills</div>
                    <div className="font-bold text-neutral-800 dark:text-neutral-200">{bulletScore.techScore}%</div>
                  </div>
                </div>
              </div>
            )}

            {/* Impact Metric Tweakers */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-bold text-neutral-600 dark:text-neutral-300 uppercase tracking-wider block">
                What kind of result did you achieve?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'performance', label: 'Speed & Quality' },
                  { id: 'cost', label: 'Money Saved' },
                  { id: 'revenue', label: 'Growth & Sales' },
                  { id: 'scale', label: 'Users & Traffic' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setTargetImpact(item.id as any)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                      targetImpact === item.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300'
                        : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">Number or Percent (Y)</label>
                  <input
                    type="text"
                    value={metricValue}
                    onChange={(e) => setMetricValue(e.target.value)}
                    placeholder="e.g. 35%, $40K, 2x"
                    className="w-full mt-1 p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">What did it improve?</label>
                  <input
                    type="text"
                    value={metricUnit}
                    onChange={(e) => setMetricUnit(e.target.value)}
                    placeholder="e.g. faster loading, cost savings, users"
                    className="w-full mt-1 p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white text-xs"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleRewrite}
              disabled={!inputBullet.trim()}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-2xl transition-all shadow-md shadow-blue-600/20 text-sm flex items-center justify-center cursor-pointer"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Rewrite With Impact Formula
            </button>
          </div>

          {/* Quick Presets */}
          <div className="bg-white dark:bg-neutral-800 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-700 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Try Ready-Made Examples (Before & After)
            </h4>
            <div className="space-y-2">
              {PRESET_EXAMPLES.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => handleLoadExample(ex)}
                  className="w-full text-left p-3 rounded-xl border border-neutral-200 dark:border-neutral-700/80 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/30 dark:hover:bg-blue-950/20 transition-all text-xs group"
                >
                  <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 mb-1">
                    <span className="font-semibold text-neutral-700 dark:text-neutral-300">{ex.category}</span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">{ex.impactType}</span>
                  </div>
                  <div className="text-neutral-600 dark:text-neutral-300 line-clamp-1 italic text-[11px]">
                    &ldquo;{ex.original}&rdquo;
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Rewritten Output */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white dark:bg-neutral-800 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-700 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-neutral-900 dark:text-white text-base flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" />
                Optimized X-Y-Z Variations
              </h3>
              <span className="text-xs text-neutral-400 dark:text-neutral-500">
                {generatedBullets.length > 0 ? `${generatedBullets.length} ready` : 'Awaiting input'}
              </span>
            </div>

            {generatedBullets.length > 0 ? (
              <div className="space-y-4">
                {generatedBullets.map((bullet, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/70 border border-neutral-200 dark:border-neutral-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold text-[10px]">
                          Verb: {bullet.verb}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
                          Metric: {bullet.metric}
                        </span>
                      </div>
                      <span className="text-[10px] text-neutral-400">Variant #{idx + 1}</span>
                    </div>

                    <p className="text-sm font-medium text-neutral-900 dark:text-white leading-relaxed">
                      &bull; {bullet.text}
                    </p>

                    <div className="pt-2 flex items-center justify-end gap-2 border-t border-neutral-200/60 dark:border-neutral-800">
                      <button
                        onClick={() => handleCopy(bullet.text, idx)}
                        className="px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-white dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-semibold flex items-center transition-all"
                      >
                        {copiedIndex === idx ? (
                          <>
                            <Check className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 mr-1" />
                            <span>Copy Bullet</span>
                          </>
                        )}
                      </button>

                      {onInsertToCV && (
                        <button
                          onClick={() => onInsertToCV(bullet.text)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center transition-all shadow-xs"
                        >
                          <FileText className="w-3.5 h-3.5 mr-1" />
                          Insert into CV
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 px-4 space-y-3">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-neutral-100 dark:bg-neutral-700/60 flex items-center justify-center text-neutral-400">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-neutral-800 dark:text-neutral-200 text-sm">
                  Ready to transform your bullet points
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">
                  Type any bullet or select one of the high-impact templates on the left to generate executive Google X-Y-Z bullets.
                </p>
              </div>
            )}
          </div>

          {/* Breakdown Explainer Card */}
          <div className="bg-blue-50/60 dark:bg-blue-950/20 rounded-3xl p-5 border border-blue-200/80 dark:border-blue-900/40 text-xs space-y-2 text-neutral-700 dark:text-neutral-300">
            <h5 className="font-bold text-blue-900 dark:text-blue-200 flex items-center">
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-blue-600 dark:text-blue-400" />
              The Google Formula Explained
            </h5>
            <div className="grid grid-cols-3 gap-2 pt-1 text-[11px]">
              <div className="p-2 rounded-xl bg-white/80 dark:bg-neutral-900/60 border border-blue-200 dark:border-blue-900">
                <strong className="text-blue-700 dark:text-blue-300 block mb-0.5">X: Outcome</strong>
                What did you accomplish? (e.g. reduced churn, launched pipeline)
              </div>
              <div className="p-2 rounded-xl bg-white/80 dark:bg-neutral-900/60 border border-blue-200 dark:border-blue-900">
                <strong className="text-emerald-700 dark:text-emerald-300 block mb-0.5">Y: Measurement</strong>
                How is it quantified? (e.g. 18%, $2.4M ARR, 420ms)
              </div>
              <div className="p-2 rounded-xl bg-white/80 dark:bg-neutral-900/60 border border-blue-200 dark:border-blue-900">
                <strong className="text-purple-700 dark:text-purple-300 block mb-0.5">Z: Method</strong>
                What technical methods did you use? (e.g. XGBoost, GraphQL caching)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
