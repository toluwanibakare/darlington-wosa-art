"use client";

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Store } from 'lucide-react';

export default function AdminShopPage() {
  const router = useRouter();
  const pathname = usePathname();
  const tab = pathname === '/admin/shop/categories' ? 'categories' : 'items';

  const switchTab = (t: 'items' | 'categories') => {
    router.push(t === 'items' ? '/admin/shop/items' : '/admin/shop/categories');
  };

  return (
    <div className="px-4 md:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center">
            <Store size={18} className="text-brand-gold" />
          </div>
          <div>
            <h1 className="font-display text-2xl text-brand-black">Shop</h1>
            <p className="font-sans text-xs text-brand-gray">Manage your store</p>
          </div>
        </div>

        <div className="flex items-center gap-1 mb-6 p-1 border border-brand-border rounded-[8px] w-fit bg-brand-white/40">
          <button onClick={() => switchTab('items')} className={`px-5 py-2 rounded-[6px] font-sans text-[10px] tracking-[0.15em] uppercase transition-all cursor-pointer ${tab === 'items' ? 'bg-brand-black text-brand-white shadow-sm' : 'text-brand-gray/60 hover:text-brand-black'}`}>Items</button>
          <button onClick={() => switchTab('categories')} className={`px-5 py-2 rounded-[6px] font-sans text-[10px] tracking-[0.15em] uppercase transition-all cursor-pointer ${tab === 'categories' ? 'bg-brand-black text-brand-white shadow-sm' : 'text-brand-gray/60 hover:text-brand-black'}`}>Categories</button>
        </div>

        {tab === 'items' ? (
          <div className="text-center py-20 border border-brand-border rounded-[8px]">
            <Store size={40} className="text-brand-gray/30 mx-auto mb-4" />
            <p className="font-sans text-sm text-brand-gray mb-4">View and manage shop items</p>
            <button onClick={() => router.push('/admin/shop/items')} className="px-5 py-2.5 bg-brand-black text-brand-white border border-brand-gold rounded-[6px] font-sans text-[10px] tracking-[0.15em] uppercase cursor-pointer">Go to Items</button>
          </div>
        ) : (
          <div className="text-center py-20 border border-brand-border rounded-[8px]">
            <Store size={40} className="text-brand-gray/30 mx-auto mb-4" />
            <p className="font-sans text-sm text-brand-gray mb-4">View and manage shop categories</p>
            <button onClick={() => router.push('/admin/shop/categories')} className="px-5 py-2.5 bg-brand-black text-brand-white border border-brand-gold rounded-[6px] font-sans text-[10px] tracking-[0.15em] uppercase cursor-pointer">Go to Categories</button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
