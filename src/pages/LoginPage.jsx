import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaLock, FaSignInAlt, FaUserPlus, FaLeaf } from 'react-icons/fa';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { useUser } from '../contexts/UserContext';

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
  const { updateUser } = useUser();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };
  
  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Te rugăm să completezi toate câmpurile obligatorii.');
      return false;
    }
    
    if (!isLogin) {
      if (formData.password !== formData.confirmPassword) {
        setError('Parolele nu coincid.');
        return false;
      }
      
      if (formData.password.length < 6) {
        setError('Parola trebuie să aibă cel puțin 6 caractere.');
        return false;
      }
      
      if (!formData.name) {
        setError('Te rugăm să introduci numele tău.');
        return false;
      }
    }
    
    return true;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (isLogin) {
        // In a real app, you would verify credentials with your backend
        // For demo purposes, we'll just simulate a successful login
        const userData = {
          name: 'Utilizator Demo',
          email: formData.email,
          isLoggedIn: true
        };
        
        // Save to context and localStorage
        updateUser(userData);
        localStorage.setItem('eatwise-auth', JSON.stringify(userData));
        
        setLoading(false);
        navigate('/dashboard');
      } else {
        // In a real app, you would register the user with your backend
        // For demo purposes, we'll just simulate a successful registration
        const userData = {
          name: formData.name,
          email: formData.email,
          isLoggedIn: true
        };
        
        // Save to context and localStorage
        updateUser(userData);
        localStorage.setItem('eatwise-auth', JSON.stringify(userData));
        
        setLoading(false);
        navigate('/profile');
      }
    }, 1500);
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
            {isLogin ? 'Conectează-te pentru a-ți gestiona nutriția' : 'Creează un cont pentru a începe'}
          </p>
        </div>
        
        <Card className="px-6 py-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <Input
                label="Nume"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Numele tău complet"
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
              placeholder="adresa@email.com"
              required
              icon={FaUser}
            />
            
            <Input
              label="Parolă"
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
                label="Confirmă parola"
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
              {loading ? 'Se procesează...' : isLogin ? 'Conectare' : 'Înregistrare'}
            </Button>
            
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={toggleMode}
                className="text-primary hover:text-primary-dark text-sm font-medium"
              >
                {isLogin ? 'Nu ai cont? Înregistrează-te' : 'Ai deja cont? Conectează-te'}
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
              Aplicație de nutriție personalizată
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
              <h3 className="font-medium text-sm">Alimentație sănătoasă</h3>
            </div>
          </div>
          
          <div className="relative rounded-lg overflow-hidden h-32">
            <img 
              src="https://images.pexels.com/photos/3768916/pexels-photo-3768916.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750" 
              alt="Fitness" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4 text-white">
              <h3 className="font-medium text-sm">Stil de viață activ</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
