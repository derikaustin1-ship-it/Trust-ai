import React from 'react';
import { BookOpen, ShieldCheck, Scale, Cpu, Code2, AlertTriangle } from 'lucide-react';

export const Docs: React.FC = () => {
  return (
    <div className="p-6 md:p-8 space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">In-App Documentation & Technical Methodology</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Detailed specification of confidence estimation math, risk matrices, and policy routing rules.
        </p>
      </div>

      <div className="space-y-6 text-sm text-slate-700 dark:text-slate-300">
        <section className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-500" />
            1. Confidence Estimation Engine Methodology
          </h2>
          <p>
            Unlike conventional LLMs that self-report arbitrary confidence text, TRUSTIQ AI calculates a normalized empirical score \(S \in [0, 100]\) combining 6 independent weighted signals:
          </p>
          <ul className="list-disc list-inside space-y-1 font-mono text-xs text-indigo-600 dark:text-indigo-400">
            <li>Evidence Quality (25% weight)</li>
            <li>Evidence Coverage (20% weight)</li>
            <li>Verification Outcome (25% weight)</li>
            <li>Provider Self-Assessment (10% weight)</li>
            <li>Historical Task Reliability (10% weight)</li>
            <li>Multi-Sample Agreement (10% weight)</li>
          </ul>
          <p className="text-xs text-slate-500">
            Negative penalties are subtracted directly: -35 points for failed verification, -30 points for internal contradictions, -20 points for prompt ambiguity, and up to -30 points for missing critical context.
          </p>
        </section>

        <section className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            2. Risk Assessment & Safety Gating Policy
          </h2>
          <p>
            Confidence and risk are decoupled. Even if a model estimates 99% confidence, a request classified as <strong>Critical Risk</strong> (e.g. executing financial trades or issuing medical prescriptions) will NEVER automate state execution. It is immediately escalated to human review or declined.
          </p>
        </section>

        <section className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Scale className="w-5 h-5 text-teal-500" />
            3. Evaluation Laboratory Benchmark Definitions
          </h2>
          <p>
            The Evaluation Lab runs offline head-to-head comparisons against standard Baseline AI models across 10 benchmark cases:
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800">
              <strong>Verification Pass Rate:</strong> % of verification runs that passed.
            </div>
            <div className="p-2 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800">
              <strong>Appropriate Escalation Rate:</strong> % of high-risk cases routed to review.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
