import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Sparkles,
  Plus,
  AlertTriangle,
  Trash2,
  CheckCircle2,
  Smile,
  FileText,
  Scale,
  GraduationCap,
  TrendingUp,
  Brain,
  ListTodo,
  Sparkle
} from 'lucide-react';

import { Deadline, Subtask, CategoryType, RiskLevelType, Negotiation, DailyCoachPlan } from './types';
import RiskGauge from './components/RiskGauge';
import AgentPipeline from './components/AgentPipeline';
import SyllabusParser from './components/SyllabusParser';
import WhatIfSimulation from './components/WhatIfSimulation';
import ConflictDetector from './components/ConflictDetector';
import NegotiationPanel from './components/NegotiationPanel';
import LearningDrawer from './components/LearningDrawer';
import VoiceInput from './components/VoiceInput';

// --- MOCK/PRE-SEEDED SYSTEM DATA FOR DEMO PURPOSES ---
const INITIAL_DEADLINES: Deadline[] = [
  {
    id: 'dl-1',
    title: 'Machine Learning Hackathon Submission',
    description: 'Build an autonomous agentic system and submit final evaluation model results.',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days left
    category: 'project',
    progress: 20,
    riskScore: 87,
    riskLevel: 'critical',
    status: 'active',
    hoursPerDay: 4,
    subtasks: [
      { id: 'sub-1', title: 'Model Architecture Selection & Pipeline Setup', description: 'Write training loops and validate basic architecture.', effortHours: 4, priority: 'critical', category: 'building', scheduleDay: 1, timeBlock: 'morning', completed: true, completedAt: new Date().toISOString(), action: 'keep' },
      { id: 'sub-2', title: 'Data Ingestion & Feature Engineering', description: 'Clean inputs, vectorize text data, set up schemas.', effortHours: 3, priority: 'high', category: 'research', scheduleDay: 1, timeBlock: 'afternoon', completed: false, completedAt: null, action: 'keep' },
      { id: 'sub-3', title: 'Training Base Models & Evaluation Logs', description: 'Evaluate learning metrics and graph confusion matrices.', effortHours: 3.5, priority: 'critical', category: 'learning', scheduleDay: 2, timeBlock: 'morning', completed: false, completedAt: null, action: 'keep' },
      { id: 'sub-4', title: 'Hyperparameter Tuning & Fine-Tuning', description: 'Perform grid searches on learning rates and decay constants.', effortHours: 2.5, priority: 'medium', category: 'practice', scheduleDay: 2, timeBlock: 'afternoon', completed: false, completedAt: null, action: 'keep' },
      { id: 'sub-5', title: 'Visualizing Metrics & Final Submission Draft', description: 'Finalize markdown logs, screenshots, and export weight files.', effortHours: 3, priority: 'high', category: 'admin', scheduleDay: 3, timeBlock: 'morning', completed: false, completedAt: null, action: 'keep' }
    ],
    riskFactors: [
      'Daily scheduled workload (7.0 hrs) exceeds study capacity limit (4.0 hrs) on Day 1.',
      'Schedules show significant overlap bottleneck in morning slots.',
      'Complex building subtasks scheduled late in the project timeline.'
    ],
    recommendedAction: 'Shift Day 1 afternoon tasks to Day 3 afternoon, or use the Negotiation Agent to claim a 2-day safety gate immediately.',
    negotiation: {
      emailSubject: 'Request for 2-Day Timeline Extension - Machine Learning Hackathon Entry',
      emailBody: `Dear Organizing Team,

I hope this message finds you well.

I am writing to respectfully request a brief two-day extension for our team's submission deadline, originally scheduled for July 2nd. Due to unexpected data engineering bottlenecks and pipeline validation delays encountered yesterday, we require a bit of additional time to fully evaluate and compile our neural networks to our standards.

We have currently established the foundation pipelines and base validation metrics (approximately 20% complete) and are fully committed to submitting a finished entry. An extension to July 4th would ensure we can complete fine-tuning and thoroughly document our findings.

Thank you very much for your time, support, and consideration of our request.

Sincerely,
Sai Charan`,
      tone: 'semi-formal',
      deferSuggestions: [
        { eventTitle: 'DBMS Review Session', reason: 'Your DBMS exam is 5 days away and in the safe zone. Postpone study by 24h.', hoursFreed: 2 },
        { eventTitle: 'Weekly Club Sync Meeting', reason: 'Non-mandatory meeting. Skip to gain critical hacking blocks.', hoursFreed: 1.5 }
      ],
      estimatedExtensionDays: 2,
      confidenceMessage: 'Hackathon organizers routinely grant 24-48h buffer gates for genuine technical difficulties requested professionally.'
    }
  },
  {
    id: 'dl-2',
    title: 'Database Management Systems Midterm',
    description: 'Comprehensive testing on 3NF normalization rules, SQL aggregation triggers, and relational algebra operations.',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 days left
    category: 'exam',
    progress: 50,
    riskScore: 34,
    riskLevel: 'safe',
    status: 'active',
    hoursPerDay: 4,
    subtasks: [
      { id: 'sub-6', title: 'Review 3NF Normalization & Diagrams', description: 'Practice functional dependencies, transitive closures, and drawing charts.', effortHours: 2, priority: 'critical', category: 'learning', scheduleDay: 1, timeBlock: 'morning', completed: true, completedAt: new Date().toISOString(), action: 'keep' },
      { id: 'sub-7', title: 'SQL Joins & Triggers Mock Questions', description: 'Practice nested joins, correlated subqueries, and partition triggers.', effortHours: 2.5, priority: 'high', category: 'practice', scheduleDay: 1, timeBlock: 'afternoon', completed: true, completedAt: new Date().toISOString(), action: 'keep' },
      { id: 'sub-8', title: 'Relational Algebra Rules & Tuple Calculus', description: 'Analyze join selections, projections, and division operators.', effortHours: 2, priority: 'high', category: 'learning', scheduleDay: 2, timeBlock: 'evening', completed: false, completedAt: null, action: 'keep' },
      { id: 'sub-9', title: 'Full Midterm Practice Sheet Review', description: 'Take the mock exam under a 2-hour timer environment.', effortHours: 1.5, priority: 'medium', category: 'practice', scheduleDay: 3, timeBlock: 'afternoon', completed: false, completedAt: null, action: 'keep' }
    ],
    riskFactors: [
      'Progress ahead of daily study pace curve.',
      'Prerequisite database normalizations mastered.'
    ],
    recommendedAction: 'Maintain current steady pacing. Review relational division concepts on Day 2.',
    negotiation: null
  }
];

