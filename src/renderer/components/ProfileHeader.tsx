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
        'fixed top-4 right-4 w-1/2 p-2 z-50',
        'glass border-purple-400/30'
      )}
    >
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-white mb-0.5 luckiest-guy truncate">
            {displayName}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-300 poppins-medium">
              Balance:
            </span>
            <span className="text-sm font-bold text-green-400 poppins-bold">
              {balance.toLocaleString()} coins
            </span>
          </div>
        </div>
        <div className="flex-shrink-0">
          <img
            src={avatar}
            alt={displayName}
            className="w-10 h-10 rounded-full border-2 border-purple-400 object-cover"
          />
        </div>
      </div>
    </Card>
  );
};
