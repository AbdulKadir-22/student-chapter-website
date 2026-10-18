import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import StatsStrip from '../components/StatsStrip';
import AboutSection from '../components/AboutSection';
import FocusSection from '../components/FocusSection';
import RecentEventsSection from '../components/RecentEventsSection';
import StudentProjectsSection from '../components/StudentProjectsSection';
import WhyJoinSection from '../components/WhyJoinSection';
import MomentsGallerySection from '../components/MomentsGallerySection';
import CtaBanner from '../components/CtaBanner';
import Modal from '../../../shared/components/ui/Modal';
import Button from '../../../shared/components/ui/Button';
import { Sparkles } from 'lucide-react';

export default function HomePage() {
  const [searchParams] = useSearchParams();
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [joinSuccess, setJoinSuccess] = useState(false);

  useEffect(() => {
    if (searchParams.get('join') === 'true') {
      setJoinModalOpen(true);
    }
  }, [searchParams]);

  const handleJoinSubmit = (e) => {
    e.preventDefault();
    setJoinSuccess(true);
    setTimeout(() => {
      setJoinSuccess(false);
      setJoinModalOpen(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen">
      <HeroSection onOpenJoinModal={() => setJoinModalOpen(true)} />
      <StatsStrip />
      <AboutSection />
      <FocusSection />
      <RecentEventsSection />
      <StudentProjectsSection />
      <WhyJoinSection />
      <MomentsGallerySection />
      <CtaBanner onOpenJoinModal={() => setJoinModalOpen(true)} />

      {/* Join Community Modal */}
      <Modal
        isOpen={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
        title="Join ACM AMTICS Student Chapter"
      >
        {joinSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-800">Welcome to ACM AMTICS!</h4>
            <p className="text-sm text-slate-600 max-w-sm mx-auto">
              Your application has been received. Our team will reach out with discord links and orientation details.
            </p>
          </div>
        ) : (
          <form onSubmit={handleJoinSubmit} className="space-y-4">
            <p className="text-xs sm:text-sm text-slate-600">
              Join 500+ student developers, innovators, and designers building technology that matters at AMTICS.
            </p>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                placeholder="Alex Mercer"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">University Email ID</label>
              <input
                type="email"
                required
                placeholder="alex.2023cse@amtics.edu"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Department</label>
                <select className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50">
                  <option>CSE</option>
                  <option>IT</option>
                  <option>AI & DS</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Current Year</label>
                <select className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50">
                  <option>1st Year</option>
                  <option>2nd Year</option>
                  <option>3rd Year</option>
                  <option>4th Year</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Area of Interest</label>
              <input
                type="text"
                placeholder="e.g. Web Development, AI/ML, Competitive Coding, UI/UX"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50"
              />
            </div>
            <div className="pt-2">
              <Button type="submit" variant="primary" className="w-full justify-center">
                Submit Membership Application
              </Button>
            </div>
            <div className="pt-3 border-t border-slate-100 text-center text-xs text-slate-500">
              Already an existing chapter member or lead?{' '}
              <Link
                to="/login"
                onClick={() => setJoinModalOpen(false)}
                className="font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
              >
                Log in to Chapter Portal &rarr;
              </Link>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
