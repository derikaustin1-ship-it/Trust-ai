import React from 'react';
import { ShieldCheck, AlertTriangle, HelpCircle, Bot, UserCheck, XCircle, ShieldAlert } from 'lucide-react';

export const ConfidenceBadge: React.FC<{ score: number; label?: string }> = ({ score, label }) => {
  let bgColor = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800';
  if (score < 50) {
    bgColor = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800';
  } else if (score < 80) {
    bgColor = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800';
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border ${bgColor}`}>
      <span className="font-mono font-bold">{Math.round(score)}/100</span>
      {label && <span className="opacity-80">({label})</span>}
    </span>
  );
};

export const RiskBadge: React.FC<{ level: string }> = ({ level }) => {
  const normalized = level.toLowerCase();
  let style = 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
  let icon = <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />;

  if (normalized === 'critical') {
    style = 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800';
    icon = <ShieldAlert className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />;
  } else if (normalized === 'high') {
    style = 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800';
    icon = <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />;
  } else if (normalized === 'medium') {
    style = 'bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800';
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border ${style}`}>
      {icon}
      <span className="capitalize">{level} Risk</span>
    </span>
  );
};

export const RoutingDecisionBadge: React.FC<{ action: string }> = ({ action }) => {
  const act = action.toLowerCase();
  let style = 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800';
  let icon = <Bot className="w-3.5 h-3.5" />;

  if (act === 'verify') {
    style = 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/50 dark:text-teal-300 dark:border-teal-800';
    icon = <ShieldCheck className="w-3.5 h-3.5" />;
  } else if (act === 'clarify') {
    style = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800';
    icon = <HelpCircle className="w-3.5 h-3.5" />;
  } else if (act === 'specialist') {
    style = 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800';
    icon = <Bot className="w-3.5 h-3.5" />;
  } else if (act === 'escalate') {
    style = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800';
    icon = <UserCheck className="w-3.5 h-3.5" />;
  } else if (act === 'decline') {
    style = 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
    icon = <XCircle className="w-3.5 h-3.5" />;
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md border uppercase tracking-wider ${style}`}>
      {icon}
      <span>{action}</span>
    </span>
  );
};
