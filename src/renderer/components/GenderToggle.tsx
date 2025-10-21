import React from 'react';
import { cn } from '../lib/utils';

interface GenderToggleProps {
  selectedGender: 'male' | 'female';
  onGenderChange: (gender: 'male' | 'female') => void;
  className?: string;
}

export const GenderToggle: React.FC<GenderToggleProps> = ({
  selectedGender,
  onGenderChange,
  className = '',
}) => {
  return (
    <div className={cn('w-full', className)}>
      <label className="block text-sm font-medium text-white mb-3 poppins-medium">
        Gender
      </label>
      <div className="flex bg-white/10 rounded-lg p-1">
        <button
          type="button"
          onClick={() => onGenderChange('male')}
          className={cn(
            'flex-1 py-2 px-3 rounded-md font-medium transition-all duration-200 poppins-medium',
            selectedGender === 'male'
              ? 'bg-purple-600 text-white shadow-lg'
              : 'text-gray-300 hover:text-white hover:bg-white/10'
          )}
        >
          ♂ Male
        </button>
        <button
          type="button"
          onClick={() => onGenderChange('female')}
          className={cn(
            'flex-1 py-2 px-3 rounded-md font-medium transition-all duration-200 poppins-medium',
            selectedGender === 'female'
              ? 'bg-purple-600 text-white shadow-lg'
              : 'text-gray-300 hover:text-white hover:bg-white/10'
          )}
        >
          ♀ Female
        </button>
      </div>
    </div>
  );
};
