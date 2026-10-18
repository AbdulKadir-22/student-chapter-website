import React from 'react';

// Gradients array for deterministic purple/blue styling per user id
const GRADIENTS = [
  'from-purple-600 to-indigo-600',
  'from-indigo-600 to-blue-600',
  'from-violet-600 to-purple-700',
  'from-fuchsia-600 to-indigo-600',
  'from-blue-600 to-indigo-700',
  'from-indigo-500 to-purple-600',
];

const getGradientForId = (id = '') => {
  if (!id) return GRADIENTS[0];
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % GRADIENTS.length;
  return GRADIENTS[index];
};

const SIZES = {
  xs: 'w-7 h-7 text-xs',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-lg font-bold',
  xl: 'w-20 h-20 text-2xl font-extrabold',
  '2xl': 'w-28 h-28 text-3xl font-extrabold',
};

export default function Avatar({
  name = 'User',
  id = '',
  size = 'md',
  className = '',
}) {
  const initial = (name.trim()[0] || 'U').toUpperCase();
  const gradient = getGradientForId(id || name);
  const sizeClass = SIZES[size] || SIZES.md;

  return (
    <div
      className={`rounded-full bg-gradient-to-tr ${gradient} text-white flex items-center justify-center font-bold tracking-tight shadow-xs select-none shrink-0 ${sizeClass} ${className}`}
      aria-label={name}
    >
      <span>{initial}</span>
    </div>
  );
}
