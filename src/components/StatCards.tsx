import { Briefcase, Users, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { DashboardStats } from '../types';

interface StatCardsProps {
  stats: DashboardStats;
}

export default function StatCards({ stats }: StatCardsProps) {
  const cards = [
    { label: 'Active Jobs', value: stats.activeJobs, icon: Briefcase, color: 'text-royal-gold' },
    { label: 'Total Candidates', value: stats.totalCandidates, icon: Users, color: 'text-emerald-400' },
    { label: 'Avg. Interview Score', value: `${stats.avgInterviewScore}%`, icon: Star, color: 'text-amber-400' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {cards.map((card, idx) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-slate-gray p-6 rounded-2xl border border-white/5 shadow-xl relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
            <card.icon size={80} />
          </div>
          <div className="relative z-10">
            <p className="text-xs uppercase tracking-widest text-white/40 font-semibold mb-2">{card.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-serif font-bold tracking-tight">{card.value}</h3>
              <div className={`p-2 rounded-lg bg-white/5 ${card.color}`}>
                <card.icon size={20} />
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
