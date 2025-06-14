import React from 'react';
import { FaWeight, FaChartLine } from 'react-icons/fa';
import Card from './Card';
import Button from './Button';

function WeightTracker({ 
  currentWeight = 70, 
  startWeight = 75,
  goalWeight = 65,
  weightUnit = 'kg',
  onUpdateWeight,
  className = '' 
}) {
  // Calculate progress
  const totalToLose = startWeight - goalWeight;
  const lost = startWeight - currentWeight;
  const percentage = Math.min(Math.max((lost / totalToLose) * 100, 0), 100);

  return (
    <Card className={`${className}`}>
      <div className="flex items-center mb-4">
        <FaWeight className="text-primary text-xl mr-2" />
        <h3 className="font-medium">Progres Greutate</h3>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mb-6">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600">Inițial</div>
          <div className="font-medium">{startWeight} {weightUnit}</div>
        </div>
        
        <div className="text-center p-3 bg-primary-light/20 rounded-lg border border-primary-light">
          <div className="text-sm text-gray-600">Actual</div>
          <div className="font-medium text-primary-dark">{currentWeight} {weightUnit}</div>
        </div>
        
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600">Obiectiv</div>
          <div className="font-medium">{goalWeight} {weightUnit}</div>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-1">
          <span>Progres</span>
          <span>{Math.round(percentage)}%</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-primary h-2.5 rounded-full"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        
        <div className="text-sm text-gray-600 mt-2">
          {lost > 0 ? (
            <span>Ai pierdut <span className="text-success font-medium">{lost.toFixed(1)} {weightUnit}</span> până acum!</span>
          ) : lost < 0 ? (
            <span>Ai câștigat <span className="text-warning font-medium">{Math.abs(lost).toFixed(1)} {weightUnit}</span> față de greutatea inițială.</span>
          ) : (
            <span>Nu ai înregistrat încă nicio schimbare de greutate.</span>
          )}
        </div>
      </div>
      
      <div className="flex space-x-4">
        <Button 
          variant="outline" 
          icon={FaWeight} 
          onClick={onUpdateWeight}
          className="flex-1"
        >
          Actualizează
        </Button>
        
        <Button 
          variant="primary" 
          icon={FaChartLine} 
          className="flex-1"
        >
          Istoric
        </Button>
      </div>
    </Card>
  );
}

export default WeightTracker;
