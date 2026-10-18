import React from 'react';
import { HeartHandshake, ArrowRight } from 'lucide-react';
import { FaLinkedin, FaGithub, FaInstagram } from 'react-icons/fa6';
import { contributorsData } from '../../../data/team';
import Button from '../../../shared/components/ui/Button';

export default function ContributorsPage() {
  return (
    <div className="py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-3">
            <HeartHandshake className="w-3.5 h-3.5" />
            Open Source Community
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Chapter Contributors
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            The talented students who dedicate their craft, design systems, code reviews, and event coordination to keep ACM AMTICS vibrant and thriving.
          </p>
        </div>

        {/* Contributors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 mb-16">
          {contributorsData.map((contributor, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col"
            >
              {/* Full width top image */}
              <div className="w-full aspect-[4/3] sm:h-48 overflow-hidden bg-slate-100">
                <img
                  src={contributor.avatar}
                  alt={contributor.name}
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Card content */}
              <div className="p-4 sm:p-4.5 flex flex-col justify-between flex-1 space-y-2.5">
                <div>
                  {/* Role Pill Badge */}
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#ece8fd] text-[#5538ee] text-[11px] font-semibold mb-2">
                    {contributor.role}
                  </span>

                  {/* Member Name */}
                  <h3 className="text-base sm:text-lg font-bold text-[#141b38] tracking-tight leading-snug">
                    {contributor.name}
                  </h3>

                  {/* Department / Year */}
                  <p className="text-xs font-medium text-slate-500 mt-0.5 mb-2">
                    {contributor.department || 'ACM AMTICS Contributor'}
                  </p>

                  {/* Key Contributions */}
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                    {contributor.contributions}
                  </p>
                </div>

                {/* Social Action Icons */}
                <div className="flex items-center gap-3 pt-1.5 text-[#373c68]">
                  {contributor.linkedin && (
                    <a
                      href={contributor.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="LinkedIn"
                      className="text-[#373c68] hover:text-[#0A66C2] transition-colors"
                    >
                      <FaLinkedin className="w-4.5 h-4.5" />
                    </a>
                  )}
                  {contributor.github && (
                    <a
                      href={contributor.github}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="GitHub"
                      className="text-[#373c68] hover:text-slate-900 transition-colors"
                    >
                      <FaGithub className="w-4.5 h-4.5" />
                    </a>
                  )}
                  {contributor.instagram && (
                    <a
                      href={contributor.instagram}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Instagram"
                      className="text-[#373c68] hover:text-[#E4405F] transition-colors"
                    >
                      <FaInstagram className="w-4.5 h-4.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Join as Contributor CTA */}
        <div className="rounded-3xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 p-8 sm:p-12 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-2xl font-bold">Want to contribute to ACM AMTICS?</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              We welcome code contributions, design wireframes, event photography, blog writeups, and workshop ideas. Submit a pull request on GitHub or message our team leads!
            </p>
          </div>
          <a
            href="https://github.com/acm-amtics"
            target="_blank"
            rel="noreferrer"
            className="shrink-0"
          >
            <Button
              variant="white"
              icon={ArrowRight}
              className="font-bold text-slate-900"
            >
              Contribute on GitHub
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
