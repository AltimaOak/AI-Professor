import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BookOpen, GraduationCap, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SkeletonProfessor from "@/components/SkeletonProfessor";
import Navbar from "@/components/Navbar";

const Index = () => {
  return (
    <div className="min-h-screen gradient-hero">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-secondary/5"
          />
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
              >
                <Sparkles className="w-4 h-4" />
                AI-Powered Learning
              </motion.div>

              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Meet Your New
                <span className="gradient-text block">AI Professor</span>
              </h1>

              <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0">
                Learn anything with Professor Bones – your funny, accurate, and
                engaging skeleton teacher who makes complex topics simple and fun!
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/general">
                  <Button size="lg" className="gradient-bg text-primary-foreground w-full sm:w-auto group">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Start Learning
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Learn More
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Right - Skeleton Professor */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex justify-center"
            >
              <div className="relative">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute inset-0 rounded-full bg-primary/20 blur-3xl"
                />
                <SkeletonProfessor size="lg" isTeaching />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mode Selection */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Choose Your Learning Mode
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Whether you want to explore any topic or follow your curriculum,
              Professor Bones has got you covered!
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* General Mode Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Link to="/general" className="block">
                <div className="glass-effect rounded-3xl p-8 h-full hover:shadow-glow transition-all duration-300">
                  <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mb-6">
                    <BookOpen className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="font-display text-2xl font-bold mb-3">
                    General Mode
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Ask anything! From quantum physics to cooking recipes.
                    Professor Bones teaches any topic in an engaging way.
                  </p>
                  <div className="flex items-center text-primary font-medium">
                    Start exploring
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Syllabus Mode Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -5 }}
            >
              <Link to="/syllabus" className="block">
                <div className="glass-effect rounded-3xl p-8 h-full hover:shadow-glow transition-all duration-300">
                  <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-6">
                    <GraduationCap className="w-8 h-8 text-secondary-foreground" />
                  </div>
                  <h3 className="font-display text-2xl font-bold mb-3">
                    Syllabus Mode
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Upload your course materials – PDFs, notes, or images.
                    Professor Bones will teach you based on your curriculum.
                  </p>
                  <div className="flex items-center text-secondary font-medium">
                    Upload materials
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features preview */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Interactive Learning Tools
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-12">
              Draw diagrams, highlight important concepts, point at your doubts –
              Professor Bones will explain everything step by step.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { icon: "👆", label: "Point" },
              { icon: "✏️", label: "Draw" },
              { icon: "🧽", label: "Erase" },
              { icon: "🖍️", label: "Highlight" },
              { icon: "🗑️", label: "Clear" },
            ].map((tool, index) => (
              <motion.div
                key={tool.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="glass-effect rounded-2xl p-4 flex flex-col items-center gap-2"
              >
                <span className="text-3xl">{tool.icon}</span>
                <span className="text-sm font-medium">{tool.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
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

export default Index;
