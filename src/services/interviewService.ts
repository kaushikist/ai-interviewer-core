import { GoogleGenAI, Type } from "@google/genai";
import { InterviewPlan, InterviewStep } from "../types";

export interface InterviewState {
  questionsAsked: string[];
  answers: { question: string; answer: string; evaluation?: any }[];
  currentCompetency: string;
}

export async function processInterviewStep(
  plan: InterviewPlan,
  state: InterviewState
): Promise<InterviewStep> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
  const model = "gemini-3-flash-preview";

  const systemInstruction = `You are an AI Interviewer conducting a structured, conversational job interview AND evaluating the candidate in real time.

---
INTERVIEW CONTEXT:
- Job Role: ${plan.jobTitle}
- Experience Level: ${plan.experienceLevel}
- Skills: ${plan.skills.join(", ")}
- Competencies: ${plan.competencies.map(c => c.name).join(", ")}
- Question Limit: 10

---
CURRENT STATE:
- Questions Asked: ${state.questionsAsked.join(" | ")}
- Candidate Answers: ${state.answers.map(a => `Q: ${a.question} A: ${a.answer}`).join("\n")}
- Current Competency: ${state.currentCompetency}

---
TASK 1: EVALUATE THE LATEST ANSWER
Evaluate the latest response on Clarity, Relevance, Depth, and Communication (0-10). Identify strengths, weaknesses, and improvements.

TASK 2: DECIDE NEXT ACTION
1. If answer is weak or unclear: Ask follow-up OR rephrase.
2. If answer is strong: Ask deeper probing question.
3. If competency is sufficiently covered: Switch to next competency.
4. If limit reached: end_interview.

Return STRICT JSON only.`;

  const prompt = `Analyze the candidate's latest response and provide the evaluation + next step.`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          evaluation: {
            type: Type.OBJECT,
            properties: {
              clarity: { type: Type.NUMBER },
              relevance: { type: Type.NUMBER },
              depth: { type: Type.NUMBER },
              communication: { type: Type.NUMBER },
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
              improvement: { type: Type.STRING }
            },
            required: ["clarity", "relevance", "depth", "communication", "strengths", "weaknesses", "improvement"]
          },
          next_step: {
            type: Type.OBJECT,
            properties: {
              action: { type: Type.STRING, enum: ["next_question", "follow_up", "rephrase", "probe", "switch_competency", "end_interview"] },
              question: { type: Type.STRING },
              competency: { type: Type.STRING },
              difficulty: { type: Type.STRING, enum: ["easy", "medium", "hard"] },
              reason: { type: Type.STRING }
            },
            required: ["action", "question", "competency", "difficulty", "reason"]
          }
        },
        required: ["evaluation", "next_step"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
}
