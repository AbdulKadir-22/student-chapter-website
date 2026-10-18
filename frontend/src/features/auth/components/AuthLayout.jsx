import React from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../../../shared/components/layout/Navbar';

export const AuthLayout = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full bg-[#f4f4fa] text-[#1e1b4b] overflow-hidden flex flex-col justify-between selection:bg-[#6332ec] selection:text-white">
      {/* Background Soft Blobs & Gradients */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Top left soft violet blob */}
        <div className="absolute -top-[120px] -left-[120px] w-[450px] h-[450px] rounded-full bg-gradient-to-br from-[#e0d9fc]/70 to-[#eae4ff]/30 blur-2xl" />
        {/* Top center soft purple circle */}
        <div className="absolute -top-[100px] left-[45%] w-[380px] h-[380px] rounded-full bg-[#e6dffd]/50 blur-3xl" />
        {/* Top right large soft circle */}
        <div className="absolute -top-[180px] -right-[100px] w-[550px] h-[550px] rounded-full bg-gradient-to-bl from-[#dbeafe]/70 via-[#e0e7ff]/60 to-[#ede9fe]/40 blur-3xl" />
        {/* Bottom center / right soft shapes */}
        <div className="absolute -bottom-[200px] left-[35%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#e5deff]/60 to-transparent blur-3xl" />
        <div className="absolute -bottom-[150px] -right-[100px] w-[500px] h-[500px] rounded-full bg-gradient-to-tl from-[#dde7ff]/70 to-[#ede9fe]/40 blur-2xl" />
        {/* Subtle curved ring ambient */}
        <div className="absolute -bottom-[260px] -left-[200px] w-[650px] h-[650px] rounded-full border-[100px] border-[#ede9fe]/30 blur-xl pointer-events-none" />
      </div>

      {/* Decorative Subtle Dotted Grids */}
      {/* Left top dotted grid */}
      <div
        className="pointer-events-none absolute top-20 left-4 w-28 h-40 opacity-45"
        style={{
          backgroundImage:
            'radial-gradient(circle, #8b5cf6 1.5px, transparent 1.5px)',
          backgroundSize: '16px 16px',
        }}
      />
      {/* Left bottom dotted grid */}
      <div
        className="pointer-events-none absolute bottom-12 left-6 w-32 h-36 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(circle, #8b5cf6 1.5px, transparent 1.5px)',
          backgroundSize: '16px 16px',
        }}
      />
      {/* Right bottom subtle dotted grid */}
      <div
        className="pointer-events-none absolute bottom-36 right-4 w-32 h-44 opacity-35"
        style={{
          backgroundImage:
            'radial-gradient(circle, #8b5cf6 1.5px, transparent 1.5px)',
          backgroundSize: '16px 16px',
        }}
      />

      {/* Shared Landing Page Top Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-12 py-4">
        {children}
      </main>

      {/* Minimal Footer / Spacing */}
      <div className="h-4 pointer-events-none" />
    </div>
  );
};
