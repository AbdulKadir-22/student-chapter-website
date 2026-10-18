import React from 'react';

const COMMON_COUNTRY_CODES = [
  { code: '+91', country: 'IN', label: 'India (+91)' },
  { code: '+1', country: 'US', label: 'USA / Canada (+1)' },
  { code: '+44', country: 'UK', label: 'UK (+44)' },
  { code: '+971', country: 'AE', label: 'UAE (+971)' },
  { code: '+65', country: 'SG', label: 'Singapore (+65)' },
  { code: '+61', country: 'AU', label: 'Australia (+61)' },
];

export default function PhoneInput({
  value = '',
  onChange,
  disabled = false,
  error = '',
  className = '',
}) {
  // Parse country code and number
  let selectedCode = '+91';
  let numberPart = value;

  for (const item of COMMON_COUNTRY_CODES) {
    if (value.startsWith(item.code)) {
      selectedCode = item.code;
      numberPart = value.slice(item.code.length);
      break;
    }
  }

  const handleCodeChange = (e) => {
    const newCode = e.target.value;
    onChange(`${newCode}${numberPart}`);
  };

  const handleNumberChange = (e) => {
    const rawNumber = e.target.value.replace(/[^\d]/g, '');
    onChange(`${selectedCode}${rawNumber}`);
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center rounded-xl border border-slate-200 bg-[#f8f7fd] overflow-hidden focus-within:bg-white focus-within:ring-2 focus-within:ring-[#6332ec]/20 focus-within:border-[#6332ec] transition-all">
        <select
          value={selectedCode}
          onChange={handleCodeChange}
          disabled={disabled}
          className="bg-transparent text-xs font-bold text-slate-700 px-3 py-2.5 border-r border-slate-200 focus:outline-none cursor-pointer"
        >
          {COMMON_COUNTRY_CODES.map((item) => (
            <option key={item.code} value={item.code}>
              {item.code}
            </option>
          ))}
        </select>
        <input
          type="tel"
          value={numberPart}
          onChange={handleNumberChange}
          disabled={disabled}
          placeholder="8127028101"
          className="w-full bg-transparent text-xs text-slate-800 px-3 py-2.5 focus:outline-none"
        />
      </div>
      {error && <p className="mt-1 text-[11px] text-rose-500 font-medium">{error}</p>}
    </div>
  );
}
