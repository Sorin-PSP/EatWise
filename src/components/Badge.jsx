import React from 'react';

function Badge({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '',
  rounded = false,
  ...props 
}) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary-light/20 text-primary-dark';
      case 'secondary':
        return 'bg-secondary-light/20 text-secondary-dark';
      case 'accent':
        return 'bg-accent-light/20 text-accent-dark';
      case 'success':
        return 'bg-success-light/20 text-success-dark';
      case 'warning':
        return 'bg-warning-light/20 text-warning-dark';
      case 'error':
        return 'bg-error-light/20 text-error-dark';
      case 'gray':
        return 'bg-gray-200 text-gray-800';
      default:
        return 'bg-primary-light/20 text-primary-dark';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-xs px-2 py-0.5';
      case 'md':
        return 'text-sm px-2.5 py-0.5';
      case 'lg':
        return 'text-base px-3 py-1';
      default:
        return 'text-sm px-2.5 py-0.5';
    }
  };

  return (
    <span
      className={`
        inline-flex items-center font-medium
        ${getVariantClasses()} 
        ${getSizeClasses()} 
        ${rounded ? 'rounded-full' : 'rounded'}
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  );
}

export default Badge;
