"use client";

import React, { useId, useState } from 'react';
import { motion } from 'framer-motion';
import { Sofa, Monitor, BedDouble, LayoutGrid } from 'lucide-react';
import { getFrameStyle, type FrameStyle } from './frame-styles';

type SceneKey = 'sofa' | 'desk' | 'bed' | 'chart';

const SOFA_ICON = Sofa;
const DESK_ICON = Monitor;
const BED_ICON = BedDouble;

interface SceneDef {
  viewBox: [number, number];
  region: { x: number; y: number; w: number; h: number };
  label: string;
  icon: typeof SOFA_ICON;
  sceneScale: [number, number];
}

const SCENES: Record<Exclude<SceneKey, 'chart'>, SceneDef> = {
  sofa: {
    viewBox: [100, 100],
    region: { x: 10, y: 4, w: 80, h: 38 },
    label: 'Above a Sofa',
    icon: SOFA_ICON,
    sceneScale: [100 / 110, 100 / 96],
  },
  desk: {
    viewBox: [100, 100],
    region: { x: 10, y: 4, w: 80, h: 38 },
    label: 'Above a Desk',
    icon: DESK_ICON,
    sceneScale: [100 / 84, 100 / 100],
  },
  bed: {
    viewBox: [100, 100],
    region: { x: 10, y: 0, w: 80, h: 38 },
    label: 'Above a Bed',
    icon: BED_ICON,
    sceneScale: [100 / 84, 100 / 92],
  },
};

const SCENE_ORDER: { key: SceneKey; label: string; icon: typeof SOFA_ICON }[] = [
  { key: 'chart', label: 'All Sizes', icon: LayoutGrid },
  { key: 'sofa', label: 'Sofa', icon: SOFA_ICON },
  { key: 'desk', label: 'Desk', icon: DESK_ICON },
  { key: 'bed', label: 'Bed', icon: BED_ICON },
];

interface FrameScaleVisualProps {
  width: number;
  height: number;
  frameStyle?: string | null;
  onOpenSample?: (sizeKey?: string) => void;
}

