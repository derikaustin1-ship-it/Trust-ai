import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import type { Conversation, Message, AssistantProcessResponse, Decision } from '../types';
import type { PresetScenario } from '../components/assistant/ScenarioPresetSelector';
import { ScenarioPresetSelector } from '../components/assistant/ScenarioPresetSelector';

import { DecisionExplanationPanel } from '../components/assistant/DecisionExplanationPanel';
import { ProcessingTimeline } from '../components/assistant/ProcessingTimeline';
import { ConfidenceBadge, RiskBadge, RoutingDecisionBadge } from '../components/common/Badges';
import { Send, Plus, Trash2, ShieldCheck, Sparkles, MessageSquare, AlertCircle, Bot, User as UserIcon } from 'lucide-react';

export const Assistant: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentProcess, setCurrentProcess] = useState<AssistantProcessResponse | null>(null);
  const [selectedDecision, setSelectedDecision] = useState<Decision | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadConversations = async () => {
    try {
      const list = await api.getConversations();
      setConversations(list);
      if (list.length > 0 && !activeConvId) {
        setActiveConvId(list[0].id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (activeConvId) {
      api.getConversation(activeConvId)
        .then((conv) => setMessages(conv.messages || []))
        .catch(console.error);
    } else {
      setMessages([]);
    }
  }, [activeConvId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentProcess]);

  const handleCreateConv = async () => {
    try {
      const newConv = await api.createConversation('New Session');
      setConversations([newConv, ...conversations]);
      setActiveConvId(newConv.id);
      setMessages([]);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteConv = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this conversation?')) return;
    try {
      await api.deleteConversation(id);
      const updated = conversations.filter(c => c.id !== id);
      setConversations(updated);
      if (activeConvId === id) {
        setActiveConvId(updated.length > 0 ? updated[0].id : null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendMessage = async (text: string, overrideCategory?: string) => {
    if (!text.trim() || loading) return;

    const userTempMsg: Message = {
      id: 'temp-' + Date.now(),
      conversation_id: activeConvId || '',
      role: 'user',
      content: text,
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, userTempMsg]);
    setInputPrompt('');
    setLoading(true);
    setCurrentProcess(null);

    try {
      const res = await api.sendMessage(text, activeConvId || undefined, overrideCategory);
      setCurrentProcess(res);
      setSelectedDecision(res.decision);
      setActiveConvId(res.conversation_id);

      setMessages(prev => {
        const filtered = prev.filter(m => !m.id.startsWith('temp-'));
        return [...filtered, res.user_message, res.assistant_message];
      });

      loadConversations();
    } catch (e: any) {
      alert(e.message || 'Error processing request');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectScenario = (sc: PresetScenario) => {
    if (sc.id === 'j') {
      window.location.href = '/evaluation';
      return;
    }
    handleSendMessage(sc.prompt);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-slate-100 dark:bg-slate-950">
      {/* Left Sidebar: Conversations */}
      <div className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={handleCreateConv}
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md shadow-indigo-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Session</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => setActiveConvId(conv.id)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer text-xs font-medium transition-colors ${
                activeConvId === conv.id
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-200 dark:border-indigo-900'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <MessageSquare className="w-4 h-4 shrink-0" />
                <span className="truncate">{conv.title}</span>
              </div>
              <button
                onClick={(e) => handleDeleteConv(conv.id, e)}
                className="opacity-0 hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 transition-opacity"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Stream */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Scenario Presets Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <ScenarioPresetSelector onSelectScenario={handleSelectScenario} />
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 ? (
            <div className="text-center py-16 text-slate-400 space-y-3">
              <Bot className="w-12 h-12 text-indigo-500 mx-auto opacity-50" />
              <h3 className="font-bold text-slate-700 dark:text-slate-300">Welcome to TRUSTIQ AI Assistant</h3>
              <p className="text-xs max-w-md mx-auto">
                Submit any question or select a scenario above. The AI evaluates confidence, checks evidence, and applies strict risk policies before answering.
              </p>
            </div>
          ) : (
            messages.map((m) => {
              const isUser = m.role === 'user';
              return (
                <div key={m.id} className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
                  {!isUser && (
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shrink-0 mt-1 shadow-md shadow-indigo-600/30">
                      <Bot className="w-5 h-5" />
                    </div>
                  )}

                  <div className={`max-w-2xl rounded-2xl p-4 text-sm shadow-sm ${
                    isUser
                      ? 'bg-indigo-600 text-white font-medium rounded-tr-none'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none'
                  }`}>
                    <div className="whitespace-pre-wrap">{m.content}</div>

                    {!isUser && selectedDecision && (
                      <DecisionExplanationPanel decision={selectedDecision} />
                    )}
                  </div>

                  {isUser && (
                    <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-white shrink-0 mt-1 font-bold">
                      U
                    </div>
                  )}
                </div>
              );
            })
          )}

          {loading && (
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md">
                <Bot className="w-5 h-5 animate-spin" />
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-xs font-semibold text-slate-500 animate-pulse">
                Running verification & confidence estimation pipeline...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Composer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <form
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputPrompt); }}
            className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 p-2 rounded-2xl border border-slate-200 dark:border-slate-800"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Ask a question or enter a command (e.g. 'What is 125 * 8?')..."
              className="flex-1 bg-transparent px-3 py-2 text-sm text-slate-800 dark:text-white focus:outline-none"
            />
            <button
              type="submit"
              disabled={!inputPrompt.trim() || loading}
              className="p-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Right Drawer: Active Decision & Evidence Inspector */}
      {selectedDecision && (
        <div className="w-80 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 overflow-y-auto hidden xl:block text-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Decision Inspector</h3>
            <span className="font-mono text-[10px] text-slate-400">{selectedDecision.id.substring(0, 8)}</span>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Confidence Score</span>
              <ConfidenceBadge score={selectedDecision.estimated_confidence} label={selectedDecision.confidence_label} />
            </div>

            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Risk Level</span>
              <RiskBadge level={selectedDecision.risk_level} />
            </div>

            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Routing Action</span>
              <RoutingDecisionBadge action={selectedDecision.routing_action} />
            </div>
          </div>

          {selectedDecision.confidence_assessment && (
            <div className="border-t border-slate-200 dark:border-slate-800 pt-3">
              <span className="font-bold text-slate-800 dark:text-slate-200 block mb-2">Signal Availability</span>
              <div className="space-y-1">
                <div className="text-emerald-600 font-semibold">
                  ✓ Available: {selectedDecision.confidence_assessment.available_signals_json.join(', ')}
                </div>
                {selectedDecision.confidence_assessment.unavailable_signals_json.length > 0 && (
                  <div className="text-slate-400">
                    ✕ Unavailable: {selectedDecision.confidence_assessment.unavailable_signals_json.join(', ')}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
