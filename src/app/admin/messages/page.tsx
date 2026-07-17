"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Mail, Trash2, ChevronLeft, ChevronRight, X, Loader2, MessageSquare, Inbox,
} from 'lucide-react';

interface Message {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface PaginatedResponse {
  data: Message[];
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
}

const api = {
  get: async (endpoint: string) => {
    const token = localStorage.getItem('auth_token');
    const res = await fetch(`http://127.0.0.1:8000/api/admin${endpoint}`, {
      headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
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

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    const json: PaginatedResponse = await api.get(`/messages?page=${page}`);
    setMessages(json.data);
    setLastPage(json.last_page);
    setTotal(json.total);
    setLoading(false);
  }, [page]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const openDetail = async (msg: Message) => {
    setSelected(msg);
    if (!msg.is_read) {
      const updated: { data: Message } = await api.get(`/messages/${msg.id}`);
      setSelected(updated.data);
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, is_read: true } : m))
      );
    }
  };

  const handleDelete = async (id: number) => {
    setDeleting(id);
    await api.delete(`/messages/${id}`);
    setMessages((prev) => prev.filter((m) => m.id !== id));
    if (selected?.id === id) setSelected(null);
    setDeleting(null);
  };

  const formatDate = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  };

  return (
    <div className="px-4 md:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center">
            <Mail size={18} className="text-brand-gold" />
          </div>
          <div>
            <h1 className="font-display text-2xl text-brand-black">Contact Messages</h1>
            <p className="font-sans text-xs text-brand-gray">{total} total messages</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="animate-spin text-brand-gold" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border border-brand-border rounded-[8px]">
            <Inbox size={40} className="text-brand-gray/30 mb-4" />
            <p className="font-sans text-sm text-brand-gray">No messages yet</p>
          </div>
        ) : (
          <div className="border border-brand-border rounded-[8px] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-brand-border bg-brand-surface">
                    <th className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray text-left px-5 py-4">Name</th>
                    <th className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray text-left px-5 py-4">Email</th>
                    <th className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray text-left px-5 py-4">Subject</th>
                    <th className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray text-left px-5 py-4">Status</th>
                    <th className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray text-left px-5 py-4">Date</th>
                    <th className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray text-right px-5 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map((msg) => (
                    <tr
                      key={msg.id}
                      onClick={() => openDetail(msg)}
                      className="border-b border-brand-border/50 last:border-0 hover:bg-brand-surface/50 transition-colors cursor-pointer"
                    >
                      <td className="px-5 py-4">
                        <span className={`font-sans text-sm ${msg.is_read ? 'text-brand-gray' : 'text-brand-black font-medium'}`}>
                          {msg.name}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-sans text-sm text-brand-gray">{msg.email}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-sans text-sm text-brand-black">{msg.subject}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-block px-2.5 py-1 rounded-full font-sans text-[10px] tracking-[0.1em] uppercase ${
                          msg.is_read
                            ? 'bg-green-100 text-green-700'
                            : 'bg-brand-gold/10 text-brand-gold'
                        }`}>
                          {msg.is_read ? 'Read' : 'Unread'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-sans text-sm text-brand-gray">{formatDate(msg.created_at)}</span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(msg.id); }}
                          disabled={deleting === msg.id}
                          className="p-2 rounded-[6px] text-brand-gray/50 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer disabled:opacity-40"
                        >
                          {deleting === msg.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {lastPage > 1 && (
          <div className="flex items-center justify-between mt-6">
            <p className="font-sans text-xs text-brand-gray">
              Page {page} of {lastPage}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-[6px] border border-brand-border text-brand-gray hover:text-brand-gold hover:border-brand-gold/50 transition-all disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
                disabled={page === lastPage}
                className="p-2 rounded-[6px] border border-brand-border text-brand-gray hover:text-brand-gold hover:border-brand-gold/50 transition-all disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-xl bg-brand-surface border border-brand-border rounded-[8px] shadow-2xl"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-brand-border">
              <div className="flex items-center gap-3">
                <MessageSquare size={16} className="text-brand-gold" />
                <h2 className="font-display text-lg text-brand-black">Message Detail</h2>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="p-2 rounded-full hover:bg-brand-border/50 transition-colors cursor-pointer"
              >
                <X size={16} className="text-brand-gray" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 mb-1">Name</p>
                  <p className="font-sans text-sm text-brand-black">{selected.name}</p>
                </div>
                <div>
                  <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 mb-1">Email</p>
                  <p className="font-sans text-sm text-brand-black">{selected.email}</p>
                </div>
                <div>
                  <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 mb-1">Phone</p>
                  <p className="font-sans text-sm text-brand-black">{selected.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 mb-1">Date</p>
                  <p className="font-sans text-sm text-brand-black">{formatDate(selected.created_at)}</p>
                </div>
              </div>
              <div>
                <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 mb-1">Subject</p>
                <p className="font-sans text-sm text-brand-black font-medium">{selected.subject}</p>
              </div>
              <div>
                <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 mb-1">Message</p>
                <div className="p-4 border border-brand-border rounded-[6px] bg-brand-white/40">
                  <p className="font-sans text-sm text-brand-gray leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className={`inline-block px-3 py-1.5 rounded-full font-sans text-[10px] tracking-[0.1em] uppercase ${
                  selected.is_read
                    ? 'bg-green-100 text-green-700'
                    : 'bg-brand-gold/10 text-brand-gold'
                }`}>
                  {selected.is_read ? 'Read' : 'Unread'}
                </span>
                <button
                  onClick={() => handleDelete(selected.id)}
                  disabled={deleting === selected.id}
                  className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-500 rounded-[6px] hover:bg-red-50 transition-all font-sans text-[11px] tracking-[0.1em] uppercase cursor-pointer disabled:opacity-40"
                >
                  {deleting === selected.id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
