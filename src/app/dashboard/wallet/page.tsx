"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, DollarSign, ArrowUpRight, Video, Gift, Award, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

interface Transaction {
  id: number;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  source: string;
  created_at: string;
}

interface WalletResponse {
  transactions: Transaction[];
  wallet_balance: number;
  referral_earnings: number;
  cashback_earned: number;
  total_withdrawn: number;
}

function formatNGN(amount: number): string {
  return `\u20A6${Math.abs(amount).toLocaleString('en-US')}`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}

import { fadeUpProps } from '@/lib/animation';

export default function WalletPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [cashbackEarned, setCashbackEarned] = useState(0);
  const [totalWithdrawn, setTotalWithdrawn] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'credit' | 'debit'>('all');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api.get<WalletResponse>('/transactions').then((res) => {
      if (cancelled) return;
      if (res.error) {
        setError(res.error);
      } else if (res.data) {
        setTransactions(res.data.transactions ?? []);
        setWalletBalance(res.data.wallet_balance ?? 0);
        setCashbackEarned(res.data.cashback_earned ?? 0);
        setTotalWithdrawn(res.data.total_withdrawn ?? 0);
      }
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  const filtered = transactions.filter((t) => {
    if (activeTab === 'all') return true;
    return t.type === activeTab;
  });

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

  const BALANCE_CARDS = [
    { label: 'Wallet Balance', value: formatNGN(walletBalance), icon: Wallet, color: 'text-brand-gold', bg: 'bg-brand-gold/5' },
    { label: 'Cashback Earned', value: formatNGN(cashbackEarned), icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-500/5' },
    { label: 'Total Withdrawn', value: formatNGN(totalWithdrawn), icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-500/5' },
  ];

  return (
    <div className="p-6 md:p-10">
      <motion.div {...fadeUpProps(0)}>
        <h1 className="font-display text-3xl md:text-4xl text-brand-black mb-2">Wallet</h1>
        <p className="font-sans text-sm text-brand-gray mb-10">Manage your wallet, cashback, and transaction history.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12">
          {BALANCE_CARDS.map((card, i) => (
            <motion.div
              key={card.label}
              {...fadeUpProps(0.1 + i * 0.05)}
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

        <motion.div {...fadeUpProps(0.25)} className="p-6 md:p-8 border border-brand-border rounded-[8px] bg-brand-white/50 mb-12">
          <h2 className="font-display text-lg text-brand-black mb-6">How to Earn Cashback</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { label: 'Refer Friends', desc: 'Earn \u20A65,000 per successful referral', icon: Gift, earned: 'Earned: ' + formatNGN(cashbackEarned) },
              { label: 'Video Testimonials', desc: 'Submit a video and earn up to \u20A62,000', icon: Video, earned: '\u20A62,000' },
              { label: 'Unboxing Videos', desc: 'Share your unboxing experience', icon: Award, earned: '\u20A60' },
              { label: 'Promotions', desc: 'Seasonal cashback campaigns', icon: TrendingUp, earned: '\u20A61,500' },
            ].map((item, i) => (
              <div key={item.label} className="p-4 border border-brand-border rounded-[6px] bg-brand-white/60 hover:border-brand-gold/20 transition-all duration-300">
                <div className="w-8 h-8 rounded-full bg-brand-gold/10 flex items-center justify-center mb-3">
                  <item.icon size={14} className="text-brand-gold" />
                </div>
                <p className="font-display text-sm text-brand-black mb-1">{item.label}</p>
                <p className="font-sans text-[10px] text-brand-gray/50 leading-relaxed mb-2">{item.desc}</p>
                <p className="font-display text-xs text-brand-gold">{item.earned}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div {...fadeUpProps(0.3)}>
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
                key={tx.id}
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
                        <span className="font-sans text-[10px] text-brand-gray/50">{formatDate(tx.created_at)}</span>
                        <span className="font-sans text-[9px] tracking-[0.1em] uppercase text-brand-gray/40 bg-brand-border/50 px-2 py-0.5 rounded-full">
                          {tx.source}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className={`font-display text-sm flex-shrink-0 ${
                    tx.type === 'credit' ? 'text-green-600' : 'text-red-500'
                  }`}>
                    {tx.type === 'credit' ? '+' : '-'}{formatNGN(tx.amount)}
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
