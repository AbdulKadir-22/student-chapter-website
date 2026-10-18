import React from 'react';
import { X, Check } from 'lucide-react';

export default function MultiSelect({
  label,
  options = [], // [{ value, label }]
  selectedValues = [],
  onChange,
  placeholder = 'Select items...',
  helperText = '',
  disabled = false,
  className = '',
}) {
  const toggleOption = (val) => {
    if (selectedValues.includes(val)) {
      onChange(selectedValues.filter((v) => v !== val));
    } else {
      onChange([...selectedValues, val]);
    }
  };

  const removeValue = (val, e) => {
    e.stopPropagation();
    onChange(selectedValues.filter((v) => v !== val));
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-xs font-bold text-slate-700">
          {label}
        </label>
      )}

      {/* Selected tags */}
      {selectedValues.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {selectedValues.map((val) => {
            const opt = options.find((o) => o.value === val);
            const displayLabel = opt ? opt.label : val;
            return (
              <span
                key={val}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-50 text-[#6332ec] text-xs font-semibold border border-purple-100"
              >
                <span>{displayLabel}</span>
                {!disabled && (
                  <button
                    type="button"
                    onClick={(e) => removeValue(val, e)}
                    className="hover:text-rose-600 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </span>
            );
          })}
        </div>
      )}

      {/* Options List */}
      <div className="max-h-36 overflow-y-auto rounded-xl border border-slate-200 bg-[#f8f7fd] p-1.5 space-y-1">
        {options.length === 0 ? (
          <p className="text-[11px] text-slate-400 p-2 text-center">No options available</p>
        ) : (
          options.map((opt) => {
            const isSelected = selectedValues.includes(opt.value);
            return (
              <div
                key={opt.value}
                onClick={() => !disabled && toggleOption(opt.value)}
                className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-purple-100/70 text-[#6332ec] font-bold'
                    : 'text-slate-700 hover:bg-slate-200/50'
                }`}
              >
                <span>{opt.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#6332ec]" />}
              </div>
            );
          })
        )}
      </div>

      {helperText && (
        <p className="text-[10px] text-slate-400">{helperText}</p>
      )}
    </div>
  );
}
