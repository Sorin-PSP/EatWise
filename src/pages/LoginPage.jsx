import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaLock, FaSignInAlt, FaUserPlus, FaLeaf } from 'react-icons/fa';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { useUser } from '../contexts/UserContext';
import { supabase } from '../lib/supabaseClient';

function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useUser();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };
  
  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields.');
      return false;
    }
    
    if (!isLogin) {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match.');
        return false;
      }
      
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return false;
      }
      
      if (!formData.name) {
        setError('Please enter your name.');
        return false;
      }
    }
    
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      if (isLogin) {
        // Use the login function from context
        const result = await login(formData.email, formData.password);
        
        if (result.success) {
          // Redirect admin users to admin dashboard
          if (formData.email === 'AdminEatWise@gmail.com') {
            navigate('/admin/dashboard');
          } else {
            navigate('/dashboard');
          }
        } else {
          setError(result.error || 'Invalid credentials');
        }
      } else {
        // Register new user
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password
        });
        
        if (error) {
          setError(error.message);
        } else {
          // Create profile for new user
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([{
              id: data.user.id,
              email: formData.email,
              name: formData.name,
              measurement_system: 'metric',
              daily_calorie_goal: 2000,
              protein_goal: 120,
              carbs_goal: 250,
              fat_goal: 70,
              water_goal: 8
            }]);
            
          if (profileError) {
            console.error('Error creating profile:', profileError);
            setError('Account created but there was an error setting up your profile.');
          } else {
            // Redirect to profile page to complete setup
            navigate('/profile');
          }
        }
      }
    } catch (err) {
      console.error('Authentication error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };
  
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <FaLeaf className="text-secondary text-5xl" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 font-heading">
            Eat<span className="text-secondary">Wise</span>
          </h2>
          <p className="mt-2 text-gray-600">
            {isLogin ? 'Sign in to manage your nutrition' : 'Create an account to get started'}
          </p>
        </div>
        
        <Card className="px-6 py-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <Input
                label="Name"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                required
              />
            )}
            
            <Input
              label="Email"
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email@example.com"
              required
              icon={FaUser}
            />
            
            <Input
              label="Password"
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              icon={FaLock}
            />
            
            {!isLogin && (
              <Input
                label="Confirm Password"
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                icon={FaLock}
              />
            )}
            
            {error && (
              <div className="bg-error-light/20 text-error p-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              icon={isLogin ? FaSignInAlt : FaUserPlus}
              disabled={loading}
            >
              {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Register'}
            </Button>
            
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={toggleMode}
                className="text-primary hover:text-primary-dark text-sm font-medium"
              >
                {isLogin ? 'Don\'t have an account? Register' : 'Already have an account? Sign in'}
              </button>
            </div>
          </form>
        </Card>
        
        <div className="relative mt-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-gray-50 text-gray-500">
              Personalized nutrition application
            </span>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="relative rounded-lg overflow-hidden h-32">
            <img 
              src="https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750" 
              alt="Healthy food" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4 text-white">
              <h3 className="font-medium text-sm">Healthy Eating</h3>
            </div>
          </div>
          
          <div className="relative rounded-lg overflow-hidden h-32">
            <img 
              src="https://images.pexels.com/photos/3768916/pexels-photo-3768916.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750" 
              alt="Fitness" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4 text-white">
              <h3 className="font-medium text-sm">Active Lifestyle</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
