import React, { Suspense, useState } from 'react';
import {
  Brain,
  LayoutDashboard,
  ListTodo,
  Calendar,
  GraduationCap,
  Cpu,
  AlertTriangle,
  Smile,
  Settings,
  Plus,
  Trash2,
  Loader2,
  Sparkles,
  Zap,
  Activity,
  CheckCircle2,
  Clock,
  User,
  Briefcase,
  Palette,
  Bell,
  Info,
  LogOut,
  Download,
  RefreshCw,
  Sun,
  Moon,
  ShieldAlert
} from 'lucide-react';
import LandingHero from './LandingHero';
import { Deadline, Subtask, CategoryType } from '../types';

import RiskGauge from './RiskGauge';
import AgentPipeline from './AgentPipeline';
import SyllabusParser from './SyllabusParser';
import WhatIfSimulation from './WhatIfSimulation';
import ConflictDetector from './ConflictDetector';
import NegotiationPanel from './NegotiationPanel';
import VoiceInput from './VoiceInput';
import AIStatus from './AIStatus';
import AISuggestions from './AISuggestions';
import RecentActivity from './RecentActivity';
import RecentNotifications from './RecentNotifications';
import ReflectionAgent from './ReflectionAgent';

interface WorkspaceHubProps {
  activeTab: 'dashboard' | 'goals' | 'calendar' | 'learning' | 'agents' | 'risk' | 'reflection' | 'settings';
  setActiveTab: (tab: 'dashboard' | 'goals' | 'calendar' | 'learning' | 'agents' | 'risk' | 'reflection' | 'settings') => void;
  deadlines: Deadline[];
  activeDeadline: Deadline | undefined;
  selectedId: string;
  setSelectedId: (id: string) => void;
  isAnalyzing: boolean;
  currentStep: number;
  productivityScore: number;
  simulatedRiskOverride: number | null;
  simulatedLevelOverride: 'safe' | 'caution' | 'danger' | 'critical' | null;
  setSimulatedRiskOverride: (v: number | null) => void;
  setSimulatedLevelOverride: (v: 'safe' | 'caution' | 'danger' | 'critical' | null) => void;
  displayRisk: number;
  displayLevel: 'safe' | 'caution' | 'danger' | 'critical';
  newTitle: string;
  setNewTitle: (v: string) => void;
  newDueDate: string;
  setNewDueDate: (v: string) => void;
  newCategory: CategoryType;
  setNewCategory: (v: CategoryType) => void;
  newHoursPerDay: number;
  setNewHoursPerDay: (v: number) => void;
  newDescription: string;
  setNewDescription: (v: string) => void;
  formErrors: { title?: boolean; dueDate?: boolean; category?: boolean; hoursPerDay?: boolean };
  setFormErrors: React.Dispatch<React.SetStateAction<{ title?: boolean; dueDate?: boolean; category?: boolean; hoursPerDay?: boolean }>>;
  handleCreateDeadline: (title: string, dueDate: string, category: CategoryType, hoursPerDay: number, description: string) => void;
  handleDeleteDeadline: (id: string, e: React.MouseEvent) => void;
  handleImportSyllabus: (importedDeadlines: any[]) => void;
  handleResolveConflicts: () => void;
  handleClearAll: () => void;
  handleLoadDemoData: () => void;
  handleToggleSubtask: (deadlineId: string, subtaskId: string) => void;
  notifications: any[];
  activities: any[];
  handleDismissNotification: (id: string) => void;
  setSelectedSubtask: (task: any) => void;
  isLoadBalancing?: boolean;
  handleLogout: () => void;
}

