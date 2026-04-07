import { cn } from '@/lib/utils';

type BadgeColor = 'blue' | 'gold' | 'green' | 'red' | 'purple' | 'gray' | 'urgent';

interface BadgeProps {
  children: React.ReactNode;
  color?: BadgeColor;
  pulse?: boolean;
  className?: string;
  dot?: boolean;
}

const colorStyles: Record<BadgeColor, string> = {
  blue:   'bg-blue-dim text-blue-glow border-blue-electric/18',
  gold:   'bg-gold-soft text-gold border-gold/22',
  green:  'bg-success-bg text-success border-success/18',
  red:    'bg-danger-bg text-danger border-danger/18',
  purple: 'bg-[rgba(139,92,246,0.10)] text-[#a78bfa] border-[rgba(139,92,246,0.18)]',
  gray:   'bg-white/[0.05] text-text-secondary border-white/[0.08]',
  urgent: 'bg-gold-soft text-gold border-gold/28',
};

const dotColors: Record<BadgeColor, string> = {
  blue:   'bg-blue-glow',
  gold:   'bg-gold',
  urgent: 'bg-gold',
  green:  'bg-success',
  red:    'bg-danger',
  purple: 'bg-[#a78bfa]',
  gray:   'bg-text-secondary',
};

export default function Badge({
  children,
  color = 'blue',
  pulse = false,
  className,
  dot = false,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-[5px] rounded-pill',
        'text-[11px] font-body font-600 tracking-[0.05em] uppercase border',
        colorStyles[color],
        pulse && 'badge-urgent',
        className
      )}
    >
      {dot && (
        <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', dotColors[color])} />
      )}
      {children}
    </span>
  );
}
