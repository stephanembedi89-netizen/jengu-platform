'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center gap-2 font-body font-semibold transition-all duration-180 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-electric focus-visible:ring-offset-2 focus-visible:ring-offset-navy-deep disabled:opacity-50 disabled:cursor-not-allowed select-none';

    const variants = {
      primary:
        'bg-gradient-to-br from-blue-electric to-[#0a5ecc] text-white shadow-btn rounded-btn hover:brightness-110 hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(26,127,255,0.45)] active:scale-95',
      ghost:
        'bg-transparent border border-blue-electric/30 text-blue-glow rounded-btn hover:bg-blue-electric/10 hover:border-blue-electric/60',
      outline:
        'bg-transparent border border-navy-border text-text-secondary rounded-btn hover:border-blue-electric/40 hover:text-text-primary',
      danger:
        'bg-danger/10 border border-danger/30 text-danger rounded-btn hover:bg-danger/20',
    };

    const sizes = {
      sm: 'h-9 px-4 text-sm min-h-[36px]',
      md: 'h-11 px-6 text-sm min-h-[44px]',
      lg: 'h-12 px-8 text-base min-h-[48px]',
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            {children}
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
