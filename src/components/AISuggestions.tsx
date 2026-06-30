import React from 'react';
import { Sparkles, ArrowRight, CheckCircle2, AlertTriangle, Lightbulb } from 'lucide-react';
import { Deadline } from '../types';

interface AISuggestionsProps {
  deadlines: Deadline[];
  onAutoResolve: () => void;
  onSelectDeadline: (id: string) => void;
}

export default function AISuggestions({ deadlines, onAutoResolve, onSelectDeadline }: AISuggestionsProps) {
  if (deadlines.length === 0) {
    return (
      <div id="ai-suggestions-widget" className="bg-[#0e0e1b]/60 border border-slate-800/40 rounded-2xl p-5 text-center text-slate-500">
        <Sparkles className="w-6 h-6 text-slate-700 mx-auto mb-2 animate-pulse" />
        <p className="text-xs italic">Awaiting deadline profiles to calculate smart schedule optimization suggestions.</p>
      </div>
    );
  }

  // Generate dynamic proactive suggestions
  const suggestions: {
    id: string;
    title: string;
    description: string;
    type: 'critical' | 'info' | 'success';
    actionLabel?: string;
    onAction?: () => void;
  }[] = [];

  const mlHackathon = deadlines.find(d => d.id === 'dl-1' || d.title.toLowerCase().includes('hackathon'));
  const dbmsExam = deadlines.find(d => d.id === 'dl-2' || d.title.toLowerCase().includes('dbms') || d.title.toLowerCase().includes('database'));

  // 1. Check for specific bottlenecks or high risk scores
  const highRisk = deadlines.find(d => d.riskScore > 75);
  if (highRisk) {
    suggestions.push({
      id: 'high-risk-alert',
      title: 'Timeline Bottleneck Detected!',
      description: `"${highRisk.title}" has a critical risk rating of ${highRisk.riskScore}%. Your daily load exceeds the limits.`,
      type: 'critical',
      actionLabel: 'Negotiate Safety Gate Extension',
      onAction: () => onSelectDeadline(highRisk.id)
    });
  }

  // 2. Proactively recommend shifting study effort from safe zones to dangerous zones
  if (mlHackathon && dbmsExam && mlHackathon.riskScore > dbmsExam.riskScore) {
    suggestions.push({
      id: 'load-reallocate',
      title: 'Pacing Optimization Opportunity',
      description: `"${dbmsExam.title}" progress is safe at ${dbmsExam.progress}%. Let's proactively pause today's database focus to gain critical hacking blocks for "${mlHackathon.title}".`,
      type: 'info',
      actionLabel: 'Focus on Hackathon Profile',
      onAction: () => onSelectDeadline(mlHackathon.id)
    });
  }

  // 3. Highlight balanced states
  const allSafe = deadlines.every(d => d.riskScore <= 50);
  if (allSafe && deadlines.length > 0) {
    suggestions.push({
      id: 'all-clear',
      title: 'Cognitive Trajectory Is Stable',
      description: 'Excellent pacing! All deadlines are balanced. Use extra blocks today for ahead-of-schedule summaries.',
      type: 'success'
    });
  }

  return (
    <div id="ai-suggestions-container" className="space-y-3">
      {suggestions.map((s) => (
        <div
          key={s.id}
          className={`p-4 rounded-xl border flex gap-3 transition-all ${
            s.type === 'critical'
              ? 'bg-rose-500/10 border-rose-500/25 shadow-rose-500/5'
              : s.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/25'
              : 'bg-indigo-500/10 border-indigo-500/25'
          }`}
        >
          <div className="shrink-0 mt-0.5">
            {s.type === 'critical' ? (
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            ) : s.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <Lightbulb className="w-4 h-4 text-indigo-400" />
            )}
          </div>

          <div className="flex-1 space-y-2">
            <div className="space-y-0.5">
              <h4 className={`text-xs font-semibold ${
                s.type === 'critical' ? 'text-rose-400' : s.type === 'success' ? 'text-emerald-400' : 'text-indigo-400'
              }`}>{s.title}</h4>
              <p className="text-[11px] text-slate-300 leading-normal">{s.description}</p>
            </div>

            {s.onAction && s.actionLabel && (
              <button
                onClick={s.onAction}
                aria-label={s.actionLabel}
                className={`text-[10px] font-semibold flex items-center gap-1 transition-all ${
                  s.type === 'critical' ? 'text-rose-400 hover:text-rose-300' : 'text-indigo-400 hover:text-indigo-300'
                }`}
              >
                {s.actionLabel}
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
