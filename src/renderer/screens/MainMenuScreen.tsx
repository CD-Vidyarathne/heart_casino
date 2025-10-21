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
        <div className="text-center mb-6">
          <img
            src={ASSETS.MAIN_LOGO_NO_BG}
            alt="Heart Casino Logo"
            className="h-12 mx-auto mb-4"
          />
          <TitleBar
            title="Heart Casino"
            subtitle="Welcome to the ultimate gaming experience"
          />
        </div>

        <div className="space-y-4">
          {menuOptions.map((option) => (
            <Card
              key={option.id}
              hover
              onClick={option.action}
              className="p-4 text-center group"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                {option.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2 luckiest-guy">
                {option.title}
              </h3>
              <p className="text-gray-300 mb-3 text-sm poppins">
                {option.subtitle}
              </p>
              <Button
                variant={option.variant}
                size="md"
                className="w-full"
                onClick={() => option.action()}
              >
                {option.title}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
