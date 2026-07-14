"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Check, Loader2, MapPin, Calendar, Phone, Mail, User, Award } from 'lucide-react';

export default function ProfilePage() {
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState({
    fullName: 'Darlington Wosa',
    email: 'darlington@example.com',
    phone: '+234 813 774 4824',
    dateOfBirth: '1990-06-15',
    address: '42 Artisan Street, Port Harcourt',
    city: 'Rivers State',
    country: 'Nigeria',
    bio: 'Art enthusiast and collector.',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  const inputClass = "w-full bg-transparent border-b border-brand-border pb-3 pt-1 text-sm text-brand-black placeholder:text-brand-gray/40 focus:outline-none focus:border-brand-gold transition-colors font-sans";
  const labelClass = "font-sans text-[11px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-3";

  return (
    <div className="p-6 md:p-10 max-w-[1000px]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 className="font-display text-3xl md:text-4xl text-brand-black mb-2">Profile</h1>
        <p className="font-sans text-sm text-brand-gray mb-10">Manage your personal information and preferences.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Avatar Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="p-6 border border-brand-border rounded-[8px] bg-brand-white/50 text-center sticky top-28">
              <div className="relative w-24 h-24 rounded-full bg-brand-gold/10 flex items-center justify-center mx-auto mb-5 group cursor-pointer">
                <User size={36} className="text-brand-gold/60" />
                <div className="absolute inset-0 rounded-full bg-black/0 hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                  <Camera size={18} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <p className="font-display text-lg text-brand-black">{profile.fullName}</p>
              <p className="font-sans text-xs text-brand-gray/60 mt-1">Member since 2024</p>

              <div className="mt-6 pt-6 border-t border-brand-border">
                <div className="flex items-center justify-center gap-2 text-brand-gold">
                  <Award size={14} />
                  <span className="font-sans text-[10px] tracking-[0.15em] uppercase">Referral Code: DWAF10382</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <motion.form
              onSubmit={handleSave}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="p-8 border border-brand-border rounded-[8px] bg-brand-white/50 space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className={labelClass}>Full Name</label>
                  <input type="text" value={profile.fullName} onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Email Address</label>
                  <input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className={labelClass}>Phone Number</label>
                  <input type="tel" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Date of Birth</label>
                  <input type="date" value={profile.dateOfBirth} onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })} className={inputClass} />
                </div>
              </div>

              <div>
                <label className={labelClass}>Delivery Address</label>
                <input type="text" value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} className={inputClass} placeholder="Street address" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className={labelClass}>City / State</label>
                  <input type="text" value={profile.city} onChange={(e) => setProfile({ ...profile, city: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Country</label>
                  <input type="text" value={profile.country} onChange={(e) => setProfile({ ...profile, country: e.target.value })} className={inputClass} />
                </div>
              </div>

              <div>
                <label className={labelClass}>Bio (Optional)</label>
                <textarea
                  rows={3}
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  className="w-full bg-transparent border-b border-brand-border pb-3 pt-1 text-sm text-brand-black placeholder:text-brand-gray/40 focus:outline-none focus:border-brand-gold transition-colors font-sans resize-none"
                />
              </div>

              <div className="pt-4 flex items-center gap-4">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="relative overflow-hidden px-8 py-4 bg-brand-black text-brand-white border border-brand-gold rounded-[6px] font-sans text-[11px] tracking-[0.2em] uppercase transition-all duration-500 hover:shadow-[0_0_30px_rgba(158,101,27,0.15)] cursor-pointer disabled:opacity-60 group"
                >
                  <span className="absolute inset-0 bg-brand-gold transform -translate-x-full group-hover:translate-x-0 transition-transform duration-[400ms] ease-[var(--ease-expo-out)]" />
                  <span className="relative z-10 flex items-center gap-2 group-hover:text-brand-black transition-colors duration-[400ms]">
                    {isSaving ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      'Save Changes'
                    )}
                  </span>
                </button>

                {saved && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 font-sans text-xs text-green-600"
                  >
                    <Check size={14} />
                    Saved successfully
                  </motion.span>
                )}
              </div>
            </motion.form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
