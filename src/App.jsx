import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { FoodProvider } from './contexts/FoodContext';
import { AuthProvider } from './contexts/AuthContext';
import DailyLogSync from './components/DailyLogSync';

// Import your pages
import Dashboard from './pages/Dashboard';
import FoodDatabase from './pages/FoodDatabase';
import AddFood from './pages/AddFood';
import FoodDetails from './pages/FoodDetails';
import EditFood from './pages/EditFood';
import DailyLog from './pages/DailyLog';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

function App() {
  // Set up the title
  useEffect(() => {
    document.title = 'EatWise - Nutrition Tracker';
  }, []);

  return (
    <Router>
      <AuthProvider>
        <FoodProvider>
          <DailyLogSync />
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected routes */}
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/foods" element={<ProtectedRoute><FoodDatabase /></ProtectedRoute>} />
            <Route path="/foods/add" element={<ProtectedRoute><AddFood /></ProtectedRoute>} />
            <Route path="/foods/:id" element={<ProtectedRoute><FoodDetails /></ProtectedRoute>} />
            <Route path="/foods/:id/edit" element={<ProtectedRoute><EditFood /></ProtectedRoute>} />
            <Route path="/log" element={<ProtectedRoute><DailyLog /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            
            {/* Admin routes */}
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </FoodProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
