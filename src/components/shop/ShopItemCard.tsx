"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { ShoppingCart, MessageCircle, CheckCircle } from 'lucide-react';
import { ShopItem } from './ShopTypes';
import { api } from '@/lib/api';
import { useCart } from './CartContext';
import { NegotiationModal } from './NegotiationModal';

export function ShopItemCard({ item }: { item: ShopItem }) {
  const { refresh } = useCart();
  const [added, setAdded] = useState(false);
  const [negoOpen, setNegoOpen] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);

  const handleAddToCart = async () => {
    const token = localStorage.getItem('auth_token');
    const headers: Record<string, string> = {};
    if (!token) {
      headers['X-Session-Id'] = localStorage.getItem('session_id') || '';
    }
    const { data } = await api.post('/shop/cart/add', { shop_item_id: item.id });
    if (data) {
      setAdded(true);
      refresh();
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const images = item.images.length > 0 ? item.images : ['/placeholder.jpg'];

  return (
    <>
      <div className="group relative bg-brand-white border border-brand-border rounded-[12px] overflow-hidden transition-all duration-500 hover:shadow-[0_0_30px_rgba(158,101,27,0.1)]">
        <div className="relative w-full aspect-[4/3] overflow-hidden">
          {item.is_sold && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50">
              <span className="font-display text-2xl text-brand-white tracking-[0.15em] uppercase">Sold</span>
            </div>
          )}
          {images.length > 1 && (
            <div className="absolute top-3 right-3 z-10 flex gap-1">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setImgIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === imgIndex ? 'bg-brand-gold w-4' : 'bg-brand-white/60'}`}
                />
              ))}
            </div>
          )}
          <Image
            src={images[imgIndex]}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        <div className="p-5">
          {item.category && (
            <span className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gold">{item.category.name}</span>
          )}
          <h3 className="font-display text-lg text-brand-black mt-1 mb-2">{item.name}</h3>

          {item.price !== null && !item.is_sold && (
            <p className="font-sans text-xl text-brand-gold font-semibold mb-3">
              &#8358;{Number(item.price).toLocaleString()}
            </p>
          )}

          <div className="flex items-center gap-2 mt-auto">
            {!item.is_sold && (
              <>
                {item.is_negotiable ? (
                  <button
                    onClick={() => setNegoOpen(true)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border border-brand-gold/30 text-brand-gold font-sans text-[10px] tracking-[0.15em] uppercase hover:bg-brand-gold/5 hover:border-brand-gold transition-all"
                  >
                    <MessageCircle size={14} />
                    Make Offer
                  </button>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full font-sans text-[10px] tracking-[0.15em] uppercase transition-all ${
                      added
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-brand-black text-brand-white hover:bg-brand-black/90 border border-transparent'
                    }`}
                  >
                    {added ? <CheckCircle size={14} /> : <ShoppingCart size={14} />}
                    {added ? 'Added' : 'Add to Cart'}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <NegotiationModal item={item} open={negoOpen} onClose={() => setNegoOpen(false)} />
    </>
  );
}
