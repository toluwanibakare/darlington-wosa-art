"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Video,
  Upload,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  Film,
  Award,
  DollarSign,
} from 'lucide-react';

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] as const },
});

const VIDEO_STATS = [
  { label: 'Submitted', value: '3', icon: Upload, color: 'text-brand-gold', bg: 'bg-brand-gold/5' },
  { label: 'Approved', value: '2', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-500/5' },
  { label: 'Pending Review', value: '1', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-500/5' },
  { label: 'Total Earned', value: '₦3,500', icon: DollarSign, color: 'text-brand-gold', bg: 'bg-brand-gold/5' },
];

const SUBMISSIONS = [
  { title: 'Unboxing - "The Visionary"', order: '#DWAF-2024-001', date: 'Mar 10, 2026', status: 'approved', reward: '₦2,000', type: 'Cashback' },
  { title: 'Studio Tour & Testimonial', order: '#DWAF-2024-002', date: 'Feb 28, 2026', status: 'approved', reward: '₦1,500', type: 'Cashback' },
  { title: 'Installation at Office Space', order: '#DWAF-2024-003', date: 'Mar 15, 2026', status: 'pending', reward: '—', type: 'Pending' },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  approved: { label: 'Approved', color: 'bg-green-500/10 text-green-600', icon: CheckCircle },
  pending: { label: 'Pending Review', color: 'bg-amber-500/10 text-amber-600', icon: Clock },
  rejected: { label: 'Rejected', color: 'bg-red-500/10 text-red-600', icon: XCircle },
};

export default function VideoRewardsPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [form, setForm] = useState({ orderId: '', description: '' });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setIsSubmitted(true);
    }, 2000);
  };

  return (
    <div className="p-6 md:p-10 max-w-[1000px]">
      <motion.div {...fadeUp(0)}>
        <h1 className="font-display text-3xl md:text-4xl text-brand-black mb-2">Video Rewards</h1>
        <p className="font-sans text-sm text-brand-gray mb-10">Submit videos and earn cashback rewards.</p>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
          {VIDEO_STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              {...fadeUp(0.1 + i * 0.05)}
              className="p-6 border border-brand-border rounded-[8px] bg-brand-white/50 hover:border-brand-gold/20 transition-all duration-500 group"
            >
              <div className={`w-10 h-10 rounded-full ${stat.bg} flex items-center justify-center mb-4`}>
                <stat.icon size={18} className={stat.color} />
              </div>
              <p className="font-display text-2xl md:text-3xl text-brand-black mb-1">{stat.value}</p>
              <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Submission Form */}
          <motion.div {...fadeUp(0.25)} className="lg:col-span-3">
            <div className="p-6 md:p-8 border border-brand-border rounded-[8px] bg-brand-white/50">
              <h2 className="font-display text-lg text-brand-black mb-6">Submit a Video</h2>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-14 h-14 rounded-full bg-brand-gold/10 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={24} className="text-brand-gold" />
                  </div>
                  <p className="font-display text-lg text-brand-black mb-2">Video Submitted</p>
                  <p className="font-sans text-sm text-brand-gray/60 max-w-sm mx-auto">
                    Your video is under review. You will be notified once it is approved.
                  </p>
                  <button
                    onClick={() => { setIsSubmitted(false); setSelectedFile(null); setForm({ orderId: '', description: '' }); }}
                    className="mt-6 font-sans text-xs text-brand-gold hover:text-brand-gold-light transition-colors underline underline-offset-4 cursor-pointer"
                  >
                    Submit another video
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Upload Area */}
                  <div>
                    <label className="font-sans text-[11px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-3">
                      Video File
                    </label>
                    <label className={`flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-[8px] cursor-pointer transition-all duration-300 ${
                      selectedFile ? 'border-brand-gold/40 bg-brand-gold/[0.02]' : 'border-brand-border hover:border-brand-gold/30 hover:bg-brand-gold/[0.01]'
                    }`}>
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center">
                          {selectedFile ? <Film size={20} className="text-brand-gold" /> : <Upload size={20} className="text-brand-gold" />}
                        </div>
                        {selectedFile ? (
                          <div className="text-center">
                            <p className="font-sans text-sm text-brand-black">{selectedFile.name}</p>
                            <p className="font-sans text-[10px] text-brand-gray/50 mt-1">
                              {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB
                            </p>
                          </div>
                        ) : (
                          <div className="text-center">
                            <p className="font-sans text-sm text-brand-black">Click to upload or drag and drop</p>
                            <p className="font-sans text-[10px] text-brand-gray/50 mt-1">MP4, MOV, or AVI (max 500MB)</p>
                          </div>
                        )}
                      </div>
                      <input type="file" accept="video/mp4,video/quicktime,video/x-msvideo" onChange={handleFileChange} className="hidden" />
                    </label>
                  </div>

                  {/* Order Selection */}
                  <div>
                    <label className="font-sans text-[11px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-3">
                      Related Order
                    </label>
                    <select
                      value={form.orderId}
                      onChange={(e) => setForm({ ...form, orderId: e.target.value })}
                      className="w-full bg-transparent border-b border-brand-border pb-3 pt-1 text-sm text-brand-black placeholder:text-brand-gray/40 focus:outline-none focus:border-brand-gold transition-colors font-sans"
                    >
                      <option value="">Select an order</option>
                      <option value="#DWAF-2024-001">#DWAF-2024-001 - Charcoal Portrait</option>
                      <option value="#DWAF-2024-002">#DWAF-2024-002 - Museum Frame</option>
                      <option value="#DWAF-2024-003">#DWAF-2024-003 - Corporate Portrait</option>
                    </select>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="font-sans text-[11px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-3">
                      Short Description
                    </label>
                    <textarea
                      rows={3}
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="Tell us about your video..."
                      className="w-full bg-transparent border-b border-brand-border pb-3 pt-1 text-sm text-brand-black placeholder:text-brand-gray/40 focus:outline-none focus:border-brand-gold transition-colors font-sans resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isUploading || !selectedFile || !form.orderId}
                    className="relative overflow-hidden w-full px-8 py-4 bg-brand-black text-brand-white border border-brand-gold rounded-[6px] font-sans text-[11px] tracking-[0.2em] uppercase transition-all duration-500 hover:shadow-[0_0_30px_rgba(158,101,27,0.15)] cursor-pointer disabled:opacity-60 group"
                  >
                    <span className="absolute inset-0 bg-brand-gold transform -translate-x-full group-hover:translate-x-0 transition-transform duration-[400ms] ease-[var(--ease-expo-out)]" />
                    <span className="relative z-10 flex items-center justify-center gap-2 group-hover:text-brand-black transition-colors duration-[400ms]">
                      {isUploading ? (
                        <><Loader2 size={14} className="animate-spin" /> Uploading...</>
                      ) : (
                        <><Upload size={14} /> Submit Video</>
                      )}
                    </span>
                  </button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Submission History */}
          <motion.div {...fadeUp(0.3)} className="lg:col-span-2">
            <h2 className="font-display text-lg text-brand-black mb-6">Submission History</h2>
            <div className="space-y-3">
              {SUBMISSIONS.map((sub, i) => {
                const config = STATUS_CONFIG[sub.status] || STATUS_CONFIG.pending;
                const StatusIcon = config.icon;

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 + i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="p-5 border border-brand-border rounded-[8px] bg-brand-white/50 hover:border-brand-gold/20 transition-all duration-500"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-brand-gold/10 flex items-center justify-center flex-shrink-0">
                        <Film size={14} className="text-brand-gold" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-sans text-sm text-brand-black truncate">{sub.title}</p>
                        <p className="font-sans text-[10px] text-brand-gray/50 mt-0.5">{sub.order}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <StatusIcon size={11} className={config.color.split(' ')[1]} />
                        <span className={`font-sans text-[9px] tracking-[0.1em] uppercase px-2 py-0.5 rounded-full ${config.color}`}>
                          {config.label}
                        </span>
                      </div>
                      <span className="font-display text-xs text-brand-gold">{sub.reward}</span>
                    </div>
                    <p className="font-sans text-[10px] text-brand-gray/40 mt-2">{sub.date}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Info Section */}
        <motion.div {...fadeUp(0.35)} className="mt-12 p-6 md:p-8 border border-brand-border rounded-[8px] bg-brand-white/50">
          <h2 className="font-display text-lg text-brand-black mb-6">Video Reward Guidelines</h2>
          <div className="flex flex-wrap justify-center gap-6">
            {[
              { label: 'Feedback Videos', desc: 'Share your experience working with us', reward: 'Up to ₦1,000' },
              { label: 'Unboxing Videos', desc: 'Showcase your artwork unboxing moment', reward: 'Up to ₦1,500' },
              { label: 'Installation Videos', desc: 'Document your artwork installation', reward: 'Up to ₦2,000' },
              { label: 'Testimonial Videos', desc: 'Record a short testimonial about your experience', reward: 'Up to ₦2,000' },
            ].map((guide, i) => (
              <div key={i} className="p-4 border border-brand-border rounded-[6px] bg-brand-white/60 w-full md:w-[calc((100%-3rem)/3)]">
                <p className="font-display text-sm text-brand-black mb-1">{guide.label}</p>
                <p className="font-sans text-[10px] text-brand-gray/50 leading-relaxed mb-2">{guide.desc}</p>
                <p className="font-sans text-[10px] text-brand-gold tracking-[0.1em] uppercase">{guide.reward}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