export default function App() {
  const [deadlines, setDeadlines] = useState<Deadline[]>(() => {
    const saved = localStorage.getItem('deadline_guard_data');
    return saved ? JSON.parse(saved) : INITIAL_DEADLINES;
  });

  const [selectedId, setSelectedId] = useState<string>(() => {
    return INITIAL_DEADLINES[0].id;
  });

  // Goal Entry State
  const [newTitle, setNewTitle] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newCategory, setNewCategory] = useState<CategoryType>('project');
  const [newHoursPerDay, setNewHoursPerDay] = useState(4);
  const [newDescription, setNewDescription] = useState('');

  // Active UI Controls
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeParser, setActiveParser] = useState(false);
  const [selectedSubtask, setSelectedSubtask] = useState<Subtask | null>(null);

  // Simulated Risk Controls
  const [simulatedRiskOverride, setSimulatedRiskOverride] = useState<number | null>(null);
  const [simulatedLevelOverride, setSimulatedLevelOverride] = useState<RiskLevelType | null>(null);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('deadline_guard_data', JSON.stringify(deadlines));
  }, [deadlines]);

  const activeDeadline = deadlines.find(d => d.id === selectedId) || deadlines[0] || null;

  // 1. Trigger Multi-Agent AI Pipeline to analyze goal and schedule subtasks
  const handleCreateDeadline = async (
    title: string,
    dueDate: string,
    category: CategoryType,
    hoursPerDay: number,
    description: string
  ) => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/analyze-goal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          dueDate,
          category,
          hoursPerDay,
          description,
          currentLocalTime: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('AI analysis failed. Please verify API key or network connection.');
      }

      const parsedData = await response.json();
      
      const newDeadline: Deadline = {
        id: `dl-${Date.now()}`,
        title,
        dueDate,
        category,
        description,
        hoursPerDay,
        progress: 0,
        riskScore: parsedData.riskScore || 40,
        riskLevel: (parsedData.riskLevel || 'safe') as RiskLevelType,
        status: 'active',
        subtasks: (parsedData.subtasks || []).map((t: any, idx: number) => ({
          id: `sub-${Date.now()}-${idx}`,
          title: t.title,
          description: t.description || '',
          effortHours: t.effortHours || 2,
          priority: t.priority || 'medium',
          category: t.category || 'general',
          scheduleDay: t.scheduleDay || 1,
          timeBlock: t.timeBlock || 'morning',
          completed: false,
          completedAt: null,
          action: 'keep'
        })),
        riskFactors: parsedData.riskFactors || [],
        recommendedAction: parsedData.recommendedAction || 'Follow daily coaching directives.',
        negotiation: parsedData.negotiation || null
      };

      setDeadlines(prev => [newDeadline, ...prev]);
      setSelectedId(newDeadline.id);
      
      // Clear inputs
      setNewTitle('');
      setNewDueDate('');
      setNewDescription('');
    } catch (err: any) {
      alert(err.message || 'Error scheduling deadline');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 2. Syllabus Import handler
  const handleImportSyllabus = (importedDeadlines: any[]) => {
    setActiveParser(false);
    importedDeadlines.forEach((item, index) => {
      // Intentionally sequence delay to avoid slamming APIs simultaneously
      setTimeout(() => {
        handleCreateDeadline(
          item.title,
          item.dueDate,
          item.category,
          item.hoursPerDay,
          item.description
        );
      }, index * 500);
    });
  };

  // 3. Toggle Subtask Completion & recalculate dynamic risk states
  const handleToggleSubtask = (deadlineId: string, subtaskId: string) => {
    setDeadlines(prev => {
      return prev.map(dl => {
        if (dl.id !== deadlineId) return dl;

        const updatedSubtasks = dl.subtasks.map(sub => {
          if (sub.id !== subtaskId) return sub;
          const nowComplete = !sub.completed;
          return {
            ...sub,
            completed: nowComplete,
            completedAt: nowComplete ? new Date().toISOString() : null
          };
        });

        const total = updatedSubtasks.length;
        const completedCount = updatedSubtasks.filter(t => t.completed).length;
        const progress = total > 0 ? Math.round((completedCount / total) * 100) : 0;
        
        // Dynamically lower risk score as subtasks get complete
        const startingRisk = dl.id === 'dl-1' ? 87 : (dl.id === 'dl-2' ? 34 : 50);
        const progressOffset = (completedCount / total) * 40; // max 40% reduction
        const riskScore = Math.max(5, Math.round(startingRisk - progressOffset));

        let riskLevel: RiskLevelType = 'safe';
        if (riskScore > 85) riskLevel = 'critical';
        else if (riskScore > 60) riskLevel = 'danger';
        else if (riskScore > 35) riskLevel = 'caution';

        return {
          ...dl,
          subtasks: updatedSubtasks,
          progress,
          riskScore,
          riskLevel
        };
      });
    });

    // Reset override when state changes to match actual values
    setSimulatedRiskOverride(null);
    setSimulatedLevelOverride(null);
  };

  // 4. Auto resolve schedule conflicts using our load balancer
  const handleResolveConflicts = () => {
    if (!activeDeadline) return;
    
    setDeadlines(prev => {
      return prev.map(dl => {
        if (dl.id !== selectedId) return dl;
        
        // Balanced scheduler logic: distribute overlapping/overloaded days
        const updatedSubtasks = dl.subtasks.map((task, idx) => {
          if (idx >= 3) {
            // Push late tasks out by an extra study day to resolve density
            return {
              ...task,
              scheduleDay: Math.min(5, task.scheduleDay + 1),
              timeBlock: (idx % 2 === 0 ? 'morning' : 'afternoon') as any
            };
          }
          return task;
        });

        // Lower risk on load balancing
        const resolvedRisk = Math.round(dl.riskScore * 0.75);
        let riskLevel: RiskLevelType = 'safe';
        if (resolvedRisk > 85) riskLevel = 'critical';
        else if (resolvedRisk > 60) riskLevel = 'danger';
        else if (resolvedRisk > 35) riskLevel = 'caution';

        return {
          ...dl,
          subtasks: updatedSubtasks,
          riskScore: resolvedRisk,
          riskLevel,
          recommendedAction: 'Daily tasks redistributed. Congestion cleared! Proceed with today\'s load balanced schedule.'
        };
      });
    });

    alert('AI Load Balancer: Density conflicts analyzed. Day 1 workload distributed smoothly over Days 2 & 3.');
  };

  const handleDeleteDeadline = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to dismiss this Deadline Guardian profile?')) {
      const remaining = deadlines.filter(d => d.id !== id);
      setDeadlines(remaining);
      if (remaining.length > 0) {
        setSelectedId(remaining[0].id);
      }
    }
  };

  // Simulated value selectors
  const displayRisk = simulatedRiskOverride !== null ? simulatedRiskOverride : (activeDeadline ? activeDeadline.riskScore : 0);
  const displayLevel = simulatedLevelOverride !== null ? simulatedLevelOverride : (activeDeadline ? activeDeadline.riskLevel : 'safe');

  return (
    <div className="min-h-screen bg-[#06060c] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-white">
      
      {/* 1. TOP HEADER BRAND */}
      <header className="border-b border-slate-900 bg-[#0e0e1b]/80 backdrop-blur-md px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Brain className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight font-display text-white flex items-center gap-1.5">
              DEADLINE GUARDIAN AI
              <span className="text-[9px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/25">HACKATHON EDITION</span>
            </h1>
            <p className="text-xs text-slate-400">Autonomous Multi-Agent Chief of Staff • Hackathon Core Pipeline</p>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs text-slate-400 bg-black/40 border border-slate-900 rounded-xl px-4 py-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-slate-500">CORE STATUS:</span>
          <span className="text-emerald-400 font-bold">ON-LINE</span>
          <span className="text-slate-700">|</span>
          <span className="text-slate-500">GEMINI:</span>
          <span className="text-indigo-400 font-bold">3.5-FLASH</span>
        </div>
      </header>

      {/* 2. MAIN HUB CONTAINER */}
      <main className="flex-1 p-6 max-w-[1600px] mx-auto w-full grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN (4 spans): Target Entry, Syllabus Ingest, Conflict Monitor */}
        <div className="xl:col-span-4 space-y-6">
          
          {/* Quick Add Form with Voice Input */}
          <div id="goal-entry-card" className="bg-[#0e0e1b] border border-slate-800/80 rounded-2xl p-6 shadow-2xl space-y-4">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 font-display flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                Initialize Target Goal
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Define exam/project deliverable to compile autonomous daily schedules</p>
            </div>

            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 bg-black/40 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
                  placeholder="e.g. DBMS Normalization Midterm or Capstone Submit"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
                <VoiceInput onTranscriptChange={(text) => setNewTitle(text)} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Due Date</label>
                  <input
                    type="date"
                    className="w-full bg-black/40 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Goal Category</label>
                  <select
                    className="w-full bg-black/40 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as CategoryType)}
                  >
                    <option value="exam">Exam Study</option>
                    <option value="project">Project Deliverable</option>
                    <option value="interview">Interview Practice</option>
                    <option value="assignment">Homework Assignment</option>
                    <option value="work">Work Statement</option>
                    <option value="research">Thesis Research</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Study Capacity (hrs/day)</label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    className="w-full bg-black/40 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
                    value={newHoursPerDay}
                    onChange={(e) => setNewHoursPerDay(Number(e.target.value))}
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => handleCreateDeadline(newTitle, newDueDate, newCategory, newHoursPerDay, newDescription)}
                    disabled={isAnalyzing || !newTitle.trim() || !newDueDate}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800/80 text-white font-medium text-xs py-2 px-4 rounded-xl transition-all flex items-center justify-center gap-1 shadow-lg shadow-indigo-600/15"
                  >
                    <Plus className="w-4 h-4" />
                    Deploy Guardian
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Ingest Toggle Button & Component */}
          {activeParser ? (
            <SyllabusParser onImportDeadlines={handleImportSyllabus} />
          ) : (
            <button
              onClick={() => setActiveParser(true)}
              className="w-full bg-[#15152a]/40 hover:bg-[#1c1c38]/60 border border-slate-800/80 rounded-2xl p-4 transition-all flex items-center justify-between text-left group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 group-hover:scale-105 transition-all">
                  <FileText className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="text-xs font-semibold text-slate-200">Import from Syllabus / Outline Sheet</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Let AI parse schedules and bulk schedule all subtasks</p>
                </div>
              </div>
              <span className="text-xs font-mono text-indigo-400 font-bold group-hover:translate-x-1 transition-all">{`+`}</span>
            </button>
          )}

          {/* Active Deadlines Tracker */}
          <div id="deadlines-tracker" className="bg-[#0e0e1b] border border-slate-800/80 rounded-2xl p-6 shadow-2xl space-y-4">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 font-display flex items-center gap-1.5">
                <ListTodo className="w-4 h-4 text-indigo-400" />
                Active Deadlines ({deadlines.length})
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Select a tracking profile to review risk metrics and agent schedules</p>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {deadlines.map((dl) => {
                const isSelected = dl.id === selectedId;
                const daysRemaining = Math.max(0, Math.ceil((new Date(dl.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
                
                let badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
                if (dl.riskLevel === 'caution') badgeColor = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
                if (dl.riskLevel === 'danger') badgeColor = 'bg-red-500/10 text-red-400 border-red-500/20';
                if (dl.riskLevel === 'critical') badgeColor = 'bg-rose-500/10 text-rose-500 border-rose-500/25 animate-pulse';

                return (
                  <div
                    key={dl.id}
                    onClick={() => {
                      setSelectedId(dl.id);
                      setSimulatedRiskOverride(null);
                      setSimulatedLevelOverride(null);
                    }}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer relative group flex justify-between items-center ${
                      isSelected
                        ? 'bg-[#15152a] border-indigo-500/80 shadow-indigo-500/5 shadow-lg'
                        : 'bg-[#15152a]/40 border-slate-800/60 hover:border-slate-800'
                    }`}
                  >
                    <div className="space-y-2 flex-1 pr-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-semibold uppercase px-2 py-0.5 rounded-full bg-black/40 border border-slate-900 text-slate-400">
                          {dl.category}
                        </span>
                        <span className={`text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${badgeColor}`}>
                          {dl.riskLevel}
                        </span>
                      </div>
                      <h4 className="text-xs font-semibold text-slate-100 group-hover:text-indigo-400 transition-all">{dl.title}</h4>
                      
                      {/* Custom Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] font-mono text-slate-500">
                          <span>Progress</span>
                          <span>{dl.progress}%</span>
                        </div>
                        <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-indigo-500 h-full rounded-full transition-all duration-500" 
                            style={{ width: `${dl.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex flex-col items-end justify-between h-full gap-4">
                      <button
                        onClick={(e) => handleDeleteDeadline(dl.id, e)}
                        className="text-slate-600 hover:text-red-400 transition-all p-1"
                        title="Delete Goal"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[10px] font-mono font-medium text-slate-500">
                        {daysRemaining}d left
                      </span>
                    </div>
                  </div>
                );
              })}
              {deadlines.length === 0 && (
                <p className="text-center text-xs text-slate-500 italic py-10">No deadline profiles created. Set a goal above to initialize.</p>
              )}
            </div>
          </div>

          {/* Multi-Project Conflict Detector */}
          <ConflictDetector deadlines={deadlines} onAutoResolve={handleResolveConflicts} />
        </div>

        {/* MIDDLE COLUMN (5 spans): Risk Gauge, What-If, Pipeline Analytics, Extension proposals */}
        <div className="xl:col-span-5 space-y-6">
          {activeDeadline ? (
            <>
              {/* Top Analytical Block: Split Risk and Simulation */}
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

              {/* Secret Weapon Extension Negotiation Panel (Conditional if risk score > 75%) */}
              {displayRisk > 75 && activeDeadline.negotiation && (
                <NegotiationPanel
                  negotiation={activeDeadline.negotiation}
                  deadlineTitle={activeDeadline.title}
                />
              )}

              {/* Sequential Multi-Agent Workspace Pipeline */}
              <AgentPipeline isRunning={isAnalyzing} />
            </>
          ) : (
            <div className="bg-[#0e0e1b] border border-slate-800/80 rounded-2xl p-12 text-center text-slate-500 h-full flex flex-col items-center justify-center">
              <Brain className="w-12 h-12 text-slate-700 animate-pulse mb-3" />
              <p className="text-sm font-semibold text-slate-400">Initialize a Deadline Profile</p>
              <p className="text-xs text-slate-600 mt-1 max-w-xs">Once a study target is created, the multi-agent guardian pipeline will process tasks and model fail metrics here.</p>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN (3 spans): Daily Coach & Task Checklists */}
        <div className="xl:col-span-3 space-y-6">
          {activeDeadline ? (
            <>
              {/* Daily Coach Plan */}
              <div id="daily-coach-card" className="bg-[#0e0e1b] border border-slate-800/80 rounded-2xl p-6 shadow-2xl space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 font-display flex items-center gap-1.5">
                      <Smile className="w-4 h-4 text-amber-400" />
                      Daily Coach Focus
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">Personal execution program calculated from active workloads</p>
                  </div>
                  <span className="text-[9px] font-mono text-indigo-400 font-bold px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded">Today</span>
                </div>

                <div className="space-y-3.5 bg-black/25 rounded-xl p-4 border border-slate-800/20">
                  <p className="text-xs text-slate-300 leading-normal font-sans italic">
                    "Hey Charan, your ML Hackathon risk is hovering at 87%. It's crunch time. Let's execute!"
                  </p>

                  <div className="space-y-2">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500 block">Energy focus scheduling</span>
                    <div className="space-y-1.5">
                      <div className="bg-[#15152a] border border-slate-800/50 rounded-lg p-2.5 flex justify-between items-center text-[10px]">
                        <div>
                          <strong className="text-slate-300 block">Morning Block (09:00 - 11:30)</strong>
                          <span className="text-slate-500 mt-0.5 block">Setup neural architectures & weights</span>
                        </div>
                        <span className="px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 font-semibold border border-red-500/15 shrink-0 uppercase tracking-wider text-[8px]">HIGH</span>
                      </div>
                      <div className="bg-[#15152a] border border-slate-800/50 rounded-lg p-2.5 flex justify-between items-center text-[10px]">
                        <div>
                          <strong className="text-slate-300 block">Afternoon Block (14:00 - 16:30)</strong>
                          <span className="text-slate-500 mt-0.5 block">Format vectors and dataset cleanings</span>
                        </div>
                        <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-semibold border border-amber-500/15 shrink-0 uppercase tracking-wider text-[8px]">MED</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-900 pt-3">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500 block">Hourly Demand summary</span>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs font-semibold text-slate-300">Total study load required</span>
                      <span className="text-xs font-mono font-bold text-indigo-400">7.0 hours today</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Task Breakdown & Interactive Checklists */}
              <div id="subtask-checklist-card" className="bg-[#0e0e1b] border border-slate-800/80 rounded-2xl p-6 shadow-2xl space-y-4">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 font-display flex items-center gap-1.5">
                    <ListTodo className="w-4 h-4 text-indigo-400" />
                    Execution Subtasks
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">Check completed tasks to dynamically lower fail predictions</p>
                </div>

                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
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
                        className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-all ${
                          task.completed ? 'bg-emerald-500 border-emerald-400' : 'border-slate-800 bg-black/40'
                        }`}
                      >
                        {task.completed && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                      </button>

                      <div className="space-y-1 flex-1 pr-2">
                        <div className="flex justify-between items-center">
                          <h4 className={`text-xs font-semibold leading-normal ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                            {task.title}
                          </h4>
                          <span className={`text-[8px] font-mono font-bold uppercase tracking-wider shrink-0 px-1.5 rounded-full ${
                            task.priority === 'critical' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {task.priority}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-normal">{task.description}</p>
                        
                        <div className="flex gap-2.5 pt-1 text-[9px] font-mono text-slate-500">
                          <span>{task.effortHours} hrs</span>
                          <span>•</span>
                          <span className="capitalize">{task.timeBlock} Block</span>
                          <span>•</span>
                          <button
                            onClick={() => setSelectedSubtask(task)}
                            className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-0.5 transition-all"
                          >
                            <GraduationCap className="w-3 h-3" />
                            Study Notes
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-[#0e0e1b] border border-slate-800/80 rounded-2xl p-10 text-center text-slate-500">
              Daily scheduling guidelines and task break-downs will process here once a goal is active.
            </div>
          )}
        </div>
      </main>

      {/* 3. STUDY ASSISTANT SLIDE-OVER DRAWER */}
      {selectedSubtask && activeDeadline && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-end z-50">
          <div className="w-full max-w-lg h-full animate-slide-in">
            <LearningDrawer
              subtask={selectedSubtask}
              deadlineTitle={activeDeadline.title}
              category={activeDeadline.category}
              onClose={() => setSelectedSubtask(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
