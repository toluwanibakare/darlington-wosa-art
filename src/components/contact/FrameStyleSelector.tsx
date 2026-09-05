"use client";

import React from 'react';
import { Check } from 'lucide-react';
import { FRAME_STYLES, type FrameStyle } from './frame-styles';

interface FrameStyleSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function FrameStyleSelector({ value, onChange }: FrameStyleSelectorProps) {
  return (
    <div>
      <span className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/80">
        Frame Style
      </span>
      <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {FRAME_STYLES.map((style) => (
          <StyleCard
            key={style.value}
            style={style}
            selected={value === style.value}
            onClick={() => onChange(style.value)}
          />
        ))}
      </div>
    </div>
  );
}

function StyleCard({
  style,
  selected,
  onClick,
}: {
  style: FrameStyle;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`group relative flex flex-col items-center gap-2.5 p-3 rounded-[8px] border text-center transition-all duration-300 cursor-pointer ${
        selected
          ? 'border-brand-gold bg-brand-gold/[0.06] shadow-[0_0_0_1px_rgba(158,101,27,0.35)]'
          : 'border-brand-border bg-brand-white/40 hover:border-brand-gold/50 hover:bg-brand-white/70'
      }`}
    >
      {selected && (
        <span className="absolute top-2 right-2 w-[18px] h-[18px] rounded-full bg-brand-gold text-brand-black flex items-center justify-center">
          <Check size={11} strokeWidth={3} />
        </span>
      )}

      <MiniFrame style={style} />

      <span className="w-full">
        <span className="block font-sans text-xs font-semibold text-brand-black">{style.label}</span>
        <span className="block font-sans text-[10px] leading-snug text-brand-gray mt-0.5">{style.tagline}</span>
      </span>
    </button>
  );
}

function MiniFrame({ style }: { style: FrameStyle }) {
  const isFrameless = style.value === 'Frameless';
  const isFloating = style.value === 'Floating Frame';

  if (isFrameless) {
    return (
      <div className="w-14 h-[70px] rounded-[3px] bg-brand-white/40">
        <div
          className="w-full h-full rounded-[2px]"
          style={{ background: style.artBg, boxShadow: 'inset 0 0 0 1px rgba(60,45,25,0.2)' }}
        />
      </div>
    );
  }

  if (isFloating) {
    return (
      <div className="w-14 h-[70px] rounded-[3px] bg-[#e8e2d4] p-[3px] shadow-md">
        <div
          className="w-full h-full rounded-[2px]"
          style={{
            background: style.artBg,
            boxShadow: `0 0 0 3px ${style.frame} inset`,
          }}
        />
      </div>
    );
  }

  return (
    <div
      className="w-14 h-[70px] rounded-[3px] shadow-md p-[3px]"
      style={{
        background: style.frame,
        boxShadow: `0 2px 8px rgba(0,0,0,0.25), 0 0 0 1px ${style.frameHighlight}`,
      }}
    >
      <div className="w-full h-full rounded-[2px] p-[2px]" style={{ background: style.mat }}>
        <div
          className="w-full h-full rounded-[1px]"
          style={{ background: style.artBg, boxShadow: 'inset 0 0 0 1px rgba(60,45,25,0.15)' }}
        />
      </div>
    </div>
  );
}