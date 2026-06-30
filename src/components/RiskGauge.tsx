import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, Skull } from 'lucide-react';
import { RiskLevelType } from '../types';

interface RiskGaugeProps {
  score: number;
  level: RiskLevelType;
  predictedDate: string;
  recommendedAction: string;
}

export default function RiskGauge({ score, level, predictedDate, recommendedAction }: RiskGaugeProps) {
  // Determine color theme based on level
  const getColorScheme = () => {
    switch (level) {
      case 'safe':
        return {
          stroke: '#10b981',
          bg: 'rgba(16, 185, 129, 0.1)',
          text: 'text-emerald-400',
          border: 'border-emerald-500/20',
          icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
        };
      case 'caution':
        return {
          stroke: '#f59e0b',
          bg: 'rgba(245, 158, 11, 0.1)',
          text: 'text-amber-400',
          border: 'border-amber-500/20',
          icon: <AlertTriangle className="w-6 h-6 text-amber-400" />,
        };
      case 'danger':
        return {
          stroke: '#ef4444',
          bg: 'rgba(239, 68, 68, 0.1)',
          text: 'text-red-400',
          border: 'border-red-500/20',
          icon: <ShieldAlert className="w-6 h-6 text-red-400" />,
        };
      case 'critical':
        return {
          stroke: '#dc2626',
          bg: 'rgba(220, 38, 38, 0.15)',
          text: 'text-rose-500 font-bold animate-pulse',
          border: 'border-rose-600/30 critical-pulse',
          icon: <Skull className="w-6 h-6 text-rose-500 animate-bounce" />,
        };
      default:
        return {
          stroke: '#6366f1',
          bg: 'rgba(99, 102, 241, 0.1)',
          text: 'text-indigo-400',
          border: 'border-indigo-500/20',
          icon: <ShieldCheck className="w-6 h-6 text-indigo-400" />,
        };
    }
  };

  const scheme = getColorScheme();
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div id="risk-gauge-container" className={`bg-[#0e0e1b] border ${scheme.border} rounded-2xl p-6 flex flex-col items-center justify-between shadow-2xl h-full`}>
      <div className="w-full flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium uppercase tracking-wider text-slate-400 font-display">Failure Risk Assessment</h3>
        <span className="p-2 rounded-xl bg-[#15152a]">{scheme.icon}</span>
      </div>

      <div className="relative flex items-center justify-center my-2">
        <svg className="w-36 h-36 transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="72"
            cy="72"
            r={radius}
            className="stroke-slate-800"
            strokeWidth="10"
            fill="transparent"
          />
          {/* Active indicator circle */}
          <circle
            cx="72"
            cy="72"
            r={radius}
            stroke={scheme.stroke}
            strokeWidth="10"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-3xl font-bold font-mono text-white tracking-tight">{Math.round(score)}%</span>
          <span className={`text-[10px] font-semibold uppercase tracking-widest ${scheme.text}`}>{level}</span>
        </div>
      </div>

      <div className="w-full text-center space-y-3 mt-4">
        <div className="bg-[#15152a] rounded-xl p-3 border border-slate-800/40">
          <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Predicted Completion Date</p>
          <p className="text-sm font-semibold text-slate-200 mt-0.5">{formatDate(predictedDate)}</p>
        </div>

        <div className="text-left bg-black/20 rounded-xl p-3 border border-slate-800/20">
          <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-widest block mb-1">Guardian Directive:</span>
          <p className="text-xs text-slate-300 leading-relaxed">{recommendedAction}</p>
        </div>
      </div>
    </div>
  );
}
