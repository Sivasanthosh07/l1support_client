import React from 'react'
import { useAuth } from "./Hooks/useAuth";
import {
  Navigate,
  useLocation,
} from 'react-router-dom';

const ProtectedRoute = ({children}) => {
  const { access_token } = useAuth();
  const location = useLocation();

  if (!access_token) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
}

export default ProtectedRoute