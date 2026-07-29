import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../features/auth/context/AuthContext';
import { Database, Sparkles, LogOut, ShieldCheck, BarChart2 } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 glass-header px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo & Title */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-brand-500/30 group-hover:scale-105 transition-transform duration-200">
            <Database className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight text-white">
                DataLens<span className="gradient-text">AI</span>
              </span>
              <Sparkles className="w-4 h-4 text-brand-accent animate-pulse-subtle" />
            </div>
            <p className="text-xs text-slate-400 font-medium">AI-Powered Analytics Platform</p>
          </div>
        </Link>

        {/* User Navigation / Auth Controls */}
        <div className="flex items-center gap-4">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-4">
              <nav className="flex items-center gap-2 mr-2">
                <Link
                  to="/"
                  className="px-3.5 py-1.5 text-sm font-semibold text-slate-300 hover:text-white hover:bg-dark-800 rounded-xl transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/datasets"
                  className="px-3.5 py-1.5 text-sm font-semibold text-white bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/30 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Database className="w-4 h-4 text-brand-400" />
                  <span>Datasets</span>
                </Link>
                <Link
                  to="/explore"
                  className="px-3.5 py-1.5 text-sm font-semibold text-white bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <BarChart2 className="w-4 h-4 text-indigo-400" />
                  <span>Explore & EDA</span>
                </Link>
                <Link
                  to="/ai-insights"
                  className="px-3.5 py-1.5 text-sm font-semibold text-white bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>AI Analyst</span>
                </Link>
              </nav>

              <div className="hidden md:flex items-center gap-2 bg-dark-800/80 border border-slate-700/60 px-3.5 py-1.5 rounded-full">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-slate-300 font-medium">
                  {user.full_name || user.email}
                </span>
              </div>

              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white bg-dark-700 hover:bg-dark-600 border border-slate-700 rounded-xl transition-all duration-200 hover:border-slate-500 shadow-sm"
              >
                <LogOut className="w-4 h-4 text-red-400" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-brand-500/25 transition-all duration-200 hover:scale-[1.02]"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
