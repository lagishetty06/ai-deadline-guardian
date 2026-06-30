import React from 'react';
import { CalendarRange, AlertTriangle, CheckCircle2, Shuffle, Sparkles } from 'lucide-react';
import { Deadline, Subtask } from '../types';

interface ConflictDetectorProps {
  deadlines: Deadline[];
  onAutoResolve: () => void;
}

export default function ConflictDetector({ deadlines, onAutoResolve }: ConflictDetectorProps) {
  // Aggregate tasks by schedule day to check for overload and overlaps
  const dailyAllocations: { [dayNum: number]: { tasks: { taskTitle: string; deadlineTitle: string; hours: number; timeBlock: string }[]; totalHours: number } } = {};
  
  // Also get the maximum study capacity
  const studyCapacity = deadlines.length > 0 ? deadlines[0].hoursPerDay : 4;

  deadlines.forEach(dl => {
    dl.subtasks.forEach(task => {
      if (dl.status === 'completed' || task.completed) return;
      
      const day = task.scheduleDay;
      if (!dailyAllocations[day]) {
        dailyAllocations[day] = { tasks: [], totalHours: 0 };
      }
      dailyAllocations[day].tasks.push({
        taskTitle: task.title,
        deadlineTitle: dl.title,
        hours: task.effortHours,
        timeBlock: task.timeBlock
      });
      dailyAllocations[day].totalHours += task.effortHours;
    });
  });

  const conflicts: { type: 'overload' | 'overlap'; message: string; details: string; day: number }[] = [];

  Object.entries(dailyAllocations).forEach(([dayStr, data]) => {
    const day = Number(dayStr);
    
    // 1. Capacity Overload Conflict
    if (data.totalHours > studyCapacity) {
      conflicts.push({
        type: 'overload',
        day,
        message: `Capacity overload on Day ${day}`,
        details: `${data.totalHours} hours of tasks planned, but your daily study capacity is set to ${studyCapacity} hours.`
      });
    }

    // 2. Time block overlapping conflict
    const blockCounts: { [block: string]: string[] } = {};
    data.tasks.forEach(t => {
      if (!blockCounts[t.timeBlock]) blockCounts[t.timeBlock] = [];
      blockCounts[t.timeBlock].push(t.taskTitle);
    });

    Object.entries(blockCounts).forEach(([block, taskTitles]) => {
      if (taskTitles.length > 1) {
        conflicts.push({
          type: 'overlap',
          day,
          message: `Overlap in ${block} block on Day ${day}`,
          details: `Multiple tasks scheduled simultaneously: "${taskTitles[0]}" and "${taskTitles[1]}".`
        });
      }
    });
  });

  return (
    <div id="conflict-detector" className="bg-[#0e0e1b] border border-slate-800/80 rounded-2xl p-6 shadow-2xl space-y-4">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 font-display flex items-center gap-2">
          <CalendarRange className="w-4 h-4 text-indigo-400" />
          Calendar Conflict Monitor
        </h3>
        <p className="text-[11px] text-slate-500 mt-0.5">Scans schedule tracks and aggregates workloads across concurrent projects</p>
      </div>

      {conflicts.length === 0 ? (
        <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4 flex gap-3 items-center">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <h4 className="text-xs font-semibold text-emerald-400">Zero Schedule Conflicts</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">All tasks are balanced perfectly within your available {studyCapacity} hour study budget.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="space-y-2 max-h-56 overflow-y-auto">
            {conflicts.map((conflict, idx) => (
              <div key={idx} className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-3 flex gap-3 items-start">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <h4 className="text-xs font-semibold text-amber-400">{conflict.message}</h4>
                  <p className="text-[10px] text-slate-300 leading-normal">{conflict.details}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={onAutoResolve}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs py-2 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/15"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            AI Load-Balance Schedule
          </button>
        </div>
      )}
    </div>
  );
}
