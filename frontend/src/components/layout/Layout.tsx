import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Upload,
  User,
  LogOut,
  Bell,
  Menu,
  Rocket,
} from 'lucide-react';
import { apiClient } from '../../api/client';
import type { Nudge } from '../../types';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Jobs', path: '/jobs', icon: Briefcase },
  { name: 'Applications', path: '/applications', icon: FileText },
  { name: 'Nudges', path: '/nudges', icon: Bell },
  { name: 'Imports', path: '/imports', icon: Upload },
  { name: 'Profile', path: '/profile', icon: User },
];

function SidebarContent({
  pendingNudgeCount,
  onNavClick,
}: {
  pendingNudgeCount: number;
  onNavClick?: () => void;
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-slate-800">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <Rocket className="w-4 h-4 text-white" />
        </div>
        <span className="text-lg font-bold tracking-tight text-white">JobPilot</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={onNavClick}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon
                  className={`w-4 h-4 flex-shrink-0 transition-colors ${
                    isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'
                  }`}
                />
                {item.name}
              </div>
              {item.name === 'Nudges' && pendingNudgeCount > 0 && (
                <span className="text-xs font-semibold bg-amber-400 text-amber-900 rounded-full min-w-5 h-5 flex items-center justify-center px-1.5">
                  {pendingNudgeCount > 9 ? '9+' : pendingNudgeCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Actions */}
      <div className="px-3 py-3 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          Sign Out
        </button>
      </div>
    </div>
  );
}

export function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: nudges = [] } = useQuery<Nudge[]>({
    queryKey: ['nudges'],
    queryFn: async () => {
      const res = await apiClient.get('/api/nudges');
      return res.data;
    },
    refetchInterval: 60000,
  });

  const pendingNudgeCount = nudges.filter((n) => n.status === 'pending').length;

  // Close mobile nav on route change
  const location = useLocation();
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-60 lg:fixed lg:inset-y-0 lg:z-20">
        <SidebarContent pendingNudgeCount={pendingNudgeCount} />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-60 transform transition-transform duration-300 ease-in-out lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent
          pendingNudgeCount={pendingNudgeCount}
          onNavClick={() => setMobileOpen(false)}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 lg:pl-60">
        {/* Mobile Top Bar */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
          <button
            onClick={() => setMobileOpen(true)}
            className="text-slate-300 hover:text-white p-1"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-500 rounded-md flex items-center justify-center">
              <Rocket className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-base font-bold text-white">JobPilot</span>
          </div>
          <div className="w-7" />
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 animate-slide-up">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
