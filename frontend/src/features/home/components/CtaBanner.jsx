import React from 'react';
import { ArrowRight, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../../shared/components/ui/Button';

export default function CtaBanner({ onOpenJoinModal }) {
  return (
    <section id="join" className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 p-8 sm:p-12 lg:p-16 shadow-xl shadow-indigo-500/20">
          {/* Subtle background glow/circles */}
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-purple-400/20 blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-semibold tracking-wider uppercase">
                JOIN THE COMMUNITY
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Build something meaningful with us.
              </h2>
              <p className="text-indigo-100 text-sm sm:text-base leading-relaxed">
                Be a part of ACM AMTICS and connect with a community that learns, builds and creates impact together.
              </p>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-3">
              <Button
                variant="white"
                size="lg"
                icon={ArrowRight}
                onClick={onOpenJoinModal}
                className="font-bold text-indigo-700 shadow-lg hover:scale-105"
              >
                Join Our Community
              </Button>
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/90 hover:text-white hover:underline transition-colors px-1 py-1"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Existing Member Portal Login &rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
