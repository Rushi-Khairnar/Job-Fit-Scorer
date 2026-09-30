import React, { useState } from 'react';
import { 
  Users, 
  Sparkles, 
  Trophy, 
  ArrowUpDown, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Download, 
  Plus, 
  Trash2,
  Layers,
  ChevronRight
} from 'lucide-react';
import { JOB_DIRECTORY_DATA } from '../jobsData';
import { calculateFitScores } from '../scoring';

interface CandidateProfile {
  id: string;
  name: string;
  experienceYears: number;
  skills: string[];
  notes: string;
  scores?: {
    overall: number;
    base: number;
    semantic: number;
    matchingSkills: string[];
    missingSkills: string[];
  };
}

const SAMPLE_CANDIDATES: CandidateProfile[] = [
  {
    id: 'c1',
    name: 'Sarah Chen',
    experienceYears: 5,
    skills: ['Python', 'Machine Learning', 'Deep Learning', 'SQL', 'Docker', 'AWS', 'TensorFlow', 'Data Analysis'],
    notes: 'Ex-Stripe Senior Data Scientist with production recommendation models'
  },
  {
    id: 'c2',
    name: 'Marcus Vance',
    experienceYears: 3,
    skills: ['Python', 'SQL', 'Pandas', 'Data Analysis', 'Tableau', 'Scikit-Learn'],
    notes: 'Strong analytics and tabular modeling, limited distributed MLOps'
  },
  {
    id: 'c3',
    name: 'David Okafor',
    experienceYears: 6,
    skills: ['Python', 'FastAPI', 'Docker', 'Kubernetes', 'AWS', 'PostgreSQL', 'CI/CD', 'Machine Learning'],
    notes: 'ML Platform & deployment heavy, strong systems engineering'
  },
  {
    id: 'c4',
    name: 'Elena Rostova',
    experienceYears: 2,
    skills: ['Python', 'R', 'Statistics', 'SQL', 'Data Visualization'],
    notes: 'Junior statistician with strong academic foundation'
  },
  {
    id: 'c5',
    name: 'Priya Patel',
    experienceYears: 7,
    skills: ['Python', 'Deep Learning', 'PyTorch', 'Computer Vision', 'MLOps', 'Docker', 'Spark', 'SQL'],
    notes: 'Senior AI Researcher with published CV & transformer architectures'
  }
];

