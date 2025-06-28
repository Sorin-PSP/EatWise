import React, { useState, useEffect } from 'react';
import { useFood } from '../contexts/FoodContext';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function NutritionChart() {
  const { dailyLog } = useFood();
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });
  
  useEffect(() => {
    // Get the last 7 days
    const today = new Date();
    const dates = [];
    const caloriesData = [];
    const proteinData = [];
    const carbsData = [];
    const fatData = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      // Format date for display (e.g., "Mon 15")
      const displayDate = new Intl.DateTimeFormat('en-US', { 
        weekday: 'short', 
        day: 'numeric' 
      }).format(date);
      
      dates.push(displayDate);
      
      // Get nutrition data for this date
      let calories = 0;
      let protein = 0;
      let carbs = 0;
      let fat = 0;
      
      if (dailyLog[dateString]) {
        const meals = ['breakfast', 'lunch', 'dinner', 'snacks'];
        
        meals.forEach(meal => {
          if (dailyLog[dateString][meal]) {
            dailyLog[dateString][meal].forEach(item => {
              calories += item.calories || 0;
              protein += item.protein || 0;
              carbs += item.carbs || 0;
              fat += item.fat || 0;
            });
          }
        });
      }
      
      caloriesData.push(calories);
      proteinData.push(protein);
      carbsData.push(carbs);
      fatData.push(fat);
    }
    
    setChartData({
      labels: dates,
      datasets: [
        {
          label: 'Calories',
          data: caloriesData,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          yAxisID: 'y',
        },
        {
          label: 'Protein (g)',
          data: proteinData,
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
          yAxisID: 'y1',
        },
        {
          label: 'Carbs (g)',
          data: carbsData,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          yAxisID: 'y1',
        },
        {
          label: 'Fat (g)',
          data: fatData,
          borderColor: 'rgb(255, 159, 64)',
          backgroundColor: 'rgba(255, 159, 64, 0.5)',
          yAxisID: 'y1',
        }
      ]
    });
  }, [dailyLog]);
  
  const options = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    stacked: false,
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Calories'
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: 'Grams'
        }
      },
    },
  };
  
  return (
    <div>
      <Line options={options} data={chartData} />
    </div>
  );
}

export default NutritionChart;
