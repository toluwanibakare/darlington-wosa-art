"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Clock, Users, MapPin, Star, ArrowRight, GraduationCap, BookOpen, Download, FileText, Layers, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

const TABS = [
  { label: 'Live Classes', value: 'classes', icon: GraduationCap },
  { label: 'E-Books', value: 'courses', icon: BookOpen },
];

export default function ClassesPage() {
  const [activeTab, setActiveTab] = useState('classes');
  const [classesList, setClassesList] = useState<any[]>([]);
  const [ebooksList, setEbooksList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch dynamic classes from backend API
    api.get('/classes')
      .then((res: any) => {
        // api wrapper returns object with data field containing API body
        const payload = res.data;
        const items = payload?.data || payload || [];
        setClassesList(Array.isArray(items) ? items : []);
        setLoading(false);
      })
      .catch(() => {
        setClassesList([]);
        setLoading(false);
      });
  }, []);

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
          <div className="flex gap-1 p-1 border border-brand-border rounded-[10px] bg-brand-white/50 w-fit overflow-x-auto">
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
            {loading ? (
              <div className="flex justify-center py-20"><Loader2 size={24} className="animate-spin text-brand-gold" /></div>
            ) : activeTab === 'classes' && (
              classesList.length === 0 ? (
                <p className="font-sans text-brand-gray text-center py-20">No classes scheduled yet. Check back later.</p>
              ) : (
                <div className="flex flex-wrap justify-center gap-8">
                  {classesList.map((cls, i) => (
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
                          <span className="font-display text-lg text-brand-gold whitespace-nowrap ml-4">₦{Number(cls.price).toLocaleString()}</span>
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
                            <span className="font-sans text-xs">{cls.max_students} seats available</span>
                          </div>
                          <div className="flex items-center gap-2 text-brand-gray/60">
                            <MapPin size={12} />
                            <span className="font-sans text-xs">{cls.schedule || 'Studio / Online'}</span>
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
              )
            )}

            {!loading && activeTab === 'courses' && (
              ebooksList.length === 0 ? (
                <p className="font-sans text-brand-gray text-center py-20">No e-books available yet. Check back later.</p>
              ) : (
                <div className="flex flex-wrap justify-center gap-8">
                  {ebooksList.map((book, i) => {
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
                            <Layers size={20} className="text-brand-gold" />
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
                              <span className="font-sans text-xs">{book.pages || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-brand-gray/60">
                              <Download size={12} />
                              <span className="font-sans text-xs">{book.format || 'PDF'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-brand-gray/60">
                              <Star size={12} />
                              <span className="font-sans text-xs">{book.level || 'All Levels'}</span>
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
              )
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
