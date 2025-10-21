import React from 'react';

interface TitleBarProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export const TitleBar: React.FC<TitleBarProps> = ({
  title,
  subtitle,
  className = '',
}) => {
  return (
    <div className={`text-center mb-8 ${className}`}>
      <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
        {title}
      </h1>
      {subtitle && (
        <p className="text-lg text-gray-200 drop-shadow-md">
          {subtitle}
        </p>
      )}
    </div>
  );
};
