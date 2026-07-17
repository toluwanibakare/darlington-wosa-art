"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Ticket, Gift, Clock, CheckCircle, XCircle, Percent, Gem, Star, Copy, Check,
  Upload, Loader2, Film, DollarSign, Video,
} from 'lucide-react';
import { api } from '@/lib/api';
import { fadeUpProps } from '@/lib/animation';

const formatCurrency = (amount: number) => `₦${amount.toLocaleString()}`;

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

interface Coupon {
  code: string;
  discount: string;
  description: string;
  type: string;
  icon?: React.ElementType;
  expires: string;
  used: number;
  limit: number;
  status: string;
}

interface VideoSubmission {
  id: number;
  title: string;
  order_id: string;
  description: string;
  status: string;
  reward_amount: number;
  created_at: string;
}

const TABS = [
  { label: 'Coupons', value: 'coupons', icon: Ticket },
  { label: 'Video Rewards', value: 'videos', icon: Video },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  approved: { label: 'Approved', color: 'bg-green-500/10 text-green-600', icon: CheckCircle },
  pending: { label: 'Pending Review', color: 'bg-amber-500/10 text-amber-600', icon: Clock },
  rejected: { label: 'Rejected', color: 'bg-red-500/10 text-red-600', icon: XCircle },
};

const COUPON_ICONS: Record<string, React.ElementType> = {
  Percentage: Percent,
  'Free Upgrade': Gem,
  Fixed: Gift,
};

