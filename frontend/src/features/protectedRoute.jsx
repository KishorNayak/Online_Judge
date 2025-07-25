// src/components/ProtectedRoute.jsx
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children }) => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

export const AdminRoute = ({ children }) => {
  const isadmin = useSelector((state) => state.auth.isadmin);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  return isLoggedIn && isadmin ? children : <Navigate to="/login" replace />;
};
