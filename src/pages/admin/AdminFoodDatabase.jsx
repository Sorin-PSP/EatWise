import React, { useState, useEffect } from 'react';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaFilter, FaListUl } from 'react-icons/fa';
import Card from '../../components/Card';
import { useUser } from '../../contexts/UserContext';
import { Navigate } from 'react-router-dom';
import { useFood } from '../../contexts/FoodContext';
import AddFoodModal from '../../components/AddFoodModal';
import BulkFoodAddModal from '../../components/BulkFoodAddModal';

function AdminFoodDatabase() {
  const { user } = useUser();
  const { foods, deleteFood } = useFood();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkAddModal, setShowBulkAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentFood, setCurrentFood] = useState(null);
  const [foodItems, setFoodItems] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Redirect if not admin
  if (!user.isLoggedIn || !user.isAdmin) {
    return <Navigate to="/login" />;
  }
  
  // Convert foods from context to the format expected by the admin panel
  useEffect(() => {
    const formattedFoods = foods.map(food => ({
      ...food, // Keep all original properties
      status: 'approved', // Default status for existing foods
      addedBy: 'System',
      dateAdded: new Date().toISOString().split('T')[0] // Today's date as fallback
    }));
    
    setFoodItems(formattedFoods);
  }, [foods, refreshTrigger]);
  
  // Filter foods based on search term and status
  const filteredFoods = foodItems.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || food.status === filterStatus;
    return matchesSearch && matchesFilter;
  });
  
  const handleEdit = (food) => {
    setCurrentFood(food);
    setShowEditModal(true);
  };
  
  const handleApprove = (id) => {
    // In a real app, this would update the database
    console.log(`Approving food with id: ${id}`);
  };
  
  const handleReject = (id) => {
    // In a real app, this would update the database
    console.log(`Rejecting food with id: ${id}`);
  };
  
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this food item?')) {
      deleteFood(id);
      // Trigger refresh
      setRefreshTrigger(prev => prev + 1);
    }
  };
  
  const handleModalClose = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setCurrentFood(null);
    // Trigger refresh when modal closes
    setRefreshTrigger(prev => prev + 1);
  };
  
  const handleBulkModalClose = () => {
    setShowBulkAddModal(false);
    // Trigger refresh when bulk modal closes
    setRefreshTrigger(prev => prev + 1);
  };
  
  const getStatusBadge = (status) => {
    switch(status) {
      case 'approved':
        return <span className="px-2 py-1 text-xs rounded-full bg-success/10 text-success">Approved</span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs rounded-full bg-warning/10 text-warning">Pending</span>;
      case 'rejected':
        return <span className="px-2 py-1 text-xs rounded-full bg-error/10 text-error">Rejected</span>;
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Food Database Management</h1>
        <div className="flex space-x-2">
          <button 
            onClick={() => setShowBulkAddModal(true)}
            className="bg-secondary text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-secondary-dark transition-colors"
          >
            <FaListUl />
            <span>Bulk Add</span>
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-primary text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-primary-dark transition-colors"
          >
            <FaPlus />
            <span>Add Food</span>
          </button>
        </div>
      </div>
      
      {/* Search and Filter */}
      <div className="bg-white shadow-sm rounded-lg p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search foods..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <FaFilter className="text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Food Items Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nutrition (per 100g)
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Added By
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Added
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFoods.map((food) => (
                <tr key={food.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{food.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <span className="font-medium">{food.calories}</span> kcal
                    </div>
                    <div className="text-xs text-gray-500">
                      P: {food.protein}g | C: {food.carbs}g | F: {food.fat}g
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(food.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {food.addedBy}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {food.dateAdded}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      {food.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleApprove(food.id)}
                            className="text-success hover:text-success-dark"
                            title="Approve"
                          >
                            <FaCheck />
                          </button>
                          <button 
                            onClick={() => handleReject(food.id)}
                            className="text-error hover:text-error-dark"
                            title="Reject"
                          >
                            <FaTimes />
                          </button>
                        </>
                      )}
                      <button 
                        onClick={() => handleEdit(food)}
                        className="text-primary hover:text-primary-dark"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        onClick={() => handleDelete(food.id)}
                        className="text-error hover:text-error-dark"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredFoods.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No food items found matching your criteria.</p>
          </div>
        )}
      </div>
      
      {/* Pagination */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Showing <span className="font-medium">{filteredFoods.length}</span> of <span className="font-medium">{foodItems.length}</span> items
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
      
      {/* Add Food Modal */}
      <AddFoodModal 
        isOpen={showAddModal} 
        onClose={handleModalClose} 
      />
      
      {/* Edit Food Modal */}
      <AddFoodModal 
        isOpen={showEditModal} 
        onClose={handleModalClose} 
        editFood={currentFood}
      />
      
      {/* Bulk Add Food Modal */}
      <BulkFoodAddModal
        isOpen={showBulkAddModal}
        onClose={handleBulkModalClose}
      />
    </div>
  );
}

export default AdminFoodDatabase;
