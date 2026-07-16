"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { BookOpen, Calendar, Clock, MapPin, User, Plus, ArrowRight, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

interface BookingClass {
  title?: string;
  instructor?: string;
  duration?: string;
  price?: string | number;
}

interface Booking {
  id: number;
  booking_number: string;
  status: string;
  created_at: string;
  class?: BookingClass;
}

interface BookingsResponse {
  bookings: Booking[];
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}

function formatPrice(price: string | number | undefined): string {
  if (!price) return 'N/A';
  const num = typeof price === 'string' ? parseFloat(price) : price;
  return `\u20A6${num.toLocaleString('en-US')}`;
}

const STATUS_BADGES: Record<string, string> = {
  confirmed: 'bg-green-500/10 text-green-600',
  completed: 'bg-brand-border text-brand-gray',
  cancelled: 'bg-red-500/10 text-red-600',
  pending: 'bg-amber-500/10 text-amber-600',
};

const STATUS_LABELS: Record<string, string> = {
  confirmed: 'Confirmed',
  completed: 'Completed',
  cancelled: 'Cancelled',
  pending: 'Pending',
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api.get<BookingsResponse>('/bookings').then((res) => {
      if (cancelled) return;
      if (res.error) {
        setError(res.error);
      } else {
        setBookings(res.data?.bookings ?? []);
      }
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  const statuses = ['all', ...new Set(bookings.map((b) => b.status))];

  const filtered = filter === 'all'
    ? bookings
    : bookings.filter((b) => b.status === filter);

  if (loading) {
    return (
      <div className="p-6 md:p-10 flex items-center justify-center min-h-[400px]">
        <Loader2 size={24} className="animate-spin text-brand-gold" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 md:p-10">
        <p className="font-sans text-sm text-red-600">{error}</p>
      </div>
    );
  }

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

        <div className="flex flex-wrap gap-2 mb-8">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`font-sans text-[10px] tracking-[0.15em] uppercase px-5 py-2.5 rounded-full border transition-all duration-500 cursor-pointer ${
                filter === s
                  ? 'bg-brand-black text-brand-white border-brand-black'
                  : 'bg-transparent text-brand-gray border-brand-border hover:border-brand-gray/40 hover:text-brand-black'
              }`}
            >
              {s === 'all' ? 'All' : STATUS_LABELS[s] || s}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filtered.map((booking, i) => (
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
                    <p className="font-display text-base text-brand-black">
                      {booking.class?.title || 'General Booking'}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-brand-gray/60">
                    <span className="flex items-center gap-1.5 font-sans text-[11px]">
                      <Calendar size={11} />
                      {formatDate(booking.created_at)}
                    </span>
                    <span className="flex items-center gap-1.5 font-sans text-[11px]">
                      <Clock size={11} />
                      {booking.class?.duration || 'N/A'}
                    </span>
                    <span className="flex items-center gap-1.5 font-sans text-[11px]">
                      <User size={11} />
                      {booking.class?.instructor || 'Instructor'}
                    </span>
                    <span className="flex items-center gap-1.5 font-sans text-[11px]">
                      <MapPin size={11} />
                      Ref: {booking.booking_number}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-right">
                    <p className="font-display text-sm text-brand-black">{formatPrice(booking.class?.price)}</p>
                    <span className={`inline-block mt-1 px-3 py-1 rounded-full font-sans text-[9px] tracking-[0.1em] uppercase ${STATUS_BADGES[booking.status] || 'bg-brand-border text-brand-gray'}`}>
                      {STATUS_LABELS[booking.status] || booking.status}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
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
