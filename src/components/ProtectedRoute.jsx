import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <Loader2 className="h-10 w-10 text-emerald-600 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-500">Checking session credentials...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login but keep state of intended target page
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
