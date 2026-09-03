import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { GraduationCap, Menu, X, LayoutDashboard, ClipboardList, MessageSquare, Info, Settings, Play, LogOut, LogIn, UserCheck } from 'lucide-react';

export default function Navbar({ isDemoMode, toggleDemoMode, hasProfile }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, requiresAuth: true, requiresProfile: true },
    { name: 'Assessment', path: '/assessment', icon: ClipboardList, requiresAuth: true, requiresProfile: false },
    { name: 'AI Coach', path: '/chat', icon: MessageSquare, requiresAuth: true, requiresProfile: false },
    { name: 'About', path: '/about', icon: Info, requiresAuth: false, requiresProfile: false },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 transition-colors">
              <GraduationCap className="h-8 w-8" />
              <span className="font-bold text-xl tracking-tight text-slate-800">
                Future<span className="text-emerald-600">Align</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => {
              if (item.requiresAuth && !user) return null;
              if (item.requiresProfile && !hasProfile) return null;
              
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            {/* Demo Mode Button (only visible if logged in) */}
            {user && (
              <button
                onClick={toggleDemoMode}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider border transition-all ${
                  isDemoMode
                    ? 'bg-amber-50 border-amber-300 text-amber-700 shadow-sm'
                    : 'bg-white border-slate-300 text-slate-500 hover:bg-slate-50'
                }`}
              >
                <Play className={`h-3 w-3 ${isDemoMode ? 'fill-amber-600 text-amber-600 animate-pulse' : ''}`} />
                <span>{isDemoMode ? 'Demo Active' : 'Enable Demo'}</span>
              </button>
            )}

            {user ? (
              <div className="flex items-center space-x-3 border-l border-slate-200 pl-4">
                {hasProfile && (
                  <Link
                    to="/settings"
                    className={`p-2 rounded-full border transition-colors ${
                      isActive('/settings')
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                    title="Profile Settings"
                  >
                    <Settings className="h-4 w-4" />
                  </Link>
                )}
                
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 bg-white hover:bg-rose-50 text-slate-655 hover:text-rose-700 border border-slate-200 hover:border-rose-200 px-3.5 py-2 rounded-lg text-sm font-bold transition-all shadow-sm"
                  title="Log Out"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 border-l border-slate-200 pl-4">
                <Link
                  to="/login"
                  className="text-slate-600 hover:bg-slate-50 hover:text-slate-900 px-3.5 py-2 rounded-lg text-sm font-bold transition-all"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden space-x-2">
            {user && (
              <button
                onClick={toggleDemoMode}
                className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-md text-[10px] font-bold uppercase border ${
                  isDemoMode
                    ? 'bg-amber-50 border-amber-300 text-amber-700'
                    : 'bg-white border-slate-300 text-slate-500'
                }`}
              >
                <Play className="h-3 w-3" />
                <span>{isDemoMode ? 'Demo' : 'Demo'}</span>
              </button>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-800 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-2 pt-2 pb-4 space-y-1 shadow-inner">
          {navItems.map((item) => {
            if (item.requiresAuth && !user) return null;
            if (item.requiresProfile && !hasProfile) return null;
            
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-2 px-3 py-2.5 rounded-md text-base font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
          
          {user ? (
            <div className="pt-4 border-t border-slate-200 mt-4 space-y-2 px-3">
              {hasProfile && (
                <Link
                  to="/settings"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-2 py-2 rounded text-base font-medium ${
                    isActive('/settings') ? 'text-emerald-700' : 'text-slate-600'
                  }`}
                >
                  <Settings className="h-5 w-5" />
                  <span>Settings</span>
                </Link>
              )}
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="w-full text-center bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded-lg text-sm font-bold shadow transition-colors flex items-center justify-center space-x-1.5"
              >
                <LogOut className="h-4.5 w-4.5" />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-slate-200 mt-4 flex flex-col gap-2 px-3">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block text-center border border-slate-300 hover:bg-slate-50 text-slate-700 py-2.5 rounded-lg text-sm font-bold transition-all"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="block text-center bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg text-sm font-bold transition-all shadow"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
