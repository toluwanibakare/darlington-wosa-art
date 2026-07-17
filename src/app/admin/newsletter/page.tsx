"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Loader2, Trash2, Send, CheckCircle, XCircle, Users, AlertCircle } from 'lucide-react';

interface Subscriber {
  id: number;
  email: string;
  is_subscribed: boolean;
  created_at: string;
}

export default function NewsletterPage() {
  const [activeSection, setActiveSection] = useState<'subscribers' | 'send'>('subscribers');

  // Subscribers
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [subsLoading, setSubsLoading] = useState(true);

  // Send form
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<'all' | 'specific'>('all');
  const [specificEmail, setSpecificEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [sendMessage, setSendMessage] = useState('');

  const apiAdmin = {
    get: async (endpoint: string) => {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`http://127.0.0.1:8000/api/admin${endpoint}`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
      });
      return res.json();
    },
    post: async (endpoint: string, body: unknown) => {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`http://127.0.0.1:8000/api/admin${endpoint}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(body),
      });
      return res.json();
    },
    delete: async (endpoint: string) => {
      const token = localStorage.getItem('auth_token');
      await fetch(`http://127.0.0.1:8000/api/admin${endpoint}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
      });
    },
  };

  const fetchSubscribers = async () => {
    setSubsLoading(true);
    try {
      const data = await apiAdmin.get('/newsletter/subscribers');
      setSubscribers(Array.isArray(data) ? data : data.data || []);
    } catch {
      setSubscribers([]);
    } finally {
      setSubsLoading(false);
    }
  };

  useEffect(() => {
    if (activeSection === 'subscribers') fetchSubscribers();
  }, [activeSection]);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this subscriber?')) return;
    try {
      await apiAdmin.delete(`/newsletter/subscribers/${id}`);
      fetchSubscribers();
    } catch {
      // silent
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendMessage('');
    if (!subject.trim() || !content.trim()) return;
    setSending(true);
    try {
      const payload: { subject: string; content: string; type: string; email?: string } = { subject, content, type };
      if (type === 'specific') payload.email = specificEmail;
      const res = await apiAdmin.post('/newsletter/send', payload);
      if (res.message || res.success) {
        setSendMessage('Newsletter sent successfully!');
        setSubject('');
        setContent('');
        setSpecificEmail('');
      } else {
        setSendMessage(res.error || 'Failed to send newsletter');
      }
    } catch {
      setSendMessage('Network error. Could not send newsletter.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-[1800px] mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl md:text-3xl text-brand-black">Newsletter</h1>
            <p className="font-sans text-sm text-brand-gray mt-1">Manage subscribers and send newsletters</p>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex items-center gap-2 mb-6 border-b border-brand-border pb-4">
          <button
            onClick={() => setActiveSection('subscribers')}
            className={`flex items-center gap-2 px-4 py-2 rounded-[8px] font-sans text-[11px] tracking-[0.1em] uppercase transition-all duration-300 cursor-pointer ${
              activeSection === 'subscribers'
                ? 'bg-brand-black text-brand-white'
                : 'text-brand-gray/60 hover:text-brand-gold hover:bg-brand-border/30'
            }`}
          >
            <Users size={14} />
            Subscribers
          </button>
          <button
            onClick={() => setActiveSection('send')}
            className={`flex items-center gap-2 px-4 py-2 rounded-[8px] font-sans text-[11px] tracking-[0.1em] uppercase transition-all duration-300 cursor-pointer ${
              activeSection === 'send'
                ? 'bg-brand-black text-brand-white'
                : 'text-brand-gray/60 hover:text-brand-gold hover:bg-brand-border/30'
            }`}
          >
            <Send size={14} />
            Send Newsletter
          </button>
        </div>

        {activeSection === 'subscribers' && (
          <div className="border border-brand-border rounded-[8px] overflow-hidden bg-brand-white/50">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-brand-border bg-brand-surface">
                    <th className="text-left font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/60 px-5 py-4">Email</th>
                    <th className="text-left font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/60 px-5 py-4">Status</th>
                    <th className="text-left font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/60 px-5 py-4">Joined</th>
                    <th className="text-right font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/60 px-5 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subsLoading ? (
                    <tr>
                      <td colSpan={4} className="px-5 py-16 text-center">
                        <Loader2 size={20} className="animate-spin mx-auto text-brand-gold" />
                      </td>
                    </tr>
                  ) : subscribers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-5 py-16 text-center">
                        <Mail size={32} className="mx-auto text-brand-gray/20 mb-3" />
                        <p className="font-sans text-sm text-brand-gray">No subscribers yet</p>
                      </td>
                    </tr>
                  ) : (
                    subscribers.map((sub, i) => (
                      <motion.tr
                        key={sub.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.03, ease: [0.16, 1, 0.3, 1] }}
                        className="border-b border-brand-border/50 last:border-b-0 hover:bg-brand-surface/50 transition-colors"
                      >
                        <td className="px-5 py-4">
                          <span className="font-sans text-xs text-brand-black">{sub.email}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border font-sans text-[10px] tracking-[0.05em] uppercase ${
                            sub.is_subscribed
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : 'bg-red-50 text-red-700 border-red-200'
                          }`}>
                            {sub.is_subscribed ? <CheckCircle size={12} /> : <XCircle size={12} />}
                            {sub.is_subscribed ? 'Subscribed' : 'Unsubscribed'}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="font-sans text-xs text-brand-gray">{new Date(sub.created_at).toLocaleDateString()}</span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={() => handleDelete(sub.id)}
                            className="w-8 h-8 rounded-full border border-brand-border flex items-center justify-center hover:border-red-400 hover:text-red-500 transition-all cursor-pointer"
                          >
                            <Trash2 size={12} />
                          </button>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeSection === 'send' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <form onSubmit={handleSend} className="p-8 border border-brand-border rounded-[8px] bg-brand-white/50 space-y-6">
              {sendMessage && (
                <div className={`flex items-center gap-2 p-4 rounded-[6px] font-sans text-xs ${
                  sendMessage.includes('successfully')
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {sendMessage.includes('successfully') ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                  {sendMessage}
                </div>
              )}

              <div>
                <label className="font-sans text-[11px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-3">Subject</label>
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-transparent border border-brand-border rounded-[6px] px-4 py-3 text-sm text-brand-black placeholder:text-brand-gray/40 focus:outline-none focus:border-brand-gold transition-colors font-sans"
                  placeholder="Newsletter subject"
                  required
                />
              </div>

              <div>
                <label className="font-sans text-[11px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-3">Content</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={6}
                  className="w-full bg-transparent border border-brand-border rounded-[6px] px-4 py-3 text-sm text-brand-black placeholder:text-brand-gray/40 focus:outline-none focus:border-brand-gold transition-colors font-sans resize-y"
                  placeholder="Write your newsletter content here..."
                  required
                />
              </div>

              <div>
                <label className="font-sans text-[11px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-3">Send To</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as 'all' | 'specific')}
                  className="w-full bg-transparent border border-brand-border rounded-[6px] px-4 py-3 text-sm text-brand-black focus:outline-none focus:border-brand-gold transition-colors font-sans"
                >
                  <option value="all">All Subscribers</option>
                  <option value="specific">Specific Email</option>
                </select>
              </div>

              {type === 'specific' && (
                <div>
                  <label className="font-sans text-[11px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-3">Email Address</label>
                  <input
                    type="email"
                    value={specificEmail}
                    onChange={(e) => setSpecificEmail(e.target.value)}
                    className="w-full bg-transparent border border-brand-border rounded-[6px] px-4 py-3 text-sm text-brand-black placeholder:text-brand-gray/40 focus:outline-none focus:border-brand-gold transition-colors font-sans"
                    placeholder="user@example.com"
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={sending}
                className="w-full px-8 py-4 bg-brand-black text-brand-white rounded-[6px] font-sans text-[11px] tracking-[0.2em] uppercase hover:bg-brand-gold transition-all duration-300 cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {sending ? <><Loader2 size={14} className="animate-spin" /> Sending...</> : <><Send size={14} /> Send Newsletter</>}
              </button>
            </form>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
