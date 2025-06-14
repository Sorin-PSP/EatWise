import { useEffect, useRef } from 'react'
import { Chart, registerables } from 'chart.js'
import { useFood } from '../contexts/FoodContext'
import { useUser } from '../contexts/UserContext'
import { format, subDays, parseISO } from 'date-fns'

// Register Chart.js components
Chart.register(...registerables)

function NutritionChart() {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)
  const { getDailyNutrition } = useFood()
  const { user } = useUser()
  
  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }
    
    const ctx = chartRef.current.getContext('2d')
    
    // Get data for the last 7 days
    const today = new Date()
    const dates = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(today, 6 - i)
      return format(date, 'yyyy-MM-dd')
    })
    
    const calorieData = dates.map(date => getDailyNutrition(date).calories)
    
    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: dates.map(date => format(parseISO(date), 'dd/MM')),
        datasets: [
          {
            label: 'Calorii consumate',
            data: calorieData,
            backgroundColor: 'rgba(76, 175, 80, 0.6)',
            borderColor: 'rgba(76, 175, 80, 1)',
            borderWidth: 1
          },
          {
            label: 'Obiectiv calorii',
            data: dates.map(() => user.dailyCalorieGoal),
            type: 'line',
            borderColor: 'rgba(255, 193, 7, 1)',
            borderWidth: 2,
            borderDash: [5, 5],
            fill: false,
            pointRadius: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Calorii (kcal)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Data'
            }
          }
        }
      }
    })
    
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [getDailyNutrition, user.dailyCalorieGoal])
  
  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Istoric Calorii (Ultimele 7 zile)</h2>
      <div className="h-64">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  )
}

export default NutritionChart
