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

  if (isLoading || !app) return <div className="p-8">Loading application details...</div>;

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-start">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {app.job.role} at {app.job.company}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Applied on {new Date(app.application_date).toLocaleDateString()}
            </p>
          </div>
          <div>
            <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
              {app.current_status}
            </span>
          </div>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Location</dt>
              <dd className="mt-1 text-sm text-gray-900">{app.job.location || 'Remote'}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Employment Type</dt>
              <dd className="mt-1 text-sm text-gray-900">{app.job.employment_type || 'Full-time'}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Description</dt>
              <dd className="mt-1 text-sm text-gray-900 max-h-48 overflow-y-auto whitespace-pre-wrap">{app.job.description}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline & Actions */}
        <div className="col-span-1 space-y-6">
          <div className="bg-white shadow sm:rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-md font-medium text-gray-900">Status History</h4>
              <button 
                onClick={() => setShowStatusUpdate(!showStatusUpdate)}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Update Status
              </button>
            </div>
            
            {showStatusUpdate && (
              <form onSubmit={handleStatusSubmit} className="mb-6 p-4 border rounded-md bg-gray-50">
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700">New Status</label>
                  <select 
                    value={newStatus} 
                    onChange={e => setNewStatus(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="Applied">Applied</option>
                    <option value="Interview">Interview</option>
                    <option value="Offer">Offer</option>
                    <option value="Reject">Reject</option>
                    <option value="Withdrawn">Withdrawn</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700">Note (optional)</label>
                  <input 
                    type="text" 
                    value={statusNote}
                    onChange={e => setStatusNote(e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border" 
                  />
                </div>
                <button type="submit" className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                  Save Update
                </button>
              </form>
            )}

            <div className="flow-root">
              <ul className="-mb-8">
                {history.map((event, idx) => (
                  <li key={event.id}>
                    <div className="relative pb-8">
                      {idx !== history.length - 1 ? (
                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                            <CheckCircle className="h-5 w-5 text-white" aria-hidden="true" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">
                              Changed to <span className="font-medium text-gray-900">{event.new_status}</span>
                            </p>
                            {event.note && <p className="mt-1 text-sm text-gray-500">{event.note}</p>}
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            <time dateTime={event.changed_at}>{new Date(event.changed_at).toLocaleDateString()}</time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* AI & Drafts */}
        <div className="col-span-2 space-y-6">
          <div className="bg-white shadow sm:rounded-lg p-6">
            <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
              <PenTool className="h-5 w-5 mr-2 text-purple-500" /> AI Assistant
            </h4>
            <div className="flex space-x-4 mb-6">
              <button 
                onClick={() => generateDraft('cover-letter')}
                disabled={isGenerating}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
