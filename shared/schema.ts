import { pgTable, text, serial, integer, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const assessments = pgTable("assessments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  role: text("role").notNull(), // 'frontend', 'backend', 'fullstack', 'mobile'
  experienceLevel: text("experience_level").notNull(), // 'junior', 'mid', 'senior'
  
  // Technical Inputs
  technicalSelfRating: integer("technical_self_rating").notNull(), // 1-10
  technicalMcqAnswer: text("technical_mcq_answer").notNull(), // User's answer
  technicalMcqCorrect: boolean("technical_mcq_correct").notNull(),
  
  // Resume Inputs
  hasResume: boolean("has_resume").default(false).notNull(),
  resumeText: text("resume_text"), // Optional pasted text
  
  // Communication Inputs
  communicationRating: integer("communication_rating").notNull(), // 1-10
  
  // Portfolio Inputs
  hasPortfolio: boolean("has_portfolio").default(false).notNull(),
  portfolioUrl: text("portfolio_url"),
  
  // Calculated Results
  scoreTechnical: integer("score_technical").notNull(), // out of 40
  scoreResume: integer("score_resume").notNull(),       // out of 20
  scoreCommunication: integer("score_communication").notNull(), // out of 20
  scorePortfolio: integer("score_portfolio").notNull(),    // out of 20
  totalScore: integer("total_score").notNull(),            // 0-100
  
  readinessLevel: text("readiness_level").notNull(), // 'Beginner', 'Intermediate', 'Strong Candidate'
  
  // JSONB fields for structured feedback
  strengths: jsonb("strengths").notNull(), // string[]
  gaps: jsonb("gaps").notNull(),          // string[]
  improvementPlan: jsonb("improvement_plan").notNull(), // Array of day-by-day plan
  
  aiFeedback: text("ai_feedback"), // Optional personalized AI text
  estimatedDays: integer("estimated_days"), // Timeline estimate
});

export const insertAssessmentSchema = createInsertSchema(assessments).omit({ 
  id: true, 
  technicalMcqCorrect: true,
  scoreTechnical: true,
  scoreResume: true,
  scoreCommunication: true,
  scorePortfolio: true,
  totalScore: true,
  readinessLevel: true,
  strengths: true,
  gaps: true,
  improvementPlan: true,
  aiFeedback: true
});

// Input schema for the frontend form
export const assessmentFormSchema = insertAssessmentSchema.extend({
  technicalMcqAnswer: z.string().min(1, "Please select an answer"),
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  role: z.enum(['frontend', 'backend', 'fullstack', 'mobile']),
  experienceLevel: z.enum(['intern', 'junior', 'mid', 'senior']),
  technicalSelfRating: z.number().min(1).max(10),
  communicationRating: z.number().min(1).max(10),
  hasResume: z.boolean(),
  resumeText: z.string().optional(),
  hasPortfolio: z.boolean(),
  portfolioUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export type Assessment = typeof assessments.$inferSelect;
export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;
export type AssessmentFormValues = z.infer<typeof assessmentFormSchema>;
