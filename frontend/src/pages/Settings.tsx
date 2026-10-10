import React, { useState } from 'react';
import { Settings as SettingsIcon, Shield, Cpu, Sliders, Database, Key } from 'lucide-react';

export const Settings: React.FC = () => {
  const [provider, setProvider] = useState('demo');
  const [scoringVersion, setScoringVersion] = useState('1.0.0');
  const [evidenceWeight, setEvidenceWeight] = useState(25);
  const [verificationWeight, setVerificationWeight] = useState(25);

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Application Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Configure AI provider adapters, scoring feature weights, and threshold bounds.
        </p>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
          <Cpu className="w-5 h-5 text-indigo-500" />
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">AI LLM Provider Adapter</h3>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Configured Provider Mode</label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="w-full max-w-md p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white"
            >
              <option value="demo">Deterministic Demo Provider (No API key required)</option>
              <option value="openai">OpenAI GPT-4o (Configured via backend .env)</option>
              <option value="anthropic">Anthropic Claude 3.5 (Configured via backend .env)</option>
            </select>
            <p className="text-slate-400 mt-1">Demo provider allows 100% offline demonstration without API key dependencies.</p>
          </div>
        </div>

        <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4 pt-4">
          <Sliders className="w-5 h-5 text-indigo-500" />
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Confidence Estimation Weighting</h3>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300 mb-1">
              <span>Evidence Quality Weight: {evidenceWeight}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="50"
              value={evidenceWeight}
              onChange={(e) => setEvidenceWeight(Number(e.target.value))}
              className="w-full max-w-md"
            />
          </div>

          <div>
            <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300 mb-1">
              <span>Verification Outcome Weight: {verificationWeight}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="50"
              value={verificationWeight}
              onChange={(e) => setVerificationWeight(Number(e.target.value))}
              className="w-full max-w-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
