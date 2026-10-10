import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { EvaluationDataset, EvaluationRun, EvaluationResult } from '../types';

import { Scale, Play, Download, CheckCircle2, XCircle, Clock, AlertTriangle, RefreshCw, BarChart2 } from 'lucide-react';

export const Evaluation: React.FC = () => {
  const [datasets, setDatasets] = useState<EvaluationDataset[]>([]);
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>('');
  const [runs, setRuns] = useState<EvaluationRun[]>([]);
  const [selectedRun, setSelectedRun] = useState<EvaluationRun | null>(null);
  const [running, setRunning] = useState(false);

  const loadInitialData = async () => {
    try {
      const ds = await api.getEvaluationDatasets();
      setDatasets(ds);
      if (ds.length > 0) setSelectedDatasetId(ds[0].id);

      const rList = await api.getEvaluationRuns();
      setRuns(rList);
      if (rList.length > 0) setSelectedRun(rList[0]);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleStartRun = async () => {
    if (!selectedDatasetId || running) return;
    setRunning(true);
    try {
      const newRun = await api.runEvaluation(selectedDatasetId);
      setRuns([newRun, ...runs]);
      setSelectedRun(newRun);
    } catch (e: any) {
      alert(e.message || 'Evaluation run failed');
    } finally {
      setRunning(false);
    }
  };

  const handleExportCSV = (runId: string) => {
    window.open(`http://localhost:8000/api/v1/evaluation/runs/${runId}/export`, '_blank');
  };

  const baselineResults = selectedRun?.results?.filter(r => r.pipeline_type === 'baseline') || [];
  const trustResults = selectedRun?.results?.filter(r => r.pipeline_type === 'trust_aware') || [];

  const baselineAccuracy = baselineResults.length > 0
    ? Math.round((baselineResults.filter(r => r.measured_correctness).length / baselineResults.length) * 100)
    : 0;

  const trustAccuracy = trustResults.length > 0
    ? Math.round((trustResults.filter(r => r.measured_correctness).length / trustResults.length) * 100)
    : 0;

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Evaluation Laboratory</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Offline benchmark laboratory comparing Baseline AI vs. TRUSTIQ AI confidence-aware pipeline.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedDatasetId}
            onChange={(e) => setSelectedDatasetId(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-white font-semibold"
          >
            {datasets.map(d => (
              <option key={d.id} value={d.id}>{d.name} ({d.case_count} cases)</option>
            ))}
          </select>

          <button
            onClick={handleStartRun}
            disabled={running}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Play className="w-4 h-4" />
            <span>{running ? 'Executing Benchmark...' : 'Run Benchmark Evaluation'}</span>
          </button>
        </div>
      </div>

      {/* Comparison Head-to-Head Card */}
      {selectedRun && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel p-6 rounded-2xl border-l-4 border-rose-500 space-y-3">
            <span className="text-xs font-bold text-rose-500 uppercase tracking-wider">Baseline AI (Unregulated Model)</span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white font-mono">{baselineAccuracy}%</span>
              <span className="text-xs text-slate-400">Appropriate Action Rate</span>
            </div>
            <p className="text-xs text-slate-500">
              Directly outputs first answer candidate without confidence scoring, verification, or risk gating. Hallucinates on ambiguous or high-risk queries.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border-l-4 border-indigo-500 space-y-3">
            <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider">TRUSTIQ AI (Trust-Aware Pipeline)</span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">{trustAccuracy}%</span>
              <span className="text-xs text-slate-400">Appropriate Action Rate</span>
            </div>
            <p className="text-xs text-slate-500">
              Evaluates multi-signal confidence, verifies math expressions, asks clarifying questions, and escalates critical financial/medical risks.
            </p>
          </div>
        </div>
      )}

      {/* Side-by-Side Per-Case Result Breakdown */}
      {selectedRun && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Benchmark Case Comparison Results</h3>
            <button
              onClick={() => handleExportCSV(selectedRun.id)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 flex items-center gap-1.5"
            >
              <Download className="w-4 h-4 text-indigo-500" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">Case ID</th>
                  <th className="p-3">Baseline Action</th>
                  <th className="p-3">TRUSTIQ Action</th>
                  <th className="p-3">TRUSTIQ Confidence</th>
                  <th className="p-3">TRUSTIQ Result</th>
                  <th className="p-3">Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                {trustResults.map((tr, idx) => {
                  const base = baselineResults[idx];
                  return (
                    <tr key={tr.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">CASE #{idx + 1}</td>
                      <td className="p-3 uppercase text-rose-500 font-bold">{base?.routing_action || 'ANSWER'}</td>
                      <td className="p-3 uppercase text-indigo-500 font-bold">{tr.routing_action}</td>
                      <td className="p-3">{tr.estimated_confidence.toFixed(1)}/100</td>
                      <td className="p-3 font-sans">
                        {tr.measured_correctness ? (
                          <span className="text-emerald-600 font-bold flex items-center gap-1">✓ Correct Policy Action</span>
                        ) : (
                          <span className="text-rose-600 font-bold flex items-center gap-1">✕ Policy Mismatch</span>
                        )}
                      </td>
                      <td className="p-3">{tr.latency_ms.toFixed(0)} ms</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
