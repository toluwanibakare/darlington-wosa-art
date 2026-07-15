import React from 'react';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-brand-surface">
      <DashboardSidebar />
      <DashboardHeader />
      <main
        className="transition-all duration-500 ease-[var(--ease-expo-out)] lg:ml-[280px]"
        style={{
          marginLeft: '0px',
          paddingTop: '80px',
        }}
      >
        <div className="min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}
