import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import Cookies from 'js-cookie';// Update this line

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const token = Cookies.get('authToken');
  if (!isAuthenticated && !token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;