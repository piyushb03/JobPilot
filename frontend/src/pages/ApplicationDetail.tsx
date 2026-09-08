import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { apiClient } from '../api/client';
import type { Application, ApplicationHistory, Draft } from '../types';
import {
  FileText,
  PenTool,
  RefreshCw,
  ChevronLeft,
  Clock,
  CheckCircle,
  ExternalLink,
  Sparkles,
  Save,
  SendHorizontal,
  Copy,
  AlertCircle,
  MapPin,
  Briefcase,
  StickyNote,
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import type { ApplicationStatus } from '../types';
import { format, formatDistanceToNow } from 'date-fns';

const STATUS_OPTIONS: ApplicationStatus[] = ['Applied', 'Interview', 'Offer', 'Reject', 'Withdrawn'];

function SkeletonDetail() {
  return (
    <div className="space-y-6">
      <div className="skeleton h-8 w-64" />
      <div className="card p-6">
        <div className="skeleton h-6 w-48 mb-2" />
        <div className="skeleton h-4 w-32 mb-6" />
        <div className="grid grid-cols-2 gap-4">
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-full" />
        </div>
      </div>
    </div>
  );
}

interface StatusUpdateFormProps {
  appId: string;
  currentStatus: ApplicationStatus;
  onClose: () => void;
}

function StatusUpdateForm({ appId, currentStatus, onClose }: StatusUpdateFormProps) {
  const queryClient = useQueryClient();
  const [newStatus, setNewStatus] = useState<ApplicationStatus>(
    currentStatus === 'Withdrawn' ? 'Applied' : currentStatus
  );
  const [note, setNote] = useState('');

  const mutation = useMutation({
    mutationFn: async () => {
      await apiClient.post(`/api/applications/${appId}/status`, { status: newStatus, note: note || undefined });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications', appId] });
      queryClient.invalidateQueries({ queryKey: ['applications', appId, 'history'] });
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      toast.success('Status updated!');
      onClose();
    },
    onError: () => toast.error('Failed to update status.'),
  });

  return (
    <div className="card p-5 border-blue-200 bg-blue-50 space-y-3 animate-slide-up">
      <h4 className="text-sm font-semibold text-blue-900">Update Status</h4>
      <div className="input-group">
        <label className="input-label">New Status</label>
        <select
          className="input"
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value as ApplicationStatus)}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <div className="input-group">
        <label className="input-label">Note (optional)</label>
        <input
          className="input"
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. Got a call from recruiter"
        />
      </div>
      <div className="flex gap-2">
        <button onClick={onClose} className="btn btn-secondary btn-sm flex-1">Cancel</button>
        <button
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
          className="btn btn-primary btn-sm flex-1"
        >
          {mutation.isPending ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            'Save'
          )}
        </button>
      </div>
    </div>
  );
}

interface DraftEditorProps {
  draft: Draft;
  appId: string;
  onClose: () => void;
}

