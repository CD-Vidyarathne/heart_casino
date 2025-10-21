import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './Button';

export const Navigation: React.FC = () => {
  const navigate = useNavigate();

  const routes = [
    { path: '/login', label: 'Login' },
    { path: '/register', label: 'Register' },
    { path: '/register-profile', label: 'Profile Setup' },
    { path: '/main-menu', label: 'Main Menu' },
    { path: '/game-selection', label: 'Game Selection' },
    { path: '/games-history', label: 'Game History' },
    { path: '/profile-edit', label: 'Profile Edit' },
  ];

  return (
    <div className="fixed top-4 left-4 z-50 bg-black/50 backdrop-blur-sm rounded-lg p-4">
      <h3 className="text-white font-bold mb-3">Dev Navigation</h3>
      <div className="flex flex-wrap gap-2">
        {routes.map((route) => (
          <Button
            key={route.path}
            variant="secondary"
            size="sm"
            onClick={() => navigate(route.path)}
            className="text-xs"
          >
            {route.label}
          </Button>
        ))}
      </div>
    </div>
  );
};
