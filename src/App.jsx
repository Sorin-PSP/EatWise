import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import DashboardPage from './pages/DashboardPage'
import FoodDatabasePage from './pages/FoodDatabasePage'
import MealPlannerPage from './pages/MealPlannerPage'
import ProfilePage from './pages/ProfilePage'
import FoodDetailPage from './pages/FoodDetailPage'
import AddFoodPage from './pages/AddFoodPage'
import LoginPage from './pages/LoginPage'
import { useEffect } from 'react'
import { useUser } from './contexts/UserContext'

function App() {
  const { user, setUser } = useUser()

  // Check for saved user data on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('eatwise-user')
    if (savedUser) {
      setUser(prev => ({ ...prev, ...JSON.parse(savedUser) }))
    }
  }, [setUser])

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (!user.isLoggedIn) {
      return <Navigate to="/login" replace />
    }
    return children
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        
        <Route path="dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        
        <Route path="food-database" element={
          <ProtectedRoute>
            <FoodDatabasePage />
          </ProtectedRoute>
        } />
        
        <Route path="food/:id" element={
          <ProtectedRoute>
            <FoodDetailPage />
          </ProtectedRoute>
        } />
        
        <Route path="add-food" element={
          <ProtectedRoute>
            <AddFoodPage />
          </ProtectedRoute>
        } />
        
        <Route path="meal-planner" element={
          <ProtectedRoute>
            <MealPlannerPage />
          </ProtectedRoute>
        } />
        
        <Route path="profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
      </Route>
    </Routes>
  )
}

export default App
