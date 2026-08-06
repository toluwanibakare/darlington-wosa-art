"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Reveal } from '@/components/ui';
import { Send, Check, Image as ImageIcon, CreditCard, ChevronRight, Loader2, Sparkles } from 'lucide-react';
import { api } from '@/lib/api';

const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", 
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT - Abuja", "Gombe", 
  "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", 
  "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", 
  "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
];

const FRAME_SIZES = [
  { size: '8x10', key: 'frame_price_8x10', def: 5000 },
  { size: '10x12', key: 'frame_price_10x12', def: 7500 },
  { size: '12x16', key: 'frame_price_12x16', def: 10000 },
  { size: '16x20', key: 'frame_price_16x20', def: 15000 },
  { size: '20x24', key: 'frame_price_20x24', def: 22000 },
  { size: '24x30', key: 'frame_price_24x30', def: 30000 },
  { size: '30x40', key: 'frame_price_30x40', def: 45000 },
];

export function ContactForm({ step, onStepChange }: { step?: 'form' | 'checkout' | 'success', onStepChange?: (step: 'form' | 'checkout' | 'success') => void }) {
  const [activeTab, setActiveTab] = useState<'drawing' | 'frame' | 'event' | 'inquiry'>('inquiry');
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // Form states
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    // Custom art / drawing
    width: '12',
    height: '16',
    artType: 'charcoal', // charcoal, pencil, colored-pencil
    giftType: 'none', // none, birthday, anniversary, corporate, memorial
    // Frame Size
    frameSize: '12x16',
    // Delivery Details
    deliveryState: 'Rivers',
    deliveryAddress: '',
    deliveryTimeline: 'standard', // standard (2+ weeks), express (under 2 weeks)
    deliveryDate: '',
    // Event booking
    eventState: 'Rivers',
    eventLocation: '',
    eventType: 'performance', // performance, workshop, exhibition
    expectedGuests: '50',
    eventDate: '',
    eventDuration: '1', // in days or hours
    // Billing/Summary
    referralCode: '',
    couponCode: '',
    saveDetails: true
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [localStep, setLocalStep] = useState<'form' | 'checkout' | 'success'>('form');
  const activeStep = step || localStep;
  const setStep = (val: 'form' | 'checkout' | 'success') => {
    setLocalStep(val);
    if (onStepChange) onStepChange(val);
  };
  const [guestCheckoutChoice, setGuestCheckoutChoice] = useState<boolean | null>(null);
  const [calculatedPrice, setCalculatedPrice] = useState(0);

  // Fetch current user and config settings
  useEffect(() => {
    // Get search param for active tab or checkout success landing
    const params = new URLSearchParams(window.location.search);
    const stepParam = params.get('step');
    if (stepParam === 'success') {
      setStep('success');
      // Clean up localStorage pending values on successful checkout
      try {
        localStorage.removeItem('dwaf_pending_checkout_items');
      } catch (err) {}
    }

    const tabParam = params.get('tab');
    if (tabParam === 'drawing' || tabParam === 'frame' || tabParam === 'event' || tabParam === 'inquiry') {
      setActiveTab(tabParam);
    }

    // Get settings
    api.get<Record<string, string>>('/settings').then(res => {
      if (res.data) setSettings(res.data);
    });

    // Get user if logged in
    const token = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {}
    }
    if (token) {
      api.get<any>('/user').then(res => {
        if (res.data && res.data.user) {
          setCurrentUser(res.data.user);
          localStorage.setItem('user', JSON.stringify(res.data.user));
        }
      });
    }

    // Restore last pending unbooked order details if present
    try {
      const existingPending = JSON.parse(localStorage.getItem('dwaf_pending_checkout_items') || '[]');
      if (existingPending.length > 0) {
        const lastOrder = existingPending[existingPending.length - 1];
        if (lastOrder.formValues) {
          setForm(prev => ({ ...prev, ...lastOrder.formValues }));
          if (lastOrder.category) {
            setActiveTab(lastOrder.category);
          }
        }
      }
    } catch (err) {
      // Silently ignore
    }
  }, []);

  // Sync user details when currentUser state changes
  useEffect(() => {
    if (currentUser) {
      setForm(prev => ({
        ...prev,
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        deliveryAddress: currentUser.address || '',
        deliveryState: currentUser.city || 'Rivers'
      }));
    }
  }, [currentUser]);

  // Recalculate price dynamically when dimensions or size options change
  useEffect(() => {
    // Check timeline premium (express = 20% extra fee, adjustable in admin settings)
    const expressMultiplier = parseFloat(settings['express_fee_multiplier'] || '1.20');
    const isExpress = form.deliveryTimeline === 'express';

    if (activeTab === 'drawing') {
      const w = parseFloat(form.width) || 0;
      const h = parseFloat(form.height) || 0;
      let rate = parseFloat(settings['charcoal_price_per_sq_inch'] || '270');
      if (rate < 10) rate *= 100; // normalize old 2.70 database value to 270
      let price = w * h * rate;
      if (isExpress) price *= expressMultiplier;
      setCalculatedPrice(Math.round(price));
    } else if (activeTab === 'frame') {
      const sizeObj = FRAME_SIZES.find(s => s.size === form.frameSize);
      if (sizeObj) {
        // Extract dimensions e.g. 12x16 -> w=12, h=16
        const [wStr, hStr] = sizeObj.size.split('x');
        const w = parseFloat(wStr) || 0;
        const h = parseFloat(hStr) || 0;
        // Use setting rate if configured (e.g. frame_price_12x16 key).
        // If the settings contains a value, check if it's the total price (like 10000) or UPPSI rate (like 270).
        // Let's divide by w*h if the admin typed a total price, or check if it represents UPPSI directly.
        // The user says: "12 * 16 * 270, which is the base price, which is supposed to be 51,840. That's how you do it for all the sizes."
        // So they want the rate to be 270 NGN per square inch.
        let uppsiSetting = parseFloat(settings[sizeObj.key] || '');
        if (!isNaN(uppsiSetting) && uppsiSetting < 10) {
          uppsiSetting *= 100; // normalize decimal to full number (e.g. 2.70 to 270)
        }
        const uppsi = !isNaN(uppsiSetting) ? (uppsiSetting > 1000 ? (uppsiSetting / (w * h)) : uppsiSetting) : 270;
        let price = (w * h) * uppsi;
        if (isExpress) price *= expressMultiplier;
        setCalculatedPrice(Math.round(price));
      }
    } else {
      setCalculatedPrice(0);
    }
  }, [form.width, form.height, form.frameSize, form.deliveryTimeline, activeTab, settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (e.target.name === 'drawingSize') {
      const [w, h] = e.target.value.split('x');
      setForm(prev => ({ ...prev, width: w, height: h }));
      return;
    }
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleProceedToCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'drawing' || activeTab === 'frame') {
      // Timeline Validation Check: Compare selected date to today
      if (form.deliveryDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selectedDate = new Date(form.deliveryDate);
        selectedDate.setHours(0, 0, 0, 0);

        const diffTime = selectedDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
          setStatusMsg({ type: 'error', text: 'Preferred delivery date cannot be in the past. Please select a valid future date.' });
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }

        if (diffDays < 14 && form.deliveryTimeline === 'standard') {
          setStatusMsg({ 
            type: 'error', 
            text: `The selected date (${form.deliveryDate}) is under 2 weeks from today. Please switch the Delivery Timeline to 'Express Delivery' to select this date, or choose a later date.` 
          });
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
      }

      // Persist pending order to local storage cart list so user can always reload it if they return
      try {
        const pendingItem = {
          id: 'PENDING-' + Date.now(),
          category: activeTab,
          details: activeTab === 'frame' ? form.frameSize : `${form.width}x${form.height} inches (${form.artType})`,
          price: calculatedPrice,
          formValues: { ...form },
          timestamp: new Date().toISOString()
        };
        const existingPending = JSON.parse(localStorage.getItem('dwaf_pending_checkout_items') || '[]');
        existingPending.push(pendingItem);
        localStorage.setItem('dwaf_pending_checkout_items', JSON.stringify(existingPending));
      } catch (err) {
        // Silently skip if local storage is restricted
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
      setStep('checkout');
    } else {
      // Direct submission for Events and General inquiries (no payment needed upfront)
      handleSubmitDirect();
    }
  };

  const handleSubmitDirect = async () => {
    setLoading(true);
    setStatusMsg(null);

    // Save profile details if checked
    if (form.saveDetails && currentUser) {
      await api.put('/profile', {
        name: form.name,
        phone: form.phone
      });
    }

    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        subject: `Start Project: ${activeTab.toUpperCase()}`,
        message: `
          Category: ${activeTab.toUpperCase()}
          Message: ${form.message}
          ${activeTab === 'event' ? `State: ${form.eventState}\nLocation: ${form.eventLocation}\nEvent Date: ${form.eventDate}\nEvent Duration: ${form.eventDuration}\nEvent Type: ${form.eventType}\nExpected Guests: ${form.expectedGuests}` : `Delivery State: ${form.deliveryState}\nDelivery Address: ${form.deliveryAddress}\nTimeline: ${form.deliveryTimeline}\nDate: ${form.deliveryDate}`}
        `
      };

      const res = await api.post('/contact', payload);
      if (res.data) {
        setStep('success');
      } else {
        setStatusMsg({ type: 'error', text: 'Failed to submit booking. Please try again.' });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Something went wrong. Please check your network connection.' });
    } finally {
      setLoading(false);
    }
  };

  const handleKorapayPayment = async () => {
    setLoading(true);
    setStatusMsg(null);

    const ref = 'DWAF-' + Math.floor(Math.random() * 1000000000);
    const amount = calculatedPrice;

    try {
      const orderDescription = `
        Category: ${activeTab.toUpperCase()}
        Dimensions / Details: ${activeTab === 'frame' ? form.frameSize : `${form.width}x${form.height} inches (${form.artType})`}
        Customer Name: ${form.name}
        Customer Email: ${form.email}
        Customer Phone: ${form.phone}
        Notes: ${form.message}
        Gift Type: ${form.giftType}
        Delivery State: ${form.deliveryState}
        Delivery Address: ${form.deliveryAddress}
        Timeline: ${form.deliveryTimeline}
        Preferred Date: ${form.deliveryDate}
      `;

      // Client-side validation checks
      if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
        setStatusMsg({ type: 'error', text: 'Please fill in your name, email address, and phone number before proceeding.' });
        setLoading(false);
        return;
      }

      // 1. Create a pending order on the backend first to get an ID & save state
      const orderPayload = {
        amount: amount,
        description: orderDescription,
        payment_method: 'korapay',
        referral_code: form.referralCode,
        coupon_code: form.couponCode
      };

      if (form.saveDetails && currentUser) {
        // Clean parameters to ensure they pass Laravel's validation rules
        const profilePayload: any = {
          name: form.name.trim(),
          phone: form.phone.trim().substring(0, 20)
        };
        if (form.deliveryAddress.trim()) profilePayload.address = form.deliveryAddress.trim();
        if (form.deliveryState.trim()) profilePayload.city = form.deliveryState.trim();

        await api.put('/profile', profilePayload);
      }

      const orderRes = await api.post<any>('/orders', orderPayload);
      if (!orderRes.data) {
        setStatusMsg({ type: 'error', text: 'Failed to create order request. Please try again.' });
        setLoading(false);
        return;
      }

      // 2. Initialize Korapay payment charge redirect link
      const payPayload = {
        amount: amount,
        reference: orderRes.data.order?.order_number || ref,
        customer_email: form.email.trim(),
        customer_name: form.name.trim(),
        redirect_url: window.location.origin + '/contact?step=success',
        metadata: {
          order_id: orderRes.data.order?.id,
          category: activeTab
        }
      };

      const payRes = await api.post<any>('/payments/initialize', payPayload);
      if (payRes.data?.success && payRes.data?.data?.authorization_url) {
        // Redirect to Korapay secure checkout in the same window
        window.location.href = payRes.data.data.authorization_url;
      } else {
        const errorDetail = payRes.data?.error?.message || payRes.data?.message || 'Failed to initialize payment gateway.';
        setStatusMsg({ type: 'error', text: errorDetail });
      }
    } catch (e: any) {
      const errMsg = e.response?.data?.error?.message || e.response?.data?.message || 'An unexpected connection error occurred.';
      setStatusMsg({ type: 'error', text: errMsg });
    } finally {
      setLoading(false);
    }
  };

  const labelClass = "font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/80";
  const inputClass = "w-full bg-transparent border-b border-brand-border pb-2.5 pt-1 text-sm text-brand-black placeholder:text-brand-gray/30 focus:outline-none focus:border-brand-gold transition-colors font-sans";
  const selectClass = "w-full bg-transparent border-b border-brand-border pb-2.5 pt-1 text-sm text-brand-black focus:outline-none focus:border-brand-gold transition-colors font-sans cursor-pointer [&>option]:bg-brand-surface [&>option]:text-brand-black";

  if (activeStep === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-12 md:p-16 border border-brand-border rounded-[8px] bg-brand-white/50 text-center"
      >
        <div className="w-14 h-14 rounded-full bg-brand-gold/10 flex items-center justify-center mx-auto mb-6">
          <Check size={24} className="text-brand-gold" />
        </div>
        <h3 className="font-display text-2xl text-brand-black mb-4">
          Order Request Sent
        </h3>
        <p className="font-sans text-brand-gray text-sm max-w-md mx-auto leading-relaxed mb-6">
          Thank you. Your project request has been logged. A confirmation email has been sent to {form.email}. We will review the details and start work or get back to you shortly.
        </p>
        <Button variant="primary" onClick={() => { setStep('form'); setForm(p => ({ ...p, message: '' })); setImageFile(null); setImagePreview(null); }}>
          Start Another Project
        </Button>
      </motion.div>
    );
  }

  if (activeStep === 'checkout') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 md:p-12 border border-brand-border rounded-[8px] bg-brand-white/50 space-y-8"
      >
        <div>
          <h3 className="font-display text-xl text-brand-black mb-1">Order Details & Summary</h3>
          <p className="font-sans text-xs text-brand-gray">Confirm items and select codes before completing payment</p>
        </div>

        <div className="border border-brand-border rounded-[8px] bg-brand-surface/40 p-6 space-y-4">
          <div className="flex justify-between items-center text-sm font-sans">
            <span className="text-brand-gray font-medium">Selected Category</span>
            <span className="text-brand-black font-semibold uppercase">{activeTab === 'drawing' ? 'Charcoal / Pencil Drawing' : 'Custom Frame'}</span>
          </div>

          {activeTab === 'drawing' ? (
            <div className="flex justify-between items-center text-sm font-sans">
              <span className="text-brand-gray">Dimensions</span>
              <span className="text-brand-black font-medium">{form.width} x {form.height} inches</span>
            </div>
          ) : (
            <div className="flex justify-between items-center text-sm font-sans">
              <span className="text-brand-gray">Selected Size</span>
              <span className="text-brand-black font-medium">{form.frameSize} inches</span>
            </div>
          )}

          <div className="flex justify-between items-center text-sm font-sans">
            <span className="text-brand-gray">Customer Email</span>
            <span className="text-brand-black font-medium">{form.email}</span>
          </div>

          {(activeTab === 'drawing' || activeTab === 'frame') && (
            <div className="flex justify-between items-center text-sm font-sans border-t border-brand-border/40 pt-2">
              <span className="text-brand-gray">Delivery Timeline</span>
              <span className="text-brand-black font-medium capitalize">
                {form.deliveryTimeline === 'express' ? 'Express Delivery (Under 2 Weeks - +20% Express Fee)' : 'Standard Delivery (2+ Weeks)'}
              </span>
            </div>
          )}

          {imagePreview && (
            <div className="flex items-center gap-3 pt-2">
              <span className="text-sm font-sans text-brand-gray">Uploaded Reference</span>
              <img src={imagePreview} className="w-12 h-12 object-cover rounded border border-brand-border" alt="Preview" />
            </div>
          )}

          <div className="border-t border-brand-border pt-4 flex justify-between items-center">
            <span className="font-sans text-sm text-brand-black font-semibold">Total Price</span>
            <span className="font-display text-xl text-brand-gold font-bold">₦{calculatedPrice.toLocaleString()}</span>
          </div>
        </div>

        {/* Promo Codes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Referral Code (Optional)</label>
            <input
              type="text"
              name="referralCode"
              value={form.referralCode}
              onChange={handleChange}
              placeholder="e.g. DWAF12345"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Coupon Code (Optional)</label>
            <input
              type="text"
              name="couponCode"
              value={form.couponCode}
              onChange={handleChange}
              placeholder="e.g. ARTSTART5"
              className={inputClass}
            />
          </div>
        </div>

        {statusMsg && (
          <p className={`font-sans text-xs ${statusMsg.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
            {statusMsg.text}
          </p>
        )}

        <div className="flex gap-4 pt-4">
          <Button variant="secondary" onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setStep('form'); }} disabled={loading}>
            Back to Details
          </Button>
          <Button variant="primary" className="flex-1" onClick={handleKorapayPayment} disabled={loading}>
            {loading ? <Loader2 className="animate-spin inline-block mr-2" size={14} /> : <CreditCard className="inline-block mr-2" size={14} />}
            Pay Now with Korapay
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Category selector */}
      <div className="flex flex-wrap gap-2 border-b border-brand-border pb-6">
        {[
          { id: 'inquiry', label: 'General Inquiry' },
          { id: 'drawing', label: 'Buy a Painting / Get Drawing' },
          { id: 'frame', label: 'Select a Frame' },
          { id: 'event', label: 'Book an Event' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id as any); setStatusMsg(null); }}
            className={`px-4 py-2 rounded-full font-sans text-[10px] tracking-[0.12em] uppercase transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-brand-gold text-brand-black font-semibold'
                : 'border border-brand-border text-brand-gray hover:border-brand-gold/60 hover:text-brand-black'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {!currentUser && !guestCheckoutChoice && activeTab !== 'inquiry' ? (
        <div className="border border-brand-border rounded-[8px] bg-brand-white/40 p-8 text-center space-y-6 animate-fade-in font-sans">
          <h4 className="font-display text-lg text-brand-black">Complete Your Request</h4>
          <p className="text-sm text-brand-gray max-w-md mx-auto">
            Log in to automatically pre-fill your order details and track updates in your dashboard, or continue directly as a guest.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <a
              href={`/login?redirect=/contact?tab=${activeTab}`}
              className="px-6 py-3 border border-brand-gold text-brand-black hover:bg-brand-gold hover:text-brand-black transition-colors rounded-[8px] text-xs uppercase tracking-wider font-semibold animate-pulse"
            >
              Log In
            </a>
            <button
              onClick={() => setGuestCheckoutChoice(true)}
              className="px-6 py-3 bg-brand-black text-brand-white hover:bg-brand-black/90 transition-colors rounded-[8px] text-xs uppercase tracking-wider font-semibold"
            >
              Continue as Guest
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleProceedToCheckout} className="space-y-8">
        
        {/* Step 1: Customer Contact Details */}
        <div className="border border-brand-border rounded-[8px] bg-brand-white/40 p-6 space-y-6">
          <h4 className="font-display text-sm text-brand-black border-b border-brand-border pb-2">Your Contact Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Full Name</label>
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Email Address</label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>WhatsApp / Phone Number</label>
            <input
              type="tel"
              name="phone"
              required
              value={form.phone}
              onChange={handleChange}
              placeholder="e.g. +234 813 774 4824"
              className={inputClass}
            />
          </div>

          {/* Delivery State & Address (Only for Physical orders like drawing and frame) */}
          {(activeTab === 'drawing' || activeTab === 'frame') && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-brand-border/40">
                <div>
                  <label className={labelClass}>Delivery State (Nigeria)</label>
                  <select name="deliveryState" value={form.deliveryState} onChange={handleChange} className={selectClass}>
                    {NIGERIAN_STATES.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                  <p className="text-[10px] font-sans text-brand-gray mt-1">Delivery logistics will be calculated & discussed later.</p>
                </div>
                <div>
                  <label className={labelClass}>Delivery Address / Location</label>
                  <input
                    type="text"
                    name="deliveryAddress"
                    required
                    value={form.deliveryAddress}
                    onChange={handleChange}
                    placeholder="e.g. 14 Airport Road, Port Harcourt"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div>
                  <label className={labelClass}>Delivery Timeline</label>
                  <select name="deliveryTimeline" value={form.deliveryTimeline} onChange={handleChange} className={selectClass}>
                    <option value="standard">Standard Delivery (2+ Weeks)</option>
                    <option value="express">Express Delivery (Under 2 Weeks - 20% extra fee)</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Preferred Delivery Date</label>
                  <input
                    type="date"
                    name="deliveryDate"
                    required
                    value={form.deliveryDate}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>
            </>
          )}

          {currentUser && (
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="saveDetails"
                name="saveDetails"
                checked={form.saveDetails}
                onChange={(e) => setForm(p => ({ ...p, saveDetails: e.target.checked }))}
                className="rounded border-brand-border text-brand-gold focus:ring-brand-gold cursor-pointer"
              />
              <label htmlFor="saveDetails" className="font-sans text-[11px] text-brand-gray cursor-pointer">
                Save these details as my account profile contact info
              </label>
            </div>
          )}
        </div>

        {/* Tab-specific Content */}
        {activeTab === 'inquiry' && (
          <div className="space-y-6">
            <div>
              <label className={labelClass}>Additional Details / Message</label>
              <textarea
                name="message"
                rows={4}
                required
                value={form.message}
                onChange={handleChange}
                placeholder="How can we help you?"
                className={`${inputClass} resize-none`}
              />
            </div>
          </div>
        )}

        {activeTab === 'drawing' && (
          <div className="space-y-6 border border-brand-border rounded-[8px] p-6 bg-brand-white/40">
            <h4 className="font-display text-sm text-brand-black border-b border-brand-border pb-2">Drawing / Painting Details</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Medium Type</label>
                <select name="artType" value={form.artType} onChange={handleChange} className={selectClass}>
                  <option value="charcoal">Charcoal Portrait</option>
                  <option value="pencil">Pencil Realism Sketch</option>
                  <option value="painting">Acrylic / Oil Painting</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Artwork Occasion / Purpose</label>
                <select name="giftType" value={form.giftType} onChange={handleChange} className={selectClass}>
                  <option value="none">Personal Display</option>
                  <option value="birthday">Birthday Gift</option>
                  <option value="anniversary">Anniversary</option>
                  <option value="memorial">Memorial Tribute</option>
                  <option value="corporate">Corporate Office</option>
                </select>
              </div>
            </div>

            <div>
              <label className={labelClass}>Select Artwork size</label>
              <select
                name="drawingSize"
                value={`${form.width}x${form.height}`}
                onChange={handleChange}
                className={selectClass}
              >
                <option value="8x10">8 x 10 inches</option>
                <option value="10x12">10 x 12 inches</option>
                <option value="12x16">12 x 16 inches</option>
                <option value="16x20">16 x 20 inches</option>
                <option value="20x24">20 x 24 inches</option>
                <option value="24x30">24 x 30 inches</option>
                <option value="30x40">30 x 40 inches</option>
              </select>
            </div>

            {/* Frame Size visual scale guide */}
            <div>
              <span className={labelClass}>Artwork / Frame human size scale comparison chart</span>
              <div className="mt-2 border border-brand-border rounded-[8px] overflow-hidden bg-brand-surface/30">
                <img
                  src="/frame_human_scale.jpg"
                  alt="Artwork scale reference beside a human outline"
                  className="w-full h-auto object-cover max-h-[300px]"
                />
              </div>
            </div>

            {/* Reference Image upload */}
            <div>
              <label className={labelClass}>Reference Image to Draw</label>
              <div className="mt-2 border-2 border-dashed border-brand-border/60 hover:border-brand-gold/50 rounded-[8px] p-6 text-center cursor-pointer transition-colors relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                {imagePreview ? (
                  <div className="flex flex-col items-center gap-2">
                    <img src={imagePreview} className="max-h-32 rounded border border-brand-border" alt="Reference upload" />
                    <span className="font-sans text-xs text-brand-gold font-medium">Change Image</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-brand-gray/60">
                    <ImageIcon size={28} />
                    <span className="font-sans text-xs">Click or drag portrait reference image here</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className={labelClass}>Additional Message</label>
              <textarea
                name="message"
                rows={3}
                value={form.message}
                onChange={handleChange}
                placeholder="Tell us any specific details (e.g. merge multiple photos, add gold foil etc.)"
                className={`${inputClass} resize-none`}
              />
            </div>

            {/* Price Preview */}
            <div className="border-t border-brand-border pt-4 flex justify-between items-center">
              <span className="font-sans text-sm text-brand-black">Estimated Price</span>
              <span className="font-display text-xl text-brand-gold font-bold">₦{calculatedPrice.toLocaleString()}</span>
            </div>
          </div>
        )}

        {activeTab === 'frame' && (
          <div className="space-y-6 border border-brand-border rounded-[8px] p-6 bg-brand-white/40">
            <h4 className="font-display text-sm text-brand-black border-b border-brand-border pb-2">Custom Framing Layout</h4>
            
            {/* Frame Template visual display with human scale */}
            <div>
              <span className={labelClass}>Frame Size scale comparison chart</span>
              <div className="mt-2 border border-brand-border rounded-[8px] overflow-hidden bg-brand-surface/30">
                <img
                  src="/frame_human_scale.jpg"
                  alt="Frame Size Chart Human Scale Reference"
                  className="w-full h-auto object-cover max-h-[300px]"
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Select Frame Size & View Price</label>
              <select name="frameSize" value={form.frameSize} onChange={handleChange} className={selectClass}>
                {FRAME_SIZES.map(sz => {
                  const val = parseFloat(settings[sz.key] || String(sz.def));
                  return (
                    <option key={sz.size} value={sz.size}>
                      {sz.size} inches (₦{val.toLocaleString()})
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Reference Image upload */}
            <div>
              <label className={labelClass}>Artwork Image to put in Frame</label>
              <div className="mt-2 border-2 border-dashed border-brand-border/60 hover:border-brand-gold/50 rounded-[8px] p-6 text-center cursor-pointer transition-colors relative font-sans">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                {imagePreview ? (
                  <div className="flex flex-col items-center gap-2">
                    <img src={imagePreview} className="max-h-32 rounded border border-brand-border animate-fade-in" alt="Reference upload" />
                    <span className="font-sans text-xs text-brand-gold font-medium">Change Image</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-brand-gray/60">
                    <ImageIcon size={28} />
                    <span className="font-sans text-xs">Upload the image you want framed</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className={labelClass}>Framing Message / Specification</label>
              <textarea
                name="message"
                rows={3}
                value={form.message}
                onChange={handleChange}
                placeholder="Any preference for frame wood style, mount board width or glass options?"
                className={`${inputClass} resize-none`}
              />
            </div>

            {/* Price Preview */}
            <div className="border-t border-brand-border pt-4 flex justify-between items-center">
              <span className="font-sans text-sm text-brand-black">Selected Frame Price</span>
              <span className="font-display text-xl text-brand-gold font-bold">₦{calculatedPrice.toLocaleString()}</span>
            </div>
          </div>
        )}

        {activeTab === 'event' && (
          <div className="space-y-6 border border-brand-border rounded-[8px] p-6 bg-brand-white/40">
            <h4 className="font-display text-sm text-brand-black border-b border-brand-border pb-2">Event Booking details</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>State in Nigeria</label>
                <select name="eventState" value={form.eventState} onChange={handleChange} className={selectClass}>
                  {NIGERIAN_STATES.map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Location / Hall / Address</label>
                <input
                  type="text"
                  name="eventLocation"
                  required
                  value={form.eventLocation}
                  onChange={handleChange}
                  placeholder="e.g. Presidential Hotel, Port Harcourt"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Showcase / Event Type</label>
                <select name="eventType" value={form.eventType} onChange={handleChange} className={selectClass}>
                  <option value="performance">Live Art / Sketch Performance</option>
                  <option value="workshop">Creative Art Workshop</option>
                  <option value="exhibition">Art Exhibition Showcase</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Expected Guests</label>
                <input
                  type="number"
                  name="expectedGuests"
                  value={form.expectedGuests}
                  onChange={handleChange}
                  placeholder="e.g. 150"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Event Date</label>
                <input
                  type="date"
                  name="eventDate"
                  required
                  value={form.eventDate}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Event Duration (Hours/Days)</label>
                <input
                  type="text"
                  name="eventDuration"
                  required
                  value={form.eventDuration}
                  onChange={handleChange}
                  placeholder="e.g. 5 hours, 3 days"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Art expectations / Showcase request</label>
              <textarea
                name="message"
                rows={4}
                required
                value={form.message}
                onChange={handleChange}
                placeholder="What kind of art style do you expect? Any specific details about event flow?"
                className={`${inputClass} resize-none`}
              />
            </div>
          </div>
        )}

        {statusMsg && (
          <p className={`font-sans text-xs ${statusMsg.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
            {statusMsg.text}
          </p>
        )}

        <div>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? <Loader2 className="animate-spin inline-block mr-2" size={14} /> : null}
            {activeTab === 'drawing' || activeTab === 'frame' ? 'Proceed to Order Details' : 'Submit Event Request'}
            <ChevronRight size={14} className="ml-2 inline-block" />
          </Button>
        </div>

      </form>
      )}
    </div>
  );
}
