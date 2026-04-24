import { LayoutDashboard, Briefcase, Users, BarChart3, Settings } from 'lucide-react';
import { motion } from 'motion/react';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'jobs', label: 'Job Openings', icon: Briefcase },
  { id: 'candidates', label: 'Candidate Pipeline', icon: Users },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ activeView, onViewChange }: SidebarProps) {
  return (
    <div className="w-64 h-screen bg-slate-gray border-r border-white/5 flex flex-col fixed left-0 top-0 z-20">
      <div className="p-8">
        <h1 className="text-2xl font-serif font-bold text-royal-gold italic tracking-tight">Labdox</h1>
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mt-1">Interview Intelligence</p>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
              activeView === item.id 
                ? 'bg-royal-gold/10 text-royal-gold' 
                : 'text-white/60 hover:bg-white/5 hover:text-white'
            }`}
          >
            <item.icon size={20} className={activeView === item.id ? 'text-royal-gold' : 'group-hover:text-white'} />
            <span className="font-medium text-sm">{item.label}</span>
            {activeView === item.id && (
              <motion.div
                layoutId="active-pill"
                className="ml-auto w-1.5 h-1.5 rounded-full bg-royal-gold"
              />
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5">
        <div className="flex items-center space-x-3 px-4 py-3 bg-white/5 rounded-xl">
          <div className="w-8 h-8 rounded-full bg-royal-gold/20 flex items-center justify-center text-royal-gold font-serif text-sm border border-royal-gold/20">
            AD
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold">Admin Panel</span>
            <span className="text-[10px] text-white/40">kaushikist23@gmail.com</span>
          </div>
        </div>
      </div>
    </div>
  );
}
