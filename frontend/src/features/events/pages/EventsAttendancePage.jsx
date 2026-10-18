import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Calendar,
  Users,
  Eye,
  Edit2,
  Trash2,
  Plus,
  ScanLine,
  AlertCircle,
  FolderGit2,
} from 'lucide-react';
import AppShell from '../../../shared/components/layout/AppShell';
import StatCard from '../../../shared/components/ui/StatCard';
import Badge from '../../../shared/components/ui/Badge';
import SearchInput from '../../../shared/components/ui/SearchInput';
import Button from '../../../shared/components/ui/Button';
import Pagination from '../../../shared/components/ui/Pagination';
import ConfirmDialog from '../../../shared/components/ui/ConfirmDialog';
import AddEditEventModal from '../components/AddEditEventModal';
import ScannerModal from '../components/ScannerModal';
import {
  getEventsApi,
  getEventStatsApi,
  deleteEventApi,
} from '../api/events.api';
import { useAuth } from '../../auth/hooks/useAuth';

export default function EventsAttendancePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const isAdminLike = Boolean(
    user?.permissions?.isAdminLike ?? (user?.role === 'admin' || user?.showDashboard === true)
  );

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const limit = 8;

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editEventId, setEditEventId] = useState(null);
  const [deleteEvent, setDeleteEvent] = useState(null);

  // Scanner Modal state
  const [activeScannerEvent, setActiveScannerEvent] = useState(null); // { id, name }

  // 1. Fetch Events Stats
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['events', 'stats'],
    queryFn: getEventStatsApi,
  });

  const stats = statsData?.data || statsData || {};

  // 2. Fetch Events List
  const { data: eventsData, isLoading: eventsLoading, isError, refetch } = useQuery({
    queryKey: ['events', 'list', { page, search, limit }],
    queryFn: () =>
      getEventsApi({
        page,
        limit,
        q: search || undefined,
      }),
    keepPreviousData: true,
  });

  const events = eventsData?.data || [];
  const total = eventsData?.total || 0;
  const totalPages = eventsData?.totalPages || 1;

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => deleteEventApi(id),
    onSuccess: () => {
      toast.success('Event deleted successfully');
      queryClient.invalidateQueries(['events']);
      queryClient.invalidateQueries(['admin', 'dashboard']);
      setDeleteEvent(null);
    },
    onError: (err) => {
      const resp = err.response?.data;
      toast.error(resp?.message || 'Failed to delete event');
    },
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getCategoryBadgeVariant = (category) => {
    switch (category) {
      case 'Workshop':
        return 'purple';
      case 'Seminar':
        return 'blue';
      case 'Competition':
        return 'danger';
      case 'Talk':
        return 'success';
      default:
        return 'neutral';
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Events & Attendance
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage events and view attendance statistics for ACM Amtics.
          </p>
        </div>

        {/* 2 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <StatCard
            label="Total Events"
            value={stats.totalEvents?.total ?? 0}
            growthPercent={stats.totalEvents?.growthPercent}
            growthLabel="from last semester"
            icon={Calendar}
            iconBg="bg-indigo-50 text-indigo-600"
            loading={statsLoading}
          />
          <StatCard
            label="Total Attendees"
            value={stats.totalAttendees?.total ?? 0}
            growthPercent={stats.totalAttendees?.growthPercent}
            growthLabel="from last semester"
            icon={Users}
            iconBg="bg-purple-50 text-[#6332ec]"
            loading={statsLoading}
          />
        </div>

        {/* All Events Table Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                All Events
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                View all events conducted by ACM Amtics and their attendance.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <SearchInput
                placeholder="Search events..."
                value={search}
                onChange={(val) => {
                  setSearch(val);
                  setPage(1);
                }}
                className="w-full sm:w-64"
              />

              {isAdminLike && (
                <Button
                  variant="primary"
                  size="md"
                  icon={Plus}
                  onClick={() => setAddModalOpen(true)}
                  className="shrink-0"
                >
                  Add Event
                </Button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto min-h-[360px]">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-[#fcfbfe] text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100 sticky top-0 z-10">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4">Event Name</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Attendees</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {eventsLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={`skel-${i}`} className="animate-pulse">
                      <td className="py-3.5 px-4 text-center">
                        <div className="h-4 w-4 bg-slate-200 rounded mx-auto" />
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="h-4 w-48 bg-slate-200 rounded" />
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="h-4 w-24 bg-slate-200 rounded" />
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="h-5 w-20 bg-slate-200 rounded-full" />
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="h-4 w-16 bg-slate-200 rounded" />
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="h-4 w-16 bg-slate-200 rounded mx-auto" />
                      </td>
                    </tr>
                  ))
                ) : isError ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <AlertCircle className="w-6 h-6 text-rose-500" />
                        <p className="text-xs font-semibold text-slate-700">
                          Failed to load events
                        </p>
                        <Button variant="ghost" size="sm" onClick={() => refetch()}>
                          Try Again
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : events.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                        <Calendar className="w-8 h-8 text-slate-300" />
                        <p className="text-xs font-semibold text-slate-600">
                          No events found
                        </p>
                        <p className="text-[11px]">
                          {search ? 'Try clearing your search query.' : 'No events scheduled yet.'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  events.map((ev, idx) => {
                    const rowNum = (page - 1) * limit + idx + 1;

                    return (
                      <tr
                        key={ev.id}
                        onClick={() => navigate(`/panel/events/${ev.id}`)}
                        className="hover:bg-purple-50/30 transition-colors group cursor-pointer"
                      >
                        <td className="py-3.5 px-4 text-center font-medium text-slate-400">
                          {rowNum}
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-900 group-hover:text-[#6332ec] transition-colors">
                              {ev.name}
                            </span>
                            {ev.isToday && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#6332ec]/10 text-[#6332ec] border border-[#6332ec]/20">
                                Today
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-slate-500">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>{formatDate(ev.startsAt)}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <Badge
                            variant={getCategoryBadgeVariant(ev.category)}
                            size="sm"
                            className="font-medium"
                          >
                            {ev.category}
                          </Badge>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5 text-slate-600 font-semibold">
                              <Users className="w-3.5 h-3.5 text-slate-400" />
                              <span>{ev.attendeeCount ?? 0}</span>
                            </div>

                            {/* Scan Button when canScan is true */}
                            {ev.canScan && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveScannerEvent({ id: ev.id, name: ev.name });
                                }}
                                title="Scan Tickets for this event"
                                className="p-1.5 rounded-lg bg-purple-50 hover:bg-[#6332ec] text-[#6332ec] hover:text-white transition-all shadow-xs cursor-pointer"
                              >
                                <ScanLine className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-1 text-slate-400">
                            <button
                              onClick={() => navigate(`/panel/events/${ev.id}`)}
                              title="View Attendees"
                              className="p-1.5 hover:text-[#6332ec] hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {isAdminLike && (
                              <>
                                <button
                                  onClick={() => setEditEventId(ev.id)}
                                  title="Edit Event"
                                  className="p-1.5 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setDeleteEvent(ev)}
                                  title="Delete Event"
                                  className="p-1.5 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Pagination */}
          <div className="p-4 sm:p-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500">
              Showing{' '}
              <span className="font-semibold text-slate-800">
                {total === 0 ? 0 : (page - 1) * limit + 1}
              </span>{' '}
              to{' '}
              <span className="font-semibold text-slate-800">
                {Math.min(page * limit, total)}
              </span>{' '}
              of <span className="font-semibold text-slate-800">{total}</span> events
            </p>

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        </div>

        {/* Add / Edit Event Modal */}
        {(addModalOpen || editEventId) && (
          <AddEditEventModal
            isOpen={addModalOpen || Boolean(editEventId)}
            eventId={editEventId}
            onClose={() => {
              setAddModalOpen(false);
              setEditEventId(null);
            }}
            onSuccess={() => {
              refetch();
              queryClient.invalidateQueries(['events', 'stats']);
              queryClient.invalidateQueries(['admin', 'dashboard']);
            }}
          />
        )}

        {/* Scanner Modal */}
        {activeScannerEvent && (
          <ScannerModal
            isOpen={Boolean(activeScannerEvent)}
            eventId={activeScannerEvent.id}
            eventName={activeScannerEvent.name}
            onClose={() => setActiveScannerEvent(null)}
          />
        )}

        {/* Delete Confirm Dialog */}
        <ConfirmDialog
          isOpen={Boolean(deleteEvent)}
          title="Delete Event?"
          message={`Are you sure you want to delete "${deleteEvent?.name}"? If any attendance exists, this action will be rejected.`}
          confirmText="Delete"
          confirmVariant="danger"
          loading={deleteMutation.isLoading}
          onConfirm={() => deleteMutation.mutate(deleteEvent?.id)}
          onClose={() => setDeleteEvent(null)}
        />
      </div>
    </AppShell>
  );
}
