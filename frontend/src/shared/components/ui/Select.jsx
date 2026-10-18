import React from 'react';
import { ChevronDown } from 'lucide-react';

export default function Select({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  disabled = false,
  error = '',
  className = '',
  id,
}) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold text-slate-700 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`w-full appearance-none rounded-xl border bg-white px-3.5 py-2.5 text-xs text-slate-800 transition-all focus:outline-none focus:ring-2 focus:ring-[#6332ec]/20 disabled:bg-slate-50 disabled:text-slate-400 cursor-pointer ${
            error
              ? 'border-rose-400 focus:border-rose-500'
              : 'border-slate-200 focus:border-[#6332ec]'
          }`}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => {
            const optVal = typeof opt === 'object' ? opt.value : opt;
            const optLabel = typeof opt === 'object' ? opt.label : opt;
            return (
              <option key={optVal} value={optVal}>
                {optLabel}
              </option>
            );
          })}
        </select>
        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
      {error && <p className="text-[11px] text-rose-500 mt-1 font-medium">{error}</p>}
    </div>
  );
}
