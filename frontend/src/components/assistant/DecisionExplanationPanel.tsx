import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ShieldCheck, AlertTriangle, Info, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import type { Decision } from '../../types';

import { ConfidenceBadge, RiskBadge, RoutingDecisionBadge } from '../common/Badges';

interface Props {
  decision: Decision;
}

export const DecisionExplanationPanel: React.FC<Props> = ({ decision }) => {
  const [expanded, setExpanded] = useState(false);

  const conf = decision.confidence_assessment;
  const verif = decision.verification_runs?.[0];

  return (
    <div className="mt-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 overflow-hidden text-xs">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
      >
        <div className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300">
          <Info className="w-4 h-4 text-indigo-500" />
          <span>Why this decision?</span>
          <ConfidenceBadge score={decision.estimated_confidence} label={decision.confidence_label} />
          <RiskBadge level={decision.risk_level} />
          <RoutingDecisionBadge action={decision.routing_action} />
        </div>
        <div className="flex items-center gap-1 text-slate-400">
          <span>{expanded ? 'Hide Rationale' : 'Expand Rationale'}</span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {expanded && (
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-3 bg-white dark:bg-slate-950">
          {/* Action Reason */}
          <div className="p-3 bg-indigo-50/60 dark:bg-indigo-950/40 rounded-lg border border-indigo-100 dark:border-indigo-900/60">
            <span className="font-bold text-indigo-900 dark:text-indigo-300 block mb-1">Policy Rationale</span>
            <p className="text-slate-700 dark:text-slate-300">{decision.routing_reason}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Confidence breakdown */}
            {conf && (
              <div className="p-3 border border-slate-200 dark:border-slate-800 rounded-lg">
                <span className="font-bold text-slate-800 dark:text-slate-200 block mb-2">Confidence Feature Weighting</span>
                <div className="space-y-1.5 font-mono">
                  {Object.entries(conf.feature_weights_json).map(([key, weight]) => (
                    <div key={key} className="flex justify-between items-center text-[11px]">
                      <span className="capitalize text-slate-600 dark:text-slate-400">{key.replace(/_/g, ' ')}</span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">{(weight * 100).toFixed(0)}% weight</span>
                    </div>
                  ))}
                </div>
                {conf.explanation_json?.penalty_reasons?.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 block mb-1">Applied Penalties</span>
                    <ul className="list-disc list-inside text-rose-700 dark:text-rose-300 text-[11px] space-y-0.5">
                      {conf.explanation_json.penalty_reasons.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Verification Result */}
            {verif && (
              <div className="p-3 border border-slate-200 dark:border-slate-800 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-800 dark:text-slate-200">Verification Outcome</span>
                  <span className={`font-semibold capitalize px-2 py-0.5 rounded text-[10px] ${
                    verif.status === 'passed' ? 'bg-emerald-100 text-emerald-800' :
                    verif.status === 'failed' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {verif.status} ({verif.verification_method})
                  </span>
                </div>

                {verif.evidence_json && verif.evidence_json.length > 0 && (
                  <div className="space-y-1 mb-2">
                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Evidence Sources:</span>
                    {verif.evidence_json.map((ev, i) => (
                      <div key={i} className="text-[11px] text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 p-1.5 rounded border border-slate-100 dark:border-slate-800">
                        <span className="font-bold">{ev.title}</span> - {ev.result}
                      </div>
                    ))}
                  </div>
                )}

                {verif.limitations_json && verif.limitations_json.length > 0 && (
                  <div className="mt-2 text-[11px] text-amber-700 dark:text-amber-400">
                    <span className="font-bold">Remaining Limitations:</span> {verif.limitations_json.join(', ')}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
