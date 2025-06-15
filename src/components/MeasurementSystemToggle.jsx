import React from 'react';
import { useUser } from '../contexts/UserContext';
import { FaBalanceScale } from 'react-icons/fa';

function MeasurementSystemToggle() {
  const { measurementSystem, toggleMeasurementSystem } = useUser();
  
  return (
    <div className="flex items-center">
      <button
        onClick={toggleMeasurementSystem}
        className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100"
        title={`Switch to ${measurementSystem === 'metric' ? 'US customary' : 'metric'} units`}
      >
        <FaBalanceScale className="text-primary" />
        <span className="text-sm font-medium">
          {measurementSystem === 'metric' ? 'Metric (g)' : 'US (oz/lb)'}
        </span>
      </button>
    </div>
  );
}

export default MeasurementSystemToggle;