function DraftEditor({ draft, appId, onClose }: DraftEditorProps) {
  const queryClient = useQueryClient();
  const [contents, setContents] = useState(draft.contents);
  const [isSaving, setIsSaving] = useState(false);
  const [isMarkingSent, setIsMarkingSent] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await apiClient.put(`/api/applications/${appId}/drafts/${draft.id}`, { contents });
      queryClient.invalidateQueries({ queryKey: ['applications', appId, 'drafts'] });
      toast.success('Draft saved!');
      onClose();
    } catch {
      toast.error('Failed to save draft.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleMarkSent = async () => {
    setIsMarkingSent(true);
    try {
      await apiClient.post(`/api/applications/${appId}/drafts/${draft.id}/mark-sent`);
      queryClient.invalidateQueries({ queryKey: ['applications', appId, 'drafts'] });
      toast.success('Draft marked as sent!');
      onClose();
    } catch {
      toast.error('Failed to mark as sent.');
    } finally {
      setIsMarkingSent(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(contents);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="card p-5 space-y-3 border-violet-200 bg-violet-50 animate-slide-up">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-violet-900 capitalize">
          {draft.type.replace('_', ' ')} Editor
        </span>
        <div className="flex gap-2">
          <button onClick={handleCopy} className="btn btn-ghost btn-sm text-violet-700 hover:bg-violet-100">
            <Copy className="w-3.5 h-3.5" />
            Copy
          </button>
        </div>
      </div>

      <textarea
        className="w-full h-72 p-3 border border-violet-200 rounded-lg text-sm font-mono bg-white text-slate-800 focus:ring-2 focus:ring-violet-400 focus:border-violet-400 outline-none resize-y"
        value={contents}
        onChange={(e) => setContents(e.target.value)}
      />

      {draft.contents.includes('[⚠️ This is a MOCK') && (
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-xs text-amber-700">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          Mock AI output. Set <code className="bg-amber-100 px-1 rounded">USE_MOCK_AI=false</code> and configure <code className="bg-amber-100 px-1 rounded">GEMINI_API_KEY</code> for real generation.
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button onClick={onClose} className="btn btn-secondary btn-sm">
          Discard
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="btn btn-sm bg-violet-600 text-white hover:bg-violet-700"
        >
          {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          Save Changes
        </button>
        {draft.status !== 'sent' && (
          <button
            onClick={handleMarkSent}
            disabled={isMarkingSent}
            className="btn btn-sm bg-emerald-600 text-white hover:bg-emerald-700"
          >
            {isMarkingSent ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <SendHorizontal className="w-3.5 h-3.5" />}
            Mark as Sent
          </button>
        )}
      </div>
    </div>
  );
}

export function ApplicationDetail() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [showStatusForm, setShowStatusForm] = useState(false);
  const [activeDraftId, setActiveDraftId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: app, isLoading } = useQuery<Application>({
    queryKey: ['applications', id],
    queryFn: async () => {
      const res = await apiClient.get(`/api/applications/${id}`);
      return res.data;
    },
  });

  const { data: history = [] } = useQuery<ApplicationHistory[]>({
    queryKey: ['applications', id, 'history'],
    queryFn: async () => {
      const res = await apiClient.get(`/api/applications/${id}/history`);
      return res.data;
    },
  });

  const { data: drafts = [] } = useQuery<Draft[]>({
    queryKey: ['applications', id, 'drafts'],
    queryFn: async () => {
      const res = await apiClient.get(`/api/applications/${id}/drafts`);
      return res.data;
    },
  });

  const generateCoverLetter = async () => {
    setIsGenerating(true);
    try {
      const res = await apiClient.post(`/api/applications/${id}/ai/generate-cover-letter`);
      queryClient.invalidateQueries({ queryKey: ['applications', id, 'drafts'] });
      setActiveDraftId(res.data.id);
      toast.success('Cover letter generated!');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      toast.error(msg || 'AI generation failed. Check your API configuration.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading || !app) return (
    <div className="max-w-5xl mx-auto">
      <SkeletonDetail />
    </div>
  );

  const activeDraft = drafts.find((d) => d.id === activeDraftId) ?? null;
  const daysSinceApplied = Math.floor(
    (Date.now() - new Date(app.application_date).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Breadcrumb */}
      <button
        onClick={() => navigate('/applications')}
        className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Applications
      </button>

      {/* Header Card */}
      <div className="card p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          {/* Company Avatar */}
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0 shadow-sm">
            {app.job.company[0].toUpperCase()}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-start gap-3 mb-1">
              <h1 className="text-xl font-bold text-slate-900">{app.job.role}</h1>
              <StatusBadge status={app.current_status} />
            </div>
            <p className="text-slate-600 font-medium mb-3">{app.job.company}</p>

            <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-slate-500">
              {app.job.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {app.job.location}
                </span>
              )}
              {app.job.employment_type && (
                <span className="flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5" />
                  {app.job.employment_type}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Applied {format(new Date(app.application_date), 'MMMM d, yyyy')}
                <span className="text-slate-400">({daysSinceApplied}d ago)</span>
              </span>
              {app.job.source_url && (
                <a
                  href={app.job.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
                >
                  View Job Posting
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          <button
            onClick={() => setShowStatusForm(!showStatusForm)}
            className="btn btn-secondary btn-sm flex-shrink-0"
          >
            Update Status
          </button>
        </div>

        {showStatusForm && (
          <div className="mt-5 pt-5 border-t border-slate-100">
            <StatusUpdateForm
              appId={id!}
              currentStatus={app.current_status}
              onClose={() => setShowStatusForm(false)}
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column: Timeline + Notes */}
        <div className="space-y-5">
          {/* Status Timeline */}
          <div className="card p-5">
            <h3 className="section-title mb-4">Status Timeline</h3>
            <div className="space-y-0">
              {history.map((event, idx) => (
                <div key={event.id} className="flex gap-3">
                  {/* Line + dot */}
                  <div className="flex flex-col items-center">
                    <div className="w-7 h-7 rounded-full bg-blue-100 border-2 border-blue-400 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                    {idx < history.length - 1 && (
                      <div className="w-0.5 flex-1 bg-slate-100 my-1" style={{ minHeight: '1.5rem' }} />
                    )}
                  </div>
                  {/* Content */}
                  <div className="pb-4 min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-900">
                      {event.old_status ? (
                        <>{event.old_status} → {event.new_status}</>
                      ) : (
                        <>{event.new_status}</>
                      )}
                    </p>
                    {event.note && (
                      <p className="text-xs text-slate-500 mt-0.5">{event.note}</p>
                    )}
                    <p className="text-xs text-slate-400 mt-1">
                      {formatDistanceToNow(new Date(event.changed_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Job Description */}
          {app.job.description && (
            <div className="card p-5">
              <h3 className="section-title mb-3">Job Description</h3>
              <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                {app.job.description}
              </p>
            </div>
          )}

          {/* Notes */}
          {app.notes && (
            <div className="card p-5">
              <h3 className="section-title mb-3 flex items-center gap-2">
                <StickyNote className="w-4 h-4 text-amber-500" />
                Notes
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">{app.notes}</p>
            </div>
          )}
        </div>

        {/* Right Column: AI + Drafts */}
        <div className="lg:col-span-2 space-y-5">
          {/* AI Assistant */}
          <div className="card p-5">
            <h3 className="section-title mb-1 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-500" />
              AI Assistant
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Generate tailored content using your profile and this job's description.
            </p>

            <div className="flex flex-wrap gap-3 mb-4">
              <button
                id="generate-cover-letter-btn"
                onClick={generateCoverLetter}
                disabled={isGenerating}
                className="btn btn-sm bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-50"
              >
                {isGenerating ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <FileText className="w-3.5 h-3.5" />
                )}
                {isGenerating ? 'Generating...' : 'Generate Cover Letter'}
              </button>
            </div>

            {/* Active Draft Editor */}
            {activeDraft && (
              <DraftEditor
                key={activeDraft.id}
                draft={activeDraft}
                appId={id!}
                onClose={() => setActiveDraftId(null)}
              />
            )}
          </div>

          {/* Saved Drafts */}
          <div className="card p-5">
            <h3 className="section-title mb-4">Saved Drafts ({drafts.length})</h3>

            {drafts.length === 0 ? (
              <div className="text-center py-8">
                <PenTool className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500">No drafts yet. Use the AI Assistant above to generate one.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {drafts.map((draft) => (
                  <div
                    key={draft.id}
                    className={`border rounded-xl p-4 transition-all ${
                      activeDraftId === draft.id
                        ? 'border-violet-300 bg-violet-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-violet-500" />
                        <span className="text-sm font-medium text-slate-800 capitalize">
                          {draft.type.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          draft.status === 'sent'
                            ? 'bg-emerald-100 text-emerald-700'
                            : draft.status === 'archived'
                            ? 'bg-slate-100 text-slate-500'
                            : 'bg-violet-100 text-violet-700'
                        }`}>
                          {draft.status}
                        </span>
                        <span className="text-xs text-slate-400">
                          {formatDistanceToNow(new Date(draft.created_at), { addSuffix: true })}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed bg-slate-50 p-2 rounded-lg">
                      {draft.contents.replace(/\[⚠️.*?\]/g, '').trim()}
                    </p>

                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => setActiveDraftId(activeDraftId === draft.id ? null : draft.id)}
                        className="btn btn-ghost btn-sm text-violet-700 hover:bg-violet-50"
                      >
                        {activeDraftId === draft.id ? 'Close Editor' : 'Edit'}
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(draft.contents);
                          toast.success('Copied to clipboard!');
                        }}
                        className="btn btn-ghost btn-sm"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        Copy
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
