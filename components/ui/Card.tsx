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
      blue:  'border-blue-electric/20 shadow-[0_4px_24px_rgba(45,127,249,0.12)]',
      gold:  'border-gold/22 shadow-[0_4px_24px_rgba(245,166,35,0.12)]',
      green: 'border-success/20 shadow-[0_4px_24px_rgba(34,197,94,0.10)]',
      none:  'border-white/[0.07]',
    };

    const paddings = {
      none: '',
      sm:   'p-4',
      md:   'p-5',
      lg:   'p-6',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-card border',
          'bg-navy-card/80 backdrop-blur-md',
          /* inner top-edge highlight for depth */
          'shadow-[0_2px_12px_rgba(0,0,0,0.40),inset_0_1px_0_rgba(255,255,255,0.055)]',
          glowStyles[glow],
          hover && [
            'transition-[transform,box-shadow,border-color]',
            'duration-200 ease-spring',
            'hover:-translate-y-[3px] hover:scale-[1.003]',
            'hover:border-blue-electric/22 hover:shadow-card-hover',
          ],
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
