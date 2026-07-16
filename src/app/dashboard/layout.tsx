"use client";

import React, { useState } from 'react';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-brand-surface">
      <DashboardSidebar mobileOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />
      <DashboardHeader onToggleMenu={() => setMobileSidebarOpen(!mobileSidebarOpen)} mobileOpen={mobileSidebarOpen} />
      <main
        className="transition-all duration-500 ease-[var(--ease-expo-out)] lg:ml-[280px]"
        style={{ paddingTop: '80px' }}
      >
        <div className="min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}
