import React from 'react';
import { GraduationCap, Users, Lightbulb, Sprout, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../../../shared/components/ui/Card';

export default function AboutSection() {
  const pillars = [
    {
      title: 'Learn',
      desc: 'Workshops, talks and knowledge sharing',
      icon: GraduationCap,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-100/80'
    },
    {
      title: 'Collaborate',
      desc: 'Network with peers, faculty and industry experts',
      icon: Users,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      border: 'border-purple-100/80'
    },
    {
      title: 'Build',
      desc: 'Projects, hackathons and real-world solutions',
      icon: Lightbulb,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-100/80'
    },
    {
      title: 'Create Impact',
      desc: 'Use technology for a better tomorrow',
      icon: Sprout,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100/80'
    }
  ];

  return (
    <section id="about" className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              ABOUT US
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              About ACM AMTICS
            </h2>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              ACM AMTICS is the official student chapter of the Association for Computing Machinery at the Department of Computer Science & Engineering, AMTICS. We aim to create a platform for students to learn, build, collaborate and make a positive impact through technology and innovation.
            </p>
            <div className="pt-2">
              <Link
                to="/gallery"
                className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors group cursor-pointer"
              >
                Our Journey
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Right Column - 4 Pillar Cards */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <Card
                  key={index}
                  className={`p-6 bg-white/80 border ${pillar.border} hover:shadow-lg transition-all duration-300 flex flex-col justify-between`}
                >
                  <div className={`w-12 h-12 rounded-2xl ${pillar.bg} ${pillar.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">
                      {pillar.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
