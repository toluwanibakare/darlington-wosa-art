"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Play, Maximize2, Calendar, User, Tag } from 'lucide-react';
import { PORTFOLIO_DATA, CATEGORIES, type PortfolioItem } from './portfolio-data';

/* ── Filter Bar ── */

function FilterBar({
  active,
  onSelect,
}: {
  active: string;
  onSelect: (cat: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((cat) => {
        const isActive = cat === active;
        return (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={`relative font-sans text-[11px] tracking-[0.15em] uppercase px-5 py-2.5 rounded-full border transition-all duration-500 cursor-pointer ${
              isActive
                ? 'bg-brand-black text-brand-white border-brand-black'
                : 'bg-transparent text-brand-gray border-brand-border hover:border-brand-gray/40 hover:text-brand-black'
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}

/* ── Gallery Grid ── */

function GalleryGrid({
  items,
  onOpen,
}: {
  items: PortfolioItem[];
  onOpen: (id: number) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
      {items.map((item, i) => (
        <motion.div
          key={item.id}
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10, scale: 0.96 }}
          transition={{ duration: 0.6, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
          style={{
            aspectRatio: `${item.width} / ${item.height}`,
          }}
          className={`group relative overflow-hidden rounded-[8px] border border-brand-border bg-brand-white cursor-pointer`}
          onClick={() => onOpen(item.id)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.thumb}
            alt={item.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] ease-[var(--ease-expo-out)] group-hover:scale-105"
            loading="lazy"
          />

          {/* Video badge */}
          {item.type === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors duration-500">
              <div className="w-14 h-14 rounded-full bg-brand-gold/90 flex items-center justify-center shadow-lg backdrop-blur-sm">
                <Play size={20} className="text-white ml-0.5" />
              </div>
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
            <h3 className="font-display text-lg text-white mb-1">{item.title}</h3>
            <p className="font-sans text-xs text-white/70">{item.category}</p>
          </div>

          {/* Expand icon top-right */}
          <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <Maximize2 size={10} className="text-white" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ── Lightbox (Full-Screen Viewer) ── */

function Lightbox({
  item,
  items,
  onClose,
  onPrev,
  onNext,
}: {
  item: PortfolioItem;
  items: PortfolioItem[];
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    },
    [onClose, onPrev, onNext]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown]);

  const index = items.findIndex((i) => i.id === item.id);
  const hasPrev = index > 0;
  const hasNext = index < items.length - 1;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-300 cursor-pointer"
        aria-label="Close"
      >
        <X size={18} className="text-white" />
      </button>

      {/* Prev */}
      {hasPrev && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-300 cursor-pointer"
          aria-label="Previous"
        >
          <ChevronLeft size={20} className="text-white" />
        </button>
      )}

      {/* Next */}
      {hasNext && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-300 cursor-pointer"
          aria-label="Next"
        >
          <ChevronRight size={20} className="text-white" />
        </button>
      )}

      {/* Content */}
      <motion.div
        key={item.id}
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 max-w-[90vw] max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Media */}
        <div className="relative w-full lg:w-auto max-w-[70vw] max-h-[70vh] flex items-center justify-center">
          {item.type === 'video' && item.videoSrc ? (
            <div className="relative w-full max-w-[800px] aspect-video">
              <video
                src={item.videoSrc}
                controls
                className="w-full h-full rounded-[8px] bg-black"
                playsInline
              />
            </div>
          ) : item.type === 'video' && item.videoEmbed ? (
            <div className="relative w-full max-w-[800px] aspect-video">
              <iframe
                src={item.videoEmbed}
                title={item.title}
                className="w-full h-full rounded-[8px]"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={item.src}
              alt={item.title}
              className="max-w-full max-h-[70vh] object-contain rounded-[4px]"
            />
          )}
        </div>

        {/* Details */}
        <div className="w-full lg:w-72 flex-shrink-0 text-center lg:text-left">
          <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-brand-gold">
            {item.category}
          </span>
          <h2 className="font-display text-2xl md:text-3xl text-white mt-2 mb-4">
            {item.title}
          </h2>
          <p className="font-sans text-sm text-white/60 leading-relaxed mb-6">
            {item.description}
          </p>
          <div className="space-y-3">
            {item.client && (
              <div className="flex items-center justify-center lg:justify-start gap-2 text-white/50 text-xs">
                <User size={11} />
                <span>{item.client}</span>
              </div>
            )}
            {item.year && (
              <div className="flex items-center justify-center lg:justify-start gap-2 text-white/50 text-xs">
                <Calendar size={11} />
                <span>{item.year}</span>
              </div>
            )}
            {item.medium && (
              <div className="flex items-center justify-center lg:justify-start gap-2 text-white/50 text-xs">
                <Tag size={11} />
                <span>{item.medium}</span>
              </div>
            )}
          </div>
          <p className="font-sans text-xs text-white/30 mt-6">
            {index + 1} / {items.length}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Main Export ── */

export function PortfolioGallery() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [lightboxItem, setLightboxItem] = useState<PortfolioItem | null>(null);

  const filtered =
    activeFilter === "All"
      ? PORTFOLIO_DATA
      : PORTFOLIO_DATA.filter((item) => item.category === activeFilter);

  const openLightbox = (id: number) => {
    const found = PORTFOLIO_DATA.find((item) => item.id === id);
    if (found) setLightboxItem(found);
  };

  const prevItem = () => {
    if (!lightboxItem) return;
    const idx = PORTFOLIO_DATA.findIndex((i) => i.id === lightboxItem.id);
    if (idx > 0) setLightboxItem(PORTFOLIO_DATA[idx - 1]);
  };

  const nextItem = () => {
    if (!lightboxItem) return;
    const idx = PORTFOLIO_DATA.findIndex((i) => i.id === lightboxItem.id);
    if (idx < PORTFOLIO_DATA.length - 1) setLightboxItem(PORTFOLIO_DATA[idx + 1]);
  };

  return (
    <section className="relative w-full bg-brand-surface py-24 md:py-32 px-6 overflow-hidden border-t border-brand-border">
      <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-20" style={{ backgroundImage: 'var(--bg-noise)' }} />

      <div className="max-w-[1600px] mx-auto">
        {/* Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <FilterBar active={activeFilter} onSelect={setActiveFilter} />
        </motion.div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <GalleryGrid key={activeFilter} items={filtered} onOpen={openLightbox} />
        </AnimatePresence>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxItem && (
          <Lightbox
            item={lightboxItem}
            items={PORTFOLIO_DATA}
            onClose={() => setLightboxItem(null)}
            onPrev={prevItem}
            onNext={nextItem}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
