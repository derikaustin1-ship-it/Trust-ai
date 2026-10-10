import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, MessageSquare, History, UserCheck, FlaskConical,
  BarChart3, Users, Settings, BookOpen, ShieldCheck, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AppSidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ collapsed, setCollapsed }) => {
  const { user } = useAuth();

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/assistant', label: 'AI Assistant', icon: MessageSquare },
    { to: '/decisions', label: 'Decision History', icon: History },
    { to: '/reviews', label: 'Human Review Queue', icon: UserCheck, badge: user?.role !== 'user' },
    { to: '/evaluation', label: 'Evaluation Lab', icon: FlaskConical },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/agents', label: 'Specialist Agents', icon: Users },
    { to: '/settings', label: 'Settings', icon: Settings },
    { to: '/docs', label: 'In-App Docs', icon: BookOpen },
  ];

  return (
    <aside className={`bg-slate-900 text-slate-300 flex flex-col transition-all duration-300 border-r border-slate-800 ${collapsed ? 'w-20' : 'w-64'}`}>
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20 shrink-0">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-extrabold text-lg text-white tracking-tight">TRUSTIQ <span className="text-indigo-400">AI</span></span>
              <span className="text-[10px] text-slate-400 tracking-wider uppercase font-semibold">Trust-Aware Agent</span>
            </div>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                }`
              }
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && item.badge && (
                <span className="ml-auto w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Footer info */}
      {!collapsed && user && (
        <div className="p-4 border-t border-slate-800 flex items-center gap-3 bg-slate-950/40">
          <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white uppercase text-sm border border-slate-600">
            {user.display_name.charAt(0)}
          </div>
          <div className="flex flex-col truncate">
            <span className="text-sm font-semibold text-white truncate">{user.display_name}</span>
            <span className="text-xs text-indigo-400 uppercase font-mono">{user.role}</span>
          </div>
        </div>
      )}
    </aside>
  );
};
