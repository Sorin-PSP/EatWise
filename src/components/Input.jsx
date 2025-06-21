export default function Input({ 
  label, 
  id, 
  type = 'text', 
  className = '', 
  error, 
  ...props 
}) {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      
      <input
        id={id}
        type={type}
        className={`w-full px-3 py-2 border ${
          error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
        } rounded-md shadow-sm focus:outline-none`}
        {...props}
      />
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
