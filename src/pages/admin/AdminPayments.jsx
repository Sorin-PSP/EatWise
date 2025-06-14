import React, { useState } from 'react';
import { FaSearch, FaCreditCard, FaMoneyBillWave, FaChartLine, FaExclamationTriangle, FaFilter, FaDownload } from 'react-icons/fa';
import Card from '../../components/Card';
import { useUser } from '../../contexts/UserContext';
import { Navigate } from 'react-router-dom';

function AdminPayments() {
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateRange, setDateRange] = useState('month');
  
  // Redirect if not admin
  if (!user.isLoggedIn || !user.isAdmin) {
    return <Navigate to="/login" />;
  }
  
  // Mock payment data
  const payments = [
    { 
      id: 'pay_1234567890', 
      user: 'Ion Ionescu', 
      email: 'ion@example.com',
      amount: 49.99, 
      status: 'completed', 
      date: '2023-06-15', 
      plan: 'Premium (Annual)',
      paymentMethod: 'Visa **** 4242'
    },
    { 
      id: 'pay_0987654321', 
      user: 'Maria Popescu', 
      email: 'maria@example.com',
      amount: 4.99, 
      status: 'completed', 
      date: '2023-06-10', 
      plan: 'Premium (Monthly)',
      paymentMethod: 'Mastercard **** 5555'
    },
    { 
      id: 'pay_1122334455', 
      user: 'Elena Popovici', 
      email: 'elena@example.com',
      amount: 49.99, 
      status: 'completed', 
      date: '2023-06-05', 
      plan: 'Premium (Annual)',
      paymentMethod: 'PayPal'
    },
    { 
      id: 'pay_5566778899', 
      user: 'Alexandru Munteanu', 
      email: 'alex@example.com',
      amount: 4.99, 
      status: 'failed', 
      date: '2023-06-02', 
      plan: 'Premium (Monthly)',
      paymentMethod: 'Visa **** 1234'
    },
    { 
      id: 'pay_9988776655', 
      user: 'Cristina Dumitrescu', 
      email: 'cristina@example.com',
      amount: 4.99, 
      status: 'refunded', 
      date: '2023-05-28', 
      plan: 'Premium (Monthly)',
      paymentMethod: 'Mastercard **** 9876'
    },
  ];
  
  // Mock payment stats
  const paymentStats = {
    totalRevenue: 5230.75,
    monthlyRevenue: 1245.50,
    activeSubscriptions: 876,
    conversionRate: 12.5,
    refundRate: 2.3
  };
  
  // Filter payments based on search term and status
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.user.toLowerCase().includes(searchTerm.toLowerCase()) || 
      payment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || payment.status === filterStatus;
    return matchesSearch && matchesFilter;
  });
  
  const getStatusBadge = (status) => {
    switch(status) {
      case 'completed':
        return <span className="px-2 py-1 text-xs rounded-full bg-success/10 text-success">Completed</span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs rounded-full bg-warning/10 text-warning">Pending</span>;
      case 'failed':
        return <span className="px-2 py-1 text-xs rounded-full bg-error/10 text-error">Failed</span>;
      case 'refunded':
        return <span className="px-2 py-1 text-xs rounded-full bg-info/10 text-info">Refunded</span>;
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Payment Management</h1>
        <button 
          className="bg-primary text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-primary-dark transition-colors"
        >
          <FaDownload />
          <span>Export Report</span>
        </button>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white shadow-sm rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Monthly Revenue</p>
              <h3 className="text-2xl font-bold text-gray-800">${paymentStats.monthlyRevenue.toLocaleString()}</h3>
              <p className="text-xs text-green-600 mt-1">
                <span className="font-medium">+8%</span> from last month
              </p>
            </div>
            <div className="bg-primary/10 p-3 rounded-full">
              <FaMoneyBillWave className="text-xl text-primary" />
            </div>
          </div>
        </Card>
        
        <Card className="bg-white shadow-sm rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
              <h3 className="text-2xl font-bold text-gray-800">${paymentStats.totalRevenue.toLocaleString()}</h3>
              <p className="text-xs text-green-600 mt-1">
                <span className="font-medium">+15%</span> from last year
              </p>
            </div>
            <div className="bg-secondary/10 p-3 rounded-full">
              <FaChartLine className="text-xl text-secondary" />
            </div>
          </div>
        </Card>
        
        <Card className="bg-white shadow-sm rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Active Subscriptions</p>
              <h3 className="text-2xl font-bold text-gray-800">{paymentStats.activeSubscriptions}</h3>
              <p className="text-xs text-green-600 mt-1">
                <span className="font-medium">+12</span> new this month
              </p>
            </div>
            <div className="bg-accent/10 p-3 rounded-full">
              <FaCreditCard className="text-xl text-accent" />
            </div>
          </div>
        </Card>
        
        <Card className="bg-white shadow-sm rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Refund Rate</p>
              <h3 className="text-2xl font-bold text-gray-800">{paymentStats.refundRate}%</h3>
              <p className="text-xs text-green-600 mt-1">
                <span className="font-medium">-0.5%</span> from last month
              </p>
            </div>
            <div className="bg-warning/10 p-3 rounded-full">
              <FaExclamationTriangle className="text-xl text-warning" />
            </div>
          </div>
        </Card>
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
              placeholder="Search payments..."
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
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
            
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Payments Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Method
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{payment.id}</div>
                    <div className="text-xs text-gray-500">{payment.plan}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{payment.user}</div>
                    <div className="text-xs text-gray-500">{payment.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">${payment.amount.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(payment.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {payment.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {payment.paymentMethod}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredPayments.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No payments found matching your criteria.</p>
          </div>
        )}
      </div>
      
      {/* Pagination */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Showing <span className="font-medium">{filteredPayments.length}</span> of <span className="font-medium">{payments.length}</span> transactions
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
    </div>
  );
}

export default AdminPayments;
