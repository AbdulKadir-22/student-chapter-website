import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Menu, X, Sparkles, LogIn } from 'lucide-react';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import eventsData from '../../../data/events.json';
import projectsData from '../../../data/projects.json';
import { headsData } from '../../../data/team';

import { useAuth } from '../../../features/auth/hooks/useAuth';

export default function Navbar() {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [joinedSuccess, setJoinedSuccess] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Events', path: '/events' },
    { label: 'Projects', path: '/projects' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Heads', path: '/heads' },
    { label: 'Contributors', path: '/contributors' }
  ];

  // Global search filtering
  const filteredEvents = searchQuery.trim()
    ? eventsData.filter(e =>
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 3)
    : [];

  const filteredProjects = searchQuery.trim()
    ? projectsData.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 3)
    : [];

  const filteredHeads = searchQuery.trim()
    ? headsData.filter(h =>
        h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.role.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 3)
    : [];

  const handleJoinSubmit = (e) => {
    e.preventDefault();
    setJoinedSuccess(true);
    setTimeout(() => {
      setJoinedSuccess(false);
      setJoinModalOpen(false);
    }, 2000);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full px-4 sm:px-6 lg:px-8 pt-3 pb-2 transition-all">
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-2.5 rounded-2xl glass-nav shadow-sm border border-slate-200/80">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full p-1 bg-gradient-to-tr from-cyan-400/20 via-indigo-500/20 to-purple-500/30 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
              <img
                src="/acm_amtics_logo.png"
                alt="ACM AMTICS Student Chapter"
                className="w-8 h-8 sm:w-9 sm:h-9 object-contain"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                  ACM AMTICS
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] font-medium tracking-wider uppercase text-slate-500 -mt-1">
                Student Chapter
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100/70 p-1 rounded-full border border-slate-200/50 shadow-inner">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                className={({ isActive }) =>
                  `px-3.5 py-1.5 text-xs lg:text-sm font-medium rounded-full transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-white text-indigo-700 shadow-sm font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              title="Search events, projects, members..."
              aria-label="Search"
            >
              <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </button>

            {/* Login / Dashboard / My Profile Link */}
            {user ? (
              <div className="hidden lg:flex items-center gap-2">
                {(user?.permissions?.isAdminLike || user?.role === 'admin' || user?.showDashboard === true) && (
                  <Link
                    to="/panel/dashboard"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#6332ec] hover:bg-[#5225d3] rounded-full transition-colors shadow-xs"
                  >
                    <span>Dashboard</span>
                  </Link>
                )}
                {(user?.permissions?.isCoordinator || user?.role === 'coordinator') && !(user?.permissions?.isAdminLike || user?.role === 'admin' || user?.showDashboard === true) && (
                  <Link
                    to="/panel/events"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#6332ec] hover:bg-[#5225d3] rounded-full transition-colors shadow-xs"
                  >
                    <span>Events & Attendance</span>
                  </Link>
                )}
                <Link
                  to="/profile"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/80 rounded-full transition-colors border border-slate-200/80 bg-white/90 shadow-2xs"
                >
                  <span>My Profile</span>
                </Link>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/80 rounded-full transition-colors border border-slate-200/80 bg-white/90 shadow-2xs"
              >
                <LogIn className="w-3.5 h-3.5 text-indigo-600" />
                <span>Login</span>
              </Link>
            )}

            {/* Join Button */}
            <Button
              variant="primary"
              size="sm"
              icon={ArrowRight}
              onClick={() => setJoinModalOpen(true)}
              className="hidden sm:inline-flex shadow-sm hover:shadow-indigo-500/25"
            >
              Join Our Community
            </Button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 max-w-7xl mx-auto rounded-2xl glass-card p-4 border border-slate-200 shadow-lg animate-in fade-in slide-in-from-top-2">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === '/'}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="pt-3 border-t border-slate-100 mt-2 space-y-2">
                <Button
                  variant="primary"
                  className="w-full justify-center"
                  icon={ArrowRight}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setJoinModalOpen(true);
                  }}
                >
                  Join Our Community
                </Button>
                {user ? (
                  <>
                    {(user?.permissions?.isAdminLike || user?.role === 'admin' || user?.showDashboard === true) && (
                      <Link
                        to="/panel/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-xl text-white bg-[#6332ec] hover:bg-[#5225d3] transition-colors"
                      >
                        <span>Dashboard</span>
                      </Link>
                    )}
                    {(user?.permissions?.isCoordinator || user?.role === 'coordinator') && !(user?.permissions?.isAdminLike || user?.role === 'admin' || user?.showDashboard === true) && (
                      <Link
                        to="/panel/events"
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-xl text-white bg-[#6332ec] hover:bg-[#5225d3] transition-colors"
                      >
                        <span>Events & Attendance</span>
                      </Link>
                    )}
                    <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-xl text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100/80 transition-colors"
                    >
                      <span>My Profile</span>
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-xl text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100/80 transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Chapter Member Login</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <Modal
        isOpen={searchOpen}
        onClose={() => {
          setSearchOpen(false);
          setSearchQuery('');
        }}
        title="Search ACM AMTICS"
      >
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search events, projects, topics, members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50"
            />
          </div>

          {searchQuery.trim() === '' ? (
            <div className="py-8 text-center text-slate-400 text-sm">
              Type to quickly find events, student projects, or chapter team members.
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
              {filteredEvents.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Events
                  </h4>
                  <div className="space-y-1.5">
                    {filteredEvents.map((event) => (
                      <div
                        key={event.id}
                        onClick={() => {
                          setSearchOpen(false);
                          navigate(`/events/${event.id}`);
                        }}
                        className="p-2.5 rounded-xl hover:bg-indigo-50/70 border border-transparent hover:border-indigo-100 cursor-pointer transition-all flex items-center justify-between"
                      >
                        <div>
                          <div className="text-sm font-semibold text-slate-800">{event.title}</div>
                          <div className="text-xs text-slate-500">{event.category} • {event.date}</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {filteredProjects.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Projects
                  </h4>
                  <div className="space-y-1.5">
                    {filteredProjects.map((project) => (
                      <div
                        key={project.id}
                        onClick={() => {
                          setSearchOpen(false);
                          navigate(`/projects/${project.id}`);
                        }}
                        className="p-2.5 rounded-xl hover:bg-indigo-50/70 border border-transparent hover:border-indigo-100 cursor-pointer transition-all flex items-center justify-between"
                      >
                        <div>
                          <div className="text-sm font-semibold text-slate-800">{project.title}</div>
                          <div className="text-xs text-slate-500">{project.tagline}</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {filteredHeads.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Team & Leadership
                  </h4>
                  <div className="space-y-1.5">
                    {filteredHeads.map((head) => (
                      <div
                        key={head.id}
                        onClick={() => {
                          setSearchOpen(false);
                          navigate('/heads');
                        }}
                        className="p-2.5 rounded-xl hover:bg-indigo-50/70 border border-transparent hover:border-indigo-100 cursor-pointer transition-all flex items-center justify-between"
                      >
                        <div>
                          <div className="text-sm font-semibold text-slate-800">{head.name}</div>
                          <div className="text-xs text-slate-500">{head.role}</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {filteredEvents.length === 0 &&
                filteredProjects.length === 0 &&
                filteredHeads.length === 0 && (
                  <div className="py-6 text-center text-sm text-slate-500">
                    No results found for "{searchQuery}". Try another keyword.
                  </div>
                )}
            </div>
          )}
        </div>
      </Modal>

      {/* Join Community Modal */}
      <Modal
        isOpen={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
        title="Join ACM AMTICS Student Chapter"
      >
        {joinedSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-800">Welcome to the Chapter!</h4>
            <p className="text-sm text-slate-600 max-w-sm mx-auto">
              We've recorded your interest. Check your inbox and join our community Discord server to get started.
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
              Already a registered officer or member?{' '}
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
    </>
  );
}
