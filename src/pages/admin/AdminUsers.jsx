import React, { useState } from 'react';
import { FaSearch, FaUserPlus, FaEdit, FaTrash, FaEnvelope, FaLock, FaFilter, FaUserCog, FaTimes, FaCheck } from 'react-icons/fa';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import { useUser } from '../../contexts/UserContext';
import { Navigate } from 'react-router-dom';

function AdminUsers() {
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'user',
    status: 'active',
    plan: 'free',
    password: ''
  });
  
  // Redirect if not admin
  if (!user.isLoggedIn || !user.isAdmin) {
    return <Navigate to="/login" />;
  }
  
  // Mock user data
  const [users, setUsers] = useState([
    { 
      id: 1, 
      name: 'Maria Popescu', 
      email: 'maria@example.com', 
      role: 'user', 
      status: 'active', 
      plan: 'free',
      registeredDate: '2023-01-15',
      lastLogin: '2023-06-20'
    },
    { 
      id: 2, 
      name: 'Ion Ionescu', 
      email: 'ion@example.com', 
      role: 'user', 
      status: 'active', 
      plan: 'premium',
      registeredDate: '2023-02-10',
      lastLogin: '2023-06-19'
    },
    { 
      id: 3, 
      name: 'Alexandru Munteanu', 
      email: 'alex@example.com', 
      role: 'user', 
      status: 'inactive', 
      plan: 'free',
      registeredDate: '2023-03-05',
      lastLogin: '2023-05-30'
    },
    { 
      id: 4, 
      name: 'Elena Popovici', 
      email: 'elena@example.com', 
      role: 'user', 
      status: 'active', 
      plan: 'premium',
      registeredDate: '2023-04-20',
      lastLogin: '2023-06-21'
    },
    { 
      id: 5, 
      name: 'Admin User', 
      email: 'yatooinformation@gmail.com', 
      role: 'admin', 
      status: 'active', 
      plan: 'admin',
      registeredDate: '2023-01-01',
      lastLogin: '2023-06-21'
    },
  ]);
  
  // Filter users based on search term, role and status
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRoleFilter = filterRole === 'all' || user.role === filterRole;
    const matchesStatusFilter = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesRoleFilter && matchesStatusFilter;
  });
  
  const handleAddUser = () => {
    // In a real app, this would add the user to the database
    const id = users.length + 1;
    const today = new Date().toISOString().split('T')[0];
    
    const userToAdd = {
      ...newUser,
      id,
      registeredDate: today,
      lastLogin: today
    };
    
    setUsers([...users, userToAdd]);
    setNewUser({
      name: '',
      email: '',
      role: 'user',
      status: 'active',
      plan: 'free',
      password: ''
    });
    setShowAddModal(false);
  };
  
  const handleUpdateUser = () => {
    // In a real app, this would update the user in the database
    if (!currentUser) return;
    
    const updatedUsers = users.map(u => 
      u.id === currentUser.id ? currentUser : u
    );
    
    setUsers(updatedUsers);
    setCurrentUser(null);
    setShowEditModal(false);
  };
  
  const handleEdit = (user) => {
    setCurrentUser({...user});
    setShowEditModal(true);
  };
  
  const handleDelete = (id) => {
    // In a real app, this would update the database
    if (id === 5) return; // Prevent deleting the admin user
    
    const updatedUsers = users.filter(user => user.id !== id);
    setUsers(updatedUsers);
  };
  
  const handleResetPassword = (id) => {
    // In a real app, this would trigger a password reset
    console.log(`Resetting password for user with id: ${id}`);
    alert(`Password reset email sent to user #${id}`);
  };
  
  const handleSendEmail = (id) => {
    // In a real app, this would open an email composition interface
    console.log(`Sending email to user with id: ${id}`);
    const user = users.find(u => u.id === id);
    if (user) {
      alert(`Email interface opened for ${user.email}`);
    }
  };
  
  const getStatusBadge = (status) => {
    switch(status) {
      case 'active':
        return <Badge variant="success" size="sm">Active</Badge>;
      case 'inactive':
        return <Badge variant="gray" size="sm">Inactive</Badge>;
      case 'suspended':
        return <Badge variant="error" size="sm">Suspended</Badge>;
      default:
        return null;
    }
  };
  
  const getPlanBadge = (plan) => {
    switch(plan) {
      case 'premium':
        return <Badge variant="secondary" size="sm">Premium</Badge>;
      case 'admin':
        return <Badge variant="primary" size="sm">Admin</Badge>;
      default:
        return <Badge variant="gray" size="sm">Free</Badge>;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <Button 
          onClick={() => setShowAddModal(true)}
          variant="primary"
          icon={FaUserPlus}
        >
          Add User
        </Button>
      </div>
      
      {/* Search and Filter */}
      <div className="bg-white shadow-sm rounded-lg p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <FaFilter className="text-gray-500" />
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <FaFilter className="text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Users Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registered
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((userData) => (
                <tr key={userData.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-500 font-medium">
                          {userData.name.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{userData.name}</div>
                        <div className="text-sm text-gray-500">{userData.email}</div>
                        {userData.role === 'admin' && (
                          <Badge variant="primary" size="xs" className="mt-1">Admin</Badge>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(userData.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getPlanBadge(userData.plan)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {userData.registeredDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {userData.lastLogin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => handleEdit(userData)}
                        className="text-primary hover:text-primary-dark"
                        title="Edit User"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        onClick={() => handleSendEmail(userData.id)}
                        className="text-gray-600 hover:text-gray-900"
                        title="Send Email"
                      >
                        <FaEnvelope />
                      </button>
                      <button 
                        onClick={() => handleResetPassword(userData.id)}
                        className="text-warning hover:text-warning-dark"
                        title="Reset Password"
                      >
                        <FaLock />
                      </button>
                      {userData.email !== 'yatooinformation@gmail.com' && (
                        <button 
                          onClick={() => handleDelete(userData.id)}
                          className="text-error hover:text-error-dark"
                          title="Delete User"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredUsers.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No users found matching your criteria.</p>
          </div>
        )}
      </div>
      
      {/* Pagination */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Showing <span className="font-medium">{filteredUsers.length}</span> of <span className="font-medium">{users.length}</span> users
        </div>
        <div className="flex space-x-1">
          <button className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50">
            Previous
          </button>
          <button className="px-3 py-1 bg-primary text-white rounded-md text-sm">
            1
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded-md text-sm">
            Next
          </button>
        </div>
      </div>
      
      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Add New User</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={newUser.status}
                    onChange={(e) => setNewUser({...newUser, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plan
                </label>
                <select
                  value={newUser.plan}
                  onChange={(e) => setNewUser({...newUser, plan: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="free">Free</option>
                  <option value="premium">Premium</option>
                  {newUser.role === 'admin' && <option value="admin">Admin</option>}
                </select>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <Button 
                variant="ghost" 
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="primary"
                onClick={handleAddUser}
                disabled={!newUser.name || !newUser.email || !newUser.password}
                icon={FaCheck}
              >
                Add User
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit User Modal */}
      {showEditModal && currentUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Edit User</h2>
              <button 
                onClick={() => {
                  setShowEditModal(false);
                  setCurrentUser(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={currentUser.name}
                  onChange={(e) => setCurrentUser({...currentUser, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={currentUser.email}
                  onChange={(e) => setCurrentUser({...currentUser, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  disabled={currentUser.email === 'yatooinformation@gmail.com'}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    value={currentUser.role}
                    onChange={(e) => setCurrentUser({...currentUser, role: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    disabled={currentUser.email === 'yatooinformation@gmail.com'}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={currentUser.status}
                    onChange={(e) => setCurrentUser({...currentUser, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    disabled={currentUser.email === 'yatooinformation@gmail.com'}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plan
                </label>
                <select
                  value={currentUser.plan}
                  onChange={(e) => setCurrentUser({...currentUser, plan: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  disabled={currentUser.email === 'yatooinformation@gmail.com'}
                >
                  <option value="free">Free</option>
                  <option value="premium">Premium</option>
                  {currentUser.role === 'admin' && <option value="admin">Admin</option>}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Registration Date
                </label>
                <input
                  type="text"
                  value={currentUser.registeredDate}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <Button 
                variant="ghost" 
                onClick={() => {
                  setShowEditModal(false);
                  setCurrentUser(null);
                }}
              >
                Cancel
              </Button>
              <Button 
                variant="primary"
                onClick={handleUpdateUser}
                disabled={!currentUser.name || !currentUser.email}
                icon={FaCheck}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;
