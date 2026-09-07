import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { apiClient } from '../api/client';
import type { User } from '../types';
import {
  User as UserIcon,
  Phone,
  MapPin,
  Link2,
  Globe,
  GraduationCap,
  Briefcase,
  Code2,
  Rocket,
  BookOpen,
  Save,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';

function SkeletonField() {
  return (
    <div>
      <div className="skeleton h-3.5 w-20 mb-2" />
      <div className="skeleton h-9 w-full" />
    </div>
  );
}

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function Section({ title, icon, children }: SectionProps) {
  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
        <div className="text-blue-600">{icon}</div>
        <h2 className="section-title">{title}</h2>
      </div>
      <div className="px-5 py-5 space-y-4">{children}</div>
    </div>
  );
}

export function Profile() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Partial<User>>({});
  const [hasChanges, setHasChanges] = useState(false);

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
      setHasChanges(false);
    }
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: async (updatedData: Partial<User>) => {
      const res = await apiClient.put('/api/profile', updatedData);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['profile'], data);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Profile saved successfully!');
      setHasChanges(false);
    },
    onError: () => {
      toast.error('Failed to save profile. Please try again.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const set = (field: keyof User) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    setHasChanges(true);
  };

  const profileCompletion = () => {
    const fields: (keyof User)[] = [
      'name', 'phone', 'location', 'professional_summary',
      'skills', 'experience', 'education', 'projects',
      'linkedin_url',
    ];
    const filled = fields.filter((f) => formData[f]);
    return Math.round((filled.length / fields.length) * 100);
  };

  const completion = profileCompletion();

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-5">
        <div className="skeleton h-8 w-48" />
        <div className="card p-5 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonField key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <UserIcon className="w-6 h-6 text-blue-600" />
            Candidate Profile
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            This information is used by the AI to generate tailored cover letters and follow-up emails
          </p>
        </div>

        {hasChanges && (
          <div className="flex items-center gap-2 text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 text-sm">
            <AlertCircle className="w-3.5 h-3.5" />
            Unsaved changes
          </div>
        )}
      </div>

      {/* Completion Bar */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700">Profile Completeness</span>
          <span className={`text-sm font-bold ${completion >= 80 ? 'text-emerald-600' : completion >= 50 ? 'text-blue-600' : 'text-amber-600'}`}>
            {completion}%
          </span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              completion >= 80 ? 'bg-emerald-500' : completion >= 50 ? 'bg-blue-500' : 'bg-amber-400'
            }`}
            style={{ width: `${completion}%` }}
          />
        </div>
        {completion < 80 && (
          <p className="text-xs text-slate-400 mt-2">
            A complete profile produces significantly better AI-generated content.
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Personal Info */}
        <Section title="Personal Information" icon={<UserIcon className="w-4 h-4" />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="input-group">
              <label className="input-label">Full Name</label>
              <input className="input" type="text" value={formData.name || ''} onChange={set('name')} placeholder="Jane Doe" />
            </div>
            <div className="input-group">
              <label className="input-label">Email (cannot change)</label>
            <input className="input" type="email" disabled value={formData.email || ''} style={{ backgroundColor: '#f8fafc', color: '#94a3b8', cursor: 'not-allowed' }} />
            </div>
            <div className="input-group">
              <label className="input-label flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />Phone</label>
              <input className="input" type="tel" value={formData.phone || ''} onChange={set('phone')} placeholder="+1 (555) 000-0000" />
            </div>
            <div className="input-group">
              <label className="input-label flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />Location</label>
              <input className="input" type="text" value={formData.location || ''} onChange={set('location')} placeholder="San Francisco, CA" />
            </div>
          </div>

          {/* Social Links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="input-group">
              <label className="input-label flex items-center gap-1.5"><Link2 className="w-3.5 h-3.5 text-blue-600" />LinkedIn URL</label>
              <input className="input" type="url" value={formData.linkedin_url || ''} onChange={set('linkedin_url')} placeholder="https://linkedin.com/in/..." />
            </div>
            <div className="input-group">
              <label className="input-label flex items-center gap-1.5"><Code2 className="w-3.5 h-3.5" />GitHub URL</label>
              <input className="input" type="url" value={formData.github_url || ''} onChange={set('github_url')} placeholder="https://github.com/..." />
            </div>
            <div className="input-group">
              <label className="input-label flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-emerald-600" />Portfolio URL</label>
              <input className="input" type="url" value={formData.portfolio_url || ''} onChange={set('portfolio_url')} placeholder="https://yourportfolio.com" />
            </div>
          </div>
        </Section>

        {/* Professional Summary */}
        <Section title="Professional Summary" icon={<Rocket className="w-4 h-4" />}>
          <div className="input-group">
            <label className="input-label">Summary</label>
            <textarea
              className="input"
              rows={4}
              value={formData.professional_summary || ''}
              onChange={set('professional_summary')}
              placeholder="A brief 2-3 sentence summary of your professional background, key skills, and career goals..."
            />
          </div>
        </Section>

        {/* Skills */}
        <Section title="Skills" icon={<Code2 className="w-4 h-4" />}>
          <div className="input-group">
            <label className="input-label">Skills</label>
            <textarea
              className="input"
              rows={3}
              value={formData.skills || ''}
              onChange={set('skills')}
              placeholder="Python, React, TypeScript, PostgreSQL, Docker, AWS..."
            />
            <p className="text-xs text-slate-400 mt-1">Comma-separated list or natural language description</p>
          </div>
        </Section>

        {/* Experience */}
        <Section title="Work Experience" icon={<Briefcase className="w-4 h-4" />}>
          <div className="input-group">
            <label className="input-label">Experience / Job History</label>
            <textarea
              className="input"
              rows={6}
              value={formData.experience || ''}
              onChange={set('experience')}
              placeholder={`Senior Software Engineer at TechCorp (2021–Present)\n- Led development of microservices architecture serving 1M+ users\n- Mentored team of 5 junior developers\n\nSoftware Developer at StartupXYZ (2019–2021)\n- Built React frontend from scratch...`}
            />
            <p className="text-xs text-slate-400 mt-1">Include company, role, dates, and key achievements. The AI uses this to match your background to job descriptions.</p>
          </div>
        </Section>

        {/* Education */}
        <Section title="Education" icon={<GraduationCap className="w-4 h-4" />}>
          <div className="input-group">
            <label className="input-label">Education</label>
            <textarea
              className="input"
              rows={3}
              value={formData.education || ''}
              onChange={set('education')}
              placeholder={`BS Computer Science, State University (2019)\nRelevant coursework: Algorithms, Distributed Systems, Machine Learning`}
            />
          </div>
        </Section>

        {/* Projects */}
        <Section title="Projects" icon={<BookOpen className="w-4 h-4" />}>
          <div className="input-group">
            <label className="input-label">Notable Projects</label>
            <textarea
              className="input"
              rows={4}
              value={formData.projects || ''}
              onChange={set('projects')}
              placeholder={`OpenSource Tool (github.com/you/tool)\nA CLI tool for automating deployment pipelines. 500+ GitHub stars, used in production at 3 companies.\n\nPersonal Portfolio\nBuilt with Next.js and deployed on Vercel.`}
            />
            <p className="text-xs text-slate-400 mt-1">Include links if available. The AI references these when writing cover letters.</p>
          </div>
        </Section>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-2 pb-6">
          <p className="text-xs text-slate-400">
            Profile is used locally for AI generation. No data is shared externally.
          </p>
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="btn btn-primary"
          >
            {updateMutation.isPending ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Profile
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
