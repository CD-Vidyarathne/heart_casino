import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, TitleBar } from '../components';
import { ASSETS } from '../assetPaths';

export const MainMenuScreen: React.FC = () => {
  const navigate = useNavigate();

  const menuOptions = [
    {
      id: 'casino',
      title: 'Enter Casino',
      subtitle: 'Start playing games',
      icon: '🎰',
      action: () => navigate('/game-selection'),
      variant: 'primary' as const,
    },
    {
      id: 'history',
      title: 'Game History',
      subtitle: 'View your past games',
      icon: '📊',
      action: () => navigate('/games-history'),
      variant: 'secondary' as const,
    },
    {
      id: 'profile',
      title: 'My Profile',
      subtitle: 'Manage your account',
      icon: '👤',
      action: () => navigate('/profile-edit'),
      variant: 'secondary' as const,
    },
    {
      id: 'quit',
      title: 'Quit',
      subtitle: 'Exit the application',
      icon: '🚪',
      action: () => window.close(),
      variant: 'danger' as const,
    },
  ];

  return (
    <div className="screen-container">
      <div className="screen-content">
        <div className="text-center mb-12">
          <img
            src={ASSETS.MAIN_LOGO_NO_BG}
            alt="Heart Casino Logo"
            className="h-72 mx-auto mb-8"
          />
          <TitleBar title="Welcome to the ultimate gaming experience" />
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            {menuOptions.map((option) => (
              <Button
                key={option.id}
                variant={option.variant}
                size="lg"
                className="w-full text-2xl"
                onClick={() => option.action()}
              >
                {option.title}
              </Button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
