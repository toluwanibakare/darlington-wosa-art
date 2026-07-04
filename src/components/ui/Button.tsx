import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'text';
  children: React.ReactNode;
}

export function Button({ variant = 'primary', children, className = '', ...props }: ButtonProps) {
  const baseStyles = "relative inline-flex items-center justify-center font-sans font-medium transition-colors overflow-hidden cursor-pointer";
  
  const variants = {
    primary: "px-8 py-4 bg-brand-black text-brand-white border border-brand-gold rounded-[6px] group",
    secondary: "px-8 py-4 bg-transparent text-brand-black border border-brand-black/20 hover:border-brand-black rounded-[6px]",
    text: "text-brand-black p-2 group"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {variant === 'primary' && (
        <span className="absolute inset-0 bg-brand-gold transform -translate-x-full group-hover:translate-x-0 transition-transform duration-[400ms] ease-[var(--ease-expo-out)] z-0" />
      )}
      <span className="relative z-10 group-hover:text-brand-black transition-colors duration-[400ms] delay-75">{children}</span>
      
      {/* For text link variant, a custom underline */}
      {variant === 'text' && (
        <span className="absolute bottom-0 left-0 w-full h-[1px] bg-brand-gold transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-[400ms] ease-[var(--ease-expo-out)]" />
      )}
    </button>
  );
}
