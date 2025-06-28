import { Link, useLocation } from 'react-router-dom'
import { FaHome, FaChartBar, FaUtensils, FaCalendarAlt, FaUser, FaShieldAlt } from 'react-icons/fa'
import { useUser } from '../contexts/UserContext'

function BottomNav() {
  const location = useLocation()
  const { user } = useUser()
  
  const isActive = (path) => {
    return location.pathname === path
  }
  
  // Don't show bottom nav for non-logged in users
  if (!user.isLoggedIn) return null
  
  // Show admin bottom nav for admin users
  if (user.isAdmin) {
    return (
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-40">
        <div className="flex justify-around">
          <Link to="/admin/dashboard" className="flex flex-col items-center py-3 px-2 relative">
            {isActive('/admin/dashboard') && (
              <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary rounded-full"></span>
            )}
            <FaChartBar className={`text-xl ${isActive('/admin/dashboard') ? 'text-primary' : 'text-gray-500'}`} />
            <span className={`text-xs mt-1 ${isActive('/admin/dashboard') ? 'text-primary font-medium' : 'text-gray-500'}`}>Dashboard</span>
          </Link>
          
          <Link to="/admin/food-database" className="flex flex-col items-center py-3 px-2 relative">
            {isActive('/admin/food-database') && (
              <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary rounded-full"></span>
            )}
            <FaUtensils className={`text-xl ${isActive('/admin/food-database') ? 'text-primary' : 'text-gray-500'}`} />
            <span className={`text-xs mt-1 ${isActive('/admin/food-database') ? 'text-primary font-medium' : 'text-gray-500'}`}>Foods</span>
          </Link>
          
          <Link to="/admin/users" className="flex flex-col items-center py-3 px-2 relative">
            {isActive('/admin/users') && (
              <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary rounded-full"></span>
            )}
            <FaUser className={`text-xl ${isActive('/admin/users') ? 'text-primary' : 'text-gray-500'}`} />
            <span className={`text-xs mt-1 ${isActive('/admin/users') ? 'text-primary font-medium' : 'text-gray-500'}`}>Users</span>
          </Link>
          
          <Link to="/admin/payments" className="flex flex-col items-center py-3 px-2 relative">
            {isActive('/admin/payments') && (
              <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary rounded-full"></span>
            )}
            <FaCalendarAlt className={`text-xl ${isActive('/admin/payments') ? 'text-primary' : 'text-gray-500'}`} />
            <span className={`text-xs mt-1 ${isActive('/admin/payments') ? 'text-primary font-medium' : 'text-gray-500'}`}>Payments</span>
          </Link>
          
          <Link to="/profile" className="flex flex-col items-center py-3 px-2 relative">
            {isActive('/profile') && (
              <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary rounded-full"></span>
            )}
            <FaShieldAlt className={`text-xl ${isActive('/profile') ? 'text-primary' : 'text-gray-500'}`} />
            <span className={`text-xs mt-1 ${isActive('/profile') ? 'text-primary font-medium' : 'text-gray-500'}`}>Admin</span>
          </Link>
        </div>
      </div>
    )
  }
  
  // Regular user bottom nav
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-40">
      <div className="flex justify-around">
        <Link to="/" className="flex flex-col items-center py-3 px-2 relative">
          {isActive('/') && (
            <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary rounded-full"></span>
          )}
          <FaHome className={`text-xl ${isActive('/') ? 'text-primary' : 'text-gray-500'}`} />
          <span className={`text-xs mt-1 ${isActive('/') ? 'text-primary font-medium' : 'text-gray-500'}`}>Home</span>
        </Link>
        
        <Link to="/dashboard" className="flex flex-col items-center py-3 px-2 relative">
          {isActive('/dashboard') && (
            <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary rounded-full"></span>
          )}
          <FaChartBar className={`text-xl ${isActive('/dashboard') ? 'text-primary' : 'text-gray-500'}`} />
          <span className={`text-xs mt-1 ${isActive('/dashboard') ? 'text-primary font-medium' : 'text-gray-500'}`}>Dashboard</span>
        </Link>
        
        <Link to="/food-database" className="flex flex-col items-center py-3 px-2 relative">
          {isActive('/food-database') && (
            <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary rounded-full"></span>
          )}
          <FaUtensils className={`text-xl ${isActive('/food-database') ? 'text-primary' : 'text-gray-500'}`} />
          <span className={`text-xs mt-1 ${isActive('/food-database') ? 'text-primary font-medium' : 'text-gray-500'}`}>Foods</span>
        </Link>
        
        <Link to="/meal-planner" className="flex flex-col items-center py-3 px-2 relative">
          {isActive('/meal-planner') && (
            <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary rounded-full"></span>
          )}
          <FaCalendarAlt className={`text-xl ${isActive('/meal-planner') ? 'text-primary' : 'text-gray-500'}`} />
          <span className={`text-xs mt-1 ${isActive('/meal-planner') ? 'text-primary font-medium' : 'text-gray-500'}`}>Planner</span>
        </Link>
        
        <Link to="/profile" className="flex flex-col items-center py-3 px-2 relative">
          {isActive('/profile') && (
            <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary rounded-full"></span>
          )}
          <FaUser className={`text-xl ${isActive('/profile') ? 'text-primary' : 'text-gray-500'}`} />
          <span className={`text-xs mt-1 ${isActive('/profile') ? 'text-primary font-medium' : 'text-gray-500'}`}>Profile</span>
        </Link>
      </div>
    </div>
  )
}

export default BottomNav
