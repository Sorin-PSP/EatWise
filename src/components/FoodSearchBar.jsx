import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

export default function FoodSearchBar({ onSearch, className = '' }) {
  const [searchText, setSearchText] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchText);
  };
  
  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search for foods..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="h-5 w-5 text-gray-400" />
        </div>
        <button
          type="submit"
          className="absolute inset-y-0 right-0 px-4 text-white bg-green-600 rounded-r-lg hover:bg-green-700 focus:outline-none"
        >
          Search
        </button>
      </div>
    </form>
  );
}
