import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon } from '@heroicons/react/24/outline';

export default function DatePicker({ selectedDate, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Parse the selected date
  const date = new Date(selectedDate);
  
  // Format date for display
  const formattedDate = date.toLocaleDateString('ro-RO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Get today's date
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Check if selected date is today
  const isToday = date.getTime() === today.getTime();
  
  // Navigate to previous day
  const goToPreviousDay = () => {
    const previousDay = new Date(date);
    previousDay.setDate(previousDay.getDate() - 1);
    onChange(previousDay.toISOString().split('T')[0]);
  };
  
  // Navigate to next day
  const goToNextDay = () => {
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    
    // Don't allow selecting future dates
    if (nextDay <= today) {
      onChange(nextDay.toISOString().split('T')[0]);
    }
  };
  
  // Go to today
  const goToToday = () => {
    onChange(today.toISOString().split('T')[0]);
  };
  
  // Handle date selection from calendar
  const handleDateSelect = (e) => {
    const newDate = e.target.value;
    onChange(newDate);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div className="flex items-center space-x-2">
        <button
          onClick={goToPreviousDay}
          className="p-2 rounded-full hover:bg-gray-100"
          aria-label="Ziua anterioară"
        >
          <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
        </button>
        
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
          <span className="capitalize">{formattedDate}</span>
        </button>
        
        <button
          onClick={goToNextDay}
          className={`p-2 rounded-full ${isToday ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-100 text-gray-600'}`}
          disabled={isToday}
          aria-label="Ziua următoare"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
        
        {!isToday && (
          <button
            onClick={goToToday}
            className="px-3 py-1 text-sm text-green-600 hover:text-green-800 hover:underline"
          >
            Astăzi
          </button>
        )}
      </div>
      
      {isOpen && (
        <div className="absolute z-10 mt-1 right-0 bg-white shadow-lg rounded-md p-2 border border-gray-200">
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateSelect}
            max={today.toISOString().split('T')[0]}
            className="p-2 border border-gray-300 rounded-md"
          />
        </div>
      )}
    </div>
  );
}
