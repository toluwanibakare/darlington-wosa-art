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
  videoSrc?: string;
}

const IMG = '/images/projects';

export const PORTFOLIO_DATA: PortfolioItem[] = [
  {
    id: 1,
    title: "The Visionary",
    category: "Charcoal Portraits",
    type: "image",
    src: `${IMG}/IMG_5028.JPG`,
    thumb: `${IMG}/IMG_5028.JPG`,
    width: 1200, height: 1500,
    description: "A deeply expressive charcoal portrait capturing the intensity of the human spirit through dramatic shadow work.",
    client: "Private Collector", year: "2024", medium: "Charcoal on Paper"
  },
  {
    id: 2,
    title: "Quiet Strength",
    category: "Charcoal Portraits",
    type: "image",
    src: `${IMG}/IMG_5029.JPG`,
    thumb: `${IMG}/IMG_5029.JPG`,
    width: 1200, height: 1500,
    description: "Soft charcoal gradients meet bold contours in this contemplative portrait study.",
    client: "Studio Collection", year: "2023", medium: "Charcoal on Paper"
  },
  {
    id: 3,
    title: "Ancestral Gaze",
    category: "Charcoal Portraits",
    type: "image",
    src: `${IMG}/IMG_5030.JPG`,
    thumb: `${IMG}/IMG_5030.JPG`,
    width: 1200, height: 1500,
    description: "Eyes that tell a thousand stories — a large-format charcoal piece rich in texture and emotion.",
    client: "Corporate Commission", year: "2024", medium: "Charcoal on Paper"
  },
  {
    id: 4,
    title: "Corporate Dignity",
    category: "Pencil Drawings",
    type: "image",
    src: `${IMG}/IMG_5032.JPG`,
    thumb: `${IMG}/IMG_5032.JPG`,
    width: 1200, height: 1500,
    description: "A refined graphite portrait commissioned for a CEO's executive suite.",
    client: "Crestview Holdings", year: "2024", medium: "Graphite on Paper"
  },
  {
    id: 5,
    title: "Timeless Elegance",
    category: "Pencil Drawings",
    type: "image",
    src: `${IMG}/IMG_5033.JPG`,
    thumb: `${IMG}/IMG_5033.JPG`,
    width: 1200, height: 1500,
    description: "Fine graphite work with meticulous attention to texture, light, and form.",
    client: "Private Collector", year: "2023", medium: "Graphite on Paper"
  },
  {
    id: 6,
    title: "Focused Brilliance",
    category: "Pencil Drawings",
    type: "image",
    src: `${IMG}/IMG_5035.JPG`,
    thumb: `${IMG}/IMG_5035.JPG`,
    width: 1200, height: 1500,
    description: "A study in concentration — every pencil stroke deliberate and purposeful.",
    client: "Studio Collection", year: "2023", medium: "Graphite on Paper"
  },
  {
    id: 7,
    title: "Gold Leaf Elegance",
    category: "Mixed Media",
    type: "image",
    src: `${IMG}/IMG_5036.JPG`,
    thumb: `${IMG}/IMG_5036.JPG`,
    width: 1200, height: 1500,
    description: "A mixed-media piece combining gold leaf with charcoal for a luminous, textured finish.",
    client: "Luxury Residence", year: "2024", medium: "Mixed Media, Gold Leaf"
  },
  {
    id: 8,
    title: "Museum Presentation",
    category: "Mixed Media",
    type: "image",
    src: `${IMG}/IMG_5037.JPG`,
    thumb: `${IMG}/IMG_5037.JPG`,
    width: 1200, height: 800,
    description: "An artwork displayed with conservation-grade presentation and archival matting.",
    client: "Gallery Exhibition", year: "2024", medium: "Mixed Media"
  },
  {
    id: 9,
    title: "Boardroom Collection",
    category: "Corporate",
    type: "image",
    src: `${IMG}/393a2db0-c36d-4f6a-8dfd-0ded87b3743d.JPG`,
    thumb: `${IMG}/393a2db0-c36d-4f6a-8dfd-0ded87b3743d.JPG`,
    width: 1200, height: 800,
    description: "A curated collection of portraits and abstract works for a corporate headquarters.",
    client: "Tech Innovation Hub", year: "2024", medium: "Mixed Media Installation"
  },
  {
    id: 10,
    title: "Executive Presence",
    category: "Corporate",
    type: "image",
    src: `${IMG}/601b5547-6a1e-41fd-a757-8fae98b6d6c1.jpg`,
    thumb: `${IMG}/601b5547-6a1e-41fd-a757-8fae98b6d6c1.jpg`,
    width: 1200, height: 1500,
    description: "A formal portrait commission for a corporate boardroom, executed in charcoal with subtle gold accents.",
    client: "Financial Services Firm", year: "2024", medium: "Charcoal & Gold Leaf"
  },
  {
    id: 11,
    title: "Layers of Being",
    category: "Mixed Media",
    type: "image",
    src: `${IMG}/ff27c515-de9c-4644-bc7f-96584864a96b.JPG`,
    thumb: `${IMG}/ff27c515-de9c-4644-bc7f-96584864a96b.JPG`,
    width: 1200, height: 1200,
    description: "An experimental fusion of charcoal, acrylic, and gold leaf exploring identity and depth.",
    client: "Art Collector", year: "2024", medium: "Charcoal, Acrylic, Gold Leaf"
  },
  {
    id: 12,
    title: "Urban Rhythms",
    category: "Mixed Media",
    type: "image",
    src: `${IMG}/IMG_5028.JPG`,
    thumb: `${IMG}/IMG_5028.JPG`,
    width: 1200, height: 800,
    description: "Mixed-media abstraction capturing the energy and movement of city life.",
    client: "Private Commission", year: "2023", medium: "Acrylic & Graphite on Canvas"
  },
  {
    id: 13,
    title: "Charcoal Study I",
    category: "Charcoal Portraits",
    type: "image",
    src: `${IMG}/IMG_5030.JPG`,
    thumb: `${IMG}/IMG_5030.JPG`,
    width: 1200, height: 1500,
    description: "Expressive charcoal study exploring light, shadow, and human emotion.",
    year: "2024",
  },
  {
    id: 14,
    title: "Portrait in Progress",
    category: "Charcoal Portraits",
    type: "image",
    src: `${IMG}/IMG_5035.JPG`,
    thumb: `${IMG}/IMG_5035.JPG`,
    width: 1200, height: 1500,
    description: "A charcoal portrait from blank paper to finished artwork.",
    year: "2024",
  },
  {
    id: 15,
    title: "Live Art Event I",
    category: "Creative Events",
    type: "image",
    src: "/images/events/021921f3-ecad-4c3d-9d95-89c5e7bf0745.JPG",
    thumb: "/images/events/021921f3-ecad-4c3d-9d95-89c5e7bf0745.JPG",
    width: 1200, height: 1500,
    description: "Scenes from a live art event and workshop experience.",
    year: "2025",
  },
  {
    id: 16,
    title: "Live Art Event II",
    category: "Creative Events",
    type: "image",
    src: "/images/events/4ff697ce-4f4a-43dc-98a5-06d016d032cf.JPG",
    thumb: "/images/events/4ff697ce-4f4a-43dc-98a5-06d016d032cf.JPG",
    width: 1200, height: 1500,
    description: "Scenes from a live art event and workshop experience.",
    year: "2025",
  },
  {
    id: 17,
    title: "Live Art Event III",
    category: "Creative Events",
    type: "image",
    src: "/images/events/60811ba3-6d03-457b-a3c3-5986e6f69736.JPG",
    thumb: "/images/events/60811ba3-6d03-457b-a3c3-5986e6f69736.JPG",
    width: 1200, height: 800,
    description: "Scenes from a live art event and workshop experience.",
    year: "2025",
  },
  {
    id: 18,
    title: "Live Art Event IV",
    category: "Creative Events",
    type: "image",
    src: "/images/events/66302e4b-0f32-4510-88b2-792f512d22c5.JPG",
    thumb: "/images/events/66302e4b-0f32-4510-88b2-792f512d22c5.JPG",
    width: 1200, height: 800,
    description: "Scenes from a live art event and workshop experience.",
    year: "2025",
  },
  {
    id: 19,
    title: "Live Art Event V",
    category: "Creative Events",
    type: "image",
    src: "/images/events/d1827354-04aa-4279-a9e3-41e0220a9fe6.JPG",
    thumb: "/images/events/d1827354-04aa-4279-a9e3-41e0220a9fe6.JPG",
    width: 1200, height: 1500,
    description: "Scenes from a live art event and workshop experience.",
    year: "2025",
  },
];

export const CATEGORIES = ["All", "Charcoal Portraits", "Pencil Drawings", "Mixed Media", "Corporate", "Creative Events"] as const;
