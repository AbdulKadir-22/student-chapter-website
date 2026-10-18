import React from 'react';
import { GraduationCap, Trophy, FolderGit2, Users2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../../../shared/components/ui/Card';

export default function FocusSection() {
  const focuses = [
    {
      title: 'Workshops & Learning',
      desc: 'Technical workshops, expert talks and hands-on sessions to learn new skills.',
      icon: GraduationCap,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      borderColor: 'hover:border-blue-200'
    },
    {
      title: 'Hackathons & Competitions',
      desc: 'Organize and participate in hackathons, coding competitions and challenges.',
      icon: Trophy,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      borderColor: 'hover:border-purple-200'
    },
    {
      title: 'Projects & Innovation',
      desc: 'Support student projects and innovative ideas from concept to deployment.',
      icon: FolderGit2,
      color: 'text-cyan-600',
      bg: 'bg-cyan-50',
      borderColor: 'hover:border-cyan-200'
    },
    {
      title: 'Community & Networking',
      desc: 'Build a vibrant community of like-minded learners and creators.',
      icon: Users2,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      borderColor: 'hover:border-emerald-200'
    }
  ];

  return (
    <section className="py-16 sm:py-20 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
              OUR FOCUS
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              What We Do
            </h2>
          </div>
          <Link
            to="/events"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors group cursor-pointer"
          >
            Learn More
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {focuses.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card
                key={index}
                className={`p-6 bg-white border border-slate-100/90 shadow-sm transition-all duration-300 flex flex-col justify-between ${item.borderColor}`}
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center mb-5`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
