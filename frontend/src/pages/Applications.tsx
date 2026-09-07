import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { apiClient } from '../api/client';
import type { Application, ApplicationStatus } from '../types';
import { FileText, Building2, Calendar, ChevronRight, Search, SlidersHorizontal } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { format } from 'date-fns';

const STATUSES: ApplicationStatus[] = ['Applied', 'Interview', 'Offer', 'Reject', 'Withdrawn'];

function SkeletonRow() {
  return (
    <div className="flex items-center justify-between p-4 border-b border-slate-100 last:border-0">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="skeleton w-10 h-10 rounded-xl flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="skeleton h-4 w-48 mb-1.5" />
          <div className="skeleton h-3 w-32" />
        </div>
      </div>
      <div className="flex items-center gap-3 ml-4">
        <div className="skeleton h-5 w-20 rounded-full" />
        <div className="skeleton h-4 w-24 hidden sm:block" />
      </div>
    </div>
  );
}

export function Applications() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'All'>('All');

  const { data: apps = [], isLoading } = useQuery<Application[]>({
    queryKey: ['applications'],
    queryFn: async () => {
      const res = await apiClient.get('/api/applications');
      return res.data;
    },
  });

  const filtered = apps.filter((app) => {
    const matchSearch =
      !search ||
      app.job.company.toLowerCase().includes(search.toLowerCase()) ||
      app.job.role.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || app.current_status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            Applications
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">{apps.length} application{apps.length !== 1 ? 's' : ''} tracked</p>
        </div>
        <Link to="/jobs" className="btn btn-primary btn-sm">
          + Add Job & Apply
        </Link>
      </div>

      {/* Filters */}
      {apps.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              className="input pl-9 w-full"
              type="text"
              placeholder="Search company or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <SlidersHorizontal className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <div className="flex gap-1.5 flex-wrap">
              {(['All', ...STATUSES] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    statusFilter === s
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* List */}
      <div className="card overflow-hidden">
        {isLoading ? (
          <div>{Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-7 h-7 text-blue-400" />
            </div>
            {apps.length === 0 ? (
              <>
                <p className="text-slate-700 font-medium mb-1">No applications yet</p>
                <p className="text-slate-400 text-sm mb-5">
                  Go to Jobs, add a job posting, and click "Track Application"
                </p>
                <Link to="/jobs" className="btn btn-primary">Start tracking</Link>
              </>
            ) : (
              <>
                <p className="text-slate-700 font-medium mb-1">No results found</p>
                <p className="text-slate-400 text-sm">Try adjusting your search or filter</p>
              </>
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((app) => (
              <Link
                key={app.id}
                to={`/applications/${app.id}`}
                className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {/* Company Avatar */}
                  <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {app.job.company[0].toUpperCase()}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900 text-sm truncate group-hover:text-blue-700 transition-colors">
                      {app.job.role}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <Building2 className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{app.job.company}</span>
                      {app.job.location && (
                        <>
                          <span className="text-slate-300">·</span>
                          <span className="truncate hidden sm:block">{app.job.location}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                  <StatusBadge status={app.current_status} size="sm" />
                  <div className="hidden sm:flex items-center gap-1 text-xs text-slate-400">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(app.application_date), 'MMM d')}
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
