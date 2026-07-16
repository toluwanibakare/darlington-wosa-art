"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gift, Copy, Check, Users, TrendingUp, DollarSign, UserCheck, UserX, Share2, ExternalLink, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] as const },
});

const formatCurrency = (amount: number) => `₦${amount.toLocaleString()}`;

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

interface Referral {
  id: number;
  referrer_id: number;
  referee_id: number;
  code: string;
  status: string;
  reward_points: number;
  created_at: string;
  referee: { name: string; email: string };
}

interface ReferralsResponse {
  referrals: Referral[];
  stats: { total: number; successful: number; pending: number; earnings: number };
  referral_code: string;
  referral_link: string;
}

const STATUS_BADGE: Record<string, string> = {
  successful: 'bg-green-500/10 text-green-600',
  pending: 'bg-amber-500/10 text-amber-600',
  rejected: 'bg-red-500/10 text-red-600',
};

export default function ReferralsPage() {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ReferralsResponse | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      const res = await api.get<ReferralsResponse>('/referrals');
      if (res.error) {
        setError(res.error);
      } else if (res.data) {
        setData(res.data);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="p-6 md:p-10 flex items-center justify-center min-h-[400px]">
        <Loader2 size={24} className="animate-spin text-brand-gold" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 md:p-10">
        <p className="font-sans text-sm text-red-500">{error || 'Failed to load referrals.'}</p>
      </div>
    );
  }

  const { referrals, stats, referral_code, referral_link } = data;

  const REFERRAL_STATS = [
    { label: 'Total Referrals', value: String(stats.total), icon: Users, color: 'text-brand-gold', bg: 'bg-brand-gold/5' },
    { label: 'Successful', value: String(stats.successful), icon: UserCheck, color: 'text-green-600', bg: 'bg-green-500/5' },
    { label: 'Pending', value: String(stats.pending), icon: UserX, color: 'text-amber-600', bg: 'bg-amber-500/5' },
    { label: 'Total Earnings', value: formatCurrency(stats.earnings), icon: TrendingUp, color: 'text-brand-gold', bg: 'bg-brand-gold/5' },
  ];

  return (
    <div className="p-6 md:p-10">
      <motion.div {...fadeUp(0)}>
        <h1 className="font-display text-3xl md:text-4xl text-brand-black mb-2">Referrals</h1>
        <p className="font-sans text-sm text-brand-gray mb-10">Refer friends and earn rewards on every successful purchase.</p>

        {/* Referral Code Card */}
        <div className="p-8 border border-brand-border rounded-[8px] bg-brand-white/50 mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 rounded-full bg-brand-gold/10 flex items-center justify-center flex-shrink-0">
                <Gift size={24} className="text-brand-gold" />
              </div>
              <div>
                <p className="font-display text-lg text-brand-black mb-2">Your Referral Code</p>
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-display text-3xl md:text-4xl text-brand-gold tracking-wider">{referral_code}</span>
                  <button
                    onClick={() => copyToClipboard(referral_code)}
                    className="flex items-center gap-1.5 px-4 py-2 border border-brand-border rounded-full hover:border-brand-gold/30 transition-all duration-300 text-brand-gray hover:text-brand-gold cursor-pointer"
                  >
                    {copied ? <Check size={13} /> : <Copy size={13} />}
                    <span className="font-sans text-[9px] tracking-[0.15em] uppercase">{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="font-sans text-xs text-brand-gray/50">Share this code with friends to earn rewards</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => copyToClipboard(referral_link)}
                className="flex items-center gap-2 px-5 py-3 border border-brand-border rounded-full font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray hover:text-brand-gold hover:border-brand-gold/30 transition-all duration-300 cursor-pointer"
              >
                <Share2 size={12} />
                Share Link
              </button>
              <button className="flex items-center gap-2 px-5 py-3 bg-brand-black text-brand-white border border-brand-gold rounded-full font-sans text-[10px] tracking-[0.15em] uppercase transition-all duration-500 hover:shadow-[0_0_30px_rgba(158,101,27,0.15)] cursor-pointer">
                <ExternalLink size={12} />
                Share Now
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
          {REFERRAL_STATS.map((stat, i) => (
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

        {/* Withdrawable Balance Card */}
        <motion.div {...fadeUp(0.3)} className="p-6 md:p-8 border border-brand-border rounded-[8px] bg-brand-white/50 mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <DollarSign size={20} className="text-green-600" />
              </div>
              <div>
                <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 mb-1">Withdrawable Rewards</p>
                <p className="font-display text-2xl text-brand-black">{formatCurrency(stats.earnings)}</p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-6 py-3 bg-brand-black text-brand-white border border-brand-gold rounded-[6px] font-sans text-[10px] tracking-[0.2em] uppercase transition-all duration-500 hover:shadow-[0_0_30px_rgba(158,101,27,0.15)] group">
              <span className="relative z-10 flex items-center gap-2 group-hover:text-brand-black transition-colors duration-[400ms]">
                Withdraw Rewards
              </span>
            </button>
          </div>
        </motion.div>

        {/* Referral History */}
        <motion.div {...fadeUp(0.35)}>
          <h2 className="font-display text-xl text-brand-black mb-6">Referral History</h2>
          <div className="border border-brand-border rounded-[8px] bg-brand-white/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-brand-border">
                    <th className="text-left px-6 py-4 font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70">Referral</th>
                    <th className="text-left px-6 py-4 font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70">Date</th>
                    <th className="text-left px-6 py-4 font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70">Status</th>
                    <th className="text-left px-6 py-4 font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70">Reward</th>
                    <th className="text-left px-6 py-4 font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {referrals.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center font-sans text-sm text-brand-gray/50">
                        No referrals yet.
                      </td>
                    </tr>
                  )}
                  {referrals.map((ref, i) => (
                    <motion.tr
                      key={ref.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + i * 0.04, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="border-b border-brand-border/50 last:border-b-0 hover:bg-brand-white/80 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="font-sans text-sm text-brand-black">{ref.referee?.name || ref.referee?.email || 'Unknown'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-sans text-xs text-brand-gray/60">{formatDate(ref.created_at)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full font-sans text-[9px] tracking-[0.1em] uppercase ${STATUS_BADGE[ref.status] || 'bg-brand-border text-brand-gray'}`}>
                          {ref.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-sans text-sm text-brand-black">{formatCurrency(ref.reward_points)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-sans text-xs text-brand-gray/60">Points</span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
