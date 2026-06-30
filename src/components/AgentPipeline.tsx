import React, { useEffect, useState } from 'react';
import { 
  ClipboardList, 
  ArrowUpDown, 
  AlertTriangle, 
  CalendarRange, 
  Smile, 
  LifeBuoy, 
  Scale, 
  BookOpen, 
  History,
  CheckCircle2,
  Hourglass,
  Loader2
} from 'lucide-react';

interface Agent {
  id: number;
  name: string;
  role: string;
  description: string;
  icon: React.ReactNode;
}

const AGENTS: Agent[] = [
  { id: 1, name: "Planner Agent", role: "Structural Decomposition", description: "Breaks goal into actionable subtasks with time estimates", icon: <ClipboardList className="w-5 h-5 text-indigo-400" /> },
  { id: 2, name: "Priority Agent", role: "Effort & Importance Ranker", description: "Urgency × Impact / Effort ordering", icon: <ArrowUpDown className="w-5 h-5 text-purple-400" /> },
  { id: 3, name: "Risk Agent", role: "Probability forecaster", description: "Predicts timeline failure rates in real-time", icon: <AlertTriangle className="w-5 h-5 text-rose-400" /> },
  { id: 4, name: "Calendar Agent", role: "Scheduling & Blocking", description: "Blocks times on your schedule avoiding conflicts", icon: <CalendarRange className="w-5 h-5 text-emerald-400" /> },
  { id: 5, name: "Daily Coach Agent", role: "Energy-Aware Coaching", description: "Formulates customized high/low energy focus plans", icon: <Smile className="w-5 h-5 text-amber-400" /> },
  { id: 6, name: "Recovery Agent", role: "Overload Rescheduler", description: "Ruthlessly trims and drops tasks to save weeks", icon: <LifeBuoy className="w-5 h-5 text-cyan-400" /> },
  { id: 7, name: "Negotiation Agent", role: "Professional Communicator", description: "Drafts perfect extension requests with defer proposals", icon: <Scale className="w-5 h-5 text-sky-400" /> },
  { id: 8, name: "Learning Agent", role: "Exam & Project Prep Tutor", description: "Compiles study notes, pitfalls, and custom mock quizzes on-demand", icon: <BookOpen className="w-5 h-5 text-teal-400" /> },
  { id: 9, name: "Reflection Agent", role: "Retrospective Log Reviewer", description: "Analyzes daily output to adapt tomorrow's pace", icon: <History className="w-5 h-5 text-fuchsia-400" /> }
];

interface AgentPipelineProps {
  isRunning: boolean;
  currentStep: number;
  onComplete?: () => void;
}

export default function AgentPipeline({ isRunning, currentStep, onComplete }: AgentPipelineProps) {
  const [logs, setLogs] = useState<string[]>([]);

  // Synchronize logs and step progress with the parent's currentStep state
  useEffect(() => {
    if (currentStep === 0) {
      setLogs([]);
      return;
    }

    const logMessages: Record<number, string> = {
      1: "Planner Agent online. Parsing targets and constraints...",
      2: "Planner finished. Priority Agent re-ranking tasks based on Urgency-Importance formula...",
      3: "Priority set. Risk Agent assessing procrastination penalty and predicting deadline fail rates...",
      4: "Risk quantified. Calendar Agent blocking times and checking for schedule overlaps...",
      5: "Time-blocking clear. Daily Coach formulating customized focus blocks...",
      6: "Coaching plan complete. Recovery Agent compiling emergency reschedule backups...",
      7: "Recovery analyzed. Negotiation Agent drafting extension requests and candidate deferred tasks...",
      8: "Extension package prepared. Learning Agent armed on-demand, ready to extract custom concepts and quiz topics...",
      9: "Materials cached. Reflection Agent initializing retrospective review listeners...",
      10: "Multi-Agent Pipeline Execution Complete! Dashboard updated."
    };

    if (currentStep === 1) {
      setLogs(["Initializing Deadline Guardian AI Multi-Agent Core...", logMessages[1]]);
    } else {
      const msg = logMessages[currentStep];
      if (msg) {
        setLogs(prev => {
          // Prevent duplicates
          if (prev.includes(msg)) return prev;
          return [msg, ...prev].slice(0, 5);
        });
      }
    }

    if (currentStep === 10 && onComplete) {
      onComplete();
    }
  }, [currentStep, onComplete]);

  return (
    <div id="agent-pipeline-container" className="bg-[#0e0e1b] border border-slate-800/80 rounded-2xl p-6 shadow-2xl flex flex-col h-full justify-between">
      <div>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 font-display">9-Agent Pipeline Dashboard</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Autonomous core sequence for deadline execution</p>
          </div>
          {isRunning && currentStep < 10 ? (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-medium text-indigo-400">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Running Agent {currentStep}/9
            </span>
          ) : currentStep === 10 ? (
            <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Pipeline Synced
            </span>
          ) : (
            <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-400 font-mono">
              <Hourglass className="w-3.5 h-3.5" />
              Standby
            </span>
          )}
        </div>

        {/* 3x3 Bento Grid for the 9 agents */}
        <div className="grid grid-cols-3 gap-3">
          {AGENTS.map((agent) => {
            const isCompleted = currentStep > agent.id || currentStep === 10;
            const isCurrent = currentStep === agent.id;
            
            return (
              <div 
                key={agent.id}
                className={`p-3 rounded-xl border transition-all duration-300 flex flex-col justify-between h-24 ${
                  isCurrent 
                    ? 'bg-indigo-500/10 border-indigo-500 ring-2 ring-indigo-500/20' 
                    : isCompleted 
                    ? 'bg-[#15152a] border-emerald-500/20 opacity-80' 
                    : 'bg-[#15152a]/50 border-slate-800/60 opacity-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className={`p-1.5 rounded-lg bg-black/30 ${isCurrent ? 'animate-pulse' : ''}`}>
                    {agent.icon}
                  </div>
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : isCurrent ? (
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-slate-600">A0{agent.id}</span>
                  )}
                </div>

                <div className="mt-1">
                  <h4 className="text-[11px] font-semibold text-slate-200 line-clamp-1">{agent.name}</h4>
                  <p className="text-[9px] text-slate-500 line-clamp-1">{agent.role}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Terminal logs display */}
      <div className="mt-4 bg-black/40 border border-slate-900 rounded-xl p-3 h-28 font-mono text-[10px] leading-relaxed flex flex-col justify-end text-slate-400 select-none">
        <div className="text-[9px] uppercase tracking-widest text-slate-600 font-semibold border-b border-slate-900 pb-1 mb-1">
          Agent Workspace Logs
        </div>
        <div className="flex flex-col-reverse gap-0.5 overflow-y-auto">
          {logs.map((log, idx) => (
            <div key={idx} className={`${idx === 0 ? 'text-indigo-400 font-semibold' : 'text-slate-500'} truncate`}>
              <span className="text-slate-600">{`>`}</span> {log}
            </div>
          ))}
          {logs.length === 0 && (
            <div className="text-slate-600 italic">No agents active. Submit a goal or upload a syllabus to boot pipeline...</div>
          )}
        </div>
      </div>
    </div>
  );
}
