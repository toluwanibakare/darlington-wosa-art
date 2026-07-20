"use client";

import React, { useEffect, useState } from 'react';
import { ShopHero, ShopItemCard, CartDrawer, CartFloatingButton, CartProvider } from '@/components/shop';
import { Reveal, StaggerList, StaggerItem } from '@/components/ui';
import { api } from '@/lib/api';
import { Loader2 } from 'lucide-react';
import type { ShopCategory, ShopItem } from '@/components/shop';

function ShopContent() {
  const [categories, setCategories] = useState<ShopCategory[]>([]);
  const [items, setItems] = useState<ShopItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<{ categories: ShopCategory[] }>('/shop/categories'),
      api.get<{ items: ShopItem[] }>('/shop/items'),
    ]).then(([catRes, itemRes]) => {
      if (catRes.data) setCategories(catRes.data.categories);
      if (itemRes.data) setItems(itemRes.data.items);
      setLoading(false);
    });
  }, []);

  const filtered = activeCategory
    ? items.filter((i) => i.category?.slug === activeCategory)
    : items;

  return (
    <>
      <ShopHero />

      <section className="relative w-full px-6 pb-32">
        <div className="max-w-[1400px] mx-auto">
          {categories.length > 0 && (
            <Reveal className="flex flex-wrap items-center gap-3 mb-12">
              <button
                onClick={() => setActiveCategory(null)}
                className={`px-5 py-2 rounded-full font-sans text-[10px] tracking-[0.15em] uppercase transition-all ${
                  !activeCategory
                    ? 'bg-brand-gold text-brand-black'
                    : 'border border-brand-border text-brand-gray hover:border-brand-gold hover:text-brand-gold'
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.slug)}
                  className={`px-5 py-2 rounded-full font-sans text-[10px] tracking-[0.15em] uppercase transition-all ${
                    activeCategory === cat.slug
                      ? 'bg-brand-gold text-brand-black'
                      : 'border border-brand-border text-brand-gray hover:border-brand-gold hover:text-brand-gold'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </Reveal>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={24} className="animate-spin text-brand-gold" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="font-sans text-brand-gray text-center py-20">No artworks available in this category.</p>
          ) : (
            <StaggerList className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((item) => (
                <StaggerItem key={item.id}>
                  <ShopItemCard item={item} />
                </StaggerItem>
              ))}
            </StaggerList>
          )}
        </div>
      </section>

      <CartFloatingButton />
      <CartDrawer />
    </>
  );
}

export default function ShopPage() {
  return (
    <CartProvider>
      <ShopContent />
    </CartProvider>
  );
}
