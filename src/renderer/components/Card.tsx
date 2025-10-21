import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  onClick,
}) => {
  const baseClasses = 'bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg';
  const hoverClasses = hover ? 'hover:bg-white/20 hover:scale-105 transition-all duration-300 cursor-pointer' : '';
  const clickClasses = onClick ? 'cursor-pointer' : '';
  
  return (
    <div
      className={`${baseClasses} ${hoverClasses} ${clickClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
