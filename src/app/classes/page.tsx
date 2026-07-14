"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Clock, Users, MapPin, Star, ArrowRight, GraduationCap, BookOpen, Download, FileText, Layers } from 'lucide-react';

const TABS = [
  { label: 'Live Classes', value: 'classes', icon: GraduationCap },
  { label: 'E-Books', value: 'courses', icon: BookOpen },
];

const CLASSES = [
  {
    id: 'single-session',
    title: 'Single Session',
    description: 'A one-on-one guided art session tailored to your skill level. Perfect for beginners wanting to try or experienced artists looking for focused guidance.',
    duration: '2 hours',
    price: '₦25,000',
    seats: 5,
    instructor: 'Darlington Wosa',
    location: 'Online / Studio',
    level: 'All Levels',
  },
  {
    id: 'monthly-package',
    title: 'Monthly Package',
    description: 'Four weekly sessions offering structured progression. Includes personalized feedback, reference materials, and homework assignments.',
    duration: '4 sessions (8 hrs)',
    price: '₦80,000',
    seats: 8,
    instructor: 'Darlington Wosa',
    location: 'Online / Studio',
    level: 'All Levels',
  },
  {
    id: 'beginner-workshop',
    title: 'Beginner Workshop',
    description: 'An intensive workshop covering charcoal and pencil fundamentals. Learn shading, proportion, texture, and composition from the ground up.',
    duration: '3 hours',
    price: '₦15,000',
    seats: 15,
    instructor: 'Darlington Wosa',
    location: 'Studio, Rivers State',
    level: 'Beginner',
  },
  {
    id: 'group-session',
    title: 'Group Session',
    description: 'Bring your friends or family for a creative group experience. Ideal for team building, birthday parties, or social gatherings.',
    duration: '2.5 hours',
    price: '₦12,000/pp',
    seats: 12,
    instructor: 'Darlington Wosa',
    location: 'Studio, Rivers State',
    level: 'All Levels',
  },
  {
    id: 'private-class',
    title: 'Private Class',
    description: 'Exclusive one-on-one mentorship with Darlington. Custom curriculum designed around your goals, medium preferences, and schedule.',
    duration: 'Flexible',
    price: '₦50,000/session',
    seats: 1,
    instructor: 'Darlington Wosa',
    location: 'Studio / Online',
    level: 'All Levels',
  },
];

const EBOOKS = [
  {
    id: 'hyper-realism-guide',
    title: 'The Art of Hyper-Realism',
    description: 'A comprehensive 120-page guide covering advanced charcoal and pencil techniques. Master shading, texture, proportion, and composition with step-by-step tutorials.',
    pages: '120 pages',
    format: 'PDF',
    price: '₦15,000',
    level: 'Intermediate',
    icon: FileText,
  },
  {
    id: 'charcoal-mastery',
    title: 'Charcoal Mastery',
    description: 'Deep dive into charcoal drawing — from basic strokes to professional portraits. Includes reference photos, exercises, and exclusive video links.',
    pages: '98 pages',
    format: 'PDF + Video',
    price: '₦12,000',
    level: 'All Levels',
    icon: Layers,
  },
  {
    id: 'drawing-fundamentals',
    title: 'Drawing Fundamentals',
    description: 'The perfect starting point for complete beginners. Learn line, form, value, and perspective through clear instructions and practice worksheets.',
    pages: '85 pages',
    format: 'PDF',
    price: '₦8,000',
    level: 'Beginner',
    icon: FileText,
  },
  {
    id: 'portrait-pro',
    title: 'Portrait Pro: Anatomy for Artists',
    description: 'Master facial anatomy, expressions, and proportions. Essential reference for anyone serious about portrait drawing.',
    pages: '150 pages',
    format: 'PDF',
    price: '₦18,000',
    level: 'Advanced',
    icon: Layers,
  },
];

