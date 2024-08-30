import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const token = Cookies.get('authToken');
  if (!isAuthenticated && !token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;