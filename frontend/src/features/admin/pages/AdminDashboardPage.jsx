import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Users,
  Calendar,
  UserCheck,
  FolderGit2,
} from 'lucide-react';
import AppShell from '../../../shared/components/layout/AppShell';
import StatCard from '../../../shared/components/ui/StatCard';
import MembersTable from '../components/MembersTable';
import { getAdminDashboardApi } from '../api/admin.api';
import { useAuth } from '../../auth/hooks/useAuth';

export default function AdminDashboardPage() {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: getAdminDashboardApi,
  });

  const stats = data?.data || data || {};

  // Format today's date in IST e.g. "Mon, 14 Apr 2025"
  const todayIST = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date());

  const firstName = user?.name ? user.name.split(' ')[0] : 'Admin';

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Welcome back, {firstName}! Here's an overview of ACM Amtics.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-white border border-slate-200/60 shadow-2xs text-xs font-semibold text-slate-600">
            <Calendar className="w-4 h-4 text-[#6332ec]" />
            <span>{todayIST}</span>
          </div>
        </div>

        {/* 3 Stat Cards (Members, Events, Attendees) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <StatCard
            label="Members"
            value={stats.members?.total ?? 0}
            growthPercent={stats.members?.growthPercent}
            growthLabel="from last month"
            icon={Users}
            iconBg="bg-purple-50 text-[#6332ec]"
            loading={isLoading}
          />
          <StatCard
            label="Events"
            value={stats.events?.total ?? 0}
            growthPercent={stats.events?.growthPercent}
            growthLabel="from last month"
            icon={Calendar}
            iconBg="bg-indigo-50 text-indigo-600"
            loading={isLoading}
          />
          <StatCard
            label="Attendees"
            value={stats.attendees?.total ?? 0}
            growthPercent={stats.attendees?.growthPercent}
            growthLabel="from last month"
            icon={UserCheck}
            iconBg="bg-blue-50 text-blue-600"
            loading={isLoading}
          />
        </div>

        {/* All Members Table */}
        <MembersTable />
      </div>
    </AppShell>
  );
}
