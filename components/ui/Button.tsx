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
      'inline-flex items-center justify-center gap-2 font-body font-semibold select-none ' +
      'transition-all duration-150 ease-smooth ' +
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-electric focus-visible:ring-offset-2 focus-visible:ring-offset-navy-deep ' +
      'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none ' +
      'active:scale-[0.97]';

    const variants = {
      primary:
        'bg-gradient-to-br from-blue-electric to-[#1a5fcc] text-white ' +
        'shadow-btn rounded-btn ' +
        'hover:brightness-110 hover:-translate-y-0.5 hover:shadow-btn-hover',
      ghost:
        'bg-transparent border border-blue-electric/25 text-blue-glow rounded-btn ' +
        'hover:bg-blue-electric/10 hover:border-blue-electric/50',
      outline:
        'bg-transparent border border-white/[0.09] text-text-secondary rounded-btn ' +
        'hover:border-white/[0.18] hover:text-text-primary hover:bg-white/[0.03]',
      danger:
        'bg-danger/10 border border-danger/25 text-danger rounded-btn ' +
        'hover:bg-danger/18 hover:border-danger/40',
    };

    const sizes = {
      sm: 'h-9 px-4 text-[13px] tracking-[0.01em] min-h-[36px]',
      md: 'h-11 px-5 text-[14px] tracking-[0.01em] min-h-[44px]',
      lg: 'h-12 px-7 text-[15px] tracking-[0.01em] min-h-[48px]',
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
