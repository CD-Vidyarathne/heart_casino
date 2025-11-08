import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/UserContext';

interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="screen-container">
        <div className="screen-content flex items-center justify-center">
          <div className="text-white text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/main-menu" replace />;
  }

  return <>{children}</>;
};
