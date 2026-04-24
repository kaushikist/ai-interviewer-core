/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import Layout from './components/Layout';
import StatCards from './components/StatCards';
import CandidateTable from './components/CandidateTable';
import JobCreation from './components/JobCreation';
import InterviewStrategy from './components/InterviewStrategy';
import CandidateDetail from './components/CandidateDetail';
import CandidateExperience from './components/CandidateExperience';
import { InterviewPlan, InterviewQuestion, Candidate, DashboardStats, Evaluation } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { PlusCircle, Search, BrainCircuit, TrendingUp, Play, Sparkles } from 'lucide-react';

const MOCK_EVALUATIONS: Record<string, Evaluation> = {
  '1': {
    communication: 9,
    thinking: 8.5,
    skills: 9.5,
    clarity: 9,
    confidence: 8,
    strengths: [
      'Exceptional architectural thinking in distributed systems',
      'Strong articulation of trade-offs between SQL vs NoSQL',
      'High adaptability when probing into edge cases'
    ],
    weaknesses: [
      'Slight hesitation in estimating migration timelines',
      'Could provide more concrete examples of team conflict resolution'
    ],
    aiSummary: 'Alexander demonstrates senior-level expertise in backend systems. His technical depth is matched by clear, professional communication. He is a high-conviction hire for the Senior AI Engineer role.'
  },
  '4': {
    communication: 8,
    thinking: 9,
    skills: 8.5,
    clarity: 8.5,
    confidence: 9,
    strengths: [
      'Deep understanding of React rendering lifecycle',
      'Strong focus on performance optimization and web vitals',
      'Highly confident and articulate'
    ],
    weaknesses: [
      'Less familiar with micro-frontend orchestration patterns',
      'Over-engineered the initial coding challenge before simplifying'
    ],
    aiSummary: 'Elena has a very strong command of frontend technologies. Her confidence and clarity make her a natural lead. She handles pressure well and explains complex state-management logic with ease.'
  }
};

const MOCK_CANDIDATES: Candidate[] = [
  { 
    id: '1', 
    name: 'Alexander Wright', 
    email: 'a.wright@tech.com', 
    appliedRole: 'Senior AI Engineer', 
    aiMatchScore: 94, 
    status: 'Completed',
    evaluation: MOCK_EVALUATIONS['1']
  },
  { id: '2', name: 'Sophia Chen', email: 'sophia.c@design.io', appliedRole: 'Product Designer', aiMatchScore: 88, status: 'Pending' },
  { id: '3', name: 'Marcus Jones', email: 'mjones@cloud.net', appliedRole: 'Backend Developer', aiMatchScore: 72, status: 'Completed' },
  { 
    id: '4', 
    name: 'Elena Rodriguez', 
    email: 'elena.r@dev.com', 
    appliedRole: 'Frontend Lead', 
    aiMatchScore: 91, 
    status: 'Completed',
    evaluation: MOCK_EVALUATIONS['4']
  },
  { id: '5', name: 'David Kim', email: 'dkim@data.labs', appliedRole: 'Data Scientist', aiMatchScore: 65, status: 'Pending' },
];

const MOCK_STATS: DashboardStats = {
  activeJobs: 12,
  totalCandidates: 458,
  avgInterviewScore: 84.5
};

