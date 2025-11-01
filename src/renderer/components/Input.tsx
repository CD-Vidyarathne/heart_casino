import React from 'react';
import { cn } from '../lib/utils';

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  required?: boolean;
}

export const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  label,
  error,
  disabled = false,
  className = '',
  required = false,
}) => {
  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="block text-sm font-medium text-white mb-2 poppins-medium">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        required={required}
        className={cn(
          'w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 poppins',
          'bg-white/10 backdrop-blur-sm text-white placeholder-gray-300',
          'border-purple-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20',
          error && 'border-red-400 ring-2 ring-red-400/20',
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-purple-300'
        )}
      />
      {error && <p className="mt-1 text-sm text-red-400 poppins">{error}</p>}
    </div>
  );
};
