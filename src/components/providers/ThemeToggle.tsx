"use client";

import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center h-8 w-8 rounded-full border border-brand-border hover:border-brand-gold bg-transparent hover:bg-brand-gold/5 transition-all duration-300 cursor-pointer"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? (
        <Sun size={14} className="text-brand-gold" />
      ) : (
        <Moon size={14} className="text-brand-gold" />
      )}
    </button>
  );
}
