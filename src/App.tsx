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
  Loader2,
  LayoutDashboard,
  Settings,
  Cpu,
  BookOpen,
  X
} from 'lucide-react';

import LandingHero from './components/LandingHero';
import WorkspaceHub from './components/WorkspaceHub';
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
      emailBody: `Dear Organizing Team,\n\nI hope this message finds you well.\n\nI am writing to respectfully request a brief two-day extension for our team's submission deadline, originally scheduled for July 2nd. Due to unexpected data engineering bottlenecks and pipeline validation delays encountered yesterday, we require a bit of additional time to fully evaluate and compile our neural networks to our standards.\n\nWe have currently established the foundation pipelines and base validation metrics (approximately 20% complete) and are fully committed to submitting a finished entry. An extension to July 4th would ensure we can complete fine-tuning and thoroughly document our findings.\n\nThank you very much for your time, support, and consideration of our request.\n\nSincerely,\nLead Developer`,
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
  const [formErrors, setFormErrors] = useState<{ title?: boolean; dueDate?: boolean; category?: boolean; hoursPerDay?: boolean }>({});

  // Active UI Controls
  const [activeTab, setActiveTab] = useState<'dashboard' | 'goals' | 'calendar' | 'learning' | 'agents' | 'risk' | 'reflection' | 'settings'>('dashboard');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoadBalancing, setIsLoadBalancing] = useState(false);
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
    const id = `notif-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    setNotifications(prev => [
      { id, text, type, time: 'Just now' },
      ...prev
    ].slice(0, 10));

    // Auto-dismiss notifications after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
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

  const handleLogout = () => {
    // Clear all localStorage and sessionStorage
    localStorage.clear();
    sessionStorage.clear();

    // Reset React state
    setDeadlines([]);
    setSelectedId('');
    setActiveTab('dashboard');
    setSimulatedRiskOverride(null);
    setSimulatedLevelOverride(null);
    setActivities([
      'System: Deadline Guardian initialized successfully.',
      'System: Standby mode. Ready for custom goal initialization.'
    ]);
    
    // Add success toast
    addNotification('Workspace closed successfully.', 'success');
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
    console.log("Deploy Guardian clicked with inputs:", { title, dueDate, category, hoursPerDay, description });

    // Robust field-by-field validation
    const errors: { title?: boolean; dueDate?: boolean; category?: boolean; hoursPerDay?: boolean } = {};
    if (!title || !title.trim()) {
      errors.title = true;
      console.warn("Validation failed: Goal Title is missing");
    }
    if (!dueDate) {
      errors.dueDate = true;
      console.warn("Validation failed: Due Date is missing");
    }
    if (!category) {
      errors.category = true;
      console.warn("Validation failed: Category is missing");
    }
    if (!hoursPerDay || hoursPerDay <= 0) {
      errors.hoursPerDay = true;
      console.warn("Validation failed: Daily Study Capacity is invalid");
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      addNotification("Validation Error: Please fill in all highlighted fields with valid data.", "warning");
      return;
    }

    setFormErrors({});
    console.log("Validation passed successfully. Running pipeline...");
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
      
      const initialSubtasks = (parsedData.subtasks || []).map((t: any, idx: number) => ({
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
      }));

      addActivity(`Calendar Agent: Evaluating scheduling slots and blocking calendar tracks...`);
      let finalizedSubtasks = [...initialSubtasks];
      try {
        const calResponse = await fetch('/api/calendar-agent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subtasks: initialSubtasks })
        });
        if (calResponse.ok) {
          const calData = await calResponse.json();
          if (calData && Array.isArray(calData.scheduledBlocks)) {
            finalizedSubtasks = initialSubtasks.map(task => {
              const matchedBlock = calData.scheduledBlocks.find((b: any) => b.taskId === task.id);
              if (matchedBlock) {
                return {
                  ...task,
                  suggestedTime: matchedBlock.suggestedTime,
                  conflictDetected: matchedBlock.conflictDetected,
                  conflictReason: matchedBlock.conflictReason
                };
              }
              return task;
            });
            addActivity(`Calendar Agent: Allotted optimal time blocks on calendar track successfully.`);
          }
        }
      } catch (calErr) {
        console.warn('Calendar Agent API failed, using fallback slots solver.', calErr);
      }

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
        subtasks: finalizedSubtasks,
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
      setFormErrors({});

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
          { id: `sub-${Date.now()}-1-${Math.random().toString(36).substring(2, 9)}`, title: 'Initial Milestone Planning & Setup', description: 'Lay down system properties and constraints.', effortHours: 2, priority: 'critical', category: 'planning', scheduleDay: 1, timeBlock: 'morning', completed: false, completedAt: null, action: 'keep', suggestedTime: '09:00 AM – 11:00 AM', conflictDetected: false, conflictReason: '' },
          { id: `sub-${Date.now()}-2-${Math.random().toString(36).substring(2, 9)}`, title: 'Core Deliverable Drafting', description: 'Review prerequisites and structure draft layouts.', effortHours: 2, priority: 'high', category: 'building', scheduleDay: 1, timeBlock: 'afternoon', completed: false, completedAt: null, action: 'keep', suggestedTime: '02:00 PM – 04:00 PM', conflictDetected: false, conflictReason: '' }
        ],
        riskFactors: ['Workload density is caution-rated.', 'Review gaps early to lower congestion.'],
        recommendedAction: 'Maintain current steady pacing. Tackle morning planning early.',
        negotiation: null,
        dailyCoach: {
          greeting: `Let's keep our eyes on the target: "${title}".`,
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
      setFormErrors({});
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
  const handleResolveConflicts = async () => {
    console.log("Button clicked");
    if (!activeDeadline) {
      console.log("Validation failed: No active deadline selected");
      addNotification("No active deadline found to load balance.", "warning");
      return;
    }
    console.log("Validation passed");
    console.log("Calling API...");
    setIsLoadBalancing(true);

    addActivity(`Recovery Agent: Analyzing congestion for "${activeDeadline.title}"...`);
    
    try {
      const response = await fetch('/api/recovery-reschedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subtasks: activeDeadline.subtasks,
          riskScore: activeDeadline.riskScore
        })
      });

      console.log("API response received, status:", response.status);

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}: ${response.statusText}`);
      }

      const decisions = await response.json();
      console.log("API response parsed:", decisions);
      console.log("Updating state");
      
      setDeadlines(prev => {
        return prev.map(dl => {
          if (dl.id !== selectedId) return dl;

          const updatedSubtasks = dl.subtasks.map(task => {
            const decision = decisions.find((d: any) => d.taskId === task.id);
            if (decision) {
              let scheduleDay = task.scheduleDay;
              if (decision.action === 'defer') {
                scheduleDay = Math.min(5, scheduleDay + 1);
              }
              return {
                ...task,
                action: decision.action,
                scheduleDay,
                description: decision.reason ? `${task.description} (Recovery: ${decision.reason})` : task.description
              };
            }
            return task;
          });

          const resolvedRisk = Math.round(dl.riskScore * 0.65);
          let riskLevel: RiskLevelType = 'safe';
          if (resolvedRisk > 85) riskLevel = 'critical';
          else if (resolvedRisk > 60) riskLevel = 'danger';
          else if (resolvedRisk > 35) riskLevel = 'caution';

          addActivity(`AI Load Balancer: Recovery Agent resolved schedule conflicts using autonomous pruning decisions.`);
          addNotification('Recovery Agent rescheduled congestion successfully!', 'success');

          return {
            ...dl,
            subtasks: updatedSubtasks,
            riskScore: resolvedRisk,
            riskLevel,
            recommendedAction: `Congestion resolved by Recovery Agent. ${updatedSubtasks.filter(t => t.action === 'defer').length} tasks deferred, ${updatedSubtasks.filter(t => t.action === 'drop').length} dropped.`
          };
        });
      });

      console.log("Render complete");

    } catch (err) {
      console.warn('Recovery Agent API failed, running fallback scheduler logic.', err);
      console.log("Using intelligent local scheduling.");
      
      setDeadlines(prev => {
        return prev.map(dl => {
          if (dl.id !== selectedId) return dl;
          
          const updatedSubtasks = dl.subtasks.map((task, idx) => {
            let action: 'keep' | 'defer' | 'drop' = 'keep';
            let scheduleDay = task.scheduleDay;
            if (idx >= 3) {
              action = 'defer';
              scheduleDay = Math.min(5, scheduleDay + 1);
            }
            return {
              ...task,
              action,
              scheduleDay,
              timeBlock: (idx % 2 === 0 ? 'morning' : 'afternoon') as any
            };
          });

          const resolvedRisk = Math.round(dl.riskScore * 0.70);
          let riskLevel: RiskLevelType = 'safe';
          if (resolvedRisk > 85) riskLevel = 'critical';
          else if (resolvedRisk > 60) riskLevel = 'danger';
          else if (resolvedRisk > 35) riskLevel = 'caution';

          addActivity('AI Load Balancer: Density conflicts resolved using fallback schedule distribution.');
          addNotification('Using intelligent local scheduling.', 'success');

          return {
            ...dl,
            subtasks: updatedSubtasks,
            riskScore: resolvedRisk,
            riskLevel,
            recommendedAction: 'Daily tasks redistributed. Congestion cleared! Proceed with today\'s load balanced schedule.'
          };
        });
      });
      console.log("Render complete (Fallback)");
    } finally {
      setIsLoadBalancing(false);
    }

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
            <p className="text-xs text-slate-400">Google Gemini-Powered Multi-Agent Goal Planner & Rescheduling Assistant</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] text-slate-400 bg-black/40 border border-slate-900 rounded-xl px-4 py-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-slate-500">SYS TIME:</span>
          <span className="text-emerald-400 font-bold">{timeStr || '06:30:00'}</span>
          <span className="text-slate-700">|</span>
          <span className="text-slate-500">SCORE:</span>
          <span className="text-fuchsia-400 font-bold">{productivityScore}%</span>
        </div>
      </header>

      {/* PERSISTENT SIDEBAR + MAIN WORKSPACE WRAPPER */}
      <div className="flex-1 flex flex-col lg:flex-row w-full max-w-[1700px] mx-auto relative">
        
        {/* PREMIUM LEFT SIDEBAR */}
        {deadlines.length > 0 && (
          <aside className="w-full lg:w-64 lg:shrink-0 border-b lg:border-b-0 lg:border-r border-slate-900 bg-[#070710]/95 backdrop-blur-md lg:sticky lg:top-[73px] lg:h-[calc(100vh-73px)] flex flex-col justify-between p-5 z-30 animate-fade-in">
            <div className="space-y-6">
              {/* User Profile Info Card */}
              <div className="bg-[#0e0e1b] border border-slate-800/60 rounded-2xl p-4 flex items-center gap-3 relative overflow-hidden group">
                <div className="absolute inset-0 bg-indigo-500/[0.02] group-hover:bg-indigo-500/[0.04] transition-all"></div>
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs font-bold text-slate-200 truncate">Demo Workspace</h3>
                  <p className="text-[10px] text-indigo-400 font-mono tracking-wider truncate">AI Productivity Dashboard</p>
                </div>
              </div>

              {/* Sidebar Navigation Link Elements */}
              <nav className="space-y-1" aria-label="Sidebar Navigation">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
                  { id: 'goals', label: 'Goal Planner', icon: <ListTodo className="w-4 h-4" /> },
                  { id: 'calendar', label: 'Calendar', icon: <Calendar className="w-4 h-4" /> },
                  { id: 'learning', label: 'Learning Hub', icon: <GraduationCap className="w-4 h-4" /> },
                  { id: 'agents', label: 'Agent Pipeline', icon: <Cpu className="w-4 h-4" /> },
                  { id: 'risk', label: 'Risk Intelligence', icon: <AlertTriangle className="w-4 h-4" /> },
                  { id: 'reflection', label: 'AI Reflection', icon: <Smile className="w-4 h-4" /> },
                  { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> }
                ].map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                        isActive
                          ? 'bg-gradient-to-r from-indigo-500/10 to-indigo-500/[0.02] border border-indigo-500/30 text-indigo-400 font-bold shadow-sm shadow-indigo-500/5'
                          : 'border border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
                      }`}
                    >
                      <span className={isActive ? 'text-indigo-400' : 'text-slate-500'}>{tab.icon}</span>
                      <span>{tab.label}</span>
                      {isActive && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* SaaS/Hackathon Quality Badge */}
            <div className="mt-8 pt-4 border-t border-slate-900 space-y-2.5">
              <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 font-bold">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>AI ORCHESTRATION ENGINE</span>
              </div>
              <p className="text-[9px] text-slate-600 leading-relaxed">
                Consensus Multi-Agent system for study density balancing.
              </p>
            </div>
          </aside>
        )}

        {/* MAIN WORKSPACE CONTENT AREA */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          <Suspense fallback={
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
              <p className="text-sm font-mono text-slate-400">Synchronizing Multi-Agent Network...</p>
            </div>
          }>
            <WorkspaceHub
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              deadlines={deadlines}
              activeDeadline={activeDeadline}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              isAnalyzing={isAnalyzing}
              currentStep={currentStep}
              productivityScore={productivityScore}
              simulatedRiskOverride={simulatedRiskOverride}
              simulatedLevelOverride={simulatedLevelOverride}
              setSimulatedRiskOverride={setSimulatedRiskOverride}
              setSimulatedLevelOverride={setSimulatedLevelOverride}
              displayRisk={displayRisk}
              displayLevel={displayLevel}
              newTitle={newTitle}
              setNewTitle={setNewTitle}
              newDueDate={newDueDate}
              setNewDueDate={setNewDueDate}
              newCategory={newCategory}
              setNewCategory={setNewCategory}
              newHoursPerDay={newHoursPerDay}
              setNewHoursPerDay={setNewHoursPerDay}
              newDescription={newDescription}
              setNewDescription={setNewDescription}
              formErrors={formErrors}
              setFormErrors={setFormErrors}
              handleCreateDeadline={handleCreateDeadline}
              handleDeleteDeadline={handleDeleteDeadline}
              handleImportSyllabus={handleImportSyllabus}
              handleResolveConflicts={handleResolveConflicts}
              handleClearAll={handleClearAll}
              handleLoadDemoData={handleLoadDemoData}
              handleToggleSubtask={handleToggleSubtask}
              notifications={notifications}
              activities={activities}
              handleDismissNotification={handleDismissNotification}
              setSelectedSubtask={setSelectedSubtask}
              isLoadBalancing={isLoadBalancing}
              handleLogout={handleLogout}
            />
          </Suspense>
        </main>
      </div>

      {/* FLOATING TOAST NOTIFICATIONS */}
      <div className="fixed bottom-6 right-6 z-50 space-y-3 max-w-sm w-full pointer-events-none">
        {notifications.map(notif => (
          <div
            key={notif.id}
            className="pointer-events-auto bg-[#0e0e1b]/95 backdrop-blur-md border border-slate-850 rounded-xl p-4 shadow-2xl flex items-start gap-3 animate-slide-in relative overflow-hidden"
          >
            <div className={`absolute top-0 left-0 w-1 h-full ${
              notif.type === 'success' ? 'bg-emerald-500' :
              notif.type === 'warning' ? 'bg-amber-500' : 'bg-indigo-500'
            }`}></div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-200 font-medium font-sans leading-relaxed">{notif.text}</p>
              <span className="text-[9px] text-slate-500 font-mono mt-1 block">{notif.time || 'Just now'}</span>
            </div>
            <button
              onClick={() => handleDismissNotification(notif.id)}
              className="text-slate-500 hover:text-slate-300 transition-colors p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

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
