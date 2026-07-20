"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Users, Copy, ExternalLink } from 'lucide-react';

interface Referral {
  id: number;
  referrer: { id: number; name: string; email: string };
  referred: { id: number; name: string; email: string } | null;
  code: string;
  status: string;
  reward: { id: number; name: string } | null;
  created_at: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

function api() {
  const token = localStorage.getItem('auth_token');
  const headers = { Authorization: `Bearer ${token}`, Accept: 'application/json', 'Content-Type': 'application/json' };
  return {
    get: async (url: string) => { const r = await fetch(`${API_BASE}/admin${url}`, { headers }); return r.json(); },
  };
}

export default function AdminReferrals() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const a = api();

  const fetch = useCallback(async () => {
    setLoading(true);
    const qs = statusFilter ? `?status=${statusFilter}` : '';
    const json = await a.get(`/referrals${qs}`);
    setReferrals(json?.data || json || []);
    setLoading(false);
  }, [statusFilter]);

  useEffect(() => { fetch(); }, [fetch]);

  const statusColor: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    completed: 'bg-green-100 text-green-700',
    expired: 'bg-brand-border text-brand-gray',
  };

  return (
    <div className="px-4 md:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center">
              <Users size={18} className="text-brand-gold" />
            </div>
            <div>
              <h1 className="font-display text-2xl text-brand-black">Referrals</h1>
              <p className="font-sans text-xs text-brand-gray">{referrals.length} total</p>
            </div>
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-transparent border border-brand-border rounded-[6px] px-4 py-2.5 text-xs text-brand-black focus:outline-none focus:border-brand-gold font-sans">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="expired">Expired</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 size={24} className="animate-spin text-brand-gold" /></div>
        ) : referrals.length === 0 ? (
          <div className="flex flex-col items-center py-20 border border-brand-border rounded-[8px]">
            <Users size={40} className="text-brand-gray/30 mb-4" />
            <p className="font-sans text-sm text-brand-gray">No referrals yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-brand-border rounded-[8px]">
            <table className="w-full">
              <thead>
                <tr className="border-b border-brand-border bg-brand-white/50">
                  <th className="text-left px-4 py-3 font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray">Code</th>
                  <th className="text-left px-4 py-3 font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray">Referrer</th>
                  <th className="text-left px-4 py-3 font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray">Referred</th>
                  <th className="text-left px-4 py-3 font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray">Reward</th>
                  <th className="text-left px-4 py-3 font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray">Status</th>
                  <th className="text-left px-4 py-3 font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray">Date</th>
                </tr>
              </thead>
              <tbody>
                {referrals.map((r) => (
                  <tr key={r.id} className="border-b border-brand-border/50 hover:bg-brand-white/30 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <code className="text-xs font-mono text-brand-gold bg-brand-gold/5 px-2 py-0.5 rounded-[4px]">{r.code}</code>
                        <button onClick={() => navigator.clipboard.writeText(r.code)} className="text-brand-gray/50 hover:text-brand-gold transition-colors cursor-pointer"><Copy size={12} /></button>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-sans text-sm text-brand-black">{r.referrer?.name || 'Unknown'}</p>
                      <p className="font-sans text-[11px] text-brand-gray">{r.referrer?.email}</p>
                    </td>
                    <td className="px-4 py-4">
                      {r.referred ? (
                        <>
                          <p className="font-sans text-sm text-brand-black">{r.referred.name}</p>
                          <p className="font-sans text-[11px] text-brand-gray">{r.referred.email}</p>
                        </>
                      ) : (
                        <span className="font-sans text-xs text-brand-gray/50">Not yet</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-sans text-xs text-brand-gray">{r.reward?.name || '-'}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-0.5 rounded-full font-sans text-[9px] uppercase ${statusColor[r.status] || 'bg-brand-border text-brand-gray'}`}>{r.status}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-sans text-[11px] text-brand-gray">{new Date(r.created_at).toLocaleDateString()}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}
