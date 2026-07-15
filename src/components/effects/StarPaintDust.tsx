"use client";

import React, { useEffect, useRef } from 'react';

const COLORS = ['#9E651B', '#C47B28', '#D4956B', '#B87333', '#CD853F', '#DEB887', '#FFD700', '#E8C547'];

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
  rotation: number;
  rotationSpeed: number;
  shape: 'star' | 'dot';
}

export function StarPaintDust() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    let animId = 0;
    let idCounter = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const drawStar = (cx: number, cy: number, r: number) => {
      const spikes = 4;
      const outer = r;
      const inner = r * 0.4;
      let rot = (Math.PI / 2) * 3;
      const step = Math.PI / spikes;
      ctx.beginPath();
      ctx.moveTo(cx, cy - outer);
      for (let i = 0; i < spikes; i++) {
        ctx.lineTo(cx + Math.cos(rot) * outer, cy + Math.sin(rot) * outer);
        rot += step;
        ctx.lineTo(cx + Math.cos(rot) * inner, cy + Math.sin(rot) * inner);
        rot += step;
      }
      ctx.closePath();
      ctx.fill();
    };

    const spawn = (x: number, y: number) => {
      const count = 6 + Math.floor(Math.random() * 6);
      for (let i = 0; i < count; i++) {
        const angle = ((Math.PI * 2) / count) * i + (Math.random() - 0.5) * 0.5;
        const speed = 1.5 + Math.random() * 3;
        particles.push({
          id: idCounter++,
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 2 + Math.random() * 4,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          life: 40 + Math.floor(Math.random() * 30),
          maxLife: 40 + Math.floor(Math.random() * 30),
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 8,
          shape: Math.random() > 0.4 ? 'star' : 'dot',
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.life--;
        p.rotation += p.rotationSpeed;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        const progress = 1 - p.life / p.maxLife;

        ctx.save();
        ctx.globalAlpha = 1 - progress;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;

        if (p.shape === 'star') {
          drawStar(0, 0, p.size);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      if (particles.length > 0) {
        animId = requestAnimationFrame(animate);
      } else {
        animId = 0;
      }
    };

    const handleClick = (e: MouseEvent) => {
      spawn(e.clientX, e.clientY);
      if (particles.length > 0 && !animId) {
        animId = requestAnimationFrame(animate);
      }
    };

    const handleTouch = (e: TouchEvent) => {
      const touch = e.touches[0] || e.changedTouches[0];
      if (touch) {
        spawn(touch.clientX, touch.clientY);
        if (particles.length > 0 && !animId) {
          animId = requestAnimationFrame(animate);
        }
      }
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('touchstart', handleTouch);

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('touchstart', handleTouch);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
      particles = [];
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[9999] pointer-events-none"
      aria-hidden="true"
    />
  );
}
