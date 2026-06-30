export type CategoryType = 'exam' | 'project' | 'interview' | 'assignment' | 'work' | 'research';
export type RiskLevelType = 'safe' | 'caution' | 'danger' | 'critical';
export type PriorityType = 'critical' | 'high' | 'medium' | 'low';
export type TimeBlockType = 'morning' | 'afternoon' | 'evening';
export type SubtaskActionType = 'keep' | 'defer' | 'drop';

export interface DeferSuggestion {
  eventTitle: string;
  reason: string;
  hoursFreed: number;
}

export interface Negotiation {
  emailSubject: string;
  emailBody: string;
  tone: 'formal' | 'semi-formal';
  deferSuggestions: DeferSuggestion[];
  estimatedExtensionDays: number;
  confidenceMessage: string;
}

export interface Subtask {
  id: string;
  title: string;
  description: string;
  effortHours: number;
  priority: PriorityType;
  category: string;
  scheduleDay: number;
  timeBlock: TimeBlockType;
  completed: boolean;
  completedAt: string | null;
  action: SubtaskActionType;
}

export interface Deadline {
  id: string;
  title: string;
  description: string;
  dueDate: string; // ISO String
  category: CategoryType;
  progress: number; // 0-100
  riskScore: number; // 0-100
  riskLevel: RiskLevelType;
  status: 'active' | 'completed' | 'missed' | 'extended';
  hoursPerDay: number;
  subtasks: Subtask[];
  riskFactors: string[];
  recommendedAction: string;
  negotiation: Negotiation | null;
}

export interface LearningMaterial {
  keyConcepts: {
    concept: string;
    explanation: string;
    importance: 'high' | 'medium' | 'low';
  }[];
  summary: string;
  practiceQuestions: {
    question: string;
    type: string;
    difficulty: string;
    answerHint: string;
  }[];
  revisionChecklist: string[];
  commonMistakes: string[];
}

export interface DailyCoachPlan {
  greeting: string;
  focusMessage: string;
  timeBlocks: {
    time: string;
    task: string;
    energyLevelRequired: 'high' | 'medium' | 'low';
    tip: string;
  }[];
  todaysPriority: string;
  estimatedCompletionHours: number;
  coachingNote: string;
}

export interface SimulationParams {
  procrastinationPenalty: number; // 0-100
  studyHoursReduction: number; // study hours reduction per day (e.g. sick days)
  taskDelayDays: number; // days delayed
}
