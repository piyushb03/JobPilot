import { useState, useRef, useCallback } from 'react';
import { apiClient } from '../api/client';
import type { ImportJob } from '../types';
import {
  UploadCloud,
  CheckCircle,
  XCircle,
  FileText,
  AlertTriangle,
  Upload,
  RefreshCw,
} from 'lucide-react';
import toast from 'react-hot-toast';

const SAMPLE_CSV = `id,company,role,description,type,location
job-001,Acme Corp,Software Engineer,"Build scalable microservices",Full-time,Remote
job-002,TechStartup,Product Manager,"Lead product roadmap",Full-time,"San Francisco, CA"
job-003,DataCo,Data Analyst,"Analyze user behavior data",Contract,Remote`;

const SAMPLE_JSON = JSON.stringify([
  { id: "job-001", company: "Acme Corp", role: "Software Engineer", description: "Build scalable microservices" },
  { id: "job-002", company: "TechStartup", role: "Product Manager", description: "Lead product roadmap" }
], null, 2);

export function Imports() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [lastResult, setLastResult] = useState<ImportJob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSampleCSV, setShowSampleCSV] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) {
      if (!dropped.name.endsWith('.csv') && !dropped.name.endsWith('.json')) {
        toast.error('Only .csv and .json files are supported.');
        return;
      }
      setFile(dropped);
      setError(null);
      setLastResult(null);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setError(null);
      setLastResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setError(null);
    setLastResult(null);

    const formData = new FormData();
    formData.append('file', file);

    const toastId = toast.loading(`Importing ${file.name}...`);
    try {
      const res = await apiClient.post('/api/import/jobs', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setLastResult(res.data);
      const result = res.data as ImportJob;
      if (result.records_failed === 0) {
        toast.success(`Import complete! ${result.records_processed} records added.`, { id: toastId });
      } else {
        toast.success(
          `Import done: ${result.records_processed} added, ${result.records_failed} failed.`,
          { id: toastId }
        );
      }
      setFile(null);
      if (inputRef.current) inputRef.current.value = '';
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setError(detail || 'Import failed. Please check your file format.');
      toast.error('Import failed.', { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="page-title flex items-center gap-2">
          <Upload className="w-6 h-6 text-blue-600" />
          Import Jobs
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Bulk-import job postings from a CSV or JSON file
        </p>
      </div>

      {/* Upload Card */}
      <div className="card overflow-hidden">
        <div className="p-5 sm:p-6">
          {/* Drop Zone */}
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={`relative border-2 border-dashed rounded-xl transition-all duration-200 ${
              isDragging
                ? 'border-blue-400 bg-blue-50 scale-[1.01]'
                : file
                ? 'border-emerald-400 bg-emerald-50'
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <input
              ref={inputRef}
              id="file-upload"
              type="file"
              accept=".csv,.json"
              className="sr-only"
              onChange={handleFileChange}
            />

            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center px-6 py-12">
              {file ? (
                <>
                  <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                    <FileText className="w-6 h-6 text-emerald-600" />
                  </div>
                  <p className="font-semibold text-slate-900 mb-1">{file.name}</p>
                  <p className="text-sm text-slate-500">{(file.size / 1024).toFixed(1)} KB · Click to change</p>
                </>
              ) : (
                <>
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-all ${
                    isDragging ? 'bg-blue-100 scale-110' : 'bg-slate-100'
                  }`}>
                    <UploadCloud className={`w-6 h-6 transition-colors ${isDragging ? 'text-blue-600' : 'text-slate-400'}`} />
                  </div>
                  <p className="font-medium text-slate-700 mb-1">
                    {isDragging ? 'Drop your file here' : 'Drop your file here, or click to browse'}
                  </p>
                  <p className="text-sm text-slate-400">CSV or JSON · Max 10MB</p>
                </>
              )}
            </label>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-4 flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl p-3.5 text-sm animate-fade-in">
              <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-5 flex justify-end">
            <button
              id="start-import-btn"
              onClick={handleUpload}
              disabled={!file || isUploading}
              className="btn btn-primary disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  Start Import
                </>
              )}
            </button>
          </div>
        </div>

        {/* Result */}
        {lastResult && (
          <div className={`border-t p-5 ${lastResult.records_failed > 0 ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'}`}>
            <div className="flex items-center gap-2 mb-3">
              {lastResult.records_failed > 0 ? (
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              ) : (
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              )}
              <span className={`font-semibold ${lastResult.records_failed > 0 ? 'text-amber-800' : 'text-emerald-800'}`}>
                Import {lastResult.status === 'completed' ? 'Complete' : lastResult.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm mb-3">
              <div className="bg-white rounded-lg p-3 text-center border border-emerald-200">
                <p className="text-2xl font-bold text-emerald-700">{lastResult.records_processed}</p>
                <p className="text-emerald-600 text-xs mt-0.5">Records imported</p>
              </div>
              <div className="bg-white rounded-lg p-3 text-center border border-slate-200">
                <p className={`text-2xl font-bold ${lastResult.records_failed > 0 ? 'text-red-600' : 'text-slate-400'}`}>
                  {lastResult.records_failed}
                </p>
                <p className="text-slate-500 text-xs mt-0.5">Records failed</p>
              </div>
            </div>

            {lastResult.error_summary && (
              <div className="bg-white border border-amber-200 rounded-lg p-3 text-xs text-amber-800 font-mono whitespace-pre-wrap">
                {lastResult.error_summary}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Format Reference */}
      <div className="card p-5">
        <h2 className="section-title mb-4">Required File Format</h2>

        <div className="space-y-3 text-sm text-slate-600 mb-5">
          <div className="grid grid-cols-3 gap-2 bg-slate-50 rounded-lg overflow-hidden border border-slate-200">
            <div className="px-3 py-2 bg-slate-100 font-semibold text-xs text-slate-700 border-b border-slate-200">Field</div>
            <div className="px-3 py-2 bg-slate-100 font-semibold text-xs text-slate-700 border-b border-slate-200">Required?</div>
            <div className="px-3 py-2 bg-slate-100 font-semibold text-xs text-slate-700 border-b border-slate-200">Description</div>
            {[
              ['id', 'Yes', 'Unique identifier (prevents duplicates)'],
              ['company', 'No', 'Company name (defaults to "Unknown")'],
              ['role', 'No', 'Job title (defaults to "Unknown")'],
              ['description', 'No', 'Job description text'],
              ['type', 'No', 'Employment type (Full-time, etc.)'],
              ['location', 'No', 'Office location or Remote'],
            ].map(([field, req, desc]) => (
              <>
                <div key={`f-${field}`} className="px-3 py-2 font-mono text-xs text-blue-700">{field}</div>
                <div key={`r-${field}`} className="px-3 py-2 text-xs">
                  <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${req === 'Yes' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-500'}`}>{req}</span>
                </div>
                <div key={`d-${field}`} className="px-3 py-2 text-xs text-slate-500">{desc}</div>
              </>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setShowSampleCSV(!showSampleCSV)}
          >
            {showSampleCSV ? 'Hide' : 'Show'} Sample CSV
          </button>
          <a
            href={`data:text/csv;charset=utf-8,${encodeURIComponent(SAMPLE_CSV)}`}
            download="sample_jobs.csv"
            className="btn btn-secondary btn-sm"
          >
            Download Sample CSV
          </a>
          <a
            href={`data:application/json;charset=utf-8,${encodeURIComponent(SAMPLE_JSON)}`}
            download="sample_jobs.json"
            className="btn btn-secondary btn-sm"
          >
            Download Sample JSON
          </a>
        </div>

        {showSampleCSV && (
          <pre className="mt-4 bg-slate-900 text-emerald-400 text-xs p-4 rounded-xl overflow-x-auto font-mono leading-relaxed animate-fade-in">
            {SAMPLE_CSV}
          </pre>
        )}
      </div>
    </div>
  );
}
