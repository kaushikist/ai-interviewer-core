import { InterviewPlan, InterviewQuestion } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Edit2, Trash2, CheckCircle2, ChevronRight, BrainCircuit } from 'lucide-react';
import { useState } from 'react';

interface InterviewStrategyProps {
  plan: InterviewPlan;
  onUpdateQuestion: (question: InterviewQuestion) => void;
  onDeleteQuestion: (id: string) => void;
}

export default function InterviewStrategy({ plan, onUpdateQuestion, onDeleteQuestion }: InterviewStrategyProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<InterviewQuestion | null>(null);

  const startEdit = (q: InterviewQuestion) => {
    setEditingId(q.id);
    setEditForm({ ...q });
  };

  const saveEdit = () => {
    if (editForm) {
      onUpdateQuestion(editForm);
      setEditingId(null);
      setEditForm(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-3xl font-serif font-bold text-white mb-2">{plan.jobTitle}</h3>
          <p className="text-sm text-white/40 flex items-center gap-2">
            <BrainCircuit size={16} className="text-royal-gold" />
            AI-Engineered Interview Strategy
          </p>
        </div>
        <div className="flex gap-2">
           <span className="bg-white/5 border border-white/10 rounded-full px-4 py-1 text-[10px] uppercase tracking-widest font-bold">10 Questions</span>
           <span className="bg-royal-gold/10 border border-royal-gold/20 text-royal-gold rounded-full px-4 py-1 text-[10px] uppercase tracking-widest font-bold">Strategy Ready</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <h4 className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold px-1">Core Competencies</h4>
          <div className="space-y-3">
            {plan.competencies.map((comp, idx) => (
              <motion.div
                key={comp.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/5 border border-white/5 p-4 rounded-xl group hover:border-royal-gold/50 transition-all"
              >
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 size={14} className="text-royal-gold" />
                  <span className="text-sm font-bold text-white/90">{comp.name}</span>
                </div>
                <p className="text-xs text-white/40 leading-relaxed">{comp.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <h4 className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold px-1">Interview Questions</h4>
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {plan.questions.map((q, idx) => (
                <motion.div
                  key={q.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-slate-gray p-6 rounded-2xl border border-white/5 shadow-lg group hover:border-white/10 transition-all"
                >
                  {editingId === q.id ? (
                    <div className="space-y-4">
                      <textarea
                        value={editForm?.text}
                        onChange={(e) => setEditForm(prev => prev ? ({ ...prev, text: e.target.value }) : null)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:ring-1 focus:ring-royal-gold outline-none"
                        rows={2}
                      />
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setEditingId(null)} className="text-xs font-bold text-white/40 hover:text-white transition-colors">Cancel</button>
                        <button onClick={saveEdit} className="bg-royal-gold px-4 py-2 rounded-lg text-xs font-bold shadow-lg shadow-royal-gold/20">Save Revision</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-[10px] uppercase tracking-widest font-bold text-royal-gold bg-royal-gold/5 px-2 py-0.5 rounded border border-royal-gold/10">
                          {q.competency}
                        </span>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => startEdit(q)}
                            className="p-1.5 rounded-lg bg-white/5 text-white/60 hover:text-white transition-colors"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button 
                            onClick={() => onDeleteQuestion(q.id)}
                            className="p-1.5 rounded-lg bg-white/5 text-rose-400/60 hover:text-rose-400 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <h5 className="text-sm font-medium mb-3 text-white/90 leading-relaxed">{q.text}</h5>
                      <div className="flex items-start gap-2 bg-white/2 rounded-xl p-3 border border-white/5">
                        <ChevronRight size={14} className="text-royal-gold mt-1 shrink-0" />
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-white/30 uppercase tracking-tighter">Ideal Response Anchor</span>
                          <p className="text-xs text-white/40 leading-relaxed italic line-clamp-2 hover:line-clamp-none transition-all">{q.expectedAnswer}</p>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
