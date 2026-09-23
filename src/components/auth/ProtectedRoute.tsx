import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading, checkSession } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    // Only check if we haven't already determined auth state
    if (isLoading && !isAuthenticated) {
      checkSession();
    }
  }, [checkSession, isLoading, isAuthenticated]);

  if (isLoading) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-bg-base)', color: 'white' }}>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
