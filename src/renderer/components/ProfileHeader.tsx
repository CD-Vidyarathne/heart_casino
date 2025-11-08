import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card } from './Card';
import { cn } from '../lib/utils';

export const ProfileHeader: React.FC = () => {
  const { profile, user } = useAuth();

  if (!profile && !user) {
    return null;
  }

  const displayName =
    profile?.display_name || user?.email?.split('@')[0] || 'Player';
  const avatar = profile?.avatar || '/male_avatars/1.png';
  const balance = profile?.balance ?? 0;

  return (
    <Card
      className={cn(
        'fixed top-4 right-4 w-1/2 p-4 z-50',
        'glass border-purple-400/30'
      )}
    >
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          <img
            src={avatar}
            alt={displayName}
            className="w-16 h-16 rounded-full border-2 border-purple-400 object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-white mb-1 luckiest-guy truncate">
            {displayName}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-300 poppins-medium">
              Balance:
            </span>
            <span className="text-lg font-bold text-green-400 poppins-bold">
              {balance.toLocaleString()} coins
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
