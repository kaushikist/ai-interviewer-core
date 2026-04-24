import { Candidate } from '../types';
import { motion } from 'motion/react';
import { MoreHorizontal, ArrowUpRight } from 'lucide-react';

interface CandidateTableProps {
  candidates: Candidate[];
}

export default function CandidateTable({ candidates }: CandidateTableProps) {
  return (
    <div className="bg-slate-gray rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
      <div className="p-6 border-bottom border-white/5 flex justify-between items-center">
        <h3 className="text-xl font-serif font-bold">Candidate Pipeline</h3>
        <button className="text-royal-gold text-xs font-semibold hover:underline flex items-center gap-1">
          View All <ArrowUpRight size={14} />
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5 bg-white/2 text-[10px] uppercase tracking-widest text-white/40">
              <th className="px-6 py-4 font-semibold">Candidate</th>
              <th className="px-6 py-4 font-semibold">Applied Role</th>
              <th className="px-6 py-4 font-semibold">Match Score</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {candidates.map((candidate, idx) => (
              <motion.tr
                key={candidate.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="hover:bg-white/2 transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-royal-gold flex items-center justify-center text-xs font-bold font-serif shadow-lg">
                      {candidate.name.charAt(0)}
                    </div>
                    <span className="text-sm font-medium">{candidate.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-white/70">{candidate.appliedRole}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 h-1.5 w-16 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          candidate.aiMatchScore > 80 ? 'bg-emerald-500' : 
                          candidate.aiMatchScore > 50 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${candidate.aiMatchScore}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-mono text-white/50">{candidate.aiMatchScore}%</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                    candidate.status === 'Completed' 
                      ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                      : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                  }`}>
                    {candidate.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {candidate.status === 'Completed' ? (
                    <button className="text-royal-gold text-[10px] uppercase font-bold tracking-widest hover:underline flex items-center gap-1 ml-auto">
                      View Decision <ArrowUpRight size={12} />
                    </button>
                  ) : (
                    <button className="text-white/20 hover:text-white transition-colors ml-auto">
                      <MoreHorizontal size={18} />
                    </button>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
