import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Rocket,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  FileText,
  Bell,
  Upload,
  User,
  LayoutDashboard,
  Copy,
  Check,
  Clock,
  Menu,
  X,
  ExternalLink,
  Layers,
} from 'lucide-react';

export function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const sampleCoverLetter = `Dear Hiring Team at Stripe,

I am writing to express my strong interest in the Senior Frontend Engineer position at Stripe. With over 5 years of experience architecting high-performance web applications using React, TypeScript, and modern state architectures, I am confident in my ability to contribute meaningfully to your developer platform.

In my recent work, I led the transition of complex data workflows into intuitive interfaces, cutting customer onboarding latency by 35%. Stripe's standard for developer experience and reliability is an environment where my technical rigor and attention to UI fidelity will deliver immediate impact.

Thank you for your consideration. I look forward to the opportunity to discuss how my experience aligns with your team's upcoming initiatives.

Sincerely,
Jane Doe`;

  const handleCopyCoverLetter = () => {
    navigator.clipboard.writeText(sampleCoverLetter);
    setCopied(true);
    toast.success('Sample cover letter copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* =========================================================================
          A. NAVBAR
          ========================================================================= */}
      <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30 group-hover:scale-105 transition-transform">
              <Rocket className="w-4.5 h-4.5 text-white" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-white">JobPilot</span>
              <span className="text-[10px] font-semibold tracking-wide uppercase px-1.5 py-0.5 rounded-md bg-blue-500/15 text-blue-400 border border-blue-500/20">
                AI Tracker
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#ai-features" className="hover:text-white transition-colors">AI Cover Letters</a>
            <a href="#pipeline" className="hover:text-white transition-colors">Pipeline</a>
          </nav>

          {/* Auth Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              to="/login"
              className="px-3.5 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md shadow-blue-600/25 hover:shadow-blue-600/40 transition-all flex items-center gap-1.5 active:scale-95"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            aria-label="Toggle navigation menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden bg-slate-900/95 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3 animate-fade-in">
            <nav className="flex flex-col space-y-2 text-sm font-medium text-slate-300">
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white"
              >
                How It Works
              </a>
              <a
                href="#ai-features"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white"
              >
                AI Cover Letters
              </a>
              <a
                href="#pipeline"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white"
              >
                Pipeline
              </a>
            </nav>
            <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-sm font-medium text-slate-200 hover:text-white bg-slate-800/80 rounded-lg"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* =========================================================================
          B. HERO SECTION
          ========================================================================= */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
        {/* Background glow & accents */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-blue-600/20 via-blue-500/10 to-transparent blur-3xl opacity-80" />
          <div className="absolute top-1/3 left-10 w-72 h-72 bg-violet-600/10 rounded-full blur-3xl" />
          <div className="absolute top-1/4 right-10 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-500/30 text-blue-300 text-xs font-semibold mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
            <span>Smart Candidate Intelligence Platform</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
            Your Job Search,{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-300 to-indigo-300">
              Organized and AI-Powered.
            </span>
          </h1>

          {/* Supporting Copy */}
          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Track every application, stay on top of follow-ups, and generate tailored cover letters with AI — all from one place.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-7 py-3.5 text-base font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all flex items-center justify-center gap-2 group active:scale-98"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#features"
              className="w-full sm:w-auto px-6 py-3.5 text-base font-medium text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/70 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              Explore Features
            </a>
          </div>

          {/* Visual UI Demonstration / Mockup Container */}
          <div className="mt-14 sm:mt-18 relative max-w-5xl mx-auto">
            {/* Floating Card 1: Interview Scheduled (Top-Left) */}
            <div className="hidden lg:flex items-center gap-3 absolute -top-7 -left-8 z-20 bg-slate-900/90 backdrop-blur-md border border-purple-500/30 rounded-xl p-3.5 shadow-xl shadow-purple-950/40 text-left animate-slide-up">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-purple-300 uppercase tracking-wider">Interview Scheduled</p>
                <p className="text-sm font-medium text-white">Stripe • Tech Screen</p>
                <p className="text-[11px] text-slate-400">This Friday, 2:00 PM</p>
              </div>
            </div>

            {/* Floating Card 2: AI Cover Letter Ready (Top-Right) */}
            <div className="hidden lg:flex items-center gap-3 absolute -top-6 -right-8 z-20 bg-slate-900/90 backdrop-blur-md border border-violet-500/30 rounded-xl p-3.5 shadow-xl shadow-violet-950/40 text-left animate-slide-up">
              <div className="w-10 h-10 rounded-lg bg-violet-500/20 text-violet-400 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-violet-300 uppercase tracking-wider">AI Cover Letter Ready</p>
                <p className="text-sm font-medium text-white">Tailored for Stripe</p>
                <p className="text-[11px] text-slate-400">Grounded in candidate profile</p>
              </div>
            </div>

            {/* Floating Card 3: Follow-up Reminder (Bottom-Left) */}
            <div className="hidden lg:flex items-center gap-3 absolute -bottom-6 -left-6 z-20 bg-slate-900/90 backdrop-blur-md border border-amber-500/30 rounded-xl p-3.5 shadow-xl shadow-amber-950/40 text-left animate-slide-up">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-amber-300 uppercase tracking-wider">Smart Reminder</p>
                <p className="text-sm font-medium text-white">Datadog • 5 Days Inactive</p>
                <p className="text-[11px] text-slate-400">Check in on application status</p>
              </div>
            </div>

            {/* Floating Card 4: Application Added (Bottom-Right) */}
            <div className="hidden lg:flex items-center gap-3 absolute -bottom-5 -right-6 z-20 bg-slate-900/90 backdrop-blur-md border border-emerald-500/30 rounded-xl p-3.5 shadow-xl shadow-emerald-950/40 text-left animate-slide-up">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">Application Added</p>
                <p className="text-sm font-medium text-white">Figma • Staff Engineer</p>
                <p className="text-[11px] text-slate-400">Added to pipeline today</p>
              </div>
            </div>

            {/* Main Application Mockup Shell */}
            <div className="rounded-2xl border border-slate-700/80 bg-slate-900/90 shadow-2xl overflow-hidden backdrop-blur-xl">
              {/* Window Bar */}
              <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-xs font-mono text-slate-400 hidden sm:inline">
                    jobpilot.app/dashboard
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Live Tracker</span>
                </div>
              </div>

              {/* Inside Dashboard Mockup Body */}
              <div className="p-4 sm:p-6 bg-slate-950/60 text-left space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5">
                    <p className="text-xs font-medium text-slate-400">Total Applications</p>
                    <p className="text-2xl font-bold text-white mt-1">24</p>
                    <p className="text-[11px] text-blue-400 mt-0.5">12 active searches</p>
                  </div>
                  <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5">
                    <p className="text-xs font-medium text-slate-400">Interviews</p>
                    <p className="text-2xl font-bold text-purple-400 mt-1">5</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">2 upcoming this week</p>
                  </div>
                  <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5">
                    <p className="text-xs font-medium text-slate-400">Offers</p>
                    <p className="text-2xl font-bold text-emerald-400 mt-1">2</p>
                    <p className="text-[11px] text-emerald-400 mt-0.5">Under evaluation</p>
                  </div>
                  <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5">
                    <p className="text-xs font-medium text-slate-400">Conversion Rate</p>
                    <p className="text-2xl font-bold text-blue-400 mt-1">21%</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">App → Interview</p>
                  </div>
                </div>

                {/* Applications Table Preview */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-200">Recent Applications</h3>
                    <span className="text-xs text-blue-400 font-medium">View All →</span>
                  </div>
                  <div className="divide-y divide-slate-800/80 text-xs sm:text-sm">
                    {/* Row 1 */}
                    <div className="px-4 py-3 flex items-center justify-between gap-3 hover:bg-slate-800/40 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-blue-600/30 text-blue-400 font-bold flex items-center justify-center flex-shrink-0">
                          S
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-white truncate">Senior Frontend Engineer</p>
                          <p className="text-xs text-slate-400">Stripe • San Francisco, CA (Remote)</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/20">
                          Interview
                        </span>
                        <span className="text-xs text-slate-400 hidden sm:inline">2d ago</span>
                      </div>
                    </div>

                    {/* Row 2 */}
                    <div className="px-4 py-3 flex items-center justify-between gap-3 hover:bg-slate-800/40 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-amber-600/30 text-amber-400 font-bold flex items-center justify-center flex-shrink-0">
                          D
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-white truncate">Full Stack Developer</p>
                          <p className="text-xs text-slate-400">Datadog • New York, NY</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/20">
                          Applied
                        </span>
                        <span className="text-xs text-slate-400 hidden sm:inline">5d ago</span>
                      </div>
                    </div>

                    {/* Row 3 */}
                    <div className="px-4 py-3 flex items-center justify-between gap-3 hover:bg-slate-800/40 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-emerald-600/30 text-emerald-400 font-bold flex items-center justify-center flex-shrink-0">
                          L
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-white truncate">Product Engineer</p>
                          <p className="text-xs text-slate-400">Linear • Remote</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
                          Offer
                        </span>
                        <span className="text-xs text-slate-400 hidden sm:inline">1w ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          C. TRUST / VALUE STRIP
          ========================================================================= */}
      <section className="border-y border-slate-800 bg-slate-900/50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Track Applications</p>
                <p className="text-xs text-slate-400">Full lifecycle pipeline</p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 flex-shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">AI-Powered Drafts</p>
                <p className="text-xs text-slate-400">Profile-tailored letters</p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Smart Reminders</p>
                <p className="text-xs text-slate-400">Never miss stale apps</p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Bulk Job Imports</p>
                <p className="text-xs text-slate-400">Fast CSV & JSON ingestion</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          D. FEATURES SECTION
          ========================================================================= */}
      <section id="features" className="py-20 md:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
              Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-4">
              Engineered for Modern Job Seekers
            </h2>
            <p className="text-base sm:text-lg text-slate-400 mt-3">
              Real, working tools built to give you structure, speed, and tailored AI assistance without the clutter.
            </p>
          </div>

          {/* Asymmetric 6-Card Modern Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1: Application Tracking */}
            <div className="bg-slate-900/70 border border-slate-800 hover:border-blue-500/40 rounded-2xl p-6 transition-all duration-200 hover:shadow-xl hover:shadow-blue-950/20 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/15 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Application Tracking</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Track applications seamlessly through their lifecycle: Applied → Interview → Offer → Rejected, complete with status history and personal notes.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs font-medium text-slate-300">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                <span>Multi-stage status history</span>
              </div>
            </div>

            {/* Feature 2: AI Cover Letters */}
            <div className="bg-slate-900/70 border border-slate-800 hover:border-violet-500/40 rounded-2xl p-6 transition-all duration-200 hover:shadow-xl hover:shadow-violet-950/20 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-violet-500/15 border border-violet-500/20 text-violet-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">AI Cover Letters</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Generate tailored, professional cover letters using your actual candidate profile and the specific job description — no hallucinated facts.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs font-medium text-slate-300">
                <span className="w-2 h-2 rounded-full bg-violet-400" />
                <span>Fact-grounded LLM prompts</span>
              </div>
            </div>

            {/* Feature 3: Smart Nudges */}
            <div className="bg-slate-900/70 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-6 transition-all duration-200 hover:shadow-xl hover:shadow-amber-950/20 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Bell className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Smart Nudges</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Automatically surface applications that have been inactive for over 5 days, so you stay prompt and never lose momentum.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs font-medium text-slate-300">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Automated inactivity reminders</span>
              </div>
            </div>

            {/* Feature 4: Bulk Job Import */}
            <div className="bg-slate-900/70 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-6 transition-all duration-200 hover:shadow-xl hover:shadow-emerald-950/20 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Bulk Job Import</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Import job postings in seconds using CSV or JSON datasets, complete with duplicate detection and batch error summaries.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs font-medium text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>CSV / JSON parser & deduplication</span>
              </div>
            </div>

            {/* Feature 5: Candidate Profile */}
            <div className="bg-slate-900/70 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-6 transition-all duration-200 hover:shadow-xl hover:shadow-indigo-950/20 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-indigo-500/15 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <User className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Candidate Profile</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Maintain your skills, experience, and background in one central profile that serves as high-fidelity context for all AI generation.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs font-medium text-slate-300">
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                <span>Structured AI context repository</span>
              </div>
            </div>

            {/* Feature 6: Analytics Dashboard */}
            <div className="bg-slate-900/70 border border-slate-800 hover:border-sky-500/40 rounded-2xl p-6 transition-all duration-200 hover:shadow-xl hover:shadow-sky-950/20 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-sky-500/15 border border-sky-500/20 text-sky-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <LayoutDashboard className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Analytics Dashboard</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Understand your search health through visual conversion rates, pipeline breakdown charts, and active application statuses.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs font-medium text-slate-300">
                <span className="w-2 h-2 rounded-full bg-sky-400" />
                <span>Real-time conversion metrics</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          E. HOW IT WORKS (4-Step Workflow)
          ========================================================================= */}
      <section id="how-it-works" className="py-20 bg-slate-900/40 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
              Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-4">
              How JobPilot Accelerates Your Search
            </h2>
            <p className="text-base sm:text-lg text-slate-400 mt-3">
              A streamlined, disciplined system to manage high-volume applications with high-touch personalization.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Step 1 */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative">
              <span className="text-3xl font-extrabold text-blue-500/30">01</span>
              <h3 className="text-lg font-bold text-white mt-2 mb-1.5">Create your profile</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Add your skills, work experience, and career summary to establish verified grounding for AI.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative">
              <span className="text-3xl font-extrabold text-blue-500/30">02</span>
              <h3 className="text-lg font-bold text-white mt-2 mb-1.5">Add your jobs</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Manually record target opportunities or bulk-import dozens of postings with CSV or JSON.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative">
              <span className="text-3xl font-extrabold text-blue-500/30">03</span>
              <h3 className="text-lg font-bold text-white mt-2 mb-1.5">Track applications</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Organize every application through Applied, Interview, and Offer stages with detailed notes.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative">
              <span className="text-3xl font-extrabold text-blue-500/30">04</span>
              <h3 className="text-lg font-bold text-white mt-2 mb-1.5">Let AI assist you</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Generate tailored cover letters for specific roles and receive smart reminders on stale apps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          F. AI SECTION (Cover Letter Demo)
          ========================================================================= */}
      <section id="ai-features" className="py-20 md:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column: Messaging */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Intelligent Drafting</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                Apply smarter with AI.
              </h2>
              <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
                JobPilot analyzes the target job posting alongside your candidate profile to generate compelling, tailored cover letters designed to highlight relevant achievements.
              </p>

              <div className="mt-6 space-y-3.5 text-sm text-slate-300">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span><strong>Zero Hallucinations:</strong> Grounded strictly in your actual skills and verified experience.</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span><strong>Style Matching:</strong> Learns from your past approved drafts for a consistent voice.</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span><strong>Full Editing Control:</strong> Review, refine, and mark as sent directly within JobPilot.</span>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-500 rounded-xl shadow-md shadow-violet-600/30 transition-all"
                >
                  Generate With JobPilot
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Column: Realistic UI Mockup */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
              {/* Document Header */}
              <div className="px-5 py-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                    AI Generated Draft
                  </span>
                  <span className="text-xs text-slate-400 hidden sm:inline">Target: Stripe • Senior Frontend</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyCoverLetter}
                  className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>

              {/* Document Content */}
              <div className="p-6 bg-slate-950/60 font-mono text-xs sm:text-sm text-slate-300 leading-relaxed max-h-96 overflow-y-auto whitespace-pre-wrap selection:bg-violet-600">
                {sampleCoverLetter}
              </div>

              {/* Document Footer */}
              <div className="px-5 py-3 bg-slate-900/80 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                <span>Word count: 142 words</span>
                <span className="text-emerald-400 flex items-center gap-1 font-sans">
                  <CheckCircle2 className="w-3.5 h-3.5" /> High relevance match
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          G. APPLICATION PIPELINE SECTION
          ========================================================================= */}
      <section id="pipeline" className="py-20 bg-slate-900/40 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
              Structured Progression
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-4">
              Clear Visibility from Application to Offer
            </h2>
            <p className="text-base sm:text-lg text-slate-400 mt-3">
              Keep your job search organized with distinct lifecycle stages and immutable history records.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stage 1: Applied */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative hover:border-amber-500/40 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/20">
                  Applied
                </span>
                <span className="text-xs text-slate-400">Step 1</span>
              </div>
              <h3 className="text-base font-semibold text-white mb-2">Application Ingested</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">
                Track the initial submission date, recruiter contact notes, and posting link. Smart Nudges monitor inactivity.
              </p>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300">
                <p className="font-semibold text-white">Datadog</p>
                <p className="text-slate-400">Full Stack Developer • 5d ago</p>
              </div>
            </div>

            {/* Stage 2: Interview */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative hover:border-purple-500/40 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/20">
                  Interview
                </span>
                <span className="text-xs text-slate-400">Step 2</span>
              </div>
              <h3 className="text-base font-semibold text-white mb-2">Active Interviews</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">
                Log recruiter screenings, technical assessments, and panel interviews with stage transition logs.
              </p>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300">
                <p className="font-semibold text-white">Stripe</p>
                <p className="text-slate-400">Technical Assessment • Tomorrow</p>
              </div>
            </div>

            {/* Stage 3: Offer */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative hover:border-emerald-500/40 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
                  Offer
                </span>
                <span className="text-xs text-slate-400">Step 3</span>
              </div>
              <h3 className="text-base font-semibold text-white mb-2">Offer Stage</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">
                Celebrate offers, document compensation packages, and evaluate competing decisions side by side.
              </p>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300">
                <p className="font-semibold text-white">Linear</p>
                <p className="text-slate-400">Offer Received • Reviewing</p>
              </div>
            </div>
          </div>

          {/* Terminal States Note */}
          <div className="mt-8 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/20">
                Reject / Withdrawn
              </span>
              <p className="text-sm text-slate-400">
                Preserve rejection learnings and withdrawn statuses without cluttering your active focus.
              </p>
            </div>
            <span className="text-xs text-slate-400 font-mono">Immutable audit trail</span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          H. SMART NUDGES SECTION
          ========================================================================= */}
      <section className="py-20 md:py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-950/50 via-slate-900 to-indigo-950/50 border border-blue-500/20 rounded-3xl p-8 sm:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
                  Automated Proactivity
                </span>
                <h2 className="text-3xl font-bold text-white mt-4 leading-tight">
                  Never forget an application again.
                </h2>
                <p className="text-base text-slate-300 mt-3 leading-relaxed">
                  JobPilot constantly scans your pipeline for stagnant applications. When 5 or more days pass without movement on an applied role, an actionable Smart Nudge is scheduled so you take proactive steps.
                </p>
                <div className="mt-6 flex items-center gap-4 text-sm text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Inactivity triggers</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>One-click dismiss & completion</span>
                  </div>
                </div>
              </div>

              {/* Reminder Card UI Preview */}
              <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-6 shadow-xl">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-amber-400">
                        Application Reminder
                      </p>
                      <span className="text-xs text-slate-400">Scheduled</span>
                    </div>
                    <p className="text-sm font-medium text-white mt-1">
                      It's been over 5 days since you applied to TechCorp. Consider checking in on your application status.
                    </p>
                    <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Applied 7 days ago
                    </p>

                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() => toast.success('Smart Nudges help you review stale applications!')}
                        className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
                      >
                        View App
                      </button>
                      <button
                        type="button"
                        onClick={() => toast.success('Nudge marked as done!')}
                        className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        Mark as Done
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          I. FINAL CTA
          ========================================================================= */}
      <section className="py-20 md:py-28 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-b from-slate-900 to-blue-950/60 border border-blue-500/20 rounded-3xl p-10 sm:p-16 shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                Take control of your job search.
              </h2>
              <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-xl mx-auto leading-relaxed">
                Track applications, generate better cover letters, and keep your job search moving forward.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all flex items-center justify-center gap-2 group active:scale-98"
                >
                  Get Started Free
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto px-6 py-3.5 text-base font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-xl transition-all"
                >
                  Sign in to your account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          J. FOOTER
          ========================================================================= */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-12 text-slate-400 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <Rocket className="w-4 h-4" />
            </div>
            <span className="font-bold text-white text-base">JobPilot</span>
            <span className="text-xs text-slate-400">© {new Date().getFullYear()} All rights reserved.</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
            <Link to="/register" className="hover:text-white transition-colors">Get Started</Link>
            <a
              href="https://github.com/piyushb03/JobPilot"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1 font-medium text-slate-300"
            >
              GitHub
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
