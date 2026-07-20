"use client";

import React, { useEffect, useState } from 'react';
import { ReviewsHero, ReviewCard, ReviewForm, ReviewsStats } from '@/components/reviews';
import { Reveal, StaggerList, StaggerItem } from '@/components/ui';
import { api } from '@/lib/api';
import { Loader2 } from 'lucide-react';

interface Review {
  id: number;
  name: string;
  role: string | null;
  quote: string;
  rating: number;
  image: string | null;
  created_at: string;
}

interface Stats {
  average_rating: number;
  total_reviews: number;
  five_star: number;
  four_star: number;
  three_star: number;
  two_star: number;
  one_star: number;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const [reviewsRes, statsRes] = await Promise.all([
      api.get<{ testimonials: Review[] }>('/testimonials'),
      api.get<Stats>('/testimonials/stats'),
    ]);
    if (reviewsRes.data) setReviews(reviewsRes.data.testimonials);
    if (statsRes.data) setStats(statsRes.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <ReviewsHero />

      <section className="relative w-full px-6 pb-20">
        <div className="max-w-[1400px] mx-auto">
          <Reveal className="mb-20 p-8 md:p-12 rounded-[12px] border border-brand-border bg-brand-white">
            <ReviewsStats stats={stats} />
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            <div className="lg:col-span-2">
              <h3 className="font-display text-text-h2 text-brand-black mb-8">
                Client Reviews
              </h3>
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 size={24} className="animate-spin text-brand-gold" />
                </div>
              ) : reviews.length === 0 ? (
                <p className="font-sans text-brand-gray">No reviews yet. Be the first to share your experience.</p>
              ) : (
                <StaggerList className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {reviews.map((review) => (
                    <StaggerItem key={review.id}>
                      <ReviewCard
                        name={review.name}
                        role={review.role}
                        quote={review.quote}
                        rating={review.rating}
                        image={review.image}
                      />
                    </StaggerItem>
                  ))}
                </StaggerList>
              )}
            </div>

            <div>
              <div className="sticky top-28">
                <h3 className="font-display text-2xl text-brand-black mb-2">Write a Review</h3>
                <p className="font-sans text-sm text-brand-gray mb-8">
                  Share your experience and help others discover our work.
                </p>
                <div className="p-6 md:p-8 rounded-[12px] border border-brand-border bg-brand-white">
                  <ReviewForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
