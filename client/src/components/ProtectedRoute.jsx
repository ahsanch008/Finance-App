import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import Cookies from 'js-cookie';// Update this line

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const token = Cookies.get('authToken');
  if (!isAuthenticated && !token) {
    // Instead of redirecting, we'll return to the homepage
    // The login modal can be opened from the header
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;