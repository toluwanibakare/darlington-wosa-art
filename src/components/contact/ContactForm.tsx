"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui';
import { Send, Check } from 'lucide-react';

const SERVICE_OPTIONS = [
  { value: '', label: 'Select a service...' },
  { value: 'charcoal-portraits', label: 'Charcoal Portrait' },
  { value: 'pencil-drawings', label: 'Pencil Drawing' },
  { value: 'custom-artwork', label: 'Custom Artwork' },
  { value: 'framing-services', label: 'Framing Service' },
  { value: 'corporate-art', label: 'Corporate Art Solution' },
  { value: 'interior-installations', label: 'Interior Art Installation' },
  { value: 'custom-design', label: 'Custom Design Project' },
  { value: 'other', label: 'Other / Not Sure' },
];

const BUDGET_OPTIONS = [
  { value: '', label: 'Select a range...' },
  { value: 'under-100k', label: 'Under ₦100,000' },
  { value: '100k-300k', label: '₦100,000 – ₦300,000' },
  { value: '300k-500k', label: '₦300,000 – ₦500,000' },
  { value: '500k-1m', label: '₦500,000 – ₦1,000,000' },
  { value: 'above-1m', label: 'Above ₦1,000,000' },
  { value: 'not-sure', label: 'Not Sure Yet' },
];

const TIMELINE_OPTIONS = [
  { value: '', label: 'Select a timeline...' },
  { value: 'urgent', label: 'Urgent (Within 1 week)' },
  { value: 'standard', label: 'Standard (2–4 weeks)' },
  { value: 'relaxed', label: 'Relaxed (1–3 months)' },
  { value: 'planning', label: 'Just Planning / No Rush' },
];

type FormData = {
  name: string;
  email: string;
  phone: string;
  service: string;
  budget: string;
  timeline: string;
  message: string;
};

export function ContactForm() {
  const searchParams = useSearchParams();
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    service: '',
    budget: '',
    timeline: '',
    message: '',
  });

  useEffect(() => {
    const serviceParam = searchParams.get('service');
    if (serviceParam) {
      const match = SERVICE_OPTIONS.find(
        (opt) => opt.value === serviceParam
      );
      if (match) {
        setForm((prev) => ({ ...prev, service: serviceParam }));
      }
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputClass = "w-full bg-transparent border-b border-brand-border pb-2.5 pt-1 text-sm text-brand-black placeholder:text-brand-gray/40 focus:outline-none focus:border-brand-gold transition-colors font-sans";
  const labelClass = "font-sans text-[11px] tracking-[0.15em] uppercase text-brand-gray/70";
  const selectClass = "w-full bg-transparent border-b border-brand-border pb-2.5 pt-1 text-sm text-brand-black focus:outline-none focus:border-brand-gold transition-colors font-sans cursor-pointer appearance-none";

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-12 md:p-16 border border-brand-border rounded-[8px] bg-brand-white/50 text-center"
      >
        <div className="w-14 h-14 rounded-full bg-brand-gold/10 flex items-center justify-center mx-auto mb-6">
          <Check size={24} className="text-brand-gold" />
        </div>
        <h3 className="font-display text-2xl text-brand-black mb-4">
          Thank You
        </h3>
        <p className="font-sans text-brand-gray text-sm max-w-md mx-auto leading-relaxed">
          Your inquiry has been received. I will review the details and reach out 
          to you within 24 hours to discuss your project.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      onSubmit={handleSubmit}
      className="p-8 md:p-12 border border-brand-border rounded-[8px] bg-brand-white/50 space-y-8"
    >
      {/* Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label htmlFor="name" className={labelClass}>Full Name</label>
          <input id="name" name="name" type="text" required value={form.name} onChange={handleChange} className={inputClass} placeholder="Your name" />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>Email Address</label>
          <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} className={inputClass} placeholder="your@email.com" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label htmlFor="phone" className={labelClass}>Phone Number</label>
          <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} className={inputClass} placeholder="+234 800 000 0000" />
        </div>
        <div>
          <label htmlFor="service" className={labelClass}>Service Interested In</label>
          <select id="service" name="service" value={form.service} onChange={handleChange} className={selectClass}>
            {SERVICE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label htmlFor="budget" className={labelClass}>Budget Range</label>
          <select id="budget" name="budget" value={form.budget} onChange={handleChange} className={selectClass}>
            {BUDGET_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="timeline" className={labelClass}>Preferred Timeline</label>
          <select id="timeline" name="timeline" value={form.timeline} onChange={handleChange} className={selectClass}>
            {TIMELINE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>Project Details</label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          value={form.message}
          onChange={handleChange}
          className={`${inputClass} resize-none`}
          placeholder="Tell me about your project - medium, size, reference ideas, deadline, or anything else I should know..."
        />
      </div>

      <div className="pt-4">
        <Button variant="primary" type="submit">
          Send Inquiry
          <Send size={14} className="ml-2 inline-block" />
        </Button>
      </div>
    </motion.form>
  );
}
