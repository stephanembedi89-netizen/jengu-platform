'use client';

import { cn } from '@/lib/utils';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  hint?: string;
  disabled?: boolean;
  id?: string;
}

export default function Toggle({ checked, onChange, label, hint, disabled, id }: ToggleProps) {
  const toggleId = id || 'toggle';

  return (
    <div className="flex items-start gap-3">
      <button
        id={toggleId}
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative flex-shrink-0 w-12 h-6 rounded-full transition-colors duration-250 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-electric focus-visible:ring-offset-2 focus-visible:ring-offset-navy-deep',
          checked ? 'bg-blue-electric' : 'bg-navy-border',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-250',
            checked && 'translate-x-6'
          )}
        />
      </button>
      {(label || hint) && (
        <div className="flex flex-col">
          {label && (
            <label
              htmlFor={toggleId}
              className="text-sm font-body font-semibold text-text-primary cursor-pointer"
            >
              {label}
            </label>
          )}
          {hint && <span className="text-xs text-text-muted mt-0.5">{hint}</span>}
        </div>
      )}
    </div>
  );
}
