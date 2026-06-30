import React, { useState, useEffect } from 'react';
import { HelpCircle, RefreshCw, AlertTriangle, Play, HelpCircle as InfoIcon } from 'lucide-react';
import { RiskLevelType } from '../types';

interface WhatIfSimulationProps {
  baselineRisk: number;
  onSimulationChange?: (simulatedRisk: number, simulatedLevel: RiskLevelType) => void;
}

export default function WhatIfSimulation({ baselineRisk, onSimulationChange }: WhatIfSimulationProps) {
  const [procrastination, setProcrastination] = useState(0); // 0-100%
  const [hoursReduction, setHoursReduction] = useState(0); // 0-5 hours per day
  const [delayDays, setDelayDays] = useState(0); // 0-7 days

  const [simulatedRisk, setSimulatedRisk] = useState(baselineRisk);
  const [simulatedLevel, setSimulatedLevel] = useState<RiskLevelType>('safe');

  // Reset sliders when a different baseline risk is loaded (active deadline changed)
  useEffect(() => {
    setProcrastination(0);
    setHoursReduction(0);
    setDelayDays(0);
  }, [baselineRisk]);

  // Recalculate simulated risk based on inputs
  useEffect(() => {
    // Standard simulation scoring model
    const procrastinationImpact = procrastination * 0.25; // max +25%
    const sicknessImpact = hoursReduction * 8; // max +40%
    const delayImpact = delayDays * 7.5; // max +52.5%
    
    const combinedRisk = Math.min(100, Math.max(0, baselineRisk + procrastinationImpact + sicknessImpact + delayImpact));
    setSimulatedRisk(combinedRisk);

    let level: RiskLevelType = 'safe';
    if (combinedRisk > 85) level = 'critical';
    else if (combinedRisk > 60) level = 'danger';
    else if (combinedRisk > 35) level = 'caution';
    else level = 'safe';

    setSimulatedLevel(level);

    if (onSimulationChange) {
      onSimulationChange(combinedRisk, level);
    }
  }, [procrastination, hoursReduction, delayDays, baselineRisk]);

  const handleReset = () => {
    setProcrastination(0);
    setHoursReduction(0);
    setDelayDays(0);
  };

  const getLevelColor = (lvl: RiskLevelType) => {
    switch (lvl) {
      case 'safe': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'caution': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'danger': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'critical': return 'text-rose-500 bg-rose-500/15 border-rose-600/30 critical-pulse';
    }
  };

  return (
    <div id="what-if-simulation" className="bg-[#0e0e1b] border border-slate-800/80 rounded-2xl p-6 shadow-2xl space-y-5">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 font-display flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-indigo-400" />
            "What If" Simulator
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">Stress-test your timeline and visualize failure trigger points</p>
        </div>
        <button 
          onClick={handleReset}
          className="p-1.5 rounded-lg bg-[#15152a] hover:bg-[#1c1c38] text-slate-400 hover:text-white transition-all border border-slate-800/65"
          title="Reset sliders"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Comparison Gauge */}
      <div className="grid grid-cols-2 gap-4 bg-black/25 rounded-xl p-4 border border-slate-800/30">
        <div className="text-center border-r border-slate-800/60 pr-2">
          <p className="text-[9px] font-mono uppercase tracking-wider text-slate-500">Baseline Risk</p>
          <p className="text-2xl font-bold font-mono text-slate-400 mt-1">{Math.round(baselineRisk)}%</p>
          <p className="text-[9px] text-slate-500 italic mt-0.5">Static AI prediction</p>
        </div>

        <div className="text-center pl-2">
          <p className="text-[9px] font-mono uppercase tracking-wider text-slate-400">Simulated Risk</p>
          <p className="text-2xl font-bold font-mono text-white mt-1">{Math.round(simulatedRisk)}%</p>
          <span className={`inline-block text-[8px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full border mt-1 ${getLevelColor(simulatedLevel)}`}>
            {simulatedLevel}
          </span>
        </div>
      </div>

      {/* Simulated Sliders */}
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="sim-procrastination" className="text-xs text-slate-300 font-medium">Procrastination Factor</label>
            <span className="text-xs font-mono font-medium text-slate-400">{procrastination}%</span>
          </div>
          <input
            id="sim-procrastination"
            type="range"
            min="0"
            max="100"
            className="w-full accent-indigo-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            value={procrastination}
            onChange={(e) => setProcrastination(Number(e.target.value))}
          />
          <p className="text-[10px] text-slate-500 leading-normal">Simulates high-fatigue days or delayed daily startup windows.</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="sim-hours-reduction" className="text-xs text-slate-300 font-medium">Study/Work Hours Slashed</label>
            <span className="text-xs font-mono font-medium text-slate-400">-{hoursReduction} hrs/day</span>
          </div>
          <input
            id="sim-hours-reduction"
            type="range"
            min="0"
            max="5"
            step="0.5"
            className="w-full accent-indigo-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            value={hoursReduction}
            onChange={(e) => setHoursReduction(Number(e.target.value))}
          />
          <p className="text-[10px] text-slate-500 leading-normal">Simulates getting sick or handling parallel personal emergencies.</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="sim-delay-days" className="text-xs text-slate-300 font-medium">Schedule Entry Delay</label>
            <span className="text-xs font-mono font-medium text-slate-400">+{delayDays} days</span>
          </div>
          <input
            id="sim-delay-days"
            type="range"
            min="0"
            max="7"
            className="w-full accent-indigo-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            value={delayDays}
            onChange={(e) => setDelayDays(Number(e.target.value))}
          />
          <p className="text-[10px] text-slate-500 leading-normal">Simulates postponing starting your first scheduled subtask.</p>
        </div>
      </div>

      {/* Dynamic Simulation Verdict */}
      {simulatedRisk > 75 && (
        <div className="flex gap-2.5 bg-rose-500/5 border border-rose-500/10 rounded-xl p-3 text-xs leading-relaxed text-rose-300 animate-pulse">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
          <div>
            <span className="font-semibold block">Critical Bottleneck Breach</span>
            In this scenario, completing the deadline on time is statistically improbable. You must trigger the <strong className="text-rose-400">Negotiation Agent</strong> or drop unessential tasks.
          </div>
        </div>
      )}
    </div>
  );
}
