import React, { useState } from 'react';
import { BookOpen, HelpCircle, Loader2, CheckCircle, AlertOctagon, HelpCircle as HintIcon, Lightbulb } from 'lucide-react';
import { LearningMaterial, Subtask } from '../types';

interface LearningDrawerProps {
  subtask: Subtask;
  deadlineTitle: string;
  category: string;
  onClose: () => void;
}

export default function LearningDrawer({ subtask, deadlineTitle, category, onClose }: LearningDrawerProps) {
  const [material, setMaterial] = useState<LearningMaterial | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'concepts' | 'practice' | 'mistakes'>('concepts');
  const [revealedQuestionIdx, setRevealedQuestionIdx] = useState<number | null>(null);

  const fetchLearningMaterial = async () => {
    setLoading(true);
    setMaterial(null);
    setRevealedQuestionIdx(null);
    try {
      const response = await fetch('/api/generate-learning', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subtaskTitle: subtask.title,
          subtaskDescription: subtask.description,
          deadlineTitle,
          category
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate study materials.');
      }

      const data = await response.json();
      setMaterial(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Trigger load on render
  React.useEffect(() => {
    fetchLearningMaterial();
  }, [subtask.id]);

  return (
    <div id="learning-drawer" className="bg-[#0e0e1b] border border-slate-800/80 rounded-2xl p-6 shadow-2xl space-y-4 h-full flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[9px] font-mono uppercase tracking-widest text-indigo-400 px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
              Agent 8: Learning Assistant
            </span>
            <h3 className="text-sm font-semibold text-slate-200 mt-1.5 font-display line-clamp-1">{subtask.title}</h3>
            <p className="text-[10px] text-slate-500 line-clamp-1">Study materials for parent goal: "{deadlineTitle}"</p>
          </div>
          <button 
            onClick={onClose}
            className="text-xs text-slate-500 hover:text-slate-300 transition-all font-mono"
          >
            Close
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            <p className="text-xs text-slate-400 font-mono">Compiling academic prep guides...</p>
          </div>
        ) : material ? (
          <div className="space-y-4">
            {/* Quick Summary Box */}
            <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-xl p-3">
              <span className="text-[9px] font-mono uppercase tracking-widest text-indigo-400 font-bold block mb-1">TL;DR Concepts Summary</span>
              <p className="text-[11px] text-slate-300 leading-normal">{material.summary}</p>
            </div>

            {/* Navigation tabs */}
            <div className="flex border-b border-slate-800/60 pb-1">
              <button
                onClick={() => setActiveTab('concepts')}
                className={`flex-1 text-center py-1 text-xs font-semibold border-b transition-all ${
                  activeTab === 'concepts' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-300'
                }`}
              >
                Concepts
              </button>
              <button
                onClick={() => setActiveTab('practice')}
                className={`flex-1 text-center py-1 text-xs font-semibold border-b transition-all ${
                  activeTab === 'practice' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-300'
                }`}
              >
                Practice
              </button>
              <button
                onClick={() => setActiveTab('mistakes')}
                className={`flex-1 text-center py-1 text-xs font-semibold border-b transition-all ${
                  activeTab === 'mistakes' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-300'
                }`}
              >
                Mistakes & Check
              </button>
            </div>

            {/* Tab content */}
            <div className="max-h-[340px] overflow-y-auto space-y-3 pr-1">
              {activeTab === 'concepts' && (
                <div className="space-y-3">
                  {material.keyConcepts.map((item, idx) => (
                    <div key={idx} className="bg-[#15152a] border border-slate-800/50 rounded-xl p-3 space-y-1">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-semibold text-slate-200">{item.concept}</h4>
                        <span className={`text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
                          item.importance === 'high' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {item.importance} importance
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-normal">{item.explanation}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'practice' && (
                <div className="space-y-3">
                  {material.practiceQuestions.map((q, idx) => {
                    const isRevealed = revealedQuestionIdx === idx;
                    return (
                      <div key={idx} className="bg-[#15152a] border border-slate-800/50 rounded-xl p-3 space-y-2">
                        <div className="flex justify-between items-start gap-2">
                          <span className="text-[9px] font-mono text-indigo-400 uppercase tracking-widest shrink-0 mt-0.5">Q0{idx+1}</span>
                          <p className="text-xs font-medium text-slate-200 flex-1 leading-normal">{q.question}</p>
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-slate-500">
                          <span className="capitalize">{q.type} • {q.difficulty}</span>
                          <button
                            onClick={() => setRevealedQuestionIdx(isRevealed ? null : idx)}
                            className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                          >
                            <Lightbulb className="w-3.5 h-3.5" />
                            {isRevealed ? 'Hide Hint' : 'Reveal Hint'}
                          </button>
                        </div>
                        {isRevealed && (
                          <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-lg p-2.5 text-[11px] text-indigo-300 leading-normal italic">
                            {q.answerHint}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {activeTab === 'mistakes' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Pitfalls */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 flex items-center gap-1">
                      <AlertOctagon className="w-3.5 h-3.5 text-red-400" /> Pitfalls to Avoid
                    </span>
                    <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-3 space-y-2 h-44 overflow-y-auto">
                      {material.commonMistakes.map((m, idx) => (
                        <p key={idx} className="text-[10px] text-slate-300 leading-normal pl-3 relative">
                          <span className="absolute left-0 text-red-400">•</span> {m}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Mastering checklist */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Mastery Checklist
                    </span>
                    <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-3 space-y-2 h-44 overflow-y-auto">
                      {material.revisionChecklist.map((c, idx) => (
                        <p key={idx} className="text-[10px] text-slate-300 leading-normal pl-4 relative">
                          <span className="absolute left-0 text-emerald-400 font-bold font-mono">✓</span> {c}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 text-slate-500 text-xs italic">
            Unable to load learning resources.
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-slate-900 flex justify-between items-center text-[10px] text-slate-500 font-mono">
        <span>Powered by Gemini 3.5 Flash</span>
        <button 
          onClick={fetchLearningMaterial}
          className="text-indigo-400 hover:text-indigo-300 font-semibold"
        >
          Regenerate Notes
        </button>
      </div>
    </div>
  );
}
