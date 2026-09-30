import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  Plus, 
  Trash2, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Calendar, 
  Building2, 
  Award,
  Sparkles
} from 'lucide-react';

export type AppStatus = 'Saved' | 'Applied' | 'Screening' | 'Technical' | 'Final Round' | 'Offer' | 'Rejected';

export interface ApplicationRecord {
  id: string;
  company: string;
  role: string;
  matchScore: number;
  status: AppStatus;
  dateApplied: string;
  salaryTarget?: string;
  notes?: string;
}

const DEFAULT_APPLICATIONS: ApplicationRecord[] = [
  {
    id: 'app_1',
    company: 'Stripe',
    role: 'Senior Machine Learning Engineer',
    matchScore: 88,
    status: 'Technical',
    dateApplied: '2026-09-24',
    salaryTarget: '$195,000',
    notes: 'Completed take-home ML pipeline test; virtual onsite scheduled'
  },
  {
    id: 'app_2',
    company: 'Datadog',
    role: 'Full Stack Distributed Systems Engineer',
    matchScore: 92,
    status: 'Final Round',
    dateApplied: '2026-09-18',
    salaryTarget: '$180,000',
    notes: 'Passed system design round with principal architect'
  },
  {
    id: 'app_3',
    company: 'Linear',
    role: 'Frontend Infrastructure Specialist',
    matchScore: 84,
    status: 'Screening',
    dateApplied: '2026-09-28',
    salaryTarget: '$170,000',
    notes: 'Recruiter phone screening call next Tuesday'
  },
  {
    id: 'app_4',
    company: 'Anthropic',
    role: 'AI Research Platform Engineer',
    matchScore: 95,
    status: 'Applied',
    dateApplied: '2026-09-29',
    salaryTarget: '$220,000',
    notes: 'Referred by senior researcher'
  }
];

