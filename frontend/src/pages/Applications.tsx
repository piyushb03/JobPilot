import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { apiClient } from '../api/client';
import { Application } from '../types';
import { Building, Calendar, ChevronRight } from 'lucide-react';

export function Applications() {
  const { data: apps = [], isLoading } = useQuery<Application[]>({
    queryKey: ['applications'],
    queryFn: async () => {
      const res = await apiClient.get('/api/applications');
      return res.data;
    },
  });

  if (isLoading) return <div className="p-8">Loading applications...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {apps.map((app) => (
            <li key={app.id}>
              <Link to={`/applications/${app.id}`} className="block hover:bg-gray-50">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <Building className="h-6 w-6 text-gray-400" />
                      </div>
                      <p className="text-sm font-medium text-blue-600 truncate">{app.job.role}</p>
