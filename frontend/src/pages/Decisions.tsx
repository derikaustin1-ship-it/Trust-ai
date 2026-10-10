import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { Decision } from '../types';

import { ConfidenceBadge, RiskBadge, RoutingDecisionBadge } from '../components/common/Badges';
import { Search, Filter, RefreshCw, Eye, X } from 'lucide-react';

export const Decisions: React.FC = () => {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const [selectedDec, setSelectedDec] = useState<Decision | null>(null);

  const loadDecisions = () => {
    setLoading(true);
    const filters: Record<string, string> = {};
    if (categoryFilter) filters.category = categoryFilter;
    if (actionFilter) filters.routing_action = actionFilter;
    if (riskFilter) filters.risk_level = riskFilter;

    api.getDecisions(filters)
      .then(setDecisions)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadDecisions();
  }, [categoryFilter, actionFilter, riskFilter]);

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Decision Audit Log</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Search and inspect complete audit trails of all trust evaluation decisions.
          </p>
        </div>
        <button
          onClick={loadDecisions}
          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors self-start"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <Filter className="w-4 h-4 text-indigo-500" />
          <span>Filters:</span>
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
        >
          <option value="">All Categories</option>
          <option value="math">Arithmetic Math</option>
          <option value="research">Research</option>
          <option value="programming">Programming</option>
          <option value="financial_action">Financial Action</option>
          <option value="general">General</option>
        </select>

        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
        >
          <option value="">All Actions</option>
          <option value="answer">ANSWER</option>
          <option value="verify">VERIFY</option>
          <option value="clarify">CLARIFY</option>
          <option value="specialist">SPECIALIST</option>
          <option value="escalate">ESCALATE</option>
          <option value="decline">DECLINE</option>
        </select>

        <select
          value={riskFilter}
          onChange={(e) => setRiskFilter(e.target.value)}
          className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
        >
          <option value="">All Risk Levels</option>
          <option value="low">Low Risk</option>
          <option value="medium">Medium Risk</option>
          <option value="high">High Risk</option>
          <option value="critical">Critical Risk</option>
        </select>
      </div>

      {/* Table */}
      <div className="glass-panel rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-500 uppercase text-[10px] tracking-wider">
            <tr>
              <th className="p-4">Decision ID</th>
              <th className="p-4">Category</th>
              <th className="p-4">Confidence</th>
              <th className="p-4">Risk Level</th>
              <th className="p-4">Routing Action</th>
              <th className="p-4">Latency</th>
              <th className="p-4">Date</th>
              <th className="p-4 text-right">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
            {loading ? (
              <tr><td colSpan={8} className="text-center py-8 text-slate-400">Loading audit records...</td></tr>
            ) : decisions.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-8 text-slate-400">No matching decision records found.</td></tr>
            ) : (
              decisions.map((dec) => (
                <tr key={dec.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-mono text-[11px] text-indigo-600 dark:text-indigo-400">{dec.id.substring(0, 8)}...</td>
                  <td className="p-4 font-semibold capitalize">{dec.task_category}</td>
                  <td className="p-4"><ConfidenceBadge score={dec.estimated_confidence} label={dec.confidence_label} /></td>
                  <td className="p-4"><RiskBadge level={dec.risk_level} /></td>
                  <td className="p-4"><RoutingDecisionBadge action={dec.routing_action} /></td>
                  <td className="p-4 font-mono">{dec.processing_time_ms} ms</td>
                  <td className="p-4 text-slate-400">{new Date(dec.created_at).toLocaleString()}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedDec(dec)}
                      className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Detail Drawer */}
      {selectedDec && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Audit Detail for {selectedDec.id}</h3>
              <button onClick={() => setSelectedDec(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">Routing Reason</span>
                <p className="text-slate-600 dark:text-slate-300">{selectedDec.routing_reason}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Task Category</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">{selectedDec.task_category}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Policy Version</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">{selectedDec.policy_version}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
