import React from 'react';
import { Code2, Lightbulb, Users, Settings } from 'lucide-react';

export const AuthBranding = () => {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-4 select-none">
      {/* Container for Orbit & Central Graphic */}
      <div className="relative w-[340px] h-[340px] sm:w-[380px] sm:h-[380px] flex items-center justify-center">
        {/* Soft atmospheric gradient glow behind center */}
        <div className="absolute w-[260px] h-[260px] rounded-full bg-gradient-to-tr from-[#9333ea]/15 via-[#38bdf8]/20 to-[#6366f1]/20 blur-xl" />

        {/* Orbit Graphics: Dashed circular borders */}
        <div className="absolute inset-2 rounded-full border-[1.5px] border-dashed border-[#c4b5fd]/80 pointer-events-none" />
        <div className="absolute inset-10 rounded-full border border-purple-200/40 pointer-events-none" />

        {/* Center Graphic: Circular ACM Logo */}
        <div className="relative z-10 w-44 h-44 sm:w-48 sm:h-48 rounded-full bg-gradient-to-b from-[#f8fafc] to-[#e2e8f0] p-[5px] shadow-2xl shadow-indigo-300/40 flex items-center justify-center">
          {/* Inner Cyan/Sky Border */}
          <div className="w-full h-full rounded-full border-[4px] border-[#38bdf8] bg-[#0284c7] p-2 flex flex-col items-center justify-center text-white shadow-inner">
            <span className="text-3xl sm:text-4xl font-black tracking-tight uppercase drop-shadow-sm font-sans">
              acm
            </span>
            <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase text-sky-100 mt-1">
              amtics
            </span>
          </div>
        </div>

        {/* Orbit Nodes: Four floating white circles */}
        {/* Top-Left: Code </> */}
        <div className="absolute top-4 left-10 sm:left-12 z-20 w-12 h-12 rounded-full bg-white shadow-lg shadow-purple-200/70 border border-purple-100 flex items-center justify-center text-[#6332ec] hover:scale-105 transition-transform">
          <Code2 className="w-5 h-5 stroke-[2.2]" />
        </div>

        {/* Top-Right: Lightbulb 💡 */}
        <div className="absolute top-8 right-6 sm:right-8 z-20 w-12 h-12 rounded-full bg-white shadow-lg shadow-purple-200/70 border border-purple-100 flex items-center justify-center text-[#6332ec] hover:scale-105 transition-transform">
          <Lightbulb className="w-5 h-5 stroke-[2.2]" />
        </div>

        {/* Bottom-Left: Users 👥 */}
        <div className="absolute bottom-12 left-6 sm:left-8 z-20 w-12 h-12 rounded-full bg-white shadow-lg shadow-purple-200/70 border border-purple-100 flex items-center justify-center text-[#6332ec] hover:scale-105 transition-transform">
          <Users className="w-5 h-5 stroke-[2.2]" />
        </div>

        {/* Bottom-Right: Gear ⚙️ */}
        <div className="absolute bottom-6 right-10 sm:right-12 z-20 w-12 h-12 rounded-full bg-white shadow-lg shadow-purple-200/70 border border-purple-100 flex items-center justify-center text-[#6332ec] hover:scale-105 transition-transform">
          <Settings className="w-5 h-5 stroke-[2.2]" />
        </div>

        {/* Small orbit accent dots */}
        <span className="absolute top-3 right-32 w-2 h-2 rounded-full bg-[#6332ec]" />
        <span className="absolute bottom-3 left-32 w-2 h-2 rounded-full bg-[#6332ec]" />
        <span className="absolute top-1/2 -left-1 w-1.5 h-1.5 rounded-full bg-[#8b5cf6]" />
        <span className="absolute top-1/2 -right-1 w-1.5 h-1.5 rounded-full bg-[#8b5cf6]" />

        {/* Floating Handwritten Notes with Curved Arrows */}
        {/* Top left annotation */}
        <div className="absolute -top-6 -left-14 sm:-left-20 flex flex-col items-center transform -rotate-12 pointer-events-none">
          <div className="font-['Caveat',cursive,'Comic_Sans_MS',sans-serif] text-slate-500 text-sm sm:text-base leading-tight text-center font-medium">
            <span>Ideas</span>
            <br />
            <span>Community</span>
            <br />
            <span>Technology</span>
            <br />
            <span>Impact</span>
          </div>
          {/* Curved arrow pointing down-right */}
          <svg
            className="w-8 h-8 text-slate-400 mt-1 stroke-current fill-none"
            viewBox="0 0 40 40"
          >
            <path
              d="M 10 5 Q 30 15 25 32"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M 18 28 L 25 33 L 28 24"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Right side annotation */}
        <div className="absolute -bottom-2 -right-14 sm:-right-24 flex flex-col items-start transform rotate-6 pointer-events-none">
          <div className="font-['Caveat',cursive,'Comic_Sans_MS',sans-serif] text-slate-500 text-sm sm:text-base leading-tight font-medium">
            <span>Learn</span>
            <br />
            <span>Collaborate</span>
            <br />
            <span>Build</span>
            <br />
            <span>Create Impact</span>
          </div>
          {/* Curved arrow pointing left towards gear */}
          <svg
            className="w-10 h-8 text-slate-400 mt-1 stroke-current fill-none transform -rotate-12"
            viewBox="0 0 50 35"
          >
            <path
              d="M 45 25 Q 25 35 10 18"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M 18 13 L 8 16 L 12 26"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Typography Section */}
      <div className="mt-8 text-center flex flex-col items-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0f172a]">
          ACM AMTICS
        </h2>
        <p className="text-xs sm:text-sm font-normal text-slate-500 mt-1">
          Association for Computing Machinery
        </p>
        <p className="text-[10px] sm:text-xs font-semibold tracking-[0.28em] text-[#6332ec] uppercase mt-2.5">
          BUILD &bull; COLLABORATE &bull; INSPIRE
        </p>
      </div>
    </div>
  );
};
