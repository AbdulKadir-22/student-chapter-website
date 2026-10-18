import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Search,
  Filter,
  X,
  LayoutGrid,
  List,
  Sparkles,
  ArrowRight,
  RotateCcw,
  AlertCircle,
} from 'lucide-react';
import {
  FaLinkedinIn,
  FaGithub,
  FaInstagram,
} from 'react-icons/fa';
import MemberShell from '../../../shared/components/layout/MemberShell';
import Avatar from '../../../shared/components/ui/Avatar';
import Pagination from '../../../shared/components/ui/Pagination';
import {
  getFeaturedUsersApi,
  getFiltersApi,
  getDirectoryApi,
} from '../api/user.api';

export default function MemberDirectoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read URL query params
  const qParam = searchParams.get('q') || '';
  const roleParam = searchParams.get('role') || '';
  const yearParam = searchParams.get('year') || '';
  const deptParam = searchParams.get('department') || '';
  const sortParam = searchParams.get('sort') || 'name_asc';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const viewParam = searchParams.get('view') || 'grid';

  // Local state for debounced search input
  const [searchInput, setSearchInput] = useState(qParam);

  // Sync search input when URL changes
  useEffect(() => {
    setSearchInput(qParam);
  }, [qParam]);

  // Debounce search input (400ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== qParam) {
        updateQuery({ q: searchInput || undefined, page: 1 });
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Helper to update query parameters in URL
  const updateQuery = (newParams) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, val]) => {
      if (val === undefined || val === null || val === '') {
        next.delete(key);
      } else {
        next.set(key, val.toString());
      }
    });
    setSearchParams(next);
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilterOrSearch = !!(
    qParam.trim() ||
    roleParam ||
    yearParam ||
    deptParam
  );

  // 1. Fetch Filters
  const { data: filtersData } = useQuery({
    queryKey: ['users', 'filters'],
    queryFn: getFiltersApi,
    staleTime: 5 * 60 * 1000,
  });

  const availableRoles = filtersData?.data?.roles || [
    'Chairperson',
    'Vice Chairperson',
    'Secretary',
    'Joint Secretary',
    'Core Member',
  ];
  const availableYears = filtersData?.data?.years || [1, 2, 3, 4];
  const availableDepts = filtersData?.data?.departments || [
    'Computer Science & Engineering',
    'Information Technology',
  ];

  // 2. Fetch Featured Users (shown only when no active filter or search)
  const { data: featuredData, isLoading: loadingFeatured } = useQuery({
    queryKey: ['users', 'featured'],
    queryFn: getFeaturedUsersApi,
    staleTime: 5 * 60 * 1000,
  });

  const featuredMembers = featuredData?.data || [];

  // 3. Fetch Directory
  const {
    data: directoryData,
    isLoading: loadingDirectory,
    isError: directoryError,
    refetch: refetchDirectory,
  } = useQuery({
    queryKey: [
      'users',
      'directory',
      {
        q: qParam,
        role: roleParam,
        year: yearParam,
        department: deptParam,
        sort: sortParam,
        page: pageParam,
      },
    ],
    queryFn: () =>
      getDirectoryApi({
        q: qParam,
        role: roleParam,
        year: yearParam,
        department: deptParam,
        sort: sortParam,
        page: pageParam,
        limit: 8,
      }),
    placeholderData: (prev) => prev,
    staleTime: 5 * 60 * 1000,
  });

  const members = directoryData?.data || [];
  const totalMembers = directoryData?.total || 0;
  const totalPages = directoryData?.totalPages || 1;

  // Position color helper
  const getPositionBadge = (pos) => {
    switch (pos) {
      case 'Chairperson':
        return 'bg-purple-50 text-[#6332ec] border-purple-200';
      case 'Vice Chairperson':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Secretary':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Joint Secretary':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-sky-50 text-sky-700 border-sky-200';
    }
  };

  return (
    <MemberShell>
      <div className="space-y-8">
        {/* Breadcrumb & Header Title */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Link to="/" className="hover:text-[#6332ec]">
              Home
            </Link>
            <span>›</span>
            <span className="text-slate-600 font-semibold">Members</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Member <span className="text-[#6332ec]">Directory</span>
              </h1>
              <p className="text-xs text-slate-500">
                Discover and connect with amazing members of ACM AMTICS. Explore their skills, interests, and contributions.
              </p>
            </div>

            {/* Handwritten Floating Word */}
            <div className="hidden md:flex flex-col items-center transform -rotate-3 pointer-events-none self-end">
              <span className="font-['Caveat',cursive] text-slate-400 text-sm">
                Ideas • People • Technology • Community • Impact
              </span>
            </div>
          </div>
        </div>

        {/* Banner with Slot for Image or Fallback */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-purple-100/70 via-indigo-50/80 to-purple-50/60 border border-purple-100/70 p-6 sm:p-8 min-h-[140px] flex items-center justify-between shadow-2xs">
          <div className="relative z-10 max-w-md space-y-1">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white text-[#6332ec] font-bold text-[10px] shadow-2xs">
              <Sparkles className="w-3 h-3 text-[#6332ec]" />
              <span>Connect & Collaborate</span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
              Build with the Brightest Minds
            </h2>
            <p className="text-xs text-slate-600">
              Find peers across CSE & IT departments sharing passions in AI/ML, Design, Web Development, and Open Source.
            </p>
          </div>

          {/* Banner Graphic: Fallback with floating avatars and badges */}
          <div className="hidden md:flex items-center gap-3 relative z-10">
            <div className="flex -space-x-3 overflow-hidden p-1">
              <Avatar name="Ayesha Khan" id="ayesha" size="lg" className="ring-4 ring-white" />
              <Avatar name="Rohan Mehta" id="rohan" size="lg" className="ring-4 ring-white" />
              <Avatar name="Zara Sheikh" id="zara" size="lg" className="ring-4 ring-white" />
              <Avatar name="Arman Siddiqui" id="arman" size="lg" className="ring-4 ring-white" />
            </div>
          </div>

          {/* Background Decorative Rings */}
          <div className="absolute right-0 bottom-0 w-64 h-64 rounded-full bg-purple-200/30 blur-2xl pointer-events-none" />
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-2xs p-3.5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name, skills, role, or department..."
              className="w-full bg-[#f8f7fd] text-slate-800 text-xs rounded-xl pl-9 pr-8 py-2.5 border border-slate-200/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6332ec]/20 focus:border-[#6332ec] transition-all"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Dropdown Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Roles */}
            <select
              value={roleParam}
              onChange={(e) => updateQuery({ role: e.target.value, page: 1 })}
              className="bg-[#f8f7fd] text-xs font-semibold text-slate-700 rounded-xl px-3 py-2.5 border border-slate-200/60 focus:outline-none focus:ring-1 focus:ring-[#6332ec] cursor-pointer"
            >
              <option value="">All Roles</option>
              {availableRoles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>

            {/* Years */}
            <select
              value={yearParam}
              onChange={(e) => updateQuery({ year: e.target.value, page: 1 })}
              className="bg-[#f8f7fd] text-xs font-semibold text-slate-700 rounded-xl px-3 py-2.5 border border-slate-200/60 focus:outline-none focus:ring-1 focus:ring-[#6332ec] cursor-pointer"
            >
              <option value="">All Years</option>
              {availableYears.map((y) => (
                <option key={y} value={y}>
                  Year {y}
                </option>
              ))}
            </select>

            {/* Departments */}
            <select
              value={deptParam}
              onChange={(e) => updateQuery({ department: e.target.value, page: 1 })}
              className="bg-[#f8f7fd] text-xs font-semibold text-slate-700 rounded-xl px-3 py-2.5 border border-slate-200/60 focus:outline-none focus:ring-1 focus:ring-[#6332ec] cursor-pointer"
            >
              <option value="">All Departments</option>
              {availableDepts.map((d) => (
                <option key={d} value={d}>
                  {d.includes('Information') ? 'IT' : 'CSE'}
                </option>
              ))}
            </select>

            {/* Clear Filters Button */}
            {hasActiveFilterOrSearch && (
              <button
                onClick={handleClearFilters}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* FEATURED MEMBERS SECTION (Hidden when any filter or search is active) */}
        {!hasActiveFilterOrSearch && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-purple-100 text-[#6332ec] flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 leading-tight">
                    Featured Members
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Active contributors making a difference in our community.
                  </p>
                </div>
              </div>

              <Link
                to="/heads"
                className="text-xs font-bold text-[#6332ec] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View All Featured</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {loadingFeatured ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-64 rounded-3xl bg-white border border-slate-100 animate-pulse p-5"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {featuredMembers.map((member) => (
                  <div
                    key={member.id}
                    className="bg-white rounded-3xl border border-slate-100 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Avatar + Name + Year */}
                      <div className="flex items-start gap-3.5 mb-3">
                        <Avatar name={member.name} id={member.id} size="lg" />
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-bold text-slate-900 truncate leading-tight group-hover:text-[#6332ec] transition-colors">
                            {member.name}
                          </h4>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {member.year}rd Year &bull;{' '}
                            {member.department.includes('Information') ? 'IT' : 'CSE'}
                          </p>
                          <span
                            className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${getPositionBadge(
                              member.position
                            )}`}
                          >
                            {member.position}
                          </span>
                        </div>
                      </div>

                      {/* Short Bio */}
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed min-h-[32px] mb-3">
                        {member.shortBio || 'Active community contributor at ACM AMTICS.'}
                      </p>

                      {/* Skill Chips */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {(member.skills || []).slice(0, 3).map((s) => (
                          <span
                            key={s}
                            className="px-2 py-0.5 rounded-full bg-purple-50 text-[#6332ec] text-[10px] font-semibold border border-purple-100/60"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom: Social Icons + Profile Arrow */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {member.socials?.linkedin && (
                          <a
                            href={member.socials.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-6 h-6 rounded-lg bg-slate-50 hover:bg-[#6332ec] hover:text-white text-slate-500 flex items-center justify-center transition-colors text-xs"
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
                            className="w-6 h-6 rounded-lg bg-slate-50 hover:bg-[#6332ec] hover:text-white text-slate-500 flex items-center justify-center transition-colors text-xs"
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
                            className="w-6 h-6 rounded-lg bg-slate-50 hover:bg-[#6332ec] hover:text-white text-slate-500 flex items-center justify-center transition-colors text-xs"
                            title="Instagram"
                          >
                            <FaInstagram />
                          </a>
                        )}
                      </div>

                      <Link
                        to={`/members/${member.id}`}
                        className="w-7 h-7 rounded-full bg-slate-50 group-hover:bg-[#6332ec] group-hover:text-white flex items-center justify-center text-slate-400 transition-colors"
                        title="View Profile"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ALL MEMBERS SECTION */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 leading-tight">
                All Members
              </h3>
              <p className="text-[11px] text-slate-500">
                Browse and connect with our community members.
              </p>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-auto">
              <span className="text-xs font-semibold text-slate-500">
                Showing {members.length > 0 ? `${(pageParam - 1) * 8 + 1}–${Math.min(pageParam * 8, totalMembers)}` : '0'} of {totalMembers} members
              </span>

              {/* Sort Dropdown */}
              <select
                value={sortParam}
                onChange={(e) => updateQuery({ sort: e.target.value, page: 1 })}
                className="bg-white text-xs font-semibold text-slate-700 rounded-xl px-3 py-1.5 border border-slate-200 shadow-2xs focus:outline-none focus:ring-1 focus:ring-[#6332ec] cursor-pointer"
              >
                <option value="name_asc">Sort by: Name (A–Z)</option>
                <option value="name_desc">Sort by: Name (Z–A)</option>
                <option value="year_desc">Sort by: Year</option>
                <option value="recent">Sort by: Recently joined</option>
              </select>

              {/* Grid / List Toggle */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
                <button
                  onClick={() => updateQuery({ view: 'grid' })}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                    viewParam === 'grid'
                      ? 'bg-white text-[#6332ec] shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => updateQuery({ view: 'list' })}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                    viewParam === 'list'
                      ? 'bg-white text-[#6332ec] shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="List View"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Error State */}
          {directoryError && (
            <div className="p-8 bg-rose-50 border border-rose-200 rounded-3xl text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
              <p className="text-xs font-bold text-rose-900">
                Failed to load members directory.
              </p>
              <button
                onClick={() => refetchDirectory()}
                className="px-4 py-2 bg-rose-600 text-white text-xs font-semibold rounded-xl hover:bg-rose-700 cursor-pointer"
              >
                Retry
              </button>
            </div>
          )}

          {/* Loading Skeletons */}
          {loadingDirectory && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="h-60 rounded-3xl bg-white border border-slate-100 animate-pulse p-5"
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loadingDirectory && !directoryError && members.length === 0 && (
            <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-2xs space-y-3">
              <Search className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="text-sm font-extrabold text-slate-800">
                No matching members found
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                We couldn't find any members matching your current search or filter criteria.
              </p>
              <div className="pt-2">
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2 bg-[#6332ec] text-white text-xs font-bold rounded-xl hover:bg-[#5225d3] cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}

          {/* Members Display */}
          {!loadingDirectory && !directoryError && members.length > 0 && (
            <>
              {viewParam === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className="bg-white rounded-3xl border border-slate-100 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
                    >
                      <div>
                        {/* Avatar + Info */}
                        <div className="flex items-start gap-3.5 mb-3">
                          <Avatar name={member.name} id={member.id} size="lg" />
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm font-bold text-slate-900 truncate leading-tight group-hover:text-[#6332ec] transition-colors">
                              {member.name}
                            </h4>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              {member.year}rd Year &bull;{' '}
                              {member.department?.includes('Information') ? 'IT' : 'CSE'}
                            </p>
                            <span
                              className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${getPositionBadge(
                                member.position
                              )}`}
                            >
                              {member.position || 'Core Member'}
                            </span>
                          </div>
                        </div>

                        {/* Short Bio */}
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed min-h-[32px] mb-3">
                          {member.shortBio || 'ACM AMTICS student chapter member.'}
                        </p>

                        {/* Skills */}
                        <div className="flex flex-wrap gap-1 mb-4">
                          {(member.skills || []).slice(0, 3).map((s) => (
                            <span
                              key={s}
                              className="px-2 py-0.5 rounded-full bg-purple-50 text-[#6332ec] text-[10px] font-semibold border border-purple-100/60"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {member.socials?.linkedin && (
                            <a
                              href={member.socials.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-6 h-6 rounded-lg bg-slate-50 hover:bg-[#6332ec] hover:text-white text-slate-500 flex items-center justify-center transition-colors text-xs"
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
                              className="w-6 h-6 rounded-lg bg-slate-50 hover:bg-[#6332ec] hover:text-white text-slate-500 flex items-center justify-center transition-colors text-xs"
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
                              className="w-6 h-6 rounded-lg bg-slate-50 hover:bg-[#6332ec] hover:text-white text-slate-500 flex items-center justify-center transition-colors text-xs"
                              title="Instagram"
                            >
                              <FaInstagram />
                            </a>
                          )}
                        </div>

                        <Link
                          to={`/members/${member.id}`}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-[#6332ec] text-slate-700 hover:text-[#6332ec] text-[11px] font-bold transition-colors"
                        >
                          View Profile &rarr;
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* List View (Compact Rows) */
                <div className="space-y-2.5">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className="bg-white rounded-2xl border border-slate-100 p-4 shadow-2xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <Avatar name={member.name} id={member.id} size="md" />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-[#6332ec] transition-colors">
                              {member.name}
                            </h4>
                            <span
                              className={`px-2 py-0.2 rounded-full text-[9px] font-bold border ${getPositionBadge(
                                member.position
                              )}`}
                            >
                              {member.position || 'Core Member'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">
                            {member.year}rd Year &bull; {member.department} &bull;{' '}
                            {member.shortBio || 'Member'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 self-end sm:self-auto shrink-0">
                        <div className="hidden md:flex items-center gap-1">
                          {(member.skills || []).slice(0, 3).map((s) => (
                            <span
                              key={s}
                              className="px-2 py-0.5 rounded-full bg-purple-50 text-[#6332ec] text-[10px] font-semibold border border-purple-100/60"
                            >
                              {s}
                            </span>
                          ))}
                        </div>

                        <Link
                          to={`/members/${member.id}`}
                          className="px-3.5 py-1.5 rounded-xl bg-slate-50 hover:bg-[#6332ec] hover:text-white text-slate-700 text-xs font-bold transition-colors"
                        >
                          View Profile
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              <Pagination
                currentPage={pageParam}
                totalPages={totalPages}
                onPageChange={(page) => updateQuery({ page })}
              />
            </>
          )}
        </div>
      </div>
    </MemberShell>
  );
}
