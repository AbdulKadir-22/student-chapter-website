import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaLinkedinIn, FaGithub, FaYoutube, FaDiscord } from 'react-icons/fa6';

export default function Footer() {
  const exploreLinks = [
    { label: 'Home', path: '/' },
    { label: 'Events', path: '/events' },
    { label: 'Projects', path: '/projects' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Heads', path: '/heads' },
    { label: 'Contributors', path: '/contributors' }
  ];

  const communityLinks = [
    { label: 'Join Us', path: '/#join' },
    { label: 'Our Team', path: '/heads' },
    { label: 'Become a Member', path: '/#join' },
    { label: 'Events', path: '/events' },
    { label: 'Projects', path: '/projects' },
    { label: 'Contact', path: '/#contact' }
  ];

  const resourceLinks = [
    { label: 'ACM Global', href: 'https://www.acm.org' },
    { label: 'Student Resources', href: 'https://www.acm.org/membership/student' },
    { label: 'Code of Conduct', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms & Conditions', href: '#' }
  ];

  const socialLinks = [
    { icon: FaInstagram, label: 'Instagram', href: 'https://instagram.com' },
    { icon: FaLinkedinIn, label: 'LinkedIn', href: 'https://linkedin.com' },
    { icon: FaGithub, label: 'GitHub', href: 'https://github.com' },
    { icon: FaYoutube, label: 'YouTube', href: 'https://youtube.com' },
    { icon: FaDiscord, label: 'Discord', href: 'https://discord.com' }
  ];

  return (
    <footer className="bg-[#0B1120] text-slate-400 pt-16 pb-12 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full p-1 bg-white/10 flex items-center justify-center">
                <img
                  src="/acm_amtics_logo.png"
                  alt="ACM AMTICS Logo"
                  className="w-8 h-8 object-contain brightness-110"
                />
              </div>
              <div>
                <span className="font-extrabold text-lg text-white tracking-tight">
                  ACM AMTICS
                </span>
                <span className="block text-[11px] text-slate-400 font-medium tracking-wider uppercase -mt-0.5">
                  Student Chapter
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              The official student chapter of the Association for Computing Machinery at the Department of Computer Science & Engineering, AMTICS.
            </p>

            {/* Social Icons via react-icons */}
            <div className="flex items-center gap-2.5 pt-2">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-indigo-600 hover:border-indigo-500 transition-all duration-200 cursor-pointer"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 1: Explore */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              {exploreLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    className="hover:text-white transition-colors duration-200 inline-block"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Community */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Community
            </h4>
            <ul className="space-y-2.5 text-sm">
              {communityLinks.map((item) => (
                <li key={item.label}>
                  {item.path.startsWith('/#') ? (
                    <a
                      href={item.path}
                      className="hover:text-white transition-colors duration-200 inline-block"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      to={item.path}
                      className="hover:text-white transition-colors duration-200 inline-block"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Resources
            </h4>
            <ul className="space-y-2.5 text-sm">
              {resourceLinks.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition-colors duration-200 inline-block"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2025 ACM AMTICS. All rights reserved.</p>
          <div className="flex items-center gap-2 font-medium text-slate-400">
            <span>Build.</span>
            <span>•</span>
            <span>Collaborate.</span>
            <span>•</span>
            <span>Inspire.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
