import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState({
    isLoggedIn: false,
    name: null,
    email: null,
    id: null,
    dailyCalorieGoal: 2000, // Default value
    measurementSystem: 'metric', // Default measurement system
    isAdmin: false // Added isAdmin property
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load user data from localStorage on mount
  useEffect(() => {
    const loadUserFromStorage = () => {
      const savedUser = localStorage.getItem('eatwise-user');
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser({
            ...parsedUser,
            isLoggedIn: true,
            dailyCalorieGoal: parsedUser.dailyCalorieGoal || 2000,
            measurementSystem: parsedUser.measurementSystem || 'metric'
          });
          
          // Check if user is admin
          setIsAdmin(parsedUser.email === 'AdminEatWise@gmail.com');
        } catch (error) {
          console.error('Error parsing saved user:', error);
          // Initialize with default values if there's an error
          setUser({
            isLoggedIn: false,
            name: null,
            email: null,
            id: null,
            dailyCalorieGoal: 2000,
            measurementSystem: 'metric',
            isAdmin: false
          });
          setIsAdmin(false);
        }
      }
      
      setIsLoading(false);
    };
    
    loadUserFromStorage();
  }, []);
  
  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user && user.isLoggedIn) {
      localStorage.setItem('eatwise-user', JSON.stringify(user));
    } else if (localStorage.getItem('eatwise-user')) {
      localStorage.removeItem('eatwise-user');
    }
  }, [user]);
  
  const login = (email, password) => {
    // Admin login check
    if (email === 'AdminEatWise@gmail.com' && password === '1234EatWise-16634160/2025') {
      const userData = {
        id: '1',
        name: 'Admin',
        email: 'AdminEatWise@gmail.com',
        isLoggedIn: true,
        dailyCalorieGoal: 2000,
        measurementSystem: 'metric',
        isAdmin: true
      };
      
      setUser(userData);
      setIsAdmin(true);
      return { success: true };
    } else if (email && password) {
      // For demo, allow any non-empty email/password for regular users
      const userData = {
        id: Date.now().toString(),
        name: email.split('@')[0],
        email,
        isLoggedIn: true,
        dailyCalorieGoal: 2000,
        measurementSystem: 'metric',
        isAdmin: false
      };
      
      setUser(userData);
      setIsAdmin(false);
      return { success: true };
    }
    
    return { 
      success: false, 
      error: 'Invalid email or password' 
    };
  };
  
  const logout = () => {
    setUser({
      isLoggedIn: false,
      name: null,
      email: null,
      id: null,
      dailyCalorieGoal: 2000,
      measurementSystem: 'metric',
      isAdmin: false
    });
    setIsAdmin(false);
    localStorage.removeItem('eatwise-user');
  };
  
  // Add updateUser function to update user data
  const updateUser = (userData) => {
    setUser(prevUser => ({
      ...prevUser,
      ...userData
    }));
  };
  
  // Unit conversion functions
  const convertWeight = (weight, targetSystem) => {
    if (!weight) return '';
    
    // Convert between kg and lb
    if (targetSystem === 'metric') {
      // Convert from lb to kg
      return (parseFloat(weight) * 0.453592).toFixed(1);
    } else {
      // Convert from kg to lb
      return (parseFloat(weight) * 2.20462).toFixed(1);
    }
  };
  
  const convertHeight = (height, targetSystem) => {
    if (!height) return '';
    
    // Convert between cm and in
    if (targetSystem === 'metric') {
      // Convert from in to cm
      return Math.round(parseFloat(height) * 2.54);
    } else {
      // Convert from cm to in
      return (parseFloat(height) / 2.54).toFixed(1);
    }
  };
  
  const getWeightUnit = () => {
    return user.measurementSystem === 'metric' ? 'kg' : 'lb';
  };
  
  const getHeightUnit = () => {
    return user.measurementSystem === 'metric' ? 'cm' : 'in';
  };
  
  return (
    <UserContext.Provider value={{
      user,
      isAdmin,
      isLoading,
      login,
      logout,
      updateUser,
      convertWeight,
      convertHeight,
      getWeightUnit,
      getHeightUnit
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
