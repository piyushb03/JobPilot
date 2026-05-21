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
