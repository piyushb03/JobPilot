import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { Application, ApplicationHistory, Draft } from '../types';
import { FileText, Mail, Save, PenTool, CheckCircle, RefreshCw } from 'lucide-react';

export function ApplicationDetail() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);
  const [newStatus, setNewStatus] = useState('Interview');
  const [statusNote, setStatusNote] = useState('');

  const [activeDraft, setActiveDraft] = useState<Draft | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: app, isLoading } = useQuery<Application>({
    queryKey: ['applications', id],
    queryFn: async () => {
      const res = await apiClient.get(`/api/applications/${id}`);
      return res.data;
    },
  });

  const { data: history = [] } = useQuery<ApplicationHistory[]>({
    queryKey: ['applications', id, 'history'],
    queryFn: async () => {
      const res = await apiClient.get(`/api/applications/${id}/history`);
      return res.data;
    },
  });

  const { data: drafts = [] } = useQuery<Draft[]>({
    queryKey: ['applications', id, 'drafts'],
    queryFn: async () => {
      const res = await apiClient.get(`/api/applications/${id}/drafts`);
      return res.data;
    },
  });

  const statusMutation = useMutation({
    mutationFn: async (data: { status: string, note: string }) => {
      await apiClient.post(`/api/applications/${id}/status`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications', id] });
      queryClient.invalidateQueries({ queryKey: ['applications', id, 'history'] });
      setShowStatusUpdate(false);
    }
  });

  const generateDraft = async (type: 'cover-letter' | 'follow-up') => {
    setIsGenerating(true);
    try {
      const res = await apiClient.post(`/api/applications/${id}/ai/generate-${type}`);
      queryClient.invalidateQueries({ queryKey: ['applications', id, 'drafts'] });
      setActiveDraft(res.data);
    } catch (err) {
      alert("Failed to generate draft. Are GCP credentials configured?");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    statusMutation.mutate({ status: newStatus, note: statusNote });
  };
