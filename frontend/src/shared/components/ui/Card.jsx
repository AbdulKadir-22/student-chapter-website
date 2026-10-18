import React from 'react';
import { cn } from '../../utils/cn';

export default function Card({
  children,
  className = '',
  hover = true,
  onClick,
  ...props
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white rounded-2xl border border-slate-100 shadow-sm transition-all duration-300',
        hover && 'hover:shadow-md hover:border-indigo-100/80 hover:-translate-y-0.5',
        onClick && 'cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
