"use client";

import { useEffect, useRef, useState } from "react";

interface CelebrationCanvasProps {
  trigger: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
  shapeType: "rect" | "circle" | "triangle";
}

export default function CelebrationCanvas({ trigger }: CelebrationCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const hasPlayedRef = useRef<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = () => setPrefersReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (!trigger || hasPlayedRef.current || prefersReducedMotion) return;
    hasPlayedRef.current = true;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Brand colors
    const colors = [
      "#D9A441", // gold
      "#5B7B5E", // fynbos
      "#A23E3E", // rooibos
      "#232B45", // ink
    ];

    // Create particles
    const particles: Particle[] = [];
    const particleCount = 150;
    const shapes: ("rect" | "circle" | "triangle")[] = ["rect", "circle", "triangle"];

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / 50 + Math.random() * 0.5; // wider distribution angles
      const speed = 5 + Math.random() * 12;
      particles.push({
        x: canvas.width / 2,
        y: canvas.height * 0.35, // spawn slightly higher than center
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 6, // strong upward push
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.25,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 6 + Math.random() * 8, // slightly larger particles for better visibility
        opacity: 1,
        life: 0,
        maxLife: 140 + Math.random() * 60,
        shapeType: shapes[Math.floor(Math.random() * shapes.length)],
      });
    }

    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let activeParticles = 0;

      particles.forEach((p) => {
        if (p.life >= p.maxLife) return;
        activeParticles++;

        // Update physics
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.22; // gravity
        p.vx *= 0.985; // air resistance
        p.rotation += p.rotationSpeed;
        p.life++;

        // Fade out
        const lifeRatio = p.life / p.maxLife;
        p.opacity = Math.max(0, 1 - lifeRatio * lifeRatio);

        // Draw particle (rectangle, circle, or triangle)
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        
        if (p.shapeType === "rect") {
          ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.6);
        } else if (p.shapeType === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shapeType === "triangle") {
          ctx.beginPath();
          ctx.moveTo(0, -p.size / 2);
          ctx.lineTo(p.size / 2, p.size / 2);
          ctx.lineTo(-p.size / 2, p.size / 2);
          ctx.closePath();
          ctx.fill();
        }
        
        ctx.restore();
      });

      if (activeParticles > 0) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
      hasPlayedRef.current = false; // Reset played flag so animation works on double-mount (Strict Mode)
    };
  }, [trigger, prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ width: "100%", height: "100%" }}
      aria-hidden="true"
    />
  );
}
