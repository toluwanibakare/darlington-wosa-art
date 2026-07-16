"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Download, Clock, CheckCircle, Package, Palette, Shield, Truck, Home, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

interface OrderService {
  title?: string;
}

interface Order {
  id: number;
  user_id: number;
  service_id: number;
  order_number: string;
  description?: string;
  amount: string | number;
  status: string;
  payment_method?: string;
  paid_at?: string;
  created_at: string;
  updated_at: string;
  service?: OrderService;
}

interface OrderResponse {
  order: Order;
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Processing',
  design_review: 'Design Review',
  in_production: 'In Production',
  quality_check: 'Quality Check',
  ready: 'Ready for Pickup',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-500/10 text-amber-600',
  confirmed: 'bg-blue-500/10 text-blue-600',
  processing: 'bg-blue-500/10 text-blue-600',
  design_review: 'bg-purple-500/10 text-purple-600',
  in_production: 'bg-blue-500/10 text-blue-600',
  quality_check: 'bg-amber-500/10 text-amber-600',
  ready: 'bg-green-500/10 text-green-600',
  delivered: 'bg-green-500/10 text-green-600',
  cancelled: 'bg-red-500/10 text-red-600',
};

const TIMELINE_STEPS = [
  { label: 'Order Placed', key: 'placed', icon: Package },
  { label: 'Payment Confirmed', key: 'confirmed', icon: CheckCircle },
  { label: 'Design Review', key: 'design_review', icon: Palette },
  { label: 'Production', key: 'in_production', icon: Shield },
  { label: 'Quality Check', key: 'quality_check', icon: Shield },
  { label: 'Ready for Pickup', key: 'ready', icon: Truck },
  { label: 'Delivered', key: 'delivered', icon: Home },
];

const STATUS_PROGRESS: Record<string, number> = {
  pending: 0,
  confirmed: 1,
  design_review: 2,
  in_production: 3,
  quality_check: 4,
  ready: 5,
  delivered: 6,
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}

function formatDateTime(dateStr: string): { date: string; time: string } {
  const d = new Date(dateStr);
  const date = d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  return { date, time };
}

function formatAmount(amount: string | number): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return `NGN ${num.toLocaleString('en-US')}`;
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [order, setOrder] = React.useState<Order | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api.get<OrderResponse>(`/orders/${id}`).then((res) => {
      if (cancelled) return;
      if (res.error) {
        setError(res.error);
      } else if (res.data?.order) {
        setOrder(res.data.order);
      }
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 md:p-10 max-w-[1200px] flex items-center justify-center min-h-[400px]">
        <Loader2 size={24} className="animate-spin text-brand-gold" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="p-6 md:p-10 max-w-[1200px]">
        <p className="font-sans text-sm text-red-600">{error || 'Order not found'}</p>
      </div>
    );
  }

  const orderTitle = order.service?.title || order.description || `Order ${order.order_number}`;
  const statusLabel = STATUS_LABELS[order.status] || order.status;
  const statusColor = STATUS_COLORS[order.status] || 'bg-brand-border text-brand-gray';
  const progressIndex = STATUS_PROGRESS[order.status] ?? -1;

  const created = formatDateTime(order.created_at);
  const updated = formatDateTime(order.updated_at);

  return (
    <div className="p-6 md:p-10 max-w-[1200px]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Back link */}
        <Link href="/dashboard/orders" className="inline-flex items-center gap-2 text-brand-gray/60 hover:text-brand-gold font-sans text-[10px] tracking-[0.15em] uppercase mb-8 transition-colors">
          <ArrowLeft size={12} />
          Back to Orders
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="font-display text-3xl md:text-4xl text-brand-black mb-2">
              {orderTitle}
            </h1>
            <div className="flex flex-wrap items-center gap-4">
              <span className="font-sans text-[10px] tracking-[0.1em] uppercase text-brand-gray/50">{order.order_number}</span>
              <span className={`inline-block px-3 py-1 rounded-full font-sans text-[9px] tracking-[0.1em] uppercase ${statusColor}`}>
                {statusLabel}
              </span>
              <span className="flex items-center gap-1.5 font-sans text-[10px] text-brand-gray/60">
                <Clock size={10} />
                Placed {created.date}
              </span>
            </div>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 border border-brand-border rounded-full font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray hover:text-brand-gold hover:border-brand-gold/30 transition-all duration-300 cursor-pointer">
            <Download size={12} />
            Download Invoice
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <h2 className="font-display text-xl text-brand-black mb-8">Order Timeline</h2>
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[19px] top-0 bottom-0 w-[1px] bg-brand-border" />

              <div className="space-y-0">
                {TIMELINE_STEPS.map((step, i) => {
                  const Icon = step.icon;
                  const completed = i <= progressIndex;
                  const isCurrentStep = i === progressIndex;

                  return (
                    <div key={step.label} className="relative flex gap-6 pb-10 last:pb-0">
                      {/* Dot */}
                      <div className={`relative z-10 w-[38px] h-[38px] rounded-full flex items-center justify-center flex-shrink-0 ${
                        completed
                          ? 'bg-brand-gold text-white'
                          : 'bg-brand-surface border border-brand-border text-brand-gray/40'
                      }`}>
                        <Icon size={16} />
                      </div>

                      {/* Content */}
                      <div className="pt-2">
                        <p className={`font-display text-base ${completed ? 'text-brand-black' : 'text-brand-gray/50'}`}>
                          {step.label}
                        </p>
                        {isCurrentStep && (
                          <p className="font-sans text-xs text-brand-gray/60 mt-1">
                            {updated.date} at {updated.time}
                          </p>
                        )}
                        {step.key === 'placed' && (
                          <p className="font-sans text-xs text-brand-gray/60 mt-1">
                            {created.date} at {created.time}
                          </p>
                        )}
                        {!completed && !isCurrentStep && step.key !== 'placed' && (
                          <p className="font-sans text-xs text-brand-gray/30 mt-1">Pending</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Order Details */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-6"
          >
            <div className="p-6 border border-brand-border rounded-[8px] bg-brand-white/50">
              <h3 className="font-display text-base text-brand-black mb-5">Order Details</h3>
              <div className="space-y-4">
                {[
                  { label: 'Order ID', value: order.order_number },
                  { label: 'Type', value: order.service?.title || order.description || '--' },
                  { label: 'Order Date', value: formatDate(order.created_at) },
                  { label: 'Total', value: formatAmount(order.amount) },
                ].map((detail) => (
                  <div key={detail.label} className="flex justify-between items-center">
                    <span className="font-sans text-[10px] tracking-[0.1em] uppercase text-brand-gray/70">{detail.label}</span>
                    <span className="font-sans text-xs text-brand-black text-right">{detail.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment info */}
            {order.paid_at && (
              <div className="p-6 border border-brand-border rounded-[8px] bg-brand-white/50">
                <h3 className="font-display text-base text-brand-black mb-4">Payment</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-sans text-[10px] tracking-[0.1em] uppercase text-green-600 flex items-center gap-1.5">
                    <CheckCircle size={12} />
                    Paid
                  </span>
                  <span className="font-display text-sm text-brand-black">{formatAmount(order.amount)}</span>
                </div>
                {order.payment_method && (
                  <p className="font-sans text-[10px] text-brand-gray/50">
                    Paid via {order.payment_method} on {formatDate(order.paid_at)}
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
