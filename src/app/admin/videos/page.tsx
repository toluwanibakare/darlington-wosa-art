"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Video, Trash2, ChevronLeft, ChevronRight, X, Loader2, ExternalLink, Edit3, AlertCircle,
} from 'lucide-react';

interface User {
  name: string;
  email: string;
}

interface VideoSubmission {
  id: number;
  user: User;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  category: string;
  created_at: string;
}

interface PaginatedResponse {
  data: VideoSubmission[];
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
}

const api = {
  get: async (endpoint: string) => {
    const token = localStorage.getItem('auth_token');
    const res = await fetch(`${API_BASE}/admin${endpoint}`, {
      headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
    });
    return res.json();
  },
  put: async (endpoint: string, body: unknown) => {
    const token = localStorage.getItem('auth_token');
    const res = await fetch(`${API_BASE}/admin${endpoint}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(body),
    });
    return res.json();
  },
  delete: async (endpoint: string) => {
    const token = localStorage.getItem('auth_token');
    await fetch(`${API_BASE}/admin${endpoint}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
    });
  },
};

const STATUS_COLORS: Record<string, string> = {
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  pending: 'bg-amber-100 text-amber-700',
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.darlingtonwosa.art';

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<VideoSubmission[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<VideoSubmission | null>(null);
  const [editForm, setEditForm] = useState({ category: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    const json: PaginatedResponse = await api.get(`/videos?page=${page}`);
    setVideos(json.data);
    setLastPage(json.last_page);
    setTotal(json.total);
    setLoading(false);
  }, [page]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const openEdit = (v: VideoSubmission) => {
    setEditing(v);
    setEditForm({ category: v.category, description: v.description });
  };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    const json: { data: VideoSubmission } = await api.put(`/videos/${editing.id}`, editForm);
    setVideos((prev) => prev.map((v) => (v.id === editing.id ? json.data : v)));
    setSaving(false);
    setEditing(null);
  };

  const handleDelete = async (id: number) => {
    setDeleting(id);
    await api.delete(`/videos/${id}`);
    setVideos((prev) => prev.filter((v) => v.id !== id));
    setTotal((t) => t - 1);
    setDeleting(null);
    setConfirmDelete(null);
  };

  const formatDate = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  };

  const truncateUrl = (url: string) => {
    if (url.length <= 40) return url;
    return url.substring(0, 37) + '...';
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
            <Video size={18} className="text-brand-gold" />
          </div>
          <div>
            <h1 className="font-display text-2xl text-brand-black">Video Submissions</h1>
            <p className="font-sans text-xs text-brand-gray">{total} total submissions</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="animate-spin text-brand-gold" />
          </div>
        ) : videos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border border-brand-border rounded-[8px]">
            <Video size={40} className="text-brand-gray/30 mb-4" />
            <p className="font-sans text-sm text-brand-gray">No video submissions yet</p>
          </div>
        ) : (
          <div className="border border-brand-border rounded-[8px] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-brand-border bg-brand-surface">
                    <th className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray text-left px-5 py-4">Title</th>
                    <th className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray text-left px-5 py-4">User</th>
                    <th className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray text-left px-5 py-4">URL</th>
                    <th className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray text-left px-5 py-4">Status</th>
                    <th className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray text-left px-5 py-4">Submitted</th>
                    <th className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray text-right px-5 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {videos.map((v) => (
                    <tr
                      key={v.id}
                      className="border-b border-brand-border/50 last:border-0 hover:bg-brand-surface/50 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <p className="font-sans text-sm text-brand-black font-medium">{v.title}</p>
                      </td>
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-sans text-sm text-brand-black">{v.user.name}</p>
                          <p className="font-sans text-[11px] text-brand-gray">{v.user.email}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <a
                          href={v.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 font-sans text-sm text-brand-gold hover:underline"
                        >
                          {truncateUrl(v.url)}
                          <ExternalLink size={12} className="flex-shrink-0" />
                        </a>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-block px-2.5 py-1 rounded-full font-sans text-[10px] tracking-[0.1em] uppercase ${STATUS_COLORS[v.category] || 'bg-brand-border text-brand-gray'}`}>
                          {v.category}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-sans text-sm text-brand-gray">{formatDate(v.created_at)}</span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEdit(v)}
                            className="p-2 rounded-[6px] text-brand-gray/50 hover:text-brand-gold hover:bg-brand-gold/10 transition-all cursor-pointer"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => setConfirmDelete(v.id)}
                            className="p-2 rounded-[6px] text-brand-gray/50 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
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
            <p className="font-sans text-xs text-brand-gray">Page {page} of {lastPage}</p>
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

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-lg bg-brand-surface border border-brand-border rounded-[8px] shadow-2xl"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-brand-border">
              <h2 className="font-display text-lg text-brand-black">Edit Video</h2>
              <button
                onClick={() => setEditing(null)}
                className="p-2 rounded-full hover:bg-brand-border/50 transition-colors cursor-pointer"
              >
                <X size={16} className="text-brand-gray" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-2">Category / Status</label>
                <select
                  value={editForm.category}
                  onChange={(e) => setEditForm((f) => ({ ...f, category: e.target.value }))}
                  className="w-full bg-transparent border border-brand-border rounded-[6px] px-4 py-2.5 text-sm text-brand-black focus:outline-none focus:border-brand-gold transition-colors font-sans"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div>
                <label className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-2">Description</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                  rows={4}
                  className="w-full bg-transparent border border-brand-border rounded-[6px] px-4 py-2.5 text-sm text-brand-black placeholder:text-brand-gray/40 focus:outline-none focus:border-brand-gold transition-colors font-sans resize-none"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-brand-border">
                <button
                  onClick={() => setEditing(null)}
                  className="px-5 py-2.5 border border-brand-border rounded-[6px] font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray hover:text-brand-black transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-brand-black text-brand-white border border-brand-gold rounded-[6px] font-sans text-[10px] tracking-[0.15em] uppercase hover:shadow-[0_0_20px_rgba(158,101,27,0.15)] transition-all cursor-pointer disabled:opacity-40"
                >
                  {saving ? <Loader2 size={14} className="animate-spin" /> : null}
                  Save Changes
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-sm bg-brand-surface border border-brand-border rounded-[8px] shadow-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle size={20} className="text-red-500" />
              </div>
              <h2 className="font-display text-lg text-brand-black">Delete Video</h2>
            </div>
            <p className="font-sans text-sm text-brand-gray mb-6">
              Are you sure you want to delete this video submission? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-5 py-2.5 border border-brand-border rounded-[6px] font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray hover:text-brand-black transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                disabled={deleting === confirmDelete}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-500 text-white rounded-[6px] font-sans text-[10px] tracking-[0.15em] uppercase hover:bg-red-600 transition-all cursor-pointer disabled:opacity-40"
              >
                {deleting === confirmDelete ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
