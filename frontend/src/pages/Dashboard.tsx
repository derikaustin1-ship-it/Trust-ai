import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import type { DashboardSummary } from '../types';

import { ConfidenceBadge, RiskBadge, RoutingDecisionBadge } from '../components/common/Badges';
import {
  MessageSquare, ShieldCheck, HelpCircle, UserCheck, Clock, AlertTriangle, Sparkles, Scale, RefreshCw, BarChart2
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    api.getDashboardSummary()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading || !data) {
    return (
      <div className="p-8 space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>)}
        </div>
      </div>
    );
  }

  const confidenceChartData = Object.entries(data.confidence_distribution).map(([name, value]) => ({ name, value }));
  const routingChartData = Object.entries(data.routing_distribution).map(([name, value]) => ({ name, value }));

  const COLORS = ['#6366F1', '#14B8A6', '#F59E0B', '#8B5CF6', '#EF4444', '#64748B'];

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Trust Observability Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Empirical confidence metrics, verification pass rates, and smart routing outcomes.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/assistant')}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md shadow-indigo-600/30 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>New Assistant Session</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl space-y-2 border-l-4 border-indigo-500">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Decisions</span>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">{data.total_requests}</div>
          <span className="text-[11px] text-slate-500">Processed by trust engine</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl space-y-2 border-l-4 border-teal-500">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Verification Pass Rate</span>
          <div className="text-3xl font-extrabold text-teal-600 dark:text-teal-400 font-mono">{data.verification_pass_rate}%</div>
          <span className="text-[11px] text-slate-500">{data.verified_count} verified requests</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl space-y-2 border-l-4 border-amber-500">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Clarifications & Escalations</span>
          <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 font-mono">
            {data.clarification_count + data.escalated_count}
          </div>
          <span className="text-[11px] text-slate-500">{data.escalated_count} escalated to human review</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl space-y-2 border-l-4 border-violet-500">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Avg Processing Latency</span>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">{data.avg_processing_time_ms} ms</div>
          <span className="text-[11px] text-slate-500">Multi-stage pipeline runtime</span>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Confidence Score Distribution */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-2">Confidence Score Distribution</h3>
          <p className="text-xs text-slate-500 mb-4">Breakdown of estimated score ranges across all requests</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={confidenceChartData}>
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', color: '#fff', borderRadius: '8px' }} />
                <Bar dataKey="value" fill="#6366F1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Routing Actions Distribution */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-2">Policy Routing Action Outcomes</h3>
          <p className="text-xs text-slate-500 mb-4">Distribution of Answer, Verify, Clarify, Specialist, Escalate, and Decline routes</p>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={routingChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {routingChartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', color: '#fff', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Recent Decisions Log</h3>
          <button onClick={() => navigate('/decisions')} className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
            View All Audit Logs →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase text-[10px] tracking-wider rounded-lg">
              <tr>
                <th className="p-3">Decision ID</th>
                <th className="p-3">Category</th>
                <th className="p-3">Estimated Confidence</th>
                <th className="p-3">Risk Level</th>
                <th className="p-3">Routing Action</th>
                <th className="p-3">Latency</th>
                <th className="p-3">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {data.recent_decisions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-slate-400">No decisions recorded yet. Start a session in the AI Assistant!</td>
                </tr>
              ) : (
                data.recent_decisions.map((dec) => (
                  <tr key={dec.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-3 font-mono text-[11px] text-indigo-600 dark:text-indigo-400">{dec.id.substring(0, 8)}...</td>
                    <td className="p-3 capitalize font-semibold">{dec.task_category}</td>
                    <td className="p-3"><ConfidenceBadge score={dec.estimated_confidence} label={dec.confidence_label} /></td>
                    <td className="p-3"><RiskBadge level={dec.risk_level} /></td>
                    <td className="p-3"><RoutingDecisionBadge action={dec.routing_action} /></td>
                    <td className="p-3 font-mono">{dec.processing_time_ms} ms</td>
                    <td className="p-3 text-slate-400">{new Date(dec.created_at).toLocaleTimeString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
