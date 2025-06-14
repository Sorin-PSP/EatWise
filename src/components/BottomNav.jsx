import { Link, useLocation } from 'react-router-dom'
import { FaHome, FaChartBar, FaUtensils, FaCalendarAlt, FaUser } from 'react-icons/fa'

function BottomNav() {
  const location = useLocation()
  
  const isActive = (path) => {
    return location.pathname === path
  }
  
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-40">
      <div className="flex justify-around">
        <Link to="/" className="flex flex-col items-center py-3 px-2 relative">
          {isActive('/') && (
            <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary rounded-full"></span>
          )}
          <FaHome className={`text-xl ${isActive('/') ? 'text-primary' : 'text-gray-500'}`} />
          <span className={`text-xs mt-1 ${isActive('/') ? 'text-primary font-medium' : 'text-gray-500'}`}>Acasă</span>
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
          <span className={`text-xs mt-1 ${isActive('/food-database') ? 'text-primary font-medium' : 'text-gray-500'}`}>Alimente</span>
        </Link>
        
        <Link to="/meal-planner" className="flex flex-col items-center py-3 px-2 relative">
          {isActive('/meal-planner') && (
            <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary rounded-full"></span>
          )}
          <FaCalendarAlt className={`text-xl ${isActive('/meal-planner') ? 'text-primary' : 'text-gray-500'}`} />
          <span className={`text-xs mt-1 ${isActive('/meal-planner') ? 'text-primary font-medium' : 'text-gray-500'}`}>Planificare</span>
        </Link>
        
        <Link to="/profile" className="flex flex-col items-center py-3 px-2 relative">
          {isActive('/profile') && (
            <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary rounded-full"></span>
          )}
          <FaUser className={`text-xl ${isActive('/profile') ? 'text-primary' : 'text-gray-500'}`} />
          <span className={`text-xs mt-1 ${isActive('/profile') ? 'text-primary font-medium' : 'text-gray-500'}`}>Profil</span>
        </Link>
      </div>
    </div>
  )
}

export default BottomNav
