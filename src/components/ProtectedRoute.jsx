
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const { currentUser, isAuthenticated, loading } = useAuth();
  
  // If still loading, show nothing
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // If no specific roles required or user has required role, show the page
  return children;
};

export default ProtectedRoute;
