import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Eye,
  Edit2,
  Trash2,
  Plus,
  AlertCircle,
  Users,
} from 'lucide-react';
import Avatar from '../../../shared/components/ui/Avatar';
import Badge from '../../../shared/components/ui/Badge';
import SearchInput from '../../../shared/components/ui/SearchInput';
import Button from '../../../shared/components/ui/Button';
import Pagination from '../../../shared/components/ui/Pagination';
import ConfirmDialog from '../../../shared/components/ui/ConfirmDialog';
import AddEditMemberModal from './AddEditMemberModal';
import {
  getAdminMembersApi,
  deleteAdminMemberApi,
} from '../api/admin.api';
import { useAuth } from '../../auth/hooks/useAuth';

export default function MembersTable({ title = 'All Members', subtitle = 'Manage and view all registered members of ACM Amtics.' }) {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editMemberId, setEditMemberId] = useState(null);
  const [deleteMember, setDeleteMember] = useState(null);

  const limit = 8;

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin', 'members', { page, search, statusFilter, limit }],
    queryFn: () =>
      getAdminMembersApi({
        page,
        limit,
        q: search || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      }),
    keepPreviousData: true,
  });

  const members = data?.data || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  const deactivateMutation = useMutation({
    mutationFn: (id) => deleteAdminMemberApi(id),
    onSuccess: () => {
      toast.success('Member deactivated successfully');
      queryClient.invalidateQueries(['admin', 'members']);
      queryClient.invalidateQueries(['admin', 'dashboard']);
      setDeleteMember(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to deactivate member');
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

  const getRoleBadgeVariant = (role, roleLabel) => {
    if (role === 'admin' || roleLabel?.toLowerCase().includes('chair') || roleLabel?.toLowerCase().includes('president')) {
      return 'purple';
    }
    if (roleLabel?.toLowerCase().includes('head') || roleLabel?.toLowerCase().includes('lead')) {
      return 'blue';
    }
    if (role === 'coordinator') {
      return 'warning';
    }
    return 'neutral';
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            {title}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <SearchInput
            placeholder="Search members..."
            value={search}
            onChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
            className="w-full sm:w-64"
          />

          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={() => setAddModalOpen(true)}
            className="shrink-0"
          >
            Add Member
          </Button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto min-h-[360px]">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-[#fcfbfe] text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100 sticky top-0 z-10">
            <tr>
              <th className="py-3 px-4 w-12 text-center">#</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Join Date</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              // Skeletons
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={`skel-${i}`} className="animate-pulse">
                  <td className="py-3.5 px-4 text-center">
                    <div className="h-4 w-4 bg-slate-200 rounded mx-auto" />
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200" />
                      <div className="h-4 w-28 bg-slate-200 rounded" />
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="h-4 w-36 bg-slate-200 rounded" />
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="h-5 w-20 bg-slate-200 rounded-full" />
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="h-4 w-20 bg-slate-200 rounded" />
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="h-5 w-14 bg-slate-200 rounded-full" />
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="h-4 w-16 bg-slate-200 rounded mx-auto" />
                  </td>
                </tr>
              ))
            ) : isError ? (
              <tr>
                <td colSpan={7} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <AlertCircle className="w-6 h-6 text-rose-500" />
                    <p className="text-xs font-semibold text-slate-700">
                      Failed to load members
                    </p>
                    <Button variant="ghost" size="sm" onClick={() => refetch()}>
                      Try Again
                    </Button>
                  </div>
                </td>
              </tr>
            ) : members.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                    <Users className="w-8 h-8 text-slate-300" />
                    <p className="text-xs font-semibold text-slate-600">
                      No members found
                    </p>
                    <p className="text-[11px]">
                      {search ? 'Try clearing your search query.' : 'Get started by adding a member.'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              members.map((m, idx) => {
                const rowNum = (page - 1) * limit + idx + 1;
                const isSelf = currentUser?._id === m.id || currentUser?.id === m.id;
                const isAdminTarget = m.role === 'admin' || m.showDashboard === true;

                return (
                  <tr
                    key={m.id}
                    className="hover:bg-purple-50/30 transition-colors group"
                  >
                    <td className="py-3.5 px-4 text-center font-medium text-slate-400">
                      {rowNum}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={m.name} id={m.id} size="sm" />
                        <span className="font-semibold text-slate-900 group-hover:text-[#6332ec] transition-colors">
                          {m.name}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                      {m.email}
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge
                        variant={getRoleBadgeVariant(m.role, m.roleLabel)}
                        size="sm"
                        className="font-medium"
                      >
                        {m.roleLabel || (m.role === 'coordinator' ? 'Coordinator' : 'Member')}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500">
                      {formatDate(m.joinedAt)}
                    </td>

                    <td className="py-3.5 px-4">
                      {m.isActive ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200/60">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          Inactive
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1 text-slate-400">
                        <Link
                          to={`/members/${m.id}`}
                          title="View Profile"
                          className="p-1.5 hover:text-[#6332ec] hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setEditMemberId(m.id)}
                          title="Edit Member"
                          className="p-1.5 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteMember(m)}
                          disabled={!m.isActive || isSelf || isAdminTarget}
                          title={
                            isSelf
                              ? 'Cannot deactivate yourself'
                              : isAdminTarget
                              ? 'Admin-like users cannot be deactivated via UI'
                              : !m.isActive
                              ? 'Member is already inactive'
                              : 'Deactivate Member'
                          }
                          className="p-1.5 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer with Showing info & Pagination */}
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
          of <span className="font-semibold text-slate-800">{total}</span> members
        </p>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(p) => setPage(p)}
        />
      </div>

      {/* Add / Edit Member Modal */}
      {(addModalOpen || editMemberId) && (
        <AddEditMemberModal
          isOpen={addModalOpen || Boolean(editMemberId)}
          memberId={editMemberId}
          onClose={() => {
            setAddModalOpen(false);
            setEditMemberId(null);
          }}
          onSuccess={() => {
            refetch();
            queryClient.invalidateQueries(['admin', 'dashboard']);
          }}
        />
      )}

      {/* Deactivate Confirm Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteMember)}
        title="Deactivate this member?"
        message={`Are you sure you want to deactivate ${deleteMember?.name}? They won't be able to log in or attend events until reactivated.`}
        confirmText="Deactivate"
        confirmVariant="danger"
        loading={deactivateMutation.isLoading}
        onConfirm={() => deactivateMutation.mutate(deleteMember?.id)}
        onClose={() => setDeleteMember(null)}
      />
    </div>
  );
}
