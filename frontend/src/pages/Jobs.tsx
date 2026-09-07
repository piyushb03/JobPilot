import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { apiClient } from '../api/client';
import type { JobPosting } from '../types';
import {
  Plus,
  Building2,
  MapPin,
  Briefcase,
  ExternalLink,
  X,
  Search,
  FileText,
} from 'lucide-react';

function JobCardSkeleton() {
  return (
    <div className="card p-5">
      <div className="skeleton h-5 w-3/4 mb-2" />
      <div className="skeleton h-4 w-1/2 mb-4" />
      <div className="skeleton h-3 w-1/3 mb-2" />
      <div className="skeleton h-3 w-1/4" />
    </div>
  );
}

interface JobModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

function AddJobModal({ onClose, onSuccess }: JobModalProps) {
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    location: '',
    employment_type: 'Full-time',
    description: '',
    source_url: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiClient.post('/api/jobs', formData);
      toast.success('Job added successfully!');
      onSuccess();
      onClose();
    } catch {
      toast.error('Failed to add job. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="section-title">Add Job Posting</h2>
          <button onClick={onClose} className="btn btn-ghost p-1.5 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="input-group">
              <label className="input-label">Company <span className="text-red-500">*</span></label>
              <input className="input" type="text" required value={formData.company} onChange={set('company')} placeholder="e.g. Google" />
            </div>
            <div className="input-group">
              <label className="input-label">Role <span className="text-red-500">*</span></label>
              <input className="input" type="text" required value={formData.role} onChange={set('role')} placeholder="e.g. Software Engineer" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="input-group">
              <label className="input-label">Location</label>
              <input className="input" type="text" value={formData.location} onChange={set('location')} placeholder="e.g. Remote, New York" />
            </div>
            <div className="input-group">
              <label className="input-label">Employment Type</label>
              <select className="input" value={formData.employment_type} onChange={set('employment_type')}>
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Internship</option>
                <option>Freelance</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Job Posting URL</label>
            <input className="input" type="url" value={formData.source_url} onChange={set('source_url')} placeholder="https://..." />
          </div>

          <div className="input-group">
            <label className="input-label">Job Description</label>
            <textarea
              className="input"
              rows={5}
              value={formData.description}
              onChange={set('description')}
              placeholder="Paste the job description here — the AI will use it to generate tailored cover letters..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary flex-1">
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                'Add Job'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface ApplyModalProps {
  job: JobPosting;
  onClose: () => void;
  onSuccess: (appId: string) => void;
}

function ApplyModal({ job, onClose, onSuccess }: ApplyModalProps) {
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await apiClient.post('/api/applications', {
        job_id: job.id,
        notes: notes || undefined,
      });
      toast.success(`Application to ${job.company} created!`);
      onSuccess(res.data.id);
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      toast.error(detail || 'Failed to create application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel max-w-sm" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="section-title">Apply to {job.company}</h2>
          <button onClick={onClose} className="btn btn-ghost p-1.5 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleApply} className="px-6 py-5 space-y-4">
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="font-semibold text-slate-900 text-sm">{job.role}</p>
            <p className="text-slate-500 text-sm">{job.company} · {job.location || 'Remote'}</p>
          </div>

          <div className="input-group">
            <label className="input-label">Notes (optional)</label>
            <textarea
              className="input"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Where did you find this job? Any initial thoughts..."
            />
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="btn btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary flex-1">
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Applying...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  Track Application
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function Jobs() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [applyTarget, setApplyTarget] = useState<JobPosting | null>(null);
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: jobs = [], isLoading } = useQuery<JobPosting[]>({
    queryKey: ['jobs'],
    queryFn: async () => {
      const res = await apiClient.get('/api/jobs');
      return res.data;
    },
  });

  const filtered = jobs.filter(
    (j) =>
      j.company.toLowerCase().includes(search.toLowerCase()) ||
      j.role.toLowerCase().includes(search.toLowerCase()) ||
      (j.location || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-blue-600" />
            Jobs
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">{jobs.length} job{jobs.length !== 1 ? 's' : ''} saved</p>
        </div>
        <button
          id="add-job-btn"
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4" />
          Add Job
        </button>
      </div>

      {/* Search */}
      {jobs.length > 0 && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            className="input pl-9"
            type="text"
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      )}

      {/* Job Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <JobCardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-20 px-6 text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            <Briefcase className="w-7 h-7 text-blue-400" />
          </div>
          {search ? (
            <>
              <p className="text-slate-700 font-medium mb-1">No jobs match "{search}"</p>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium" onClick={() => setSearch('')}>Clear search</button>
            </>
          ) : (
            <>
              <p className="text-slate-700 font-medium mb-1">No jobs added yet</p>
              <p className="text-slate-400 text-sm mb-5">Add job postings to start tracking your applications</p>
              <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
                <Plus className="w-4 h-4" />
                Add your first job
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((job) => (
            <div key={job.id} className="card flex flex-col group hover:-translate-y-0.5 transition-all duration-200">
              <div className="p-5 flex-1">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm">
                    {job.company[0].toUpperCase()}
                  </div>
                  {job.source_url && (
                    <a
                      href={job.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-blue-600 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                      title="View original posting"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>

                <h3 className="font-semibold text-slate-900 leading-snug mb-1 group-hover:text-blue-700 transition-colors">
                  {job.role}
                </h3>
                <p className="text-sm font-medium text-slate-600 mb-3">{job.company}</p>

                <div className="space-y-1.5">
                  {job.location && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                      {job.location}
                    </div>
                  )}
                  {job.employment_type && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
                      {job.employment_type}
                    </div>
                  )}
                </div>

                {job.description && (
                  <p className="mt-3 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>
                )}
              </div>

              <div className="border-t border-slate-100 px-5 py-3 flex items-center justify-between">
                <button
                  id={`apply-btn-${job.id}`}
                  onClick={() => setApplyTarget(job)}
                  className="btn btn-primary btn-sm"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Track Application
                </button>
                <span className="text-xs text-slate-400">
                  {new Date(job.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <AddJobModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => queryClient.invalidateQueries({ queryKey: ['jobs'] })}
        />
      )}

      {applyTarget && (
        <ApplyModal
          job={applyTarget}
          onClose={() => setApplyTarget(null)}
          onSuccess={(appId) => {
            queryClient.invalidateQueries({ queryKey: ['applications'] });
            setApplyTarget(null);
            navigate(`/applications/${appId}`);
          }}
        />
      )}
    </div>
  );
}