function CouponsTab({ coupons, stats, rewardTotal }: { coupons: Coupon[]; stats: { active: number; expired: number; total_saved: number }; rewardTotal: { total_points: number } }) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const REWARDS_STATS = [
    { label: 'Active Coupons', value: String(stats.active), icon: Ticket, color: 'text-brand-gold', bg: 'bg-brand-gold/5' },
    { label: 'Expired Coupons', value: String(stats.expired), icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/5' },
    { label: 'Total Saved', value: formatCurrency(stats.total_saved), icon: Ticket, color: 'text-green-600', bg: 'bg-green-500/5' },
    { label: 'Reward Points', value: String(rewardTotal.total_points), icon: Star, color: 'text-amber-600', bg: 'bg-amber-500/5' },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
        {REWARDS_STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            {...fadeUpProps(0.1 + i * 0.05)}
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

      <div className="mb-10">
        <h2 className="font-display text-xl text-brand-black mb-6">Available Coupons</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {coupons.filter((c) => c.status === 'active').length === 0 && (
            <p className="font-sans text-sm text-brand-gray/50 col-span-full">No active coupons available.</p>
          )}
          {coupons.filter((c) => c.status === 'active').map((coupon, i) => {
            const Icon = coupon.icon || COUPON_ICONS[coupon.type] || Gift;
            return (
              <motion.div
                key={coupon.code}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="group relative overflow-hidden"
              >
                <div className="p-6 border border-brand-border rounded-[8px] bg-brand-white/50 hover:border-brand-gold/30 hover:shadow-[0_0_30px_rgba(158,101,27,0.06)] transition-all duration-500">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center">
                        <Icon size={18} className="text-brand-gold" />
                      </div>
                      <div>
                        <p className="font-display text-lg text-brand-black">{coupon.discount}</p>
                        <p className="font-sans text-[10px] tracking-[0.1em] uppercase text-brand-gray/50">{coupon.type}</p>
                      </div>
                    </div>
                    <span className="flex items-center gap-1 font-sans text-[9px] text-green-600 bg-green-500/10 px-3 py-1 rounded-full uppercase tracking-[0.1em]">
                      <CheckCircle size={10} />
                      Active
                    </span>
                  </div>
                  <p className="font-sans text-sm text-brand-gray leading-relaxed mb-5">{coupon.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-brand-gray/50">
                      <span className="flex items-center gap-1 font-sans text-[10px]">
                        <Clock size={10} />
                        Expires {coupon.expires}
                      </span>
                      <span className="font-sans text-[10px]">
                        Used {coupon.used}/{coupon.limit}
                      </span>
                    </div>
                    <button
                      onClick={() => copyCode(coupon.code)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-brand-black text-brand-white rounded-[6px] font-sans text-[9px] tracking-[0.15em] uppercase hover:shadow-[0_0_20px_rgba(158,101,27,0.15)] transition-all duration-300 cursor-pointer"
                    >
                      {copiedCode === coupon.code ? (
                        <><Check size={11} /> Copied</>
                      ) : (
                        <><Copy size={11} /> {coupon.code}</>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {coupons.filter((c) => c.status === 'expired').length > 0 && (
        <div>
          <h2 className="font-display text-xl text-brand-black mb-6">Expired Coupons</h2>
          <div className="space-y-3">
            {coupons.filter((c) => c.status === 'expired').map((coupon, i) => (
              <motion.div
                key={coupon.code}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="p-5 border border-brand-border rounded-[8px] bg-brand-white/30 opacity-60"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-full bg-red-500/10 flex items-center justify-center">
                      <XCircle size={16} className="text-red-400" />
                    </div>
                    <div>
                      <p className="font-sans text-sm text-brand-black line-through">{coupon.discount}</p>
                      <p className="font-sans text-[10px] text-brand-gray/40">{coupon.code} - Expired {coupon.expires}</p>
                    </div>
                  </div>
                  <span className="font-sans text-[9px] text-red-400 bg-red-500/10 px-3 py-1 rounded-full uppercase tracking-[0.1em]">Expired</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function VideoRewardsTab({ videos, onVideoSubmitted }: { videos: VideoSubmission[]; onVideoSubmitted: () => void }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [form, setForm] = useState({ orderId: '', description: '' });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    const formData = new FormData();
    if (selectedFile) formData.append('video', selectedFile);
    formData.append('order_id', form.orderId);
    formData.append('description', form.description);

    const res = await api.post('/videos', {
      order_id: form.orderId,
      description: form.description,
    });

    setIsUploading(false);
    if (!res.error) {
      setIsSubmitted(true);
      onVideoSubmitted();
    }
  };

  const submittedCount = videos.length;
  const approvedCount = videos.filter((v) => v.status === 'approved').length;
  const pendingCount = videos.filter((v) => v.status === 'pending').length;
  const totalEarned = videos
    .filter((v) => v.status === 'approved')
    .reduce((sum, v) => sum + (v.reward_amount || 0), 0);

  const VIDEO_STATS = [
    { label: 'Submitted', value: String(submittedCount), icon: Upload, color: 'text-brand-gold', bg: 'bg-brand-gold/5' },
    { label: 'Approved', value: String(approvedCount), icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-500/5' },
    { label: 'Pending Review', value: String(pendingCount), icon: Clock, color: 'text-amber-600', bg: 'bg-amber-500/5' },
    { label: 'Total Earned', value: formatCurrency(totalEarned), icon: DollarSign, color: 'text-brand-gold', bg: 'bg-brand-gold/5' },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
        {VIDEO_STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            {...fadeUpProps(0.1 + i * 0.05)}
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
        <motion.div {...fadeUpProps(0.25)} className="lg:col-span-3">
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
                <div>
                  <label className="font-sans text-[11px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-3">Video File</label>
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
                          <p className="font-sans text-[10px] text-brand-gray/50 mt-1">{(selectedFile.size / (1024 * 1024)).toFixed(1)} MB</p>
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

                <div>
                  <label className="font-sans text-[11px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-3">Related Order</label>
                  <input
                    type="text"
                    value={form.orderId}
                    onChange={(e) => setForm({ ...form, orderId: e.target.value })}
                    placeholder="Enter order ID or number"
                    className="w-full bg-transparent border-b border-brand-border pb-3 pt-1 text-sm text-brand-black placeholder:text-brand-gray/40 focus:outline-none focus:border-brand-gold transition-colors font-sans"
                  />
                </div>

                <div>
                  <label className="font-sans text-[11px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-3">Short Description</label>
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

        <motion.div {...fadeUpProps(0.3)} className="lg:col-span-2">
          <h2 className="font-display text-lg text-brand-black mb-6">Submission History</h2>
          <div className="space-y-3">
            {videos.length === 0 && (
              <p className="font-sans text-sm text-brand-gray/50">No submissions yet.</p>
            )}
            {videos.map((sub, i) => {
              const config = STATUS_CONFIG[sub.status] || STATUS_CONFIG.pending;
              const StatusIcon = config.icon;
              return (
                <motion.div
                  key={sub.id}
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
                      <p className="font-sans text-sm text-brand-black truncate">{sub.title || sub.description || 'Video Submission'}</p>
                      <p className="font-sans text-[10px] text-brand-gray/50 mt-0.5">{sub.order_id}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <StatusIcon size={11} className={config.color.split(' ')[1]} />
                      <span className={`font-sans text-[9px] tracking-[0.1em] uppercase px-2 py-0.5 rounded-full ${config.color}`}>{config.label}</span>
                    </div>
                    <span className="font-display text-xs text-brand-gold">{sub.reward_amount ? formatCurrency(sub.reward_amount) : '--'}</span>
                  </div>
                  <p className="font-sans text-[10px] text-brand-gray/40 mt-2">{formatDate(sub.created_at)}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      <motion.div {...fadeUpProps(0.35)} className="mt-8 p-6 md:p-8 border border-brand-border rounded-[8px] bg-brand-white/50">
        <h2 className="font-display text-lg text-brand-black mb-6">Video Reward Guidelines</h2>
        <div className="flex flex-wrap justify-center gap-6">
          {[
            { label: 'Feedback Videos', desc: 'Share your experience working with us', reward: 'Up to N1,000' },
            { label: 'Unboxing Videos', desc: 'Showcase your artwork unboxing moment', reward: 'Up to N1,500' },
            { label: 'Installation Videos', desc: 'Document your artwork installation', reward: 'Up to N2,000' },
            { label: 'Testimonial Videos', desc: 'Record a short testimonial about your experience', reward: 'Up to N2,000' },
          ].map((guide, i) => (
            <div key={i} className="p-4 border border-brand-border rounded-[6px] bg-brand-white/60 w-full md:w-[calc((100%-3rem)/3)]">
              <p className="font-display text-sm text-brand-black mb-1">{guide.label}</p>
              <p className="font-sans text-[10px] text-brand-gray/50 leading-relaxed mb-2">{guide.desc}</p>
              <p className="font-sans text-[10px] text-brand-gold tracking-[0.1em] uppercase">{guide.reward}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default function RewardsPage() {
  const [activeTab, setActiveTab] = useState('coupons');
  const [loading, setLoading] = useState(true);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [couponStats, setCouponStats] = useState({ active: 0, expired: 0, total_saved: 0 });
  const [rewardTotal, setRewardTotal] = useState({ total_points: 0, earned: 0, redeemed: 0 });
  const [videos, setVideos] = useState<VideoSubmission[]>([]);

  const fetchAll = async () => {
    setLoading(true);
    const [couponsRes, totalRes, videosRes] = await Promise.all([
      api.get<{ coupons: Coupon[]; stats: { active: number; expired: number; total_saved: number } }>('/coupons'),
      api.get<{ total_points: number; earned: number; redeemed: number }>('/rewards/total'),
      api.get<{ videos: VideoSubmission[] }>('/videos'),
    ]);
    if (couponsRes.data) {
      setCoupons(couponsRes.data.coupons || []);
      setCouponStats(couponsRes.data.stats || { active: 0, expired: 0, total_saved: 0 });
    }
    if (totalRes.data) setRewardTotal(totalRes.data);
    if (videosRes.data) setVideos(videosRes.data.videos || []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  if (loading) {
    return (
      <div className="p-6 md:p-10 flex items-center justify-center min-h-[400px]">
        <Loader2 size={24} className="animate-spin text-brand-gold" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10">
      <motion.div {...fadeUpProps(0)}>
        <h1 className="font-display text-3xl md:text-4xl text-brand-black mb-2">Rewards</h1>
        <p className="font-sans text-sm text-brand-gray mb-10">Manage your coupons, video rewards, and loyalty points.</p>

        <div className="flex gap-1 mb-10 p-1 border border-brand-border rounded-[10px] bg-brand-white/50 w-fit">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-[8px] font-sans text-[10px] tracking-[0.15em] uppercase transition-all duration-500 cursor-pointer ${
                  activeTab === tab.value
                    ? 'bg-brand-black text-brand-white shadow-sm'
                    : 'text-brand-gray hover:text-brand-black'
                }`}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {activeTab === 'coupons' ? (
            <CouponsTab coupons={coupons} stats={couponStats} rewardTotal={rewardTotal} />
          ) : (
            <VideoRewardsTab videos={videos} onVideoSubmitted={fetchAll} />
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
