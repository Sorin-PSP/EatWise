export default function Badge({ children, variant = 'primary', className = '' }) {
  // Define variant classes
  const variantClasses = {
    primary: 'bg-blue-100 text-blue-800',
    secondary: 'bg-purple-100 text-purple-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-cyan-100 text-cyan-800',
    accent: 'bg-indigo-100 text-indigo-800',
  };
  
  // Combine classes
  const badgeClasses = `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`;
  
  return (
    <span className={badgeClasses}>
      {children}
    </span>
  );
}
