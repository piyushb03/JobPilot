import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Briefcase, FileText, Upload, User, LogOut, Bell } from 'lucide-react';

export function Layout() {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Jobs', path: '/jobs', icon: Briefcase },
    { name: 'Applications', path: '/applications', icon: FileText },
    { name: 'Nudges', path: '/nudges', icon: Bell },
    { name: 'Imports', path: '/imports', icon: Upload },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-primary-dark tracking-tight">JobPilot</h1>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
                             (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.name}
