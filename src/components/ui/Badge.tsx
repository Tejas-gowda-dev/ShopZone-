import * as React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps {
  className?: string;
  variant?: 'default' | 'secondary' | 'outline' | 'success';
  children: React.ReactNode;
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  const variants = {
    default: 'border-transparent bg-[#0F172A] text-white',
    secondary: 'border-transparent bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300',
    outline: 'text-slate-600 border-slate-200 dark:text-slate-400 dark:border-slate-800',
    success: 'border-transparent bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 uppercase tracking-wider',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
