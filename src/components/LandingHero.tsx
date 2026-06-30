import React from 'react';
import {
  Plus,
  Sparkles,
  Star,
  CheckCircle2,
  ArrowRight,
  Calendar,
  AlertTriangle,
  Cpu,
  Mail,
  BookOpen,
  Zap,
  Check,
  ShieldAlert,
  Users,
  Activity,
  Award,
  RefreshCw
} from 'lucide-react';

interface LandingHeroProps {
  isAnalyzing: boolean;
  currentStep: number;
  handleLoadDemoData: () => void;
  setActiveTab: (tab: any) => void;
  agentPipelineEl: React.ReactNode;
}

export default function LandingHero({
  isAnalyzing,
  currentStep,
  handleLoadDemoData,
  setActiveTab,
  agentPipelineEl
}: LandingHeroProps) {
  return (
    <div className="max-w-5xl mx-auto py-2 space-y-16 animate-fade-in px-4">
      
      {/* 2. HERO HEADER SECTION */}
      <div className="text-center space-y-5 max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white font-display leading-tight bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
          Never Miss Another Deadline.
        </h1>
        
        <p className="text-slate-300 max-w-3xl mx-auto text-base sm:text-lg leading-relaxed">
          Deadline Guardian AI uses 9 Gemini-powered AI agents to plan, predict, schedule, teach and recover your work automatically.
        </p>

        {/* Call to Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={() => setActiveTab('goals')}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm py-3.5 px-7 rounded-xl transition-all shadow-lg shadow-indigo-600/30 border border-indigo-500/50 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 cursor-pointer focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          >
            <Plus className="w-4 h-4" />
            Deploy Guardian
          </button>
          
          <button
            onClick={handleLoadDemoData}
            className="bg-[#0e0e1b] hover:bg-[#15152a] text-amber-400 border border-amber-500/30 hover:border-amber-400/60 font-bold text-sm py-3.5 px-7 rounded-xl transition-all shadow-lg shadow-amber-500/5 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 cursor-pointer focus:ring-2 focus:ring-amber-400 focus:outline-none"
          >
            <Sparkles className="w-4 h-4" />
            Load Demo
          </button>
        </div>

        {/* TRUST BADGE CARDS SECTION */}
        <div className="pt-8 border-t border-slate-900">
          <div className="flex justify-center items-center gap-1 text-amber-400 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4.5 h-4.5 fill-amber-400" />
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 pt-2">
            {[
              'Powered by Google Gemini',
              '9 Specialized AI Agents',
              'Real-time Risk Prediction',
              'Smart Calendar Optimization',
              'Learning Assistant',
              'Recovery Planning'
            ].map((badge, idx) => (
              <div
                key={idx}
                className="px-3 py-3 bg-[#0e0e1b]/40 border border-slate-850 rounded-xl text-[10.5px] font-semibold text-slate-300 font-sans text-center flex flex-col justify-center items-center gap-1.5 hover:border-indigo-500/30 transition-all hover:bg-[#0e0e1b]/70 shadow-sm"
              >
                <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3px]" />
                <span className="leading-tight">{badge}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. WHY THIS PROJECT - SIDE-BY-SIDE COMPARISON */}
      <div className="bg-gradient-to-b from-[#0e0e1b]/60 to-[#070710]/40 border border-slate-850 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1.5">
          <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-400 font-mono">Dynamic AI Planning vs. Static Calendars</h3>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100 font-display">Why Deadline Guardian AI?</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Conventional planners rely entirely on manual upkeep and offer zero help when schedules get crowded. Here is how our AI team bridges the gap.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          {/* Traditional Planner */}
          <div className="p-6 bg-slate-950/40 border border-slate-900 rounded-2xl space-y-4 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-slate-700"></div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center border border-slate-850">
                <Calendar className="w-4 h-4 text-slate-500" />
              </div>
              <h4 className="text-sm font-bold text-slate-400 font-sans">Traditional Planner</h4>
            </div>
            
            <ul className="space-y-3.5">
              {[
                { title: 'Stores Tasks', desc: 'Merely keeps a flat text list of what is due, requiring you to recall and schedule everything.' },
                { title: 'Requires Manual Updates', desc: 'No ability to automatically adjust times or warn you if deadlines clash.' },
                { title: 'Fails in Emergencies', desc: 'If you miss a study session, the app remains silent while tasks pile up.' }
              ].map((item, idx) => (
                <li key={idx} className="text-xs space-y-1">
                  <strong className="text-slate-300 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
                    {item.title}
                  </strong>
                  <p className="text-slate-500 pl-3 leading-relaxed">{item.desc}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Deadline Guardian AI */}
          <div className="p-6 bg-indigo-950/10 border border-indigo-500/20 rounded-2xl space-y-4 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/[0.02] rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="flex items-center gap-2.5 justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                  <Zap className="w-4 h-4 text-indigo-400" />
                </div>
                <h4 className="text-sm font-bold text-indigo-400 font-sans">Deadline Guardian AI</h4>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-[9px] font-mono font-bold uppercase tracking-wider">
                Full Automation
              </span>
            </div>
            
            <ul className="space-y-3.5">
              {[
                { title: 'Plans Tasks & Creates Schedule', desc: 'Gemini breaks down complex goals into practical, bite-sized tasks and places them directly on your timeline.' },
                { title: 'Predicts Potential Conflicts', desc: 'Evaluates your calendar load and uses real-time projections to warn you before conflicts happen.' },
                { title: 'Generates Custom Learning Guides', desc: 'Drafts tailored study summaries and interactive quizzes to help you master tough topics.' },
                { title: 'Recovers Deadlines & Drafts Emails', desc: 'Provides active recovery plans for missed steps and drafts polite extension requests to instructors.' }
              ].map((item, idx) => (
                <li key={idx} className="text-xs space-y-1 animate-pulse-slow">
                  <strong className="text-slate-200 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                    {item.title}
                  </strong>
                  <p className="text-slate-400 pl-3 leading-relaxed">{item.desc}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 4. AI STORY - STORY FLOW DIAGRAM */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1.5">
          <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-400 font-mono">Interactive Lifecyle Flow</h3>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100 font-display">The Path of a Guardian Goal</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            From the moment you specify a target, our nine specialized agents coordinate step-by-step to guarantee success.
          </p>
        </div>

        <div className="p-6 bg-slate-950/20 border border-slate-900 rounded-2xl relative overflow-hidden">
          {/* Timeline Connector Line */}
          <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-gradient-to-r from-indigo-500/10 via-indigo-500/30 to-emerald-500/20 -translate-y-1/2 hidden md:block"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-9 gap-4 relative z-10">
            {[
              { step: '01', label: 'Create Goal', desc: 'Enter syllabus or voice dictation', color: 'indigo' },
              { step: '02', label: 'Plan Steps', desc: 'Planner structures subtasks', color: 'indigo' },
              { step: '03', label: 'Prioritize', desc: 'Priority logs chronological rank', color: 'indigo' },
              { step: '04', label: 'Schedule', desc: 'Calendar aligns daily hours', color: 'indigo' },
              { step: '05', label: 'Evaluate Risk', desc: 'System projects conflict level', color: 'amber' },
              { step: '06', label: 'Study Guides', desc: 'Learning issues dynamic summaries', color: 'indigo' },
              { step: '07', label: 'Auto Recovery', desc: 'Generates safety timeline fixes', color: 'rose' },
              { step: '08', label: 'Reflect', desc: 'Assess and logs feedback', color: 'emerald' },
              { step: '09', label: 'Success', desc: 'Goal is finalized', color: 'emerald' }
            ].map((node, idx) => (
              <div
                key={idx}
                className="p-3 bg-[#0e0e1b] border border-slate-850 rounded-xl flex flex-col justify-between space-y-2 relative group hover:border-indigo-500/30 transition-all text-center md:text-left"
              >
                <div className="flex items-center justify-between gap-1">
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    node.color === 'rose' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                    node.color === 'amber' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    node.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                  }`}>
                    {node.step}
                  </span>
                  
                  {idx < 8 && (
                    <ArrowRight className="w-3.5 h-3.5 text-slate-600 hidden md:block shrink-0" />
                  )}
                </div>

                <div>
                  <h5 className="text-[11px] font-bold text-slate-200 truncate">{node.label}</h5>
                  <p className="text-[9px] text-slate-500 font-sans leading-snug mt-0.5 line-clamp-2 md:line-clamp-3">{node.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. COGNITIVE PIPELINE LIVE RENDER */}
      <div className="space-y-4 bg-slate-950/20 p-6 border border-slate-900 rounded-2xl">
        <div className="text-center space-y-1">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500 font-mono">Live Agent Communication Monitor</h3>
          <p className="text-xs text-slate-400">See the agent pipeline coordinating in real-time below</p>
        </div>
        {agentPipelineEl}
      </div>

      {/* 6. MEET YOUR AI TEAM */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1.5">
          <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-400 font-mono">Expert Collaborative Matrix</h3>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100 font-display">Meet Your Specialized AI Team</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Nine highly coordinate AI roles work together under the hood. No complicated settings, just real productivity benefits.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: 'Planner Agent',
              icon: <Calendar className="w-4 h-4 text-indigo-400" />,
              purpose: 'Syllabus Decomposition',
              benefit: 'Converts any raw schedule or complex course timeline into structured daily subtasks automatically.'
            },
            {
              title: 'Priority Agent',
              icon: <Zap className="w-4 h-4 text-amber-400" />,
              purpose: 'Chronological Ranking',
              benefit: 'Calculates the real order of importance for your daily goals so you always tackle critical items first.'
            },
            {
              title: 'Calendar Agent',
              icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
              purpose: 'Capacity Allocation',
              benefit: 'Aligns study plans with your daily hours, establishing a highly balanced and sustainable calendar.'
            },
            {
              title: 'Risk Prediction Agent',
              icon: <AlertTriangle className="w-4 h-4 text-rose-400" />,
              purpose: 'Procrastination Forecasting',
              benefit: 'Runs what-if scenarios to score scheduling risk levels and alert you before a crunch period arrives.'
            },
            {
              title: 'Learning Agent',
              icon: <BookOpen className="w-4 h-4 text-sky-400" />,
              purpose: 'Syllabus Intelligence',
              benefit: 'Compiles custom flashcards and quick quizzes directly from your course materials to master subjects faster.'
            },
            {
              title: 'Recovery Agent',
              icon: <ShieldAlert className="w-4 h-4 text-fuchsia-400" />,
              purpose: 'Schedule Reconstruction',
              benefit: 'Intervenes the moment you slip behind to re-balance your study hours and build a stress-free safety plan.'
            },
            {
              title: 'Reflection Agent',
              icon: <Users className="w-4 h-4 text-teal-400" />,
              purpose: 'Retrospective Growth',
              benefit: 'Asks focused periodic feedback questions to tailor scheduling advice to your natural working pace.'
            },
            {
              title: 'Negotiation Agent',
              icon: <Mail className="w-4 h-4 text-violet-400" />,
              purpose: 'Communication Automation',
              benefit: 'Pre-drafts highly polite, professional extension requests for professors and supervisors when risk is too high.'
            },
            {
              title: 'Notification Agent',
              icon: <Activity className="w-4 h-4 text-pink-400" />,
              purpose: 'Instant Context Alerting',
              benefit: 'Maintains system-wide telemetry to toast-alert you immediately on dynamic shifts or balancing proposals.'
            }
          ].map((agent, index) => (
            <div
              key={index}
              className="p-5 bg-[#0e0e1b] border border-slate-850 rounded-2xl space-y-3.5 hover:border-indigo-500/45 transition-all shadow-md flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8.5 h-8.5 rounded-xl bg-slate-900 flex items-center justify-center border border-slate-800">
                    {agent.icon}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">{agent.title}</h4>
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">{agent.purpose}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed pt-1.5">{agent.benefit}</p>
              </div>

              <div className="pt-2 border-t border-slate-900/60 flex items-center justify-between text-[10px] text-indigo-400 font-mono">
                <span>Role Status</span>
                <span className="text-emerald-400 flex items-center gap-1 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Active
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
