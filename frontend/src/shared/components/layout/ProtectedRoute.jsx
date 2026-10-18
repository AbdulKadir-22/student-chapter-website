import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../../features/auth/hooks/useAuth';

export default function ProtectedRoute({ children, roles, allow }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  const isAllowed = React.useMemo(() => {
    if (!user) return false;
    if (allow && typeof allow === 'function') {
      return allow(user);
    }
    if (roles && roles.length > 0) {
      return roles.includes(user.role);
    }
    return true;
  }, [user, allow, roles]);

  useEffect(() => {
    if (!loading && user && !isAllowed) {
      toast.error('You do not have permission to access that page');
    }
  }, [loading, user, isAllowed]);

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#f8f7fd]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[#6332ec] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-500">Loading session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAllowed) {
    return <Navigate to="/profile" replace />;
  }

  return children;
}
