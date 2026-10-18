import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import RootLayout from './shared/components/layout/RootLayout';
import ProtectedRoute from './shared/components/layout/ProtectedRoute';
import HomePage from './features/home/pages/HomePage';
import EventsPage from './features/events/pages/EventsPage';
import EventDetailPage from './features/events/pages/EventDetailPage';
import ProjectsPage from './features/projects/pages/ProjectsPage';
import ProjectDetailPage from './features/projects/pages/ProjectDetailPage';
import GalleryPage from './features/gallery/pages/GalleryPage';
import HeadsPage from './features/team/pages/HeadsPage';
import ContributorsPage from './features/team/pages/ContributorsPage';
import LoginPage from './features/auth/pages/LoginPage';
import MyProfilePage from './features/users/pages/MyProfilePage';
import MemberDirectoryPage from './features/users/pages/MemberDirectoryPage';
import MemberProfilePage from './features/users/pages/MemberProfilePage';

// Admin & Events Panel Pages
import AdminDashboardPage from './features/admin/pages/AdminDashboardPage';
import AdminMembersPage from './features/admin/pages/AdminMembersPage';
import EventsAttendancePage from './features/events/pages/EventsAttendancePage';
import EventAttendeesPage from './features/events/pages/EventAttendeesPage';

// Permission helper predicates
const isAdminLikeUser = (user) =>
  Boolean(user?.permissions?.isAdminLike ?? (user?.role === 'admin' || user?.showDashboard === true));

const isPanelEventUser = (user) =>
  Boolean(
    user?.permissions?.isAdminLike ||
      user?.role === 'admin' ||
      user?.showDashboard === true ||
      user?.permissions?.isCoordinator ||
      user?.role === 'coordinator'
  );

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <MyProfilePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/members',
    element: (
      <ProtectedRoute>
        <MemberDirectoryPage />
      </ProtectedRoute>
    ),
  },
  // Panel Routes:
  // /panel/dashboard -> Admin-like only
  {
    path: '/panel/dashboard',
    element: (
      <ProtectedRoute allow={isAdminLikeUser}>
        <AdminDashboardPage />
      </ProtectedRoute>
    ),
  },
  // /panel/members -> Admin-like only
  {
    path: '/panel/members',
    element: (
      <ProtectedRoute allow={isAdminLikeUser}>
        <AdminMembersPage />
      </ProtectedRoute>
    ),
  },
  // /panel/events -> Admin-like or Coordinator
  {
    path: '/panel/events',
    element: (
      <ProtectedRoute allow={isPanelEventUser}>
        <EventsAttendancePage />
      </ProtectedRoute>
    ),
  },
  // /panel/events/:id -> Admin-like or Coordinator
  {
    path: '/panel/events/:id',
    element: (
      <ProtectedRoute allow={isPanelEventUser}>
        <EventAttendeesPage />
      </ProtectedRoute>
    ),
  },
  // Legacy /admin redirect
  {
    path: '/admin',
    element: <Navigate to="/panel/dashboard" replace />,
  },
  {
    path: '/admin/dashboard',
    element: <Navigate to="/panel/dashboard" replace />,
  },
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'events',
        element: <EventsPage />,
      },
      {
        path: 'events/:id',
        element: <EventDetailPage />,
      },
      {
        path: 'projects',
        element: <ProjectsPage />,
      },
      {
        path: 'projects/:id',
        element: <ProjectDetailPage />,
      },
      {
        path: 'gallery',
        element: <GalleryPage />,
      },
      {
        path: 'heads',
        element: <HeadsPage />,
      },
      {
        path: 'contributors',
        element: <ContributorsPage />,
      },
      {
        path: 'members/:id',
        element: <MemberProfilePage />,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
