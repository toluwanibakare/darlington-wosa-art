export interface FrameStyle {
  value: string;
  label: string;
  tagline: string;
  frame: string;
  frameHighlight: string;
  mat: string;
  artBg: string;
  artwork?: 'abstract' | 'sunset';
}

export const FRAME_STYLES: FrameStyle[] = [
  {
    value: 'Modern Black',
    label: 'Modern Black',
    tagline: 'Sleek matte black for a contemporary gallery look',
    frame: '#211f1c',
    frameHighlight: '#3b3732',
    mat: '#f3efe6',
    artBg: '#e9ddc8',
    artwork: 'abstract',
  },
  {
    value: 'Natural Wood',
    label: 'Natural Wood',
    tagline: 'Warm oak that feels timeless and handcrafted',
    frame: '#7a5b38',
    frameHighlight: '#9a7a52',
    mat: '#faf5eb',
    artBg: '#eadcc4',
    artwork: 'abstract',
  },
  {
    value: 'Gold Leaf',
    label: 'Gold Leaf',
    tagline: 'Gilded luxury with a soft radiant finish',
    frame: '#a97b10',
    frameHighlight: '#e8c25a',
    mat: '#faf6ec',
    artBg: '#ece0c8',
    artwork: 'sunset',
  },
  {
    value: 'Frameless',
    label: 'Frameless',
    tagline: 'Clean and minimal, edge-to-edge artwork',
    frame: 'transparent',
    frameHighlight: 'transparent',
    mat: 'transparent',
    artBg: '#efe7d8',
    artwork: 'abstract',
  },
  {
    value: 'Floating Frame',
    label: 'Floating Frame',
    tagline: 'Art floats inside the frame with breathing space',
    frame: '#26221d',
    frameHighlight: '#3d3730',
    mat: '#f0e9db',
    artBg: '#e6d9c2',
    artwork: 'abstract',
  },
];

export const DEFAULT_FRAME_STYLE: FrameStyle = FRAME_STYLES[0];

export function getFrameStyle(value?: string | null): FrameStyle {
  return FRAME_STYLES.find((s) => s.value === value) ?? DEFAULT_FRAME_STYLE;
}