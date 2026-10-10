import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { ReviewRequest } from '../types';

import { ConfidenceBadge, RiskBadge, RoutingDecisionBadge } from '../components/common/Badges';
import { useAuth } from '../context/AuthContext';
import { UserCheck, CheckCircle2, XCircle, HelpCircle, ShieldAlert, Clock, RefreshCw } from 'lucide-react';

export const Reviews: React.FC = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<ReviewRequest[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('pending');
  const [loading, setLoading] = useState(true);

  const [selectedCase, setSelectedCase] = useState<ReviewRequest | null>(null);
  const [notes, setNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const loadReviews = () => {
    setLoading(true);
    api.getReviewQueue(statusFilter || undefined)
      .then(setReviews)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadReviews();
  }, [statusFilter]);

  const handleApprove = async (id: string) => {
    setActionLoading(true);
    try {
      await api.approveReview(id, notes);
      setSelectedCase(null);
      setNotes('');
      loadReviews();
    } catch (e: any) {
      alert(e.message || 'Approval failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id: string) => {
    setActionLoading(true);
    try {
      await api.rejectReview(id, notes);
      setSelectedCase(null);
      setNotes('');
      loadReviews();
    } catch (e: any) {
      alert(e.message || 'Rejection failed');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Human Review Queue</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review escalated low-confidence cases, critical-risk requests, and contradictory claims.
          </p>
        </div>
        <button
          onClick={loadReviews}
          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors self-start"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {['pending', 'assigned', 'approved', 'rejected'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-colors ${
              statusFilter === st
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            {st} Cases
          </button>
        ))}
      </div>

      {/* Grid of Case Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full py-12 text-center text-slate-400">Loading review queue...</div>
        ) : reviews.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400">No {statusFilter} review cases found.</div>
        ) : (
          reviews.map((rev) => (
            <div
              key={rev.id}
              onClick={() => setSelectedCase(rev)}
              className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all cursor-pointer space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-slate-400">CASE-{rev.id.substring(0, 6)}</span>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                  rev.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                  rev.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {rev.status}
                </span>
              </div>

              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-2">
                {rev.reason}
              </p>

              {rev.decision && (
                <div className="flex flex-wrap gap-2 pt-1">
                  <ConfidenceBadge score={rev.decision.estimated_confidence} />
                  <RiskBadge level={rev.decision.risk_level} />
                </div>
              )}

              <div className="text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>Escalated {new Date(rev.created_at).toLocaleDateString()}</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">Open Case →</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Case Review Drawer / Modal */}
      {selectedCase && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-indigo-500" />
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Review Case #{selectedCase.id.substring(0, 8)}</h3>
              </div>
              <button onClick={() => setSelectedCase(null)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200">
                <span className="font-bold block mb-1">Escalation Reason</span>
                <p>{selectedCase.reason}</p>
              </div>

              {selectedCase.decision && (
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">Decision Signals</span>
                  <div className="flex flex-wrap gap-2">
                    <ConfidenceBadge score={selectedCase.decision.estimated_confidence} label={selectedCase.decision.confidence_label} />
                    <RiskBadge level={selectedCase.decision.risk_level} />
                    <RoutingDecisionBadge action={selectedCase.decision.routing_action} />
                  </div>
                </div>
              )}

              {user?.role !== 'user' && selectedCase.status === 'pending' && (
                <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <label className="block font-bold text-slate-700 dark:text-slate-300">Reviewer Notes</label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter audit notes or rationale for decision..."
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white focus:outline-none"
                  />

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleApprove(selectedCase.id)}
                      disabled={actionLoading}
                      className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/30"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve Decision</span>
                    </button>
                    <button
                      onClick={() => handleReject(selectedCase.id)}
                      disabled={actionLoading}
                      className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-rose-600/30"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject & Refuse</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
