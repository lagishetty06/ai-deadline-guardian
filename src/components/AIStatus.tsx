import React from 'react';
import { Cpu, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface AIStatusProps {
  currentStep: number;
  isRunning: boolean;
}

export default function AIStatus({ currentStep, isRunning }: AIStatusProps) {
  const getStatusText = () => {
    if (isRunning && currentStep < 10) return 'PROCESSING';
    if (currentStep === 10) return 'IDLE / COGNITIVE STATE READY';
    return 'STANDBY';
  };

  const getStatusColor = () => {
    if (isRunning && currentStep < 10) return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
    if (currentStep === 10) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    return 'text-slate-400 bg-slate-800/50 border-slate-700/50';
  };

  const getAgentVerb = () => {
    switch (currentStep) {
      case 1: return 'Decomposing milestones...';
      case 2: return 'Reranking subtask impact indices...';
      case 3: return 'Forecasting failure risk curves...';
      case 4: return 'Mapping time-slots and locking blocks...';
      case 5: return 'Generating energy focus regimens...';
      case 6: return 'Analyzing overload and scheduling load-balances...';
      case 7: return 'Drafting extension communication plans...';
      case 8: return 'Compiling on-demand concept guides...';
      case 9: return 'Listening to user retrospectives...';
      default: return 'Awaiting tasks or goal initialization...';
    }
  };

  return (
    <div id="ai-status-widget" className="bg-[#0e0e1b] border border-slate-800/80 rounded-2xl p-4 shadow-xl space-y-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-indigo-400" />
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-display">Agentic Consensus Status</h4>
        </div>
        <div className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold border ${getStatusColor()} flex items-center gap-1.5`}>
          {isRunning && currentStep < 10 ? (
            <Loader2 className="w-2.5 h-2.5 animate-spin" />
          ) : (
            <span className={`w-1.5 h-1.5 rounded-full ${currentStep === 10 ? 'bg-emerald-400' : 'bg-slate-400'}`} />
          )}
          {getStatusText()}
        </div>
      </div>

      <div className="bg-black/30 rounded-xl p-3 border border-slate-900 flex flex-col justify-center gap-1.5 min-h-[52px]">
        <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500 block">Proactive Agent Action</span>
        <div className="flex items-center gap-2 text-xs">
          {isRunning && currentStep < 10 ? (
            <span className="text-indigo-400 font-medium animate-pulse font-mono">{`[A0${currentStep}]`} {getAgentVerb()}</span>
          ) : currentStep === 10 ? (
            <span className="text-emerald-400 font-medium font-mono flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Core database synchronized. 9 Agents optimized.
            </span>
          ) : (
            <span className="text-slate-400 font-sans italic flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-slate-500" /> System in idle sleep mode. Load data to activate.
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 border-t border-slate-900 pt-2">
        <span className="flex items-center gap-1">
          Stack: <strong className="text-slate-400">Gemini 2.5-Flash</strong>
        </span>
        <span className="text-slate-600">|</span>
        <span>Google AI Studio Core</span>
      </div>
    </div>
  );
}
