"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Download, Clock, CheckCircle, Package, Palette, Shield, Truck, Home } from 'lucide-react';

const ORDER_TIMELINE = [
  { label: 'Order Placed', date: 'Mar 12, 2026', time: '2:30 PM', completed: true, icon: Package },
  { label: 'Payment Confirmed', date: 'Mar 12, 2026', time: '2:32 PM', completed: true, icon: CheckCircle },
  { label: 'Design Review', date: 'Mar 14, 2026', time: '10:00 AM', completed: true, icon: Palette },
  { label: 'Production Started', date: 'Mar 16, 2026', time: '—', completed: true, icon: Shield },
  { label: 'Framing in Progress', date: '—', time: '—', completed: false, icon: Shield },
  { label: 'Quality Check', date: '—', time: '—', completed: false, icon: Shield },
  { label: 'Ready for Pickup / Shipment', date: '—', time: '—', completed: false, icon: Truck },
  { label: 'Delivered', date: '—', time: '—', completed: false, icon: Home },
];

export default function OrderDetailPage() {
  return (
    <div className="p-6 md:p-10 max-w-[1200px]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Back link */}
        <Link href="/dashboard/orders" className="inline-flex items-center gap-2 text-brand-gray/60 hover:text-brand-gold font-sans text-[10px] tracking-[0.15em] uppercase mb-8 transition-colors">
          <ArrowLeft size={12} />
          Back to Orders
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="font-display text-3xl md:text-4xl text-brand-black mb-2">
              Charcoal Portrait - &ldquo;The Visionary&rdquo;
            </h1>
            <div className="flex flex-wrap items-center gap-4">
              <span className="font-sans text-[10px] tracking-[0.1em] uppercase text-brand-gray/50">#DWAF-2024-001</span>
              <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 font-sans text-[9px] tracking-[0.1em] uppercase">
                In Production
              </span>
              <span className="flex items-center gap-1.5 font-sans text-[10px] text-brand-gray/60">
                <Clock size={10} />
                Estimated completion: Apr 10, 2026
              </span>
            </div>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 border border-brand-border rounded-full font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray hover:text-brand-gold hover:border-brand-gold/30 transition-all duration-300 cursor-pointer">
            <Download size={12} />
            Download Invoice
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <h2 className="font-display text-xl text-brand-black mb-8">Order Timeline</h2>
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[19px] top-0 bottom-0 w-[1px] bg-brand-border" />

              <div className="space-y-0">
                {ORDER_TIMELINE.map((step, i) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.label} className="relative flex gap-6 pb-10 last:pb-0">
                      {/* Dot */}
                      <div className={`relative z-10 w-[38px] h-[38px] rounded-full flex items-center justify-center flex-shrink-0 ${
                        step.completed
                          ? 'bg-brand-gold text-white'
                          : 'bg-brand-surface border border-brand-border text-brand-gray/40'
                      }`}>
                        <Icon size={16} />
                      </div>

                      {/* Content */}
                      <div className="pt-2">
                        <p className={`font-display text-base ${step.completed ? 'text-brand-black' : 'text-brand-gray/50'}`}>
                          {step.label}
                        </p>
                        {step.completed && (
                          <p className="font-sans text-xs text-brand-gray/60 mt-1">
                            {step.date} at {step.time}
                          </p>
                        )}
                        {!step.completed && (
                          <p className="font-sans text-xs text-brand-gray/30 mt-1">Pending</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Order Details */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-6"
          >
            <div className="p-6 border border-brand-border rounded-[8px] bg-brand-white/50">
              <h3 className="font-display text-base text-brand-black mb-5">Order Details</h3>
              <div className="space-y-4">
                {[
                  { label: 'Order ID', value: '#DWAF-2024-001' },
                  { label: 'Type', value: 'Charcoal Portrait' },
                  { label: 'Size', value: '24 x 36 inches' },
                  { label: 'Medium', value: 'Charcoal on Paper' },
                  { label: 'Framing', value: 'Museum-Grade Frame' },
                  { label: 'Order Date', value: 'Mar 12, 2026' },
                  { label: 'Total', value: '₦250,000' },
                ].map((detail) => (
                  <div key={detail.label} className="flex justify-between items-center">
                    <span className="font-sans text-[10px] tracking-[0.1em] uppercase text-brand-gray/70">{detail.label}</span>
                    <span className="font-sans text-xs text-brand-black text-right">{detail.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment info */}
            <div className="p-6 border border-brand-border rounded-[8px] bg-brand-white/50">
              <h3 className="font-display text-base text-brand-black mb-4">Payment</h3>
              <div className="flex items-center justify-between mb-2">
                <span className="font-sans text-[10px] tracking-[0.1em] uppercase text-green-600 flex items-center gap-1.5">
                  <CheckCircle size={12} />
                  Paid
                </span>
                <span className="font-display text-sm text-brand-black">₦250,000</span>
              </div>
              <p className="font-sans text-[10px] text-brand-gray/50">Paid via Korapay on Mar 12, 2026</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
