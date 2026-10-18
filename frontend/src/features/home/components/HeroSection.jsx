import React from 'react';
import { ArrowRight, Code2, Users2, Lightbulb, Settings2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../../shared/components/ui/Button';

export default function HeroSection({ onOpenJoinModal }) {
  const avatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80'
  ];

  return (
    <section className="relative pt-6 sm:pt-12 pb-16 sm:pb-24 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-20 left-10 w-80 h-80 bg-indigo-200/30 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Text Content */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            {/* Tag Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs sm:text-sm font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
              Association for Computing Machinery
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.08]">
                Build. Collaborate.{' '}
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                  Inspire.
                </span>
              </h1>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-700 pt-1">
                ACM AMTICS Student Chapter
              </h2>
            </div>

            {/* Paragraph */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
              A community of learners, builders, and changemakers from the Department of Computer Science & Engineering, AMTICS. We organize events, workshops, projects and initiatives to explore, learn and grow together.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link to="/events">
                <Button variant="primary" size="lg" icon={ArrowRight}>
                  Explore Events
                </Button>
              </Link>
              <a href="#about">
                <Button variant="secondary" size="lg">
                  Learn More
                </Button>
              </a>
            </div>

            {/* Social Proof Avatar Strip */}
            <div className="flex items-center gap-3.5 pt-2">
              <div className="flex -space-x-2.5 overflow-hidden p-0.5">
                {avatars.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="Community Member"
                    className="inline-block h-8 w-8 sm:h-9 sm:w-9 rounded-full ring-2 ring-white object-cover"
                  />
                ))}
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-600">
                Join <span className="font-bold text-slate-900">500+ students</span> growing with ACM AMTICS
              </p>
            </div>
          </div>

          {/* Right Hero Futuristic Emblem */}
          <div className="lg:col-span-5 flex items-center justify-center relative">
            <div className="relative w-72 h-72 sm:w-96 sm:h-96 flex items-center justify-center">
              {/* Outer Dashed Orbit */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-indigo-200/80 animate-spin-slow" />

              {/* Mid Layer Orbit */}
              <div className="absolute inset-8 rounded-full border border-purple-200/60 animate-spin-reverse-slow" />

              {/* Soft Pulsing Gradient Glow */}
              <div className="absolute inset-12 rounded-full bg-gradient-to-tr from-cyan-400/20 via-indigo-500/20 to-purple-500/25 blur-xl animate-pulse" />

              {/* Floating Orbit Badges */}
              {/* Top-Right Badge: Ideas */}
              <div className="absolute top-2 -right-2 sm:top-4 sm:right-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-indigo-100 shadow-sm text-xs font-semibold text-indigo-700 animate-float-subtle">
                Ideas & Impact
              </div>

              {/* Bottom-Right Badge: Technology */}
              <div className="absolute bottom-6 -right-4 sm:bottom-8 sm:right-0 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-purple-100 shadow-sm text-xs font-semibold text-purple-700 animate-float-subtle" style={{ animationDelay: '1.5s' }}>
                Technology & Code
              </div>

              {/* Floating Orbit Icons */}
              {/* Top-Left Icon: Code */}
              <div className="absolute top-8 left-4 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-sm">
                <Code2 className="w-5 h-5" />
              </div>

              {/* Top-Right Icon: Lightbulb */}
              <div className="absolute top-10 right-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shadow-sm">
                <Lightbulb className="w-5 h-5" />
              </div>

              {/* Bottom-Left Icon: Users */}
              <div className="absolute bottom-10 left-8 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center shadow-sm">
                <Users2 className="w-5 h-5" />
              </div>

              {/* Bottom-Right Icon: Settings */}
              <div className="absolute bottom-12 right-12 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center shadow-sm">
                <Settings2 className="w-5 h-5" />
              </div>

              {/* Central Glowing Disk - Logo takes full circular area */}
              <div className="relative z-10 w-52 h-52 sm:w-64 sm:h-64 rounded-full bg-gradient-to-tr from-cyan-400 via-indigo-600 to-purple-600 p-2 sm:p-2.5 shadow-2xl shadow-indigo-500/35 flex items-center justify-center group hover:scale-[1.03] transition-all duration-500">
                {/* Glossy inner container */}
                <div className="w-full h-full rounded-full bg-white/95 backdrop-blur-md p-3 sm:p-4 flex items-center justify-center overflow-hidden relative shadow-inner">
                  {/* Subtle radial sheen */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500/5 via-transparent to-white/40 pointer-events-none" />
                  
                  {/* Logo filling the entire circle cleanly */}
                  <img
                    src="/acm_amtics_logo.png"
                    alt="ACM AMTICS Logo"
                    className="w-full h-full object-contain drop-shadow-sm select-none transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
