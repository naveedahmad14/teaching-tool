"use client";

import { useEffect, useRef } from "react";

// AlgoQuest theme colors (with alpha for blending)
const PURPLE = { r: 98, g: 94, b: 198 };
const GOLD = { r: 255, g: 215, b: 0 };
const PURPLE_LIGHT = { r: 123, g: 119, b: 232 };
const DARK_BLUE = { r: 22, g: 33, b: 62 };

/**
 * Continuous flowey background: soft morphing blobs in AlgoQuest colors.
 * Canvas-based, smooth sine-driven motion for an organic, fluid feel.
 */
export default function AnimatedBackground() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = canvas.getContext("2d");
    let width = 0;
    let height = 0;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    // Blob config: base position (0–1), radius as fraction of viewport, color, motion params
    const blobs = [
      {
        baseX: 0.2,
        baseY: 0.35,
        radiusFraction: 0.48,
        color: PURPLE,
        opacity: 0.22,
        speed: 0.28,
        phaseX: 0,
        phaseY: Math.PI / 3,
        ampX: 0.08,
        ampY: 0.06,
        freqX: 1.1,
        freqY: 0.9,
      },
      {
        baseX: 0.75,
        baseY: 0.6,
        radiusFraction: 0.52,
        color: PURPLE_LIGHT,
        opacity: 0.14,
        speed: 0.22,
        phaseX: Math.PI / 2,
        phaseY: Math.PI,
        ampX: 0.07,
        ampY: 0.09,
        freqX: 0.85,
        freqY: 1.15,
      },
      {
        baseX: 0.5,
        baseY: 0.2,
        radiusFraction: 0.38,
        color: GOLD,
        opacity: 0.06,
        speed: 0.2,
        phaseX: Math.PI / 4,
        phaseY: Math.PI / 6,
        ampX: 0.1,
        ampY: 0.07,
        freqX: 1.2,
        freqY: 0.8,
      },
      {
        baseX: 0.85,
        baseY: 0.25,
        radiusFraction: 0.42,
        color: PURPLE,
        opacity: 0.12,
        speed: 0.25,
        phaseX: Math.PI,
        phaseY: Math.PI / 2,
        ampX: 0.06,
        ampY: 0.08,
        freqX: 0.9,
        freqY: 1.1,
      },
      {
        baseX: 0.15,
        baseY: 0.75,
        radiusFraction: 0.4,
        color: DARK_BLUE,
        opacity: 0.18,
        speed: 0.18,
        phaseX: Math.PI * 0.3,
        phaseY: Math.PI * 0.7,
        ampX: 0.09,
        ampY: 0.05,
        freqX: 1,
        freqY: 1.05,
      },
      {
        baseX: 0.55,
        baseY: 0.8,
        radiusFraction: 0.44,
        color: PURPLE_LIGHT,
        opacity: 0.1,
        speed: 0.24,
        phaseX: Math.PI * 1.2,
        phaseY: Math.PI * 0.4,
        ampX: 0.07,
        ampY: 0.1,
        freqX: 1.15,
        freqY: 0.95,
      },
    ];

    function drawBlob(blob, t, w, h) {
      const x =
        (blob.baseX + blob.ampX * Math.sin(t * blob.freqX + blob.phaseX)) * w;
      const y =
        (blob.baseY + blob.ampY * Math.sin(t * blob.freqY + blob.phaseY)) * h;
      const baseR = blob.radiusFraction * Math.max(w, h) * 0.5;
      const r = baseR * (0.92 + 0.08 * Math.sin(t * 0.5 + blob.phaseX));

      const gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
      const { r: cr, g: cg, b: cb } = blob.color;
      gradient.addColorStop(0, `rgba(${cr},${cg},${cb},${blob.opacity})`);
      gradient.addColorStop(0.4, `rgba(${cr},${cg},${cb},${blob.opacity * 0.4})`);
      gradient.addColorStop(0.7, `rgba(${cr},${cg},${cb},${blob.opacity * 0.1})`);
      gradient.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);

      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    }

    function tick() {
      timeRef.current += 0.016;
      const t = timeRef.current;

      ctx.clearRect(0, 0, width, height);

      const w = width;
      const h = height;
      blobs.forEach((b) => drawBlob(b, t * b.speed, w, h));

      rafRef.current = requestAnimationFrame(tick);
    }

    resize();
    window.addEventListener("resize", resize);

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden
    >
      {/* Base gradient so canvas blends nicely */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(26, 26, 46, 0.4) 0%, transparent 60%), #1A1A2E",
        }}
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ mixBlendMode: "normal" }}
      />
      {/* Subtle grid overlay - keep AlgoQuest feel */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)
          `,
          backgroundSize: "24px 24px",
        }}
      />
    </div>
  );
}
