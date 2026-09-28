"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Table, Image as ImageIcon } from 'lucide-react';

interface FrameGuideModalProps {
  open: boolean;
  onClose: () => void;
}

export const FRAME_PRICELIST_DATA = [
  { size: '10 × 12', withoutGlass: '₦15,000', withGlass: '₦20,000', rawWithout: 15000, rawWith: 20000 },
  { size: '12 × 16', withoutGlass: '₦25,000', withGlass: '₦30,000', rawWithout: 25000, rawWith: 30000 },
  { size: '16 × 20', withoutGlass: '₦30,000', withGlass: '₦35,000', rawWithout: 30000, rawWith: 35000 },
  { size: '20 × 24', withoutGlass: '₦35,000', withGlass: '₦40,000', rawWithout: 35000, rawWith: 40000 },
  { size: '20 × 30', withoutGlass: '₦40,000', withGlass: '₦45,000', rawWithout: 40000, rawWith: 45000 },
  { size: '24 × 30', withoutGlass: '₦50,000', withGlass: '₦65,000', rawWithout: 50000, rawWith: 65000 },
  { size: '24 × 36', withoutGlass: '₦65,000', withGlass: '₦70,000', rawWithout: 65000, rawWith: 70000 },
  { size: '30 × 40', withoutGlass: '₦90,000', withGlass: '₦130,000', rawWithout: 90000, rawWith: 130000 },
];

export function FrameGuideModal({ open, onClose }: FrameGuideModalProps) {
  const [activeTab, setActiveTab] = useState<'pricelist' | 'guide'>('pricelist');

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9998] flex items-center justify-center p-4 md:p-8"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative max-w-4xl w-full max-h-[90vh] flex flex-col bg-brand-black border border-brand-gold/30 rounded-[12px] shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-brand-border/20 bg-brand-black/90">
              <div>
                <h3 className="font-display text-lg text-brand-surface tracking-wide">Framing Price List & Size Guide</h3>
                <p className="font-sans text-xs text-brand-gold/90 mt-0.5">Museum-grade framing with & without acrylic glass</p>
              </div>

              <button
                onClick={onClose}
                className="text-brand-surface/70 hover:text-brand-surface transition-colors cursor-pointer p-1 rounded-full hover:bg-white/10"
                aria-label="Close frame guide"
              >
                <X size={20} />
              </button>
            </div>

            {/* View Switcher Tabs */}
            <div className="flex border-b border-brand-border/20 bg-brand-surface/5 px-6 pt-3 gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('pricelist')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg font-sans text-xs tracking-wider uppercase transition-colors cursor-pointer ${
                  activeTab === 'pricelist'
                    ? 'bg-brand-black text-brand-gold border-t-2 border-brand-gold font-semibold'
                    : 'text-brand-surface/60 hover:text-brand-surface'
                }`}
              >
                <Table size={14} />
                Price List Table
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('guide')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg font-sans text-xs tracking-wider uppercase transition-colors cursor-pointer ${
                  activeTab === 'guide'
                    ? 'bg-brand-black text-brand-gold border-t-2 border-brand-gold font-semibold'
                    : 'text-brand-surface/60 hover:text-brand-surface'
                }`}
              >
                <ImageIcon size={14} />
                Visual Size Guide
              </button>
            </div>

            {/* Content Area */}
            <div className="relative w-full overflow-y-auto p-6 flex-1 bg-brand-black">
              {activeTab === 'pricelist' ? (
                <div className="space-y-6">
                  <div className="overflow-x-auto border border-brand-border/30 rounded-[8px]">
                    <table className="w-full text-left font-sans text-sm">
                      <thead>
                        <tr className="border-b border-brand-gold/30 bg-brand-gold/10 text-brand-surface">
                          <th className="py-3.5 px-4 font-display tracking-wider text-xs uppercase text-brand-gold">Size (Inches)</th>
                          <th className="py-3.5 px-4 font-display tracking-wider text-xs uppercase text-brand-surface">Without Glass</th>
                          <th className="py-3.5 px-4 font-display tracking-wider text-xs uppercase text-brand-gold">With Acrylic Glass</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-brand-border/15 text-brand-surface/90">
                        {FRAME_PRICELIST_DATA.map((item, idx) => (
                          <tr key={item.size} className={idx % 2 === 0 ? 'bg-brand-surface/[0.02]' : 'bg-transparent'}>
                            <td className="py-3.5 px-4 font-semibold text-brand-surface">{item.size}</td>
                            <td className="py-3.5 px-4 font-mono text-brand-surface/80">{item.withoutGlass}</td>
                            <td className="py-3.5 px-4 font-mono font-bold text-brand-gold">{item.withGlass}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="p-4 rounded-[8px] border border-brand-border/20 bg-brand-surface/[0.03] space-y-2">
                    <p className="font-sans text-xs text-brand-surface/70 leading-relaxed">
                      All frames are handcrafted in Rivers State, Nigeria using premium mahogany, natural wood, or sleek modern mouldings.
                    </p>
                    <p className="font-sans text-[11px] text-brand-gold/80">
                      Standard delivery is available nationwide. Acrylic glass options provide shatterproof crystal-clear protection and UV defense for artwork.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-full flex flex-col items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/frame_guide.png"
                    alt="Frame size guide showing available dimensions for museum-grade framing"
                    className="w-full h-auto object-contain rounded-[6px]"
                    style={{ maxHeight: '70vh' }}
                  />
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-brand-border/20 bg-brand-black/90 text-center">
              <p className="text-brand-surface/50 text-[10px] tracking-[0.15em] uppercase font-sans">
                Darlington Wosa Art & Frames Ltd | All prices in NGN (₦)
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
