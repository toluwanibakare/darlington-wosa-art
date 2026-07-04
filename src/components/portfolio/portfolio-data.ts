"use client";

import React from 'react';

export interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  type: 'image' | 'video';
  src: string;
  thumb: string;
  width: number;
  height: number;
  description: string;
  client?: string;
  year?: string;
  medium?: string;
  videoEmbed?: string;
}

export const PORTFOLIO_DATA: PortfolioItem[] = [
  // ── Charcoal Portraits ──
  {
    id: 1,
    title: "The Visionary",
    category: "Charcoal Portraits",
    type: "image",
    src: "https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?auto=format&fit=crop&w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?auto=format&fit=crop&w=600&q=80",
    width: 1200, height: 1500,
    description: "A deeply expressive charcoal portrait capturing the intensity of the human spirit through dramatic shadow work.",
    client: "Private Collector", year: "2024", medium: "Charcoal on Paper"
  },
  {
    id: 2,
    title: "Quiet Strength",
    category: "Charcoal Portraits",
    type: "image",
    src: "https://images.unsplash.com/photo-1515405295579-ba7b45403062?auto=format&fit=crop&w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1515405295579-ba7b45403062?auto=format&fit=crop&w=600&q=80",
    width: 1200, height: 1500,
    description: "Soft charcoal gradients meet bold contours in this contemplative portrait study.",
    client: "Studio Collection", year: "2023", medium: "Charcoal on Paper"
  },
  {
    id: 3,
    title: "Ancestral Gaze",
    category: "Charcoal Portraits",
    type: "image",
    src: "https://images.unsplash.com/photo-1596548438137-d426f15e986a?auto=format&fit=crop&w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1596548438137-d426f15e986a?auto=format&fit=crop&w=600&q=80",
    width: 1200, height: 1500,
    description: "Eyes that tell a thousand stories — a large-format charcoal piece rich in texture and emotion.",
    client: "Corporate Commission", year: "2024", medium: "Charcoal on Paper"
  },
  // ── Pencil Drawings ──
  {
    id: 4,
    title: "Corporate Dignity",
    category: "Pencil Drawings",
    type: "image",
    src: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80",
    width: 1200, height: 1500,
    description: "A refined graphite portrait commissioned for a CEO's executive suite.",
    client: "Crestview Holdings", year: "2024", medium: "Graphite on Paper"
  },
  {
    id: 5,
    title: "Timeless Elegance",
    category: "Pencil Drawings",
    type: "image",
    src: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?auto=format&fit=crop&w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?auto=format&fit=crop&w=600&q=80",
    width: 1200, height: 1500,
    description: "Fine graphite work with meticulous attention to texture, light, and form.",
    client: "Private Collector", year: "2023", medium: "Graphite on Paper"
  },
  {
    id: 6,
    title: "Focused Brilliance",
    category: "Pencil Drawings",
    type: "image",
    src: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=600&q=80",
    width: 1200, height: 1500,
    description: "A study in concentration — every pencil stroke deliberate and purposeful.",
    client: "Studio Collection", year: "2023", medium: "Graphite on Paper"
  },
  // ── Framed Works ──
  {
    id: 7,
    title: "Gold Leaf Elegance",
    category: "Framed Works",
    type: "image",
    src: "https://images.unsplash.com/photo-1578926375605-eaf7559b1458?auto=format&fit=crop&w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1578926375605-eaf7559b1458?auto=format&fit=crop&w=600&q=80",
    width: 1200, height: 1500,
    description: "A mixed-media piece framed in hand-finished gold-accented moulding with conservation-grade matting.",
    client: "Luxury Residence", year: "2024", medium: "Mixed Media, Museum Frame"
  },
  {
    id: 8,
    title: "Museum Presentation",
    category: "Framed Works",
    type: "image",
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80",
    width: 1200, height: 800,
    description: "A framed artwork displayed with anti-reflective museum glass and archival matting.",
    client: "Gallery Exhibition", year: "2024", medium: "Oil on Canvas, Custom Frame"
  },
  // ── Corporate ──
  {
    id: 9,
    title: "Boardroom Collection",
    category: "Corporate",
    type: "image",
    src: "https://images.unsplash.com/photo-1549887552-cb1071d3e5ca?auto=format&fit=crop&w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1549887552-cb1071d3e5ca?auto=format&fit=crop&w=600&q=80",
    width: 1200, height: 800,
    description: "A curated collection of portraits and abstract works for a corporate headquarters.",
    client: "Tech Innovation Hub", year: "2024", medium: "Mixed Media Installation"
  },
  {
    id: 10,
    title: "Executive Presence",
    category: "Corporate",
    type: "image",
    src: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=600&q=80",
    width: 1200, height: 1500,
    description: "A formal portrait commission for a corporate boardroom, executed in charcoal with subtle gold accents.",
    client: "Financial Services Firm", year: "2024", medium: "Charcoal & Gold Leaf"
  },
  // ── Mixed Media ──
  {
    id: 11,
    title: "Layers of Being",
    category: "Mixed Media",
    type: "image",
    src: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80",
    width: 1200, height: 1200,
    description: "An experimental fusion of charcoal, acrylic, and gold leaf exploring identity and depth.",
    client: "Art Collector", year: "2024", medium: "Charcoal, Acrylic, Gold Leaf"
  },
  {
    id: 12,
    title: "Urban Rhythms",
    category: "Mixed Media",
    type: "image",
    src: "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=600&q=80",
    width: 1200, height: 800,
    description: "Mixed-media abstraction capturing the energy and movement of city life.",
    client: "Private Commission", year: "2023", medium: "Acrylic & Graphite on Canvas"
  },
  // ── Video ──
  {
    id: 13,
    title: "The Framing Process",
    category: "Videos",
    type: "video",
    src: "",
    thumb: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80",
    width: 1200, height: 800,
    description: "Watch a time-lapse of a museum-grade frame being handcrafted from raw wood to finished piece.",
    year: "2024",
    videoEmbed: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: 14,
    title: "Portrait in Progress",
    category: "Videos",
    type: "video",
    src: "",
    thumb: "https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?auto=format&fit=crop&w=600&q=80",
    width: 1200, height: 1500,
    description: "A real-time recording of a charcoal portrait from blank paper to finished artwork.",
    year: "2024",
    videoEmbed: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
];

export const CATEGORIES = ["All", "Charcoal Portraits", "Pencil Drawings", "Mixed Media", "Framed Works", "Corporate", "Videos"] as const;
