"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, DollarSign, ArrowUpRight, Video, Gift, Award } from 'lucide-react';

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] as const },
});

const BALANCE_CARDS = [
  { label: 'Wallet Balance', value: '₦24,500', icon: Wallet, color: 'text-brand-gold', bg: 'bg-brand-gold/5' },
  { label: 'Cashback Earned', value: '₦8,500', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-500/5' },
  { label: 'Total Withdrawn', value: '₦5,000', icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-500/5' },
];

const TRANSACTIONS = [
  { description: 'Referral Reward - Chioma Okeke', date: 'Mar 15, 2026', amount: '+₦5,000', type: 'credit', source: 'Referral' },
  { description: 'Cashback - Video Testimonial', date: 'Mar 10, 2026', amount: '+₦2,000', type: 'credit', source: 'Video Reward' },
  { description: 'Referral Reward - Emeka Nwachukwu', date: 'Mar 10, 2026', amount: '+₦5,000', type: 'credit', source: 'Referral' },
  { description: 'Order Payment - Portrait Commission', date: 'Mar 05, 2026', amount: '-₦250,000', type: 'debit', source: 'Payment' },
  { description: 'Cashback - Customer Appreciation', date: 'Feb 28, 2026', amount: '+₦1,500', type: 'credit', source: 'Promotion' },
  { description: 'Referral Reward - Amara Okafor', date: 'Feb 28, 2026', amount: '+₦5,000', type: 'credit', source: 'Referral' },
  { description: 'Withdrawal to Bank', date: 'Feb 20, 2026', amount: '-₦5,000', type: 'debit', source: 'Withdrawal' },
];

export default function WalletPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'credit' | 'debit'>('all');

  const filtered = TRANSACTIONS.filter((t) => {
    if (activeTab === 'all') return true;
    return t.type === activeTab;
  });

  return (
    <div className="p-6 md:p-10">
      <motion.div {...fadeUp(0)}>
        <h1 className="font-display text-3xl md:text-4xl text-brand-black mb-2">Wallet</h1>
        <p className="font-sans text-sm text-brand-gray mb-10">Manage your wallet, cashback, and transaction history.</p>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12">
          {BALANCE_CARDS.map((card, i) => (
            <motion.div
              key={card.label}
              {...fadeUp(0.1 + i * 0.05)}
              className="p-6 border border-brand-border rounded-[8px] bg-brand-white/50 hover:border-brand-gold/20 transition-all duration-500 group"
            >
              <div className={`w-10 h-10 rounded-full ${card.bg} flex items-center justify-center mb-4`}>
                <card.icon size={18} className={card.color} />
              </div>
              <p className="font-display text-2xl md:text-3xl text-brand-black mb-1">{card.value}</p>
              <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70">{card.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Cashback Sources */}
        <motion.div {...fadeUp(0.25)} className="p-6 md:p-8 border border-brand-border rounded-[8px] bg-brand-white/50 mb-12">
          <h2 className="font-display text-lg text-brand-black mb-6">How to Earn Cashback</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { label: 'Refer Friends', desc: 'Earn ₦5,000 per successful referral', icon: Gift, earned: '₦15,000' },
              { label: 'Video Testimonials', desc: 'Submit a video and earn up to ₦2,000', icon: Video, earned: '₦2,000' },
              { label: 'Unboxing Videos', desc: 'Share your unboxing experience', icon: Award, earned: '₦0' },
              { label: 'Promotions', desc: 'Seasonal cashback campaigns', icon: TrendingUp, earned: '₦1,500' },
            ].map((item, i) => (
              <div key={item.label} className="p-4 border border-brand-border rounded-[6px] bg-brand-white/60 hover:border-brand-gold/20 transition-all duration-300">
                <div className="w-8 h-8 rounded-full bg-brand-gold/10 flex items-center justify-center mb-3">
                  <item.icon size={14} className="text-brand-gold" />
                </div>
                <p className="font-display text-sm text-brand-black mb-1">{item.label}</p>
                <p className="font-sans text-[10px] text-brand-gray/50 leading-relaxed mb-2">{item.desc}</p>
                <p className="font-display text-xs text-brand-gold">Earned: {item.earned}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Transactions */}
        <motion.div {...fadeUp(0.3)}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h2 className="font-display text-xl text-brand-black">Transaction History</h2>
            <div className="flex gap-2">
              {(['all', 'credit', 'debit'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`font-sans text-[10px] tracking-[0.15em] uppercase px-4 py-2 rounded-full border transition-all duration-500 cursor-pointer ${
                    activeTab === tab
                      ? 'bg-brand-black text-brand-white border-brand-black'
                      : 'bg-transparent text-brand-gray border-brand-border hover:border-brand-gray/40 hover:text-brand-black'
                  }`}
                >
                  {tab === 'all' ? 'All' : tab === 'credit' ? 'Credits' : 'Debits'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {filtered.map((tx, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.03, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="p-5 border border-brand-border rounded-[8px] bg-brand-white/50 hover:border-brand-gold/20 hover:bg-brand-white/80 transition-all duration-500"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                      tx.type === 'credit' ? 'bg-green-500/10' : 'bg-red-500/10'
                    }`}>
                      {tx.type === 'credit' ? (
                        <ArrowUpRight size={14} className="text-green-600" />
                      ) : (
                        <ArrowUpRight size={14} className="text-red-500 rotate-90" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-sans text-sm text-brand-black truncate">{tx.description}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="font-sans text-[10px] text-brand-gray/50">{tx.date}</span>
                        <span className="font-sans text-[9px] tracking-[0.1em] uppercase text-brand-gray/40 bg-brand-border/50 px-2 py-0.5 rounded-full">
                          {tx.source}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className={`font-display text-sm flex-shrink-0 ${
                    tx.type === 'credit' ? 'text-green-600' : 'text-red-500'
                  }`}>
                    {tx.amount}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
