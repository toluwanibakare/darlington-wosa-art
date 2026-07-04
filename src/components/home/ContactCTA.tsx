"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui';
import { MapPin, Phone, Mail, Clock, ArrowRight } from 'lucide-react';

const CONTACT_INFO = [
  { icon: MapPin, label: 'Studio Location', value: 'Rivers State, Nigeria' },
  { icon: Phone, label: 'Phone', value: '+234 813 774 4824' },
  { icon: 'whatsapp', label: 'WhatsApp', value: '+234 813 774 4824' },
  { icon: Mail, label: 'Email', value: 'hello@darlingtonwosa.art' },
  { icon: Clock, label: 'Studio Hours', value: 'Mon–Sat, 9:00 AM – 6:00 PM' },
];

export function ContactCTA() {
  return (
    <section className="relative w-full bg-brand-surface py-32 md:py-40 px-6 overflow-hidden border-t border-brand-border">
      <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-20" style={{ backgroundImage: 'var(--bg-noise)' }} />

      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left — CTA Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="font-sans text-[11px] tracking-[0.2em] uppercase text-brand-gold block mb-6">
              Start Your Project
            </span>
            <h2 className="font-display text-text-h2 text-brand-black leading-tight mb-8">
              Ready to Create <br />
              <span className="text-brand-gold italic">Something Beautiful?</span>
            </h2>
            <p className="font-sans text-brand-gray text-text-body max-w-lg mb-10">
              Whether you have a clear vision or need guidance exploring possibilities, 
              I am here to help you transform your ideas into heirloom-quality artwork 
              that will be cherished for generations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="primary">
                Start Your Project
                <ArrowRight size={14} className="ml-2 inline-block" />
              </Button>
              <Button variant="secondary">
                View Portfolio
              </Button>
            </div>
          </motion.div>

          {/* Right — Contact Details */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-10"
          >
            <div className="p-8 md:p-10 border border-brand-border rounded-[8px] bg-brand-white/50">
              <div className="space-y-8">
                {CONTACT_INFO.map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full border border-brand-border bg-brand-surface flex items-center justify-center flex-shrink-0">
                      {item.icon === 'whatsapp' ? (
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className="text-brand-gold">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                      ) : (
                        <item.icon size={16} className="text-brand-gold" />
                      )}
                    </div>
                    <div>
                      <p className="font-sans text-xs uppercase tracking-wider text-brand-gray/70 mb-1">
                        {item.label}
                      </p>
                      <p className="font-sans text-sm text-brand-black">
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="font-sans text-xs text-brand-gray/60 text-center">
              Responses within 24 hours. Weekend inquiries answered on Monday.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
