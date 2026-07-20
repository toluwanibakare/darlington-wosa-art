"use client";

import React, { useState } from 'react';
import { StarRating } from './StarRating';
import { api } from '@/lib/api';
import { useUser } from '@/lib/use-user';
import { ImagePlus, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export function ReviewForm() {
  const { user } = useUser();
  const [name, setName] = useState(user?.name || '');
  const [role, setRole] = useState('');
  const [quote, setQuote] = useState('');
  const [rating, setRating] = useState(0);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [anonymous, setAnonymous] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quote.trim() || rating === 0) return;

    setStatus('loading');

    const fd: Record<string, unknown> = {
      name: anonymous ? '' : name,
      role: anonymous ? '' : role,
      quote,
      rating,
    };

    if (image) {
      fd.image = image;
    }

    const { data, error } = await api.upload('/testimonials', fd);

    if (data) {
      setStatus('success');
      setMessage('Thank you for your review! It will be visible after approval.');
      setQuote('');
      setRating(0);
      setImage(null);
      setImagePreview(null);
    } else {
      setStatus('error');
      setMessage(error || 'Something went wrong. Please try again.');
    }
  };

  const displayName = user?.name || name;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {status === 'success' && (
        <div className="flex items-start gap-3 p-4 rounded-[8px] bg-brand-gold/10 border border-brand-gold/20">
          <CheckCircle size={18} className="text-brand-gold shrink-0 mt-0.5" />
          <p className="font-sans text-sm text-brand-gold-light">{message}</p>
        </div>
      )}

      {status === 'error' && (
        <div className="flex items-start gap-3 p-4 rounded-[8px] bg-red-500/10 border border-red-500/20">
          <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
          <p className="font-sans text-sm text-red-400">{message}</p>
        </div>
      )}

      {status !== 'success' && (
        <>
          <div>
            <label className="block font-sans text-xs tracking-[0.15em] uppercase text-brand-gray mb-2">
              Your Rating
            </label>
            <StarRating rating={rating} size={28} interactive onChange={setRating} />
          </div>

          {!user && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="anonymous"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
                className="accent-brand-gold"
              />
              <label htmlFor="anonymous" className="font-sans text-xs text-brand-gray cursor-pointer">
                Post anonymously
              </label>
            </div>
          )}

          {(!anonymous || user) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-sans text-xs tracking-[0.15em] uppercase text-brand-gray mb-2">
                  {user ? 'Name (from account)' : 'Your Name'}
                </label>
                <input
                  type="text"
                  value={user ? user.name : name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  readOnly={!!user}
                  className="w-full bg-transparent border-b border-brand-border py-2 text-brand-black font-sans text-sm focus:outline-none focus:border-brand-gold transition-colors"
                />
              </div>
              <div>
                <label className="block font-sans text-xs tracking-[0.15em] uppercase text-brand-gray mb-2">
                  Role / Title
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Art Collector, Lagos"
                  className="w-full bg-transparent border-b border-brand-border py-2 text-brand-black font-sans text-sm focus:outline-none focus:border-brand-gold transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-sans text-xs tracking-[0.15em] uppercase text-brand-gray mb-2">
              Your Review
            </label>
            <textarea
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="Share your experience..."
              rows={4}
              required
              className="w-full bg-transparent border border-brand-border rounded-[6px] p-4 text-brand-black font-sans text-sm focus:outline-none focus:border-brand-gold transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block font-sans text-xs tracking-[0.15em] uppercase text-brand-gray mb-2">
              Attach Image (optional)
            </label>
            <label className="flex items-center gap-3 p-4 border border-dashed border-brand-border rounded-[6px] cursor-pointer hover:border-brand-gold/50 transition-colors">
              <ImagePlus size={20} className="text-brand-gray shrink-0" />
              <span className="font-sans text-xs text-brand-gray">
                {image ? image.name : 'Upload a photo of your artwork or package'}
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImage}
                className="hidden"
              />
            </label>
            {imagePreview && (
              <div className="relative w-24 h-24 mt-3 rounded-[6px] overflow-hidden border border-brand-border">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={!quote.trim() || rating === 0 || status === 'loading'}
            className="w-full px-8 py-4 bg-brand-gold text-brand-black font-sans text-xs tracking-[0.15em] uppercase font-semibold rounded-[6px] hover:bg-brand-gold-light transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {status === 'loading' && <Loader2 size={16} className="animate-spin" />}
            {status === 'loading' ? 'Submitting...' : 'Submit Review'}
          </button>
        </>
      )}
    </form>
  );
}
