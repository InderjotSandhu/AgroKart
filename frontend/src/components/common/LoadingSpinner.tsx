// ============================================================================
// AgroKart - Loading Spinner Component
// ============================================================================

import React from 'react';
import { BaseComponentProps } from '../../types';

interface LoadingSpinnerProps extends BaseComponentProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white' | 'gray';
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  text,
  className = '',
}) => {
  // Size classes
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  // Color classes
  const colorClasses = {
    primary: 'text-primary-600',
    secondary: 'text-secondary-600',
    white: 'text-white',
    gray: 'text-neutral-600',
  };

  // Text size classes based on spinner size
  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className={`
          animate-spin rounded-full border-2 border-solid border-current border-r-transparent
          ${sizeClasses[size]} 
          ${colorClasses[color]}
        `}
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
      
      {text && (
        <p 
          className={`
            mt-2 font-medium text-center
            ${textSizeClasses[size]}
            ${colorClasses[color]}
          `}
        >
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;

// ============================================================================
// Additional Loading Components
// ============================================================================

// Inline loading spinner for buttons
export const InlineSpinner: React.FC<{ size?: 'sm' | 'md' }> = ({ size = 'sm' }) => (
  <div 
    className={`
      animate-spin rounded-full border-2 border-solid border-current border-r-transparent
      ${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'}
    `}
    role="status"
    aria-label="Loading"
  >
    <span className="sr-only">Loading...</span>
  </div>
);

// Full page loading overlay
export const PageLoader: React.FC<{ text?: string }> = ({ text = 'Loading...' }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
    <LoadingSpinner size="xl" text={text} />
  </div>
);

// Loading skeleton for content
export const LoadingSkeleton: React.FC<{ className?: string; lines?: number }> = ({ 
  className = '', 
  lines = 3 
}) => (
  <div className={`animate-pulse ${className}`}>
    {Array.from({ length: lines }, (_, index) => (
      <div
        key={index}
        className={`
          bg-neutral-200 rounded
          ${index === lines - 1 ? 'w-3/4' : 'w-full'}
          ${lines === 1 ? 'h-4' : 'h-4 mb-3'}
        `}
      />
    ))}
  </div>
);