export const ApplicationTracker: React.FC<{
  currentAnalysisMatch?: { role: string; score: number };
}> = ({ currentAnalysisMatch }) => {
  const [applications, setApplications] = useState<ApplicationRecord[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('jobfit_application_tracker');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          // ignore
        }
      }
    }
    return DEFAULT_APPLICATIONS;
  });

  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCompany, setNewCompany] = useState('');
  const [newRole, setNewRole] = useState(currentAnalysisMatch?.role || 'Data Scientist');
  const [newScore, setNewScore] = useState<number>(currentAnalysisMatch?.score || 85);
  const [newStatus, setNewStatus] = useState<AppStatus>('Applied');
  const [newSalary, setNewSalary] = useState('');
  const [newNotes, setNewNotes] = useState('');

  useEffect(() => {
    localStorage.setItem('jobfit_application_tracker', JSON.stringify(applications));
  }, [applications]);

  const handleAdd = () => {
    if (!newCompany.trim()) return;

    const newRecord: ApplicationRecord = {
      id: `app_${Date.now()}`,
      company: newCompany,
      role: newRole,
      matchScore: newScore,
      status: newStatus,
      dateApplied: new Date().toISOString().split('T')[0],
      salaryTarget: newSalary || undefined,
      notes: newNotes || undefined
    };

    setApplications([newRecord, ...applications]);
    setNewCompany('');
    setNewSalary('');
    setNewNotes('');
    setShowAddForm(false);
  };

  const handleStatusChange = (id: string, nextStatus: AppStatus) => {
    setApplications(applications.map(a => a.id === id ? { ...a, status: nextStatus } : a));
  };

  const handleDelete = (id: string) => {
    setApplications(applications.filter(a => a.id !== id));
  };

  // KPIs
  const totalApps = applications.length;
  const avgScore = totalApps > 0 
    ? Math.round(applications.reduce((acc, a) => acc + a.matchScore, 0) / totalApps) 
    : 0;
  const activeInterviews = applications.filter(a => ['Screening', 'Technical', 'Final Round'].includes(a.status)).length;
  const offersCount = applications.filter(a => a.status === 'Offer').length;

  const filteredApps = filterStatus === 'All'
    ? applications
    : applications.filter(a => a.status === filterStatus);

  const getStatusBadge = (status: AppStatus) => {
    switch (status) {
      case 'Offer':
        return 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300';
      case 'Final Round':
      case 'Technical':
        return 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-300';
      case 'Screening':
        return 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-300';
      case 'Applied':
        return 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-300';
      case 'Rejected':
        return 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-300';
      default:
        return 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300';
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-neutral-800 rounded-3xl p-6 sm:p-8 border border-neutral-200 dark:border-neutral-700 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-2.5 border border-blue-200 dark:border-blue-800">
              <ClipboardList className="w-3.5 h-3.5" />
              <span>Job Search Pipeline <span className="opacity-70 font-normal">[Application Tracker]</span></span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white">
              Application Tracker
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1 max-w-2xl">
              Keep track of every job you apply to, monitor your match scores, and stay organized through interviews and offers.
            </p>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add New Job Application
          </button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-neutral-100 dark:border-neutral-700">
          <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-700">
            <span className="text-[11px] font-bold text-neutral-400 uppercase">Jobs Applied</span>
            <div className="text-2xl font-black text-neutral-900 dark:text-white mt-0.5">{totalApps}</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-700">
            <span className="text-[11px] font-bold text-neutral-400 uppercase">Average Match Score</span>
            <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-0.5">{avgScore}%</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-700">
            <span className="text-[11px] font-bold text-neutral-400 uppercase">Active Interviews</span>
            <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-0.5">{activeInterviews}</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-700">
            <span className="text-[11px] font-bold text-neutral-400 uppercase">Job Offers</span>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">{offersCount}</div>
          </div>
        </div>
      </div>

      {/* Add Form Drawer */}
      {showAddForm && (
        <div className="bg-white dark:bg-neutral-800 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-700 shadow-xs space-y-4">
          <h3 className="font-bold text-neutral-900 dark:text-white text-sm flex items-center">
            <Building2 className="w-4 h-4 mr-2 text-blue-600" />
            Add Application to Pipeline
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-neutral-500 block mb-1">Company</label>
              <input
                type="text"
                placeholder="e.g. Google, Netflix"
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-neutral-500 block mb-1">Role Title</label>
              <input
                type="text"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-neutral-500 block mb-1">Match Score %</label>
              <input
                type="number"
                min={0}
                max={100}
                value={newScore}
                onChange={(e) => setNewScore(parseInt(e.target.value) || 0)}
                className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-neutral-500 block mb-1">Initial Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as AppStatus)}
                className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white"
              >
                {(['Saved', 'Applied', 'Screening', 'Technical', 'Final Round', 'Offer', 'Rejected'] as AppStatus[]).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-neutral-500 block mb-1">Target Compensation (Optional)</label>
              <input
                type="text"
                placeholder="e.g. $185,000"
                value={newSalary}
                onChange={(e) => setNewSalary(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-neutral-500 block mb-1">Interview Notes (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Referral from Jane, prep STAR stories"
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={!newCompany.trim()}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold disabled:opacity-50"
            >
              Save Application
            </button>
          </div>
        </div>
      )}

      {/* Applications Table */}
      <div className="bg-white dark:bg-neutral-800 rounded-3xl border border-neutral-200 dark:border-neutral-700 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="font-bold text-neutral-900 dark:text-white text-base">
            Application Pipeline
          </h3>

          <div className="flex flex-wrap gap-1 text-xs">
            {['All', 'Applied', 'Screening', 'Technical', 'Final Round', 'Offer', 'Rejected'].map(st => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  filterStatus === st 
                    ? 'bg-blue-600 text-white shadow-xs' 
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-900/60 border-b border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Company & Role</th>
                <th className="py-3.5 px-4">Match Score</th>
                <th className="py-3.5 px-4">Status Stage</th>
                <th className="py-3.5 px-4">Applied Date</th>
                <th className="py-3.5 px-4">Notes</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700/60">
              {filteredApps.map((app) => (
                <tr key={app.id} className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="font-bold text-neutral-900 dark:text-white text-sm">
                      {app.company}
                    </div>
                    <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                      {app.role} {app.salaryTarget && `• ${app.salaryTarget}`}
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md font-bold text-xs ${
                      app.matchScore >= 85 
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300' 
                        : 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300'
                    }`}>
                      {app.matchScore}% Match
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app.id, e.target.value as AppStatus)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${getStatusBadge(app.status)}`}
                    >
                      {(['Saved', 'Applied', 'Screening', 'Technical', 'Final Round', 'Offer', 'Rejected'] as AppStatus[]).map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>

                  <td className="py-4 px-4 text-neutral-500 dark:text-neutral-400">
                    {app.dateApplied}
                  </td>

                  <td className="py-4 px-4 text-neutral-600 dark:text-neutral-300 max-w-xs truncate">
                    {app.notes || '—'}
                  </td>

                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => handleDelete(app.id)}
                      className="p-1.5 text-neutral-400 hover:text-rose-500 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                      title="Delete Application"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
