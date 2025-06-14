import React from 'react';

function Card({ title, children, className = '', icon: Icon, variant = 'default' }) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'border-l-4 border-primary';
      case 'secondary':
        return 'border-l-4 border-secondary';
      case 'accent':
        return 'border-l-4 border-accent';
      case 'success':
        return 'border-l-4 border-success';
      case 'warning':
        return 'border-l-4 border-warning';
      case 'error':
        return 'border-l-4 border-error';
      default:
        return '';
    }
  };

  return (
    <div className={`card ${getVariantClasses()} ${className}`}>
      {(title || Icon) && (
        <div className="flex items-center mb-4">
          {Icon && <Icon className={`mr-2 text-xl ${variant !== 'default' ? `text-${variant}` : 'text-primary'}`} />}
          {title && <h3 className={`font-medium ${variant !== 'default' ? `text-${variant}` : ''}`}>{title}</h3>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}

export default Card;
