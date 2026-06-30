import React, { useState } from 'react';
import { Mail, Clipboard, Check, Scale, CalendarX, ArrowUpRight, Sparkles } from 'lucide-react';
import { Negotiation } from '../types';

interface NegotiationPanelProps {
  negotiation: Negotiation;
  deadlineTitle: string;
}

export default function NegotiationPanel({ negotiation, deadlineTitle }: NegotiationPanelProps) {
  const [copied, setCopied] = useState(false);
  const [tone, setTone] = useState<'formal' | 'semi-formal'>(negotiation.tone);

  const handleCopy = () => {
    navigator.clipboard.writeText(negotiation.emailBody);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Gmail direct integration link
  const getGmailLink = () => {
    const subject = encodeURIComponent(negotiation.emailSubject);
    const body = encodeURIComponent(negotiation.emailBody);
    return `https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`;
  };

  return (
    <div id="negotiation-panel" className="bg-[#0e0e1b] border border-slate-800/80 rounded-2xl p-6 shadow-2xl space-y-5">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 font-display flex items-center gap-1.5">
            <Scale className="w-4 h-4 text-rose-400" />
            Negotiation Agent Proposal
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">Triggers automatically when fail risk exceeds critical capacity thresholds</p>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
          Pre-Drafted
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 bg-black/20 rounded-xl p-3.5 border border-slate-800/30">
        <div className="text-center">
          <p className="text-[9px] font-mono uppercase tracking-wider text-slate-500">Suggested Extension</p>
          <p className="text-lg font-bold font-mono text-indigo-400 mt-0.5">+{negotiation.estimatedExtensionDays} Days</p>
        </div>
        <div className="text-center border-x border-slate-800/40 px-2">
          <p className="text-[9px] font-mono uppercase tracking-wider text-slate-500">Proposed Tone</p>
          <p className="text-sm font-semibold text-slate-300 mt-1 capitalize">{negotiation.tone}</p>
        </div>
        <div className="text-center">
          <p className="text-[9px] font-mono uppercase tracking-wider text-slate-500">AI Confidence</p>
          <p className="text-xs font-semibold text-emerald-400 mt-1">High Success</p>
        </div>
      </div>

      {/* Main split-screen: Left email preview, Right calendar sacrifices */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Email Draft Box */}
        <div className="md:col-span-3 space-y-2 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Polished Extension Request</span>
              <button 
                onClick={handleCopy}
                className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Clipboard className="w-3.5 h-3.5" />}
                {copied ? 'Copied Draft' : 'Copy Template'}
              </button>
            </div>
            <div className="bg-black/30 border border-slate-800 rounded-xl p-3 font-mono text-[11px] leading-relaxed text-slate-300 h-52 overflow-y-auto whitespace-pre-wrap">
              <div className="border-b border-slate-900 pb-1 mb-2">
                <span className="text-slate-500">Subject:</span> {negotiation.emailSubject}
              </div>
              {negotiation.emailBody}
            </div>
          </div>

          <a
            href={getGmailLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#ef4444] hover:bg-[#dc2626] text-white font-medium text-xs py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-rose-600/15"
          >
            <Mail className="w-4 h-4" />
            One-Click Extension Draft in Gmail
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Defer suggestions */}
        <div className="md:col-span-2 space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">Candidate Deferrals (Freed Hours)</span>
          <div className="bg-black/25 border border-slate-800/40 rounded-xl p-3 space-y-3 h-52 overflow-y-auto">
            {negotiation.deferSuggestions.map((item, idx) => (
              <div key={idx} className="bg-[#15152a] border border-slate-800/60 rounded-xl p-2.5 flex items-start gap-2.5">
                <CalendarX className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="flex justify-between items-center">
                    <h5 className="text-[11px] font-semibold text-slate-200 truncate pr-2">{item.eventTitle}</h5>
                    <span className="text-[10px] font-mono text-indigo-400 font-bold shrink-0">+{item.hoursFreed}h</span>
                  </div>
                  <p className="text-[9px] text-slate-500 leading-normal">{item.reason}</p>
                </div>
              </div>
            ))}
            {negotiation.deferSuggestions.length === 0 && (
              <p className="text-[10px] text-slate-500 italic text-center pt-8">No specific calendar deferrals recommended.</p>
            )}
          </div>
          
          <div className="bg-black/10 border border-slate-800/10 rounded-xl p-3">
            <span className="text-[9px] font-semibold text-slate-400 block mb-0.5">Guardian Advice:</span>
            <p className="text-[10px] text-slate-500 leading-normal italic">"{negotiation.confidenceMessage}"</p>
          </div>
        </div>
      </div>
    </div>
  );
}
