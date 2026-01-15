import { motion } from "framer-motion";

interface SkeletonProfessorProps {
  className?: string;
  isTeaching?: boolean;
  size?: "sm" | "md" | "lg";
}

const SkeletonProfessor = ({ className = "", isTeaching = false, size = "md" }: SkeletonProfessorProps) => {
  const sizeClasses = {
    sm: "w-32 h-48",
    md: "w-48 h-72",
    lg: "w-64 h-96",
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} ${className}`}
      animate={isTeaching ? { y: [0, -10, 0] } : {}}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg
        viewBox="0 0 200 300"
        className="w-full h-full animate-pulse-glow"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Skull */}
        <motion.g
          animate={isTeaching ? { rotate: [-5, 5, -5] } : {}}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "100px 50px" }}
        >
          {/* Cranium */}
          <ellipse cx="100" cy="40" rx="35" ry="38" className="skeleton-bone" />
          {/* Temporal bones */}
          <ellipse cx="68" cy="48" rx="8" ry="12" className="skeleton-bone" />
          <ellipse cx="132" cy="48" rx="8" ry="12" className="skeleton-bone" />
          {/* Eye sockets */}
          <ellipse cx="85" cy="42" rx="10" ry="8" fill="hsl(var(--background))" />
          <ellipse cx="115" cy="42" rx="10" ry="8" fill="hsl(var(--background))" />
          {/* Eye glow */}
          <motion.ellipse
            cx="85"
            cy="42"
            rx="5"
            ry="4"
            fill="hsl(var(--primary))"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <motion.ellipse
            cx="115"
            cy="42"
            rx="5"
            ry="4"
            fill="hsl(var(--primary))"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          {/* Nasal cavity */}
          <path d="M95 50 L100 62 L105 50 Z" fill="hsl(var(--background))" />
          {/* Maxilla (upper jaw) */}
          <path
            d="M72 60 Q80 72 100 75 Q120 72 128 60 L125 65 Q110 78 100 80 Q90 78 75 65 Z"
            className="skeleton-bone"
          />
          {/* Mandible (lower jaw) */}
          <path
            d="M75 68 Q75 85 85 90 L100 92 L115 90 Q125 85 125 68"
            className="skeleton-bone"
            strokeWidth="8"
            stroke="hsl(var(--skeleton-bone))"
          />
          {/* Teeth */}
          <rect x="80" y="70" width="4" height="6" rx="1" fill="hsl(var(--background))" />
          <rect x="86" y="70" width="4" height="6" rx="1" fill="hsl(var(--background))" />
          <rect x="92" y="70" width="4" height="6" rx="1" fill="hsl(var(--background))" />
          <rect x="98" y="70" width="4" height="6" rx="1" fill="hsl(var(--background))" />
          <rect x="104" y="70" width="4" height="6" rx="1" fill="hsl(var(--background))" />
          <rect x="110" y="70" width="4" height="6" rx="1" fill="hsl(var(--background))" />
          <rect x="116" y="70" width="4" height="6" rx="1" fill="hsl(var(--background))" />
          {/* Graduation cap */}
          <path
            d="M55 20 L100 5 L145 20 L100 35 Z"
            fill="hsl(var(--foreground))"
          />
          <rect x="95" y="5" width="10" height="15" fill="hsl(var(--foreground))" />
          <motion.path
            d="M145 20 L145 35 L155 40"
            stroke="hsl(var(--accent))"
            strokeWidth="3"
            fill="none"
            animate={isTeaching ? { rotate: [0, 10, 0] } : {}}
            transition={{ duration: 0.5, repeat: Infinity }}
            style={{ transformOrigin: "145px 20px" }}
          />
          <circle cx="155" cy="42" r="5" fill="hsl(var(--accent))" />
        </motion.g>

        {/* Neck vertebrae */}
        <g>
          <ellipse cx="100" cy="100" rx="12" ry="6" className="skeleton-bone" />
          <ellipse cx="100" cy="110" rx="11" ry="5" className="skeleton-bone" />
          <ellipse cx="100" cy="118" rx="10" ry="5" className="skeleton-bone" />
        </g>

        {/* Clavicles */}
        <path
          d="M55 128 Q75 125 100 130 Q125 125 145 128"
          stroke="hsl(var(--skeleton-bone))"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />

        {/* Ribcage */}
        <g>
          {/* Sternum */}
          <rect x="95" y="130" width="10" height="50" rx="3" className="skeleton-bone" />
          {/* Ribs - left */}
          {[0, 1, 2, 3, 4].map((i) => (
            <path
              key={`rib-l-${i}`}
              d={`M95 ${135 + i * 10} Q70 ${138 + i * 10} 55 ${145 + i * 8}`}
              stroke="hsl(var(--skeleton-bone))"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
            />
          ))}
          {/* Ribs - right */}
          {[0, 1, 2, 3, 4].map((i) => (
            <path
              key={`rib-r-${i}`}
              d={`M105 ${135 + i * 10} Q130 ${138 + i * 10} 145 ${145 + i * 8}`}
              stroke="hsl(var(--skeleton-bone))"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
            />
          ))}
        </g>

        {/* Spine */}
        <g>
          {[0, 1, 2, 3, 4].map((i) => (
            <ellipse
              key={`spine-${i}`}
              cx="100"
              cy={185 + i * 12}
              rx="8"
              ry="5"
              className="skeleton-bone"
            />
          ))}
        </g>

        {/* Pelvis */}
        <path
          d="M60 235 Q70 250 100 255 Q130 250 140 235 Q135 220 100 225 Q65 220 60 235 Z"
          className="skeleton-bone"
        />
        <circle cx="75" cy="245" r="8" fill="hsl(var(--background))" />
        <circle cx="125" cy="245" r="8" fill="hsl(var(--background))" />

        {/* Left Arm */}
        <motion.g
          animate={isTeaching ? { rotate: [-10, 30, -10] } : {}}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "55px 128px" }}
        >
          {/* Shoulder joint */}
          <circle cx="55" cy="128" r="8" className="skeleton-joint" />
          {/* Humerus */}
          <rect x="48" y="135" width="14" height="45" rx="5" className="skeleton-bone" />
          {/* Elbow joint */}
          <circle cx="55" cy="180" r="7" className="skeleton-joint" />
          {/* Radius & Ulna */}
          <rect x="46" y="185" width="8" height="40" rx="3" className="skeleton-bone" />
          <rect x="56" y="185" width="8" height="40" rx="3" className="skeleton-bone" />
          {/* Wrist joint */}
          <circle cx="55" cy="225" r="5" className="skeleton-joint" />
          {/* Hand - metacarpals and phalanges */}
          <motion.g
            animate={isTeaching ? { rotate: [0, 15, 0] } : {}}
            transition={{ duration: 0.8, repeat: Infinity }}
            style={{ transformOrigin: "55px 225px" }}
          >
            <rect x="42" y="228" width="26" height="12" rx="4" className="skeleton-bone" />
            {/* Fingers */}
            {[0, 1, 2, 3, 4].map((i) => (
              <g key={`finger-l-${i}`}>
                <rect
                  x={44 + i * 5}
                  y="238"
                  width="4"
                  height={i === 0 ? 8 : 12}
                  rx="2"
                  className="skeleton-bone"
                />
                {i !== 0 && (
                  <rect
                    x={44 + i * 5}
                    y="248"
                    width="4"
                    height="8"
                    rx="2"
                    className="skeleton-bone"
                  />
                )}
              </g>
            ))}
          </motion.g>
        </motion.g>

        {/* Right Arm - Pointing gesture when teaching */}
        <motion.g
          animate={isTeaching ? { rotate: [-45, -60, -45] } : {}}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "145px 128px" }}
        >
          {/* Shoulder joint */}
          <circle cx="145" cy="128" r="8" className="skeleton-joint" />
          {/* Humerus */}
          <rect x="138" y="135" width="14" height="45" rx="5" className="skeleton-bone" />
          {/* Elbow joint */}
          <circle cx="145" cy="180" r="7" className="skeleton-joint" />
          {/* Radius & Ulna */}
          <rect x="136" y="185" width="8" height="40" rx="3" className="skeleton-bone" />
          <rect x="146" y="185" width="8" height="40" rx="3" className="skeleton-bone" />
          {/* Wrist joint */}
          <circle cx="145" cy="225" r="5" className="skeleton-joint" />
          {/* Hand */}
          <g>
            <rect x="132" y="228" width="26" height="12" rx="4" className="skeleton-bone" />
            {/* Pointing finger extended */}
            <motion.rect
              x="149"
              y="238"
              width="4"
              height="18"
              rx="2"
              className="skeleton-bone"
              animate={isTeaching ? { scaleY: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
            {/* Other fingers curled */}
            <rect x="134" y="238" width="4" height="8" rx="2" className="skeleton-bone" />
            <rect x="139" y="238" width="4" height="6" rx="2" className="skeleton-bone" />
            <rect x="144" y="238" width="4" height="6" rx="2" className="skeleton-bone" />
            <rect x="154" y="238" width="4" height="6" rx="2" className="skeleton-bone" />
          </g>
        </motion.g>

        {/* Left Leg */}
        <g>
          {/* Hip joint */}
          <circle cx="75" cy="250" r="7" className="skeleton-joint" />
          {/* Femur */}
          <rect x="70" y="255" width="12" height="55" rx="5" className="skeleton-bone" />
          {/* Knee joint */}
          <circle cx="76" cy="308" r="8" className="skeleton-joint" />
        </g>

        {/* Right Leg */}
        <g>
          {/* Hip joint */}
          <circle cx="125" cy="250" r="7" className="skeleton-joint" />
          {/* Femur */}
          <rect x="118" y="255" width="12" height="55" rx="5" className="skeleton-bone" />
          {/* Knee joint */}
          <circle cx="124" cy="308" r="8" className="skeleton-joint" />
        </g>

        {/* Glow effect */}
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
    </motion.div>
  );
};

export default SkeletonProfessor;