export default function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [candidates] = useState<Candidate[]>(MOCK_CANDIDATES);
  const [stats] = useState<DashboardStats>(MOCK_STATS);
  const [currentPlan, setCurrentPlan] = useState<InterviewPlan | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  const handlePlanGenerated = (plan: InterviewPlan) => {
    setCurrentPlan(plan);
    setActiveView('strategy');
  };

  const handleUpdateQuestion = (updatedQ: InterviewQuestion) => {
    if (!currentPlan) return;
    setCurrentPlan({
      ...currentPlan,
      questions: currentPlan.questions.map(q => q.id === updatedQ.id ? updatedQ : q)
    });
  };

  const handleDeleteQuestion = (id: string) => {
    if (!currentPlan) return;
    setCurrentPlan({
      ...currentPlan,
      questions: currentPlan.questions.filter(q => q.id !== id)
    });
  };

  const viewCandidateDetails = (candidate: Candidate) => {
    if (candidate.evaluation) {
      setSelectedCandidate(candidate);
      setActiveView('candidate-detail');
    }
  };

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            <header className="flex justify-between items-end mb-4">
              <div>
                <h2 className="text-4xl font-serif font-bold tracking-tight mb-2 text-white">Decision Intelligence</h2>
                <p className="text-white/40 text-sm">Labdox AI: Transforming interview signals into hiring decisions.</p>
              </div>
              <div className="bg-slate-gray border border-white/5 rounded-xl p-1 flex items-center pr-3">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                  <input 
                    type="text" 
                    placeholder="Search candidate..." 
                    className="bg-transparent border-none py-2 pl-10 pr-4 text-xs focus:outline-none w-64 text-white"
                  />
                </div>
                <div className="w-1 h-4 bg-white/5 mx-2 rounded-full" />
                <button className="text-[10px] uppercase font-bold tracking-widest text-royal-gold">Filter</button>
              </div>
            </header>

            <StatCards stats={stats} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div 
                  className="cursor-pointer" 
                  onClick={(e) => {
                    const target = e.target as HTMLElement;
                    const row = target.closest('tr');
                    if (row) {
                      const index = Array.from(row.parentElement?.children || []).indexOf(row);
                      const candidate = candidates[index];
                      if (candidate) viewCandidateDetails(candidate);
                    }
                  }}
                >
                  <CandidateTable candidates={candidates} />
                </div>
              </div>
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-slate-gray p-6 rounded-2xl border border-white/5">
                  <h3 className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-6">Hiring Velocity</h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Engineering', count: 12, trend: '+4' },
                      { label: 'Design', count: 5, trend: '+1' },
                      { label: 'Product', count: 3, trend: '0' },
                      { label: 'Sales', count: 8, trend: '+12' },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between">
                        <span className="text-sm text-white/60">{item.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold">{item.count}</span>
                          <span className={`text-[10px] ${item.trend.startsWith('+') ? 'text-emerald-500' : 'text-white/20'}`}>{item.trend}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-white/40 uppercase font-bold">Overall Status</span>
                      <span className="text-emerald-500 text-xs font-bold">Optimal Hiring Pipeline</span>
                    </div>
                    <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                      <TrendingUp size={16} />
                    </div>
                  </div>
                </div>
                
                <div className="bg-royal-gold/10 border border-royal-gold/20 p-6 rounded-2xl">
                   <h4 className="text-sm font-bold text-royal-gold mb-2">Decision Tip</h4>
                   <p className="text-xs text-royal-gold/60 leading-relaxed">
                     Alexander Wright is currently your top-ranked engineer. Data shows 94% alignment with Senior AI Role requirements.
                   </p>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'jobs':
        return (
          <div className="space-y-8">
             <header className="flex justify-between items-center bg-royal-gold/5 p-8 rounded-3xl border border-royal-gold/10">
              <div>
                <h2 className="text-3xl font-serif font-bold tracking-tight">Active Opportunities</h2>
                <p className="text-white/40 text-sm">Scale your organization with dynamic AI-powered strategies.</p>
              </div>
              <button 
                onClick={() => setActiveView('create-job')}
                className="bg-royal-gold text-white px-8 py-3.5 rounded-xl font-bold flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-royal-gold/20"
              >
                <PlusCircle size={20} /> Open New Role
              </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {['Senior Backend Developer', 'Product Manager', 'UX Designer'].map((job, idx) => (
                <div key={job} className="bg-slate-gray p-6 rounded-2xl border border-white/5 hover:border-royal-gold/30 transition-all group">
                   <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-royal-gold/10 rounded-xl text-royal-gold">
                        <BrainCircuit size={20} />
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-white/20">LIVE</span>
                   </div>
                   <h4 className="text-lg font-serif font-bold mb-2">{job}</h4>
                   <p className="text-xs text-white/40 mb-6">Generated on Oct 24, 2026 • 12 Candidates</p>
                   <button className="w-full py-3 bg-white/5 border border-white/5 rounded-xl text-xs font-bold hover:bg-white/10 transition-all">
                      View full strategy
                   </button>
                </div>
              ))}
              <button 
                onClick={() => setActiveView('create-job')}
                className="border-2 border-dashed border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center space-y-3 text-white/20 hover:text-white/40 hover:border-white/20 transition-all"
              >
                <PlusCircle size={32} />
                <span className="text-sm font-bold uppercase tracking-widest">Add New Role</span>
              </button>
            </div>
          </div>
        );

      case 'create-job':
        return (
          <div className="max-w-4xl mx-auto">
            <JobCreation onPlanGenerated={handlePlanGenerated} />
          </div>
        );
      
      case 'strategy':
        return currentPlan ? (
          <div className="space-y-12">
            <div className="bg-royal-gold/10 border border-royal-gold/20 p-8 rounded-[40px] flex justify-between items-center relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-r from-royal-gold/5 opacity-0 group-hover:opacity-100 transition-opacity" />
               <div className="relative z-10">
                  <h3 className="text-xl font-serif font-bold text-royal-gold mb-2 flex items-center gap-2">
                    <Sparkles className="animate-pulse text-royal-gold" size={20} /> Final Verification Mode
                  </h3>
                  <p className="text-royal-gold/60 text-sm max-w-sm">Test the AI Interviewer persona using the generated strategy before sending to candidates.</p>
               </div>
               <button 
                  onClick={() => setActiveView('interview-demo')}
                  className="relative z-10 bg-royal-gold text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-xl shadow-royal-gold/30 hover:scale-105 hover:brightness-110 transition-all"
               >
                  <Play size={20} fill="currentColor" /> Launch Simulation
               </button>
            </div>
            <InterviewStrategy 
              plan={currentPlan} 
              onUpdateQuestion={handleUpdateQuestion}
              onDeleteQuestion={handleDeleteQuestion}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
            <h3 className="text-2xl font-serif text-white/40">Strategy Laboratory is Empty</h3>
            <button 
              onClick={() => setActiveView('create-job')}
              className="bg-royal-gold/10 text-royal-gold px-6 py-2 rounded-full font-bold text-sm"
            >
              Start by crafting a job role
            </button>
          </div>
        );

      case 'interview-demo':
        return currentPlan ? (
          <CandidateExperience 
            plan={currentPlan} 
            candidateName="Test Candidate" 
            onComplete={(summary) => {
              console.log('Interview Complete:', summary);
              setActiveView('dashboard');
              alert('Review data captured. Implementation: Syncing with decision engine.');
            }}
            onExit={() => setActiveView('strategy')}
          />
        ) : null;

      case 'candidate-detail':
        return selectedCandidate ? (
          <CandidateDetail 
            candidate={selectedCandidate} 
            onBack={() => {
              setSelectedCandidate(null);
              setActiveView('dashboard');
            }} 
          />
        ) : null;

      case 'candidates':
        return (
          <div className="space-y-8">
            <h2 className="text-3xl font-serif font-bold mb-4">Pipeline Intelligence</h2>
            <div 
              className="cursor-pointer" 
              onClick={(e) => {
                const target = e.target as HTMLElement;
                const row = target.closest('tr');
                if (row) {
                  const index = Array.from(row.parentElement?.children || []).indexOf(row);
                  const candidate = candidates[index];
                  if (candidate) viewCandidateDetails(candidate);
                }
              }}
            >
              <CandidateTable candidates={candidates} />
            </div>
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <div className="text-6xl font-serif text-white/5 mb-4">404</div>
            <div className="text-white/20 uppercase tracking-[0.5em] text-sm font-bold">
              View {activeView} is Under Construction
            </div>
            <button onClick={() => setActiveView('dashboard')} className="mt-8 text-royal-gold underline text-sm">Return Home</button>
          </div>
        );
    }
  };

  return (
    <Layout activeView={activeView} onViewChange={setActiveView}>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeView}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
}
