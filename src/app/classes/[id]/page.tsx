"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Clock,
  Users,
  MapPin,
  Star,
  CheckCircle,
  ChevronRight,
  CalendarDays,
  Loader2,
  GraduationCap,
} from 'lucide-react';

const CLASSES = [
  {
    id: 'single-session',
    title: 'Single Session',
    description: 'A one-on-one guided art session tailored to your skill level. Perfect for beginners wanting to try or experienced artists looking for focused guidance.',
    duration: '2 hours',
    price: '₦25,000',
    seats: 5,
    instructor: 'Darlington Wosa',
    location: 'Online / Studio',
    level: 'All Levels',
    fullDescription: 'This private session is designed to meet you exactly where you are in your artistic journey. Whether you are picking up a pencil for the first time or refining advanced charcoal techniques, Darlington will tailor the instruction to your goals. Each session includes personalized feedback, live demonstrations, and reference materials to take home.',
    includes: ['Personalized one-on-one instruction', 'Live demonstration of techniques', 'Reference materials provided', 'Feedback on your work', 'Q&A session'],
  },
  {
    id: 'monthly-package',
    title: 'Monthly Package',
    description: 'Four weekly sessions offering structured progression. Includes personalized feedback, reference materials, and homework assignments.',
    duration: '4 sessions (8 hrs)',
    price: '₦80,000',
    seats: 8,
    instructor: 'Darlington Wosa',
    location: 'Online / Studio',
    level: 'All Levels',
    fullDescription: 'Our most popular package for serious students. Over four structured weekly sessions, you will build skills progressively with guided homework between classes. Each week focuses on a different aspect of hyper-realistic drawing, from fundamentals to advanced rendering techniques.',
    includes: ['4 structured weekly sessions', 'Personalized feedback on homework', 'Progress tracking', 'Reference materials', 'Certificate of completion', 'Access to recorded sessions'],
  },
  {
    id: 'beginner-workshop',
    title: 'Beginner Workshop',
    description: 'An intensive workshop covering charcoal and pencil fundamentals. Learn shading, proportion, texture, and composition from the ground up.',
    duration: '3 hours',
    price: '₦15,000',
    seats: 15,
    instructor: 'Darlington Wosa',
    location: 'Studio, Rivers State',
    level: 'Beginner',
    fullDescription: 'A perfect starting point for absolute beginners. This intensive workshop covers the core principles of drawing: understanding value, mastering proportion, creating texture, and composing balanced artworks. All materials are provided — just bring your enthusiasm.',
    includes: ['All materials provided', 'Step-by-step instruction', 'Take-home practice guide', 'Certificate of participation', 'Light refreshments'],
  },
  {
    id: 'group-session',
    title: 'Group Session',
    description: 'Bring your friends or family for a creative group experience. Ideal for team building, birthday parties, or social gatherings.',
    duration: '2.5 hours',
    price: '₦12,000/pp',
    seats: 12,
    instructor: 'Darlington Wosa',
    location: 'Studio, Rivers State',
    level: 'All Levels',
    fullDescription: 'A fun, collaborative art experience for groups of 4-12 people. Perfect for corporate team building, birthday celebrations, or a creative outing with friends. Each participant creates their own artwork under Darlington\'s guidance, with all materials included.',
    includes: ['All materials included', 'Group photo with artworks', 'Take-home artwork', 'Customizable theme available', 'Refreshments included'],
  },
  {
    id: 'private-class',
    title: 'Private Class',
    description: 'Exclusive one-on-one mentorship with Darlington. Custom curriculum designed around your goals, medium preferences, and schedule.',
    duration: 'Flexible',
    price: '₦50,000/session',
    seats: 1,
    instructor: 'Darlington Wosa',
    location: 'Studio / Online',
    level: 'All Levels',
    fullDescription: 'The ultimate personalized learning experience. Darlington designs a custom curriculum based on your artistic goals, preferred medium (charcoal, pencil, mixed media), and schedule. Sessions can be held at the studio or online, with flexible timing to accommodate your lifestyle.',
    includes: ['Custom curriculum design', 'Flexible scheduling', 'Choice of medium', 'Advanced techniques', 'Portfolio review', 'Priority support'],
  },
];

const TIME_SLOTS = ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'];

const STEPS = ['Select Date & Time', 'Your Details', 'Confirmation'];

