import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Trophy,
  Calendar,
  FolderGit2,
  Users2,
  Rocket,
  Edit3,
  Mail,
  MapPin,
  Ticket,
  AlertTriangle,
  ArrowRight,
  Lock,
  Sparkles,
  CheckCircle,
  Clock,
  Compass,
} from 'lucide-react';
import { useAuth } from '../../auth/hooks/useAuth';
import AppShell from '../../../shared/components/layout/AppShell';
import Avatar from '../../../shared/components/ui/Avatar';
import Badge from '../../../shared/components/ui/Badge';
import Pagination from '../../../shared/components/ui/Pagination';
import EditProfileModal from '../components/EditProfileModal';
import TicketModal from '../components/TicketModal';
import {
  getMyProfileApi,
  getUserEventsApi,
  getUserCoordinatorRolesApi,
} from '../api/user.api';

const BADGE_CONFIG = {
  active_member: {
    name: 'Active Member',
    desc: 'Participated in 5+ events',
    gradient: 'from-purple-500 to-indigo-600',
    icon: Sparkles,
  },
  event_enthusiast: {
    name: 'Event Enthusiast',
    desc: 'Attended 10+ events',
    gradient: 'from-emerald-500 to-teal-600',
    icon: Calendar,
  },
  project_contributor: {
    name: 'Project Contributor',
    desc: 'Submitted 3+ projects',
    gradient: 'from-amber-500 to-orange-600',
    icon: FolderGit2,
  },
  idea_sharer: {
    name: 'Idea Sharer',
    desc: 'Shared awesome ideas',
    gradient: 'from-sky-500 to-blue-600',
    icon: Rocket,
  },
  community_builder: {
    name: 'Community Builder',
    desc: 'Contributed to community initiatives',
    gradient: 'from-rose-500 to-pink-600',
    icon: Users2,
  },
  leadership: {
    name: 'Leadership',
    desc: 'Took up a core role in events',
    gradient: 'from-indigo-600 to-purple-800',
    icon: Trophy,
  },
};

