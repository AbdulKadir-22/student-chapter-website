import React from 'react';
import { Award, FolderGit2, Briefcase, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function WhyJoinSection() {
  const benefits = [
    {
      title: 'Learn from peers',
      desc: 'Gain knowledge through peer-led workshops and lively tech discussions.',
      icon: Award,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    {
      title: 'Build real projects',
      desc: 'Turn ideas into impactful open source and production solutions.',
      icon: FolderGit2,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      title: 'Meet industry professionals',
      desc: 'Interact with engineering leaders, alumni and get career mentorship.',
      icon: Briefcase,
      color: 'text-cyan-600',
      bg: 'bg-cyan-50'
    },
    {
      title: 'Showcase your work',
      desc: 'Gain campus and global visibility for your projects and achievements.',
      icon: Sparkles,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    }
  ];

  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
            COMMUNITY
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Why Join ACM AMTICS?
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Community Image with floating card */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-lg border border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80"
                alt="ACM AMTICS Community members"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

              {/* Floating Badge Card at bottom of photo */}
              <Link
                to="/gallery"
                className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-xs bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 shadow-lg flex items-center justify-between group hover:border-indigo-300 transition-all cursor-pointer"
              >
                <div>
                  <div className="text-xs font-semibold text-indigo-600">
                    More than a student chapter
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    A growing community
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-indigo-50 group-hover:bg-indigo-600 group-hover:text-white text-indigo-600 flex items-center justify-center transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            </div>
          </div>

          {/* Right Text & 4 Bullets */}
          <div className="lg:col-span-6 space-y-8">
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Be a part of a vibrant community of learners, builders and changemakers. ACM AMTICS gives you the platform, people and opportunities to grow beyond the classroom.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {benefits.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className="flex items-start gap-3.5 p-3 rounded-2xl hover:bg-slate-50 transition-colors"
                  >
                    <div className={`w-10 h-10 rounded-xl ${item.bg} ${item.color} flex items-center justify-center shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 mb-0.5">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
