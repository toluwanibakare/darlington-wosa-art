// Stroke data for the charcoal sketch animation
// Each stroke represents a gestural charcoal mark

export interface SketchStroke {
  id: string;
  path: string;
  duration: number;      // seconds
  delay: number;         // seconds before start
  weight: number;        // stroke-width
  color: string;         // charcoal color
  // Pre-computed points for pencil cursor tracking (60 samples)
  points: Array<{
    x: number;
    y: number;
    angle: number;       // radians
    progress: number;    // 0-1
  }>;
  velocityProfile: 'light' | 'medium' | 'heavy';
  pressure: number;      // 0-1, affects dust intensity
}

// Charcoal color palette
const CHARCOAL_DARK = '#0D0D0D';
const CHARCOAL_MED = '#1A1A1A';
const CHARCOAL_LIGHT = '#2A2A2A';

// Canvas dimensions for stroke coordinate system
const CANVAS_W = 1400;
const CANVAS_H = 900;

// Helper to generate points along a cubic bezier
function sampleCubicBezier(
  x0: number, y0: number,
  x1: number, y1: number,
  x2: number, y2: number,
  x3: number, y3: number,
  samples: number
): Array<{ x: number; y: number; angle: number; progress: number }> {
  const points = [];
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const mt = 1 - t;
    const mt2 = mt * mt;
    const t2 = t * t;
    
    const x = mt2 * mt * x0 + 3 * mt2 * t * x1 + 3 * mt * t2 * x2 + t2 * t * x3;
    const y = mt2 * mt * y0 + 3 * mt2 * t * y1 + 3 * mt * t2 * y2 + t2 * t * y3;
    
    // Derivative for tangent angle
    const dx = 3 * mt2 * (x1 - x0) + 6 * mt * t * (x2 - x1) + 3 * t2 * (x3 - x2);
    const dy = 3 * mt2 * (y1 - y0) + 6 * mt * t * (y2 - y1) + 3 * t2 * (y3 - y2);
    const angle = Math.atan2(dy, dx);
    
    points.push({ x, y, angle, progress: t });
  }
  return points;
}

