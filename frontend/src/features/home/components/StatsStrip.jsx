import React from 'react';
import { Users, Calendar, FolderGit2, Trophy } from 'lucide-react';
import Card from '../../../shared/components/ui/Card';

export default function StatsStrip() {
  const stats = [
    {
      value: '500+',
      label: 'Active Members',
      icon: Users,
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
      borderColor: 'border-indigo-100'
    },
    {
      value: '30+',
      label: 'Events Conducted',
      icon: Calendar,
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      borderColor: 'border-purple-100'
    },
    {
      value: '60+',
      label: 'Student Projects',
      icon: FolderGit2,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-100'
    },
    {
      value: '10+',
      label: 'Awards & Recognitions',
      icon: Trophy,
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600',
      borderColor: 'border-amber-100'
    }
  ];

  return (
    <section className="py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className="p-5 sm:p-6 flex items-center gap-4 bg-white/80 backdrop-blur-sm border-slate-200/70 hover:border-indigo-200 transition-all shadow-sm hover:shadow-md"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.bgColor} ${stat.textColor}`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-slate-500">
                    {stat.label}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
