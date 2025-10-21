import React from 'react';
import { cn } from '../lib/utils';

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
    <div className={cn('text-center mb-6', className)}>
      <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg luckiest-guy">
        {title}
      </h1>
      {subtitle && (
        <p className="text-base text-gray-200 drop-shadow-md poppins">
          {subtitle}
        </p>
      )}
    </div>
  );
};
