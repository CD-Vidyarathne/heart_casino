import React from 'react';
import { cn } from '../lib/utils';

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
  const baseClasses = 'glass rounded-xl border border-purple-400/30 shadow-lg';
  const hoverClasses = hover ? 'glass-hover hover:scale-105 transition-all duration-300 cursor-pointer' : '';
  const clickClasses = onClick ? 'cursor-pointer' : '';
  
  return (
    <div
      className={cn(
        baseClasses,
        hoverClasses,
        clickClasses,
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
