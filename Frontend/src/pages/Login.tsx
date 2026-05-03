import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Skull, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import SkeletonProfessor from "@/components/skeletonprofessor";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate authentication
    setTimeout(() => {
      toast.success(
        isLogin
          ? "Welcome back! Ready to learn? 💀"
          : "Account created! Let's start learning! 🦴"
      );
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-6">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute top-20 right-20 w-96 h-96 rounded-full bg-primary/20 blur-[100px]"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute bottom-20 left-20 w-80 h-80 rounded-full bg-secondary/20 blur-[100px]"
        />
      </div>

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-16 items-center relative z-10">
        {/* Left - Professor */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="hidden lg:flex flex-col items-center"
        >
          <div className="p-12 glass-card animate-float shadow-2xl">
             <SkeletonProfessor size="lg" isTeaching />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-10 text-center glass-effect px-8 py-6 rounded-3xl border border-white/10"
          >
            <h2 className="font-display text-3xl font-black tracking-tighter mb-2">
              PROFESSOR BONES
            </h2>
            <p className="text-muted-foreground font-medium max-w-sm">
              {isLogin
                ? "Class is in session! Ready to dive back into the knowledge pool? 💀"
                : "A new student! I've got so many bones to share with you! 🦴"}
            </p>
          </motion.div>
        </motion.div>

        {/* Right - Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md mx-auto"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-3 text-muted-foreground hover:text-primary mb-8 transition-all font-bold uppercase tracking-widest text-xs group"
          >
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
               <ArrowLeft className="w-4 h-4" />
            </div>
            Back to Campus
          </Link>

          <div className="glass-card p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)]">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center shadow-glow">
                <Skull className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-display text-3xl font-black tracking-tight">
                  {isLogin ? "Welcome Back" : "Join the Class"}
                </h1>
                <p className="text-sm font-medium text-muted-foreground mt-1">
                  {isLogin
                    ? "Your journey continues here."
                    : "Create your student profile today."}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest opacity-60 ml-1">Full Name</Label>
                  <div className="relative mt-2">
                     <Input
                       id="name"
                       type="text"
                       placeholder="Enter your name"
                       value={name}
                       onChange={(e) => setName(e.target.value)}
                       className="h-14 px-6 rounded-2xl bg-white/5 dark:bg-black/20 border-white/10 focus:border-primary/50 transition-all font-medium"
                       required={!isLogin}
                     />
                  </div>
                </motion.div>
              )}

              <div>
                <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest opacity-60 ml-1">Student Email</Label>
                <div className="relative mt-2">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground opacity-40" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@university.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-14 pl-14 pr-6 rounded-2xl bg-white/5 dark:bg-black/20 border-white/10 focus:border-primary/50 transition-all font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest opacity-60 ml-1">Secret Key</Label>
                <div className="relative mt-2">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground opacity-40" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-14 pl-14 pr-14 rounded-2xl bg-white/5 dark:bg-black/20 border-white/10 focus:border-primary/50 transition-all font-medium"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {isLogin && (
                <div className="text-right">
                  <button
                    type="button"
                    className="text-xs font-bold text-primary hover:underline uppercase tracking-widest"
                  >
                    Forgot access?
                  </button>
                </div>
              )}

              <Button
                type="submit"
                className="h-14 w-full rounded-2xl gradient-bg text-primary-foreground font-black uppercase tracking-widest shadow-glow hover:scale-[1.02] transition-all"
                disabled={isLoading}
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Skull className="w-6 h-6" />
                  </motion.div>
                ) : isLogin ? (
                  "Access Knowledge"
                ) : (
                  "Initialize Profile"
                )}
              </Button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-sm font-medium text-muted-foreground">
                {isLogin ? "New to the classroom?" : "Already a student?"}{" "}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary font-black uppercase tracking-widest text-xs ml-1 hover:underline"
                >
                  {isLogin ? "Register Now" : "Sign In"}
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
