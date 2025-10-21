import React from 'react';
import { ASSETS } from '../assetPaths';
import { cn } from '../lib/utils';

interface AvatarSelectorProps {
  selectedAvatar: string;
  onSelectAvatar: (avatar: string) => void;
  gender: 'male' | 'female';
  className?: string;
}

export const AvatarSelector: React.FC<AvatarSelectorProps> = ({
  selectedAvatar,
  onSelectAvatar,
  gender,
  className = '',
}) => {
  const avatars = gender === 'male' ? ASSETS.AVATARS.MALE : ASSETS.AVATARS.FEMALE;

  return (
    <div className={cn('w-full', className)}>
      <label className="block text-sm font-medium text-white mb-3 poppins-medium">
        Choose Your Avatar
      </label>
      <div className="grid grid-cols-5 gap-2">
        {avatars.map((avatar, index) => (
          <div
            key={index}
            className={cn(
              'w-12 h-12 rounded-full border-3 cursor-pointer transition-all duration-200',
              selectedAvatar === avatar 
                ? 'border-purple-400 ring-3 ring-purple-400/30 scale-110' 
                : 'border-gray-400 hover:border-purple-300 hover:scale-105'
            )}
            onClick={() => onSelectAvatar(avatar)}
          >
            <img
              src={avatar}
              alt={`Avatar ${index + 1}`}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
