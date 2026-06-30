import React, { useState, useEffect } from 'react';
import { History, TrendingUp, Sparkles, BookOpen, CheckCircle, Loader2 } from 'lucide-react';
import { Deadline } from '../types';

interface ReflectionAgentProps {
  deadlines: Deadline[];
}

interface ReflectionData {
  summary: string;
  whatWorked: string;
  whatToAdjust: string;
  tomorrowFocus: string;
}

export default function ReflectionAgent({ deadlines }: ReflectionAgentProps) {
  const [loading, setLoading] = useState(false);
  const [customReflection, setCustomReflection] = useState<ReflectionData | null>(null);

  // Compute total tasks and completed tasks to generate human-like reflection metrics
  const totalSubtasks = deadlines.reduce((acc, curr) => acc + curr.subtasks.length, 0);
  const completedSubtasks = deadlines.reduce((acc, curr) => acc + curr.subtasks.filter(t => t.completed).length, 0);
  const completionRate = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  // Formulate client-side fallback suggestions
  const getClientFallbackData = () => {
    if (deadlines.length === 0) {
      return {
        summary: 'No active deadline tracks currently logged. The AI Reflection Agent is idling in standby mode.',
        whatWorked: '0% aggregate progress. Add a deadline profile or syllabus to begin retrospective analysis.',
        whatToAdjust: 'Initialize your academic or project milestones, or import course syllabus timelines to automate load assessments.',
        tomorrowFocus: 'Begin study cycles on prioritized high-importance focus blocks.'
      };
    }

    const firstActive = deadlines[0];
    const riskLevel = firstActive.riskLevel;

    if (riskLevel === 'critical' || riskLevel === 'danger') {
      return {
        summary: `Your workload tracking indicates high scheduling density for "${firstActive.title}". Your daily effort required is hovering near limits, placing completion metrics at risk.`,
        whatWorked: `Completion at ${firstActive.progress}%. Current output pace is lagging behind the recommended ${firstActive.hoursPerDay}h daily budget due to Day 1 load spikes.`,
        whatToAdjust: 'Deploy the Negotiation Agent to draft professional extension proposals for safety margin gates or trigger the AI Load Balancer.',
        tomorrowFocus: 'Execute tomorrow\'s high-energy Morning focus blocks immediately. Avoid postponing neural cleaning tasks.'
      };
    }

    return {
      summary: `You are pacing comfortably for "${firstActive.title}". All current subtasks are mapped within your available ${firstActive.hoursPerDay} hours per day budget.`,
      whatWorked: `Aggregate completion rate is outstanding at ${completionRate}% across all deliverables. Your risk rating is sitting comfortably in the safe zone.`,
      whatToAdjust: 'Study practice sheets early to unlock advanced learning summaries or use freed evening blocks to maintain deep-work habits.',
      tomorrowFocus: 'Maintain current steady pacing. Review relational calculus or final draft materials on Day 2.'
    };
  };

  useEffect(() => {
    if (deadlines.length === 0) {
      setCustomReflection(null);
      return;
    }

    let isMounted = true;
    const fetchReflection = async () => {
      setLoading(true);
      try {
        const completedTasks = deadlines.flatMap(d => d.subtasks.filter(t => t.completed).map(t => t.title));
        const missedTasks = deadlines.flatMap(d => d.subtasks.filter(t => !t.completed).map(t => t.title));

        const response = await fetch('/api/reflection-review', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ completedTasks, missedTasks })
        });

        if (!response.ok) {
          throw new Error('Server error');
        }

        const result = await response.json();
        if (isMounted) {
          setCustomReflection(result);
        }
      } catch (err) {
        console.warn('Failed to retrieve server reflection, falling back to local analysis.', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchReflection();

    return () => {
      isMounted = false;
    };
  }, [completedSubtasks, totalSubtasks, deadlines.length]);

  const activeData = customReflection || getClientFallbackData();

  return (
    <div id="reflection-agent-card" className="bg-[#0e0e1b] border border-slate-800/80 rounded-2xl p-6 shadow-2xl space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 font-display flex items-center gap-2">
            <History className="w-4 h-4 text-fuchsia-400" />
            Agent 9: Reflection Retrospective
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">Retrospective performance auditor analyzing study trajectory</p>
        </div>
        <span className="text-[9px] font-mono font-bold text-fuchsia-400 px-2 py-0.5 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded flex items-center gap-1">
          {loading && <Loader2 className="w-2.5 h-2.5 animate-spin text-fuchsia-400" />}
          {loading ? 'Analyzing...' : 'Active'}
        </span>
      </div>

      <div className="space-y-3">
        <div className={`bg-black/25 rounded-xl p-4 border border-slate-900 space-y-3.5 transition-opacity duration-300 ${loading ? 'opacity-60' : 'opacity-100'}`}>
          <div className="space-y-1">
            <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500 block">Daily Retrospective Brief</span>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">{activeData.summary}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="bg-[#15152a] rounded-lg p-2.5 border border-slate-800/40">
              <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500 block">Productivity Score</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-lg font-bold text-fuchsia-400 font-mono">
                  {completionRate > 0 ? Math.min(100, Math.round(completionRate * 1.2)) : 50}/100
                </span>
                <span className="text-[9px] text-slate-500">nominal</span>
              </div>
            </div>

            <div className="bg-[#15152a] rounded-lg p-2.5 border border-slate-800/40">
              <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500 block">Task Efficiency</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-lg font-bold text-fuchsia-400 font-mono">{completionRate}%</span>
                <span className="text-[9px] text-slate-500">completed</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 border-t border-slate-900 pt-3">
            <div>
              <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500 block">What Worked Well</span>
              <p className="text-[11px] text-slate-300 leading-relaxed mt-0.5">{activeData.whatWorked}</p>
            </div>
            <div className="pt-1.5">
              <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500 block">Velocity Adjustments</span>
              <p className="text-[11px] text-slate-300 leading-relaxed mt-0.5">{activeData.whatToAdjust}</p>
            </div>
          </div>

          <div className="border-t border-slate-900 pt-3 bg-fuchsia-500/[0.02] p-2 rounded-lg border border-fuchsia-500/5">
            <span className="text-[9px] font-mono uppercase tracking-widest text-fuchsia-400 block font-semibold">Tomorrow's Routine Directives</span>
            <p className="text-[11px] text-slate-300 leading-relaxed mt-1 italic">"{activeData.tomorrowFocus}"</p>
          </div>
        </div>
      </div>
    </div>
  );
}
