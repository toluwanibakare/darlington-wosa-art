"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Megaphone, Mail, Ticket, Loader2, Trash2, Send, Plus, X, Check,
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.darlingtonwosa.art';

function api() {
  const token = localStorage.getItem('auth_token');
  const h = { Authorization: `Bearer ${token}`, Accept: 'application/json' };
  const jh = { ...h, 'Content-Type': 'application/json' };
  return {
    get: async (url: string) => { const r = await fetch(`${API_BASE}/admin${url}`, { headers: h }); return r.json(); },
    post: async (url: string, body: unknown) => { const r = await fetch(`${API_BASE}/admin${url}`, { method: 'POST', headers: jh, body: JSON.stringify(body) }); return r.json(); },
    delete: async (url: string) => { await fetch(`${API_BASE}/admin${url}`, { method: 'DELETE', headers: h }); },
  };
}

interface Subscriber { id: number; email: string; is_active: boolean; created_at: string; }
interface Coupon { id: number; code: string; discount_type: string; discount_value: number; is_active: boolean; usage_count: number; max_usage: number | null; expires_at: string | null; created_at: string; }

export default function AdminMarketingPage() {
  const [tab, setTab] = useState<'newsletter' | 'coupons'>('newsletter');
  const [subs, setSubs] = useState<Subscriber[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [sendModal, setSendModal] = useState(false);
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);
  const [couponModal, setCouponModal] = useState(false);
  const [couponForm, setCouponForm] = useState({ code: '', discount_type: 'percentage', discount_value: 10, max_usage: '', expires_at: '' });
  const [savingCoupon, setSavingCoupon] = useState(false);

  const a = api();

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [subsJson, coupJson] = await Promise.all([
      a.get('/newsletter/subscribers'),
      a.get('/coupons'),
    ]);
    setSubs(subsJson?.data || subsJson || []);
    setCoupons(coupJson?.data || coupJson || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const deleteSub = async (id: number) => {
    setDeleting(id);
    await a.delete(`/newsletter/subscribers/${id}`);
    setSubs((p) => p.filter((s) => s.id !== id));
    setDeleting(null);
  };

  const sendNewsletter = async () => {
    if (!subject || !content) return;
    setSending(true);
    await a.post('/newsletter/send', { subject, content });
    setSendModal(false);
    setSubject('');
    setContent('');
    setSending(false);
  };

  const saveCoupon = async () => {
    setSavingCoupon(true);
    try {
      await a.post('/coupons', {
        ...couponForm,
        max_usage: couponForm.max_usage ? Number(couponForm.max_usage) : null,
        expires_at: couponForm.expires_at || null,
      });
      fetchData();
      setCouponModal(false);
    } finally { setSavingCoupon(false); }
  };

  const deleteCoupon = async (id: number) => {
    setDeleting(id);
    await a.delete(`/coupons/${id}`);
    setCoupons((p) => p.filter((c) => c.id !== id));
    setDeleting(null);
  };

  return (
    <div className="px-4 md:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center">
              <Megaphone size={18} className="text-brand-gold" />
            </div>
            <div>
              <h1 className="font-display text-2xl text-brand-black">Marketing</h1>
              <p className="font-sans text-xs text-brand-gray">Newsletter & Promotions</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 mb-6 p-1 border border-brand-border rounded-[8px] w-fit bg-brand-white/40">
          <button onClick={() => setTab('newsletter')} className={`px-5 py-2 rounded-[6px] font-sans text-[10px] tracking-[0.15em] uppercase transition-all cursor-pointer ${tab === 'newsletter' ? 'bg-brand-black text-brand-white shadow-sm' : 'text-brand-gray/60 hover:text-brand-black'}`}>Newsletter</button>
          <button onClick={() => setTab('coupons')} className={`px-5 py-2 rounded-[6px] font-sans text-[10px] tracking-[0.15em] uppercase transition-all cursor-pointer ${tab === 'coupons' ? 'bg-brand-black text-brand-white shadow-sm' : 'text-brand-gray/60 hover:text-brand-black'}`}>Promotions</button>
        </div>

        {tab === 'newsletter' ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="font-sans text-sm text-brand-gray">{subs.length} subscribers</p>
              <button onClick={() => setSendModal(true)} className="flex items-center gap-2 px-4 py-2 bg-brand-black text-brand-white border border-brand-gold rounded-[6px] font-sans text-[10px] tracking-[0.15em] uppercase cursor-pointer"><Send size={12} /> Send Newsletter</button>
            </div>
            {loading ? (
              <div className="flex justify-center py-16"><Loader2 size={24} className="animate-spin text-brand-gold" /></div>
            ) : subs.length === 0 ? (
              <div className="flex flex-col items-center py-16 border border-brand-border rounded-[8px]"><Mail size={40} className="text-brand-gray/30 mb-4" /><p className="font-sans text-sm text-brand-gray">No subscribers yet</p></div>
            ) : (
              <div className="overflow-x-auto border border-brand-border rounded-[8px]">
                <table className="w-full">
                  <thead><tr className="border-b border-brand-border bg-brand-white/50"><th className="text-left px-4 py-3 font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray">Email</th><th className="text-left px-4 py-3 font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray">Status</th><th className="text-left px-4 py-3 font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray">Date</th><th className="text-right px-4 py-3 font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray">Actions</th></tr></thead>
                  <tbody>
                    {subs.map((s) => (
                      <tr key={s.id} className="border-b border-brand-border/50 hover:bg-brand-white/30 transition-colors">
                        <td className="px-4 py-3"><span className="font-sans text-sm text-brand-black">{s.email}</span></td>
                        <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full font-sans text-[9px] uppercase ${s.is_active ? 'bg-green-100 text-green-700' : 'bg-brand-border text-brand-gray'}`}>{s.is_active ? 'Active' : 'Inactive'}</span></td>
                        <td className="px-4 py-3"><span className="font-sans text-[11px] text-brand-gray">{new Date(s.created_at).toLocaleDateString()}</span></td>
                        <td className="px-4 py-3 text-right"><button onClick={() => deleteSub(s.id)} disabled={deleting === s.id} className="p-1.5 rounded-[4px] text-brand-gray/50 hover:text-red-500 transition-all cursor-pointer disabled:opacity-40">{deleting === s.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="font-sans text-sm text-brand-gray">{coupons.length} coupons</p>
              <button onClick={() => { setCouponForm({ code: '', discount_type: 'percentage', discount_value: 10, max_usage: '', expires_at: '' }); setCouponModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-brand-black text-brand-white border border-brand-gold rounded-[6px] font-sans text-[10px] tracking-[0.15em] uppercase cursor-pointer"><Plus size={12} /> Add Coupon</button>
            </div>
            {loading ? (
              <div className="flex justify-center py-16"><Loader2 size={24} className="animate-spin text-brand-gold" /></div>
            ) : coupons.length === 0 ? (
              <div className="flex flex-col items-center py-16 border border-brand-border rounded-[8px]"><Ticket size={40} className="text-brand-gray/30 mb-4" /><p className="font-sans text-sm text-brand-gray">No coupons yet</p></div>
            ) : (
              <div className="overflow-x-auto border border-brand-border rounded-[8px]">
                <table className="w-full">
                  <thead><tr className="border-b border-brand-border bg-brand-white/50"><th className="text-left px-4 py-3 font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray">Code</th><th className="text-left px-4 py-3 font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray">Discount</th><th className="text-left px-4 py-3 font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray">Usage</th><th className="text-left px-4 py-3 font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray">Status</th><th className="text-right px-4 py-3 font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray">Actions</th></tr></thead>
                  <tbody>
                    {coupons.map((c) => (
                      <tr key={c.id} className="border-b border-brand-border/50 hover:bg-brand-white/30 transition-colors">
                        <td className="px-4 py-3"><code className="text-xs font-mono text-brand-gold bg-brand-gold/5 px-2 py-0.5 rounded-[4px]">{c.code}</code></td>
                        <td className="px-4 py-3"><span className="font-sans text-sm text-brand-black">{c.discount_type === 'percentage' ? `${c.discount_value}%` : `₦${c.discount_value}`}</span></td>
                        <td className="px-4 py-3"><span className="font-sans text-xs text-brand-gray">{c.usage_count}{c.max_usage ? ` / ${c.max_usage}` : ''}</span></td>
                        <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full font-sans text-[9px] uppercase ${c.is_active ? 'bg-green-100 text-green-700' : 'bg-brand-border text-brand-gray'}`}>{c.is_active ? 'Active' : 'Inactive'}</span></td>
                        <td className="px-4 py-3 text-right"><button onClick={() => deleteCoupon(c.id)} disabled={deleting === c.id} className="p-1.5 rounded-[4px] text-brand-gray/50 hover:text-red-500 transition-all cursor-pointer disabled:opacity-40">{deleting === c.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {sendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-lg bg-brand-surface border border-brand-border rounded-[8px] shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-brand-border">
              <h2 className="font-display text-lg text-brand-black">Send Newsletter</h2>
              <button onClick={() => setSendModal(false)} className="p-2 rounded-full hover:bg-brand-border/50 cursor-pointer"><X size={16} className="text-brand-gray" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-2">Subject</label><input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full bg-transparent border border-brand-border rounded-[6px] px-4 py-2.5 text-sm text-brand-black focus:outline-none focus:border-brand-gold font-sans" /></div>
              <div><label className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-2">Content</label><textarea value={content} onChange={(e) => setContent(e.target.value)} rows={6} className="w-full bg-transparent border border-brand-border rounded-[6px] px-4 py-2.5 text-sm text-brand-black focus:outline-none focus:border-brand-gold font-sans resize-none" /></div>
              <div className="flex justify-end gap-3 pt-2 border-t border-brand-border">
                <button onClick={() => setSendModal(false)} className="px-4 py-2 border border-brand-border rounded-[6px] font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray cursor-pointer">Cancel</button>
                <button onClick={sendNewsletter} disabled={sending || !subject || !content} className="flex items-center gap-2 px-4 py-2 bg-brand-black text-brand-white border border-brand-gold rounded-[6px] font-sans text-[10px] tracking-[0.15em] uppercase cursor-pointer disabled:opacity-40">{sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} Send</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {couponModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-lg bg-brand-surface border border-brand-border rounded-[8px] shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-brand-border">
              <h2 className="font-display text-lg text-brand-black">Add Coupon</h2>
              <button onClick={() => setCouponModal(false)} className="p-2 rounded-full hover:bg-brand-border/50 cursor-pointer"><X size={16} className="text-brand-gray" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-2">Code</label><input type="text" value={couponForm.code} onChange={(e) => setCouponForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))} className="w-full bg-transparent border border-brand-border rounded-[6px] px-4 py-2.5 text-sm text-brand-black focus:outline-none focus:border-brand-gold font-sans" placeholder="SAVE10" /></div>
                <div><label className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-2">Type</label><select value={couponForm.discount_type} onChange={(e) => setCouponForm((f) => ({ ...f, discount_type: e.target.value }))} className="w-full bg-transparent border border-brand-border rounded-[6px] px-4 py-2.5 text-sm text-brand-black focus:outline-none focus:border-brand-gold font-sans"><option value="percentage">Percentage</option><option value="fixed">Fixed (₦)</option></select></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-2">Value</label><input type="number" value={couponForm.discount_value} onChange={(e) => setCouponForm((f) => ({ ...f, discount_value: Number(e.target.value) }))} className="w-full bg-transparent border border-brand-border rounded-[6px] px-4 py-2.5 text-sm text-brand-black focus:outline-none focus:border-brand-gold font-sans" /></div>
                <div><label className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-2">Max Usage (empty = unlimited)</label><input type="number" value={couponForm.max_usage} onChange={(e) => setCouponForm((f) => ({ ...f, max_usage: e.target.value }))} className="w-full bg-transparent border border-brand-border rounded-[6px] px-4 py-2.5 text-sm text-brand-black focus:outline-none focus:border-brand-gold font-sans" /></div>
              </div>
              <div><label className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-2">Expires At (optional)</label><input type="date" value={couponForm.expires_at} onChange={(e) => setCouponForm((f) => ({ ...f, expires_at: e.target.value }))} className="w-full bg-transparent border border-brand-border rounded-[6px] px-4 py-2.5 text-sm text-brand-black focus:outline-none focus:border-brand-gold font-sans" /></div>
              <div className="flex justify-end gap-3 pt-2 border-t border-brand-border">
                <button onClick={() => setCouponModal(false)} className="px-4 py-2 border border-brand-border rounded-[6px] font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray cursor-pointer">Cancel</button>
                <button onClick={saveCoupon} disabled={savingCoupon || !couponForm.code} className="flex items-center gap-2 px-4 py-2 bg-brand-black text-brand-white border border-brand-gold rounded-[6px] font-sans text-[10px] tracking-[0.15em] uppercase cursor-pointer disabled:opacity-40">{savingCoupon ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Create</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
