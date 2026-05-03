import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BookOpen, GraduationCap, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SkeletonProfessor from "@/components/skeletonprofessor";
import Navbar from "@/components/navbar";

const Index = () => {
  return (
    <div className="min-h-screen gradient-hero">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20 pb-20 px-4 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary/20 blur-[100px]"
          />
          <motion.div
            animate={{ 
              scale: [1, 1.3, 1],
              rotate: [0, -90, 0],
              opacity: [0.1, 0.15, 0.1]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-secondary/20 blur-[100px]"
          />
        </div>

        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-center lg:text-left relative z-10"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 dark:bg-black/20 border border-white/20 backdrop-blur-md text-primary text-sm font-semibold mb-8 shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-secondary animate-pulse" />
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  AI-Powered Future of Learning
                </span>
              </motion.div>

              <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-black leading-[1.1] mb-8 tracking-tight">
                Learn with
                <span className="gradient-text block mt-2">Professor Bones</span>
              </h1>

              <p className="text-xl text-muted-foreground/80 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Unlock your potential with an AI that doesn't just teach, but 
                <span className="text-foreground font-bold"> engages</span>. Complex topics made simple, fun, and bone-deep! 🦴
              </p>

              <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                <Link to="/general">
                  <Button size="lg" className="h-16 px-10 rounded-2xl gradient-bg text-primary-foreground text-lg font-bold shadow-glow hover:scale-105 transition-all group">
                    <BookOpen className="w-6 h-6 mr-3" />
                    Start Learning
                    <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </Link>
                <Link to="/syllabus">
                  <Button size="lg" variant="outline" className="h-16 px-10 rounded-2xl border-2 text-lg font-bold hover:bg-white/5 dark:hover:bg-black/5 transition-all">
                    Upload Syllabus
                  </Button>
                </Link>
              </div>
              
              <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 opacity-60">
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-foreground">99%</span>
                  <span className="text-xs uppercase tracking-widest font-bold">Accuracy</span>
                </div>
                <div className="h-8 w-[1px] bg-border"></div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-foreground">24/7</span>
                  <span className="text-xs uppercase tracking-widest font-bold">Available</span>
                </div>
                <div className="h-8 w-[1px] bg-border"></div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-foreground">Interactive</span>
                  <span className="text-xs uppercase tracking-widest font-bold">Canvas</span>
                </div>
              </div>
            </motion.div>

            {/* Right - Skeleton Professor */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex justify-center relative"
            >
              <div className="relative animate-float">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/30 to-secondary/30 blur-[80px] opacity-50" />
                <div className="relative glass-effect p-12 rounded-[3rem] border border-white/20 shadow-2xl">
                  <SkeletonProfessor size="lg" isTeaching />
                </div>
                
                {/* Floating elements */}
                <motion.div 
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-10 -left-10 glass-effect p-4 rounded-2xl border border-white/30 shadow-lg"
                >
                  <BookOpen className="w-8 h-8 text-primary" />
                </motion.div>
                <motion.div 
                  animate={{ y: [0, 15, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -bottom-5 -right-5 glass-effect p-4 rounded-2xl border border-white/30 shadow-lg"
                >
                  <GraduationCap className="w-8 h-8 text-secondary" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mode Selection */}
      <section className="py-32 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="font-display text-4xl md:text-6xl font-black mb-6 tracking-tight">
              Pick Your <span className="gradient-text">Journey</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
              Choose how you want to learn today. Professor Bones is ready for anything you throw at him!
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-10">
            {/* General Mode Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Link to="/general" className="block h-full">
                <div className="glass-card p-10 h-full flex flex-col group">
                  <div className="w-20 h-20 rounded-3xl gradient-bg flex items-center justify-center mb-8 shadow-glow group-hover:scale-110 transition-transform duration-500">
                    <BookOpen className="w-10 h-10 text-primary-foreground" />
                  </div>
                  <h3 className="font-display text-3xl font-bold mb-4 group-hover:text-primary transition-colors">
                    Exploration Mode
                  </h3>
                  <p className="text-lg text-muted-foreground/80 mb-8 flex-1 leading-relaxed">
                    Unleash your curiosity! Ask anything from black holes to biology. 
                    Professor Bones uses his vast knowledge to explain any topic in the galaxy.
                  </p>
                  <div className="flex items-center text-primary text-lg font-bold group-hover:gap-4 transition-all">
                    Start Exploring
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Syllabus Mode Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Link to="/syllabus" className="block h-full">
                <div className="glass-card p-10 h-full flex flex-col group">
                  <div className="w-20 h-20 rounded-3xl bg-secondary flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(6,182,212,0.4)] group-hover:scale-110 transition-transform duration-500">
                    <GraduationCap className="w-10 h-10 text-secondary-foreground" />
                  </div>
                  <h3 className="font-display text-3xl font-bold mb-4 group-hover:text-secondary transition-colors">
                    Curriculum Mode
                  </h3>
                  <p className="text-lg text-muted-foreground/80 mb-8 flex-1 leading-relaxed">
                    Study smarter, not harder. Upload your notes or PDFs and get tailored 
                    teaching that sticks to your syllabus. Personalized education at its best.
                  </p>
                  <div className="flex items-center text-secondary text-lg font-bold group-hover:gap-4 transition-all">
                    Upload Materials
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features preview */}
      <section className="py-32 px-4 bg-primary/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-4xl md:text-5xl font-black mb-6 tracking-tight">
              Interactive <span className="text-primary">Superpowers</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-16 font-medium">
              Our interactive canvas lets you interact with the material like never before. 
              Point, draw, and highlight while the Professor explains.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[
              { icon: "👆", label: "Point", color: "from-blue-500 to-cyan-500" },
              { icon: "✏️", label: "Draw", color: "from-purple-500 to-pink-500" },
              { icon: "🧽", label: "Erase", color: "from-orange-500 to-yellow-500" },
              { icon: "🖍️", label: "Highlight", color: "from-green-500 to-emerald-500" },
              { icon: "🗑️", label: "Clear", color: "from-red-500 to-rose-500" },
            ].map((tool, index) => (
              <motion.div
                key={tool.label}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
                whileHover={{ y: -10, scale: 1.05 }}
                className="glass-effect rounded-[2rem] p-8 flex flex-col items-center gap-4 border border-white/20 shadow-xl group"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-3xl shadow-lg group-hover:rotate-12 transition-transform`}>
                  {tool.icon}
                </div>
                <span className="text-lg font-bold tracking-tight">{tool.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 border-t border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5 pointer-events-none" />
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="mb-8 flex justify-center">
             <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center">
                <span className="text-2xl">🦴</span>
             </div>
          </div>
          <p className="text-lg font-medium text-muted-foreground/60">
            © 2024 <span className="text-foreground font-bold">Professor Bones</span>. 
            Making learning fun, one bone at a time! 💀
          </p>
          <div className="mt-8 flex justify-center gap-6 text-sm font-bold uppercase tracking-widest opacity-40">
            <a href="#" className="hover:text-primary transition-colors">Twitter</a>
            <a href="#" className="hover:text-primary transition-colors">Discord</a>
            <a href="#" className="hover:text-primary transition-colors">Github</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
