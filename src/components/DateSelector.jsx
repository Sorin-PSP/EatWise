import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function DateSelector({ currentDate, setCurrentDate }) {
  // Format the date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  // Navigate to previous day
  const goToPreviousDay = () => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() - 1);
    setCurrentDate(date.toISOString().split('T')[0]);
  };

  // Navigate to next day
  const goToNextDay = () => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + 1);
    setCurrentDate(date.toISOString().split('T')[0]);
  };

  // Go to today
  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today.toISOString().split('T')[0]);
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={goToPreviousDay}
        className="p-1 rounded-full hover:bg-gray-200"
        aria-label="Previous day"
      >
        <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
      </button>
      
      <div className="text-sm md:text-base font-medium">
        {formatDate(currentDate)}
      </div>
      
      <button
        onClick={goToNextDay}
        className="p-1 rounded-full hover:bg-gray-200"
        aria-label="Next day"
      >
        <ChevronRightIcon className="h-5 w-5 text-gray-600" />
      </button>
      
      <button
        onClick={goToToday}
        className="ml-2 px-3 py-1 text-xs bg-green-100 text-green-800 rounded-md hover:bg-green-200"
      >
        Today
      </button>
    </div>
  );
}
