import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { User } from '../types';

export function Profile() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Partial<User>>({});

  const { data: profile, isLoading } = useQuery<User>({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await apiClient.get('/api/profile');
      return res.data;
    },
  });

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: async (updatedData: Partial<User>) => {
      await apiClient.put('/api/profile', updatedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      alert("Profile updated successfully");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  if (isLoading) return <div className="p-8">Loading profile...</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900">Candidate Profile</h1>
      <p className="text-sm text-gray-500">This information is used by the AI to generate tailored cover letters and follow-up emails.</p>

      <form onSubmit={handleSubmit} className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <div className="mt-1">
                <input type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border" />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">Email Address (Cannot change)</label>
              <div className="mt-1">
                <input type="email" disabled value={formData.email || ''} className="bg-gray-100 shadow-sm block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border" />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <div className="mt-1">
                <input type="text" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border" />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <div className="mt-1">
                <input type="text" value={formData.location || ''} onChange={e => setFormData({...formData, location: e.target.value})} className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border" />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label className="block text-sm font-medium text-gray-700">Professional Summary</label>
              <div className="mt-1">
                <textarea rows={3} value={formData.professional_summary || ''} onChange={e => setFormData({...formData, professional_summary: e.target.value})} className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md py-2 px-3" />
              </div>
            </div>
            
            <div className="sm:col-span-6">
              <label className="block text-sm font-medium text-gray-700">Skills (Comma separated or JSON)</label>
              <div className="mt-1">
                <textarea rows={2} value={formData.skills || ''} onChange={e => setFormData({...formData, skills: e.target.value})} className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md py-2 px-3" />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label className="block text-sm font-medium text-gray-700">Experience / Job History</label>
              <div className="mt-1">
                <textarea rows={4} value={formData.experience || ''} onChange={e => setFormData({...formData, experience: e.target.value})} className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md py-2 px-3" />
              </div>
            </div>

          </div>
        </div>
        <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
          <button type="submit" disabled={updateMutation.isPending} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-50">
            {updateMutation.isPending ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}
