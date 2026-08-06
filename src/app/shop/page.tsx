"use client";

import React, { useEffect, useState } from 'react';
import { ShopHero, ShopItemCard } from '@/components/shop';
import { Reveal, StaggerList, StaggerItem } from '@/components/ui';
import { api } from '@/lib/api';
import { Loader2 } from 'lucide-react';
import type { ShopCategory, ShopItem } from '@/components/shop';

function ShopContent() {
  const [categories, setCategories] = useState<ShopCategory[]>([]);
  const [items, setItems] = useState<ShopItem[]>([]);
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

  return (
    <>
      <ShopHero />

      <section className="relative w-full px-6 pb-32 bg-brand-surface text-brand-black">
        <div className="max-w-[1400px] mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={24} className="animate-spin text-brand-gold" />
            </div>
          ) : (
            <div className="space-y-20">
              {categories.map((category) => {
                const categoryItems = items.filter((item) => item.category?.id === category.id);
                if (categoryItems.length === 0) return null;

                return (
                  <div key={category.id} className="space-y-6">
                    <div className="border-b border-brand-border pb-4">
                      <h2 className="font-display text-2xl text-brand-black uppercase tracking-wider">{category.name}</h2>
                      {category.description && (
                        <p className="font-sans text-xs text-brand-gray mt-1">{category.description}</p>
                      )}
                    </div>

                    <StaggerList className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {categoryItems.map((item) => (
                        <StaggerItem key={item.id}>
                          <ShopItemCard item={item} />
                        </StaggerItem>
                      ))}
                    </StaggerList>
                  </div>
                );
              })}

              {/* Uncategorized items if any */}
              {items.filter(item => !item.category && !item.category_id).length > 0 && (
                <div className="space-y-6">
                  <div className="border-b border-brand-border pb-4">
                    <h2 className="font-display text-2xl text-brand-black uppercase tracking-wider">Other Works & Frames</h2>
                  </div>
                  <StaggerList className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {items.filter(item => !item.category && !item.category_id).map((item) => (
                      <StaggerItem key={item.id}>
                        <ShopItemCard item={item} />
                      </StaggerItem>
                    ))}
                  </StaggerList>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default function ShopPage() {
  return <ShopContent />;
}
