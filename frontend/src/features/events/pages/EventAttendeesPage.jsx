import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  UserCheck,
  TrendingUp,
  Download,
  ScanLine,
  ExternalLink,
  MoreVertical,
  Trash2,
  Eye,
  AlertCircle,
} from 'lucide-react';
import AppShell from '../../../shared/components/layout/AppShell';
import StatCard from '../../../shared/components/ui/StatCard';
import Badge from '../../../shared/components/ui/Badge';
import Avatar from '../../../shared/components/ui/Avatar';
import SearchInput from '../../../shared/components/ui/SearchInput';
import Button from '../../../shared/components/ui/Button';
import Pagination from '../../../shared/components/ui/Pagination';
import ConfirmDialog from '../../../shared/components/ui/ConfirmDialog';
import ScannerModal from '../components/ScannerModal';
import AddEditEventModal from '../components/AddEditEventModal';
import {
  getEventAttendeesApi,
  exportEventAttendeesApi,
  removeAttendeeApi,
} from '../api/events.api';
import { useAuth } from '../../auth/hooks/useAuth';

export default function EventAttendeesPage() {
  const { id: eventId } = useParams();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const isAdminLike = Boolean(
    user?.permissions?.isAdminLike ?? (user?.role === 'admin' || user?.showDashboard === true)
  );

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const limit = 8;

  const [scannerOpen, setScannerOpen] = useState(false);
  const [editEventModalOpen, setEditEventModalOpen] = useState(false);
  const [removeAttendeeTarget, setRemoveAttendeeTarget] = useState(null); // { userId, name }
  const [openActionMenuId, setOpenActionMenuId] = useState(null);

  // Poll attendee list every 15 seconds while scanner modal is open, and on window focus
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['attendees', eventId, { page, search, limit }],
    queryFn: () =>
      getEventAttendeesApi(eventId, {
        page,
        limit,
        q: search || undefined,
      }),
    refetchInterval: scannerOpen ? 15000 : false,
    refetchOnWindowFocus: true,
    keepPreviousData: true,
  });

  const event = data?.event || {};
  const stats = data?.stats || {};
  const attendees = data?.data || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  // Remove attendee mutation
  const removeMutation = useMutation({
    mutationFn: (userId) => removeAttendeeApi(eventId, userId),
    onSuccess: () => {
      toast.success('Attendee removed from event');
      queryClient.invalidateQueries(['attendees', eventId]);
      queryClient.invalidateQueries(['events']);
      queryClient.invalidateQueries(['admin', 'dashboard']);
      setRemoveAttendeeTarget(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to remove attendee');
    },
  });

  const handleExportCSV = async () => {
    try {
      toast.loading('Preparing CSV export...', { id: 'csv-export' });
      await exportEventAttendeesApi(eventId, event.name);
      toast.success('Export downloaded successfully!', { id: 'csv-export' });
    } catch (err) {
      toast.error('Failed to export CSV', { id: 'csv-export' });
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-GB', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatEventTimeRange = (startStr, endStr) => {
    if (!startStr || !endStr) return '';
    const s = formatTime(startStr);
    const e = formatTime(endStr);
    return `${s} – ${e}`;
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
        {/* Back Link */}
        <div>
          <Link
            to="/panel/events"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-[#6332ec] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Events</span>
          </Link>
        </div>

        {/* Top Header Card */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Attendees
              </h1>
              <span className="text-slate-300 font-light text-lg">/</span>
              <span className="text-base sm:text-lg font-bold text-slate-700">
                {event.name || 'Event'}
              </span>
            </div>

            {/* Meta Row */}
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{formatDate(event.startsAt)}</span>
                {event.isToday && (
                  <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#6332ec]/10 text-[#6332ec] border border-[#6332ec]/20">
                    Today
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{formatEventTimeRange(event.startsAt, event.endsAt)}</span>
              </div>

              {event.venue && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{event.venue}</span>
                </div>
              )}

              {event.category && (
                <Badge
                  variant={getCategoryBadgeVariant(event.category)}
                  size="sm"
                >
                  {event.category}
                </Badge>
              )}
            </div>
          </div>

          {/* Action Buttons: Scanner & View Event Details */}
          <div className="flex items-center gap-3">
            {event.canScan && (
              <Button
                variant="primary"
                size="md"
                icon={ScanLine}
                onClick={() => setScannerOpen(true)}
              >
                Scan Ticket
              </Button>
            )}

            {isAdminLike && (
              <Button
                variant="outline"
                size="md"
                icon={ExternalLink}
                onClick={() => setEditEventModalOpen(true)}
              >
                View Event Details
              </Button>
            )}
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <StatCard
            label="Total Attendees"
            value={stats.totalAttendees ?? 0}
            growthPercent={null}
            icon={Users}
            iconBg="bg-purple-50 text-[#6332ec]"
            loading={isLoading}
          />
          <StatCard
            label="Members"
            value={typeof stats.members === 'object' ? stats.members?.count ?? 0 : stats.members ?? 0}
            growthPercent={null}
            growthLabel={
              typeof stats.members === 'object' && stats.members?.percentage !== undefined
                ? `${stats.members.percentage}% of attendees`
                : stats.totalAttendees > 0
                ? `${Math.round(((typeof stats.members === 'number' ? stats.members : 0) / stats.totalAttendees) * 100)}% of attendees`
                : '0% of attendees'
            }
            icon={UserCheck}
            iconBg="bg-indigo-50 text-indigo-600"
            loading={isLoading}
          />
          <StatCard
            label="Non-Members"
            value={0}
            growthPercent={null}
            growthLabel="0% of attendees"
            icon={Users}
            iconBg="bg-slate-50 text-slate-600"
            loading={isLoading}
          />
          <StatCard
            label="Attendance Rate"
            value={`${stats.attendanceRate ?? 0}%`}
            growthPercent={stats.rateDelta}
            growthLabel="vs last event"
            icon={TrendingUp}
            iconBg="bg-emerald-50 text-emerald-600"
            loading={isLoading}
          />
        </div>

        {/* Attendees List Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Attendees ({total})
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                List of all students who attended this event.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <SearchInput
                placeholder="Search by name, email or enrollment..."
                value={search}
                onChange={(val) => {
                  setSearch(val);
                  setPage(1);
                }}
                className="w-full sm:w-72"
              />

              <Button
                variant="outline"
                size="md"
                icon={Download}
                onClick={handleExportCSV}
                className="shrink-0"
              >
                Export
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto min-h-[340px]">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-[#fcfbfe] text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100 sticky top-0 z-10">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Enrollment No.</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Joined At</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={`skel-${i}`} className="animate-pulse">
                      <td className="py-3.5 px-4 text-center">
                        <div className="h-4 w-4 bg-slate-200 rounded mx-auto" />
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-200" />
                          <div className="h-4 w-32 bg-slate-200 rounded" />
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="h-4 w-36 bg-slate-200 rounded" />
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="h-4 w-28 bg-slate-200 rounded" />
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="h-5 w-16 bg-slate-200 rounded-full" />
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="h-5 w-16 bg-slate-200 rounded-full" />
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="h-4 w-16 bg-slate-200 rounded" />
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="h-4 w-8 bg-slate-200 rounded mx-auto" />
                      </td>
                    </tr>
                  ))
                ) : isError ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <AlertCircle className="w-6 h-6 text-rose-500" />
                        <p className="text-xs font-semibold text-slate-700">
                          Failed to load attendees
                        </p>
                        <Button variant="ghost" size="sm" onClick={() => refetch()}>
                          Try Again
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : attendees.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                        <Users className="w-8 h-8 text-slate-300" />
                        <p className="text-xs font-semibold text-slate-600">
                          No attendees checked in yet
                        </p>
                        <p className="text-[11px]">
                          {search
                            ? 'No matches found for your search query.'
                            : 'Open the scanner to begin checking in members.'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  attendees.map((att, idx) => {
                    const rowNum = (page - 1) * limit + idx + 1;
                    const isMenuOpen = openActionMenuId === att.userId;

                    return (
                      <tr
                        key={att.userId || idx}
                        className="hover:bg-purple-50/30 transition-colors group relative"
                      >
                        <td className="py-3.5 px-4 text-center font-medium text-slate-400">
                          {rowNum}
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <Avatar name={att.name} id={att.userId} size="sm" />
                            <div className="flex flex-col">
                              <span className="font-semibold text-slate-900 group-hover:text-[#6332ec] transition-colors">
                                {att.name}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                @{att.handle || 'user'}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                          {att.email}
                        </td>

                        <td className="py-3.5 px-4 text-slate-700 font-mono text-xs">
                          {att.enrollmentNumber || '—'}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-[#6332ec] border border-purple-200/60">
                            {att.type || 'Member'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            {att.status || 'Present'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-slate-500 font-medium">
                          {formatTime(att.checkedInAt)}
                        </td>

                        <td className="py-3.5 px-4 text-center relative">
                          <div className="relative inline-block text-left">
                            <button
                              onClick={() =>
                                setOpenActionMenuId(isMenuOpen ? null : att.userId)
                              }
                              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {isMenuOpen && (
                              <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-30 animate-in fade-in">
                                <Link
                                  to={`/members/${att.userId}`}
                                  onClick={() => setOpenActionMenuId(null)}
                                  className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-purple-50 hover:text-[#6332ec] transition-colors"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>View Profile</span>
                                </Link>

                                <button
                                  onClick={() => {
                                    setOpenActionMenuId(null);
                                    setRemoveAttendeeTarget({
                                      userId: att.userId,
                                      name: att.name,
                                    });
                                  }}
                                  className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Remove from event</span>
                                </button>
                              </div>
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
              of <span className="font-semibold text-slate-800">{total}</span> attendees
            </p>

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        </div>

        {/* Scanner Modal */}
        {scannerOpen && (
          <ScannerModal
            isOpen={scannerOpen}
            eventId={eventId}
            eventName={event.name}
            onClose={() => setScannerOpen(false)}
          />
        )}

        {/* Edit Event Modal for Admin */}
        {editEventModalOpen && (
          <AddEditEventModal
            isOpen={editEventModalOpen}
            eventId={eventId}
            onClose={() => setEditEventModalOpen(false)}
            onSuccess={() => {
              refetch();
              queryClient.invalidateQueries(['events']);
            }}
          />
        )}

        {/* Remove Attendee Confirm Dialog */}
        <ConfirmDialog
          isOpen={Boolean(removeAttendeeTarget)}
          title="Remove Attendee?"
          message={`Are you sure you want to remove ${removeAttendeeTarget?.name} from this event? Their attendance record will be deleted.`}
          confirmText="Remove"
          confirmVariant="danger"
          loading={removeMutation.isLoading}
          onConfirm={() => removeMutation.mutate(removeAttendeeTarget?.userId)}
          onClose={() => setRemoveAttendeeTarget(null)}
        />
      </div>
    </AppShell>
  );
}
