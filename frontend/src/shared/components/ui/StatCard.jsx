import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function StatCard({
  icon: Icon,
  label,
  value,
  growthPercent = null,
  growthText = 'from last month',
  iconColor = 'purple',
  className = '',
}) {
  const iconColors = {
    purple: 'bg-purple-50 text-[#6332ec]',
    indigo: 'bg-indigo-50 text-indigo-600',
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    rose: 'bg-rose-50 text-rose-600',
    sky: 'bg-sky-50 text-sky-600',
  };

  const isPositive = growthPercent !== null && growthPercent > 0;
  const isNegative = growthPercent !== null && growthPercent < 0;

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-100 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between ${className}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-slate-500 block">
            {label}
          </span>
          <span className="text-2xl font-black text-slate-900 mt-1 block tracking-tight">
            {value}
          </span>
        </div>
        {Icon && (
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              iconColors[iconColor] || iconColors.purple
            }`}
          >
            <Icon className="w-6 h-6 stroke-[2]" />
          </div>
        )}
      </div>

      <div className="pt-3 mt-1 border-t border-slate-50 flex items-center gap-1.5 text-xs">
        {growthPercent !== null ? (
          <>
            <span
              className={`inline-flex items-center font-bold ${
                isPositive
                  ? 'text-emerald-600'
                  : isNegative
                  ? 'text-rose-600'
                  : 'text-slate-600'
              }`}
            >
              {isPositive ? (
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
              ) : isNegative ? (
                <ArrowDownRight className="w-3.5 h-3.5 stroke-[2.5]" />
              ) : null}
              {isPositive ? `+${growthPercent}%` : `${growthPercent}%`}
            </span>
            <span className="text-slate-400 font-medium">{growthText}</span>
          </>
        ) : (
          <span className="text-slate-400 font-medium">No data yet</span>
        )}
      </div>
    </div>
  );
}
