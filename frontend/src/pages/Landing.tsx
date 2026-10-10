import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Sparkles, ArrowRight, CheckCircle, AlertTriangle, HelpCircle, UserCheck, Scale, Cpu, Search, Layers } from 'lucide-react';

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Bar */}
      <header className="h-20 border-b border-slate-800/80 px-8 flex items-center justify-between backdrop-blur-md bg-slate-950/80 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <span className="font-extrabold text-xl text-white tracking-tight">TRUSTIQ <span className="text-indigo-400">AI</span></span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/login')} className="text-slate-300 hover:text-white text-sm font-semibold px-4 py-2 transition-colors">
            Sign In
          </button>
          <button onClick={() => navigate('/assistant')} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>Launch Platform</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="px-6 py-20 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-800/60 text-indigo-300 text-xs font-semibold mb-8">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Trust-Aware AI Agent Architecture</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight max-w-4xl mx-auto leading-tight mb-6">
            AI that knows when <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-teal-300 bg-clip-text text-transparent">NOT to answer.</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            TRUSTIQ AI evaluates uncertainty, checks evidence, and chooses the right next action—helping teams build more reliable AI-powered decisions.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={() => navigate('/assistant')}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base px-8 py-4 rounded-xl shadow-xl shadow-indigo-600/40 transition-all flex items-center justify-center gap-3 group"
            >
              <span>Try the AI Assistant</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => navigate('/evaluation')}
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-bold text-base px-8 py-4 rounded-xl transition-all flex items-center justify-center gap-3"
            >
              <Scale className="w-5 h-5 text-indigo-400" />
              <span>Explore the Evaluation Lab</span>
            </button>
          </div>

          {/* Interactive Workflow Visual Illustration */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-8 shadow-2xl text-left max-w-5xl mx-auto">
            <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-6 flex items-center gap-2">
              <Layers className="w-4 h-4" />
              <span>Illustrative Workflow — Trust-Aware Decision Pipeline</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 block mb-1">STAGE 1</span>
                <div className="font-bold text-sm text-white flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-indigo-400" /> User Request
                </div>
                <p className="text-xs text-slate-400 mt-2">Natural language prompt submit</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 block mb-1">STAGE 2</span>
                <div className="font-bold text-sm text-white flex items-center gap-2">
                  <Search className="w-4 h-4 text-amber-400" /> AI Analysis
                </div>
                <p className="text-xs text-slate-400 mt-2">Extract claims & detect ambiguity</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 block mb-1">STAGE 3</span>
                <div className="font-bold text-sm text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Confidence (0-100)
                </div>
                <p className="text-xs text-slate-400 mt-2">Multi-signal empirical score</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 block mb-1">STAGE 4</span>
                <div className="font-bold text-sm text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400" /> Risk & Evidence
                </div>
                <p className="text-xs text-slate-400 mt-2">Classify risk & run verification</p>
              </div>

              <div className="bg-gradient-to-br from-indigo-950 to-violet-950 p-4 rounded-xl border border-indigo-700/60 shadow-lg">
                <span className="text-[10px] font-bold text-indigo-300 block mb-1">FINAL STAGE</span>
                <div className="font-bold text-sm text-white">
                  Action Policy
                </div>
                <div className="mt-2 text-[11px] font-mono text-indigo-200 flex flex-wrap gap-1">
                  <span className="bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded">Answer</span>
                  <span className="bg-teal-950 text-teal-300 px-1.5 py-0.5 rounded">Verify</span>
                  <span className="bg-amber-950 text-amber-300 px-1.5 py-0.5 rounded">Clarify</span>
                  <span className="bg-rose-950 text-rose-300 px-1.5 py-0.5 rounded">Escalate</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="px-6 py-16 max-w-5xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white text-center mb-10">Ordinary AI vs. TRUSTIQ AI</h2>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[11px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">Dimension</th>
                  <th className="p-4 text-rose-400">Ordinary AI Assistant</th>
                  <th className="p-4 text-indigo-400 font-bold">TRUSTIQ AI Agent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                <tr>
                  <td className="p-4 font-semibold text-white">Uncertainty Handling</td>
                  <td className="p-4 text-slate-400">Guesses or hallucinates plausible text</td>
                  <td className="p-4 text-emerald-400 font-semibold">Calculates 0-100 multi-signal confidence score</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-white">Ambiguous Prompts</td>
                  <td className="p-4 text-slate-400">Makes arbitrary assumptions silently</td>
                  <td className="p-4 text-amber-400 font-semibold">Asks targeted clarifying questions</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-white">Fact Verification</td>
                  <td className="p-4 text-slate-400">No independent verification suite</td>
                  <td className="p-4 text-teal-400 font-semibold">Runs AST math, claim matching & contradiction checks</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-white">High-Risk Actions</td>
                  <td className="p-4 text-slate-400">Risk blind; attempts prohibited actions</td>
                  <td className="p-4 text-rose-400 font-semibold">Risk classifier escalates or declines critical tasks</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-8 px-8 text-center text-xs text-slate-500">
        <p>TRUSTIQ AI Platform — Technology Innovation Challenge Presentation</p>
      </footer>
    </div>
  );
};
