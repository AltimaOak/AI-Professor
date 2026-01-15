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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import SkeletonProfessor from "@/components/SkeletonProfessor";

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
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-center lg:text-left"
            >
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
                About{" "}
                <span className="gradient-text">Professor Bones</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Meet your AI teaching companion! Professor Bones is a fun, engaging
                skeleton character who makes learning any topic exciting and memorable.
                Using advanced AI, he adapts to your learning style and explains
                concepts in simple, understandable ways.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/general">
                  <Button size="lg" className="gradient-bg w-full sm:w-auto">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Try General Mode
                  </Button>
                </Link>
                <Link to="/syllabus">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    <GraduationCap className="w-5 h-5 mr-2" />
                    Try Syllabus Mode
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center"
            >
              <div className="relative">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute inset-0 rounded-full bg-primary/20 blur-3xl"
                />
                <SkeletonProfessor size="lg" isTeaching />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Professor Bones uses a sophisticated backend with multiple AI modules
              to provide the best learning experience.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-effect rounded-2xl p-6"
                >
                  <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-display text-xl font-bold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Interactive Tools
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Use these powerful tools to interact with Professor Bones
              and enhance your learning experience.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <motion.div
                  key={tool.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="glass-effect rounded-2xl p-6"
                >
                  <div
                    className={`w-12 h-12 rounded-xl ${tool.bg} flex items-center justify-center mb-4`}
                  >
                    <Icon className={`w-6 h-6 ${tool.color}`} />
                  </div>
                  <h3 className="font-display text-lg font-bold mb-2">
                    {tool.name}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {tool.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Backend Architecture */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Powered by Advanced AI
            </h2>
            <p className="text-muted-foreground">
              Our sophisticated backend architecture ensures accurate,
              engaging, and safe learning experiences.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="glass-effect rounded-2xl p-8"
          >
            <div className="grid gap-4">
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
                  className="flex items-center gap-4 p-4 rounded-xl bg-background/50"
                >
                  <div className="w-3 h-3 rounded-full gradient-bg shrink-0" />
                  <div>
                    <p className="font-medium">{module.name}</p>
                    <p className="text-sm text-muted-foreground">{module.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <SkeletonProfessor size="md" isTeaching className="mx-auto mb-6" />
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Ready to Learn?
          </h2>
          <p className="text-muted-foreground mb-8">
            Join Professor Bones and start your learning adventure today!
          </p>
          <Link to="/general">
            <Button size="lg" className="gradient-bg">
              Start Learning Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="max-w-5xl mx-auto text-center text-sm text-muted-foreground">
          <p>© 2024 Professor Bones. Making learning fun, one bone at a time! 💀</p>
        </div>
      </footer>
    </div>
  );
};

export default About;
