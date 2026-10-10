import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, ShieldCheck, AlertTriangle, Cpu } from 'lucide-react';

export const Analytics: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAnalyticsOverview()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return <div className="p-8 text-center text-slate-400">Loading analytics dashboard...</div>;
  }

  const riskChartData = Object.entries(data.risk_distribution).map(([name, value]) => ({ name: name.toUpperCase(), value }));
  const actionChartData = Object.entries(data.routing_action_distribution).map(([name, value]) => ({ name: name.toUpperCase(), value }));
  const categoryChartData = Object.entries(data.category_distribution).map(([name, value]) => ({ name, value }));

  const COLORS = ['#6366F1', '#14B8A6', '#F59E0B', '#EF4444', '#8B5CF6', '#64748B'];

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Analytics Laboratory</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Historical distribution analysis across risk levels, policy routing actions, and task categories.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl border-l-4 border-indigo-500">
          <span className="text-xs font-bold text-slate-400 uppercase">Total Decisions Audited</span>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">{data.total_decisions}</div>
        </div>
        <div className="glass-panel p-5 rounded-2xl border-l-4 border-teal-500">
          <span className="text-xs font-bold text-slate-400 uppercase">Active Task Categories</span>
          <div className="text-3xl font-extrabold text-teal-600 font-mono">{Object.keys(data.category_distribution).length}</div>
        </div>
        <div className="glass-panel p-5 rounded-2xl border-l-4 border-rose-500">
          <span className="text-xs font-bold text-slate-400 uppercase">Critical & High Risk Invocations</span>
          <div className="text-3xl font-extrabold text-rose-600 font-mono">
            {data.risk_distribution.high + data.risk_distribution.critical}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Distribution Chart */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-2">Risk Level Classification Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskChartData}>
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', color: '#fff', borderRadius: '8px' }} />
                <Bar dataKey="value" fill="#F59E0B" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Category Breakdown */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-2">Inquiries by Task Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {categoryChartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', color: '#fff', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
