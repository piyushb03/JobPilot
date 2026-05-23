import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { Application } from '../types';
import { BarChart, Clock, FileText, CheckCircle, XCircle } from 'lucide-react';

export function Dashboard() {
  const { data: apps = [], isLoading } = useQuery<Application[]>({
    queryKey: ['applications'],
    queryFn: async () => {
      const res = await apiClient.get('/api/applications');
      return res.data;
    },
  });

  if (isLoading) return <div className="p-8">Loading dashboard...</div>;

  const stats = {
    total: apps.length,
    applied: apps.filter(a => a.current_status === 'Applied').length,
    interview: apps.filter(a => a.current_status === 'Interview').length,
    offer: apps.filter(a => a.current_status === 'Offer').length,
    reject: apps.filter(a => a.current_status === 'Reject').length,
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Total Apps" value={stats.total} icon={<FileText className="text-blue-500" />} />
        <StatCard title="Applied" value={stats.applied} icon={<Clock className="text-yellow-500" />} />
        <StatCard title="Interviews" value={stats.interview} icon={<BarChart className="text-purple-500" />} />
        <StatCard title="Offers" value={stats.offer} icon={<CheckCircle className="text-green-500" />} />
        <StatCard title="Rejections" value={stats.reject} icon={<XCircle className="text-red-500" />} />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Applications</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {apps.slice(0, 5).map(app => (
                <tr key={app.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{app.job.company}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.job.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${app.current_status === 'Applied' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${app.current_status === 'Interview' ? 'bg-purple-100 text-purple-800' : ''}
                      ${app.current_status === 'Offer' ? 'bg-green-100 text-green-800' : ''}
                      ${app.current_status === 'Reject' ? 'bg-red-100 text-red-800' : ''}
                      ${app.current_status === 'Withdrawn' ? 'bg-gray-100 text-gray-800' : ''}
                    `}>
                      {app.current_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(app.application_date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {apps.length === 0 && (
