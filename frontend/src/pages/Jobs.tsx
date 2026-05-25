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
