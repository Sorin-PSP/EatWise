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
  const userContext = useUser() || { login: async () => ({ success: false, error: 'Authentication service unavailable' }) };
  const { login } = userContext;
  
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
      // Normalize email to lowercase
      const normalizedEmail = formData.email.toLowerCase();
      
      if (isLogin) {
        // Special handling for admin login
        if (normalizedEmail === 'admineatwise@gmail.com') {
          try {
            // First, ensure admin email is confirmed
            const { error: confirmError } = await supabase.rpc('confirm_admin_email', { 
              admin_email: normalizedEmail 
            });
            
            if (confirmError) {
              console.error('Error confirming admin email:', confirmError);
              // Continue with login attempt even if confirmation fails
            }
            
            // Try to sign in
            const { data, error } = await supabase.auth.signInWithPassword({
              email: normalizedEmail,
              password: formData.password
            });
            
            if (error) {
              // If login failed, check if we need to create the admin account
              if (error.message.includes('Invalid login credentials')) {
                // Try to create admin user
                const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                  email: normalizedEmail,
                  password: formData.password
                });
                
                if (signUpError) {
                  if (signUpError.message.includes('invalid')) {
                    setError('Invalid email format. Please check the email address.');
                  } else {
                    setError(signUpError.message);
                  }
                  setLoading(false);
                  return;
                }
                
                // Confirm the email immediately
                await supabase.rpc('confirm_admin_email', { 
                  admin_email: normalizedEmail 
                });
                
                // Try to sign in again
                const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
                  email: normalizedEmail,
                  password: formData.password
                });
                
                if (retryError) {
                  setError(retryError.message);
                  setLoading(false);
                  return;
                }
                
                // Create admin profile if needed
                await createAdminProfile(retryData.user.id, normalizedEmail);
                
                navigate('/admin/dashboard');
                return;
              } else {
                setError(error.message);
                setLoading(false);
                return;
              }
            }
            
            // Login successful, check if profile exists
            await createAdminProfile(data.user.id, normalizedEmail);
            
            navigate('/admin/dashboard');
            return;
          } catch (err) {
            console.error('Admin login error:', err);
            setError('An error occurred during admin login. Please try again.');
            setLoading(false);
            return;
          }
        }
        
        // Regular user login
        const result = await login(formData.email, formData.password);
        
        if (result.success) {
          navigate('/dashboard');
        } else {
          setError(result.error || 'Invalid credentials');
        }
      } else {
        // Register new user
        const { data, error } = await supabase.auth.signUp({
          email: normalizedEmail,
          password: formData.password,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              name: formData.name
            }
          }
        });
        
        if (error) {
          setError(error.message);
        } else {
          // If email confirmation is required, handle it
          if (data?.user?.identities?.length === 0) {
            setError('This email is already registered. Please check your email for confirmation link or try signing in.');
            setLoading(false);
            return;
          }
          
          // Automatically sign in after signup (bypassing email confirmation)
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: normalizedEmail,
            password: formData.password
          });
          
          if (signInError) {
            if (signInError.message.includes('Email not confirmed')) {
              setError('Account created but email verification is required. Please check your email.');
            } else {
              setError(signInError.message);
            }
            setLoading(false);
            return;
          }
          
          // Create profile for new user
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([{
              id: data.user.id,
              email: normalizedEmail,
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
  
  // Helper function to create admin profile if it doesn't exist
  const createAdminProfile = async (userId, email) => {
    try {
      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single();
        
      if (!existingProfile) {
        // Create admin profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{
            id: userId,
            email: email,
            name: 'Admin',
            measurement_system: 'metric',
            daily_calorie_goal: 2000,
            protein_goal: 120,
            carbs_goal: 250,
            fat_goal: 70,
            water_goal: 8
          }]);
          
        if (profileError) {
          console.error('Error creating admin profile:', profileError);
        }
      }
    } catch (err) {
      console.error('Error checking/creating admin profile:', err);
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
