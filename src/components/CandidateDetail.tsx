import { Candidate } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell
} from 'recharts';
import { 
  ArrowLeft, BrainCircuit, MessageSquare, ShieldCheck, 
  TrendingUp, Zap, AlertTriangle, PlayCircle, Download
} from 'lucide-react';

interface CandidateDetailProps {
  candidate: Candidate;
  onBack: () => void;
}

export default function CandidateDetail({ candidate, onBack }: CandidateDetailProps) {
  if (!candidate.evaluation) return null;

  const radarData = [
    { subject: 'Communication', A: candidate.evaluation.communication * 10, fullMark: 100 },
    { subject: 'Thinking', A: candidate.evaluation.thinking * 10, fullMark: 100 },
    { subject: 'Technical skills', A: candidate.evaluation.skills * 10, fullMark: 100 },
    { subject: 'Confidence', A: candidate.evaluation.confidence * 10, fullMark: 100 },
    { subject: 'Clarity', A: candidate.evaluation.clarity * 10, fullMark: 100 },
  ];

  const barData = [
    { name: 'Comm', score: candidate.evaluation.communication },
    { name: 'Think', score: candidate.evaluation.thinking },
    { name: 'Skills', score: candidate.evaluation.skills },
    { name: 'Conf', score: candidate.evaluation.confidence },
    { name: 'Clarity', score: candidate.evaluation.clarity },
  ];

  const getColor = (score: number) => {
    if (score >= 8) return '#10b981';
    if (score >= 6) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <header className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm font-medium"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
        <div className="flex gap-3">
          <button className="bg-white/5 border border-white/10 p-2.5 rounded-xl hover:bg-white/10 transition-all text-white/60">
            <Download size={18} />
          </button>
          <button className="bg-royal-gold text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-royal-gold/20 flex items-center gap-2">
            Contact Candidate
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile & Stats */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-gray p-8 rounded-3xl border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-royal-gold/10 blur-3xl -z-10" />
            
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-24 h-24 rounded-full bg-royal-gold flex items-center justify-center text-3xl font-serif font-bold shadow-2xl mb-4 border-4 border-white/5">
                {candidate.name.charAt(0)}
              </div>
              <h2 className="text-2xl font-serif font-bold mb-1">{candidate.name}</h2>
              <p className="text-sm text-white/40">{candidate.email}</p>
              <div className="mt-4 px-4 py-1.5 bg-royal-gold/10 border border-royal-gold/20 rounded-full text-[10px] uppercase tracking-widest font-bold text-royal-gold">
                {candidate.appliedRole}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/2 p-4 rounded-2xl border border-white/5">
                <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">AI Match</p>
                <p className="text-2xl font-serif font-bold text-emerald-500">{candidate.aiMatchScore}%</p>
              </div>
              <div className="bg-white/2 p-4 rounded-2xl border border-white/5">
                <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Status</p>
                <p className="text-2xl font-serif font-bold text-royal-gold">{candidate.status}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-gray p-6 rounded-3xl border border-white/5">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-6 flex items-center gap-2">
              <TrendingUp size={16} /> Competency radar
            </h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#ffffff10" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#ffffff40', fontSize: 10 }} />
                  <Radar
                    name={candidate.name}
                    dataKey="A"
                    stroke="#1E405C"
                    fill="#1E405C"
                    fillOpacity={0.6}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column: Decisions & Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-gray p-8 rounded-3xl border border-white/5">
            <h3 className="text-xl font-serif font-bold mb-6 flex items-center gap-2">
              <BrainCircuit size={24} className="text-royal-gold" />
              Decision Engine Analysis
            </h3>
            
            <div className="bg-royal-gold/5 border border-royal-gold/10 p-6 rounded-2xl mb-8">
              <h4 className="text-[10px] uppercase tracking-widest font-bold text-royal-gold mb-3">AI EXECUTIVE SUMMARY</h4>
              <p className="text-sm text-white/80 leading-relaxed italic">
                "{candidate.evaluation.aiSummary}"
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-[10px] uppercase tracking-widest font-bold text-emerald-500 flex items-center gap-2">
                  <Zap size={14} /> CORE STRENGTHS
                </h4>
                <ul className="space-y-3">
                  {candidate.evaluation.strengths.map((str, i) => (
                    <li key={i} className="text-sm text-white/60 flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      {str}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-[10px] uppercase tracking-widest font-bold text-rose-400 flex items-center gap-2">
                  <AlertTriangle size={14} /> CRITICAL GAPS
                </h4>
                <ul className="space-y-3">
                  {candidate.evaluation.weaknesses.map((weak, i) => (
                    <li key={i} className="text-sm text-white/60 flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                      {weak}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-slate-gray p-6 rounded-3xl border border-white/5">
                <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-6 flex items-center gap-2">
                  <MessageSquare size={16} /> Score Distribution
                </h3>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData}>
                      <XAxis dataKey="name" tick={{ fill: '#ffffff40', fontSize: 10 }} axisLine={false} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#262626', border: '1px solid #ffffff10', borderRadius: '12px' }}
                        itemStyle={{ color: '#fff' }}
                      />
                      <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                        {barData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={getColor(entry.score)} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
             </div>

             <div className="bg-slate-gray p-6 rounded-3xl border border-white/5 flex flex-col justify-center items-center text-center space-y-4 group cursor-pointer hover:border-royal-gold/30 transition-all">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <PlayCircle size={32} className="text-royal-gold" />
                </div>
                <div>
                  <h4 className="text-lg font-serif font-bold">Interview Playback</h4>
                  <p className="text-xs text-white/40">32:14 mins recording with AI captions</p>
                </div>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="w-1 h-3 bg-royal-gold/20 rounded-full group-hover:h-5 transition-all" style={{ animationDelay: `${i * 0.1}s` }} />
                  ))}
                </div>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
