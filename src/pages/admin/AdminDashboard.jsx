import React, { useState, useEffect } from 'react';
import { FaUsers, FaUtensils, FaCreditCard, FaChartLine, FaExclamationTriangle, FaUserPlus, FaEdit, FaCheckCircle } from 'react-icons/fa';
import Card from '../../components/Card';
import { useUser } from '../../contexts/UserContext';
import { useFood } from '../../contexts/FoodContext';
import { Navigate } from 'react-router-dom';

function AdminDashboard() {
  const { user } = useUser();
  const { foods, dailyLog } = useFood();
  const [period, setPeriod] = useState('week');
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalFoods: 0,
    pendingApprovals: 0,
    revenue: {
      week: 0,
      month: 0,
      year: 0
    },
    userGrowth: {
      week: 0,
      month: 0,
      year: 0
    }
  });
  
  // Redirect if not admin
  if (!user.isLoggedIn || !user.isAdmin) {
    return <Navigate to="/login" />;
  }
  
  // Calculate real stats from data
  useEffect(() => {
    // Get all users from localStorage
    const getAllUsers = () => {
      try {
        // In a real app, this would come from a database
        // For demo purposes, we'll simulate by checking localStorage for any user data
        const allUsers = [];
        
        // Check for the current user
        const currentUser = localStorage.getItem('eatwise-user');
        if (currentUser) {
          try {
            const parsedUser = JSON.parse(currentUser);
            allUsers.push(parsedUser);
          } catch (e) {
            console.error('Error parsing current user:', e);
          }
        }
        
        // In a real app, we would have a users table
        // For demo, we'll add some simulated users based on daily logs
        if (dailyLog) {
          // Each unique date in the log could represent a unique user session
          const uniqueDates = Object.keys(dailyLog);
          // Add 1 unique user for every 2 unique dates (to simulate multiple sessions per user)
          const estimatedUniqueUsers = Math.max(1, Math.floor(uniqueDates.length / 2));
          
          // Add these to our count, but don't double count the current user
          for (let i = 0; i < estimatedUniqueUsers; i++) {
            allUsers.push({
              id: `simulated-${i}`,
              name: `User ${i}`,
              email: `user${i}@example.com`,
              isActive: Math.random() > 0.3 // 70% chance of being active
            });
          }
        }
        
        return allUsers;
      } catch (error) {
        console.error('Error getting all users:', error);
        return [];
      }
    };
    
    // Calculate revenue based on premium subscriptions (simulated)
    const calculateRevenue = () => {
      // In a real app, this would come from payment records
      // For demo, we'll simulate based on number of users and food entries
      
      const users = getAllUsers();
      const foodCount = foods ? foods.length : 0;
      
      // Base revenue calculation
      // Assume 20% of users are premium at $4.99/month
      const monthlySubscriptionRevenue = users.length * 0.2 * 4.99;
      
      // Add some revenue based on food database size (simulating value from content)
      const contentRevenue = foodCount * 0.05; // $0.05 per food item
      
      // Calculate for different periods
      return {
        week: parseFloat(((monthlySubscriptionRevenue / 4) + (contentRevenue / 4)).toFixed(2)),
        month: parseFloat((monthlySubscriptionRevenue + contentRevenue).toFixed(2)),
        year: parseFloat(((monthlySubscriptionRevenue * 12) + (contentRevenue * 12)).toFixed(2))
      };
    };
    
    // Get real stats
    const users = getAllUsers();
    const activeUsers = users.filter(u => u.isActive !== false).length;
    
    // Count foods with and without approval
    const approvedFoods = foods ? foods.filter(food => food.approved !== false).length : 0;
    const pendingFoods = foods ? foods.filter(food => food.approved === false).length : 0;
    
    // Calculate user growth (simulated)
    const userGrowth = {
      week: Math.max(1, Math.floor(users.length * 0.05)), // 5% weekly growth
      month: Math.max(3, Math.floor(users.length * 0.15)), // 15% monthly growth
      year: Math.max(10, Math.floor(users.length * 0.7)) // 70% yearly growth
    };
    
    // Update stats with real data
    setStats({
      totalUsers: users.length,
      activeUsers: activeUsers,
      totalFoods: foods ? foods.length : 0,
      pendingApprovals: pendingFoods,
      revenue: calculateRevenue(),
      userGrowth: userGrowth
    });
  }, [foods, dailyLog]);
  
  // Recent activities - we'll keep this as mock data for now
  // In a real app, this would come from an activity log
  const recentActivities = [
    { id: 1, type: 'user', action: 'New user registered', name: 'Maria Popescu', time: '2 hours ago' },
    { id: 2, type: 'food', action: 'New food item added', name: 'Organic Quinoa Bowl', time: '3 hours ago' },
    { id: 3, type: 'payment', action: 'Premium subscription', name: 'Ion Ionescu', time: '5 hours ago' },
    { id: 4, type: 'food', action: 'Food item updated', name: 'Greek Yogurt', time: '6 hours ago' },
    { id: 5, type: 'user', action: 'Profile updated', name: 'Alexandru Munteanu', time: 'Yesterday' }
  ];
  
  // Alerts mock data
  const alerts = [
    { id: 1, type: 'warning', message: `Food database needs review - ${stats.pendingApprovals} items pending approval`, time: '1 hour ago' },
    { id: 2, type: 'info', message: 'System update scheduled for tomorrow at 02:00 AM', time: '3 hours ago' },
    { id: 3, type: 'error', message: 'Payment gateway error detected - check integration', time: '1 day ago' }
  ];
  
  const getActivityIcon = (type) => {
    switch(type) {
      case 'user':
        return <FaUserPlus className="text-primary" />;
      case 'food':
        return <FaUtensils className="text-secondary" />;
      case 'payment':
        return <FaCreditCard className="text-accent" />;
      default:
        return <FaEdit className="text-gray-500" />;
    }
  };
  
  const getAlertIcon = (type) => {
    switch(type) {
      case 'warning':
        return <FaExclamationTriangle className="text-warning" />;
      case 'error':
        return <FaExclamationTriangle className="text-error" />;
      case 'info':
        return <FaCheckCircle className="text-info" />;
      default:
        return <FaCheckCircle className="text-gray-500" />;
    }
  };
  
  const getAlertClass = (type) => {
    switch(type) {
      case 'warning':
        return 'border-l-4 border-warning bg-warning/10';
      case 'error':
        return 'border-l-4 border-error bg-error/10';
      case 'info':
        return 'border-l-4 border-info bg-info/10';
      default:
        return 'border-l-4 border-gray-300 bg-gray-50';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <div className="flex space-x-2">
          <button 
            onClick={() => setPeriod('week')} 
            className={`px-3 py-1 text-sm rounded-md ${period === 'week' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Week
          </button>
          <button 
            onClick={() => setPeriod('month')} 
            className={`px-3 py-1 text-sm rounded-md ${period === 'month' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Month
          </button>
          <button 
            onClick={() => setPeriod('year')} 
            className={`px-3 py-1 text-sm rounded-md ${period === 'year' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Year
          </button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white shadow-sm rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Users</p>
              <h3 className="text-2xl font-bold text-gray-800">{stats.totalUsers}</h3>
              <p className="text-xs text-green-600 mt-1">
                <span className="font-medium">+{stats.userGrowth[period]}</span> new this {period}
              </p>
            </div>
            <div className="bg-primary/10 p-3 rounded-full">
              <FaUsers className="text-xl text-primary" />
            </div>
          </div>
        </Card>
        
        <Card className="bg-white shadow-sm rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Active Users</p>
              <h3 className="text-2xl font-bold text-gray-800">{stats.activeUsers}</h3>
              <p className="text-xs text-gray-500 mt-1">
                <span className="font-medium">{stats.totalUsers > 0 ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0}%</span> of total
              </p>
            </div>
            <div className="bg-secondary/10 p-3 rounded-full">
              <FaUserPlus className="text-xl text-secondary" />
            </div>
          </div>
        </Card>
        
        <Card className="bg-white shadow-sm rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Food Database</p>
              <h3 className="text-2xl font-bold text-gray-800">{stats.totalFoods}</h3>
              <p className="text-xs text-warning mt-1">
                <span className="font-medium">{stats.pendingApprovals}</span> pending approval
              </p>
            </div>
            <div className="bg-accent/10 p-3 rounded-full">
              <FaUtensils className="text-xl text-accent" />
            </div>
          </div>
        </Card>
        
        <Card className="bg-white shadow-sm rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Revenue</p>
              <h3 className="text-2xl font-bold text-gray-800">${stats.revenue[period].toLocaleString()}</h3>
              <p className="text-xs text-green-600 mt-1">
                <span className="font-medium">+12%</span> from last {period}
              </p>
            </div>
            <div className="bg-success/10 p-3 rounded-full">
              <FaCreditCard className="text-xl text-success" />
            </div>
          </div>
        </Card>
      </div>
      
      {/* Alerts Section */}
      <div className="bg-white shadow-sm rounded-lg p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">System Alerts</h2>
        <div className="space-y-3">
          {alerts.map(alert => (
            <div key={alert.id} className={`p-3 rounded-md ${getAlertClass(alert.type)}`}>
              <div className="flex items-start">
                <div className="mr-3 mt-0.5">
                  {getAlertIcon(alert.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white shadow-sm rounded-lg p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivities.map(activity => (
            <div key={activity.id} className="flex items-start border-b border-gray-100 pb-3 last:border-0 last:pb-0">
              <div className="bg-gray-100 p-2 rounded-full mr-3">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                <p className="text-sm text-gray-600">{activity.name}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <button className="text-primary text-sm font-medium hover:underline">
            View All Activity
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