export default function MyProfilePage() {
  const { user: authUser } = useAuth();

  const [activeTab, setActiveTab] = useState('overview');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editModalTab, setEditModalTab] = useState('profile');
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  // Pagination states
  const [eventsPage, setEventsPage] = useState(1);
  const [rolesPage, setRolesPage] = useState(1);

  // Load fresh profile details (including real stats, badges, recentEvents, coordinatorRoles)
  const { data: profileData } = useQuery({
    queryKey: ['my-profile-details'],
    queryFn: getMyProfileApi,
  });

  const user = profileData?.user || authUser;
  const stats = profileData?.stats || {
    badges: 0,
    events: 0,
    projects: 0,
    roles: 0,
  };
  const badgesList = profileData?.badges || [];
  const recentEvents = profileData?.recentEvents || [];
  const overviewRoles = profileData?.coordinatorRoles || [];

  // Paginated queries for events and coordinator roles
  const { data: userEventsData } = useQuery({
    queryKey: ['user-events', user?.id || user?._id, eventsPage],
    queryFn: () => getUserEventsApi(user?.id || user?._id, { page: eventsPage, limit: 10 }),
    enabled: activeTab === 'events' && Boolean(user?.id || user?._id),
  });

  const { data: userRolesData } = useQuery({
    queryKey: ['user-roles', user?.id || user?._id, rolesPage],
    queryFn: () =>
      getUserCoordinatorRolesApi(user?.id || user?._id, { page: rolesPage, limit: 10 }),
    enabled: activeTab === 'roles' && Boolean(user?.id || user?._id),
  });

  const formatJoinedDate = (dateString) => {
    if (!dateString) return '2024';
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getCategoryGradient = (category) => {
    switch (category) {
      case 'Workshop':
        return 'from-purple-500/20 to-indigo-500/10 text-[#6332ec] border-purple-200/50';
      case 'Seminar':
        return 'from-blue-500/20 to-sky-500/10 text-blue-600 border-blue-200/50';
      case 'Competition':
        return 'from-rose-500/20 to-pink-500/10 text-rose-600 border-rose-200/50';
      case 'Talk':
        return 'from-emerald-500/20 to-teal-500/10 text-emerald-600 border-emerald-200/50';
      default:
        return 'from-slate-500/20 to-slate-400/10 text-slate-600 border-slate-200/50';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'badges', label: 'Badges' },
    { id: 'events', label: 'Event History' },
    { id: 'projects', label: 'Submitted Projects' },
    { id: 'roles', label: 'Coordinator Roles' },
  ];

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Dismissible Temporary Password Banner */}
        {user?.mustChangePassword && !bannerDismissed && (
          <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-purple-500/10 border border-amber-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-amber-900">
                  Temporary password active
                </p>
                <p className="text-[11px] text-amber-700">
                  For your account security, please update your temporary password to a secure personal password.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={() => {
                  setEditModalTab('security');
                  setEditModalOpen(true);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                Change Password
              </button>
              <button
                onClick={() => setBannerDismissed(true)}
                className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-amber-800 hover:bg-amber-100/60 transition-colors cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Profile Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              My <span className="text-[#6332ec]">Profile</span>
            </h1>
            <p className="text-xs text-slate-500">
              Manage your personal information, chapter achievements, and check-in pass.
            </p>
          </div>
        </div>

        {/* Profile Header Card */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-gradient-to-bl from-purple-100/40 via-indigo-50/20 to-transparent pointer-events-none blur-2xl" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start justify-between gap-6">
            {/* Avatar + Details */}
            <div className="flex flex-col sm:flex-row items-start gap-5">
              <Avatar
                name={user?.name || 'User'}
                id={user?.id || user?._id || ''}
                size="2xl"
                className="ring-4 ring-purple-100/80 shadow-md"
              />

              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {user?.name}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-[#6332ec] border border-purple-100 text-xs font-bold capitalize">
                    {user?.position || user?.roleLabel || user?.role || 'Member'}
                  </span>
                </div>

                <p className="text-xs font-semibold text-slate-600">
                  {user?.year ? `${user.year} Year` : 'Student'} &bull;{' '}
                  {user?.department || 'Computer Science & Engineering'}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>AMTICS, Uka Tarsadia University</span>
                  </div>
                </div>

                {user?.shortBio && (
                  <p className="text-xs text-slate-600 max-w-xl leading-relaxed pt-1">
                    {user.shortBio}
                  </p>
                )}
              </div>
            </div>

            {/* Right: Quote Card + Edit Profile Button */}
            <div className="flex flex-col items-start lg:items-end gap-3 w-full lg:w-auto shrink-0">
              {user?.quote && (
                <div className="w-full sm:w-72 bg-gradient-to-r from-purple-50/70 to-indigo-50/70 border border-purple-100/70 rounded-2xl p-3.5 flex items-start gap-3 shadow-2xs">
                  <span className="text-2xl leading-none text-[#6332ec] font-serif select-none">
                    “
                  </span>
                  <div className="flex-1">
                    <p className="text-xs font-medium italic text-slate-700 leading-snug">
                      {user.quote}
                    </p>
                  </div>
                  <Rocket className="w-4 h-4 text-[#6332ec] shrink-0 mt-0.5" />
                </div>
              )}

              <button
                onClick={() => {
                  setEditModalTab('profile');
                  setEditModalOpen(true);
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-slate-200 hover:border-[#6332ec] bg-white text-xs font-bold text-slate-700 hover:text-[#6332ec] shadow-2xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4 Stat Cards using dynamic stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => setActiveTab('badges')}
            className="bg-white rounded-2xl border border-slate-100 p-5 shadow-2xs hover:shadow-md transition-all flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#6332ec] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Trophy className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <span className="text-xl font-extrabold text-slate-900 block leading-tight">
                  {stats.badges ?? 0}
                </span>
                <span className="text-xs text-slate-500 font-medium">Badges Earned</span>
              </div>
            </div>
            <div className="w-7 h-7 rounded-full bg-slate-50 group-hover:bg-[#6332ec] group-hover:text-white flex items-center justify-center text-slate-400 transition-colors">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div
            onClick={() => setActiveTab('events')}
            className="bg-white rounded-2xl border border-slate-100 p-5 shadow-2xs hover:shadow-md transition-all flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Calendar className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <span className="text-xl font-extrabold text-slate-900 block leading-tight">
                  {stats.events ?? 0}
                </span>
                <span className="text-xs text-slate-500 font-medium">Events Attended</span>
              </div>
            </div>
            <div className="w-7 h-7 rounded-full bg-slate-50 group-hover:bg-[#6332ec] group-hover:text-white flex items-center justify-center text-slate-400 transition-colors">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div
            onClick={() => setActiveTab('projects')}
            className="bg-white rounded-2xl border border-slate-100 p-5 shadow-2xs hover:shadow-md transition-all flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <FolderGit2 className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <span className="text-xl font-extrabold text-slate-900 block leading-tight">
                  {stats.projects ?? 0}
                </span>
                <span className="text-xs text-slate-500 font-medium">Projects Submitted</span>
              </div>
            </div>
            <div className="w-7 h-7 rounded-full bg-slate-50 group-hover:bg-[#6332ec] group-hover:text-white flex items-center justify-center text-slate-400 transition-colors">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div
            onClick={() => setActiveTab('roles')}
            className="bg-white rounded-2xl border border-slate-100 p-5 shadow-2xs hover:shadow-md transition-all flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Users2 className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <span className="text-xl font-extrabold text-slate-900 block leading-tight">
                  {stats.roles ?? 0}
                </span>
                <span className="text-xs text-slate-500 font-medium">Coordinator Roles</span>
              </div>
            </div>
            <div className="w-7 h-7 rounded-full bg-slate-50 group-hover:bg-[#6332ec] group-hover:text-white flex items-center justify-center text-slate-400 transition-colors">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="border-b border-slate-200/80 flex items-center gap-2 overflow-x-auto no-scrollbar pt-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'border-[#6332ec] text-[#6332ec]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Badges Section */}
              <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">My Badges</h3>
                    <p className="text-[11px] text-slate-500">
                      Recognition for your participation and contributions.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('badges')}
                    className="text-xs font-bold text-[#6332ec] hover:underline cursor-pointer"
                  >
                    View All Badges &rarr;
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {badgesList.map((b) => {
                    const cfg = BADGE_CONFIG[b.key] || {
                      name: b.name,
                      desc: b.description,
                      gradient: 'from-purple-500 to-indigo-600',
                      icon: Sparkles,
                    };
                    const Icon = cfg.icon;

                    return (
                      <div
                        key={b.key}
                        className={`p-3.5 rounded-2xl border transition-all flex flex-col items-center text-center relative ${
                          b.earned
                            ? 'bg-gradient-to-b from-white to-purple-50/40 border-purple-200 shadow-xs'
                            : 'bg-slate-50/60 border-slate-100 opacity-75'
                        }`}
                      >
                        <div
                          className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-2 shadow-xs ${
                            b.earned
                              ? `bg-gradient-to-tr ${cfg.gradient} text-white shadow-purple-500/20`
                              : 'bg-slate-200 text-slate-400'
                          }`}
                        >
                          {b.earned ? <Icon className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
                        </div>
                        <span className="text-xs font-bold text-slate-800 leading-tight">
                          {cfg.name}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                          {cfg.desc}
                        </span>
                        <span
                          className={`mt-2 text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full ${
                            b.earned
                              ? 'bg-purple-100 text-[#6332ec]'
                              : 'bg-slate-200 text-slate-400'
                          }`}
                        >
                          {b.earned ? 'Earned' : 'Locked'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent Events (gradient tiles with category icon) */}
              <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">Recent Events</h3>
                    <p className="text-[11px] text-slate-500">
                      Workshops, seminars and hackathons you checked into.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('events')}
                    className="text-xs font-bold text-[#6332ec] hover:underline cursor-pointer"
                  >
                    View All &rarr;
                  </button>
                </div>

                {recentEvents.length === 0 ? (
                  <div className="py-8 text-center text-slate-400">
                    <Calendar className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="text-xs font-medium text-slate-600">No events attended yet</p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Check in with your ticket QR to record your participation!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {recentEvents.map((ev) => (
                      <div
                        key={ev.id}
                        className="p-4 rounded-2xl border border-slate-100 bg-white hover:border-purple-200 transition-all shadow-2xs flex flex-col justify-between"
                      >
                        <div className="flex items-start gap-3">
                          {/* Gradient Tile with Category Icon */}
                          <div
                            className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${getCategoryGradient(
                              ev.category
                            )} flex items-center justify-center shrink-0 border`}
                          >
                            <Calendar className="w-5 h-5" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <span className="text-xs font-bold text-slate-900 line-clamp-1">
                              {ev.name}
                            </span>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge size="xs" variant="purple">
                                {ev.category}
                              </Badge>
                              <span className="text-[10px] text-slate-400 font-medium">
                                {formatDate(ev.startsAt)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-slate-50 flex items-center justify-between text-[11px]">
                          <span className="text-slate-400 truncate max-w-[140px]">
                            {ev.venue || 'AMTICS'}
                          </span>
                          <span className="inline-flex items-center gap-1 font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">
                            <CheckCircle className="w-3 h-3" />
                            Attended
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Coordinator Roles Section */}
              <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">Coordinator Roles</h3>
                    <p className="text-[11px] text-slate-500">
                      Events you lead and coordinate for the chapter.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('roles')}
                    className="text-xs font-bold text-[#6332ec] hover:underline cursor-pointer"
                  >
                    View All &rarr;
                  </button>
                </div>

                {overviewRoles.length === 0 ? (
                  <div className="py-6 text-center text-slate-400">
                    <Users2 className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="text-xs font-medium text-slate-600">No coordinator assignments yet</p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Event coordinators are assigned by the chapter administration.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {overviewRoles.map((role) => (
                      <div
                        key={role.id}
                        className="p-4 rounded-2xl border border-slate-100 bg-white hover:border-purple-200 transition-all shadow-2xs flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#6332ec] flex items-center justify-center shrink-0">
                            <Users2 className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-900 block line-clamp-1">
                              {role.name}
                            </span>
                            <span className="text-[10px] text-[#6332ec] font-semibold">
                              Event Coordinator
                            </span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">
                              {formatDate(role.startsAt)}
                            </span>
                          </div>
                        </div>

                        {role.isCurrent ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-[#6332ec]">
                            Current
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500">
                            Past
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right 1 Col: Quick Info & Open Event Ticket */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-2xs space-y-4">
                <h3 className="text-sm font-extrabold text-slate-900 pb-2 border-b border-slate-100">
                  Quick Info
                </h3>

                <div className="space-y-3.5 text-xs">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Member Since
                    </span>
                    <span className="font-bold text-slate-800">
                      {formatJoinedDate(user?.joinedAt)}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Academic Year
                    </span>
                    <span className="font-bold text-slate-800">
                      {user?.year ? `${user.year} Year ` : ''}
                      ({user?.academicYear || '2025 – 2026'})
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Department
                    </span>
                    <span className="font-bold text-slate-800">
                      {user?.department || 'Computer Science & Engineering'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Enrollment No.
                    </span>
                    <span className="font-bold text-slate-800 font-mono">
                      {user?.enrollmentNumber || '—'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                      College
                    </span>
                    <span className="font-bold text-slate-800">
                      {user?.college || 'AMTICS, Gandhinagar'}
                    </span>
                  </div>
                </div>

                {/* Open My Event Ticket Button */}
                <div className="pt-3">
                  <button
                    onClick={() => setTicketModalOpen(true)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-[#6332ec] hover:from-indigo-700 hover:to-[#5225d3] text-white text-xs font-bold shadow-md shadow-purple-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Ticket className="w-4 h-4" />
                    <span>Open My Event Ticket</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BADGES */}
        {activeTab === 'badges' && (
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-2xs space-y-6">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Badges & Recognition</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Earn badges by actively participating in workshops, competitions, and taking leadership in ACM Amtics.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {badgesList.map((b) => {
                const cfg = BADGE_CONFIG[b.key] || {
                  name: b.name,
                  desc: b.description,
                  gradient: 'from-purple-500 to-indigo-600',
                  icon: Sparkles,
                };
                const Icon = cfg.icon;

                return (
                  <div
                    key={b.key}
                    className={`p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                      b.earned
                        ? 'bg-gradient-to-tr from-purple-50/50 to-white border-purple-200 shadow-xs'
                        : 'bg-slate-50/60 border-slate-100 opacity-70'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
                        b.earned
                          ? `bg-gradient-to-tr ${cfg.gradient} text-white shadow-purple-500/20`
                          : 'bg-slate-200 text-slate-400'
                      }`}
                    >
                      {b.earned ? <Icon className="w-6 h-6" /> : <Lock className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">{cfg.name}</span>
                        {b.earned && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-purple-100 text-[#6332ec]">
                            Earned
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{cfg.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: EVENT HISTORY (Paginated) */}
        {activeTab === 'events' && (
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Event History</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Complete history of workshops, seminars and hackathons attended.
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                Total attended: <span className="text-[#6332ec] font-bold">{userEventsData?.total || stats.events}</span>
              </span>
            </div>

            {(!userEventsData?.data || userEventsData.data.length === 0) ? (
              <div className="py-12 text-center text-slate-400">
                <Calendar className="w-10 h-10 mx-auto mb-2 opacity-40 text-slate-400" />
                <p className="text-sm font-bold text-slate-700">No attendance history found</p>
                <p className="text-xs text-slate-400 mt-1">
                  Attend ACM Amtics events to build your profile attendance record.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {userEventsData.data.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-4 rounded-2xl border border-slate-100 bg-[#fdfcff] hover:border-purple-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#6332ec] flex items-center justify-center shrink-0">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{ev.name}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge size="xs" variant="purple">
                            {ev.category}
                          </Badge>
                          <span className="text-[11px] text-slate-500">
                            {formatDate(ev.startsAt)} &bull; {ev.venue}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full text-xs">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Present
                      </span>
                    </div>
                  </div>
                ))}

                <Pagination
                  currentPage={eventsPage}
                  totalPages={userEventsData.totalPages || 1}
                  onPageChange={(p) => setEventsPage(p)}
                />
              </div>
            )}
          </div>
        )}

        {/* TAB 4: SUBMITTED PROJECTS */}
        {activeTab === 'projects' && (
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-2xs text-center py-16 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto">
              <FolderGit2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No Projects Submitted Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You haven't submitted any projects yet. Participate in hackathons or submit chapter projects to earn contributor recognition.
            </p>
          </div>
        )}

        {/* TAB 5: COORDINATOR ROLES (Paginated) */}
        {activeTab === 'roles' && (
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Coordinator Roles</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Events you have coordinated for the ACM student chapter.
                </p>
              </div>
            </div>

            {(!userRolesData?.data || userRolesData.data.length === 0) ? (
              <div className="py-12 text-center text-slate-400">
                <Users2 className="w-10 h-10 mx-auto mb-2 opacity-40 text-slate-400" />
                <p className="text-sm font-bold text-slate-700">No Coordinator Roles</p>
                <p className="text-xs text-slate-400 mt-1">
                  You are not currently assigned as a coordinator for any event.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {userRolesData.data.map((role) => (
                  <div
                    key={role.id}
                    className="p-4 rounded-2xl border border-slate-100 bg-[#fdfcff] hover:border-purple-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#6332ec] flex items-center justify-center shrink-0">
                        <Users2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{role.name}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] font-semibold text-[#6332ec]">
                            Event Coordinator
                          </span>
                          <span className="text-[11px] text-slate-400">
                            &bull; {formatDate(role.startsAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      {role.isCurrent ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-[#6332ec]">
                          Current
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500">
                          Past
                        </span>
                      )}
                    </div>
                  </div>
                ))}

                <Pagination
                  currentPage={rolesPage}
                  totalPages={userRolesData.totalPages || 1}
                  onPageChange={(p) => setRolesPage(p)}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Real QR Ticket Modal */}
      <TicketModal
        isOpen={ticketModalOpen}
        onClose={() => setTicketModalOpen(false)}
      />

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        initialTab={editModalTab}
      />
    </AppShell>
  );
}