export function FrameScaleVisual({ width, height, frameStyle, onOpenSample }: FrameScaleVisualProps) {
  const [scene, setScene] = useState<SceneKey>('chart');
  const uid = useId().replace(/:/g, '');
  const style = getFrameStyle(frameStyle);

  const w = Number.isFinite(width) && width > 0 ? width : 12;
  const h = Number.isFinite(height) && height > 0 ? height : 16;

  // ---- "All sizes" chart view ----------------------------------------
  if (scene === 'chart') {
    return (
      <div>
        <div className="flex flex-wrap gap-2 mb-4">
          {SCENE_ORDER.map(({ key, label, icon: Icon }) => (
            <SceneTab key={key} active={scene === key} onClick={() => setScene(key)} label={label} icon={Icon} />
          ))}
        </div>
        <div className="border border-brand-border rounded-[8px] overflow-hidden bg-brand-surface/30">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/frame_view.jpeg"
            alt="All available frame sizes shown together for comparison"
            className="w-full h-auto object-contain"
          />
        </div>
        <p className="font-sans text-[10px] text-brand-gray/70 mt-2">
          All available sizes side by side. Use the tabs above to see a specific size in a real room.
        </p>
      </div>
    );
  }

  const def = SCENES[scene];
  const [vbW, vbH] = def.viewBox;
  const region = def.region;

  const scale = Math.min(region.w / w, region.h / h, 1);
  const fw = w * scale;
  const fh = h * scale;
  const fx = region.x + (region.w - fw) / 2;
  const fy = region.y + (region.h - fh) / 2;

  const frameKey = `${scene}-${style.value}-${w}x${h}`;

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        {SCENE_ORDER.map(({ key, label, icon: Icon }) => (
          <SceneTab key={key} active={scene === key} onClick={() => setScene(key)} label={label} icon={Icon} />
        ))}
      </div>

      <div className="border border-brand-border rounded-[8px] overflow-hidden bg-[#f6f3ec] relative">
        <svg
          viewBox={`0 0 ${vbW} ${vbH}`}
          className="w-full h-auto block"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={`Frame measuring ${w} by ${h} inches shown ${def.label.toLowerCase()}`}
        >
          {/* Hanging zone guide */}
          <rect
            x={region.x}
            y={region.y}
            width={region.w}
            height={region.h}
            fill="none"
            stroke="#c9c2b6"
            strokeDasharray="2 2"
            strokeWidth={0.6}
            rx={1}
            opacity={0.8}
          />

          <FrameArtwork
            key={frameKey}
            fx={fx}
            fy={fy}
            fw={fw}
            fh={fh}
            style={style}
            uid={uid}
          />

          {/* Scene drawn on top so furniture (e.g. desk monitor) overlaps the frame */}
          <g transform={`scale(${def.sceneScale[0]}, ${def.sceneScale[1]})`}>
            {scene === 'sofa' && <SofaScene />}
            {scene === 'desk' && <DeskScene />}
            {scene === 'bed' && <BedScene />}
          </g>

          {/* Dimension callouts */}
          <DimLine
            x1={fx + 1}
            x2={fx + fw - 1}
            y={Math.max(region.y - 4, 2.5)}
            label={`${w}"`}
            horizontal
          />

          <text
            x={fx + fw - 0.6}
            y={(fy + fh) / 2}
            fontSize={3.6}
            fill="#7c746a"
            textAnchor="end"
            fontFamily="var(--font-sans)"
            transform={`rotate(-90 ${fx + fw - 0.6} ${(fy + fh) / 2})`}
            dy={-2}
          >
            {h}&quot;
          </text>
        </svg>

        {/* Bottom legend */}
        <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-full bg-white/80 backdrop-blur-sm font-sans text-[9px] tracking-[0.12em] uppercase text-black">
          {w} × {h} in — shown {def.label.toLowerCase()}
        </div>
        {scale < 1 && (
          <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-full bg-[#f3e6ba] font-sans text-[9px] text-black">
            auto-scaled to fit this wall
          </div>
        )}
      </div>
      {((w === 8 && h === 10) || (w === 10 && h === 12) || (w === 16 && h === 20) || (w === 20 && h === 24) || (w === 24 && h === 30) || (w === 30 && h === 40)) && (
        <div className="mt-3 p-3 border border-brand-gold/40 bg-brand-gold/10 rounded-[6px] flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
            <span className="font-sans text-xs text-brand-black font-medium">{w} × {h} inches Photo Sample Available</span>
          </div>
          {onOpenSample && (
            <button
              type="button"
              onClick={() => onOpenSample(`${w}x${h}`)}
              className="px-3 py-1 bg-brand-gold text-brand-black font-sans text-[10px] font-semibold tracking-wider uppercase rounded hover:bg-brand-black hover:text-brand-white transition-colors"
            >
              View Sample Image
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function SceneTab({
  active,
  onClick,
  label,
  icon: Icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: typeof SOFA_ICON;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full font-sans text-[10px] tracking-[0.12em] uppercase transition-all duration-300 cursor-pointer ${
        active
          ? 'bg-brand-black text-brand-white shadow-sm'
          : 'border border-brand-border text-brand-gray hover:border-brand-gold/60 hover:text-brand-black'
      }`}
    >
      <Icon size={12} />
      {label}
    </button>
  );
}

function DimLine({
  x1,
  x2,
  y,
  label,
}: {
  x1: number;
  x2: number;
  y: number;
  label: string;
  horizontal?: boolean;
}) {
  const ticks = (xx: number) => `M${xx} ${y - 2.2} L${xx} ${y + 2.2}`;
  return (
    <g stroke="#a49c90" strokeWidth={0.5} fill="none">
      <line x1={x1} y1={y} x2={x2} y2={y} />
      <path d={`${ticks(x1)} ${ticks(x2)}`} />
      <text
        x={(x1 + x2) / 2}
        y={y - 1.6}
        fontSize={3.4}
        fill="#7c746a"
        textAnchor="middle"
        fontFamily="var(--font-sans)"
        stroke="none"
      >
        {label}
      </text>
    </g>
  );
}

function FrameArtwork({
  fx,
  fy,
  fw,
  fh,
  style,
  uid,
}: {
  fx: number;
  fy: number;
  fw: number;
  fh: number;
  style: FrameStyle;
  uid: string;
}) {
  const clipId = `art-${uid}-${style.value.replace(/\s+/g, '')}`;
  const dropShadow: React.CSSProperties = {
    filter: `drop-shadow(0 ${Math.max(2, fh * 0.05)}px ${Math.max(4, fh * 0.1)}px rgba(31, 25, 18, 0.28))`,
  };

  const drawArt = (x: number, y: number, w: number, h: number) => (
    <g clipPath={`url(#${clipId})`}>
      <rect x={x} y={y} width={w} height={h} fill={style.artBg} />
      {style.artwork !== 'sunset' ? (
        <AbstractArt x={x} y={y} w={w} h={h} />
      ) : (
        <SunsetArt x={x} y={y} w={w} h={h} />
      )}
      <rect x={x} y={y} width={w} height={h} fill="none" stroke="rgba(60,45,25,0.28)" strokeWidth={0.3} />
    </g>
  );

  if (style.value === 'Frameless') {
    const inset = 0.5;
    const x = fx + inset;
    const y = fy + inset;
    const w = fw - inset * 2;
    const h = fh - inset * 2;
    return (
      <motion.g
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        style={dropShadow}
      >
        <defs>
          <clipPath id={clipId}>{<rect x={x} y={y} width={w} height={h} rx={0.2} />}</clipPath>
        </defs>
        {drawArt(x, y, w, h)}
      </motion.g>
    );
  }

  if (style.value === 'Floating Frame') {
    const edge = 1.4;
    const gap = 2.4;
    const aw = fw - (edge + gap) * 2;
    const ah = fh - (edge + gap) * 2;
    const ax = fx + edge + gap;
    const ay = fy + edge + gap;
    return (
      <motion.g
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        style={dropShadow}
      >
        <defs>
          <clipPath id={clipId}>{<rect x={ax} y={ay} width={aw} height={ah} rx={0.2} />}</clipPath>
        </defs>
        {/* Frame box */}
        <rect x={fx} y={fy} width={fw} height={fh} rx={0.6} fill={style.frame} />
        <rect x={fx + 0.5} y={fy + 0.5} width={fw - 1} height={fh - 1} rx={0.4} fill="none" stroke={style.frameHighlight} strokeWidth={0.5} opacity={0.7} />
        {/* Backing reveal (the float gap) */}
        <rect x={fx + edge} y={fy + edge} width={fw - edge * 2} height={fh - edge * 2} fill="#e8e2d4" />
        {/* Floating artwork */}
        {drawArt(ax, ay, aw, ah)}
      </motion.g>
    );
  }

  // Standard framed styles
  const edge = 1.6;
  const mat = 3;
  const mx = fx + edge;
  const my = fy + edge;
  const mw = fw - edge * 2;
  const mh = fh - edge * 2;
  const ax = mx + mat;
  const ay = my + mat;
  const aw = mw - mat * 2;
  const ah = mh - mat * 2;
  const isGold = style.value === 'Gold Leaf';

  return (
    <motion.g
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      style={dropShadow}
    >
      <defs>
        <clipPath id={clipId}>{<rect x={ax} y={ay} width={aw} height={ah} rx={0.2} />}</clipPath>
        {isGold && (
          <linearGradient id={`gold-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f0cf76" />
            <stop offset="0.5" stopColor={style.frame} />
            <stop offset="1" stopColor="#c89a2c" />
          </linearGradient>
        )}
      </defs>

      {/* Outer frame moulding */}
      <rect x={fx} y={fy} width={fw} height={fh} rx={0.7} fill={isGold ? `url(#gold-${uid})` : style.frame} />
      <rect x={fx + 0.45} y={fy + 0.45} width={fw - 0.9} height={fh - 0.9} rx={0.45} fill="none" stroke={style.frameHighlight} strokeWidth={0.45} opacity={0.75} />
      <rect x={mx} y={my} width={mw} height={mh} fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth={0.4} opacity={0.6} />

      {/* Acid-free mat */}
      <rect x={mx} y={my} width={mw} height={mh} fill={style.mat} />

      {/* Artwork */}
      {drawArt(ax, ay, aw, ah)}
    </motion.g>
  );
}

function AbstractArt({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  const stroke = 'rgba(64,48,28,0.5)';
  return (
    <g>
      <circle cx={x + w * 0.5} cy={y + h * 0.32} r={w * 0.15} fill="rgba(214,198,170,0.9)" />
      <path
        d={`M${x} ${y + h * 0.9} C ${x + w * 0.18} ${y + h * 0.52}, ${x + w * 0.34} ${y + h * 0.98}, ${x + w * 0.55} ${y + h * 0.68} S ${x + w * 0.86} ${y + h * 0.5}, ${x + w} ${y + h * 0.8} L ${x + w} ${y + h} L ${x} ${y + h} Z`}
        fill="rgba(120,97,68,0.5)"
      />
      <path
        d={`M${x + w * 0.05} ${y + h * 0.96} C ${x + w * 0.28} ${y + h * 0.68}, ${x + w * 0.5} ${y + h * 1.02}, ${x + w * 0.78} ${y + h * 0.78} S ${x + w * 0.95} ${y + h * 0.6}, ${x + w} ${y + h * 0.84} L ${x + w} ${y + h} L ${x} ${y + h} Z`}
        fill="rgba(86,64,40,0.42)"
      />
      {[0.2, 0.4, 0.6, 0.8].map((p) => (
        <path
          key={p}
          d={`M ${x + w * (p + 0.05)} ${y + h * 0.2} C ${x + w * (p - 0.02)} ${y + h * 0.42}, ${x + w * (p + 0.07)} ${y + h * 0.55}, ${x + w * p} ${y + h * 0.75}`}
          fill="none"
          stroke={stroke}
          strokeWidth={0.35}
          strokeLinecap="round"
          opacity={0.8}
        />
      ))}
    </g>
  );
}

function SunsetArt({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <g>
      <circle cx={x + w * 0.5} cy={y + h * 0.4} r={w * 0.18} fill="rgba(220,170,74,0.85)" />
      <path
        d={`M${x} ${y + h * 0.72} L ${x + w * 0.5} ${y + h * 0.9} L ${x + w} ${y + h * 0.72} L ${x + w} ${y + h} L ${x} ${y + h} Z`}
        fill="rgba(150,112,52,0.4)"
      />
      <circle cx={x + w * 0.18} cy={y + h * 0.26} r={w * 0.02} fill="rgba(64,48,28,0.5)" />
      <circle cx={x + w * 0.28} cy={y + h * 0.18} r={w * 0.012} fill="rgba(64,48,28,0.4)" />
      <circle cx={x + w * 0.72} cy={y + h * 0.22} r={w * 0.015} fill="rgba(64,48,28,0.45)" />
    </g>
  );
}

function SofaScene() {
  return (
    <g>
      {/* Floor */}
      <line x1={0} y1={96} x2={110} y2={96} stroke="#d8d0c4" strokeWidth={0.7} />
      {/* Base / skirt */}
      <rect x={6} y={86} width={98} height={8} rx={2} fill="#b3a89d" />
      {/* Seat cushions */}
      <rect x={12} y={72} width={41} height={16} rx={3} fill="#c5bab0" />
      <rect x={57} y={72} width={41} height={16} rx={3} fill="#c5bab0" />
      <line x1={53} y1={72} x2={53} y2={88} stroke="#a89c90" strokeWidth={1} />
      {/* Back */}
      <rect x={8} y={57} width={94} height={20} rx={4} fill="#cfc7be" />
      <rect x={12} y={60} width={34} height={14} rx={2} fill="#d8d0c7" />
      <rect x={48} y={60} width={34} height={14} rx={2} fill="#d8d0c7" />
      <rect x={84} y={60} width={14} height={14} rx={2} fill="#d8d0c7" />
      {/* Arms */}
      <rect x={2} y={62} width={12} height={30} rx={4} fill="#b3a89d" />
      <rect x={96} y={62} width={12} height={30} rx={4} fill="#b3a89d" />
      {/* Throw pillow */}
      <rect x={76} y={63} width={19} height={13} rx={4} fill="#8f7f6b" transform="rotate(-8 85 69)" />
      {/* Legs */}
      <rect x={12} y={92} width={2.5} height={4} fill="#6e5b48" />
      <rect x={95} y={92} width={2.5} height={4} fill="#6e5b48" />
    </g>
  );
}

function DeskScene() {
  return (
    <g>
      {/* Floor */}
      <line x1={0} y1={100} x2={84} y2={100} stroke="#d8d0c4" strokeWidth={0.7} />
      {/* Desk top */}
      <rect x={9} y={52} width={66} height={5} rx={1} fill="#7a5c3c" />
      <rect x={9} y={52} width={66} height={1.2} rx={0.6} fill="#a5825c" />
      {/* Legs */}
      <rect x={14} y={57} width={4} height={43} fill="#4f3a26" />
      <rect x={66} y={57} width={4} height={43} fill="#4f3a26" />
      {/* Monitor stand */}
      <rect x={24} y={46} width={7} height={6} fill="#7a5c3c" />
      <rect x={26.5} y={44} width={2} height={2} fill="#7a5c3c" />
      {/* Monitor */}
      <rect x={16} y={30} width={23} height={16} rx={1.2} fill="#222730" />
      <rect x={18} y={32} width={19} height={12} rx={0.6} fill="#2e3640" />
      <rect x={30} y={45} width={1.4} height={1} fill="#8b939c" />
      {/* Plant */}
      <rect x={62} y={48} width={6} height={4} rx={1} fill="#6d4f33" />
      <path d="M65 48 C 62 40, 60 36, 64 30 C 66 36, 67 40, 65 48 Z" fill="#5e7d4a" />
      <path d="M65 48 C 67 40, 69 37, 69 32 C 66 37, 64 40, 65 48 Z" fill="#6b8c55" />
      {/* Open notebook */}
      <rect x={40} y={46} width={10} height={0.8} rx={0.2} fill="#e6ded2" />
    </g>
  );
}

function BedScene() {
  return (
    <g>
      {/* Floor */}
      <line x1={1} y1={90} x2={83} y2={90} stroke="#d8d0c4" strokeWidth={0.7} />

      {/* Ground shadow */}
      <ellipse cx={42} cy={90} rx={36} ry={2.2} fill="rgba(60,50,40,0.14)" />

      {/**** Draw order so parts overlap naturally ****/}

      {/* Headboard (top layer of wood, behind mattress) */}
      <rect x={7} y={38} width={70} height={50} rx={3} fill="#6e5236" />
      <rect x={4} y={36} width={76} height={6} rx={3} fill="#5a412a" />
      <rect x={10} y={44} width={14} height={42} rx={1.5} fill="#5f462d" />
      <rect x={35} y={44} width={14} height={42} rx={1.5} fill="#5f462d" />
      <rect x={60} y={44} width={14} height={42} rx={1.5} fill="#5f462d" />

      {/* Wooden bed frame legs (behind duvet) */}
      <rect x={14.5} y={85} width={3.5} height={5} rx={0.8} fill="#4f3a26" />
      <rect x={66} y={85} width={3.5} height={5} rx={0.8} fill="#4f3a26" />

      {/* Duvet draping over the frame */}
      <path d="M11 70 L 73 70 L 73 84 Q 73 87 69 87 L 15 87 Q 11 87 11 84 Z" fill="#ece5d8" />
      <path d="M11 79 Q 42 83 73 79 L 73 84 Q 42 89 11 84 Z" fill="#dcd2bf" />
      <path d="M29 71 L 29 85" stroke="#d0c4ae" strokeWidth={0.7} />
      <path d="M55 71 L 55 85" stroke="#d0c4ae" strokeWidth={0.7} />{/* Mattress */}
      <rect x={12} y={58} width={60} height={12} rx={3} fill="#f6f1e8" />
      <rect x={12} y={58} width={60} height={2.5} rx={1.2} fill="#fbf8f2" />

      {/* Pillows leaning against the headboard */}
      <rect x={16} y={52} width={23} height={11} rx={5} fill="#fbf9f4" />
      <rect x={45} y={52} width={23} height={11} rx={5} fill="#fbf9f4" />
      <path d="M19 55 Q 27.5 51.5 36 55" stroke="#e2d9c6" strokeWidth={0.8} fill="none" />
      <path d="M48 55 Q 56.5 51.5 65 55" stroke="#e2d9c6" strokeWidth={0.8} fill="none" />
      <rect x={15} y={63} width={25} height={2} rx={1} fill="rgba(40,32,24,0.08)" />
      <rect x={44} y={63} width={25} height={2} rx={1} fill="rgba(40,32,24,0.08)" />
    </g>
  );
}