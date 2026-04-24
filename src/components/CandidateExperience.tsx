import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, Send, BrainCircuit, User, Sparkles, Loader2, Play, Volume2 } from 'lucide-react';
import { InterviewPlan, InterviewStep, AnswerEvaluation } from '../types';
import { processInterviewStep, InterviewState } from '../services/interviewService';

interface CandidateExperienceProps {
  plan: InterviewPlan;
  candidateName: string;
  onComplete: (summary: any) => void;
  onExit: () => void;
}

export default function CandidateExperience({ plan, candidateName, onComplete, onExit }: CandidateExperienceProps) {
  const [isStarted, setIsStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<InterviewStep['next_step'] | null>(null);
  const [answer, setAnswer] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [lastEvaluation, setLastEvaluation] = useState<AnswerEvaluation | null>(null);
  const [interviewState, setInterviewState] = useState<InterviewState>({
    questionsAsked: [],
    answers: [],
    currentCompetency: plan.competencies[0]?.name || 'General',
  });

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const startInterview = async () => {
    setLoading(true);
    try {
      // Mocking an initial step so the first question comes from the AI logic
      const step = await processInterviewStep(plan, interviewState);
      setCurrentStep(step.next_step);
      setIsStarted(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim() || !currentStep) return;

    setLoading(true);
    const currentQuestion = currentStep.question;
    const currentAnswer = answer.trim();

    try {
      // Single unified inference for evaluation + next step
      const step = await processInterviewStep(plan, {
        ...interviewState,
        questionsAsked: [...interviewState.questionsAsked, currentQuestion],
        answers: [...interviewState.answers, { question: currentQuestion, answer: currentAnswer }],
        currentCompetency: currentStep.competency,
      });

      const { evaluation, next_step } = step;

      const newAnswer = { 
        question: currentQuestion, 
        answer: currentAnswer,
        evaluation 
      };

      const updatedState: InterviewState = {
        ...interviewState,
        questionsAsked: [...interviewState.questionsAsked, currentQuestion],
        answers: [...interviewState.answers, newAnswer],
        currentCompetency: next_step.competency,
      };

      setLastEvaluation(evaluation);
      setInterviewState(updatedState);
      setAnswer('');

      if (next_step.action === 'end_interview' || updatedState.answers.length >= 10) {
        onComplete(updatedState);
        return;
      }

      setCurrentStep(next_step);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isStarted) {
    return (
      <div className="fixed inset-0 bg-matte-black z-50 flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full bg-slate-gray p-12 rounded-[40px] border border-white/5 text-center space-y-8 shadow-2xl"
        >
          <div className="w-20 h-20 bg-royal-gold/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-royal-gold/20">
            <BrainCircuit className="text-royal-gold w-10 h-10" />
          </div>
          <div>
            <h1 className="text-4xl font-serif font-bold mb-4">Hello, {candidateName}</h1>
            <p className="text-white/40 leading-relaxed">
              Welcome to your AI-conducted interview for the <span className="text-white font-medium">{plan.jobTitle}</span> position. 
              This is a conversational experience designed to understand your expertise through structured dialogue.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="bg-white/2 p-4 rounded-2xl border border-white/5">
              <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold block mb-1">Duration</span>
              <span className="text-sm">Approx. 15-20 Mins</span>
            </div>
            <div className="bg-white/2 p-4 rounded-2xl border border-white/5">
              <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold block mb-1">Focus</span>
              <span className="text-sm">{plan.competencies.length} Key Competencies</span>
            </div>
          </div>
          <button 
            onClick={startInterview}
            disabled={loading}
            className="w-full bg-royal-gold text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-royal-gold/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Play size={20} />}
            {loading ? 'Initializing AI Persona...' : 'Begin Interview Session'}
          </button>
          <button onClick={onExit} className="text-white/20 hover:text-white/40 text-xs uppercase tracking-widest font-bold transition-colors">
            Exit and return to dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-matte-black z-50 flex flex-col">
      {/* Top Bar */}
      <header className="p-6 flex justify-between items-center bg-slate-gray/50 border-b border-white/5 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-royal-gold flex items-center justify-center border border-white/10 shadow-lg shadow-royal-gold/20">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="text-sm font-bold font-serif">Labdox AI Interviewer</h2>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Session ID: LDX-{Math.floor(Math.random()*10000)}</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-white/40 uppercase font-bold tracking-tighter">Progress</span>
            <div className="flex gap-1 mt-1">
              {Array.from({ length: 10 }).map((_, i) => (
                <div 
                  key={i} 
                  className={`w-4 h-1 rounded-full ${i < interviewState.answers.length ? 'bg-royal-gold' : 'bg-white/5'}`} 
                />
              ))}
            </div>
          </div>
          <button onClick={onExit} className="text-white/40 hover:text-white text-xs font-bold uppercase transition-colors">Exit</button>
        </div>
      </header>

      {/* Main Experience */}
      <main className="flex-1 overflow-hidden relative flex flex-col">
        <div className="flex-1 overflow-y-auto px-6 py-12" ref={chatContainerRef}>
          <div className="max-w-3xl mx-auto space-y-12">
            <AnimatePresence mode="popLayout">
              {/* Question bubble */}
              {currentStep && (
                <motion.div 
                  key={currentStep.question}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4 items-start"
                >
                  <div className="w-12 h-12 rounded-2xl bg-royal-gold/20 border border-royal-gold/20 flex items-center justify-center shrink-0">
                    <Volume2 className="text-royal-gold" size={20} />
                  </div>
                  <div className="space-y-4">
                     <span className="px-3 py-1 bg-white/5 border border-white/5 rounded-full text-[10px] font-bold text-white/30 uppercase tracking-widest italic">
                        {currentStep.action.replace('_', ' ')}: {currentStep.competency}
                     </span>
                     <h3 className="text-3xl font-serif font-bold text-white leading-tight">
                        {currentStep.question}
                     </h3>
                  </div>
                </motion.div>
              )}

              {/* AI Feedback bubble (Last Evaluation) */}
              {lastEvaluation && !loading && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex gap-4 items-start translate-x-16 max-w-2xl"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <Sparkles className="text-emerald-500" size={14} />
                  </div>
                  <div className="bg-emerald-500/5 border border-emerald-500/10 p-5 rounded-3xl space-y-3">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-emerald-500/60 tracking-widest">AI Assessment</span>
                        <div className="flex gap-2 items-center mt-1">
                          <span className="text-xs font-bold text-white/90">Clarity: {lastEvaluation.clarity}/10</span>
                          <span className="text-white/10">•</span>
                          <span className="text-xs font-bold text-white/90">Depth: {lastEvaluation.depth}/10</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-white/60 leading-relaxed italic">
                      "{lastEvaluation.improvement}"
                    </p>
                    <div className="flex flex-wrap gap-2">
                       {lastEvaluation.strengths.slice(0, 2).map((s, i) => (
                         <span key={i} className="text-[9px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full border border-emerald-500/10">{s}</span>
                       ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Loader */}
              {loading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-4 items-center pl-16"
                >
                  <div className="flex gap-1.5">
                    {[1, 2, 3].map(i => (
                      <motion.div 
                        key={i}
                        animate={{ height: [8, 20, 8] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                        className="w-1.5 bg-royal-gold rounded-full"
                      />
                    ))}
                  </div>
                  <span className="text-xs text-white/20 uppercase font-bold tracking-widest">AI is synthesizing...</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Interaction Area */}
        <div className="p-8 bg-gradient-to-t from-matte-black via-matte-black to-transparent">
          <div className="max-w-3xl mx-auto">
            <div className="bg-slate-gray rounded-[32px] border border-white/10 p-6 shadow-2xl relative overflow-hidden group focus-within:border-royal-gold/50 transition-all">
              <div className="flex items-end gap-4 relative z-10">
                <button 
                  onMouseDown={() => setIsListening(true)}
                  onMouseUp={() => setIsListening(false)}
                  className={`p-4 rounded-2xl transition-all ${
                    isListening 
                      ? 'bg-rose-500 text-white scale-110 shadow-[0_0_20px_rgba(244,63,94,0.4)]' 
                      : 'bg-white/5 text-white/40 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {isListening ? <Mic className="animate-pulse" /> : <MicOff />}
                </button>
                
                <textarea 
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type or speak your response..."
                  className="flex-1 bg-transparent border-none text-lg text-white placeholder:text-white/20 focus:outline-none resize-none py-3 min-h-[44px] max-h-[200px]"
                  style={{ height: 'auto' }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      submitAnswer();
                    }
                  }}
                />

                <button 
                  onClick={submitAnswer}
                  disabled={!answer.trim() || loading}
                  className="p-4 bg-royal-gold rounded-2xl text-white disabled:opacity-20 disabled:grayscale transition-all shadow-lg shadow-royal-gold/20"
                >
                  <Send size={20} />
                </button>
              </div>

              {isListening && (
                <div className="absolute inset-x-0 bottom-0 h-1 flex gap-1 px-6">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div 
                      key={i}
                      animate={{ height: [`${Math.random() * 40}%`, `${Math.random() * 100}%`, `${Math.random() * 40}%`] }}
                      transition={{ repeat: Infinity, duration: 0.4 }}
                      className="flex-1 bg-rose-500/30 rounded-t-full"
                    />
                  ))}
                </div>
              )}
            </div>
            
            <p className="text-center mt-6 text-[10px] text-white/20 uppercase tracking-[0.3em] font-bold">
              Press and hold SPACE to record audio (Simulated) • Enter to submit
            </p>
          </div>
        </div>
      </main>

      {/* Ambient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-royal-gold/5 blur-[120px] rounded-full animate-pulse" />
      </div>
    </div>
  );
}
