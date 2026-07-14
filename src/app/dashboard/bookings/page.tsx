"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { BookOpen, Calendar, Clock, MapPin, User, Plus, ArrowRight, CheckCircle, XCircle } from 'lucide-react';

const MY_BOOKINGS = [
  { id: 'BK-001', class: 'Private Art Class', date: 'Mar 25, 2026', time: '10:00 AM - 12:00 PM', instructor: 'Darlington Wosa', location: 'Online', status: 'Confirmed', price: '₦25,000' },
  { id: 'BK-002', class: 'Beginner Workshop', date: 'Apr 02, 2026', time: '2:00 PM - 4:00 PM', instructor: 'Darlington Wosa', location: 'Studio, Rivers State', status: 'Confirmed', price: '₦15,000' },
  { id: 'BK-003', class: 'Monthly Package (March)', date: 'Mar 01, 2026', time: 'Various', instructor: 'Darlington Wosa', location: 'Online', status: 'Completed', price: '₦80,000' },
];

const STATUS_BADGES: Record<string, string> = {
  'Confirmed': 'bg-green-500/10 text-green-600',
  'Completed': 'bg-brand-border text-brand-gray',
  'Cancelled': 'bg-red-500/10 text-red-600',
};

export default function BookingsPage() {
  return (
    <div className="p-6 md:p-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="font-display text-3xl md:text-4xl text-brand-black mb-2">My Bookings</h1>
            <p className="font-sans text-sm text-brand-gray">Manage your art class bookings and schedule.</p>
          </div>
          <Link
            href="/classes"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-black text-brand-white border border-brand-gold rounded-[6px] font-sans text-[10px] tracking-[0.2em] uppercase transition-all duration-500 hover:shadow-[0_0_30px_rgba(158,101,27,0.15)] group"
          >
            <span className="relative z-10 flex items-center gap-2 group-hover:text-brand-black transition-colors duration-[400ms]">
              <Plus size={14} />
              Book a Class
            </span>
          </Link>
        </div>

        <div className="space-y-4">
          {MY_BOOKINGS.map((booking, i) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="p-6 border border-brand-border rounded-[8px] bg-brand-white/50 hover:border-brand-gold/20 transition-all duration-500"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <BookOpen size={14} className="text-brand-gold/60" />
                    <p className="font-display text-base text-brand-black">{booking.class}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-brand-gray/60">
                    <span className="flex items-center gap-1.5 font-sans text-[11px]">
                      <Calendar size={11} />
                      {booking.date}
                    </span>
                    <span className="flex items-center gap-1.5 font-sans text-[11px]">
                      <Clock size={11} />
                      {booking.time}
                    </span>
                    <span className="flex items-center gap-1.5 font-sans text-[11px]">
                      <User size={11} />
                      {booking.instructor}
                    </span>
                    <span className="flex items-center gap-1.5 font-sans text-[11px]">
                      <MapPin size={11} />
                      {booking.location}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-right">
                    <p className="font-display text-sm text-brand-black">{booking.price}</p>
                    <span className={`inline-block mt-1 px-3 py-1 rounded-full font-sans text-[9px] tracking-[0.1em] uppercase ${STATUS_BADGES[booking.status] || 'bg-brand-border text-brand-gray'}`}>
                      {booking.status}
                    </span>
                  </div>
                  {booking.status === 'Confirmed' && (
                    <button className="flex items-center gap-1 px-4 py-2 border border-red-200 rounded-[6px] font-sans text-[9px] tracking-[0.1em] uppercase text-red-500 hover:bg-red-50 transition-colors cursor-pointer">
                      <XCircle size={11} />
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {MY_BOOKINGS.length === 0 && (
          <div className="text-center py-20">
            <BookOpen size={32} className="text-brand-gray/20 mx-auto mb-4" />
            <p className="font-sans text-sm text-brand-gray/50">No bookings yet.</p>
            <Link href="/classes" className="inline-flex items-center gap-2 mt-6 text-brand-gold font-sans text-xs tracking-[0.15em] uppercase hover:text-brand-gold-light transition-colors">
              Browse Classes
              <ArrowRight size={12} />
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}