export default function WorkspaceHub({
  activeTab,
  setActiveTab,
  deadlines,
  activeDeadline,
  selectedId,
  setSelectedId,
  isAnalyzing,
  currentStep,
  productivityScore,
  simulatedRiskOverride,
  simulatedLevelOverride,
  setSimulatedRiskOverride,
  setSimulatedLevelOverride,
  displayRisk,
  displayLevel,
  newTitle,
  setNewTitle,
  newDueDate,
  setNewDueDate,
  newCategory,
  setNewCategory,
  newHoursPerDay,
  setNewHoursPerDay,
  newDescription,
  setNewDescription,
  formErrors,
  setFormErrors,
  handleCreateDeadline,
  handleDeleteDeadline,
  handleImportSyllabus,
  handleResolveConflicts,
  handleClearAll,
  handleLoadDemoData,
  handleToggleSubtask,
  notifications,
  activities,
  handleDismissNotification,
  setSelectedSubtask,
  isLoadBalancing = false,
  handleLogout
}: WorkspaceHubProps) {
  // Settings view interactive states
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [settingsSubTab, setSettingsSubTab] = useState('workspace');
  const [themeType, setThemeType] = useState('midnight');
  const [layoutDensity, setLayoutDensity] = useState('comfortable');
  const [aiModel, setAiModel] = useState('gemini-3.5-flash');
  const [aiTemp, setAiTemp] = useState(0.45);
  const [notifySound, setNotifySound] = useState(true);
  const [notifyAutoSchedule, setNotifyAutoSchedule] = useState(true);

  return (
    <div className="space-y-6">
      {/* 1. DASHBOARD VIEW (WHEN POPULATED OR EMPTY LANDING) */}
      {activeTab === 'dashboard' && (
        deadlines.length === 0 ? (
          <LandingHero
            isAnalyzing={isAnalyzing}
            currentStep={currentStep}
            handleLoadDemoData={handleLoadDemoData}
            setActiveTab={setActiveTab}
            agentPipelineEl={<AgentPipeline isRunning={isAnalyzing} currentStep={currentStep || 10} />}
          />
        ) : (
          <div className="space-y-6 animate-fade-in">
            {/* Summary Row */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-[#0e0e1b] border border-slate-800/80 rounded-2xl p-4 space-y-1 shadow-lg">
                <span className="text-[10px] font-mono text-slate-500 font-semibold uppercase tracking-wider block">Workspace Score</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-fuchsia-400 font-display">{productivityScore}%</span>
                  <span className="text-[10px] text-slate-400">avg completion</span>
                </div>
              </div>
              <div className="bg-[#0e0e1b] border border-slate-800/80 rounded-2xl p-4 space-y-1 shadow-lg">
                <span className="text-[10px] font-mono text-slate-500 font-semibold uppercase tracking-wider block">Active Guardians</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-indigo-400 font-display">{deadlines.length}</span>
                  <span className="text-[10px] text-slate-400">tracks online</span>
                </div>
              </div>
              <div className="bg-[#0e0e1b] border border-slate-800/80 rounded-2xl p-4 space-y-1 shadow-lg">
                <span className="text-[10px] font-mono text-slate-500 font-semibold uppercase tracking-wider block">Active Tasks</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-slate-200 font-display">
                    {deadlines.reduce((acc, curr) => acc + curr.subtasks.filter(t => !t.completed).length, 0)}
                  </span>
                  <span className="text-[10px] text-slate-400">items remaining</span>
                </div>
              </div>
              <div className="bg-[#0e0e1b] border border-slate-800/80 rounded-2xl p-4 space-y-1 shadow-lg">
                <span className="text-[10px] font-mono text-slate-500 font-semibold uppercase tracking-wider block">System Health</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-xs font-semibold text-emerald-400 font-mono">NOMINAL</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              {/* Left: Active goal rails & alerts (span 4) */}
              <div className="xl:col-span-4 space-y-6">
                <div className="bg-[#0e0e1b] border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-900">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-display">Active Guardians</h3>
                      <p className="text-[10px] text-slate-500 mt-0.5">Select target workspace to sync live metrics</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {deadlines.map((dl) => {
                      const isSelected = dl.id === selectedId;
                      const completedCount = dl.subtasks.filter(t => t.completed).length;
                      const totalCount = dl.subtasks.length;
                      const daysRemaining = Math.max(0, Math.ceil((new Date(dl.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
                      return (
                        <div
                          key={dl.id}
                          onClick={() => {
                            setSelectedId(dl.id);
                            setSimulatedRiskOverride(null);
                            setSimulatedLevelOverride(null);
                          }}
                          className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden flex justify-between items-center ${
                            isSelected
                              ? 'bg-indigo-600/10 border-indigo-500/60 shadow-lg'
                              : 'bg-black/25 border-slate-900/60 hover:border-slate-800 hover:bg-black/40'
                          }`}
                        >
                          <div className="space-y-2 flex-1 min-w-0 pr-4">
                            <div className="flex items-center gap-2">
                              <span className={`text-[8px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                                dl.riskLevel === 'critical' ? 'bg-red-500/10 text-red-400 border border-red-500/15 animate-pulse' :
                                dl.riskLevel === 'danger' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/15' :
                                dl.riskLevel === 'caution' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/15' :
                                'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15'
                              }`}>
                                {dl.riskLevel}
                              </span>
                              <h4 className="text-xs font-bold text-slate-200 truncate">{dl.title}</h4>
                            </div>
                            <div className="w-full bg-slate-800/60 h-1 rounded-full overflow-hidden">
                              <div className="bg-indigo-500 h-full transition-all" style={{ width: `${dl.progress}%` }}></div>
                            </div>
                            <div className="flex justify-between items-center text-[9px] font-mono text-slate-500">
                              <span>{completedCount}/{totalCount} tasks</span>
                              <span>{dl.progress}% done</span>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-[10px] font-mono font-bold text-slate-400 block">{daysRemaining}d</span>
                            <span className="text-[8px] text-slate-500 uppercase block font-mono">left</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Smart Recommendations */}
                <div className="bg-[#0e0e1b] border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-display flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
                      Smart Advice
                    </h3>
                  </div>
                  <AISuggestions
                    deadlines={deadlines}
                    onAutoResolve={handleResolveConflicts}
                    onSelectDeadline={(id) => {
                      setSelectedId(id);
                      setSimulatedRiskOverride(null);
                      setSimulatedLevelOverride(null);
                    }}
                  />
                </div>
              </div>

              {/* Middle: Gauges, simulated risk models, pipeline logs (span 5) */}
              <div className="xl:col-span-5 space-y-6">
                {activeDeadline ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                      <div className="md:col-span-2">
                        <RiskGauge
                          score={displayRisk}
                          level={displayLevel}
                          predictedDate={activeDeadline.dueDate}
                          recommendedAction={activeDeadline.recommendedAction}
                        />
                      </div>
                      <div className="md:col-span-3">
                        <WhatIfSimulation
                          baselineRisk={activeDeadline.riskScore}
                          onSimulationChange={(simRisk, simLvl) => {
                            setSimulatedRiskOverride(simRisk);
                            setSimulatedLevelOverride(simLvl);
                          }}
                        />
                      </div>
                    </div>

                    {displayRisk > 75 && activeDeadline.negotiation && (
                      <NegotiationPanel
                        negotiation={activeDeadline.negotiation}
                        deadlineTitle={activeDeadline.title}
                      />
                    )}

                    <AgentPipeline isRunning={isAnalyzing} currentStep={currentStep} />
                  </>
                ) : (
                  <div className="bg-[#0e0e1b] border border-slate-800/80 rounded-2xl p-12 text-center text-slate-500 h-full flex flex-col items-center justify-center">
                    <Brain className="w-12 h-12 text-slate-700 animate-pulse mb-3" />
                    <p className="text-sm font-semibold text-slate-400">Deploy a Deadline Profile</p>
                    <p className="text-xs text-slate-600 mt-1 max-w-xs">Once a target is created, the multi-agent guardian pipeline will process tasks and model fail metrics here.</p>
                  </div>
                )}
              </div>

              {/* Right: Coach allocations & Checklist (span 3) */}
              <div className="xl:col-span-3 space-y-6">
                {activeDeadline && (
                  <>
                    {/* Coach card */}
                    <div className="bg-[#0e0e1b] border border-slate-800/80 rounded-2xl p-6 shadow-2xl space-y-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-display flex items-center gap-1.5">
                          <Smile className="w-4 h-4 text-amber-400" />
                          Daily Coach
                        </h3>
                        <span className="text-[9px] font-mono text-indigo-400 font-bold px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded">Today</span>
                      </div>

                      <div className="space-y-3 bg-black/25 rounded-xl p-4 border border-slate-800/20">
                        <p className="text-[11px] text-slate-300 leading-normal italic">
                          {activeDeadline.dailyCoach?.greeting 
                            ? `"${activeDeadline.dailyCoach.greeting}"` 
                            : `"Hello, your current capacity is configured to ${activeDeadline.hoursPerDay}h daily."`}
                        </p>
                        {activeDeadline.dailyCoach?.focusMessage && (
                          <p className="text-[10px] text-slate-400 leading-relaxed">
                            {activeDeadline.dailyCoach.focusMessage}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Checklist */}
                    <div className="bg-[#0e0e1b] border border-slate-800/80 rounded-2xl p-6 shadow-2xl space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-display flex items-center gap-1.5">
                          <ListTodo className="w-4 h-4 text-indigo-400" />
                          Subtask Checklist
                        </h3>
                        <span className="text-[10px] text-slate-500 font-mono font-bold">
                          {activeDeadline.subtasks.filter(t => t.completed).length}/{activeDeadline.subtasks.length}
                        </span>
                      </div>

                      <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                        {activeDeadline.subtasks.map((task) => (
                          <div
                            key={task.id}
                            className={`p-3 rounded-xl border flex gap-3 transition-all ${
                              task.completed
                                ? 'bg-[#15152a]/20 border-emerald-500/15 opacity-60'
                                : 'bg-[#15152a] border-slate-800/80'
                            }`}
                          >
                            <button
                              onClick={() => handleToggleSubtask(activeDeadline.id, task.id)}
                              className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                                task.completed ? 'bg-emerald-500 border-emerald-400' : 'border-slate-800 bg-black/40'
                              }`}
                            >
                              {task.completed && <CheckCircle2 className="w-3 h-3 text-white" />}
                            </button>
                            <div className="space-y-1 flex-1 pr-1">
                              <h4 className={`text-[11px] font-bold leading-normal ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                                {task.title}
                              </h4>
                              <p className="text-[9px] text-slate-500 line-clamp-2 leading-relaxed">{task.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )
      )}

      {/* 2. GOALS VIEW */}
      {activeTab === 'goals' && (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Initialize Goal */}
            <div className="bg-[#0e0e1b] border border-slate-800/80 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="space-y-1">
                <span className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 inline-block mb-1">
                  <Plus className="w-5 h-5" />
                </span>
                <h3 className="text-base font-bold text-white font-display">Initialize Custom Goal</h3>
                <p className="text-xs text-slate-400 leading-normal">
                  Define exam timelines or technical project milestones to deploy our 9-agent planning system.
                </p>
              </div>

              <div className="space-y-3 pt-1">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <input
                      type="text"
                      className={`w-full bg-black/40 border ${formErrors.title ? 'border-rose-500/80 ring-1 ring-rose-500/50' : 'border-slate-800'} rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 ${formErrors.title ? 'focus:ring-rose-500' : 'focus:ring-indigo-500'} transition-all`}
                      placeholder="e.g. DBMS Normalization Midterm or Capstone Submit"
                      value={newTitle}
                      onChange={(e) => {
                        setNewTitle(e.target.value);
                        if (formErrors.title) setFormErrors(prev => ({ ...prev, title: false }));
                      }}
                    />
                  </div>
                  <VoiceInput onTranscriptChange={(text) => {
                    setNewTitle(text);
                    if (formErrors.title) setFormErrors(prev => ({ ...prev, title: false }));
                  }} />
                </div>
                {formErrors.title && (
                  <p className="text-[10px] text-rose-400 font-mono mt-0.5">Please provide a valid goal title.</p>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">Due Date</label>
                    <input
                      type="date"
                      className={`w-full bg-black/40 border ${formErrors.dueDate ? 'border-rose-500/80 ring-1 ring-rose-500/50' : 'border-slate-800'} rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 ${formErrors.dueDate ? 'focus:ring-rose-500' : 'focus:ring-indigo-500'} font-mono`}
                      value={newDueDate}
                      onChange={(e) => {
                        setNewDueDate(e.target.value);
                        if (formErrors.dueDate) setFormErrors(prev => ({ ...prev, dueDate: false }));
                      }}
                    />
                    {formErrors.dueDate && (
                      <p className="text-[9px] text-rose-400 font-mono mt-0.5">Select a valid due date.</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">Category</label>
                    <select
                      className={`w-full bg-black/40 border ${formErrors.category ? 'border-rose-500/80 ring-1 ring-rose-500/50' : 'border-slate-800'} rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 ${formErrors.category ? 'focus:ring-rose-500' : 'focus:ring-indigo-500'}`}
                      value={newCategory}
                      onChange={(e) => {
                        setNewCategory(e.target.value as CategoryType);
                        if (formErrors.category) setFormErrors(prev => ({ ...prev, category: false }));
                      }}
                    >
                      <option value="exam">Exam Study</option>
                      <option value="project">Project Deliverable</option>
                      <option value="interview">Interview Practice</option>
                      <option value="assignment">Homework Assignment</option>
                      <option value="work">Work Statement</option>
                    </select>
                    {formErrors.category && (
                      <p className="text-[9px] text-rose-400 font-mono mt-0.5">Select a category.</p>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">Daily Study Capacity (Hours)</label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    className={`w-full bg-black/40 border ${formErrors.hoursPerDay ? 'border-rose-500/80 ring-1 ring-rose-500/50' : 'border-slate-800'} rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 ${formErrors.hoursPerDay ? 'focus:ring-rose-500' : 'focus:ring-indigo-500'} font-mono`}
                    value={newHoursPerDay}
                    onChange={(e) => {
                      setNewHoursPerDay(Number(e.target.value));
                      if (formErrors.hoursPerDay) setFormErrors(prev => ({ ...prev, hoursPerDay: false }));
                    }}
                  />
                  {formErrors.hoursPerDay && (
                    <p className="text-[9px] text-rose-400 font-mono mt-0.5">Enter a valid capacity.</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">Milestone Notes (Optional)</label>
                  <textarea
                    rows={2}
                    className="w-full bg-black/40 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans resize-none"
                    placeholder="Special focus areas or references..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                  />
                </div>

                <button
                  onClick={() => {
                    console.log("WorkspaceHub Deploy Guardian clicked directly! Inputs:", { newTitle, newDueDate, newCategory, newHoursPerDay, newDescription });
                    handleCreateDeadline(newTitle, newDueDate, newCategory, newHoursPerDay, newDescription);
                  }}
                  disabled={isAnalyzing}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800/80 text-white font-semibold text-xs py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/15 cursor-pointer"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      Deploying Guardian...
                    </>
                  ) : (
                    'Deploy Guardian'
                  )}
                </button>
              </div>
            </div>

            {/* Syllabus parser */}
            <div className="bg-[#0e0e1b] border border-slate-800/80 rounded-2xl p-6 shadow-xl h-full flex flex-col justify-between">
              <SyllabusParser onImportDeadlines={handleImportSyllabus} />
            </div>
          </div>

          {/* Goals list table */}
          <div className="bg-[#0e0e1b] border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 font-display">Active Deadline Tracking Profiles</h3>
              <p className="text-xs text-slate-500 mt-0.5">Manage and monitor current tracks initialized with the AI planning system</p>
            </div>
            {deadlines.length === 0 ? (
              <div className="text-center py-12 text-slate-600 italic text-xs">
                No active goal profiles are currently configured. Seed demo data or initialize a custom track above.
              </div>
            ) : (
              <div className="space-y-4">
                {deadlines.map((dl) => {
                  const daysRemaining = Math.max(0, Math.ceil((new Date(dl.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
                  return (
                    <div key={dl.id} className="p-4 bg-black/30 border border-slate-900 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                            dl.riskLevel === 'critical' ? 'bg-red-500/10 text-red-400 border border-red-500/15' : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/15'
                          }`}>
                            {dl.category}
                          </span>
                          <h4 className="text-sm font-bold text-slate-200">{dl.title}</h4>
                        </div>
                        <p className="text-xs text-slate-400 font-sans max-w-xl">{dl.description || 'No custom description provided.'}</p>
                      </div>
                      <div className="flex items-center gap-6 shrink-0 justify-between sm:justify-end">
                        <div className="text-right font-mono">
                          <span className="text-xs text-slate-400 block font-bold">{daysRemaining} days left</span>
                          <span className="text-[10px] text-indigo-400 block">{dl.hoursPerDay}h study cap</span>
                        </div>
                        <button
                          onClick={(e) => handleDeleteDeadline(dl.id, e)}
                          className="p-2 rounded-lg bg-red-500/5 border border-red-500/10 text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all cursor-pointer"
                          title="Dismiss Track"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. CALENDAR VIEW */}
      {activeTab === 'calendar' && (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
          {activeDeadline ? (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {/* Daily focus regimen */}
              <div className="md:col-span-2 bg-[#0e0e1b] border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex justify-between items-start border-b border-slate-900 pb-3">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 font-display">Daily Focus Regimen</h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">Energy levels optimized by Daily Coach Agent</p>
                  </div>
                  <span className="text-[9px] font-mono text-emerald-400 font-bold px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded">Active</span>
                </div>

                <div className="space-y-3 pt-2">
                  <p className="text-xs text-slate-300 leading-relaxed font-sans italic bg-black/20 p-3 rounded-xl border border-slate-900">
                    {activeDeadline.dailyCoach?.greeting 
                      ? `"${activeDeadline.dailyCoach.greeting}"` 
                      : `"Your pacing is stable. Let's make progress on today's tasks."`}
                  </p>
                  {activeDeadline.dailyCoach?.focusMessage && (
                    <p className="text-xs text-slate-400 leading-normal">
                      {activeDeadline.dailyCoach.focusMessage}
                    </p>
                  )}
                  <div className="border-t border-slate-900 pt-3">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 block">Total Workload Allocation</span>
                    <p className="text-xs font-semibold text-slate-300 mt-1">
                      Allocated Study Time: <span className="font-mono text-indigo-400 font-bold">{activeDeadline.hoursPerDay} hours/day</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Timeline slots */}
              <div className="md:col-span-3 bg-[#0e0e1b] border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 font-display">Daily Calendar Slots</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Time blocking calculated across goals without manual overhead</p>
                </div>

                <div className="space-y-3">
                  {activeDeadline.dailyCoach?.timeBlocks && activeDeadline.dailyCoach.timeBlocks.length > 0 ? (
                    activeDeadline.dailyCoach.timeBlocks.map((block, idx) => (
                      <div key={idx} className="bg-black/20 border border-slate-900 rounded-xl p-4 flex justify-between items-center gap-4">
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest block">{block.time}</span>
                          <h4 className="text-xs font-bold text-slate-200">{block.task}</h4>
                          {block.tip && <p className="text-[10px] text-slate-500 italic">{block.tip}</p>}
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider shrink-0 ${
                          block.energyLevelRequired === 'high' 
                            ? 'bg-red-500/10 text-red-400 border border-red-500/15' 
                            : block.energyLevelRequired === 'medium'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/15'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15'
                        }`}>
                          {block.energyLevelRequired || 'MEDIUM'}
                        </span>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="bg-black/20 border border-slate-900 rounded-xl p-4 flex justify-between items-center">
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono font-bold text-indigo-400 block">09:00 - 11:30</span>
                          <h4 className="text-xs font-bold text-slate-200">Morning Slot: Deep Work Focus</h4>
                          <p className="text-[10px] text-slate-500">Deconstruct architecture models or study base normalization normal forms.</p>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/15 text-[8px] font-bold tracking-wider">HIGH ENERGY</span>
                      </div>
                      <div className="bg-black/20 border border-slate-900 rounded-xl p-4 flex justify-between items-center">
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono font-bold text-indigo-400 block">14:00 - 16:30</span>
                          <h4 className="text-xs font-bold text-slate-200">Afternoon Slot: Practical Exercises</h4>
                          <p className="text-[10px] text-slate-500">Review past exam question banks and run triggers queries.</p>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/15 text-[8px] font-bold tracking-wider">MEDIUM ENERGY</span>
                      </div>
                    </>
                  )}
                </div>

                <div className="border-t border-slate-900 pt-4">
                  <ConflictDetector deadlines={deadlines} onAutoResolve={handleResolveConflicts} isLoadBalancing={isLoadBalancing} />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#0e0e1b] border border-slate-800/80 rounded-2xl p-12 text-center text-slate-500 max-w-xl mx-auto flex flex-col items-center justify-center space-y-4">
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-2xl">
                <Calendar className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-300">Calendar Planner is Idle</p>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">To populate daily study slots, custom focus regimens, and task timelines, you need to configure an active goal profile first.</p>
              </div>
              <button
                onClick={() => {
                  if (deadlines.length > 0) {
                    setSelectedId(deadlines[0]?.id || '');
                  } else {
                    setActiveTab('goals');
                  }
                }}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2.5 px-5 rounded-xl transition-all cursor-pointer shadow-lg shadow-indigo-600/15"
              >
                {deadlines.length > 0 ? 'Select Active Goal' : 'Go to Goal Planner'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* 4. LEARNING HUB VIEW */}
      {activeTab === 'learning' && (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
          {activeDeadline ? (
            <div className="bg-[#0e0e1b] border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 font-display flex items-center gap-1.5">
                  <GraduationCap className="w-5 h-5 text-indigo-400" />
                  AI Study Companion Hub
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Click on any execution subtask below to extract custom summaries and take quizzes compiled by Google Gemini.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeDeadline.subtasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-4 bg-black/20 border border-slate-900 rounded-xl hover:border-indigo-500/40 hover:bg-black/30 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-xs font-bold text-slate-200">{task.title}</h4>
                        <span className="text-[8px] font-mono uppercase bg-slate-800 text-slate-400 px-1.5 rounded">{task.priority}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-sans leading-relaxed">{task.description}</p>
                    </div>
                    
                    <button
                      onClick={() => setSelectedSubtask(task)}
                      className="mt-4 w-full bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white font-semibold text-xs py-2 px-3 rounded-lg border border-indigo-500/15 transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <GraduationCap className="w-3.5 h-3.5" />
                      Open Study Notes & Flash Quiz
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-[#0e0e1b] border border-slate-800/80 rounded-2xl p-12 text-center text-slate-500 max-w-xl mx-auto flex flex-col items-center justify-center space-y-4">
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-2xl">
                <GraduationCap className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-300">Study Companion Offline</p>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">Once a goal profile is active, our AI Learning Companion will compile tailored lecture summaries, flash cards, and dynamic quizzes for each task.</p>
              </div>
              <button
                onClick={() => {
                  if (deadlines.length > 0) {
                    setSelectedId(deadlines[0]?.id || '');
                  } else {
                    setActiveTab('goals');
                  }
                }}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2.5 px-5 rounded-xl transition-all cursor-pointer shadow-lg shadow-indigo-600/15"
              >
                {deadlines.length > 0 ? 'Select Active Goal' : 'Go to Goal Planner'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* 5. AI AGENTS VIEW */}
      {activeTab === 'agents' && (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="md:col-span-3">
              <AgentPipeline isRunning={isAnalyzing} currentStep={currentStep} />
            </div>
            <div className="md:col-span-2 space-y-6">
              <AIStatus currentStep={currentStep} isRunning={isAnalyzing} />
              <div className="bg-[#0e0e1b] border border-slate-800/80 rounded-2xl p-5 shadow-xl space-y-3">
                <h4 className="text-xs font-bold text-slate-300 font-display uppercase tracking-wider">Agent Coordination System</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
                  Each agent runs server-side on **Google Gemini 3.5-Flash** following specific directives. They cooperate to output stable, optimized study schedules without manual user coordination.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. RISK ANALYSIS VIEW */}
      {activeTab === 'risk' && (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
          {activeDeadline ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <div className="md:col-span-2">
                  <RiskGauge
                    score={displayRisk}
                    level={displayLevel}
                    predictedDate={activeDeadline.dueDate}
                    recommendedAction={activeDeadline.recommendedAction}
                  />
                </div>
                <div className="md:col-span-3">
                  <WhatIfSimulation
                    baselineRisk={activeDeadline.riskScore}
                    onSimulationChange={(simRisk, simLvl) => {
                      setSimulatedRiskOverride(simRisk);
                      setSimulatedLevelOverride(simLvl);
                    }}
                  />
                </div>
              </div>

              {displayRisk > 75 && activeDeadline.negotiation && (
                <NegotiationPanel
                  negotiation={activeDeadline.negotiation}
                  deadlineTitle={activeDeadline.title}
                />
              )}

              <div className="bg-[#0e0e1b] border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4">
                <h3 className="text-xs font-bold text-slate-300 font-display uppercase tracking-wider">Proactive Recovery Plans</h3>
                <AISuggestions
                  deadlines={deadlines}
                  onAutoResolve={handleResolveConflicts}
                  onSelectDeadline={(id) => {
                    setSelectedId(id);
                    setSimulatedRiskOverride(null);
                    setSimulatedLevelOverride(null);
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="bg-[#0e0e1b] border border-slate-800/80 rounded-2xl p-12 text-center text-slate-500 max-w-xl mx-auto flex flex-col items-center justify-center space-y-4">
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-2xl">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-300">Risk Intel Dashboard Empty</p>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">Simulate scheduling delays, track probability metrics, and generate proactive extension draft proposals once a goal track is initialized.</p>
              </div>
              <button
                onClick={() => {
                  if (deadlines.length > 0) {
                    setSelectedId(deadlines[0]?.id || '');
                  } else {
                    setActiveTab('goals');
                  }
                }}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2.5 px-5 rounded-xl transition-all cursor-pointer shadow-lg shadow-indigo-600/15"
              >
                {deadlines.length > 0 ? 'Select Active Goal' : 'Go to Goal Planner'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* 7. REFLECTION VIEW */}
      {activeTab === 'reflection' && (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="md:col-span-3">
              <ReflectionAgent deadlines={deadlines} />
            </div>
            <div className="md:col-span-2 space-y-6">
              <RecentNotifications notifications={notifications} onDismiss={handleDismissNotification} />
              <RecentActivity activities={activities} />
            </div>
          </div>
        </div>
      )}

      {/* 8. SETTINGS VIEW */}
      {activeTab === 'settings' && (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
          {/* Header Banner */}
          <div className="p-6 bg-[#0e0e1b] border border-slate-800/80 rounded-2xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 font-display flex items-center gap-2">
                <Settings className="w-5 h-5 text-indigo-400" />
                Workspace Settings Control Console
              </h3>
              <p className="text-xs text-slate-400 mt-1">Configure study hour allocations, appearance, notifications, and AI model parameters.</p>
            </div>
            <div className="hidden sm:block text-right">
              <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-mono font-bold uppercase">
                v1.2.0-STABLE
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Left Sidebar Menu */}
            <div className="md:col-span-1 space-y-1.5">
              {[
                { id: 'workspace', label: 'Workspace', icon: <Briefcase className="w-4 h-4" /> },
                { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
                { id: 'appearance', label: 'Appearance', icon: <Palette className="w-4 h-4" /> },
                { id: 'ai', label: 'AI Configuration', icon: <Cpu className="w-4 h-4" /> },
                { id: 'about', label: 'About', icon: <Info className="w-4 h-4" /> },
                { id: 'danger', label: 'Danger Zone', icon: <ShieldAlert className="w-4 h-4" /> },
                { id: 'logout', label: 'Logout', icon: <LogOut className="w-4 h-4" /> }
              ].map((subTab) => {
                const isActive = settingsSubTab === subTab.id;
                return (
                  <button
                    key={subTab.id}
                    onClick={() => {
                      if (subTab.id === 'logout') {
                        setShowLogoutConfirm(true);
                      } else {
                        setSettingsSubTab(subTab.id);
                      }
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer text-left ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-500/15 to-indigo-500/[0.02] border border-indigo-500/30 text-indigo-400 font-bold shadow-sm shadow-indigo-500/5'
                        : 'border border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
                    }`}
                  >
                    <span className={isActive ? 'text-indigo-400' : 'text-slate-500'}>{subTab.icon}</span>
                    <span>{subTab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Right Pane Content */}
            <div className="md:col-span-3 min-h-[350px]">
              
              {/* Workspace Settings Subtab */}
              {settingsSubTab === 'workspace' && (
                <div className="bg-[#0e0e1b] border border-slate-800/80 rounded-2xl p-6 shadow-lg space-y-6 animate-fade-in">
                  <div className="flex items-center gap-2.5 text-indigo-400 border-b border-slate-900 pb-3">
                    <Briefcase className="w-5 h-5" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">Workspace Governance</h4>
                  </div>
                  
                  <div className="p-4 bg-black/40 border border-slate-900 rounded-xl space-y-3 text-xs leading-relaxed">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Workspace Status</span>
                      <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        Active
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-t border-slate-900/60 pt-2.5">
                      <span className="text-slate-400">Active Goals</span>
                      <span className="text-indigo-400 font-mono font-bold">{deadlines.length} Paths</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-slate-900/60 pt-2.5">
                      <span className="text-slate-400">Primary DB Engine</span>
                      <span className="text-indigo-400 font-mono font-bold">LocalStorage Sandboxed</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block">ADMIN ACTIONS</span>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={handleLoadDemoData}
                        className="flex items-center justify-center gap-1.5 bg-amber-600/10 hover:bg-amber-600/20 border border-amber-500/30 hover:border-amber-400/50 text-amber-400 font-bold text-xs py-2.5 px-3 rounded-xl transition-all cursor-pointer text-center"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Reset Demo Workspace
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Are you sure you want to clear your local storage cache? This will clear all transient variables.")) {
                            localStorage.clear();
                            alert("Local storage cleared successfully! Real-time settings refreshed.");
                            window.location.reload();
                          }
                        }}
                        className="flex items-center justify-center gap-1.5 bg-slate-850/40 hover:bg-slate-850/75 border border-slate-700/50 text-slate-300 font-bold text-xs py-2.5 px-3 rounded-xl transition-all cursor-pointer text-center"
                      >
                        Purge Storage Cache
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(deadlines, null, 2));
                        const downloadAnchor = document.createElement('a');
                        downloadAnchor.setAttribute("href", dataStr);
                        downloadAnchor.setAttribute("download", "deadline_guardian_workspace.json");
                        document.body.appendChild(downloadAnchor);
                        downloadAnchor.click();
                        downloadAnchor.remove();
                      }}
                      className="w-full flex items-center justify-center gap-2 bg-indigo-600/15 hover:bg-indigo-600/35 border border-indigo-500/30 text-indigo-400 hover:text-indigo-300 font-semibold text-[11px] py-2.5 rounded-xl transition-all cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Export Workspace (JSON)
                    </button>
                  </div>
                </div>
              )}

              {/* Notifications Settings Subtab */}
              {settingsSubTab === 'notifications' && (
                <div className="bg-[#0e0e1b] border border-slate-800/80 rounded-2xl p-6 shadow-lg space-y-5 animate-fade-in">
                  <div className="flex items-center gap-2.5 text-indigo-400 border-b border-slate-900 pb-3">
                    <Bell className="w-5 h-5" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">Notification Operations</h4>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-xs text-slate-300 font-bold block">Audio Alerts</label>
                        <span className="text-[10px] text-slate-500">Play alert sound for overload risks.</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifySound}
                        onChange={(e) => setNotifySound(e.target.checked)}
                        className="w-4 h-4 rounded bg-black/40 border border-slate-900 text-indigo-600 focus:ring-0 cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-900 pt-3">
                      <div>
                        <label className="text-xs text-slate-300 font-bold block">Proactive Auto-Schedules</label>
                        <span className="text-[10px] text-slate-500">Alert me when load-balancing is ready.</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifyAutoSchedule}
                        onChange={(e) => setNotifyAutoSchedule(e.target.checked)}
                        className="w-4 h-4 rounded bg-black/40 border border-slate-900 text-indigo-600 focus:ring-0 cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1.5 border-t border-slate-900 pt-3">
                      <label className="text-xs text-slate-400 font-medium block">Daily Intelligence Digest</label>
                      <select className="w-full bg-black/60 border border-slate-900 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500/50">
                        <option>Morning Brief (08:00 AM)</option>
                        <option>Evening Retrospective (08:00 PM)</option>
                        <option>Disabled</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Appearance Settings Subtab */}
              {settingsSubTab === 'appearance' && (
                <div className="bg-[#0e0e1b] border border-slate-800/80 rounded-2xl p-6 shadow-lg space-y-5 animate-fade-in">
                  <div className="flex items-center gap-2.5 text-indigo-400 border-b border-slate-900 pb-3">
                    <Palette className="w-5 h-5" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">Appearance & Display</h4>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs text-slate-400 font-medium block">UI Density Control</label>
                      <div className="grid grid-cols-2 gap-2 bg-black/40 p-1 border border-slate-900 rounded-xl">
                        <button
                          onClick={() => setLayoutDensity('comfortable')}
                          className={`text-center py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                            layoutDensity === 'comfortable' ? 'bg-indigo-600/15 border border-indigo-500/20 text-indigo-400 font-bold' : 'text-slate-500 hover:text-slate-400'
                          }`}
                        >
                          Comfortable
                        </button>
                        <button
                          onClick={() => setLayoutDensity('compact')}
                          className={`text-center py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                            layoutDensity === 'compact' ? 'bg-indigo-600/15 border border-indigo-500/20 text-indigo-400 font-bold' : 'text-slate-500 hover:text-slate-400'
                          }`}
                        >
                          Compact
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs text-slate-400 font-medium block">App Accent Palette</label>
                      <div className="flex items-center gap-3">
                        {['indigo', 'emerald', 'amber', 'rose'].map((color) => (
                          <button
                            key={color}
                            className={`w-7 h-7 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                              color === 'indigo'
                                ? 'bg-indigo-500 border-white/40 scale-110 shadow-lg shadow-indigo-500/20'
                                : color === 'emerald'
                                ? 'bg-[#10b981] border-transparent hover:border-white/20'
                                : color === 'amber'
                                ? 'bg-[#f59e0b] border-transparent hover:border-white/20'
                                : 'bg-[#f43f5e] border-transparent hover:border-white/20'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* AI Configuration Settings Subtab */}
              {settingsSubTab === 'ai' && (
                <div className="bg-[#0e0e1b] border border-slate-800/80 rounded-2xl p-6 shadow-lg space-y-5 animate-fade-in">
                  <div className="flex items-center gap-2.5 text-indigo-400 border-b border-slate-900 pb-3">
                    <Cpu className="w-5 h-5" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">AI Model Configuration</h4>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-400 font-medium block">Underlying Google Gemini Model</label>
                      <select
                        value={aiModel}
                        onChange={(e) => setAiModel(e.target.value)}
                        className="w-full bg-black/60 border border-slate-900 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500/50"
                      >
                        <option value="gemini-2.5-flash">Google Gemini 2.5 Flash (Ultralight Latency)</option>
                        <option value="gemini-3.5-flash">Google Gemini 3.5 Flash (Default)</option>
                        <option value="gemini-2.5-pro">Google Gemini 2.5 Pro (Deep Intelligence)</option>
                      </select>
                    </div>

                    <div className="space-y-2 border-t border-slate-900 pt-3">
                      <div className="flex justify-between items-center text-xs">
                        <label className="text-slate-400 font-medium">Model Temperature</label>
                        <span className="font-mono text-indigo-400 font-bold">{aiTemp}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={aiTemp}
                        onChange={(e) => setAiTemp(parseFloat(e.target.value))}
                        className="w-full accent-indigo-500 bg-black/40 h-1.5 rounded-lg appearance-none cursor-pointer border border-slate-900"
                      />
                      <span className="text-[10px] text-slate-500 leading-none">Lower values ensure structured scheduling decisions with strict chronological alignment.</span>
                    </div>

                    <div className="pt-2 space-y-1.5 border-t border-slate-900">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">Structured Response Schema</span>
                        <span className="text-indigo-400 font-bold">Active</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">Agent Coordination</span>
                        <span className="text-indigo-400 font-bold">Multi-Agent Cooperation</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* About Settings Subtab */}
              {settingsSubTab === 'about' && (
                <div className="bg-[#0e0e1b] border border-slate-800/80 rounded-2xl p-6 shadow-lg space-y-6 animate-fade-in">
                  <div className="flex items-center gap-2.5 text-indigo-400 border-b border-slate-900 pb-3">
                    <Info className="w-5 h-5" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">System Specification & Architecture</h4>
                  </div>

                  <div className="space-y-5">
                    <p className="text-xs text-slate-400 leading-relaxed font-sans">
                      Deadline Guardian AI is a high-fidelity productivity dashboard developed specifically for the **Google Developer Hackathon**, utilizing dynamic AI agents to manage overlapping student task limits cleanly.
                    </p>

                    <div className="grid grid-cols-2 gap-3.5 text-[11px] font-sans">
                      <div className="p-3 bg-black/30 border border-slate-900 rounded-xl space-y-1">
                        <span className="text-[10px] font-mono font-bold text-slate-500 block uppercase">Core Intelligence</span>
                        <p className="text-slate-300 font-semibold">Google Gemini Pro</p>
                      </div>
                      <div className="p-3 bg-black/30 border border-slate-900 rounded-xl space-y-1">
                        <span className="text-[10px] font-mono font-bold text-slate-500 block uppercase">Frontend Framework</span>
                        <p className="text-slate-300 font-semibold">React & TypeScript</p>
                      </div>
                      <div className="p-3 bg-black/30 border border-slate-900 rounded-xl space-y-1">
                        <span className="text-[10px] font-mono font-bold text-slate-500 block uppercase">Bundler & Runtime</span>
                        <p className="text-slate-300 font-semibold">Express & Vite</p>
                      </div>
                      <div className="p-3 bg-black/30 border border-slate-900 rounded-xl space-y-1">
                        <span className="text-[10px] font-mono font-bold text-slate-500 block uppercase">Styling Engine</span>
                        <p className="text-slate-300 font-semibold">Tailwind CSS</p>
                      </div>
                    </div>

                    <div className="p-3.5 bg-indigo-950/10 border border-indigo-500/10 rounded-xl">
                      <span className="text-[10px] font-mono font-bold text-indigo-400 block mb-1">9-AGENT ASSISTANT STACK</span>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Features nine specialized roles coordinating on top of the Google GenAI SDK to automatically plan, rank, schedule, simulate risk, teach, and provide safety-recovery options.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Danger Zone Settings Subtab */}
              {settingsSubTab === 'danger' && (
                <div className="bg-[#0e0e1b] border border-red-500/20 rounded-2xl p-6 shadow-lg space-y-5 animate-fade-in">
                  <div className="flex items-center gap-2.5 text-red-400 border-b border-slate-900 pb-3">
                    <ShieldAlert className="w-5 h-5" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 font-mono">Danger Zone Operations</h4>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-red-950/10 border border-red-500/10 rounded-xl space-y-3">
                      <span className="text-xs text-slate-300 font-bold block">Reset Workspace Cache</span>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Irreversibly close the active workspace, delete all generated schedules, purge browser localStorage/sessionStorage caches, and return to the Setup screen.
                      </p>
                      <button
                        onClick={() => setShowLogoutConfirm(true)}
                        className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-red-900/10 hover:bg-red-900/30 border border-red-500/20 hover:border-red-500/40 text-red-400 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-sm"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout / Purge Workspace
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>

          {/* CONFIRMATION MODAL */}
          {showLogoutConfirm && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in pointer-events-auto">
              <div className="bg-[#0b0b14] border border-red-500/20 max-w-md w-full mx-4 rounded-2xl p-6 shadow-2xl space-y-6">
                <div className="flex items-center gap-3 text-red-400">
                  <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20">
                    <AlertTriangle className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-100 font-display">Close Workspace</h3>
                    <p className="text-xs text-slate-400">Confirmation Required</p>
                  </div>
                </div>
                
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  Are you sure you want to logout and close the current AI workspace? This will clear all locally stored demo data, purge your custom goal schedules, and return you to the initial setup screen.
                </p>

                <div className="flex gap-3 justify-end pt-2">
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800 rounded-xl transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowLogoutConfirm(false);
                      handleLogout();
                    }}
                    className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-500 rounded-xl shadow-lg shadow-red-600/20 transition-all cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
