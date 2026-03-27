import { Link } from "react-router-dom";
import { Sparkles, Brain, MessageSquare, Target, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center grain-overlay overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 60% 50% at 50% 45%, hsla(36,90%,55%,0.06) 0%, transparent 70%)",
          }}
        />
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <Badge
            variant="outline"
            className="mb-6 border-primary/40 text-primary bg-accent-soft px-4 py-1.5 text-xs font-medium uppercase tracking-wider"
          >
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            Powered by Multi-Agent AI
          </Badge>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-[1.1]">
            Your Personal AI
            <br />
            <span className="text-primary">Professor.</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-text-secondary max-w-xl mx-auto">
            Upload your syllabus. Ask anything. Learn exactly what your exam needs.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              className="bg-primary text-primary-foreground hover:bg-accent-hover font-semibold rounded-xl px-8 h-12 text-base"
            >
              <Link to="/signup">Start Learning Free</Link>
            </Button>
            <Button
              variant="outline"
              className="border-primary/40 text-primary hover:bg-accent-soft font-medium rounded-xl px-8 h-12 text-base"
              onClick={() => {
                document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              See How It Works
            </Button>
          </div>

          <div className="mt-10 flex items-center justify-center gap-3">
            <div className="flex -space-x-2">
              {["A", "B", "C", "D", "E"].map((l) => (
                <div
                  key={l}
                  className="h-8 w-8 rounded-full bg-secondary border-2 border-background flex items-center justify-center text-xs font-medium text-foreground/60"
                >
                  {l}
                </div>
              ))}
            </div>
            <div className="text-sm text-text-secondary">
              <span className="text-primary font-semibold">2,400+</span> students · ⭐⭐⭐⭐⭐
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-foreground mb-4">
            Everything a great professor does — at your pace
          </h2>
          <div className="mt-16 grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Brain,
                title: "Understands Your Syllabus",
                desc: "Upload any PDF, image, or DOCX — your AI professor reads and remembers every page.",
              },
              {
                icon: MessageSquare,
                title: "Teaches Like a Human",
                desc: "Ask questions in plain language. Get clear explanations, examples, and analogies.",
              },
              {
                icon: Target,
                title: "Tracks Your Weak Areas",
                desc: "Diagnostic quizzes identify exactly what to study. No wasted revision time.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-card rounded-2xl border border-primary/[0.15] p-6 border-l-[3px] border-l-primary hover:border-primary/30 transition-all duration-200"
              >
                <div className="h-10 w-10 rounded-full bg-accent-soft flex items-center justify-center mb-4">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-foreground mb-16">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* dashed line */}
            <div className="hidden md:block absolute top-6 left-[16.6%] right-[16.6%] h-px border-t-2 border-dashed border-primary/30" />
            {[
              { step: 1, title: "Upload Your Material", desc: "PDF, DOCX, images — any study material you have." },
              { step: 2, title: "Ask Your Questions", desc: "Chat with your AI professor in plain language." },
              { step: 3, title: "Learn & Get Tested", desc: "Adaptive quizzes and personalized study plans." },
            ].map((s) => (
              <div key={s.step} className="text-center relative z-10">
                <div className="mx-auto h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold mb-4">
                  {s.step}
                </div>
                <h3 className="font-bold text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-text-secondary">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modes Showcase */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
          <div className="bg-card rounded-2xl border border-primary/[0.15] p-8 flex flex-col justify-between hover:border-primary/40 transition-all duration-200 group">
            <div>
              <Badge className="bg-primary text-primary-foreground text-xs mb-4">Most Popular</Badge>
              <h3 className="text-2xl font-bold text-foreground mb-3">Syllabus Mode</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Ground your professor in YOUR material. Every answer comes from your uploaded syllabus.
              </p>
            </div>
            <Button
              asChild
              className="mt-6 bg-primary text-primary-foreground hover:bg-accent-hover font-semibold rounded-xl w-full"
            >
              <Link to="/syllabus">
                Try Syllabus Mode <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>

          <div className="bg-card rounded-2xl border border-muted-foreground/20 p-8 flex flex-col justify-between opacity-70">
            <div>
              <Badge variant="outline" className="border-muted-foreground/30 text-muted-foreground text-xs mb-4">
                Coming Soon
              </Badge>
              <h3 className="text-2xl font-bold text-foreground mb-3">General Mode</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Ask about any topic in any subject. Your AI professor knows it all.
              </p>
            </div>
            <Button disabled className="mt-6 rounded-xl w-full opacity-50 cursor-not-allowed">
              Coming Soon
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