export default function ClassesPage() {
  const [activeTab, setActiveTab] = useState('classes');

  return (
    <div className="min-h-screen bg-brand-surface">
      {/* Hero */}
      <section className="relative w-full bg-brand-surface pt-40 pb-24 md:pb-32 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-20" style={{ backgroundImage: 'var(--bg-noise)' }} />
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_left,transparent_40%,rgba(0,0,0,0.02)_100%)]" />

        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl"
          >
            <span className="font-sans text-[11px] tracking-[0.2em] uppercase text-brand-gold block mb-6">
              Art Education
            </span>
            <h1 className="font-display text-text-h1 text-brand-black leading-tight mb-8">
              Learn the Art of <br />
              <span className="text-brand-gold italic">Hyper-Realism</span>
            </h1>
            <p className="font-sans text-brand-gray text-text-body max-w-2xl leading-relaxed">
              Whether you are picking up a pencil for the first time or refining your technique, 
              my classes and e-books are designed to meet you where you are.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tabs */}
      <section className="relative w-full bg-brand-surface px-6 pb-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex gap-1 p-1 border border-brand-border rounded-[10px] bg-brand-white/50 w-fit">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-[8px] font-sans text-[10px] tracking-[0.15em] uppercase transition-all duration-500 cursor-pointer ${
                    activeTab === tab.value
                      ? 'bg-brand-black text-brand-white shadow-sm'
                      : 'text-brand-gray hover:text-brand-black'
                  }`}
                >
                  <Icon size={15} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="relative w-full bg-brand-surface py-12 md:py-16 px-6 overflow-hidden border-t border-brand-border">
        <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-20" style={{ backgroundImage: 'var(--bg-noise)' }} />

        <div className="max-w-[1400px] mx-auto">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {activeTab === 'classes' && (
              <div className="flex flex-wrap justify-center gap-8">
                {CLASSES.map((cls, i) => (
                  <motion.div
                    key={cls.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.8, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    className="group w-full md:w-[calc((100%-2rem)/2)] lg:w-[calc((100%-4rem)/3)]"
                  >
                    <div className="p-8 border border-brand-border rounded-[8px] bg-brand-white/50 hover:border-brand-gold/30 hover:shadow-[0_0_30px_rgba(158,101,27,0.06)] transition-all duration-500 h-full flex flex-col">
                      <div className="w-12 h-12 rounded-full border border-brand-gold/30 bg-brand-white flex items-center justify-center mb-6 group-hover:border-brand-gold/70 transition-colors duration-500">
                        <GraduationCap size={20} className="text-brand-gold" />
                      </div>

                      <div className="flex items-start justify-between mb-4">
                        <h3 className="font-display text-xl text-brand-black">{cls.title}</h3>
                        <span className="font-display text-lg text-brand-gold whitespace-nowrap ml-4">{cls.price}</span>
                      </div>

                      <p className="font-sans text-sm text-brand-gray leading-relaxed mb-6 flex-1">
                        {cls.description}
                      </p>

                      <div className="space-y-2.5 mb-6">
                        <div className="flex items-center gap-2 text-brand-gray/60">
                          <Clock size={12} />
                          <span className="font-sans text-xs">{cls.duration}</span>
                        </div>
                        <div className="flex items-center gap-2 text-brand-gray/60">
                          <Users size={12} />
                          <span className="font-sans text-xs">{cls.seats} seats available</span>
                        </div>
                        <div className="flex items-center gap-2 text-brand-gray/60">
                          <MapPin size={12} />
                          <span className="font-sans text-xs">{cls.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-brand-gray/60">
                          <Star size={12} />
                          <span className="font-sans text-xs">{cls.level}</span>
                        </div>
                      </div>

                      <Link
                        href={`/classes/${cls.id}`}
                        className="flex items-center justify-center gap-2 w-full py-3 border border-brand-black/20 hover:border-brand-black rounded-[6px] font-sans text-[10px] tracking-[0.2em] uppercase text-brand-black hover:bg-brand-black hover:text-brand-white transition-all duration-500"
                      >
                        Book Now
                        <ArrowRight size={12} />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === 'courses' && (
              <div className="flex flex-wrap justify-center gap-8">
                {EBOOKS.map((book, i) => {
                  const Icon = book.icon;
                  return (
                    <motion.div
                      key={book.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-50px' }}
                      transition={{ duration: 0.8, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                      className="group w-full md:w-[calc((100%-2rem)/2)] lg:w-[calc((100%-4rem)/3)]"
                    >
                      <div className="p-8 border border-brand-border rounded-[8px] bg-brand-white/50 hover:border-brand-gold/30 hover:shadow-[0_0_30px_rgba(158,101,27,0.06)] transition-all duration-500 h-full flex flex-col">
                        <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center mb-6">
                          <Icon size={20} className="text-brand-gold" />
                        </div>

                        <div className="flex items-start justify-between mb-4">
                          <h3 className="font-display text-xl text-brand-black">{book.title}</h3>
                          <span className="font-display text-lg text-brand-gold whitespace-nowrap ml-4">{book.price}</span>
                        </div>

                        <p className="font-sans text-sm text-brand-gray leading-relaxed mb-6 flex-1">
                          {book.description}
                        </p>

                        <div className="space-y-2.5 mb-6">
                          <div className="flex items-center gap-2 text-brand-gray/60">
                            <FileText size={12} />
                            <span className="font-sans text-xs">{book.pages}</span>
                          </div>
                          <div className="flex items-center gap-2 text-brand-gray/60">
                            <Download size={12} />
                            <span className="font-sans text-xs">{book.format}</span>
                          </div>
                          <div className="flex items-center gap-2 text-brand-gray/60">
                            <Star size={12} />
                            <span className="font-sans text-xs">{book.level}</span>
                          </div>
                        </div>

                        <button className="flex items-center justify-center gap-2 w-full py-3 bg-brand-black text-brand-white border border-brand-gold rounded-[6px] font-sans text-[10px] tracking-[0.2em] uppercase transition-all duration-500 hover:shadow-[0_0_30px_rgba(158,101,27,0.15)] group/btn">
                          <span className="relative z-10 flex items-center gap-2 group-hover/btn:text-brand-black transition-colors duration-[400ms]">
                            Buy Now
                            <ArrowRight size={12} />
                          </span>
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
