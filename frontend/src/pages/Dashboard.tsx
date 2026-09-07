import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { apiClient } from '../api/client';
import type { Application, Nudge } from '../types';
import {
  Briefcase,
  Clock,
  MessageSquare,
  CheckCircle,
  XCircle,
  TrendingUp,
  Bell,
  ArrowRight,
  LayoutDashboard,
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { format } from 'date-fns';

function SkeletonCard() {
  return (
    <div className="card p-5">
      <div className="skeleton h-4 w-24 mb-3" />
      <div className="skeleton h-8 w-12" />
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr>
      <td className="px-4 py-3"><div className="skeleton h-4 w-32" /></td>
      <td className="px-4 py-3"><div className="skeleton h-4 w-40" /></td>
      <td className="px-4 py-3"><div className="skeleton h-5 w-20 rounded-full" /></td>
      <td className="px-4 py-3"><div className="skeleton h-4 w-24" /></td>
    </tr>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  total?: number;
  icon: React.ReactNode;
  color: string;
  barColor: string;
}

function StatCard({ title, value, total, icon, color, barColor }: StatCardProps) {
  const pct = total ? Math.round((value / total) * 100) : 0;
  return (
    <div className="card p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">{title}</span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
          {icon}
        </div>
      </div>
      <div className="text-3xl font-bold text-slate-900">{value}</div>
      {total !== undefined && total > 0 && (
        <div className="space-y-1">
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${barColor}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-xs text-slate-400">{pct}% of total</span>
        </div>
      )}
    </div>
  );
}

export function Dashboard() {
  const { data: apps = [], isLoading: appsLoading } = useQuery<Application[]>({
    queryKey: ['applications'],
    queryFn: async () => {
      const res = await apiClient.get('/api/applications');
      return res.data;
    },
  });

  const { data: nudges = [] } = useQuery<Nudge[]>({
    queryKey: ['nudges'],
    queryFn: async () => {
      const res = await apiClient.get('/api/nudges');
      return res.data;
    },
  });

  const total = apps.length;
  const applied = apps.filter((a) => a.current_status === 'Applied').length;
  const interview = apps.filter((a) => a.current_status === 'Interview').length;
  const offer = apps.filter((a) => a.current_status === 'Offer').length;
  const reject = apps.filter((a) => a.current_status === 'Reject').length;
  const pendingNudges = nudges.filter((n) => n.status === 'pending');
  const recentApps = [...apps].slice(0, 8);

  const conversionRate = total > 0 ? Math.round((interview / total) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-blue-600" />
            Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Overview of your job search progress</p>
        </div>
        <Link to="/applications" className="btn btn-primary btn-sm hidden sm:flex">
          View all
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4">
        {appsLoading ? (
          Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard
              title="Total"
              value={total}
              icon={<Briefcase className="w-4 h-4 text-slate-600" />}
              color="bg-slate-100"
              barColor="bg-slate-400"
            />
            <StatCard
              title="Applied"
              value={applied}
              total={total}
              icon={<Clock className="w-4 h-4 text-amber-600" />}
              color="bg-amber-50"
              barColor="bg-amber-400"
            />
            <StatCard
              title="Interviews"
              value={interview}
              total={total}
              icon={<MessageSquare className="w-4 h-4 text-violet-600" />}
              color="bg-violet-50"
              barColor="bg-violet-500"
            />
            <StatCard
              title="Offers"
              value={offer}
              total={total}
              icon={<CheckCircle className="w-4 h-4 text-emerald-600" />}
              color="bg-emerald-50"
              barColor="bg-emerald-500"
            />
            <StatCard
              title="Rejected"
              value={reject}
              total={total}
              icon={<XCircle className="w-4 h-4 text-red-500" />}
              color="bg-red-50"
              barColor="bg-red-400"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
        {/* Recent Applications */}
        <div className="xl:col-span-2 card overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="section-title">Recent Applications</h2>
            <Link to="/applications" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {appsLoading ? (
            <table className="table">
              <tbody>{Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)}</tbody>
            </table>
          ) : recentApps.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Briefcase className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-slate-600 font-medium mb-1">No applications yet</p>
              <p className="text-slate-400 text-sm mb-4">Add a job and start tracking your applications</p>
              <Link to="/jobs" className="btn btn-primary btn-sm">
                Add your first job
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Applied</th>
                  </tr>
                </thead>
                <tbody>
                  {recentApps.map((app) => (
                    <tr
                      key={app.id}
                      className="cursor-pointer"
                      onClick={() => window.location.href = `/applications/${app.id}`}
                    >
                      <td className="font-medium text-slate-900">{app.job.company}</td>
                      <td className="text-slate-600 max-w-xs truncate">{app.job.role}</td>
                      <td>
                        <StatusBadge status={app.current_status} size="sm" />
                      </td>
                      <td className="text-slate-400">
                        {format(new Date(app.application_date), 'MMM d, yyyy')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Interview Conversion Rate */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <h3 className="section-title text-sm">Interview Rate</h3>
            </div>
            <div className="text-4xl font-bold text-slate-900 mb-2">{conversionRate}%</div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-700"
                style={{ width: `${conversionRate}%` }}
              />
            </div>
            <p className="text-xs text-slate-400">
              {interview} of {total} applications led to interviews
            </p>
          </div>

          {/* Pending Nudges */}
          <div className="card overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-500" />
                <h3 className="section-title text-sm">Pending Nudges</h3>
              </div>
              {pendingNudges.length > 0 && (
                <span className="text-xs font-semibold bg-amber-100 text-amber-700 rounded-full px-2 py-0.5">
                  {pendingNudges.length}
                </span>
              )}
            </div>

            {pendingNudges.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <p className="text-sm text-slate-500">All caught up!</p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-50">
                {pendingNudges.slice(0, 3).map((nudge) => (
                  <li key={nudge.id} className="px-5 py-3">
                    <p className="text-sm text-slate-700 leading-snug line-clamp-2">{nudge.message}</p>
                    <Link
                      to={`/applications/${nudge.application_id}`}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium mt-1 inline-flex items-center gap-0.5"
                    >
                      Take action <ArrowRight className="w-3 h-3" />
                    </Link>
                  </li>
                ))}
                {pendingNudges.length > 3 && (
                  <li className="px-5 py-3">
                    <Link to="/nudges" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      +{pendingNudges.length - 3} more nudges →
                    </Link>
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
