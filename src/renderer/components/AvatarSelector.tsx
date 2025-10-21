import React from 'react';
import { ASSETS } from '../assetPaths';

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
    <div className={`w-full ${className}`}>
      <label className="block text-sm font-medium text-white mb-4">
        Choose Your Avatar
      </label>
      <div className="grid grid-cols-5 gap-3">
        {avatars.map((avatar, index) => (
          <div
            key={index}
            className={`
              w-16 h-16 rounded-full border-4 cursor-pointer transition-all duration-200
              ${selectedAvatar === avatar 
                ? 'border-red-400 ring-4 ring-red-400/30 scale-110' 
                : 'border-gray-400 hover:border-red-300 hover:scale-105'
              }
            `}
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
