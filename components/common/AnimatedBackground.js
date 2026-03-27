import { useEffect, useRef } from "react";

const PURPLE = { r: 98, g: 94, b: 198 };
const GOLD = { r: 255, g: 215, b: 0 };
const PURPLE_LIGHT = { r: 123, g: 119, b: 232 };
const DARK_BLUE = { r: 22, g: 33, b: 62 };

export default function AnimatedBackground() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const timeRef = useRef(0);
  const lastTickRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = canvas.getContext("2d");
    let width = 0;
    let height = 0;
    let stars = [];
    let shootingStars = [];
    let nextShootingStarAt = 0;

    function rand(min, max) {
      return min + Math.random() * (max - min);
    }

    function createStars(w, h) {
      const area = w * h;
      const starCount = Math.min(210, Math.max(65, Math.floor(area / 20000)));
      return Array.from({ length: starCount }, () => ({
        x: Math.random() * w,
        y: Math.random() * h * 0.78,
        size: rand(0.9, 2.6),
        baseAlpha: rand(0.16, 0.52),
        twinkleSpeed: rand(0.9, 2.4),
        twinklePhase: rand(0, Math.PI * 2),
        driftX: rand(-0.08, 0.08),
        driftY: rand(-0.04, 0.05),
        colorWarm: Math.random() > 0.68,
      }));
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = createStars(width, height);
    }

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

    function drawStars(t, w, h) {
      stars.forEach((star) => {
        const x = (star.x + Math.sin(t * 0.15 + star.twinklePhase) * star.driftX * 30 + w) % w;
        const y = (star.y + Math.cos(t * 0.11 + star.twinklePhase) * star.driftY * 24 + h) % h;
        const twinkle = 0.7 + 0.5 * Math.sin(t * star.twinkleSpeed + star.twinklePhase);
        const alpha = star.baseAlpha * twinkle;
        const color = star.colorWarm
          ? `rgba(255, 228, 168, ${alpha})`
          : `rgba(238, 245, 255, ${alpha})`;

        ctx.fillStyle = color;
        ctx.fillRect(x, y, star.size, star.size);
      });
    }

    function maybeSpawnShootingStar(t, w, h) {
      if (t < nextShootingStarAt || shootingStars.length > 1) return;

      const startX = rand(w * 0.08, w * 0.82);
      const startY = rand(h * 0.04, h * 0.32);
      const travel = rand(120, Math.min(280, w * 0.25));
      const angle = rand(Math.PI * 0.15, Math.PI * 0.32);
      const speed = rand(360, 520);
      const life = rand(0.65, 1.05);

      shootingStars.push({
        startX,
        startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life,
        age: 0,
        tailLength: Math.max(44, travel * 0.45),
      });

      nextShootingStarAt = t + rand(8, 20);
    }

    function drawShootingStars(dt) {
      shootingStars = shootingStars.filter((star) => {
        star.age += dt;
        if (star.age >= star.life) return false;

        const progress = star.age / star.life;
        const x = star.startX + star.vx * star.age;
        const y = star.startY + star.vy * star.age;
        const alpha = Math.sin(progress * Math.PI) * 0.5;

        const tailX = x - Math.cos(Math.atan2(star.vy, star.vx)) * star.tailLength;
        const tailY = y - Math.sin(Math.atan2(star.vy, star.vx)) * star.tailLength;

        const trail = ctx.createLinearGradient(x, y, tailX, tailY);
        trail.addColorStop(0, `rgba(255, 245, 190, ${alpha})`);
        trail.addColorStop(0.5, `rgba(255, 215, 120, ${alpha * 0.45})`);
        trail.addColorStop(1, "rgba(255, 215, 120, 0)");

        ctx.strokeStyle = trail;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        ctx.fillStyle = `rgba(255, 250, 225, ${alpha * 1.2})`;
        ctx.fillRect(x - 1, y - 1, 2.5, 2.5);
        return true;
      });
    }

    function tick(now) {
      if (!lastTickRef.current) lastTickRef.current = now;
      const dt = Math.min((now - lastTickRef.current) / 1000, 0.05);
      lastTickRef.current = now;
      timeRef.current += dt;
      const t = timeRef.current;

      ctx.clearRect(0, 0, width, height);

      const w = width;
      const h = height;
      blobs.forEach((b) => drawBlob(b, t * b.speed, w, h));
      drawStars(t, w, h);
      maybeSpawnShootingStar(t, w, h);
      drawShootingStars(dt);

      rafRef.current = requestAnimationFrame(tick);
    }

    resize();
    window.addEventListener("resize", resize);

    nextShootingStarAt = rand(2.5, 8);
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
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 10% 20%, rgba(255, 215, 0, 0.22) 1px, transparent 2px),
            radial-gradient(circle at 33% 72%, rgba(255, 255, 255, 0.18) 1px, transparent 2px),
            radial-gradient(circle at 62% 28%, rgba(255, 215, 0, 0.16) 1px, transparent 2px),
            radial-gradient(circle at 82% 64%, rgba(255, 255, 255, 0.16) 1px, transparent 2px),
            radial-gradient(circle at 48% 40%, rgba(255, 215, 0, 0.12) 1px, transparent 2px)
          `,
          backgroundSize: "100% 100%",
          opacity: 0.5,
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-[34vh]"
        style={{
          background:
            "linear-gradient(to top, rgba(12, 16, 35, 0.95) 0%, rgba(12, 16, 35, 0.65) 35%, rgba(12, 16, 35, 0) 100%)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-[28vh]"
        style={{
          background:
            "repeating-linear-gradient(90deg, rgba(98, 94, 198, 0.34) 0px, rgba(98, 94, 198, 0.34) 2px, transparent 2px, transparent 20px)",
          maskImage: "linear-gradient(to top, black 25%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to top, black 25%, transparent 100%)",
          opacity: 0.22,
        }}
      />
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
