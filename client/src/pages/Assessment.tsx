import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Loader2, ChevronRight, ChevronLeft, Check, 
  User, Code2, Briefcase, FileText 
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { useCreateAssessment } from "@/hooks/use-assessments";
import { assessmentFormSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

// Types derived from schema
type FormData = z.infer<typeof assessmentFormSchema>;

const ROLES = [
  { id: 'frontend', label: 'Frontend Developer', icon: <Code2 className="w-5 h-5" /> },
  { id: 'backend', label: 'Backend Developer', icon: <Briefcase className="w-5 h-5" /> },
  { id: 'fullstack', label: 'Full Stack Developer', icon: <User className="w-5 h-5" /> },
  { id: 'mobile', label: 'Mobile Developer', icon: <User className="w-5 h-5" /> },
];

const EXPERIENCE_LEVELS = [
  { id: 'intern', label: 'Intern / Student' },
  { id: 'junior', label: 'Junior (0-2 years)' },
  { id: 'mid', label: 'Mid-Level (2-5 years)' },
  { id: 'senior', label: 'Senior (5+ years)' },
];

const MCQ_QUESTIONS: Record<string, { question: string, options: string[] }> = {
  frontend: {
    question: "What is the primary purpose of React's useEffect hook?",
    options: ["State management", "Side effects", "Routing", "Styling"]
  },
  backend: {
    question: "Which of these is NOT a standard HTTP method?",
    options: ["GET", "POST", "FETCH", "DELETE"]
  },
  fullstack: {
    question: "What does ACID stand for in databases?",
    options: ["Atomicity Consistency Isolation Durability", "Access Control Identity Data", "Auto Config Input Data", "Async Callback Interface Definition"]
  },
  mobile: {
    question: "Which component is used for scrollable lists in React Native?",
    options: ["View", "ScrollView", "FlatList", "Div"]
  },
};

export default function Assessment() {
  const [step, setStep] = useState(1);
  const { mutate, isPending } = useCreateAssessment();
  const { toast } = useToast();
  
  const form = useForm<FormData>({
    resolver: zodResolver(assessmentFormSchema),
    defaultValues: {
      technicalSelfRating: 5,
      communicationRating: 5,
      hasResume: false,
      hasPortfolio: false,
      technicalMcqAnswer: "",
    },
    mode: "onChange"
  });

  const { watch, setValue, register, formState: { errors, isValid } } = form;
  const role = watch("role");

  // Validate current step before moving forward
  const handleNext = async () => {
    let valid = false;
    if (step === 1) {
      valid = await form.trigger(["name", "email", "role", "experienceLevel"]);
    } else if (step === 2) {
      valid = await form.trigger(["technicalSelfRating", "technicalMcqAnswer"]);
    } else if (step === 3) {
      valid = await form.trigger(["communicationRating", "hasResume", "hasPortfolio", "portfolioUrl"]);
    }
    
    if (valid) setStep(s => s + 1);
  };

  const onSubmit = (data: FormData) => {
    mutate(data, {
      onError: (err) => {
        toast({
          title: "Error submitting assessment",
          description: err.message,
          variant: "destructive"
        });
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm font-medium text-slate-500 mb-2">
            <span>Progress</span>
            <span>Step {step} of 3</span>
          </div>
          <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${(step / 3) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <Card className="shadow-xl border-white/50 backdrop-blur-sm bg-white/80">
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-slate-900">Let's start with the basics</h2>
                    <p className="text-slate-500">Tell us a bit about yourself and your career goals.</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        placeholder="Jane Doe" 
                        className="h-12 text-lg"
                        {...register("name")} 
                      />
                      {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="jane@example.com" 
                        className="h-12 text-lg"
                        {...register("email")} 
                      />
                      {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <Label className="text-base">What role are you targeting?</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {ROLES.map((r) => (
                        <div
                          key={r.id}
                          onClick={() => setValue("role", r.id as any, { shouldValidate: true })}
                          className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 ${
                            role === r.id 
                              ? "border-primary bg-primary/5 shadow-md" 
                              : "border-slate-100 bg-white hover:border-slate-300 hover:shadow-sm"
                          }`}
                        >
                          <div className={`p-2 rounded-lg ${role === r.id ? "bg-primary text-white" : "bg-slate-100 text-slate-500"}`}>
                            {r.icon}
                          </div>
                          <span className={`font-medium ${role === r.id ? "text-primary" : "text-slate-700"}`}>{r.label}</span>
                          {role === r.id && <Check className="ml-auto w-5 h-5 text-primary" />}
                        </div>
                      ))}
                    </div>
                    {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
                  </div>

                  <div className="space-y-4 pt-4">
                    <Label className="text-base">Experience Level</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {EXPERIENCE_LEVELS.map((level) => (
                        <div
                          key={level.id}
                          onClick={() => setValue("experienceLevel", level.id as any, { shouldValidate: true })}
                          className={`cursor-pointer p-3 rounded-xl border-2 text-center transition-all ${
                            watch("experienceLevel") === level.id 
                              ? "border-primary bg-primary/5 text-primary font-medium" 
                              : "border-slate-100 hover:border-slate-300 text-slate-600"
                          }`}
                        >
                          {level.label}
                        </div>
                      ))}
                    </div>
                    {errors.experienceLevel && <p className="text-red-500 text-sm">{errors.experienceLevel.message}</p>}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-slate-900">Technical Assessment</h2>
                    <p className="text-slate-500">Be honest with your self-rating for the most accurate results.</p>
                  </div>

                  {/* Self Rating Slider */}
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <div className="flex justify-between mb-6">
                      <Label className="text-base font-semibold">How would you rate your technical skills?</Label>
                      <span className="text-2xl font-bold text-primary font-display">{watch("technicalSelfRating")}/10</span>
                    </div>
                    <Slider
                      value={[watch("technicalSelfRating")]}
                      min={1}
                      max={10}
                      step={1}
                      onValueChange={(val) => setValue("technicalSelfRating", val[0])}
                      className="py-4"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium uppercase tracking-wide">
                      <span>Beginner</span>
                      <span>Expert</span>
                    </div>
                  </div>

                  {/* MCQ Question */}
                  {role && MCQ_QUESTIONS[role] && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded">Quick Quiz</span>
                        <Label className="text-lg font-medium">{MCQ_QUESTIONS[role].question}</Label>
                      </div>
                      
                      <div className="grid gap-3">
                        {MCQ_QUESTIONS[role].options.map((option) => (
                          <div
                            key={option}
                            onClick={() => setValue("technicalMcqAnswer", option, { shouldValidate: true })}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                              watch("technicalMcqAnswer") === option
                                ? "border-primary bg-primary/5 shadow-md"
                                : "border-slate-100 hover:border-slate-300 hover:bg-slate-50"
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              watch("technicalMcqAnswer") === option ? "border-primary" : "border-slate-300"
                            }`}>
                              {watch("technicalMcqAnswer") === option && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                            </div>
                            <span className={watch("technicalMcqAnswer") === option ? "font-medium text-primary" : "text-slate-700"}>
                              {option}
                            </span>
                          </div>
                        ))}
                      </div>
                      {errors.technicalMcqAnswer && <p className="text-red-500 text-sm">{errors.technicalMcqAnswer.message}</p>}
                    </div>
                  )}
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-slate-900">Communication & Portfolio</h2>
                    <p className="text-slate-500">Soft skills and tangible work are key to landing the job.</p>
                  </div>

                  {/* Communication Slider */}
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <div className="flex justify-between mb-6">
                      <Label className="text-base font-semibold">How confident are you in your communication?</Label>
                      <span className="text-2xl font-bold text-purple-600 font-display">{watch("communicationRating")}/10</span>
                    </div>
                    <Slider
                      value={[watch("communicationRating")]}
                      min={1}
                      max={10}
                      step={1}
                      onValueChange={(val) => setValue("communicationRating", val[0])}
                      className="py-4"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium uppercase tracking-wide">
                      <span>Shy / Reserved</span>
                      <span>Very Confident</span>
                    </div>
                  </div>

                  {/* Resume Toggle */}
                  <div className="flex items-center justify-between p-4 border rounded-xl bg-white">
                    <div>
                      <h4 className="font-medium text-slate-900">Do you have a resume ready?</h4>
                      <p className="text-sm text-slate-500">This helps us gauge your preparedness.</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        type="button"
                        variant={watch("hasResume") ? "default" : "outline"}
                        onClick={() => setValue("hasResume", true)}
                        className="w-20"
                      >
                        Yes
                      </Button>
                      <Button 
                        type="button"
                        variant={!watch("hasResume") ? "secondary" : "outline"}
                        onClick={() => setValue("hasResume", false)}
                        className="w-20"
                      >
                        No
                      </Button>
                    </div>
                  </div>

                  {/* Portfolio Toggle & Input */}
                  <div className="space-y-4 p-4 border rounded-xl bg-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-slate-900">Do you have a portfolio / GitHub?</h4>
                        <p className="text-sm text-slate-500">Projects are proof of skill.</p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          type="button"
                          variant={watch("hasPortfolio") ? "default" : "outline"}
                          onClick={() => setValue("hasPortfolio", true)}
                          className="w-20"
                        >
                          Yes
                        </Button>
                        <Button 
                          type="button"
                          variant={!watch("hasPortfolio") ? "secondary" : "outline"}
                          onClick={() => {
                            setValue("hasPortfolio", false);
                            setValue("portfolioUrl", "");
                          }}
                          className="w-20"
                        >
                          No
                        </Button>
                      </div>
                    </div>
                    
                    {watch("hasPortfolio") && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="pt-2"
                      >
                        <Label>Portfolio / GitHub URL</Label>
                        <Input 
                          placeholder="https://github.com/username" 
                          {...register("portfolioUrl")} 
                          className="mt-2"
                        />
                        {errors.portfolioUrl && <p className="text-red-500 text-sm mt-1">{errors.portfolioUrl.message}</p>}
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-8 mt-4 border-t border-slate-100">
              {step > 1 ? (
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setStep(s => s - 1)}
                  disabled={isPending}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" /> Back
                </Button>
              ) : (
                <div /> // Spacer
              )}

              {step < 3 ? (
                <Button type="button" onClick={handleNext} className="px-8">
                  Next <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  disabled={isPending}
                  className="px-8 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 text-white shadow-lg shadow-purple-200"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...
                    </>
                  ) : (
                    "Get My Score"
                  )}
                </Button>
              )}
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
