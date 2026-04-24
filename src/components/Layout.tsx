import { ReactNode } from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
  activeView: string;
  onViewChange: (view: string) => void;
}

export default function Layout({ children, activeView, onViewChange }: LayoutProps) {
  return (
    <div className="min-h-screen bg-matte-black text-white font-sans selection:bg-royal-gold/30">
      <Sidebar activeView={activeView} onViewChange={onViewChange} />
      <main className="ml-64 p-12 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
      
      {/* Decorative gradients */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-royal-gold/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
      <div className="fixed bottom-0 left-64 w-[300px] h-[300px] bg-emerald-500/5 blur-[100px] rounded-full -z-10 pointer-events-none" />
    </div>
  );
}
