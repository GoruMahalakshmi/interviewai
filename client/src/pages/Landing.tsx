import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Zap, Clock, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

import heroImage from "@/assets/images/hero-tech.jpg";

export default function Landing() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center overflow-hidden">
        {/* Background Image with Dark Wash */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Interview Preparation" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px]" />
        </div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="max-w-4xl"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md shadow-sm mb-8">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
              <span className="text-sm font-medium text-white/90">AI-Powered Analysis</span>
            </motion.div>

            <motion.h1 
              variants={itemVariants}
              className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 font-display leading-tight"
            >
              Are You Ready for Your <br />
              <span className="text-primary italic">Dream Job?</span>
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              className="text-xl md:text-2xl text-white/80 mb-10 max-w-2xl leading-relaxed"
            >
              Stop guessing. Get an objective, AI-powered assessment of your technical skills, 
              resume, and communication in under 2 minutes.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
              <Link href="/assessment">
                <Button size="lg" className="h-14 px-8 text-lg font-semibold bg-primary hover:bg-primary/90 text-white border-none shadow-lg shadow-primary/25 group">
                  Check My Readiness
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-semibold border-white/30 text-white hover:bg-white/10 backdrop-blur-sm">
                View Sample Report
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Feature Grid */}
        <motion.div 
          className="grid md:grid-cols-3 gap-8 mt-24"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <FeatureCard 
            icon={<Clock className="w-8 h-8 text-blue-500" />}
            title="Under 2 Minutes"
            description="Quick assessment that respects your time while delivering deep insights."
          />
          <FeatureCard 
            icon={<Zap className="w-8 h-8 text-purple-500" />}
            title="Instant AI Feedback"
            description="Our AI analyzes your inputs to give you specific, actionable advice instantly."
          />
          <FeatureCard 
            icon={<ShieldCheck className="w-8 h-8 text-green-500" />}
            title="Personalized Plan"
            description="Don't just get a score. Get a day-by-day roadmap to improve it."
          />
        </motion.div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white/60 backdrop-blur-lg border border-white/40 p-8 rounded-3xl shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      <div className="bg-white p-3 w-fit rounded-2xl shadow-sm mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}
