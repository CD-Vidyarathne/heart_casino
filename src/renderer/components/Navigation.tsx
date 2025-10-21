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
    <div className="fixed top-2 left-2 z-50 glass rounded-lg p-2 max-w-xs">
      <h3 className="text-white font-bold mb-2 text-sm luckiest-guy">Dev Nav</h3>
      <div className="grid grid-cols-2 gap-1">
        {routes.map((route) => (
          <Button
            key={route.path}
            variant="secondary"
            size="sm"
            onClick={() => navigate(route.path)}
            className="text-xs px-2 py-1"
          >
            {route.label}
          </Button>
        ))}
      </div>
    </div>
  );
};
