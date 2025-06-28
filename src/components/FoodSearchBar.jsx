import React, { useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';

function FoodSearchBar({ onSearch, className = '' }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  const clearSearch = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <FaSearch className="text-gray-500" />
        </div>
        
        <input
          type="search"
          className="input pl-10 pr-10"
          placeholder="Search foods..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        
        {query && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
            onClick={clearSearch}
          >
            <FaTimes />
          </button>
        )}
      </div>
    </form>
  );
}

export default FoodSearchBar;