export default function ClassBookingPage() {
  const params = useParams();
  const classData = CLASSES.find((c) => c.id === params.id);

  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [form, setForm] = useState({ name: '', phone: '', email: '', notes: '' });

  if (!classData) {
    return (
      <div className="min-h-screen bg-brand-surface flex items-center justify-center px-6">
        <div className="text-center">
          <GraduationCap size={48} className="text-brand-gray/20 mx-auto mb-6" />
          <h1 className="font-display text-2xl text-brand-black mb-4">Class Not Found</h1>
          <p className="font-sans text-sm text-brand-gray mb-8">The class you are looking for does not exist.</p>
          <Link href="/classes" className="inline-flex items-center gap-2 text-brand-gold font-sans text-xs tracking-[0.15em] uppercase hover:text-brand-gold-light transition-colors">
            <ArrowLeft size={14} />
            Back to Classes
          </Link>
        </div>
      </div>
    );
  }

  const generateDateOptions = () => {
    const options = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const dayName = dayNames[date.getDay()];
      const month = monthNames[date.getMonth()];
      const day = date.getDate();
      const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      options.push({
        label: `${dayName}, ${month} ${day}`,
        value,
        disabled: date.getDay() === 0,
      });
    }
    return options;
  };

  const dateOptions = generateDateOptions();

  const handleContinue = () => {
    if (step < 2) setStep(step + 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsComplete(true);
    }, 2000);
  };

  const availableDates = dateOptions.filter((d) => !d.disabled);
  const fd = (delay: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] as const },
  });

  if (isComplete) {
    return (
      <div className="min-h-screen bg-brand-surface">
        <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-20" style={{ backgroundImage: 'var(--bg-noise)' }} />
        <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-lg"
          >
            <div className="w-20 h-20 rounded-full bg-brand-gold/10 flex items-center justify-center mx-auto mb-8">
              <CheckCircle size={36} className="text-brand-gold" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl text-brand-black mb-4">Booking Confirmed!</h1>
            <p className="font-sans text-sm text-brand-gray leading-relaxed mb-2">
              Your {classData.title} has been booked successfully.
            </p>
            <p className="font-sans text-sm text-brand-gray/60 mb-8">
              A confirmation email has been sent to {form.email}. You can view your booking details in your dashboard.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/dashboard/bookings"
                className="inline-flex items-center gap-2 px-8 py-4 bg-brand-black text-brand-white border border-brand-gold rounded-[6px] font-sans text-[11px] tracking-[0.2em] uppercase transition-all duration-500 hover:shadow-[0_0_30px_rgba(158,101,27,0.15)] group"
              >
                <span className="relative z-10 flex items-center gap-2 group-hover:text-brand-black transition-colors duration-[400ms]">
                  View My Bookings
                  <ChevronRight size={14} />
                </span>
              </Link>
              <Link
                href="/classes"
                className="font-sans text-xs text-brand-gold hover:text-brand-gold-light transition-colors underline underline-offset-4"
              >
                Book Another Class
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-surface">
      <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-20" style={{ backgroundImage: 'var(--bg-noise)' }} />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 pt-32 pb-24">
        {/* Back */}
        <Link href="/classes" className="inline-flex items-center gap-2 text-brand-gray/60 hover:text-brand-gold font-sans text-[10px] tracking-[0.15em] uppercase mb-10 transition-colors">
          <ArrowLeft size={12} />
          Back to Classes
        </Link>

        {/* Header */}
        <motion.div {...fd(0)} className="mb-12">
          <span className="font-sans text-[11px] tracking-[0.2em] uppercase text-brand-gold block mb-4">Book a Class</span>
          <h1 className="font-display text-3xl md:text-4xl text-brand-black mb-3">{classData.title}</h1>
          <p className="font-sans text-sm text-brand-gray max-w-2xl">{classData.fullDescription}</p>
        </motion.div>

        {/* Steps indicator */}
        <div className="flex items-center gap-3 mb-12">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
                i <= step ? 'bg-brand-gold text-white' : 'bg-brand-border text-brand-gray/50'
              }`}>
                <span className="font-sans text-[10px] font-medium">{i + 1}</span>
              </div>
              <span className={`font-sans text-[10px] tracking-[0.15em] uppercase hidden sm:block transition-colors duration-500 ${
                i <= step ? 'text-brand-black' : 'text-brand-gray/40'
              }`}>
                {s}
              </span>
              {i < STEPS.length - 1 && (
                <div className={`w-10 h-[1px] transition-colors duration-500 ${i < step ? 'bg-brand-gold' : 'bg-brand-border'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="p-8 border border-brand-border rounded-[8px] bg-brand-white/50">
                {step === 0 && (
                  <div>
                    <h2 className="font-display text-xl text-brand-black mb-6">Select Date & Time</h2>

                    {/* Date Selection */}
                    <div className="mb-8">
                      <label className="font-sans text-[11px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-4">
                        Available Dates
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {availableDates.map((d) => (
                          <button
                            key={d.value}
                            onClick={() => setSelectedDate(d.value)}
                            disabled={d.disabled}
                            className={`py-3 px-4 rounded-[6px] border text-center transition-all duration-300 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
                              selectedDate === d.value
                                ? 'bg-brand-black text-brand-white border-brand-black'
                                : 'bg-transparent text-brand-gray border-brand-border hover:border-brand-gold/30 hover:text-brand-black'
                            }`}
                          >
                            <span className="font-sans text-[11px]">{d.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Time Selection */}
                    <div className="mb-8">
                      <label className="font-sans text-[11px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-4">
                        Available Time Slots
                      </label>
                      <div className="flex flex-wrap gap-3">
                        {TIME_SLOTS.map((time) => (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            disabled={!selectedDate}
                            className={`py-3 px-5 rounded-[6px] border text-center transition-all duration-300 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
                              selectedTime === time
                                ? 'bg-brand-black text-brand-white border-brand-black'
                                : 'bg-transparent text-brand-gray border-brand-border hover:border-brand-gold/30 hover:text-brand-black'
                            }`}
                          >
                            <span className="font-sans text-[11px]">{time}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div>
                    <h2 className="font-display text-xl text-brand-black mb-6">Your Details</h2>
                    <div className="space-y-6">
                      <div>
                        <label className="font-sans text-[11px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-3">Full Name</label>
                        <input
                          type="text"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full bg-transparent border-b border-brand-border pb-3 pt-1 text-sm text-brand-black placeholder:text-brand-gray/40 focus:outline-none focus:border-brand-gold transition-colors font-sans"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label className="font-sans text-[11px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-3">Phone Number</label>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          className="w-full bg-transparent border-b border-brand-border pb-3 pt-1 text-sm text-brand-black placeholder:text-brand-gray/40 focus:outline-none focus:border-brand-gold transition-colors font-sans"
                          placeholder="+234 800 000 0000"
                        />
                      </div>
                      <div>
                        <label className="font-sans text-[11px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-3">Email Address</label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="w-full bg-transparent border-b border-brand-border pb-3 pt-1 text-sm text-brand-black placeholder:text-brand-gray/40 focus:outline-none focus:border-brand-gold transition-colors font-sans"
                          placeholder="your@email.com"
                        />
                      </div>
                      <div>
                        <label className="font-sans text-[11px] tracking-[0.15em] uppercase text-brand-gray/70 block mb-3">Notes (Optional)</label>
                        <textarea
                          rows={3}
                          value={form.notes}
                          onChange={(e) => setForm({ ...form, notes: e.target.value })}
                          className="w-full bg-transparent border-b border-brand-border pb-3 pt-1 text-sm text-brand-black placeholder:text-brand-gray/40 focus:outline-none focus:border-brand-gold transition-colors font-sans resize-none"
                          placeholder="Any special requests or questions..."
                        />
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <h2 className="font-display text-xl text-brand-black mb-6">Confirm Your Booking</h2>
                    <div className="space-y-4 mb-8">
                      <div className="flex items-center gap-4 p-4 border border-brand-border rounded-[6px]">
                        <CalendarDays size={16} className="text-brand-gold" />
                        <div>
                          <p className="font-sans text-xs text-brand-gray/70">Date & Time</p>
                          <p className="font-display text-sm text-brand-black">
                            {dateOptions.find((d) => d.value === selectedDate)?.label} at {selectedTime}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 border border-brand-border rounded-[6px]">
                        <Users size={16} className="text-brand-gold" />
                        <div>
                          <p className="font-sans text-xs text-brand-gray/70">Class</p>
                          <p className="font-display text-sm text-brand-black">{classData.title}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 border border-brand-border rounded-[6px]">
                        <MapPin size={16} className="text-brand-gold" />
                        <div>
                          <p className="font-sans text-xs text-brand-gray/70">Location</p>
                          <p className="font-display text-sm text-brand-black">{classData.location}</p>
                        </div>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="relative w-full overflow-hidden px-8 py-4 bg-brand-black text-brand-white border border-brand-gold rounded-[6px] font-sans text-[11px] tracking-[0.2em] uppercase transition-all duration-500 hover:shadow-[0_0_30px_rgba(158,101,27,0.15)] cursor-pointer disabled:opacity-60 group"
                      >
                        <span className="absolute inset-0 bg-brand-gold transform -translate-x-full group-hover:translate-x-0 transition-transform duration-[400ms] ease-[var(--ease-expo-out)]" />
                        <span className="relative z-10 flex items-center justify-center gap-2 group-hover:text-brand-black transition-colors duration-[400ms]">
                          {isSubmitting ? (
                            <><Loader2 size={14} className="animate-spin" /> Processing Payment...</>
                          ) : (
                            <><CheckCircle size={14} /> Confirm & Pay {classData.price}</>
                          )}
                        </span>
                      </button>
                    </form>
                  </div>
                )}

                {/* Navigation Buttons */}
                {step < 2 && (
                  <div className="flex gap-4 mt-8">
                    {step > 0 && (
                      <button
                        onClick={() => setStep(step - 1)}
                        className="flex-1 px-8 py-4 bg-transparent text-brand-black border border-brand-black/20 hover:border-brand-black rounded-[6px] font-sans text-[11px] tracking-[0.2em] uppercase transition-all duration-500 cursor-pointer"
                      >
                        Back
                      </button>
                    )}
                    <button
                      onClick={handleContinue}
                      disabled={
                        (step === 0 && (!selectedDate || !selectedTime)) ||
                        (step === 1 && (!form.name || !form.phone || !form.email))
                      }
                      className={`relative overflow-hidden px-8 py-4 bg-brand-black text-brand-white border border-brand-gold rounded-[6px] font-sans text-[11px] tracking-[0.2em] uppercase transition-all duration-500 hover:shadow-[0_0_30px_rgba(158,101,27,0.15)] cursor-pointer disabled:opacity-60 group ${step === 0 ? 'w-full' : 'flex-1'}`}
                    >
                      <span className="absolute inset-0 bg-brand-gold transform -translate-x-full group-hover:translate-x-0 transition-transform duration-[400ms] ease-[var(--ease-expo-out)]" />
                      <span className="relative z-10 flex items-center justify-center gap-2 group-hover:text-brand-black transition-colors duration-[400ms]">
                        Continue
                        <ChevronRight size={14} />
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar - Class Info */}
          <motion.div {...fd(0.1)}>
            <div className="p-6 border border-brand-border rounded-[8px] bg-brand-white/50 sticky top-28">
              <div className="w-12 h-12 rounded-full border border-brand-gold/30 bg-brand-white flex items-center justify-center mb-5">
                <GraduationCap size={20} className="text-brand-gold" />
              </div>

              <h3 className="font-display text-xl text-brand-black mb-1">{classData.title}</h3>
              <p className="font-display text-lg text-brand-gold mb-5">{classData.price}</p>

              <div className="space-y-3 mb-6 pb-6 border-b border-brand-border">
                <div className="flex items-center gap-2 text-brand-gray/60">
                  <Clock size={12} />
                  <span className="font-sans text-xs">{classData.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-brand-gray/60">
                  <Users size={12} />
                  <span className="font-sans text-xs">{classData.seats} seats available</span>
                </div>
                <div className="flex items-center gap-2 text-brand-gray/60">
                  <MapPin size={12} />
                  <span className="font-sans text-xs">{classData.location}</span>
                </div>
                <div className="flex items-center gap-2 text-brand-gray/60">
                  <Star size={12} />
                  <span className="font-sans text-xs">{classData.level}</span>
                </div>
              </div>

              <div>
                <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-gray/70 mb-3">What&apos;s Included</p>
                <ul className="space-y-2">
                  {classData.includes.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle size={12} className="text-brand-gold mt-0.5 flex-shrink-0" />
                      <span className="font-sans text-xs text-brand-gray/70">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
