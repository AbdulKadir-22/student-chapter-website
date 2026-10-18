import React, { useState } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Users,
  User,
  Search,
  Bell,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../../features/auth/hooks/useAuth';
import Avatar from '../ui/Avatar';
import Navbar from './Navbar';

export default function AppShell({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isAdminLike = Boolean(user?.permissions?.isAdminLike ?? (user?.role === 'admin' || user?.showDashboard === true));
  const isCoordinator = Boolean(user?.permissions?.isCoordinator ?? (user?.role === 'coordinator' && !isAdminLike));

  // Determine navigation items by role:
  // Admin-like: Dashboard (/panel/dashboard), Profile (/profile), Events & Attendance (/panel/events), Members (/panel/members)
  // Coordinator: Profile (/profile), Members (/members), Events & Attendance (/panel/events)
  // Plain member: Profile (/profile), Members (/members)
  let navItems = [];
  if (isAdminLike) {
    navItems = [
      { label: 'Dashboard', icon: LayoutDashboard, path: '/panel/dashboard' },
      { label: 'Profile', icon: User, path: '/profile' },
      { label: 'Members', icon: Users, path: '/members' },
      { label: 'Events & Attendance', icon: Calendar, path: '/panel/events' },
    ];
  } else if (isCoordinator) {
    navItems = [
      { label: 'Profile', icon: User, path: '/profile' },
      { label: 'Members', icon: Users, path: '/members' },
      { label: 'Events & Attendance', icon: Calendar, path: '/panel/events' },
    ];
  } else {
    navItems = [
      { label: 'Profile', icon: User, path: '/profile' },
      { label: 'Members', icon: Users, path: '/members' },
    ];
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (globalSearch.trim()) {
      navigate(`/members?q=${encodeURIComponent(globalSearch.trim())}`);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const showSearchAndBell = location.pathname === '/profile' || location.pathname.startsWith('/members');
  const brandSubtitle = isAdminLike || isCoordinator ? 'Admin Panel' : 'Student Chapter';

  const renderNavLinks = () => (
    <div className="space-y-1.5 py-4">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.path === '/profile'
            ? location.pathname === '/profile'
            : item.path === '/members'
            ? location.pathname.startsWith('/members')
            : item.path === '/panel/events'
            ? location.pathname.startsWith('/panel/events')
            : item.path === '/panel/members'
            ? location.pathname.startsWith('/panel/members')
            : location.pathname === item.path;

        return (
          <NavLink
            key={item.label}
            to={item.path}
            onClick={() => setMobileDrawerOpen(false)}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              isActive
                ? 'bg-[#6332ec] text-white shadow-md shadow-purple-600/25'
                : 'text-slate-600 hover:text-[#6332ec] hover:bg-purple-50/60'
            }`}
          >
            <Icon
              className={`w-4 h-4 ${
                isActive ? 'text-white' : 'text-slate-400 group-hover:text-[#6332ec]'
              }`}
            />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#faf8ff] text-slate-900 flex flex-col font-sans selection:bg-[#6332ec] selection:text-white">
      {/* Top Navigation Bar from Landing Page */}
      <Navbar />

      {/* Main Area with Sidebar and Content */}
      <div className="flex-1 flex flex-col lg:flex-row relative">
        {/* Sidebar Desktop */}
        <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-100 p-5 sticky top-18 h-[calc(100vh-4.5rem)] z-30 shrink-0">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-3 pb-6 border-b border-slate-100 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#38bdf8]/20 via-[#818cf8]/20 to-[#c084fc]/30 p-1 flex items-center justify-center border border-indigo-100 shadow-2xs group-hover:scale-105 transition-transform">
            <img
              src="/acm_amtics_logo.png"
              alt="ACM AMTICS"
              className="w-full h-full object-contain rounded-full"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-sm tracking-tight text-slate-900 group-hover:text-[#6332ec] transition-colors">
              ACM AMTICS
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              {brandSubtitle}
            </span>
          </div>
        </Link>

        {/* Nav Links */}
        <div className="flex-1 overflow-y-auto no-scrollbar">{renderNavLinks()}</div>

        {/* Quick User Card at Sidebar Bottom */}
        {user && (
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <Link
              to="/profile"
              className="flex items-center gap-2.5 min-w-0 hover:opacity-85 transition-opacity"
            >
              <Avatar name={user.name} id={user.id} size="sm" />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-slate-800 truncate">
                  {user.name}
                </span>
                <span className="text-[10px] text-slate-400 truncate">
                  {user.position || user.roleLabel || 'Member'}
                </span>
              </div>
            </Link>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-20 bg-white/85 backdrop-blur-md border-b border-slate-100 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          {/* Mobile menu toggle & brand */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/acm_amtics_logo.png"
                alt="ACM AMTICS"
                className="w-7 h-7 object-contain rounded-full"
              />
              <span className="font-extrabold text-xs text-slate-900">
                ACM AMTICS
              </span>
            </Link>
          </div>

          {/* Global Search Bar (Only shown on /profile and /members) */}
          {showSearchAndBell ? (
            <form
              onSubmit={handleSearchSubmit}
              className="flex-1 max-w-lg hidden sm:block relative"
            >
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Search events, projects, members..."
                className="w-full bg-[#f6f5fc] text-slate-800 text-xs rounded-xl pl-9 pr-4 py-2 border border-slate-200/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6332ec]/20 focus:border-[#6332ec] transition-all"
              />
            </form>
          ) : (
            <div className="flex-1" />
          )}

          {/* Right actions: Bell with red dot + User dropdown */}
          <div className="flex items-center gap-3 sm:gap-4 ml-auto">
            {showSearchAndBell && (
              <button
                className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
              </button>
            )}

            {/* User Dropdown */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100/80 transition-colors cursor-pointer"
                >
                  <Avatar name={user.name} id={user.id} size="sm" />
                  <div className="hidden md:flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-800 leading-tight">
                      {user.name}
                    </span>
                    <span className="text-[10px] text-slate-500 leading-tight">
                      {user.position || user.roleLabel || (isAdminLike ? 'Admin' : isCoordinator ? 'Coordinator' : 'Member')}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-3.5 py-2 border-b border-slate-100 md:hidden">
                      <p className="text-xs font-bold text-slate-800">{user.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-purple-50 hover:text-[#6332ec] transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span>My Profile</span>
                    </Link>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Mobile Drawer */}
        {mobileDrawerOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
              onClick={() => setMobileDrawerOpen(false)}
            />
            <div className="relative w-72 max-w-[80%] bg-white h-full shadow-2xl p-5 flex flex-col justify-between z-10 animate-in slide-in-from-left duration-200">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <img
                      src="/acm_amtics_logo.png"
                      alt="ACM AMTICS"
                      className="w-8 h-8 object-contain rounded-full"
                    />
                    <div className="flex flex-col">
                      <span className="font-extrabold text-xs text-slate-900">
                        ACM AMTICS
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {brandSubtitle}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setMobileDrawerOpen(false)}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {renderNavLinks()}
              </div>

              {user && (
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar name={user.name} id={user.id} size="sm" />
                    <span className="text-xs font-bold text-slate-800 truncate">
                      {user.name}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Page Children */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  </div>
  );
}
