import React from 'react';

function Button({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  size = 'md', 
  className = '',
  icon: Icon,
  iconPosition = 'left',
  disabled = false,
  fullWidth = false,
  ...props 
}) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'btn-primary';
      case 'secondary':
        return 'btn-secondary';
      case 'outline':
        return 'btn-outline';
      case 'text':
        return 'bg-transparent hover:bg-gray-100 text-primary hover:text-primary-dark';
      case 'success':
        return 'bg-success hover:bg-success-dark text-white';
      case 'warning':
        return 'bg-warning hover:bg-warning-dark text-gray-900';
      case 'error':
        return 'bg-error hover:bg-error-dark text-white';
      default:
        return 'btn-primary';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'xs':
        return 'text-xs px-2 py-1';
      case 'sm':
        return 'text-sm px-3 py-1.5';
      case 'md':
        return 'text-base px-4 py-2.5';
      case 'lg':
        return 'text-lg px-5 py-3';
      case 'xl':
        return 'text-xl px-6 py-3.5';
      default:
        return 'text-base px-4 py-2.5';
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
        ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
        flex items-center justify-center
        ${className}
      `}
      {...props}
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