export const BulkResumeRanker: React.FC = () => {
  const [selectedJobTitle, setSelectedJobTitle] = useState('Data Scientist');
  const [candidates, setCandidates] = useState<CandidateProfile[]>(SAMPLE_CANDIDATES);
  const [newCandidateName, setNewCandidateName] = useState('');
  const [newCandidateSkills, setNewCandidateSkills] = useState('');
  const [minScoreFilter, setMinScoreFilter] = useState(0);

  const selectedJob = JOB_DIRECTORY_DATA.find(j => j.title === selectedJobTitle) || JOB_DIRECTORY_DATA[0];

  // Score all candidates against selected job
  const rankedCandidates = candidates.map(c => {
    const scores = calculateFitScores(c.skills, selectedJob.skills);
    return {
      ...c,
      scores
    };
  }).sort((a, b) => (b.scores?.overall || 0) - (a.scores?.overall || 0));

  const filteredCandidates = rankedCandidates.filter(c => (c.scores?.overall || 0) >= minScoreFilter);

  const handleAddCandidate = () => {
    if (!newCandidateName.trim()) return;
    const parsedSkills = newCandidateSkills.split(',').map(s => s.trim()).filter(Boolean);
    const newCand: CandidateProfile = {
      id: `c_${Date.now()}`,
      name: newCandidateName,
      experienceYears: 3,
      skills: parsedSkills.length > 0 ? parsedSkills : ['Python', 'SQL'],
      notes: 'Custom batch upload entry'
    };
    setCandidates([...candidates, newCand]);
    setNewCandidateName('');
    setNewCandidateSkills('');
  };

  const handleRemoveCandidate = (id: string) => {
    setCandidates(candidates.filter(c => c.id !== id));
  };

  const handleExportCSV = () => {
    const headers = ['Rank', 'Name', 'Overall Match %', 'Semantic %', 'Lexical %', 'Matching Skills', 'Missing Skills'];
    const rows = filteredCandidates.map((c, i) => [
      i + 1,
      `"${c.name}"`,
      `${c.scores?.overall}%`,
      `${c.scores?.semantic}%`,
      `${c.scores?.base}%`,
      `"${c.scores?.matchingSkills.join(', ')}"`,
      `"${c.scores?.missingSkills.join(', ')}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Candidate_Ranking_${selectedJobTitle.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-neutral-800 rounded-3xl p-6 sm:p-8 border border-neutral-200 dark:border-neutral-700 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-2.5 border border-blue-200 dark:border-blue-800">
              <Users className="w-3.5 h-3.5" />
              <span>Candidate Comparison <span className="opacity-70 font-normal">[Batch Match & Compare]</span></span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white">
              Candidate Ranker
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1 max-w-2xl">
              Compare multiple resumes side-by-side against any job description to see who is the best fit.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={selectedJobTitle}
              onChange={(e) => setSelectedJobTitle(e.target.value)}
              className="px-3 py-2 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-semibold text-neutral-900 dark:text-white"
            >
              {JOB_DIRECTORY_DATA.map(j => (
                <option key={j.title} value={j.title}>{j.title}</option>
              ))}
            </select>

            <button
              onClick={handleExportCSV}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center transition-all shadow-xs"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Export Spreadsheet
            </button>
          </div>
        </div>
      </div>

      {/* Add Candidate Form */}
      <div className="bg-white dark:bg-neutral-800 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-700 shadow-xs">
        <h3 className="font-bold text-neutral-900 dark:text-white text-sm mb-3 flex items-center">
          <Plus className="w-4 h-4 mr-2 text-blue-600" />
          Add a Candidate to Compare
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-4">
            <input
              type="text"
              placeholder="Candidate Full Name"
              value={newCandidateName}
              onChange={(e) => setNewCandidateName(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white"
            />
          </div>
          <div className="sm:col-span-6">
            <input
              type="text"
              placeholder="Skills separated by commas (e.g. Python, SQL, Docker, AWS)"
              value={newCandidateSkills}
              onChange={(e) => setNewCandidateSkills(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white"
            />
          </div>
          <div className="sm:col-span-2">
            <button
              onClick={handleAddCandidate}
              disabled={!newCandidateName.trim()}
              className="w-full py-2.5 bg-neutral-900 dark:bg-blue-600 hover:bg-neutral-800 dark:hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center transition-all disabled:opacity-50"
            >
              Add Candidate
            </button>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white dark:bg-neutral-800 rounded-3xl border border-neutral-200 dark:border-neutral-700 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-neutral-900 dark:text-white text-base">
              Candidate Rankings ({filteredCandidates.length})
            </h3>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="text-neutral-500">Filter by Score:</span>
            <input
              type="range"
              min={0}
              max={90}
              step={10}
              value={minScoreFilter}
              onChange={(e) => setMinScoreFilter(parseInt(e.target.value))}
              className="w-24 accent-blue-600"
            />
            <span className="font-bold text-neutral-800 dark:text-neutral-200">{minScoreFilter}%+</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-900/60 border-b border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 w-12 text-center">Rank</th>
                <th className="py-3.5 px-4">Candidate</th>
                <th className="py-3.5 px-4">Overall Fit</th>
                <th className="py-3.5 px-4">Fit Breakdown [Smart & Exact]</th>
                <th className="py-3.5 px-4">Matching Skills</th>
                <th className="py-3.5 px-4">Skills to Learn</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700/60">
              {filteredCandidates.map((cand, idx) => {
                const overall = cand.scores?.overall || 0;
                return (
                  <tr key={cand.id} className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/50 transition-colors">
                    <td className="py-4 px-4 text-center font-bold text-neutral-400">
                      {idx === 0 ? (
                        <span className="inline-flex w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 items-center justify-center font-black">
                          1
                        </span>
                      ) : (
                        `#${idx + 1}`
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-bold text-neutral-900 dark:text-white text-sm">
                        {cand.name}
                      </div>
                      <div className="text-[11px] text-neutral-400 line-clamp-1 max-w-xs">
                        {cand.notes}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-black ${
                          overall >= 80 ? 'text-emerald-600 dark:text-emerald-400' : overall >= 60 ? 'text-blue-600 dark:text-blue-400' : 'text-amber-600'
                        }`}>
                          {overall}%
                        </span>
                        <div className="w-16 bg-neutral-200 dark:bg-neutral-700 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${overall >= 80 ? 'bg-emerald-500' : overall >= 60 ? 'bg-blue-500' : 'bg-amber-500'}`}
                            style={{ width: `${overall}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="text-neutral-700 dark:text-neutral-300">
                        <span className="font-semibold text-blue-600 dark:text-blue-400">{cand.scores?.semantic}%</span> meaning / <span className="font-semibold text-neutral-500">{cand.scores?.base}%</span> exact
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {cand.scores?.matchingSkills.slice(0, 3).map(s => (
                          <span key={s} className="px-1.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-[10px] font-semibold border border-emerald-200 dark:border-emerald-800">
                            {s}
                          </span>
                        ))}
                        {(cand.scores?.matchingSkills.length || 0) > 3 && (
                          <span className="text-[10px] text-neutral-400 self-center">
                            +{(cand.scores?.matchingSkills.length || 0) - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {cand.scores?.missingSkills.slice(0, 2).map(s => (
                          <span key={s} className="px-1.5 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 text-[10px] font-semibold border border-rose-200 dark:border-rose-800">
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => handleRemoveCandidate(cand.id)}
                        className="p-1.5 text-neutral-400 hover:text-rose-500 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                        title="Remove Candidate"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
