"use client";

import React, { InputHTMLAttributes, useState } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Input({ label, id, className = '', ...props }: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  
  // Float the label when focused OR when there is text
  const isFloating = isFocused || hasValue;

  return (
    <div className={`relative w-full mt-6 mb-4 ${className}`}>
      <label 
        htmlFor={id}
        className={`absolute left-0 transition-all duration-[400ms] ease-[var(--ease-expo-out)] pointer-events-none
          ${isFloating ? '-top-5 text-xs text-brand-gold' : 'top-2 text-base text-brand-gray'}
        `}
      >
        {label}
      </label>
      <input
        id={id}
        onFocus={() => setIsFocused(true)}
        onBlur={(e) => {
          setIsFocused(false);
          setHasValue(e.target.value.length > 0);
        }}
        onChange={(e) => setHasValue(e.target.value.length > 0)}
        className="w-full bg-transparent border-b border-brand-border py-2 text-brand-white focus:outline-none transition-colors font-sans"
        {...props}
      />
      {/* Animated Underline */}
      <div 
        className={`absolute bottom-0 left-0 h-[1px] bg-brand-gold transition-transform duration-[400ms] ease-[var(--ease-expo-out)] origin-left w-full
          ${isFocused ? 'scale-x-100' : 'scale-x-0'}
        `}
      />
    </div>
  );
}
