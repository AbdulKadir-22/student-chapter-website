import React from 'react';
import { cn } from '../../utils/cn';

export default function Badge({
  children,
  variant = 'indigo',
  size = 'md',
  className = '',
  icon: Icon,
  ...props
}) {
  const baseStyles = 'inline-flex items-center font-medium rounded-full';

  const variants = {
    indigo: 'bg-indigo-50 text-indigo-700 border border-indigo-100/80',
    purple: 'bg-purple-50 text-purple-700 border border-purple-100/80',
    cyan: 'bg-cyan-50 text-cyan-800 border border-cyan-100/80',
    rose: 'bg-rose-50 text-rose-700 border border-rose-100/80',
    emerald: 'bg-emerald-50 text-emerald-700 border border-emerald-100/80',
    amber: 'bg-amber-50 text-amber-800 border border-amber-100/80',
    slate: 'bg-slate-100 text-slate-700 border border-slate-200/80',
    pill: 'bg-indigo-100/70 text-indigo-800 font-semibold border border-indigo-200/50'
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-0.5 gap-1',
    md: 'text-xs px-3 py-1 gap-1.5',
    lg: 'text-sm px-4 py-1.5 gap-2'
  };

  return (
    <span
      className={cn(baseStyles, variants[variant] || variants.indigo, sizes[size], className)}
      {...props}
    >
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      {children}
    </span>
  );
}