// Generate path string from points
function pathFromPoints(points: Array<{x: number, y: number}>): string {
  if (points.length < 2) return '';
  let path = `M ${points[0].x},${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    path += ` L ${points[i].x},${points[i].y}`;
  }
  return path;
}

// Smooth path with catmull-rom spline
function smoothPath(points: Array<{x: number, y: number}>, tension = 0.5): string {
  if (points.length < 2) return '';
  let path = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i > 0 ? i - 1 : i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2 < points.length ? i + 2 : i + 1];
    
    const cp1x = p1.x + (p2.x - p0.x) * tension / 6;
    const cp1y = p1.y + (p2.y - p0.y) * tension / 6;
    const cp2x = p2.x - (p3.x - p1.x) * tension / 6;
    const cp2y = p2.y - (p3.y - p1.y) * tension / 6;
    
    path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
  }
  return path;
}

// ============================================================
// STROKE DEFINITIONS - Gestural charcoal drawing sequence
// ============================================================

// Stroke 1: Initial gesture - broad shoulder sweep (establishes composition)
const stroke1Points = [
  { x: 150, y: 680 }, { x: 280, y: 620 }, { x: 420, y: 580 }, { x: 580, y: 560 },
  { x: 720, y: 550 }, { x: 860, y: 560 }, { x: 980, y: 580 }, { x: 1120, y: 620 },
  { x: 1250, y: 680 }
];
const stroke1Path = smoothPath(stroke1Points);
const stroke1Sampled = sampleCubicBezier(
  150, 680, 280, 620, 420, 580, 580, 560, 60
).concat(
  sampleCubicBezier(580, 560, 720, 550, 860, 560, 980, 580, 60).slice(1)
).concat(
  sampleCubicBezier(980, 580, 1120, 620, 1250, 680, 1300, 720, 60).slice(1)
);

// Stroke 2: Counter-gesture - defines lower boundary
const stroke2Points = [
  { x: 1200, y: 780 }, { x: 1050, y: 760 }, { x: 900, y: 750 }, { x: 720, y: 740 },
  { x: 550, y: 735 }, { x: 380, y: 740 }, { x: 220, y: 750 }, { x: 100, y: 770 }
];
const stroke2Path = smoothPath(stroke2Points);
const stroke2Sampled = sampleCubicBezier(
  1200, 780, 1050, 760, 900, 750, 720, 740, 60
).concat(
  sampleCubicBezier(720, 740, 550, 735, 380, 740, 220, 750, 60).slice(1)
).concat(
  sampleCubicBezier(220, 750, 100, 770, 50, 790, 0, 800, 60).slice(1)
);

// Stroke 3: Vertical accent - establishes figure height
const stroke3Points = [
  { x: 680, y: 200 }, { x: 685, y: 320 }, { x: 690, y: 440 }, { x: 692, y: 550 }
];
const stroke3Path = smoothPath(stroke3Points);
const stroke3Sampled = sampleCubicBezier(680, 200, 685, 320, 690, 440, 692, 550, 40);

// Stroke 4: Head/shoulder block-in
const stroke4Points = [
  { x: 580, y: 220 }, { x: 620, y: 200 }, { x: 700, y: 210 }, { x: 760, y: 230 },
  { x: 780, y: 260 }, { x: 760, y: 290 }, { x: 700, y: 310 }, { x: 620, y: 300 },
  { x: 580, y: 280 }, { x: 580, y: 220 }
];
const stroke4Path = smoothPath(stroke4Points, 0.3);
const stroke4Sampled: Array<{x: number, y: number, angle: number, progress: number}> = [];
// Sample as circular-ish path
for (let i = 0; i <= 60; i++) {
  const t = i / 60;
  const angle = t * Math.PI * 2 - Math.PI / 2;
  const cx = 680, cy = 260, rx = 100, ry = 60;
  const x = cx + Math.cos(angle) * rx;
  const y = cy + Math.sin(angle) * ry;
  const dx = -Math.sin(angle) * rx;
  const dy = Math.cos(angle) * ry;
  stroke4Sampled.push({ x, y, angle: Math.atan2(dy, dx), progress: t });
}

// Stroke 5: Eye socket shadow (dark accent)
const stroke5Points = [
  { x: 620, y: 240 }, { x: 640, y: 235 }, { x: 660, y: 238 }, { x: 680, y: 245 },
  { x: 670, y: 255 }, { x: 640, y: 250 }, { x: 620, y: 245 }
];
const stroke5Path = smoothPath(stroke5Points, 0.3);
const stroke5Sampled: Array<{x: number, y: number, angle: number, progress: number}> = [];
for (let i = 0; i <= 30; i++) {
  const t = i / 30;
  const idx = Math.floor(t * (stroke5Points.length - 1));
  const next = Math.min(idx + 1, stroke5Points.length - 1);
  const localT = (t * (stroke5Points.length - 1)) - idx;
  const x = stroke5Points[idx].x + (stroke5Points[next].x - stroke5Points[idx].x) * localT;
  const y = stroke5Points[idx].y + (stroke5Points[next].y - stroke5Points[idx].y) * localT;
  const angle = Math.atan2(stroke5Points[next].y - stroke5Points[idx].y, stroke5Points[next].x - stroke5Points[idx].x);
  stroke5Sampled.push({ x, y, angle, progress: t });
}

// Stroke 6: Jawline definition
const stroke6Points = [
  { x: 560, y: 300 }, { x: 570, y: 340 }, { x: 600, y: 370 }, { x: 650, y: 390 },
  { x: 710, y: 395 }, { x: 770, y: 380 }, { x: 810, y: 350 }
];
const stroke6Path = smoothPath(stroke6Points);
const stroke6Sampled = sampleCubicBezier(
  560, 300, 570, 340, 600, 370, 650, 390, 30
).concat(
  sampleCubicBezier(650, 390, 710, 395, 770, 380, 810, 350, 30).slice(1)
);

// Stroke 7: Hair mass - energetic scribbles
const stroke7Points = [
  { x: 520, y: 180 }, { x: 580, y: 160 }, { x: 650, y: 170 }, { x: 720, y: 150 },
  { x: 780, y: 165 }, { x: 820, y: 185 }, { x: 840, y: 210 }, { x: 830, y: 235 },
  { x: 790, y: 240 }, { x: 740, y: 235 }, { x: 680, y: 220 }, { x: 620, y: 210 },
  { x: 570, y: 205 }, { x: 530, y: 210 }
];
const stroke7Path = smoothPath(stroke7Points, 0.4);
const stroke7Sampled = sampleCubicBezier(
  520, 180, 580, 160, 650, 170, 720, 150, 30
).concat(
  sampleCubicBezier(720, 150, 780, 165, 820, 185, 840, 210, 30).slice(1)
).concat(
  sampleCubicBezier(840, 210, 830, 235, 790, 240, 740, 235, 30).slice(1)
).concat(
  sampleCubicBezier(740, 235, 680, 220, 620, 210, 570, 205, 30).slice(1)
).concat(
  sampleCubicBezier(570, 205, 530, 210, 510, 220, 500, 230, 30).slice(1)
);

// Stroke 8: Background tone - broad side-of-charcoal shading
const stroke8Points = [
  { x: 200, y: 850 }, { x: 400, y: 820 }, { x: 600, y: 800 }, { x: 800, y: 790 },
  { x: 1000, y: 795 }, { x: 1200, y: 810 }
];
const stroke8Path = smoothPath(stroke8Points);
const stroke8Sampled = sampleCubicBezier(
  200, 850, 400, 820, 600, 800, 800, 790, 60
).concat(
  sampleCubicBezier(800, 790, 1000, 795, 1200, 810, 1350, 820, 60).slice(1)
);

// Stroke 9: Foreground gesture - suggests easel/table edge
const stroke9Points = [
  { x: 100, y: 880 }, { x: 350, y: 870 }, { x: 600, y: 875 }, { x: 850, y: 880 },
  { x: 1100, y: 885 }, { x: 1300, y: 890 }
];
const stroke9Path = smoothPath(stroke9Points);
const stroke9Sampled = sampleCubicBezier(
  100, 880, 350, 870, 600, 875, 850, 880, 60
).concat(
  sampleCubicBezier(850, 880, 1100, 885, 1300, 890, 1400, 895, 60).slice(1)
);

// Stroke 10: Signature flourish - artist's mark
const stroke10Points = [
  { x: 1150, y: 820 }, { x: 1180, y: 800 }, { x: 1220, y: 810 }, { x: 1250, y: 830 },
  { x: 1270, y: 855 }, { x: 1280, y: 880 }
];
const stroke10Path = smoothPath(stroke10Points);
const stroke10Sampled = sampleCubicBezier(
  1150, 820, 1180, 800, 1220, 810, 1250, 830, 25
).concat(
  sampleCubicBezier(1250, 830, 1270, 855, 1280, 880, 1285, 900, 25).slice(1)
);

// ============================================================
// EXPORT ALL STROKES IN DRAWING ORDER
// ============================================================

export const SKETCH_STROKES: SketchStroke[] = [
  {
    id: 'stroke-01',
    path: stroke1Path,
    duration: 1.4,
    delay: 0.4,
    weight: 4,
    color: CHARCOAL_MED,
    points: stroke1Sampled.slice(0, 61),
    velocityProfile: 'medium',
    pressure: 0.6,
  },
  {
    id: 'stroke-02',
    path: stroke2Path,
    duration: 1.2,
    delay: 0.9,
    weight: 3.5,
    color: CHARCOAL_MED,
    points: stroke2Sampled.slice(0, 61),
    velocityProfile: 'medium',
    pressure: 0.55,
  },
  {
    id: 'stroke-03',
    path: stroke3Path,
    duration: 0.9,
    delay: 1.6,
    weight: 5,
    color: CHARCOAL_DARK,
    points: stroke3Sampled.slice(0, 41),
    velocityProfile: 'heavy',
    pressure: 0.8,
  },
  {
    id: 'stroke-04',
    path: stroke4Path,
    duration: 1.1,
    delay: 2.1,
    weight: 3,
    color: CHARCOAL_MED,
    points: stroke4Sampled.slice(0, 61),
    velocityProfile: 'light',
    pressure: 0.45,
  },
  {
    id: 'stroke-05',
    path: stroke5Path,
    duration: 0.6,
    delay: 2.8,
    weight: 4.5,
    color: CHARCOAL_DARK,
    points: stroke5Sampled.slice(0, 31),
    velocityProfile: 'heavy',
    pressure: 0.85,
  },
  {
    id: 'stroke-06',
    path: stroke6Path,
    duration: 0.9,
    delay: 3.0,
    weight: 3.5,
    color: CHARCOAL_MED,
    points: stroke6Sampled.slice(0, 61),
    velocityProfile: 'medium',
    pressure: 0.6,
  },
  {
    id: 'stroke-07',
    path: stroke7Path,
    duration: 1.6,
    delay: 3.4,
    weight: 2.5,
    color: CHARCOAL_LIGHT,
    points: stroke7Sampled.slice(0, 61),
    velocityProfile: 'light',
    pressure: 0.35,
  },
  {
    id: 'stroke-08',
    path: stroke8Path,
    duration: 1.3,
    delay: 4.2,
    weight: 8,
    color: CHARCOAL_LIGHT,
    points: stroke8Sampled.slice(0, 61),
    velocityProfile: 'medium',
    pressure: 0.4,
  },
  {
    id: 'stroke-09',
    path: stroke9Path,
    duration: 0.8,
    delay: 4.8,
    weight: 3,
    color: CHARCOAL_MED,
    points: stroke9Sampled.slice(0, 61),
    velocityProfile: 'medium',
    pressure: 0.5,
  },
  {
    id: 'stroke-10',
    path: stroke10Path,
    duration: 0.7,
    delay: 5.2,
    weight: 2,
    color: '#9E651B', // Gold signature
    points: stroke10Sampled.slice(0, 51),
    velocityProfile: 'light',
    pressure: 0.3,
  },
];

// Total animation duration before text reveal
export const TOTAL_SKETCH_DURATION = 6.2; // seconds

// Canvas viewBox for the sketch SVG
export const SKETCH_VIEWBOX = `0 0 ${CANVAS_W} ${CANVAS_H}`;