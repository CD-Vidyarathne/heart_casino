import React from 'react';

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
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-white mb-2">
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
        className={`
          w-full px-4 py-3 rounded-lg border-2 transition-all duration-200
          bg-white/10 backdrop-blur-sm text-white placeholder-gray-300
          border-gray-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/20
          ${error ? 'border-red-400 ring-2 ring-red-400/20' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-300'}
        `}
      />
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
};
