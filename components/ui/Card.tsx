'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  glow?: 'blue' | 'gold' | 'green' | 'none';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = true, glow = 'none', padding = 'md', children, ...props }, ref) => {
    const glowStyles = {
      blue: 'border-blue-electric/20 shadow-[0_4px_24px_rgba(26,127,255,0.10)]',
      gold: 'border-gold/20 shadow-[0_4px_24px_rgba(240,165,0,0.10)]',
      green: 'border-success/20 shadow-[0_4px_24px_rgba(16,185,129,0.10)]',
      none: 'border-blue-glow/[0.12]',
    };

    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-card border backdrop-blur-md',
          'bg-navy-card/75',
          'shadow-card',
          glowStyles[glow],
          hover &&
            'transition-[transform,box-shadow,border-color] duration-250 ease-out hover:-translate-y-1 hover:border-blue-electric/28 hover:shadow-card-hover',
          paddings[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
