import React, { useState } from 'react';
import { History, TrendingUp, Sparkles, BookOpen, CheckCircle } from 'lucide-react';
import { Deadline } from '../types';

interface ReflectionAgentProps {
  deadlines: Deadline[];
}

export default function ReflectionAgent({ deadlines }: ReflectionAgentProps) {
  const [reflectionDay, setReflectionDay] = useState(1);

  // Compute total tasks and completed tasks to generate human-like reflection metrics
  const totalSubtasks = deadlines.reduce((acc, curr) => acc + curr.subtasks.length, 0);
  const completedSubtasks = deadlines.reduce((acc, curr) => acc + curr.subtasks.filter(t => t.completed).length, 0);
  const completionRate = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  // Formulate dynamic, professional suggestions based on active milestones
  const getReflectionData = () => {
    if (deadlines.length === 0) {
      return {
        summary: 'No active deadline tracks currently logged. The AI Reflection Agent is idling in standby mode.',
        productivityAnalysis: '0% aggregate progress. Add a deadline profile or syllabus to begin retrospective analysis.',
        suggestions: [
          'Initialize your academic or project milestones.',
          'Import syllabus timelines to automate load assessments.'
        ],
        tomorrowRecommendations: 'Begin study cycles on prioritized high-importance focus blocks.'
      };
    }

    const firstActive = deadlines[0];
    const riskLevel = firstActive.riskLevel;

    if (riskLevel === 'critical' || riskLevel === 'danger') {
      return {
        summary: `Your workload tracking indicates high scheduling density for "${firstActive.title}". Your daily effort required is hovering near limits, placing completion metrics at risk.`,
        productivityAnalysis: `Completion at ${firstActive.progress}%. Current output pace is lagging behind the recommended ${firstActive.hoursPerDay}h daily budget due to Day 1 load spikes.`,
        suggestions: [
          'Deploy the Negotiation Agent to draft professional extension proposals for safety margin gates.',
          'Trigger the AI Load Balancer to redistribute tomorrow\'s afternoon tasks smoothly.'
        ],
        tomorrowRecommendations: 'Execute tomorrow\'s high-energy Morning focus blocks immediately. Avoid postponing neural cleaning tasks.'
      };
    }

    return {
      summary: `You are pacing comfortably for "${firstActive.title}". All current subtasks are mapped within your available ${firstActive.hoursPerDay} hours per day budget.`,
      productivityAnalysis: `Aggregate completion rate is outstanding at ${completionRate}% across all deliverables. Your risk rating is sitting comfortably in the safe zone.`,
      suggestions: [
        'Study practice sheets early to unlock advanced learning summaries.',
        'Use freed evening blocks to maintain deep-work habits.'
      ],
      tomorrowRecommendations: 'Maintain current steady pacing. Review relational calculus or final draft materials on Day 2.'
    };
  };

  const data = getReflectionData();

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
        <span className="text-[9px] font-mono font-bold text-fuchsia-400 px-2 py-0.5 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded">Active</span>
      </div>

      <div className="space-y-3">
        <div className="bg-black/25 rounded-xl p-4 border border-slate-900 space-y-3.5">
          <div className="space-y-1">
            <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500 block">Daily Retrospective Brief</span>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">{data.summary}</p>
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

          <div className="space-y-1.5 border-t border-slate-900 pt-3">
            <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500 block">Improvement Recommendations</span>
            <div className="space-y-1">
              {data.suggestions.map((sug, idx) => (
                <div key={idx} className="flex gap-2 items-start text-[10px]">
                  <Sparkles className="w-3 h-3 text-fuchsia-400 shrink-0 mt-0.5" />
                  <span className="text-slate-300">{sug}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-900 pt-3 bg-fuchsia-500/[0.02] p-2 rounded-lg border border-fuchsia-500/5">
            <span className="text-[9px] font-mono uppercase tracking-widest text-fuchsia-400 block font-semibold">Tomorrow's Routine Directives</span>
            <p className="text-[11px] text-slate-300 leading-relaxed mt-1 italic">"{data.tomorrowRecommendations}"</p>
          </div>
        </div>
      </div>
    </div>
  );
}
