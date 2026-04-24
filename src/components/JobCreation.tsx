import { useState } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { Sparkles, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { InterviewPlan } from '../types';

interface JobCreationProps {
  onPlanGenerated: (plan: InterviewPlan) => void;
}

export default function JobCreation({ onPlanGenerated }: JobCreationProps) {
  const [jd, setJd] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [roleType, setRoleType] = useState<'Tech' | 'Non-Tech'>('Tech');
  const [experienceLevel, setExperienceLevel] = useState('Mid-Level');
  const [skills, setSkills] = useState('');
  const [loading, setLoading] = useState(false);

  const generatePlan = async () => {
    if (!jd || !jobTitle) return;
    setLoading(false);
    setLoading(true);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const model = 'gemini-3-flash-preview';

      const prompt = `Generate a comprehensive interview strategy for the following role:
      Job Title: ${jobTitle}
      Role Type: ${roleType}
      Experience Level: ${experienceLevel}
      Key Skills Required: ${skills}
      JD Summary: ${jd}
      
      Tasks:
      1. Create a structured Competency Map (5 key areas).
      2. Develop 10 dynamic, context-aware interview questions (2 per competency).
      3. For each question, provide an 'expectedAnswer' as a set of logical anchors.
      
      Focus on deep probing questions that adapt based on the experience level. For Tech roles, include algorithmic or systems design topics.`;

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              competencies: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    description: { type: Type.STRING }
                  },
                  required: ['name', 'description']
                }
              },
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    text: { type: Type.STRING },
                    competency: { type: Type.STRING },
                    expectedAnswer: { type: Type.STRING }
                  },
                  required: ['text', 'competency', 'expectedAnswer']
                }
              }
            },
            required: ['competencies', 'questions']
          }
        }
      });

      const data = JSON.parse(response.text || '{}');
      
      const formattedPlan: InterviewPlan = {
        jobTitle,
        roleType,
        experienceLevel,
        skills: skills.split(',').map(s => s.trim()).filter(s => s),
        competencies: data.competencies || [],
        questions: (data.questions || []).map((q: any, i: number) => ({
          ...q,
          id: `q-${i + 1}`
        }))
      };

      onPlanGenerated(formattedPlan);
    } catch (error) {
      console.error('Generation failed:', error);
      alert('Failed to generate strategy. Please verify your Gemini API configuration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-gray p-8 rounded-2xl border border-white/5 shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4 transform translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <Sparkles className="text-royal-gold/20 w-48 h-48" />
      </div>
      
      <div className="relative z-10">
        <h3 className="text-2xl font-serif font-bold mb-2 text-white">Advanced Strategy Architect</h3>
        <p className="text-sm text-white/40 mb-8 max-w-lg">Transform a raw Job Description into a structured, competency-mapped interview decision framework.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-white/40 font-bold mb-2">Job Title</label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Senior Backend Engineer"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-royal-gold/50 transition-all"
            />
          </div>
          
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-white/40 font-bold mb-2">Role Type</label>
            <div className="flex gap-2">
              {(['Tech', 'Non-Tech'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setRoleType(type)}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all border ${
                    roleType === type 
                      ? 'bg-royal-gold/20 border-royal-gold text-royal-gold shadow-[0_0_15px_rgba(30,64,92,0.3)]' 
                      : 'bg-white/5 border-white/10 text-white/40 hover:text-white hover:border-white/20'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-white/40 font-bold mb-2">Experience Level</label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-royal-gold/50 appearance-none transition-all"
            >
              <option className="bg-slate-gray">Intern</option>
              <option className="bg-slate-gray">Junior (1-3 yrs)</option>
              <option className="bg-slate-gray">Mid-Level (3-5 yrs)</option>
              <option className="bg-slate-gray">Senior (5-8 yrs)</option>
              <option className="bg-slate-gray">Lead / Principal (8+ yrs)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-white/40 font-bold mb-2">Key Skills (Comma separated)</label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g. React, Node.js, System Design"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-royal-gold/50 transition-all"
            />
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-white/40 font-bold mb-2">Paste Job Description</label>
            <textarea
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              placeholder="Paste the full job description text here for deep analysis..."
              rows={6}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-royal-gold/50 transition-all resize-none font-sans"
            />
          </div>
          
          <div className="flex justify-end pt-4 border-t border-white/5">
            <button
              onClick={generatePlan}
              disabled={loading || !jd || !jobTitle}
              className="bg-royal-gold text-white px-10 py-4 rounded-xl font-bold text-sm flex items-center space-x-3 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-royal-gold/20 glow-on-hover"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span className="tracking-wide">Analyzing Role Dynamics...</span>
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  <span className="tracking-wide">Engineer Full Strategy</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
