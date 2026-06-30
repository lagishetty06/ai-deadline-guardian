import React, { useState } from 'react';
import { Upload, Sparkles, Plus, Loader2, Calendar, BookOpen, AlertCircle, Check } from 'lucide-react';
import { Deadline, CategoryType } from '../types';

interface SyllabusParserProps {
  onImportDeadlines: (deadlines: { title: string; dueDate: string; category: CategoryType; hoursPerDay: number; description: string }[]) => void;
}

export default function SyllabusParser({ onImportDeadlines }: SyllabusParserProps) {
  const [syllabusText, setSyllabusText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [parsedItems, setParsedItems] = useState<any[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleParse = async () => {
    if (!syllabusText.trim()) return;
    setIsParsing(true);
    setError(null);
    setParsedItems([]);

    try {
      const response = await fetch('/api/parse-syllabus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          syllabusText,
          currentLocalTime: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Syllabus parsing failed. Check your connection or API key.');
      }

      const data = await response.json();
      if (data.deadlines && data.deadlines.length > 0) {
        setParsedItems(data.deadlines);
        // Select all by default
        setSelectedIndices(data.deadlines.map((_: any, idx: number) => idx));
      } else {
        setError("AI couldn't find any clear deadlines or dates in the text. Try copying a different section.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during syllabus processing.');
    } finally {
      setIsParsing(false);
    }
  };

  const toggleSelect = (index: number) => {
    if (selectedIndices.includes(index)) {
      setSelectedIndices(selectedIndices.filter(i => i !== index));
    } else {
      setSelectedIndices([...selectedIndices, index]);
    }
  };

  const handleImport = () => {
    const itemsToImport = parsedItems.filter((_, idx) => selectedIndices.includes(idx));
    if (itemsToImport.length === 0) return;

    onImportDeadlines(
      itemsToImport.map(item => ({
        title: item.title,
        dueDate: item.dueDate,
        category: (item.category || 'assignment') as CategoryType,
        hoursPerDay: 4, // Default hours per day for newly parsed goals
        description: item.description || ''
      }))
    );

    // Reset state
    setParsedItems([]);
    setSyllabusText('');
    setSelectedIndices([]);
  };

  return (
    <div id="syllabus-parser" className="bg-[#0e0e1b] border border-slate-800/80 rounded-2xl p-6 shadow-2xl space-y-4">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 font-display flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-indigo-400" />
          Syllabus / Assignment Ingest
        </h3>
        <p className="text-[11px] text-slate-500 mt-0.5">Paste class timelines or work statements to auto-schedule all deliverables</p>
      </div>

      {parsedItems.length === 0 ? (
        <div className="space-y-4">
          <textarea
            className="w-full h-40 bg-black/40 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans resize-none"
            placeholder="Example:
CIS 312 Database Management Systems
- Project Milestone 1 (Entity Diagrams) due next Thursday, July 2nd. Require ~12 hours of planning.
- Exam 1: Comprehensive SQL query testing is on July 8th in class.
- Final Team presentation due July 15th."
            value={syllabusText}
            onChange={(e) => setSyllabusText(e.target.value)}
          />

          {error && (
            <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/5 border border-red-500/10 p-3 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handleParse}
            disabled={isParsing || !syllabusText.trim()}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800/80 text-white font-medium text-xs py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/15"
          >
            {isParsing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                Syllabus Agent Parsing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                AI Parse Syllabus Sheet
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="max-h-64 overflow-y-auto space-y-2 border border-slate-800/40 rounded-xl p-2 bg-black/10">
            {parsedItems.map((item, idx) => {
              const isSelected = selectedIndices.includes(idx);
              return (
                <div
                  key={idx}
                  onClick={() => toggleSelect(idx)}
                  className={`p-3 rounded-xl border cursor-pointer flex items-start justify-between transition-all ${
                    isSelected
                      ? 'bg-indigo-500/10 border-indigo-500/50'
                      : 'bg-[#15152a] border-slate-800/50 hover:border-slate-800'
                  }`}
                >
                  <div className="space-y-1 pr-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#15152a] border border-slate-800 text-indigo-400">
                        {item.category || 'assignment'}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        {item.dueDate}
                      </span>
                    </div>
                    <h4 className="text-xs font-semibold text-slate-200">{item.title}</h4>
                    <p className="text-[10px] text-slate-500 leading-normal line-clamp-2">{item.description}</p>
                  </div>

                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-all ${
                    isSelected ? 'bg-indigo-500 border-indigo-400' : 'border-slate-800 bg-black/40'
                  }`}>
                    {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3px]" />}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setParsedItems([])}
              className="flex-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-medium text-xs py-2 px-4 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={selectedIndices.length === 0}
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800/80 text-white font-medium text-xs py-2 px-4 rounded-xl transition-all flex items-center justify-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Import {selectedIndices.length} Deadlines
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
