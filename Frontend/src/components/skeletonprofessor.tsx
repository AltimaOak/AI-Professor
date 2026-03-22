import { motion } from "framer-motion";

interface SkeletonProfessorProps {
  className?: string;
  isTeaching?: boolean;
  size?: "sm" | "md" | "lg";
}

const SkeletonProfessor = ({ className = "", isTeaching = false, size = "md" }: SkeletonProfessorProps) => {
  const sizeClasses = {
    sm: "w-32 h-32",
    md: "w-48 h-48",
    lg: "w-64 h-64",
  };

  // Modern physics-based floating animations for the 3D character image
  const floatAnim = {
    y: [-10, 10, -10],
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" as const }
  };
  
  const teachFloatAnim = {
    y: [-15, 15, -15],
    scale: [1, 1.05, 1],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" as const }
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} ${className} relative flex items-center justify-center`}
      animate={isTeaching ? teachFloatAnim : floatAnim}
    >
      {/* High-Tech Aura Ring (Active when teaching) */}
      {isTeaching && (
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-primary border-dashed opacity-40 mix-blend-screen"
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ rotate: { duration: 15, repeat: Infinity, ease: "linear" }, scale: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}
          style={{ filter: "drop-shadow(0 0 15px hsl(var(--primary)))" }}
        />
      )}
      
      {/* Awesome 3D Generated Mascot Image */}
      <img 
        src="/skeleton-professor.png" 
        alt="Skeleton Professor Mascot" 
        className="w-full h-full object-contain relative z-10"
        style={{ filter: isTeaching ? "drop-shadow(0 0 25px hsl(var(--primary)/0.7))" : "drop-shadow(0 10px 20px rgba(0,0,0,0.5))" }}
      />
      
      {/* Floating Digital Particles appearing around him when he explains something */}
      {isTeaching && (
        <div className="absolute inset-0 z-20 pointer-events-none">
          <motion.div 
            className="absolute top-[10%] right-[10%] w-4 h-4 rounded-full blur-[2px]" 
            animate={{ y: [-10, -80], opacity: [0, 1, 0], x: [0, 30] }} 
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }} 
            style={{ backgroundColor: "hsl(var(--skeleton-glow))" }}
          />
          <motion.div 
            className="absolute bottom-[20%] left-[5%] w-3 h-3 rounded-full blur-[1px]" 
            animate={{ y: [0, -60], opacity: [0, 1, 0], x: [0, -20] }} 
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut", delay: 0.5 }} 
            style={{ backgroundColor: "hsl(var(--primary))" }} 
          />
          <motion.div 
            className="absolute top-[30%] left-[15%] w-5 h-5 rounded-full blur-[3px]" 
            animate={{ y: [0, -90], opacity: [0, 1, 0], scale: [1, 0.5] }} 
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeOut", delay: 1 }} 
            style={{ backgroundColor: "hsl(var(--secondary))" }} 
          />
        </div>
      )}
    </motion.div>
  );
};

export default SkeletonProfessor;
