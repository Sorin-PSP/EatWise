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
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminFoodDatabase from './pages/admin/AdminFoodDatabase'
import AdminUsers from './pages/admin/AdminUsers'
import AdminPayments from './pages/admin/AdminPayments'
import { useEffect } from 'react'
import { useUser } from './contexts/UserContext'

function App() {
  const { user } = useUser()

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (!user || !user.isLoggedIn) {
      return <Navigate to="/login" replace />
    }
    return children
  }

  // Admin route component
  const AdminRoute = ({ children }) => {
    if (!user || !user.isLoggedIn || !user.isAdmin) {
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
        
        {/* Admin Routes */}
        <Route path="admin/dashboard" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />
        
        <Route path="admin/food-database" element={
          <AdminRoute>
            <AdminFoodDatabase />
          </AdminRoute>
        } />
        
        <Route path="admin/users" element={
          <AdminRoute>
            <AdminUsers />
          </AdminRoute>
        } />
        
        <Route path="admin/payments" element={
          <AdminRoute>
            <AdminPayments />
          </AdminRoute>
        } />
      </Route>
    </Routes>
  )
}

export default App
