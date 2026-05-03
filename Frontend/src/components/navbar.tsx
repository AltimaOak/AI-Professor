import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Skull, Home, BookOpen, GraduationCap, Info, LogIn } from "lucide-react";
import ThemeToggle from "./themetoggle";
import { Button } from "./ui/button";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/general", label: "General Mode", icon: BookOpen },
  { path: "/syllabus", label: "Syllabus Mode", icon: GraduationCap },
  { path: "/about", label: "About", icon: Info },
];

const Navbar = () => {
  const location = useLocation();

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-6"
    >
      <div className="max-w-7xl mx-auto">
        <div className="glass-card px-6 py-3 flex items-center justify-between shadow-2xl">
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div 
              whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }} 
              transition={{ duration: 0.5 }}
              className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-glow"
            >
              <Skull className="w-6 h-6 text-primary-foreground" />
            </motion.div>
            <span className="font-display font-black text-xl tracking-tighter gradient-text">PROFESSOR BONES</span>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <Button 
                    variant="ghost" 
                    className={`relative px-5 py-2.5 rounded-xl transition-all duration-300 font-bold text-sm uppercase tracking-widest ${isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-white/5"}`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                    {isActive && (
                      <motion.div 
                        layoutId="navIndicator" 
                        className="absolute -bottom-1 left-4 right-4 h-1 gradient-bg rounded-full shadow-glow" 
                        transition={{ type: "spring", stiffness: 500, damping: 30 }} 
                      />
                    )}
                  </Button>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
            <div className="h-8 w-[1px] bg-white/10 hidden sm:block" />
            <ThemeToggle />
            <Link to="/login">
              <Button size="sm" className="hidden sm:flex rounded-xl font-bold uppercase tracking-widest text-[10px] h-10 px-6 gradient-bg shadow-glow hover:scale-105 transition-all">
                Join Class
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;