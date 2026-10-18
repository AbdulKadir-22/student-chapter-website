import React from 'react';
import { cn } from '../../utils/cn';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon: Icon,
  iconPosition = 'right',
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed select-none';

  const variants = {
    primary:
      'bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 text-white shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 hover:from-indigo-700 hover:to-purple-700 focus:ring-indigo-500',
    secondary:
      'bg-white text-slate-700 border border-slate-200/90 shadow-sm hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 focus:ring-indigo-400',
    outline:
      'bg-transparent text-indigo-600 border border-indigo-200 hover:bg-indigo-50/70 hover:border-indigo-300 focus:ring-indigo-500',
    ghost:
      'bg-transparent text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/60 focus:ring-indigo-400',
    white:
      'bg-white text-indigo-700 shadow-md hover:bg-slate-50 hover:shadow-lg focus:ring-white',
    dark:
      'bg-slate-900 text-white hover:bg-slate-800 shadow-sm focus:ring-slate-700'
  };

  const sizes = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-6 py-3 gap-2.5'
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
      {children}
      {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
    </button>
  );
}
