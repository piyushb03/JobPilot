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
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${app.current_status === 'Applied' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${app.current_status === 'Interview' ? 'bg-purple-100 text-purple-800' : ''}
                        ${app.current_status === 'Offer' ? 'bg-green-100 text-green-800' : ''}
                        ${app.current_status === 'Reject' ? 'bg-red-100 text-red-800' : ''}
                      `}>
                        {app.current_status}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        {app.job.company}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <Calendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      <p>
                        Applied on {new Date(app.application_date).toLocaleDateString()}
                      </p>
                      <ChevronRight className="ml-2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
          {apps.length === 0 && (
            <li className="px-4 py-8 text-center text-sm text-gray-500">
              No applications tracked yet. Add a job and apply!
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
