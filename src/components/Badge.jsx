import React from 'react';

function Badge({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '' 
}) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary/10 text-primary';
      case 'secondary':
        return 'bg-secondary/10 text-secondary';
      case 'accent':
        return 'bg-accent/10 text-accent';
      case 'success':
        return 'bg-success/10 text-success';
      case 'warning':
        return 'bg-warning/10 text-warning';
      case 'error':
        return 'bg-error/10 text-error';
      case 'info':
        return 'bg-info/10 text-info';
      case 'gray':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-primary/10 text-primary';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'xs':
        return 'text-xs px-1.5 py-0.5';
      case 'sm':
        return 'text-xs px-2 py-0.5';
      case 'md':
        return 'text-sm px-2.5 py-1';
      case 'lg':
        return 'text-sm px-3 py-1.5';
      default:
        return 'text-sm px-2.5 py-1';
    }
  };

  return (
    <span className={`inline-flex items-center font-medium rounded-full ${getVariantClasses()} ${getSizeClasses()} ${className}`}>
      {children}
    </span>
  );
}

export default Badge;
