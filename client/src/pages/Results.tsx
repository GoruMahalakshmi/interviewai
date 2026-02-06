import { useEffect } from "react";
import { useRoute, Link } from "wouter";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import confetti from 'canvas-confetti';
import { motion } from "framer-motion";
import { 
  CheckCircle2, AlertTriangle, ArrowRight, Download, Share2, 
  Calendar, Briefcase, Trophy, Zap
} from "lucide-react";

import { useAssessment } from "@/hooks/use-assessments";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Results() {
  const [, params] = useRoute("/results/:id");
  const id = parseInt(params?.id || "0");
  const { data: assessment, isLoading, error } = useAssessment(id);

  // Trigger confetti for high scores
  useEffect(() => {
    if (assessment && assessment.totalScore >= 70) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8b5cf6', '#ec4899', '#3b82f6']
      });
    }
  }, [assessment]);

  if (isLoading) return <LoadingResults />;
  if (error || !assessment) return <ErrorView message={error?.message} />;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "#22c55e"; // Green
    if (score >= 60) return "#eab308"; // Yellow
    return "#ef4444"; // Red
  };

  const scoreColor = getScoreColor(assessment.totalScore);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-2 mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 font-display">Your Interview Readiness Report</h1>
          <p className="text-slate-500">Here's how prepared you are for a {assessment.role} role.</p>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid md:grid-cols-3 gap-6"
        >
          {/* Main Score Card */}
          <motion.div variants={item} className="md:col-span-1">
            <Card className="h-full flex flex-col items-center justify-center p-8 text-center bg-white shadow-xl shadow-purple-100 border-purple-100">
              <div className="w-48 h-48 mb-6">
                <CircularProgressbar
                  value={assessment.totalScore}
                  text={`${assessment.totalScore}`}
                  styles={buildStyles({
                    textSize: '24px',
                    pathColor: scoreColor,
                    textColor: '#1e293b',
                    trailColor: '#f1f5f9',
                    pathTransitionDuration: 1.5,
                  })}
                />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900">{assessment.readinessLevel}</h3>
                <p className="text-slate-500 text-sm">Overall Readiness Score</p>
              </div>
            </Card>
          </motion.div>

          {/* Breakdown & Feedback */}
          <motion.div variants={item} className="md:col-span-2 space-y-6">
            
            {/* Category Scores */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <ScoreCard label="Technical" score={assessment.scoreTechnical} max={40} icon={<Zap className="w-4 h-4 text-blue-500" />} />
              <ScoreCard label="Resume" score={assessment.scoreResume} max={20} icon={<FileText className="w-4 h-4 text-purple-500" />} />
              <ScoreCard label="Communication" score={assessment.scoreCommunication} max={20} icon={<User className="w-4 h-4 text-pink-500" />} />
              <ScoreCard label="Portfolio" score={assessment.scorePortfolio} max={20} icon={<Briefcase className="w-4 h-4 text-orange-500" />} />
            </div>

            {/* AI Feedback */}
            <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100">
              <div className="flex items-start gap-4">
                <div className="bg-white p-2 rounded-lg shadow-sm text-indigo-600">
                  <Zap className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-indigo-900">AI Analysis</h3>
                  <p className="text-indigo-800/80 leading-relaxed text-sm">
                    {assessment.aiFeedback || "Great job taking the first step! Based on your inputs, focus on building tangible projects to showcase your skills."}
                  </p>
                </div>
              </div>
            </Card>

            {/* Strengths & Gaps */}
            <div className="grid sm:grid-cols-2 gap-4">
              <Card className="p-6 border-l-4 border-l-green-500">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" /> Strengths
                </h3>
                <ul className="space-y-2">
                  {(assessment.strengths as string[]).map((s, i) => (
                    <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                      {s}
                    </li>
                  ))}
                  {(assessment.strengths as string[]).length === 0 && <li className="text-sm text-slate-400">No specific strengths identified yet.</li>}
                </ul>
              </Card>

              <Card className="p-6 border-l-4 border-l-amber-500">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center">
                  <AlertTriangle className="w-5 h-5 text-amber-500 mr-2" /> Gaps to Close
                </h3>
                <ul className="space-y-2">
                  {(assessment.gaps as string[]).map((g, i) => (
                    <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                      {g}
                    </li>
                  ))}
                   {(assessment.gaps as string[]).length === 0 && <li className="text-sm text-slate-400">You're looking solid!</li>}
                </ul>
              </Card>
            </div>
          </motion.div>
        </motion.div>

        {/* Improvement Plan */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-slate-900 font-display">Your Personalized Study Plan</h2>
          </div>
          
          <div className="grid gap-4 md:grid-cols-3">
             {(assessment.improvementPlan as string[]).map((planItem, index) => (
               <Card key={index} className="p-6 hover:shadow-lg transition-shadow border-slate-200">
                 <div className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Day {index + 1}</div>
                 <p className="text-slate-700 font-medium">{planItem}</p>
               </Card>
             ))}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex justify-center gap-4 pt-12"
        >
          <Link href="/assessment">
            <Button variant="outline" size="lg">Retake Assessment</Button>
          </Link>
          <Button size="lg" className="bg-slate-900 text-white hover:bg-slate-800">
            <Share2 className="mr-2 w-4 h-4" /> Share Result
          </Button>
        </motion.div>

      </div>
    </div>
  );
}

function ScoreCard({ label, score, max, icon }: { label: string, score: number, max: number, icon: any }) {
  const percentage = Math.round((score / max) * 100);
  
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
      <div className="mb-2 p-2 bg-slate-50 rounded-lg">{icon}</div>
      <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">{label}</div>
      <div className="text-xl font-bold text-slate-900">{percentage}%</div>
    </div>
  );
}

function LoadingResults() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-slate-50">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <h2 className="text-xl font-semibold text-slate-700 animate-pulse">Generating your personalized report...</h2>
      <p className="text-slate-400">Our AI is analyzing your profile</p>
    </div>
  );
}

function ErrorView({ message }: { message?: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50 text-center">
      <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Something went wrong</h1>
      <p className="text-slate-500 mb-6 max-w-md">{message || "We couldn't load your assessment results. Please try again."}</p>
      <Link href="/">
        <Button>Return Home</Button>
      </Link>
    </div>
  );
}

function FileText(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
      <line x1="10" x2="8" y1="9" y2="9" />
    </svg>
  );
}
