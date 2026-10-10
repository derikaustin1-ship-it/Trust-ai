import React, { useState } from 'react';
import { Sun, Moon, LogOut, User, Shield, Sparkles, HelpCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

export const AppHeader: React.FC = () => {
  const { user, logout, demoLogin } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between shadow-sm sticky top-0 z-30 transition-colors">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-slate-800 dark:text-slate-200">TRUSTIQ AI</span>
          <span>/</span>
          <span className="text-indigo-600 dark:text-indigo-400 font-medium">Confidence & Routing Pipeline</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Quick Demo Assistant Launcher */}
        <button
          onClick={() => navigate('/assistant')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-medium text-xs border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition-colors"
        >
          <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
          <span>Try Demo Scenarios</span>
        </button>

        {/* Theme Switcher */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Toggle Dark Mode"
        >
          {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
        </button>

        {/* Role Switcher for Hackathon Demonstrations */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 transition-colors"
          >
            <Shield className="w-4 h-4 text-indigo-500" />
            <span className="capitalize">{user?.role} Mode</span>
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-2 z-50">
              <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Switch Role Demo</div>
              <button
                onClick={() => { demoLogin('user'); setShowRoleMenu(false); }}
                className="w-full text-left px-4 py-2 text-xs hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
              >
                <span>Standard User</span>
                {user?.role === 'user' && <span className="w-2 h-2 rounded-full bg-indigo-600" />}
              </button>
              <button
                onClick={() => { demoLogin('reviewer'); setShowRoleMenu(false); }}
                className="w-full text-left px-4 py-2 text-xs hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
              >
                <span>Reviewer</span>
                {user?.role === 'reviewer' && <span className="w-2 h-2 rounded-full bg-indigo-600" />}
              </button>
              <button
                onClick={() => { demoLogin('admin'); setShowRoleMenu(false); }}
                className="w-full text-left px-4 py-2 text-xs hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
              >
                <span>Administrator</span>
                {user?.role === 'admin' && <span className="w-2 h-2 rounded-full bg-indigo-600" />}
              </button>
            </div>
          )}
        </div>

        {/* User Account & Logout */}
        <button
          onClick={logout}
          className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
          title="Sign Out"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
