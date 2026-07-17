"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Settings, Save, Loader2, CheckCircle, Link,
} from 'lucide-react';

interface SettingsMap {
  [key: string]: string;
}

interface SettingEntry {
  key: string;
  value: string;
}

const api = {
  get: async (endpoint: string) => {
    const token = localStorage.getItem('auth_token');
    const res = await fetch(`http://127.0.0.1:8000/api/admin${endpoint}`, {
      headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
    });
    return res.json();
  },
  put: async (endpoint: string, body: unknown) => {
    const token = localStorage.getItem('auth_token');
    const res = await fetch(`http://127.0.0.1:8000/api/admin${endpoint}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(body),
    });
    return res.json();
  },
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SettingsMap>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      const json: SettingsMap = await api.get('/settings');
      setSettings(json);
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const updateField = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSuccess(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    const entries: SettingEntry[] = Object.entries(settings).map(([key, value]) => ({ key, value }));
    await api.put('/settings', entries);
    setSaving(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const fields = [
    { key: 'referral_reward_points', label: 'Referral Reward Points', section: 'Referral Settings' },
    { key: 'referral_reward_cash', label: 'Referral Reward Cash (NGN)', section: 'Referral Settings' },
    { key: 'min_withdrawal', label: 'Minimum Withdrawal (NGN)', section: 'Referral Settings' },
    { key: 'telegram_link', label: 'Telegram Community Link', section: 'Community' },
  ];

  return (
    <div className="px-4 md:px-8 py-8 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center">
              <Settings size={18} className="text-brand-gold" />
            </div>
            <div>
              <h1 className="font-display text-2xl text-brand-black">Settings</h1>
              <p className="font-sans text-xs text-brand-gray">Manage application configuration</p>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="relative flex items-center gap-2 px-5 py-2.5 bg-brand-black text-brand-white border border-brand-gold rounded-[6px] font-sans text-[10px] tracking-[0.15em] uppercase hover:shadow-[0_0_20px_rgba(158,101,27,0.15)] transition-all cursor-pointer disabled:opacity-40 overflow-hidden group"
          >
            <span className="absolute inset-0 bg-brand-gold transform -translate-x-full group-hover:translate-x-0 transition-transform duration-[400ms] ease-[var(--ease-expo-out)]" />
            <span className="relative z-10 flex items-center gap-2 group-hover:text-brand-black transition-colors duration-[400ms]">
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              {saving ? 'Saving...' : 'Save Changes'}
            </span>
          </button>
        </div>

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 p-4 mb-6 border border-green-200 bg-green-50 rounded-[8px]"
          >
            <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
            <p className="font-sans text-sm text-green-700">Settings saved successfully</p>
          </motion.div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="animate-spin text-brand-gold" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Referral Settings */}
            <div className="border border-brand-border rounded-[8px] overflow-hidden">
              <div className="px-6 py-4 bg-brand-surface border-b border-brand-border">
                <h2 className="font-display text-base text-brand-black">Referral Settings</h2>
                <p className="font-sans text-xs text-brand-gray mt-1">Configure referral rewards and withdrawal minimums</p>
              </div>
              <div className="p-6 space-y-6">
                {fields.filter((f) => f.section === 'Referral Settings').map((field) => (
                  <div key={field.key}>
                    <label className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-2">
                      {field.label}
                    </label>
                    <input
                      type="text"
                      value={settings[field.key] || ''}
                      onChange={(e) => updateField(field.key, e.target.value)}
                      className="w-full bg-transparent border border-brand-border rounded-[6px] px-4 py-3 text-sm text-brand-black placeholder:text-brand-gray/40 focus:outline-none focus:border-brand-gold transition-colors font-sans"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Community */}
            <div className="border border-brand-border rounded-[8px] overflow-hidden">
              <div className="px-6 py-4 bg-brand-surface border-b border-brand-border">
                <div className="flex items-center gap-2">
                  <Link size={16} className="text-brand-gold" />
                  <h2 className="font-display text-base text-brand-black">Community</h2>
                </div>
                <p className="font-sans text-xs text-brand-gray mt-1">Social and community links</p>
              </div>
              <div className="p-6 space-y-6">
                {fields.filter((f) => f.section === 'Community').map((field) => (
                  <div key={field.key}>
                    <label className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-2">
                      {field.label}
                    </label>
                    <input
                      type="text"
                      value={settings[field.key] || ''}
                      onChange={(e) => updateField(field.key, e.target.value)}
                      className="w-full bg-transparent border border-brand-border rounded-[6px] px-4 py-3 text-sm text-brand-black placeholder:text-brand-gray/40 focus:outline-none focus:border-brand-gold transition-colors font-sans"
                      placeholder="https://t.me/..."
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
