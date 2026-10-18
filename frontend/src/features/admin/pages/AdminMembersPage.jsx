import React from 'react';
import AppShell from '../../../shared/components/layout/AppShell';
import MembersTable from '../components/MembersTable';

export default function AdminMembersPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <MembersTable
          title="Members Management"
          subtitle="View, add, edit, or deactivate members of ACM Amtics."
        />
      </div>
    </AppShell>
  );
}
