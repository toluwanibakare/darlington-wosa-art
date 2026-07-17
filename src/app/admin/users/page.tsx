"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, Trash2, Loader2, ChevronLeft, ChevronRight, Users as UsersIcon } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  is_admin: boolean;
  referral_code: string;
  wallet_balance: number;
  created_at: string;
}

interface PaginatedResponse {
  data: User[];
  current_page: number;
  last_page: number;
  prev_page_url: string | null;
  next_page_url: string | null;
  total: number;
}

const apiAdmin = {
  get: async <T>(endpoint: string): Promise<T> => {
    const token = localStorage.getItem('auth_token');
    const res = await fetch(`http://127.0.0.1:8000/api/admin${endpoint}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    });
    return res.json();
  },
  delete: async (endpoint: string) => {
    const token = localStorage.getItem('auth_token');
    await fetch(`http://127.0.0.1:8000/api/admin${endpoint}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    });
  },
};

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<Pick<PaginatedResponse, 'current_page' | 'last_page' | 'prev_page_url' | 'next_page_url' | 'total'> | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set('search', debouncedSearch);
      params.set('page', String(page));
      params.set('per_page', '20');

      const res = await apiAdmin.get<PaginatedResponse>(`/users?${params.toString()}`);
      setUsers(res.data);
      setMeta({
        current_page: res.current_page,
        last_page: res.last_page,
        prev_page_url: res.prev_page_url,
        next_page_url: res.next_page_url,
        total: res.total,
      });
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, page]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this user? This action cannot be undone.')) return;
    setDeleting(id);
    try {
      await apiAdmin.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch {
      // silent
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="p-6 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl text-brand-black">Users</h1>
            <p className="font-sans text-sm text-brand-gray mt-1">
              {meta ? `${meta.total} registered users` : 'Manage platform users'}
            </p>
          </div>
        </div>

        <div className="relative mb-6 max-w-md">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gray/50" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full h-11 pl-11 pr-4 bg-transparent border border-brand-border rounded-[8px] text-sm text-brand-black placeholder:text-brand-gray/40 focus:outline-none focus:border-brand-gold transition-colors font-sans"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="text-brand-gold animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-brand-gold/10 flex items-center justify-center mb-4">
              <UsersIcon size={24} className="text-brand-gold/60" />
            </div>
            <p className="font-display text-xl text-brand-black mb-1">No users found</p>
            <p className="font-sans text-sm text-brand-gray">
              {debouncedSearch ? 'Try a different search term.' : 'No users have registered yet.'}
            </p>
          </motion.div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-[8px] border border-brand-border">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-brand-border bg-brand-border/20">
                    <th className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 text-left px-5 py-4">Name</th>
                    <th className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 text-left px-5 py-4">Email</th>
                    <th className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 text-left px-5 py-4 hidden md:table-cell">Phone</th>
                    <th className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 text-left px-5 py-4">Role</th>
                    <th className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 text-left px-5 py-4 hidden lg:table-cell">Admin</th>
                    <th className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 text-left px-5 py-4 hidden lg:table-cell">Joined</th>
                    <th className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 text-right px-5 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.03, ease: [0.16, 1, 0.3, 1] }}
                      className="border-b border-brand-border/50 last:border-b-0 hover:bg-brand-border/10 transition-colors duration-200"
                    >
                      <td className="px-5 py-4">
                        <span className="font-sans text-sm text-brand-black">{user.name}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-sans text-sm text-brand-gray">{user.email}</span>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <span className="font-sans text-sm text-brand-gray">{user.phone || '--'}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full font-sans text-[10px] tracking-[0.1em] uppercase ${
                          user.role === 'admin'
                            ? 'bg-brand-gold/10 text-brand-gold'
                            : 'bg-brand-border/50 text-brand-gray'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-5 py-4 hidden lg:table-cell">
                        <span className={`inline-block px-3 py-1 rounded-full font-sans text-[10px] tracking-[0.1em] uppercase ${
                          user.is_admin
                            ? 'bg-green-100 text-green-700'
                            : 'bg-brand-border/30 text-brand-gray/50'
                        }`}>
                          {user.is_admin ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-5 py-4 hidden lg:table-cell">
                        <span className="font-sans text-sm text-brand-gray">{formatDate(user.created_at)}</span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => handleDelete(user.id)}
                          disabled={deleting === user.id}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-brand-border text-brand-gray/50 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all duration-200 cursor-pointer disabled:opacity-40"
                        >
                          {deleting === user.id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Trash2 size={14} />
                          )}
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {meta && meta.last_page > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-brand-border">
                <p className="font-sans text-[11px] text-brand-gray/60">
                  Page {meta.current_page} of {meta.last_page}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={!meta.prev_page_url}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-[6px] border border-brand-border font-sans text-[11px] tracking-[0.1em] uppercase text-brand-gray hover:text-brand-gold hover:border-brand-gold/30 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ChevronLeft size={14} />
                    Prev
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
                    disabled={!meta.next_page_url}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-[6px] border border-brand-border font-sans text-[11px] tracking-[0.1em] uppercase text-brand-gray hover:text-brand-gold hover:border-brand-gold/30 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Next
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}
