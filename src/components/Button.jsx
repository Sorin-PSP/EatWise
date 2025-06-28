import React from 'react';

function Button({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  fullWidth = false,
  icon: Icon = null,
  iconPosition = 'left'
}) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary hover:bg-primary-dark text-white';
      case 'secondary':
        return 'bg-secondary hover:bg-secondary-dark text-white';
      case 'accent':
        return 'bg-accent hover:bg-accent-dark text-white';
      case 'success':
        return 'bg-success hover:bg-success-dark text-white';
      case 'warning':
        return 'bg-warning hover:bg-warning-dark text-white';
      case 'error':
        return 'bg-error hover:bg-error-dark text-white';
      case 'outline':
        return 'bg-transparent border border-primary text-primary hover:bg-primary/5';
      case 'ghost':
        return 'bg-transparent hover:bg-gray-100 text-gray-700';
      default:
        return 'bg-primary hover:bg-primary-dark text-white';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'xs':
        return 'text-xs px-2 py-1';
      case 'sm':
        return 'text-sm px-3 py-1.5';
      case 'md':
        return 'text-base px-4 py-2';
      case 'lg':
        return 'text-lg px-5 py-2.5';
      case 'xl':
        return 'text-xl px-6 py-3';
      default:
        return 'text-base px-4 py-2';
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${fullWidth ? 'w-full' : ''}
        rounded-md font-medium transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center
        ${className}
      `}
    >
      {Icon && iconPosition === 'left' && (
        <Icon className={`${children ? 'mr-2' : ''}`} />
      )}
      {children}
      {Icon && iconPosition === 'right' && (
        <Icon className={`${children ? 'ml-2' : ''}`} />
      )}
    </button>
  );
}

export default Button;
