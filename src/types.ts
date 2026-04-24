/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Competency {
  name: string;
  description: string;
}

export interface InterviewQuestion {
  id: string;
  text: string;
  competency: string;
  expectedAnswer: string;
}

export interface InterviewPlan {
  jobTitle: string;
  roleType: 'Tech' | 'Non-Tech';
  experienceLevel: string;
  skills: string[];
  competencies: Competency[];
  questions: InterviewQuestion[];
}

export interface Evaluation {
  communication: number; // 0-10
  thinking: number;      // 0-10
  skills: number;        // 0-10
  clarity: number;       // 0-10
  confidence: number;    // 0-10
  strengths: string[];
  weaknesses: string[];
  aiSummary: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  appliedRole: string;
  aiMatchScore: number;
  status: 'Pending' | 'Completed';
  evaluation?: Evaluation;
  videoUrl?: string;
}

export interface AnswerEvaluation {
  clarity: number;
  relevance: number;
  depth: number;
  communication: number;
  strengths: string[];
  weaknesses: string[];
  improvement: string;
}

export interface InterviewStep {
  evaluation: AnswerEvaluation;
  next_step: {
    action: 'next_question' | 'follow_up' | 'rephrase' | 'probe' | 'switch_competency' | 'end_interview';
    question: string;
    competency: string;
    difficulty: 'easy' | 'medium' | 'hard';
    reason: string;
  };
}

export interface DashboardStats {
  activeJobs: number;
  totalCandidates: number;
  avgInterviewScore: number;
}
