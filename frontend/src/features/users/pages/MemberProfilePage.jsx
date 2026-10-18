import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Mail,
  MapPin,
  Calendar,
  FolderGit2,
  Users2,
  Trophy,
  Rocket,
  Sparkles,
  Lock,
  CheckCircle,
} from 'lucide-react';
import {
  FaLinkedinIn,
  FaGithub,
  FaInstagram,
} from 'react-icons/fa';
import Avatar from '../../../shared/components/ui/Avatar';
import Badge from '../../../shared/components/ui/Badge';
import Pagination from '../../../shared/components/ui/Pagination';
import {
  getMemberProfileApi,
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

export default function MemberProfilePage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');

  const [eventsPage, setEventsPage] = useState(1);
  const [rolesPage, setRolesPage] = useState(1);

  const {
    data: profileData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['users', 'profile', id],
    queryFn: () => getMemberProfileApi(id),
    staleTime: 5 * 60 * 1000,
  });

  const member = profileData?.user;
  const stats = profileData?.stats || {
    badges: 0,
    events: 0,
    projects: 0,
    roles: 0,
  };
  const badgesList = profileData?.badges || [];
  const recentEvents = profileData?.recentEvents || [];
  const overviewRoles = profileData?.coordinatorRoles || [];

  // Paginated queries for events and roles
  const { data: userEventsData } = useQuery({
    queryKey: ['user-events', id, eventsPage],
    queryFn: () => getUserEventsApi(id, { page: eventsPage, limit: 10 }),
    enabled: activeTab === 'events' && Boolean(id),
  });

  const { data: userRolesData } = useQuery({
    queryKey: ['user-roles', id, rolesPage],
    queryFn: () => getUserCoordinatorRolesApi(id, { page: rolesPage, limit: 10 }),
    enabled: activeTab === 'roles' && Boolean(id),
  });

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'badges', label: 'Badges' },
    { id: 'events', label: 'Events' },
    { id: 'projects', label: 'Projects' },
    { id: 'roles', label: 'Roles' },
  ];

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

  if (isLoading) {
    return (
      <div className="min-h-screen py-16 px-4 max-w-7xl mx-auto space-y-6">
        <div className="h-6 w-48 bg-slate-200/80 rounded-lg animate-pulse" />
        <div className="h-64 bg-white rounded-3xl border border-slate-100 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-white rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !member) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mb-4">
          <Sparkles className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900">Member Not Found</h2>
        <p className="text-xs text-slate-500 mt-1 max-w-sm">
          The requested member profile does not exist or may be inactive.
        </p>
        <Link
          to="/members"
          className="mt-6 px-5 py-2.5 rounded-full bg-[#6332ec] text-white text-xs font-bold hover:bg-[#5225d3] transition-colors"
        >
          &larr; Back to Member Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 font-sans">
      {/* Breadcrumb "Home › People › Name" */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Link to="/" className="hover:text-[#6332ec]">
            Home
          </Link>
          <span>›</span>
          <Link to="/members" className="hover:text-[#6332ec]">
            People
          </Link>
          <span>›</span>
          <span className="text-slate-600 font-semibold">{member.name}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Member <span className="text-[#6332ec]">Profile</span>
            </h1>
            <p className="text-xs text-slate-500">
              Explore the journey, contributions, and achievements of our community member.
            </p>
          </div>
        </div>
      </div>

      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-gradient-to-bl from-purple-100/40 via-indigo-50/20 to-transparent pointer-events-none blur-2xl" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start justify-between gap-6">
          {/* Avatar + Info */}
          <div className="flex flex-col sm:flex-row items-start gap-5">
            <Avatar
              name={member.name}
              id={member.id}
              size="2xl"
              className="ring-4 ring-purple-100/80 shadow-md"
            />

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {member.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-[#6332ec] border border-purple-100 text-xs font-bold">
                  {member.position || member.roleLabel || 'Member'}
                </span>
              </div>

              <p className="text-xs font-semibold text-slate-600">
                {member.year ? `${member.year} Year` : 'Student'} &bull;{' '}
                {member.department || 'Computer Science & Engineering'}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                {member.email && (
                  <div className="flex items-center gap-1.5 text-[#6332ec] font-medium">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{member.email}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>AMTICS, Uka Tarsadia University</span>
                </div>
              </div>

              {member.shortBio && (
                <p className="text-xs text-slate-600 max-w-xl leading-relaxed pt-1">
                  {member.shortBio}
                </p>
              )}
            </div>
          </div>

          {/* Social Icons + Quote */}
          <div className="flex flex-col items-start lg:items-end gap-3.5 w-full lg:w-auto shrink-0">
            <div className="flex items-center gap-2">
              {member.socials?.linkedin && (
                <a
                  href={member.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-[#6332ec] hover:text-white text-slate-500 flex items-center justify-center transition-colors text-sm shadow-2xs"
                  title="LinkedIn"
                >
                  <FaLinkedinIn />
                </a>
              )}
              {member.socials?.github && (
                <a
                  href={member.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-[#6332ec] hover:text-white text-slate-500 flex items-center justify-center transition-colors text-sm shadow-2xs"
                  title="GitHub"
                >
                  <FaGithub />
                </a>
              )}
              {member.socials?.instagram && (
                <a
                  href={member.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-[#6332ec] hover:text-white text-slate-500 flex items-center justify-center transition-colors text-sm shadow-2xs"
                  title="Instagram"
                >
                  <FaInstagram />
                </a>
              )}
            </div>

            {member.quote && (
              <div className="w-full sm:w-72 bg-gradient-to-r from-purple-50/70 to-indigo-50/70 border border-purple-100/70 rounded-2xl p-3.5 flex items-start gap-3 shadow-2xs">
                <span className="text-2xl leading-none text-[#6332ec] font-serif select-none">
                  “
                </span>
                <div className="flex-1">
                  <p className="text-xs font-medium italic text-slate-700 leading-snug">
                    {member.quote}
                  </p>
                </div>
                <Rocket className="w-4 h-4 text-[#6332ec] shrink-0 mt-0.5" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4 Stat Cards using dynamic stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => setActiveTab('badges')}
          className="bg-white rounded-2xl border border-slate-100 p-5 shadow-2xs flex items-center gap-3.5 cursor-pointer hover:border-purple-200 transition-colors"
        >
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#6332ec] flex items-center justify-center">
            <Trophy className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <span className="text-xl font-extrabold text-slate-900 block leading-tight">
              {stats.badges ?? 0}
            </span>
            <span className="text-xs text-slate-500 font-medium">Badges Earned</span>
          </div>
        </div>

        <div
          onClick={() => setActiveTab('events')}
          className="bg-white rounded-2xl border border-slate-100 p-5 shadow-2xs flex items-center gap-3.5 cursor-pointer hover:border-purple-200 transition-colors"
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Calendar className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <span className="text-xl font-extrabold text-slate-900 block leading-tight">
              {stats.events ?? 0}
            </span>
            <span className="text-xs text-slate-500 font-medium">Events Attended</span>
          </div>
        </div>

        <div
          onClick={() => setActiveTab('projects')}
          className="bg-white rounded-2xl border border-slate-100 p-5 shadow-2xs flex items-center gap-3.5 cursor-pointer hover:border-purple-200 transition-colors"
        >
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <FolderGit2 className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <span className="text-xl font-extrabold text-slate-900 block leading-tight">
              {stats.projects ?? 0}
            </span>
            <span className="text-xs text-slate-500 font-medium">Projects Contributed</span>
          </div>
        </div>

        <div
          onClick={() => setActiveTab('roles')}
          className="bg-white rounded-2xl border border-slate-100 p-5 shadow-2xs flex items-center gap-3.5 cursor-pointer hover:border-purple-200 transition-colors"
        >
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Users2 className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <span className="text-xl font-extrabold text-slate-900 block leading-tight">
              {stats.roles ?? 0}
            </span>
            <span className="text-xs text-slate-500 font-medium">Roles Held</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
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

      {/* TAB: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-2xs space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900">About</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {member.about || member.shortBio || 'ACM AMTICS chapter member passionate about technology, collaboration, and learning.'}
            </p>

            {member.skills && member.skills.length > 0 && (
              <div className="pt-2">
                <span className="text-[11px] font-bold text-slate-500 block mb-2">
                  Skills & Technologies
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {member.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-full bg-purple-50 text-[#6332ec] font-semibold text-xs border border-purple-100/60"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Badges Earned */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-extrabold text-slate-900">Badges Earned</h3>
              <span className="text-xs font-bold text-slate-400">{stats.badges} of 6</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
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
                    className={`p-3 rounded-2xl border transition-all flex flex-col items-center text-center ${
                      b.earned
                        ? 'bg-purple-50/50 border-purple-200'
                        : 'bg-slate-50/70 border-slate-100 opacity-60'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center mb-1.5 ${
                        b.earned
                          ? `bg-gradient-to-tr ${cfg.gradient} text-white`
                          : 'bg-slate-200 text-slate-400'
                      }`}
                    >
                      {b.earned ? <Icon className="w-4 h-4" /> : <Lock className="w-3.5 h-3.5" />}
                    </div>
                    <span className="text-[11px] font-bold text-slate-700 leading-tight">
                      {cfg.name}
                    </span>
                    <span className="text-[9px] text-slate-400 mt-0.5 leading-tight">
                      {cfg.desc}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB: BADGES */}
      {activeTab === 'badges' && (
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-2xs space-y-6">
          <h3 className="text-base font-extrabold text-slate-900">Badges & Achievements</h3>
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

      {/* TAB: EVENTS (Paginated) */}
      {activeTab === 'events' && (
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900">Events Attended</h3>
            <span className="text-xs font-semibold text-slate-500">
              Total: <span className="text-[#6332ec] font-bold">{userEventsData?.total || stats.events}</span>
            </span>
          </div>

          {(!userEventsData?.data || userEventsData.data.length === 0) ? (
            <div className="py-12 text-center text-slate-400">
              <Calendar className="w-10 h-10 mx-auto mb-2 opacity-40 text-slate-400" />
              <p className="text-sm font-bold text-slate-700">No events attended yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {userEventsData.data.map((ev) => (
                <div
                  key={ev.id}
                  className="p-4 rounded-2xl border border-slate-100 bg-[#fdfcff] flex items-center justify-between gap-3"
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

                  <span className="inline-flex items-center gap-1 font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full text-xs">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Attended
                  </span>
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

      {/* TAB: PROJECTS */}
      {activeTab === 'projects' && (
        <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-2xs text-center py-16 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto">
            <FolderGit2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No Projects Submitted Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            This member has not submitted any showcase projects yet.
          </p>
        </div>
      )}

      {/* TAB: ROLES (Paginated) */}
      {activeTab === 'roles' && (
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-2xs space-y-6">
          <h3 className="text-base font-extrabold text-slate-900">Coordinator Roles</h3>

          {(!userRolesData?.data || userRolesData.data.length === 0) ? (
            <div className="py-12 text-center text-slate-400">
              <Users2 className="w-10 h-10 mx-auto mb-2 opacity-40 text-slate-400" />
              <p className="text-sm font-bold text-slate-700">No Coordinator Roles</p>
            </div>
          ) : (
            <div className="space-y-3">
              {userRolesData.data.map((role) => (
                <div
                  key={role.id}
                  className="p-4 rounded-2xl border border-slate-100 bg-[#fdfcff] flex items-center justify-between gap-3"
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
  );
}
