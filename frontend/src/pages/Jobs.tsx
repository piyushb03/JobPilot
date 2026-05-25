import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { JobPosting } from '../types';
import { Plus, Building, MapPin, Briefcase } from 'lucide-react';

export function Jobs() {
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();

  const { data: jobs = [], isLoading } = useQuery<JobPosting[]>({
    queryKey: ['jobs'],
    queryFn: async () => {
      const res = await apiClient.get('/api/jobs');
      return res.data;
    },
  });

  const [formData, setFormData] = useState({
    company: '',
    role: '',
    location: '',
    employment_type: '',
    description: ''
  });

  const createMutation = useMutation({
    mutationFn: async (newJob: any) => {
      await apiClient.post('/api/jobs', newJob);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      setShowModal(false);
      setFormData({ company: '', role: '', location: '', employment_type: '', description: '' });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  if (isLoading) return <div className="p-8">Loading jobs...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Jobs</h1>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
        >
          <Plus className="-ml-1 mr-2 h-5 w-5" />
          Add Job
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
            <div className="p-5">
              <h3 className="text-lg font-medium text-gray-900 truncate">{job.role}</h3>
              <div className="mt-1 flex items-center text-sm text-gray-500">
                <Building className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                {job.company}
              </div>
              <div className="mt-1 flex items-center text-sm text-gray-500">
                <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                {job.location || 'Remote'}
              </div>
              <div className="mt-1 flex items-center text-sm text-gray-500">
                <Briefcase className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                {job.employment_type || 'Full-time'}
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
              <button
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
                onClick={() => {
                  // In a real app, this would open a modal to create an application for this job
                  alert("Create application for " + job.company);
                }}
              >
                Apply
              </button>
