import { useEffect, useRef } from 'react';
import { useFood } from '../contexts/FoodContext';

export default function NutritionChart() {
  const chartRef = useRef(null);
  const { getDailyNutritionHistory } = useFood();
  
  useEffect(() => {
    // This is a placeholder for chart implementation
    // In a real implementation, you would use a charting library like Chart.js
    
    const renderPlaceholderChart = () => {
      if (!chartRef.current) return;
      
      const canvas = chartRef.current;
      const ctx = canvas.getContext('2d');
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Set dimensions
      canvas.width = canvas.offsetWidth;
      canvas.height = 200;
      
      // Get nutrition history for the last 7 days
      const today = new Date();
      const nutritionHistory = [];
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        
        // Get nutrition data for this date
        const nutrition = getDailyNutritionHistory(dateString);
        nutritionHistory.push({
          date: dateString,
          calories: nutrition.calories || 0
        });
      }
      
      // Find max value for scaling
      const maxCalories = Math.max(...nutritionHistory.map(day => day.calories), 2000);
      
      // Draw chart
      const padding = 30;
      const chartWidth = canvas.width - padding * 2;
      const chartHeight = canvas.height - padding * 2;
      
      // Draw axes
      ctx.beginPath();
      ctx.moveTo(padding, padding);
      ctx.lineTo(padding, canvas.height - padding);
      ctx.lineTo(canvas.width - padding, canvas.height - padding);
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Draw horizontal grid lines
      const gridLines = 5;
      ctx.textAlign = 'right';
      ctx.font = '10px Arial';
      ctx.fillStyle = '#6b7280';
      
      for (let i = 0; i <= gridLines; i++) {
        const y = padding + (chartHeight / gridLines) * i;
        const value = Math.round(maxCalories - (maxCalories / gridLines) * i);
        
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(canvas.width - padding, y);
        ctx.strokeStyle = '#f3f4f6';
        ctx.stroke();
        
        ctx.fillText(value, padding - 5, y + 3);
      }
      
      // Draw bars
      const barWidth = chartWidth / nutritionHistory.length * 0.6;
      const barSpacing = chartWidth / nutritionHistory.length;
      
      nutritionHistory.forEach((day, index) => {
        const x = padding + barSpacing * index + barSpacing / 2 - barWidth / 2;
        const barHeight = (day.calories / maxCalories) * chartHeight;
        const y = canvas.height - padding - barHeight;
        
        // Draw bar
        ctx.fillStyle = '#10b981';
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Draw date label
        const date = new Date(day.date);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        ctx.textAlign = 'center';
        ctx.fillStyle = '#6b7280';
        ctx.fillText(dayName, x + barWidth / 2, canvas.height - padding + 15);
      });
    };
    
    renderPlaceholderChart();
    
    // Add resize listener
    const handleResize = () => {
      renderPlaceholderChart();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [getDailyNutritionHistory]);
  
  return (
    <div className="w-full">
      <canvas ref={chartRef} className="w-full"></canvas>
    </div>
  );
}
