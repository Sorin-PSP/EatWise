import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  FaBars, 
  FaTimes, 
  FaLeaf, 
  FaSignInAlt, 
  FaUserCircle, 
  FaSignOutAlt, 
  FaDatabase, 
  FaUsers, 
  FaCreditCard,
  FaShieldAlt
} from 'react-icons/fa'
import { useUser } from '../contexts/UserContext'

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showAdminMenu, setShowAdminMenu] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const userContext = useUser()
  
  // Make sure userContext exists before destructuring
  const user = userContext?.user || { isLoggedIn: false, isAdmin: false, name: '' }
  const logout = userContext?.logout || (() => {})

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false)
    setShowUserMenu(false)
    setShowAdminMenu(false)
  }, [location])

  const isActive = (path) => {
    return location.pathname === path ? 'text-secondary-light font-medium' : 'text-white'
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-primary/95 backdrop-blur-sm shadow-md' : 'bg-primary'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <FaLeaf className="text-secondary text-2xl group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-xl font-heading font-bold text-white">
              Eat<span className="text-secondary">Wise</span>
            </span>
          </Link>
          
          {/* Desktop menu */}
          <div className="hidden md:flex space-x-6">
            <Link to="/" className={`${isActive('/')} hover:text-secondary-light transition-colors duration-200`}>
              Home
            </Link>
            {user.isLoggedIn && !user.isAdmin && (
              <>
                <Link to="/dashboard" className={`${isActive('/dashboard')} hover:text-secondary-light transition-colors duration-200`}>
                  Dashboard
                </Link>
                <Link to="/meal-planner" className={`${isActive('/meal-planner')} hover:text-secondary-light transition-colors duration-200`}>
                  Meal Planner
                </Link>
              </>
            )}
            
            {/* Admin menu items */}
            {user.isLoggedIn && user.isAdmin && (
              <>
                <Link to="/admin/dashboard" className={`${isActive('/admin/dashboard')} hover:text-secondary-light transition-colors duration-200`}>
                  Dashboard
                </Link>
                <Link to="/admin/food-database" className={`${isActive('/admin/food-database')} hover:text-secondary-light transition-colors duration-200`}>
                  Food Database
                </Link>
                <Link to="/admin/users" className={`${isActive('/admin/users')} hover:text-secondary-light transition-colors duration-200`}>
                  Users
                </Link>
                <Link to="/admin/payments" className={`${isActive('/admin/payments')} hover:text-secondary-light transition-colors duration-200`}>
                  Payments
                </Link>
              </>
            )}
          </div>
          
          {/* User menu (desktop) */}
          <div className="hidden md:block relative">
            {user.isLoggedIn ? (
              <div className="relative">
                <button 
                  onClick={() => {
                    setShowUserMenu(!showUserMenu)
                    setShowAdminMenu(false)
                  }}
                  className="flex items-center space-x-2 text-white hover:text-secondary-light transition-colors duration-200 focus:outline-none"
                >
                  <FaUserCircle className="text-xl" />
                  <span>{user.name || 'Profile'}</span>
                  {user.isAdmin && (
                    <span className="ml-2 bg-secondary text-white text-xs px-2 py-0.5 rounded-full">
                      Admin
                    </span>
                  )}
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                    {user.isAdmin && (
                      <button
                        onClick={() => {
                          setShowAdminMenu(!showAdminMenu)
                          setShowUserMenu(false)
                        }}
                        className="flex items-center w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                      >
                        <FaShieldAlt className="mr-2 text-primary" />
                        <span>Admin Panel</span>
                      </button>
                    )}
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      My Profile
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      <div className="flex items-center space-x-2">
                        <FaSignOutAlt />
                        <span>Logout</span>
                      </div>
                    </button>
                  </div>
                )}
                
                {showAdminMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                    <Link 
                      to="/admin/dashboard" 
                      className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      <FaDatabase className="mr-2 text-primary" />
                      <span>Admin Dashboard</span>
                    </Link>
                    <Link 
                      to="/admin/food-database" 
                      className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      <FaDatabase className="mr-2 text-primary" />
                      <span>Food Database</span>
                    </Link>
                    <Link 
                      to="/admin/users" 
                      className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      <FaUsers className="mr-2 text-primary" />
                      <span>Manage Users</span>
                    </Link>
                    <Link 
                      to="/admin/payments" 
                      className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      <FaCreditCard className="mr-2 text-primary" />
                      <span>Payment Settings</span>
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                to="/login" 
                className="flex items-center space-x-2 text-white hover:text-secondary-light transition-colors duration-200"
              >
                <FaSignInAlt className="text-xl" />
                <span>Login</span>
              </Link>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-white focus:outline-none focus:ring-2 focus:ring-secondary rounded-lg p-1"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-2 slide-up">
            <Link 
              to="/" 
              className={`block py-2.5 px-3 rounded-lg ${
                location.pathname === '/' 
                  ? 'bg-primary-dark text-secondary-light' 
                  : 'text-white hover:bg-primary-dark/50'
              }`}
            >
              Home
            </Link>
            
            {user.isLoggedIn && !user.isAdmin ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`block py-2.5 px-3 rounded-lg ${
                    location.pathname === '/dashboard' 
                      ? 'bg-primary-dark text-secondary-light' 
                      : 'text-white hover:bg-primary-dark/50'
                  }`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/meal-planner" 
                  className={`block py-2.5 px-3 rounded-lg ${
                    location.pathname === '/meal-planner' 
                      ? 'bg-primary-dark text-secondary-light' 
                      : 'text-white hover:bg-primary-dark/50'
                  }`}
                >
                  Meal Planner
                </Link>
                <Link 
                  to="/profile" 
                  className={`block py-2.5 px-3 rounded-lg ${
                    location.pathname === '/profile' 
                      ? 'bg-primary-dark text-secondary-light' 
                      : 'text-white hover:bg-primary-dark/50'
                  }`}
                >
                  My Profile
                </Link>
              </>
            ) : user.isLoggedIn && user.isAdmin ? (
              <>
                {/* Admin mobile menu */}
                <div className="pt-2 pb-3 border-t border-primary-dark/30">
                  <div className="flex items-center px-3 py-1">
                    <FaShieldAlt className="text-secondary mr-2" />
                    <span className="text-secondary-light font-medium">Admin Menu</span>
                  </div>
                </div>
                <Link 
                  to="/admin/dashboard" 
                  className={`flex items-center py-2.5 px-3 rounded-lg ${
                    location.pathname === '/admin/dashboard' 
                      ? 'bg-primary-dark text-secondary-light' 
                      : 'text-white hover:bg-primary-dark/50'
                  }`}
                >
                  <FaDatabase className="mr-2" />
                  Admin Dashboard
                </Link>
                <Link 
                  to="/admin/food-database" 
                  className={`flex items-center py-2.5 px-3 rounded-lg ${
                    location.pathname === '/admin/food-database' 
                      ? 'bg-primary-dark text-secondary-light' 
                      : 'text-white hover:bg-primary-dark/50'
                  }`}
                >
                  <FaDatabase className="mr-2" />
                  Food Database
                </Link>
                <Link 
                  to="/admin/users" 
                  className={`flex items-center py-2.5 px-3 rounded-lg ${
                    location.pathname === '/admin/users' 
                      ? 'bg-primary-dark text-secondary-light' 
                      : 'text-white hover:bg-primary-dark/50'
                  }`}
                >
                  <FaUsers className="mr-2" />
                  Manage Users
                </Link>
                <Link 
                  to="/admin/payments" 
                  className={`flex items-center py-2.5 px-3 rounded-lg ${
                    location.pathname === '/admin/payments' 
                      ? 'bg-primary-dark text-secondary-light' 
                      : 'text-white hover:bg-primary-dark/50'
                  }`}
                >
                  <FaCreditCard className="mr-2" />
                  Payment Settings
                </Link>
                <Link 
                  to="/profile" 
                  className={`flex items-center py-2.5 px-3 rounded-lg ${
                    location.pathname === '/profile' 
                      ? 'bg-primary-dark text-secondary-light' 
                      : 'text-white hover:bg-primary-dark/50'
                  }`}
                >
                  <FaUserCircle className="mr-2" />
                  My Profile
                </Link>
              </>
            ) : (
              <Link 
                to="/login" 
                className={`flex items-center py-2.5 px-3 rounded-lg ${
                  location.pathname === '/login' 
                    ? 'bg-primary-dark text-secondary-light' 
                    : 'text-white hover:bg-primary-dark/50'
                }`}
              >
                <FaSignInAlt className="mr-2" />
                Login
              </Link>
            )}
            
            {user.isLoggedIn && (
              <button 
                onClick={handleLogout}
                className="flex items-center w-full text-left py-2.5 px-3 rounded-lg text-white hover:bg-primary-dark/50"
              >
                <FaSignOutAlt className="mr-2" />
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
