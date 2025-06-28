import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import BottomNav from './BottomNav'

function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-6 pb-20 md:pb-6 mt-16">
        <div className="fade-in">
          <Outlet />
        </div>
      </main>
      <BottomNav />
    </div>
  )
}

export default Layout
