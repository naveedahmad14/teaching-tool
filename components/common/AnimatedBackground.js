"use client";

import { motion } from "framer-motion";

/**
 * Serene, pixelated fairytale-style background animation.
 * Soft floating shapes at ~70% opacity, smooth Framer Motion.
 */
export default function AnimatedBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden
    >
      {/* Base gradient */}
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 20% 40%, rgba(98, 94, 198, 0.25) 0%, transparent 50%),
            radial-gradient(ellipse 60% 80% at 80% 60%, rgba(255, 215, 0, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse 50% 50% at 50% 90%, rgba(98, 94, 198, 0.12) 0%, transparent 45%)
          `,
        }}
      />

      {/* Floating orbs - soft, slow motion */}
      <motion.div
        className="absolute w-64 h-64 rounded-full opacity-70"
        style={{
          background: "radial-gradient(circle, rgba(98, 94, 198, 0.35) 0%, transparent 70%)",
          top: "15%",
          left: "10%",
          filter: "blur(40px)",
        }}
        animate={{
          y: [0, 30, 0],
          x: [0, 15, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute w-80 h-80 rounded-full opacity-70"
        style={{
          background: "radial-gradient(circle, rgba(255, 215, 0, 0.12) 0%, transparent 70%)",
          top: "50%",
          right: "5%",
          filter: "blur(50px)",
        }}
        animate={{
          y: [0, -25, 0],
          x: [0, -20, 0],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute w-48 h-48 rounded-full opacity-70"
        style={{
          background: "radial-gradient(circle, rgba(98, 94, 198, 0.2) 0%, transparent 70%)",
          bottom: "20%",
          left: "30%",
          filter: "blur(35px)",
        }}
        animate={{
          y: [0, -20, 0],
          x: [0, 25, 0],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Subtle pixel-style grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "24px 24px",
        }}
      />
    </div>
  );
}
