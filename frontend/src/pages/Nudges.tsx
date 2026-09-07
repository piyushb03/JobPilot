import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { apiClient } from '../api/client';
import type { Nudge } from '../types';
import { Bell, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

function SkeletonNudge() {
  return (
    <div className="p-4 border-b border-slate-100 last:border-0">
      <div className="skeleton h-4 w-3/4 mb-2" />
      <div className="skeleton h-3 w-1/3" />
    </div>
  );
}

interface NudgeItemProps {
  nudge: Nudge;
  isPending: boolean;
  onComplete: (id: string) => void;
  isCompleting: boolean;
}

function NudgeItem({ nudge, isPending, onComplete, isCompleting }: NudgeItemProps) {
  return (
    <li className={`p-4 sm:px-6 transition-all ${!isPending ? 'opacity-60' : ''}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
            isPending ? 'bg-amber-100' : 'bg-emerald-100'
          }`}>
            {isPending ? (
              <Bell className="w-4 h-4 text-amber-600" />
            ) : (
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className={`text-sm font-medium ${isPending ? 'text-slate-900' : 'text-slate-500 line-through'}`}>
              {nudge.message}
            </p>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-400">
              <Clock className="w-3 h-3" />
              {formatDistanceToNow(new Date(nudge.created_at), { addSuffix: true })}
            </div>
          </div>
        </div>

        {isPending && (
          <div className="flex gap-2 flex-shrink-0">
            <Link
              to={`/applications/${nudge.application_id}`}
              className="btn btn-secondary btn-sm"
            >
              View App
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={() => onComplete(nudge.id)}
              disabled={isCompleting}
              className="btn btn-sm bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {isCompleting ? (
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <CheckCircle className="w-3.5 h-3.5" />
              )}
              Done
            </button>
          </div>
        )}
      </div>
    </li>
  );
}

export function Nudges() {
  const queryClient = useQueryClient();
  const [completingId, setCompletingId] = useState<string | null>(null);

  const { data: nudges = [], isLoading } = useQuery<Nudge[]>({
    queryKey: ['nudges'],
    queryFn: async () => {
      const res = await apiClient.get('/api/nudges');
      return res.data;
    },
  });

  const completeMutation = useMutation({
    mutationFn: async (id: string) => {
      setCompletingId(id);
      await apiClient.post(`/api/nudges/${id}/complete`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nudges'] });
      toast.success('Nudge marked as done!');
      setCompletingId(null);
    },
    onError: () => {
      toast.error('Failed to complete nudge.');
      setCompletingId(null);
    },
  });

  const pendingNudges = nudges.filter((n) => n.status === 'pending');
  const completedNudges = nudges.filter((n) => n.status === 'completed');

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="page-title flex items-center gap-2">
          <Bell className="w-6 h-6 text-amber-500" />
          Smart Nudges
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Automatic reminders to keep your job search moving forward
        </p>
      </div>

      {/* Summary */}
      {!isLoading && nudges.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          <div className="card p-4 flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center">
              <Bell className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{pendingNudges.length}</p>
              <p className="text-xs text-slate-500">Pending</p>
            </div>
          </div>
          <div className="card p-4 flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{completedNudges.length}</p>
              <p className="text-xs text-slate-500">Completed</p>
            </div>
          </div>
        </div>
      )}

      {/* Pending Nudges */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
          <Bell className="w-4 h-4 text-amber-500" />
          <h2 className="section-title">Pending Reminders</h2>
          {pendingNudges.length > 0 && (
            <span className="ml-auto text-xs font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
              {pendingNudges.length}
            </span>
          )}
        </div>

        {isLoading ? (
          <ul>{Array.from({ length: 3 }).map((_, i) => <SkeletonNudge key={i} />)}</ul>
        ) : pendingNudges.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-6">
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mb-3">
              <CheckCircle className="w-6 h-6 text-emerald-500" />
            </div>
            <p className="font-medium text-slate-700 mb-1">All caught up!</p>
            <p className="text-sm text-slate-400">No pending reminders right now. Keep tracking your applications.</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {pendingNudges.map((nudge) => (
              <NudgeItem
                key={nudge.id}
                nudge={nudge}
                isPending={true}
                onComplete={(id) => completeMutation.mutate(id)}
                isCompleting={completingId === nudge.id}
              />
            ))}
          </ul>
        )}
      </div>

      {/* Completed Nudges */}
      {completedNudges.length > 0 && (
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <h2 className="section-title">Completed</h2>
            <span className="ml-auto text-xs font-semibold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
              {completedNudges.length}
            </span>
          </div>
          <ul className="divide-y divide-slate-50">
            {completedNudges.map((nudge) => (
              <NudgeItem
                key={nudge.id}
                nudge={nudge}
                isPending={false}
                onComplete={() => {}}
                isCompleting={false}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
