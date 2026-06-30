import React from 'react';
import { History, Activity, ShieldCheck, FileText, Sparkles } from 'lucide-react';

interface RecentActivityProps {
  activities: string[];
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  const getIcon = (text: string) => {
    if (text.includes('Seeded') || text.includes('loaded')) return <Sparkles className="w-3 h-3 text-amber-400" />;
    if (text.includes('Syllabus') || text.includes('Parsed')) return <FileText className="w-3 h-3 text-indigo-400" />;
    if (text.includes('Conflict') || text.includes('balance')) return <ShieldCheck className="w-3 h-3 text-emerald-400" />;
    return <Activity className="w-3 h-3 text-slate-400" />;
  };

  return (
    <div id="recent-activity-widget" className="bg-[#0e0e1b] border border-slate-800/80 rounded-2xl p-4 shadow-2xl space-y-3">
      <div className="flex items-center gap-2">
        <History className="w-4 h-4 text-slate-400" />
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-display">System Execution Logs</h4>
      </div>

      <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
        {activities.map((act, index) => (
          <div key={index} className="flex gap-2.5 items-start text-[10px] leading-relaxed">
            <span className="p-1 rounded bg-[#15152a] mt-0.5 shrink-0">
              {getIcon(act)}
            </span>
            <div className="flex-1 text-slate-400 border-b border-slate-900/40 pb-1.5 last:border-b-0">
              {act}
            </div>
          </div>
        ))}
        {activities.length === 0 && (
          <p className="text-center text-xs text-slate-500 italic py-6">No historical system logs parsed.</p>
        )}
      </div>
    </div>
  );
}
