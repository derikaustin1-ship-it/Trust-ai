import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { SpecialistAgent } from '../types';

import { Users, Bot, CheckCircle2, ShieldAlert, Cpu, Clock } from 'lucide-react';

export const Agents: React.FC = () => {
  const [agents, setAgents] = useState<SpecialistAgent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAgents()
      .then(setAgents)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Specialist Agent Management</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Registered domain specialist agents available for task delegation via policy routing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12 text-slate-400">Loading specialist agents...</div>
        ) : (
          agents.map((a) => (
            <div key={a.name} className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">{a.title}</h3>
                    <span className="text-[10px] font-mono text-slate-400">ID: {a.name}</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 uppercase">
                  Active
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300">{a.description}</p>

              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Capabilities</span>
                <ul className="space-y-1">
                  {a.capabilities.map((cap, i) => (
                    <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span>{cap}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-2 text-center text-xs font-mono">
                <div className="bg-slate-50 dark:bg-slate-950 p-2 rounded-xl">
                  <span className="text-[10px] text-slate-400 block font-sans">Executions</span>
                  <span className="font-bold text-slate-800 dark:text-white">{a.total_executions}</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950 p-2 rounded-xl">
                  <span className="text-[10px] text-slate-400 block font-sans">Success Rate</span>
                  <span className="font-bold text-emerald-600">
                    {a.total_executions > 0 ? Math.round((a.success_count / a.total_executions) * 100) : 100}%
                  </span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950 p-2 rounded-xl">
                  <span className="text-[10px] text-slate-400 block font-sans">Avg Latency</span>
                  <span className="font-bold text-slate-800 dark:text-white">{a.avg_duration_ms} ms</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
