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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <TitleBar
          title="Heart Casino"
          subtitle="Welcome to the ultimate gaming experience"
          className="mb-12"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {menuOptions.map((option) => (
            <Card
              key={option.id}
              hover
              onClick={option.action}
              className="p-6 text-center group"
            >
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {option.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {option.title}
              </h3>
              <p className="text-gray-300 mb-4">{option.subtitle}</p>
              <Button
                variant={option.variant}
                size="lg"
                className="w-full"
                onClick={() => option.action()}
              >
                {option.title}
              </Button>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <img
            src={ASSETS.MAIN_LOGO_NO_BG}
            alt="Heart Casino Logo"
            className="h-16 mx-auto opacity-80"
          />
        </div>
      </div>
    </div>
  );
};

