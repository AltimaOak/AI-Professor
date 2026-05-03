import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  MousePointer2,
  Pencil,
  Eraser,
  Highlighter,
  Trash2,
  Hand,
  Brain,
  Shield,
  Sparkles,
  BookOpen,
  GraduationCap,
  ArrowRight,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";
import SkeletonProfessor from "@/components/skeletonprofessor";

const tools = [
  {
    icon: MousePointer2,
    name: "Select Tool",
    description: "Select and move objects on the canvas. Rearrange your notes and diagrams.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Hand,
    name: "Point Tool",
    description: "Point at any area you don't understand. Professor Bones will explain!",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: Pencil,
    name: "Draw Tool",
    description: "Draw diagrams, equations, or notes. Express your thoughts visually.",
    color: "text-secondary",
    bg: "bg-secondary/10",
  },
  {
    icon: Eraser,
    name: "Eraser Tool",
    description: "Made a mistake? No problem! Erase any drawings easily.",
    color: "text-destructive",
    bg: "bg-destructive/10",
  },
  {
    icon: Highlighter,
    name: "Highlight Tool",
    description: "Mark important concepts and key points for better retention.",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    icon: Trash2,
    name: "Clear Tool",
    description: "Start fresh! Clear the entire canvas with one click.",
    color: "text-muted-foreground",
    bg: "bg-muted",
  },
];

const features = [
  {
    icon: Brain,
    title: "AI-Powered Teaching",
    description:
      "Our backend uses advanced AI to understand your questions, classify difficulty, and provide personalized explanations.",
  },
  {
    icon: Shield,
    title: "Hallucination Guard",
    description:
      "Built-in safety modules ensure accurate information and validate sources to give you reliable learning content.",
  },
  {
    icon: Sparkles,
    title: "Interactive Learning",
    description:
      "Draw, highlight, and point at concepts. Professor Bones responds to your visual cues and adapts teaching style.",
  },
];

const About = () => {
  return (
    <div className="min-h-screen gradient-hero">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -z-10" />
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest mb-8">
                <Info className="w-4 h-4" />
                Our Story
              </div>
              <h1 className="font-display text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tighter">
                Meet <span className="gradient-text">Professor Bones</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-10 leading-relaxed font-medium">
                We believe learning should be bone-deep and fun! Professor Bones isn't just an AI; 
                he's a companion designed to make complex concepts stick using humor, 
                interactivity, and personalized engagement.
              </p>
              <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                <Link to="/general">
                  <Button size="lg" className="h-16 px-8 rounded-2xl gradient-bg font-bold shadow-glow hover:scale-105 transition-all">
                    <BookOpen className="w-5 h-5 mr-3" />
                    Try General Mode
                  </Button>
                </Link>
                <Link to="/syllabus">
                  <Button size="lg" variant="outline" className="h-16 px-8 rounded-2xl border-2 font-bold hover:bg-white/5 transition-all">
                    <GraduationCap className="w-5 h-5 mr-3" />
                    Try Syllabus Mode
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="flex justify-center"
            >
              <div className="relative group">
                <motion.div
                  animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute inset-0 rounded-full bg-primary/30 blur-[100px] -z-10"
                />
                <div className="glass-card p-12 shadow-2xl relative z-10 animate-float">
                  <SkeletonProfessor size="lg" isTeaching />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="font-display text-4xl md:text-6xl font-black mb-6 tracking-tighter">
              How It <span className="text-primary">Works</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
              A sophisticated multi-module architecture powers the Professor's brain, 
              ensuring every lesson is accurate, safe, and engaging.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card p-10 group"
                >
                  <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mb-8 shadow-glow group-hover:rotate-6 transition-transform">
                    <Icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="font-display text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground font-medium leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-32 px-6 bg-primary/5">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="font-display text-4xl md:text-6xl font-black mb-6 tracking-tighter">
              Interactive <span className="gradient-text">Tools</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
              Control the classroom with a versatile set of interactive tools.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <motion.div
                  key={tool.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="glass-card p-10 group"
                >
                  <div
                    className={`w-14 h-14 rounded-2xl ${tool.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className={`w-7 h-7 ${tool.color}`} />
                  </div>
                  <h3 className="font-display text-xl font-bold mb-3">
                    {tool.name}
                  </h3>
                  <p className="text-muted-foreground font-medium text-sm leading-relaxed">
                    {tool.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Backend Architecture */}
      <section className="py-32 px-6 relative">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl md:text-6xl font-black mb-6 tracking-tighter">
              The <span className="text-secondary">Core</span>
            </h2>
            <p className="text-xl text-muted-foreground font-medium">
              Sophisticated algorithms working in harmony.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="glass-card p-10 overflow-hidden relative shadow-2xl"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5">
               <Brain className="w-64 h-64" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4 relative z-10">
              {[
                { name: "Query Classifier", desc: "Understands your question intent" },
                { name: "Difficulty Estimator", desc: "Adapts to your knowledge level" },
                { name: "Lesson Planner", desc: "Structures teaching content" },
                { name: "Explanation Engine", desc: "Generates clear explanations" },
                { name: "Example Generator", desc: "Creates relevant examples" },
                { name: "Hallucination Guard", desc: "Ensures factual accuracy" },
                { name: "Source Validator", desc: "Verifies information sources" },
              ].map((module, index) => (
                <motion.div
                  key={module.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-6 p-6 rounded-2xl bg-white/5 dark:bg-black/20 border border-white/5 hover:border-primary/20 transition-all group"
                >
                  <div className="w-4 h-4 rounded-full gradient-bg group-hover:scale-150 transition-transform shadow-glow shrink-0" />
                  <div>
                    <p className="font-black text-sm uppercase tracking-widest">{module.name}</p>
                    <p className="text-sm text-muted-foreground font-medium mt-1">{module.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-40 px-6 relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-primary/5 -z-10" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="mb-10 inline-block">
             <div className="p-6 glass-card animate-float">
                <SkeletonProfessor size="md" isTeaching />
             </div>
          </div>
          <h2 className="font-display text-5xl md:text-7xl font-black mb-8 tracking-tighter">
            Ready to <span className="gradient-text">Level Up?</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto font-medium">
            Professor Bones is waiting for you. Let's make learning unforgettable!
          </p>
          <Link to="/general">
            <Button size="lg" className="h-16 px-12 rounded-2xl gradient-bg font-black text-lg shadow-glow hover:scale-110 transition-all group">
              Start Learning Now
              <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-white/10 text-center relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5 pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10">
          <p className="text-muted-foreground font-medium">© 2024 <span className="text-foreground font-bold">Professor Bones</span>. Making learning fun, one bone at a time! 💀</p>
        </div>
      </footer>
    </div>
  );
};

export default About;
