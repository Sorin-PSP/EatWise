import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaBars, FaTimes, FaLeaf, FaSignInAlt, FaUserCircle, FaSignOutAlt } from 'react-icons/fa'
import { useUser } from '../contexts/UserContext'

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useUser()

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
              Acasă
            </Link>
            {user.isLoggedIn && (
              <>
                <Link to="/dashboard" className={`${isActive('/dashboard')} hover:text-secondary-light transition-colors duration-200`}>
                  Dashboard
                </Link>
                <Link to="/food-database" className={`${isActive('/food-database')} hover:text-secondary-light transition-colors duration-200`}>
                  Bază de Date Alimente
                </Link>
                <Link to="/meal-planner" className={`${isActive('/meal-planner')} hover:text-secondary-light transition-colors duration-200`}>
                  Planificator Mese
                </Link>
              </>
            )}
          </div>
          
          {/* User menu (desktop) */}
          <div className="hidden md:block relative">
            {user.isLoggedIn ? (
              <div className="relative">
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-white hover:text-secondary-light transition-colors duration-200 focus:outline-none"
                >
                  <FaUserCircle className="text-xl" />
                  <span>{user.name || 'Profil'}</span>
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Profilul meu
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      <div className="flex items-center space-x-2">
                        <FaSignOutAlt />
                        <span>Deconectare</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                to="/login" 
                className="flex items-center space-x-2 text-white hover:text-secondary-light transition-colors duration-200"
              >
                <FaSignInAlt className="text-xl" />
                <span>Conectare</span>
              </Link>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-white focus:outline-none focus:ring-2 focus:ring-secondary rounded-lg p-1"
              aria-label={isOpen ? "Închide meniul" : "Deschide meniul"}
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
              Acasă
            </Link>
            
            {user.isLoggedIn ? (
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
                  to="/food-database" 
                  className={`block py-2.5 px-3 rounded-lg ${
                    location.pathname === '/food-database' 
                      ? 'bg-primary-dark text-secondary-light' 
                      : 'text-white hover:bg-primary-dark/50'
                  }`}
                >
                  Bază de Date Alimente
                </Link>
                <Link 
                  to="/meal-planner" 
                  className={`block py-2.5 px-3 rounded-lg ${
                    location.pathname === '/meal-planner' 
                      ? 'bg-primary-dark text-secondary-light' 
                      : 'text-white hover:bg-primary-dark/50'
                  }`}
                >
                  Planificator Mese
                </Link>
                <Link 
                  to="/profile" 
                  className={`block py-2.5 px-3 rounded-lg ${
                    location.pathname === '/profile' 
                      ? 'bg-primary-dark text-secondary-light' 
                      : 'text-white hover:bg-primary-dark/50'
                  }`}
                >
                  Profilul meu
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center w-full text-left py-2.5 px-3 rounded-lg text-white hover:bg-primary-dark/50"
                >
                  <FaSignOutAlt className="mr-2" />
                  Deconectare
                </button>
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
                Conectare
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
