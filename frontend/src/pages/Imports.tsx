import { useState } from 'react';
import { apiClient } from '../api/client';
import { ImportJob } from '../types';
import { UploadCloud, CheckCircle, XCircle } from 'lucide-react';

export function Imports() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [lastResult, setLastResult] = useState<ImportJob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setError(null);
    setLastResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await apiClient.post('/api/import/jobs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setLastResult(res.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900">Import Jobs</h1>
      <p className="text-sm text-gray-500">Upload a CSV or JSON file containing job opportunities. Required fields: id, company, role. Optional: description, type, location.</p>

      <div className="bg-white shadow sm:rounded-lg p-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <UploadCloud className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <div className="text-sm text-gray-600 mb-4">
            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
