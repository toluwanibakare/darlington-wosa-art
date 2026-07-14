"use client";

import React, { useEffect, useRef, useCallback } from 'react';

const COLORS = [
  '#9E651B', '#C47B28', '#7A4E15', '#B87333', '#D4956B',
  '#4A3520', '#8B4513', '#A0522D', '#CD853F', '#DEB887',
];

const SPLATTER_COUNT = 8;

interface Splatter {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  angle: number;
  dist: number;
  life: number;
}

export function PaintbrushCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const splattersRef = useRef<Splatter[]>([]);
  const idRef = useRef(0);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      * { cursor: none !important; }
      .paintbrush-dot, .paintbrush-splatter {
        pointer-events: none !important;
      }
    `;
    document.head.appendChild(style);
    return () => { style.remove(); };
  }, []);

  const addSplatters = useCallback((x: number, y: number) => {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    for (let i = 0; i < SPLATTER_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 10 + Math.random() * 40;
      const size = 2 + Math.random() * 6;
      splattersRef.current.push({
        id: idRef.current++,
        x,
        y,
        color,
        size,
        angle,
        dist,
        life: 1,
      });
    }
  }, []);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const handleMouseMove = (e: MouseEvent) => {
      cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    };

    const handleMouseDown = (e: MouseEvent) => {
      addSplatters(e.clientX, e.clientY);
    };

    const handleClick = (e: MouseEvent) => {
      addSplatters(e.clientX, e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('click', handleClick);
    };
  }, [addSplatters]);

  const [splatList, setSplatList] = React.useState<Splatter[]>([]);

  useEffect(() => {
    if (splattersRef.current.length === 0) return;
    setSplatList([...splattersRef.current]);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      let changed = false;
      splattersRef.current = splattersRef.current
        .map(s => ({ ...s, life: s.life - 0.03, dist: s.dist + 0.5 }))
        .filter(s => {
          if (s.life <= 0) { changed = true; return false; }
          return true;
        });
      if (changed || splattersRef.current.length > 0) {
        setSplatList([...splattersRef.current]);
      }
    }, 30);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const checkInterval = setInterval(() => {
      if (splattersRef.current.length > 0 && splatList.length === 0) {
        setSplatList([...splattersRef.current]);
      }
    }, 100);
    return () => clearInterval(checkInterval);
  }, [splatList]);

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{ transform: 'translate(-100px, -100px)' }}
      >
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          style={{ transform: 'rotate(-40deg) translate(6px, -8px)' }}
        >
          {/* Handle */}
          <rect x="15" y="3" width="7" height="24" rx="2" fill="#D4A574" stroke="#B8835A" strokeWidth="0.8" />
          {/* Handle wood grain lines */}
          <line x1="17.5" y1="6" x2="17.5" y2="25" stroke="#C4946A" strokeWidth="0.6" opacity="0.5" />
          <line x1="19.5" y1="4" x2="19.5" y2="26" stroke="#C4946A" strokeWidth="0.4" opacity="0.4" />
          <line x1="21" y1="5" x2="21" y2="24" stroke="#C4946A" strokeWidth="0.4" opacity="0.3" />
          {/* Ferrule (metal band) */}
          <rect x="14" y="25" width="9" height="5" rx="1.2" fill="#A0A0A0" stroke="#808080" strokeWidth="0.6" />
          <line x1="14" y1="27" x2="23" y2="27" stroke="#B0B0B0" strokeWidth="0.5" />
          <line x1="14" y1="29" x2="23" y2="29" stroke="#707070" strokeWidth="0.4" />
          {/* Bristles */}
          <path
            d="M14.5 30 C14.5 34 13 38 18 40 C19 37 20 34 21 30 Z"
            fill="#C47B28"
            stroke="#9E651B"
            strokeWidth="0.6"
          />
          {/* Bristle texture lines */}
          <path d="M15.5 31 C15.5 34 14 37 17 39" stroke="#D4956B" strokeWidth="0.5" opacity="0.6" fill="none" />
          <path d="M17 31 C17 33.5 16 36.5 18.5 38.5" stroke="#B87333" strokeWidth="0.4" opacity="0.5" fill="none" />
          <path d="M18.5 31 C18.5 33 17.5 36 19.5 37.5" stroke="#D4956B" strokeWidth="0.4" opacity="0.4" fill="none" />
          {/* Paint drip on tip */}
          <ellipse cx="17.5" cy="39.5" rx="2.5" ry="3" fill="#9E651B" opacity="0.7" />
          <circle cx="17.5" cy="40" r="0.8" fill="#C47B28" opacity="0.5" />
        </svg>
      </div>

      {splatList.map(s => (
        <div
          key={s.id}
          className="fixed pointer-events-none paintbrush-splatter"
          style={{
            left: s.x + Math.cos(s.angle) * s.dist * (1 - s.life * 0.5),
            top: s.y + Math.sin(s.angle) * s.dist * (1 - s.life * 0.5),
            width: s.size * s.life,
            height: s.size * s.life,
            borderRadius: '50%',
            backgroundColor: s.color,
            opacity: s.life * 0.7,
            transform: 'translate(-50%, -50%)',
            zIndex: 9998,
            transition: 'none',
          }}
        />
      ))}
    </>
  );
}
