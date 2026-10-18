import React from 'react';
import { Mail, ShieldCheck, History } from 'lucide-react';
import { FaLinkedinIn, FaLinkedin, FaGithub, FaInstagram } from 'react-icons/fa6';
import { headsData, previousHeadsData } from '../../../data/team';
import Card from '../../../shared/components/ui/Card';

export default function HeadsPage() {
  const faculty = headsData.filter((h) => h.role.includes('Faculty'));
  const studentHeads = headsData.filter((h) => !h.role.includes('Faculty'));

  return (
    <div className="py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            Chapter Leadership
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Office Bearers & Leads
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Meet the faculty mentors and student leaders driving initiatives, workshops, and student representation at ACM AMTICS.
          </p>
        </div>

        {/* Faculty Sponsor Section - UNCHANGED */}
        {faculty.length > 0 && (
          <div className="mb-14">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
              Faculty Sponsor & Patron
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {faculty.map((member) => (
                <Card
                  key={member.id}
                  className="p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 border-indigo-100 bg-white/90 shadow-sm"
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-28 h-28 rounded-2xl object-cover ring-4 ring-indigo-50 shadow-md shrink-0"
                  />
                  <div className="space-y-2 text-center sm:text-left">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {member.role}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 pt-1">
                      {member.name}
                    </h3>
                    <p className="text-xs text-indigo-600 font-medium">
                      {member.department}
                    </p>
                    <p className="text-sm text-slate-500 leading-relaxed pt-1">
                      {member.bio}
                    </p>
                    <div className="flex items-center justify-center sm:justify-start gap-2.5 pt-2">
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noreferrer"
                          className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-indigo-600 hover:text-white flex items-center justify-center text-slate-600 transition-colors"
                        >
                          <FaLinkedinIn className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-indigo-600 hover:text-white flex items-center justify-center text-slate-600 transition-colors"
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Current Student Leads Grid */}
        <div className="mb-16">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
            Executive Committee & Team Leads
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {studentHeads.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col"
              >
                {/* Full width top image */}
                <div className="w-full aspect-[4/3] sm:h-48 overflow-hidden bg-slate-100">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Card content */}
                <div className="p-4 sm:p-4.5 flex flex-col justify-between flex-1 space-y-2.5">
                  <div>
                    {/* Role Pill Badge */}
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#ece8fd] text-[#5538ee] text-[11px] font-semibold mb-2">
                      {member.role}
                    </span>

                    {/* Member Name */}
                    <h3 className="text-base sm:text-lg font-bold text-[#141b38] tracking-tight leading-snug">
                      {member.name}
                    </h3>

                    {/* Department / Year */}
                    <p className="text-xs font-medium text-slate-500 mt-0.5 mb-2">
                      {member.department}
                    </p>

                    {/* Bio */}
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                      {member.bio}
                    </p>
                  </div>

                  {/* Social Action Icons */}
                  <div className="flex items-center gap-3 pt-1.5 text-[#373c68]">
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="LinkedIn"
                        className="text-[#373c68] hover:text-[#0A66C2] transition-colors"
                      >
                        <FaLinkedin className="w-4.5 h-4.5" />
                      </a>
                    )}
                    {member.github && (
                      <a
                        href={member.github}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="GitHub"
                        className="text-[#373c68] hover:text-slate-900 transition-colors"
                      >
                        <FaGithub className="w-4.5 h-4.5" />
                      </a>
                    )}
                    {member.instagram && (
                      <a
                        href={member.instagram}
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
        </div>

        {/* Previous Heads Section */}
        {previousHeadsData && previousHeadsData.length > 0 && (
          <div className="pt-12 border-t border-slate-200/70">
            <div className="max-w-3xl mb-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold mb-3">
                <History className="w-3.5 h-3.5 text-slate-500" />
                Alumni & Former Leaders
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
                Previous Heads
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                Honoring the former office bearers and student leads who paved the way for ACM AMTICS.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {previousHeadsData.map((member) => (
                <div
                  key={member.id}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col"
                >
                  {/* Full width top image */}
                  <div className="w-full aspect-[4/3] sm:h-48 overflow-hidden bg-slate-100">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Card content */}
                  <div className="p-4 sm:p-4.5 flex flex-col justify-between flex-1 space-y-2.5">
                    <div>
                      {/* Role Pill Badge */}
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#ece8fd] text-[#5538ee] text-[11px] font-semibold mb-2">
                        {member.role}
                      </span>

                      {/* Member Name */}
                      <h3 className="text-base sm:text-lg font-bold text-[#141b38] tracking-tight leading-snug">
                        {member.name}
                      </h3>

                      {/* Department / Year */}
                      <p className="text-xs font-medium text-slate-500 mt-0.5 mb-2">
                        {member.department}
                      </p>

                      {/* Bio */}
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                        {member.bio}
                      </p>
                    </div>

                    {/* Social Action Icons */}
                    <div className="flex items-center gap-3 pt-1.5 text-[#373c68]">
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noreferrer"
                          aria-label="LinkedIn"
                          className="text-[#373c68] hover:text-[#0A66C2] transition-colors"
                        >
                          <FaLinkedin className="w-4.5 h-4.5" />
                        </a>
                      )}
                      {member.github && (
                        <a
                          href={member.github}
                          target="_blank"
                          rel="noreferrer"
                          aria-label="GitHub"
                          className="text-[#373c68] hover:text-slate-900 transition-colors"
                        >
                          <FaGithub className="w-4.5 h-4.5" />
                        </a>
                      )}
                      {member.instagram && (
                        <a
                          href={member.instagram}
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
          </div>
        )}
      </div>
    </div>
  );
}
