import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';

/**
 * ProtectedRoute component:
 * - Checks for valid authentication token & user state
 * - Redirects unauthenticated users to /login
 * - Optionally checks for allowed roles
 * - Handles loading state
 */
export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f4fa]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#6332ec] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500 font-medium">Verifying authorization...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect unauthenticated user to /login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role authorization if restricted to specific roles
  if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
    // Redirect to default home based on actual role
    if (user?.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user?.role === 'coordinator') {
      return <Navigate to="/coordinator/dashboard" replace />;
    } else {
      return <Navigate to="/member/home" replace />;
    }
  }

  return children;
};
