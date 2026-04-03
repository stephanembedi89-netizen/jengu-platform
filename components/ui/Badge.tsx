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
  blue: 'bg-blue-electric/12 text-blue-glow border-blue-electric/20',
  gold: 'bg-gold-soft text-gold border-gold/25',
  green: 'bg-success-bg text-success border-success/20',
  red: 'bg-danger-bg text-danger border-danger/20',
  purple: 'bg-[rgba(168,85,247,0.12)] text-[#a855f7] border-[rgba(168,85,247,0.20)]',
  gray: 'bg-navy-border/60 text-text-secondary border-navy-border',
  urgent: 'bg-gold-soft text-gold border-gold/30',
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
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-body font-700 tracking-wider uppercase border',
        colorStyles[color],
        pulse && 'badge-urgent',
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full',
            color === 'gold' || color === 'urgent' ? 'bg-gold' : '',
            color === 'blue' ? 'bg-blue-glow' : '',
            color === 'green' ? 'bg-success' : '',
            color === 'red' ? 'bg-danger' : '',
          )}
        />
      )}
      {children}
    </span>
  );
}
