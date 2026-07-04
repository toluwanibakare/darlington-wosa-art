import React from 'react';
import { ContactHero } from '@/components/contact/ContactHero';
import { ContactForm } from '@/components/contact/ContactForm';
import { ContactFAQ } from '@/components/contact/ContactFAQ';
export default function ContactPage() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-brand-surface text-brand-black">
      <ContactHero />
      <section className="relative w-full bg-brand-surface py-24 md:py-32 px-6 overflow-hidden">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-5 gap-16 lg:gap-20">
          <div className="lg:col-span-3">
            <ContactForm />
          </div>
          <div className="lg:col-span-2">
            <ContactDetails />
          </div>
        </div>
      </section>
      <ContactFAQ />
    </div>
  );
}

function ContactDetails() {
  return (
    <div className="space-y-10 lg:pt-8">
      <div>
        <h3 className="font-sans text-[11px] tracking-[0.2em] uppercase text-brand-gold mb-8">
          Contact Information
        </h3>
        <div className="space-y-6">
          <div>
            <p className="font-sans text-xs uppercase tracking-wider text-brand-gray/70 mb-1">Studio Location</p>
            <p className="font-sans text-sm text-brand-black">Rivers State, Nigeria</p>
          </div>
          <div>
            <p className="font-sans text-xs uppercase tracking-wider text-brand-gray/70 mb-1">Phone & WhatsApp</p>
            <a href="tel:+2348137744824" className="font-sans text-sm text-brand-black hover:text-brand-gold transition-colors duration-300 block">
              +234 813 774 4824
            </a>
          </div>
          <div>
            <p className="font-sans text-xs uppercase tracking-wider text-brand-gray/70 mb-1">Email</p>
            <a href="mailto:hello@darlingtonwosa.art" className="font-sans text-sm text-brand-black hover:text-brand-gold transition-colors duration-300 block">
              hello@darlingtonwosa.art
            </a>
          </div>
          <div>
            <p className="font-sans text-xs uppercase tracking-wider text-brand-gray/70 mb-1">Studio Hours</p>
            <p className="font-sans text-sm text-brand-black">Mon-Sat, 9:00 AM - 6:00 PM</p>
          </div>
        </div>
      </div>

      <div className="p-6 border border-brand-border rounded-[8px] bg-brand-white/50">
        <h4 className="font-sans text-[11px] tracking-[0.15em] uppercase text-brand-black mb-3">
          Response Time
        </h4>
        <p className="font-sans text-sm text-brand-gray leading-relaxed">
          I typically respond within 24 hours on weekdays. 
          Weekend inquiries are answered on Monday. For urgent 
          requests, please indicate so in your message.
        </p>
      </div>
    </div>
  );
}
