import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { assessmentFormSchema, type InsertAssessment } from "@shared/schema";
import { z } from "zod";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.post("/api/assessments", async (req, res) => {
    try {
      const input = assessmentFormSchema.parse(req.body);

      // --- SCORING LOGIC ---
      
      // 1. Technical (40% Total)
      // MCQ: 15%
      // Self-Rating: 25%
      
      // Define correct answers map
      const correctAnswers: Record<string, string> = {
        'frontend': 'Side effects',
        'backend': 'FETCH',
        'fullstack': 'Atomicity Consistency Isolation Durability',
        'mobile': 'FlatList'
      };

      const correctAnswer = correctAnswers[input.role];
      const isMcqCorrect = input.technicalMcqAnswer === correctAnswer;
      
      const scoreMcq = isMcqCorrect ? 15 : 0;
      const scoreSelfRating = Math.round((input.technicalSelfRating / 10) * 25);
      const scoreTechnical = scoreMcq + scoreSelfRating;

      // 2. Resume (20% Total)
      const scoreResume = input.hasResume ? 20 : 0;

      // 3. Communication (20% Total)
      const scoreCommunication = Math.round((input.communicationRating / 10) * 20);

      // 4. Portfolio (20% Total)
      const scorePortfolio = input.hasPortfolio ? 20 : 0;

      // Total Score
      const totalScore = scoreTechnical + scoreResume + scoreCommunication + scorePortfolio;

      // Readiness Level
      let readinessLevel = "Beginner";
      if (totalScore > 80) readinessLevel = "Strong Candidate";
      else if (totalScore > 50) readinessLevel = "Intermediate";

      // --- AI FEEDBACK GENERATION ---
      let aiFeedback = "";
      let strengths: string[] = [];
      let gaps: string[] = [];
      let improvementPlan: string[] = [];

      try {
        const prompt = `
          Evaluate a ${input.experienceLevel} ${input.role} developer candidate.
          
          Data:
          - Technical Self Rating: ${input.technicalSelfRating}/10
          - MCQ Answer Correct: ${isMcqCorrect}
          - Has Resume: ${input.hasResume}
          - Communication Confidence: ${input.communicationRating}/10
          - Has Portfolio: ${input.hasPortfolio}
          - Total Score: ${totalScore}/100
          
          Return a JSON object with:
          - "strengths": array of 3 strings
          - "gaps": array of 3 strings
          - "improvement_plan": array of 3 strings (Day 1-2, Day 3-5, Day 6-7 actions)
          - "feedback": A short, encouraging summary paragraph (max 2 sentences).
          - "estimated_days": An integer representing how many days it will take to be fully ready (e.g., 7, 14, 21).
        `;

        const completion = await openai.chat.completions.create({
          model: "gpt-5.1",
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" },
        });

        const aiResponse = JSON.parse(completion.choices[0].message.content || "{}");
        strengths = aiResponse.strengths || ["Ambitious attitude"];
        gaps = aiResponse.gaps || ["General technical review needed"];
        improvementPlan = aiResponse.improvement_plan || ["Review basics", "Build a project", "Practice mock interviews"];
        aiFeedback = aiResponse.feedback || "Keep learning and practicing!";
        const estimatedDays = aiResponse.estimated_days || (totalScore > 80 ? 7 : 14);

        // --- SAVE TO DB ---
        const assessmentData: InsertAssessment = {
          ...input,
          technicalMcqCorrect: isMcqCorrect,
          scoreTechnical,
          scoreResume,
          scoreCommunication,
          scorePortfolio,
          totalScore,
          readinessLevel,
          strengths: strengths, // Drizzle handles JSON array
          gaps: gaps,
          improvementPlan: improvementPlan,
          aiFeedback,
          estimatedDays
        };

      const result = await storage.createAssessment(assessmentData);
      res.status(201).json(result);

    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid input", errors: error.errors });
      } else {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.get("/api/assessments/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

    const assessment = await storage.getAssessment(id);
    if (!assessment) return res.status(404).json({ message: "Assessment not found" });

    res.json(assessment);
  });

  return httpServer;
}
