import React from 'react';
import { AuthLayout } from '../components/AuthLayout';
import { LoginForm } from '../components/LoginForm';
import { AuthBranding } from '../components/AuthBranding';

import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

export const LoginPage = () => {
  const { user, loading } = useAuth();

  if (!loading && user) {
    return <Navigate to="/profile" replace />;
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Left column: Login Form Card */}
        <div className="flex justify-center lg:justify-end">
          <LoginForm />
        </div>

        {/* Right column: ACM Branding & Orbit Graphic */}
        <div className="flex justify-center lg:justify-start">
          <AuthBranding />
        </div>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
