import React, { useState, useEffect, useMemo, Suspense } from 'react';
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
  Activity,
  User,
  Zap,
  RotateCcw,
  Volume2,
  Lock,
  Compass,
  Loader2
} from 'lucide-react';

import { Deadline, Subtask, CategoryType, RiskLevelType, Negotiation, DailyCoachPlan } from './types';
import type { NotificationItem } from './components/RecentNotifications';

const RiskGauge = React.lazy(() => import('./components/RiskGauge'));
const AgentPipeline = React.lazy(() => import('./components/AgentPipeline'));
const SyllabusParser = React.lazy(() => import('./components/SyllabusParser'));
const WhatIfSimulation = React.lazy(() => import('./components/WhatIfSimulation'));
const ConflictDetector = React.lazy(() => import('./components/ConflictDetector'));
const NegotiationPanel = React.lazy(() => import('./components/NegotiationPanel'));
const LearningDrawer = React.lazy(() => import('./components/LearningDrawer'));
const VoiceInput = React.lazy(() => import('./components/VoiceInput'));

// New modular sub-components
const AIStatus = React.lazy(() => import('./components/AIStatus'));
const AISuggestions = React.lazy(() => import('./components/AISuggestions'));
const RecentActivity = React.lazy(() => import('./components/RecentActivity'));
const RecentNotifications = React.lazy(() => import('./components/RecentNotifications'));
const ReflectionAgent = React.lazy(() => import('./components/ReflectionAgent'));

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
      emailBody: `Dear Organizing Team,\n\nI hope this message finds you well.\n\nI am writing to respectfully request a brief two-day extension for our team's submission deadline, originally scheduled for July 2nd. Due to unexpected data engineering bottlenecks and pipeline validation delays encountered yesterday, we require a bit of additional time to fully evaluate and compile our neural networks to our standards.\n\nWe have currently established the foundation pipelines and base validation metrics (approximately 20% complete) and are fully committed to submitting a finished entry. An extension to July 4th would ensure we can complete fine-tuning and thoroughly document our findings.\n\nThank you very much for your time, support, and consideration of our request.\n\nSincerely,\nSai Charan`,
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
  // Empty State by Default for clean Hackathon standard, but load if stored
  const [deadlines, setDeadlines] = useState<Deadline[]>(() => {
    const saved = localStorage.getItem('deadline_guard_data');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedId, setSelectedId] = useState<string>(() => {
    const saved = localStorage.getItem('deadline_guard_data');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.length > 0) return parsed[0].id;
    }
    return '';
  });

  // Goal Entry State
  const [newTitle, setNewTitle] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newCategory, setNewCategory] = useState<CategoryType>('project');
  const [newHoursPerDay, setNewHoursPerDay] = useState(4);
  const [newDescription, setNewDescription] = useState('');

  // Active UI Controls
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [activeParser, setActiveParser] = useState(false);
  const [selectedSubtask, setSelectedSubtask] = useState<Subtask | null>(null);

  // Simulated Risk Controls
  const [simulatedRiskOverride, setSimulatedRiskOverride] = useState<number | null>(null);
  const [simulatedLevelOverride, setSimulatedLevelOverride] = useState<RiskLevelType | null>(null);

  // Reset simulator override when active deadline changes
  useEffect(() => {
    setSimulatedRiskOverride(null);
    setSimulatedLevelOverride(null);
  }, [selectedId]);

  // Clock state for Live dynamic dashboard
  const [timeStr, setTimeStr] = useState('');

  // Activity logs & notifications
  const [activities, setActivities] = useState<string[]>(() => {
    const saved = localStorage.getItem('deadline_guard_activities');
    return saved ? JSON.parse(saved) : [
      'System: Deadline Guardian initialized successfully.',
      'System: Standby mode. Ready for custom goal initialization.'
    ];
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { id: 'welcome', text: 'Welcome! Configure your goal or click "Load Demo Data" to explore.', type: 'info', time: 'Just now' }
  ]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('deadline_guard_data', JSON.stringify(deadlines));
  }, [deadlines]);

  const addActivity = (msg: string) => {
    setActivities(prev => {
      const updated = [`[${new Date().toLocaleTimeString('en-US', { hour12: false })}] ${msg}`, ...prev].slice(0, 15);
      localStorage.setItem('deadline_guard_activities', JSON.stringify(updated));
      return updated;
    });
  };

  const addNotification = (text: string, type: 'info' | 'warning' | 'success') => {
    setNotifications(prev => [
      { id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`, text, type, time: 'Just now' },
      ...prev
    ].slice(0, 10));
  };

  const handleDismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Seeding realistic prototype data
  const handleLoadDemoData = () => {
    setDeadlines(INITIAL_DEADLINES);
    setSelectedId(INITIAL_DEADLINES[0].id);
    addActivity('User triggered "Load Demo Data". Loaded Machine Learning Hackathon and DBMS exam paths.');
    addNotification('Demo profiles loaded successfully! System status: NOMINAL.', 'success');
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all deadline tracks? This cannot be undone.')) {
      setDeadlines([]);
      setSelectedId('');
      setSimulatedRiskOverride(null);
      setSimulatedLevelOverride(null);
      addActivity('Cleared all deadline profiles.');
      addNotification('All tracking profiles purged.', 'warning');
    }
  };

  const activeDeadline = useMemo(() => {
    return deadlines.find(d => d.id === selectedId) || deadlines[0] || null;
  }, [deadlines, selectedId]);

  // Compute overall productivity score (completion rate of all subtasks across all goals)
  const productivityScore = useMemo(() => {
    const total = deadlines.reduce((acc, curr) => acc + curr.subtasks.length, 0);
    const completed = deadlines.reduce((acc, curr) => acc + curr.subtasks.filter(t => t.completed).length, 0);
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }, [deadlines]);

  // Today's Focus: Surface the first incomplete subtask from the selected deadline
  const todaysFocusSubtask = useMemo(() => {
    return activeDeadline 
      ? activeDeadline.subtasks.find(t => !t.completed) || null 
      : null;
  }, [activeDeadline]);

  // 1. Trigger Multi-Agent AI Pipeline to analyze goal and schedule subtasks
  const handleCreateDeadline = async (
    title: string,
    dueDate: string,
    category: CategoryType,
    hoursPerDay: number,
    description: string
  ) => {
    console.log("Deploy Guardian clicked");

    // Robust field-by-field validation
    if (!title || !title.trim()) {
      console.warn("Validation failed: Title is missing");
      addNotification("Validation Error: Goal Title is required.", "warning");
      return;
    }
    if (!dueDate) {
      console.warn("Validation failed: Due Date is missing");
      addNotification("Validation Error: Please select a Target Due Date.", "warning");
      return;
    }
    if (!category) {
      console.warn("Validation failed: Category is missing");
      addNotification("Validation Error: Goal Category is required.", "warning");
      return;
    }
    if (!hoursPerDay || hoursPerDay <= 0) {
      console.warn("Validation failed: Capacity is invalid");
      addNotification("Validation Error: Daily Study Capacity must be at least 1 hour.", "warning");
      return;
    }

    console.log("Validation passed");
    setIsAnalyzing(true);
    setCurrentStep(1);
    addActivity(`Planner Agent initiated structural decomposition for "${title}"...`);
    addNotification(`AI Agent Pipeline launched to generate schedule for "${title}"!`, 'info');

    // Drive step progression smoothly
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < 9) return prev + 1;
        clearInterval(stepInterval);
        return prev;
      });
    }, 150);

    console.log("Sending API request");
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
      console.log("API response received");
      
      const newDeadline: Deadline = {
        id: `dl-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
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
          id: `sub-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 9)}`,
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
        negotiation: parsedData.negotiation || null,
        dailyCoach: parsedData.dailyCoach || null
      };

      clearInterval(stepInterval);
      setCurrentStep(10); // Complete
      setDeadlines(prev => [newDeadline, ...prev]);
      setSelectedId(newDeadline.id);
      
      // Clear inputs
      setNewTitle('');
      setNewDueDate('');
      setNewDescription('');

      addActivity(`Multi-Agent sequence complete. Scheduled ${newDeadline.subtasks.length} subtasks with ${newDeadline.riskScore}% risk assessment.`);
      addNotification(`Guardian deployed successfully for "${title}"!`, 'success');
    } catch (err: any) {
      console.error(err);
      addActivity(`Execution failed: ${err.message}`);
      addNotification('Upstream scheduling failed. Reverted to offline manual safety state.', 'warning');
      
      // Creating an offline-friendly fallback structure to prevent user blocking
      const fallbackDeadline: Deadline = {
        id: `dl-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        title,
        dueDate,
        category,
        description,
        hoursPerDay,
        progress: 0,
        riskScore: 45,
        riskLevel: 'caution',
        status: 'active',
        subtasks: [
          { id: `sub-${Date.now()}-1-${Math.random().toString(36).substring(2, 9)}`, title: 'Initial Milestone Planning & Setup', description: 'Lay down system properties and constraints.', effortHours: 2, priority: 'critical', category: 'planning', scheduleDay: 1, timeBlock: 'morning', completed: false, completedAt: null, action: 'keep' },
          { id: `sub-${Date.now()}-2-${Math.random().toString(36).substring(2, 9)}`, title: 'Core Deliverable Drafting', description: 'Review prerequisites and structure draft layouts.', effortHours: 2, priority: 'high', category: 'building', scheduleDay: 1, timeBlock: 'afternoon', completed: false, completedAt: null, action: 'keep' }
        ],
        riskFactors: ['Workload density is caution-rated.', 'Review gaps early to lower congestion.'],
        recommendedAction: 'Maintain current steady pacing. Tackle morning planning early.',
        negotiation: null,
        dailyCoach: {
          greeting: `Hey Sai Charan, let's keep our eyes on the target: "${title}".`,
          focusMessage: `Today focuses on building baseline structures and reviewing high-yield core concepts.`,
          timeBlocks: [
            {
              time: "09:00 AM – 11:00 AM",
              task: "Initial Milestone Planning & Setup",
              energyLevelRequired: "medium",
              tip: "Disable cellular phone notifications and isolate study tabs before starting."
            },
            {
              time: "02:00 PM – 05:00 PM",
              task: "Core Deliverable Drafting",
              energyLevelRequired: "high",
              tip: "Take a 5-minute hydration break every 25 minutes of focus work."
            }
          ],
          todaysPriority: "Initial Milestone Planning & Setup",
          estimatedCompletionHours: 4,
          coachingNote: "Prioritize execution of high-priority concepts early in your energy peaks."
        }
      };
      
      clearInterval(stepInterval);
      setCurrentStep(10);
      setDeadlines(prev => [fallbackDeadline, ...prev]);
      setSelectedId(fallbackDeadline.id);
      setNewTitle('');
      setNewDueDate('');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 2. Syllabus Import handler
  const handleImportSyllabus = (importedDeadlines: any[]) => {
    setActiveParser(false);
    addActivity(`Syllabus parsed! Importing ${importedDeadlines.length} items into scheduling engine.`);
    importedDeadlines.forEach((item, index) => {
      setTimeout(() => {
        handleCreateDeadline(
          item.title,
          item.dueDate,
          item.category,
          item.hoursPerDay,
          item.description
        );
      }, index * 600);
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
          
          if (nowComplete) {
            addActivity(`Completed task: "${sub.title}" under profile "${dl.title}".`);
            addNotification(`Task complete: "${sub.title}"`, 'success');
          } else {
            addActivity(`Unchecked task: "${sub.title}".`);
          }

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
        const progressOffset = (completedCount / total) * 45; // max 45% reduction
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
            return {
              ...task,
              scheduleDay: Math.min(5, task.scheduleDay + 1),
              timeBlock: (idx % 2 === 0 ? 'morning' : 'afternoon') as any
            };
          }
          return task;
        });

        const resolvedRisk = Math.round(dl.riskScore * 0.70);
        let riskLevel: RiskLevelType = 'safe';
        if (resolvedRisk > 85) riskLevel = 'critical';
        else if (resolvedRisk > 60) riskLevel = 'danger';
        else if (resolvedRisk > 35) riskLevel = 'caution';

        addActivity('AI Load Balancer: Density conflicts analyzed. Tasks distributed over Days 2 & 3.');
        addNotification('Schedule load-balanced successfully!', 'success');

        return {
          ...dl,
          subtasks: updatedSubtasks,
          riskScore: resolvedRisk,
          riskLevel,
          recommendedAction: 'Daily tasks redistributed. Congestion cleared! Proceed with today\'s load balanced schedule.'
        };
      });
    });

    setSimulatedRiskOverride(null);
    setSimulatedLevelOverride(null);
  };

  const handleDeleteDeadline = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const currentDl = deadlines.find(d => d.id === id);
    if (confirm(`Are you sure you want to dismiss this "${currentDl?.title}" tracking profile?`)) {
      const remaining = deadlines.filter(d => d.id !== id);
      setDeadlines(remaining);
      addActivity(`Dismissed deadline profile: "${currentDl?.title}".`);
      addNotification('Profile archived successfully.', 'warning');
      if (remaining.length > 0) {
        setSelectedId(remaining[0].id);
      } else {
        setSelectedId('');
      }
    }
  };

  // Simulated value selectors
  const displayRisk = simulatedRiskOverride !== null ? simulatedRiskOverride : (activeDeadline ? activeDeadline.riskScore : 0);
  const displayLevel = simulatedLevelOverride !== null ? simulatedLevelOverride : (activeDeadline ? activeDeadline.riskLevel : 'safe');

  return (
    <div className="min-h-screen bg-[#06060c] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-white">
      
      {/* 1. TOP HEADER BRAND */}
      <header className="border-b border-slate-900 bg-[#0e0e1b]/90 backdrop-blur-md px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Brain className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight font-display text-white flex items-center gap-1.5">
              DEADLINE GUARDIAN AI
            </h1>
            <p className="text-xs text-slate-400">Autonomous Multi-Agent AI Chief of Staff • Proactive Rescheduling Engine</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-slate-400 bg-black/40 border border-slate-900 rounded-xl px-4 py-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-slate-500">SYS TIME:</span>
          <span className="text-emerald-400 font-bold">{timeStr || '06:30:00'}</span>
          <span className="text-slate-700">|</span>
          <span className="text-slate-500">GEMINI:</span>
          <span className="text-indigo-400 font-bold">3.5-FLASH</span>
          <span className="text-slate-700">|</span>
          <span className="text-slate-500">SCORE:</span>
          <span className="text-fuchsia-400 font-bold">{productivityScore}%</span>
        </div>
      </header>

      {/* 2. MAIN HUB CONTAINER */}
      <main className="flex-1 p-6 max-w-[1600px] mx-auto w-full">
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            <p className="text-sm font-mono text-slate-400">Loading AI Guardian Workspace...</p>
          </div>
        }>
          {deadlines.length === 0 ? (
          
          /* BEAUTIFUL EMPTY STATE FOR NEW USERS WITH SEED OPTIONS & TECHNOLOGY HIGHLIGHTS */
          <div className="max-w-4xl mx-auto py-12 space-y-8 animate-fade-in">
            <div className="text-center space-y-3">
              <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono font-semibold uppercase tracking-wider">
                Autonomous Chief of Staff
              </span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white font-display">
                Navigate Schedules with AI Precision
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
                Deadline Guardian AI delegates planning, risk prediction, and extension draft negotiations to nine collaborating agents. Import a syllabus or initialize your first goal to boot.
              </p>
            </div>

            {/* SEED DATA & INITIALIZATION COMPASS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Load Demo Block */}
              <div className="bg-[#0e0e1b] border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:border-slate-700/80 transition-all shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-indigo-400 group-hover:scale-110 transition-all">
                  <Compass className="w-36 h-36" />
                </div>
                <div className="space-y-2 relative z-10">
                  <span className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400 inline-block">
                    <Sparkles className="w-5 h-5" />
                  </span>
                  <h3 className="text-lg font-semibold text-white">Explore with Pre-Seeded Profiles</h3>
                  <p className="text-xs text-slate-400 leading-normal">
                    Instantly seed the workspace with multi-agent plans including a critical risk Machine Learning Hackathon track and a Database Systems midterm exam schedule.
                  </p>
                </div>
                <button
                  onClick={handleLoadDemoData}
                  aria-label="Load Realistic Demo Data"
                  className="w-full bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs py-2.5 px-4 rounded-xl transition-all shadow-lg shadow-amber-600/15"
                >
                  Load Demo Data
                </button>
              </div>

              {/* Define Custom Goal */}
              <div className="bg-[#0e0e1b] border border-slate-800/80 rounded-2xl p-6 space-y-4 hover:border-slate-700/80 transition-all shadow-xl">
                <div className="space-y-1">
                  <span className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 inline-block mb-1">
                    <Plus className="w-5 h-5" />
                  </span>
                  <h3 className="text-lg font-semibold text-white">Initialize Custom Goal</h3>
                  <p className="text-xs text-slate-400 leading-normal">
                    Enter your academic test or technical project milestone to deploy our 9-agent consensus scheduler.
                  </p>
                </div>

                <div className="space-y-3 pt-1">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label htmlFor="goal-title-empty" className="sr-only">Goal Title</label>
                      <input
                        id="goal-title-empty"
                        type="text"
                        className="w-full bg-black/40 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                        placeholder="e.g. Capstone Presentation or Math Final"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                      />
                    </div>
                    <VoiceInput onTranscriptChange={(text) => setNewTitle(text)} />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label htmlFor="due-date-empty" className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">Due Date</label>
                      <input
                        id="due-date-empty"
                        type="date"
                        className="w-full bg-black/40 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                        value={newDueDate}
                        onChange={(e) => setNewDueDate(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="category-empty" className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">Category</label>
                      <select
                        id="category-empty"
                        className="w-full bg-black/40 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value as CategoryType)}
                      >
                        <option value="exam">Exam Study</option>
                        <option value="project">Project Deliverable</option>
                        <option value="interview">Interview Practice</option>
                        <option value="assignment">Homework Assignment</option>
                        <option value="work">Work Statement</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCreateDeadline(newTitle, newDueDate, newCategory, newHoursPerDay, newDescription)}
                    disabled={isAnalyzing}
                    aria-label="Deploy Goal Guardian"
                    className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800/80 text-white font-medium text-xs py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/15"
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
            </div>

            {/* SYLLABUS DRAG & DROP FOR EMPTY STATE */}
            <div className="bg-[#0e0e1b]/40 border border-slate-800/50 rounded-2xl p-6 shadow-xl">
              <SyllabusParser onImportDeadlines={handleImportSyllabus} />
            </div>

            {/* HIGHLIGHTED GOOGLE DEVELOPER TECHNOLOGIES */}
            <div className="border-t border-slate-900 pt-8 space-y-4">
              <h4 className="text-center font-display text-xs font-semibold uppercase tracking-widest text-slate-500">
                Powered by State-Of-The-Art Google Technologies
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3 bg-[#0e0e1b]/40 border border-slate-900 rounded-xl text-center space-y-1">
                  <Zap className="w-4 h-4 text-indigo-400 mx-auto" />
                  <span className="text-xs font-bold text-slate-200 block">Google Gemini</span>
                  <span className="text-[10px] text-slate-500 block">Structured Agent Reasoning</span>
                </div>
                <div className="p-3 bg-[#0e0e1b]/40 border border-slate-900 rounded-xl text-center space-y-1">
                  <Sparkles className="w-4 h-4 text-amber-400 mx-auto" />
                  <span className="text-xs font-bold text-slate-200 block">AI Studio</span>
                  <span className="text-[10px] text-slate-500 block">Consensus Prompts</span>
                </div>
                <div className="p-3 bg-[#0e0e1b]/40 border border-slate-900 rounded-xl text-center space-y-1">
                  <Activity className="w-4 h-4 text-emerald-400 mx-auto" />
                  <span className="text-xs font-bold text-slate-200 block">Google Cloud</span>
                  <span className="text-[10px] text-slate-500 block">Serverless Container Scale</span>
                </div>
                <div className="p-3 bg-[#0e0e1b]/40 border border-slate-900 rounded-xl text-center space-y-1">
                  <Calendar className="w-4 h-4 text-rose-400 mx-auto" />
                  <span className="text-xs font-bold text-slate-200 block">Calendar Ingest</span>
                  <span className="text-[10px] text-slate-500 block">Active Overlap Sync</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          
          /* PRIMARY IMMERSIVE DENSE WORKSPACE HUB (LINEAR + NOTION + GOOGLE CALENDAR COMBINED) */
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 animate-fade-in">
            
            {/* LEFT SIDEBAR COLUMN (4 spans): Profile Management, Goal Entry, Multi-Goal Monitors */}
            <div className="xl:col-span-4 space-y-6">
              
              {/* Brand Profile Quick Actions */}
              <div className="bg-[#0e0e1b] border border-slate-800/80 rounded-2xl p-4 shadow-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-800 text-slate-300">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-slate-200">Sai Charan</h3>
                    <p className="text-[10px] text-slate-500">Hackathon Core Account</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleClearAll}
                    aria-label="Clear All Profiles"
                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/10 transition-all text-xs flex items-center gap-1.5"
                    title="Purge workspace"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Clear
                  </button>
                </div>
              </div>

              {/* Today's Focus Action Guide */}
              <div id="todays-focus-card" className="bg-indigo-500/[0.03] border border-indigo-500/20 rounded-2xl p-5 shadow-2xl space-y-3.5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 blur-xl rounded-full" />
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[8px] font-mono font-bold tracking-widest text-indigo-400 uppercase px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                      Surfaced Target Hour Focus
                    </span>
                    <h3 className="text-sm font-semibold text-white mt-1.5 font-display flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-amber-400" />
                      Today's Action Focus
                    </h3>
                  </div>
                  <span className="text-[9px] font-mono text-slate-500">Block 1 of 3</span>
                </div>

                {todaysFocusSubtask ? (
                  <div className="space-y-3 bg-[#0e0e1b]/80 border border-slate-800/50 p-4 rounded-xl relative z-10">
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <h4 className="text-xs font-bold text-slate-200">{todaysFocusSubtask.title}</h4>
                        <p className="text-[10px] text-slate-500 leading-normal mt-0.5">{todaysFocusSubtask.description}</p>
                      </div>
                      <span className="px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 text-[8px] border border-red-500/10 font-bold font-mono">
                        {todaysFocusSubtask.priority.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[10px] pt-2 border-t border-slate-900">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-indigo-400" /> Estimated: {todaysFocusSubtask.effortHours}h
                      </span>
                      <button
                        onClick={() => handleToggleSubtask(selectedId, todaysFocusSubtask.id)}
                        aria-label="Complete surfaced focus task"
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-[9px] px-2.5 py-1 rounded transition-all"
                      >
                        Complete Task
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-black/20 border border-slate-800/40 p-4 rounded-xl text-center text-xs text-slate-500 italic">
                    All currently decomposing tasks are complete! Great pacing!
                  </div>
                )}
              </div>

              {/* Goal Quick Initialization Form */}
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
                    <div className="flex-1">
                      <label htmlFor="goal-title-workspace" className="sr-only">Goal Title</label>
                      <input
                        id="goal-title-workspace"
                        type="text"
                        className="w-full bg-black/40 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
                        placeholder="e.g. DBMS Normalization Midterm or Capstone Submit"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                      />
                    </div>
                    <VoiceInput onTranscriptChange={(text) => setNewTitle(text)} />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label htmlFor="due-date-workspace" className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Due Date</label>
                      <input
                        id="due-date-workspace"
                        type="date"
                        className="w-full bg-black/40 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
                        value={newDueDate}
                        onChange={(e) => setNewDueDate(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="category-workspace" className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Goal Category</label>
                      <select
                        id="category-workspace"
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
                      <label htmlFor="study-hours-workspace" className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Capacity (hrs/day)</label>
                      <input
                        id="study-hours-workspace"
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
                        disabled={isAnalyzing}
                        aria-label="Deploy Guardian Goal Profile"
                        className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800/80 text-white font-medium text-xs py-2 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/15"
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-white" />
                            Deploying...
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4" />
                            Deploy Guardian
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Syllabus Parser Toggle Block */}
              {activeParser ? (
                <SyllabusParser onImportDeadlines={handleImportSyllabus} />
              ) : (
                <button
                  onClick={() => setActiveParser(true)}
                  aria-label="Open syllabus parsing panel"
                  className="w-full bg-[#15152a]/40 hover:bg-[#1c1c38]/60 border border-slate-800/80 rounded-2xl p-4 transition-all flex items-center justify-between text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 group-hover:scale-105 transition-all">
                      <FileText className="w-4 h-4" />
                    </span>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-200">Import Syllabus / Course Sheets</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">Let AI parse schedules and bulk schedule all subtasks</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-indigo-400 font-bold group-hover:translate-x-1 transition-all">{`+`}</span>
                </button>
              )}

              {/* Upcoming Deadlines List */}
              <div id="deadlines-tracker" className="bg-[#0e0e1b] border border-slate-800/80 rounded-2xl p-6 shadow-2xl space-y-4">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 font-display flex items-center gap-1.5">
                    <ListTodo className="w-4 h-4 text-indigo-400" />
                    Upcoming Deadlines ({deadlines.length})
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
                            aria-label={`Archive goal ${dl.title}`}
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
                </div>
              </div>

              {/* Multi-Project Conflict Detector */}
              <ConflictDetector deadlines={deadlines} onAutoResolve={handleResolveConflicts} />
            </div>

            {/* MIDDLE HUB COLUMN (5 spans): Live Risk Gauges, Simulation, AI Suggestions, Pipeline */}
            <div className="xl:col-span-5 space-y-6">
              {activeDeadline || isAnalyzing ? (
                <>
                  {activeDeadline && (
                    <>
                      {/* Risk Overview & Simulation Bento Block */}
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

                      {/* Secret Weapon Extension Negotiation Panel */}
                      {displayRisk > 75 && activeDeadline.negotiation && (
                        <NegotiationPanel
                          negotiation={activeDeadline.negotiation}
                          deadlineTitle={activeDeadline.title}
                        />
                      )}

                      {/* AI Smart Suggestions Block */}
                      <div className="bg-[#0e0e1b] border border-slate-800/80 rounded-2xl p-6 shadow-2xl space-y-4">
                        <div>
                          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 font-display flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" />
                            Proactive Guardian Suggestions
                          </h3>
                          <p className="text-[11px] text-slate-500 mt-0.5">Calculated autonomously based on overlapping pacing densities</p>
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
                    </>
                  )}

                  {/* 9-Agent Pipeline Visualization */}
                  <AgentPipeline isRunning={isAnalyzing} currentStep={currentStep} />
                </>
              ) : (
                <div className="bg-[#0e0e1b] border border-slate-800/80 rounded-2xl p-12 text-center text-slate-500 h-full flex flex-col items-center justify-center">
                  <Brain className="w-12 h-12 text-slate-700 animate-pulse mb-3" />
                  <p className="text-sm font-semibold text-slate-400">Initialize a Deadline Profile</p>
                  <p className="text-xs text-slate-600 mt-1 max-w-xs">Once a study target is created, the multi-agent guardian pipeline will process tasks and model fail metrics here.</p>
                </div>
              )}
            </div>

            {/* RIGHT SIDEBAR COLUMN (3 spans): Daily Coach Regimen, Retrospective Reflection, System Logs */}
            <div className="xl:col-span-3 space-y-6">
              
              {/* Daily Coach Dynamic Card */}
              {activeDeadline ? (
                <div id="daily-coach-card" className="bg-[#0e0e1b] border border-slate-800/80 rounded-2xl p-6 shadow-2xl space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 font-display flex items-center gap-1.5">
                        <Smile className="w-4 h-4 text-amber-400" />
                        Daily Coach Focus
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">Energy focus scheduler calculated from active profiles</p>
                    </div>
                    <span className="text-[9px] font-mono text-indigo-400 font-bold px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded">Today</span>
                  </div>

                  <div className="space-y-3.5 bg-black/25 rounded-xl p-4 border border-slate-800/20">
                    <p className="text-xs text-slate-300 leading-normal font-sans italic">
                      {activeDeadline.dailyCoach?.greeting 
                        ? `"${activeDeadline.dailyCoach.greeting}"` 
                        : `"Hello Sai Charan, your current capacity is configured to ${activeDeadline.hoursPerDay}h daily. Let's optimize."`}
                    </p>
                    {activeDeadline.dailyCoach?.focusMessage && (
                      <p className="text-[11px] text-slate-400 font-sans">
                        {activeDeadline.dailyCoach.focusMessage}
                      </p>
                    )}

                    <div className="space-y-2">
                      <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500 block">Energy Block Allocation</span>
                      <div className="space-y-1.5">
                        {activeDeadline.dailyCoach?.timeBlocks && activeDeadline.dailyCoach.timeBlocks.length > 0 ? (
                          activeDeadline.dailyCoach.timeBlocks.map((block, idx) => (
                            <div key={idx} className="bg-[#15152a] border border-slate-800/50 rounded-lg p-2.5 flex justify-between items-center text-[10px] gap-2">
                              <div>
                                <strong className="text-indigo-400 block">{block.time}</strong>
                                <span className="text-slate-300 font-medium block mt-0.5">{block.task}</span>
                                {block.tip && <span className="text-[9px] text-slate-500 block mt-0.5 italic">{block.tip}</span>}
                              </div>
                              <span className={`px-1.5 py-0.5 rounded text-[8px] font-semibold uppercase tracking-wider shrink-0 ${
                                block.energyLevelRequired === 'high' 
                                  ? 'bg-red-500/10 text-red-400 border border-red-500/15' 
                                  : block.energyLevelRequired === 'medium'
                                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/15'
                                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15'
                              }`}>
                                {block.energyLevelRequired || 'MED'}
                              </span>
                            </div>
                          ))
                        ) : (
                          <>
                            <div className="bg-[#15152a] border border-slate-800/50 rounded-lg p-2.5 flex justify-between items-center text-[10px]">
                              <div>
                                <strong className="text-slate-300 block">Morning Slot (09:00 - 11:30)</strong>
                                <span className="text-slate-500 mt-0.5 block">
                                  {activeDeadline.subtasks[0] ? activeDeadline.subtasks[0].title : 'Primary planning milestones'}
                                </span>
                              </div>
                              <span className="px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 font-semibold border border-red-500/15 shrink-0 uppercase tracking-wider text-[8px]">HIGH</span>
                            </div>
                            <div className="bg-[#15152a] border border-slate-800/50 rounded-lg p-2.5 flex justify-between items-center text-[10px]">
                              <div>
                                <strong className="text-slate-300 block">Afternoon Slot (14:00 - 16:30)</strong>
                                <span className="text-slate-500 mt-0.5 block">
                                  {activeDeadline.subtasks[1] ? activeDeadline.subtasks[1].title : 'Review auxiliary files'}
                                </span>
                              </div>
                              <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-semibold border border-amber-500/15 shrink-0 uppercase tracking-wider text-[8px]">MED</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="border-t border-slate-900 pt-3">
                      <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500 block">Workload stats</span>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs font-semibold text-slate-300 font-sans">Active tasks today</span>
                        <span className="text-xs font-mono font-bold text-indigo-400">
                          {activeDeadline.subtasks.filter(t => !t.completed).length} items remaining
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-[#0e0e1b] border border-slate-800/80 rounded-2xl p-10 text-center text-slate-500 text-xs italic">
                  Daily scheduling directives and active checklists will deploy here once a goal is initialized.
                </div>
              )}

              {/* Cognitive Reflection Agent */}
              <ReflectionAgent deadlines={deadlines} />

              {/* AI Consensus Agent Status Grid */}
              <AIStatus currentStep={currentStep} isRunning={isAnalyzing} />

              {/* Dynamic Task Breakdown & Interactive Checklists */}
              {activeDeadline && (
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
                          aria-label={`Toggle task completion status for ${task.title}`}
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
                              aria-label={`Open tutor study notes for ${task.title}`}
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
              )}

              {/* Live Alerts & Log Lists */}
              <RecentNotifications notifications={notifications} onDismiss={handleDismissNotification} />
              <RecentActivity activities={activities} />

            </div>
          </div>
        )}
        </Suspense>
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
