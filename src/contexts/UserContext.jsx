import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState({
    isLoggedIn: false,
    name: null,
    email: null,
    id: null,
    dailyCalorieGoal: 2000, // Default value
    measurementSystem: 'metric', // Default measurement system
    isAdmin: false, // Added isAdmin property
    weight: null,
    startWeight: null,
    goalWeight: null,
    proteinGoal: 120,
    carbsGoal: 250,
    fatGoal: 70,
    waterGoal: 8,
    age: null,
    gender: null,
    height: null,
    activityLevel: 'moderate',
    goal: 'maintain'
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check for active session on mount
  useEffect(() => {
    const checkSession = async () => {
      setIsLoading(true);
      
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // User is logged in, get their profile data
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (error) {
          console.error('Error fetching profile:', error);
          setUser({
            isLoggedIn: true,
            id: session.user.id,
            email: session.user.email,
            name: session.user.email.split('@')[0],
            dailyCalorieGoal: 2000,
            measurementSystem: 'metric',
            isAdmin: session.user.email === 'AdminEatWise@gmail.com',
            weight: null,
            startWeight: null,
            goalWeight: null,
            proteinGoal: 120,
            carbsGoal: 250,
            fatGoal: 70,
            waterGoal: 8
          });
        } else if (profile) {
          // Set user data from profile
          setUser({
            isLoggedIn: true,
            id: session.user.id,
            email: profile.email || session.user.email,
            name: profile.name || session.user.email.split('@')[0],
            dailyCalorieGoal: profile.daily_calorie_goal || 2000,
            measurementSystem: profile.measurement_system || 'metric',
            isAdmin: session.user.email === 'AdminEatWise@gmail.com',
            weight: profile.weight,
            startWeight: profile.start_weight,
            goalWeight: profile.goal_weight,
            proteinGoal: profile.protein_goal || 120,
            carbsGoal: profile.carbs_goal || 250,
            fatGoal: profile.fat_goal || 70,
            waterGoal: profile.water_goal || 8,
            age: profile.age,
            gender: profile.gender,
            height: profile.height,
            activityLevel: profile.activity_level || 'moderate',
            goal: profile.goal || 'maintain'
          });
        }
        
        setIsAdmin(session.user.email === 'AdminEatWise@gmail.com');
      } else {
        // No active session, user is not logged in
        setUser({
          isLoggedIn: false,
          name: null,
          email: null,
          id: null,
          dailyCalorieGoal: 2000,
          measurementSystem: 'metric',
          isAdmin: false,
          weight: null,
          startWeight: null,
          goalWeight: null,
          proteinGoal: 120,
          carbsGoal: 250,
          fatGoal: 70,
          waterGoal: 8
        });
        setIsAdmin(false);
      }
      
      setIsLoading(false);
    };
    
    checkSession();
    
    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // User signed in, get their profile
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching profile on auth change:', error);
        }
        
        if (profile) {
          setUser({
            isLoggedIn: true,
            id: session.user.id,
            email: profile.email || session.user.email,
            name: profile.name || session.user.email.split('@')[0],
            dailyCalorieGoal: profile.daily_calorie_goal || 2000,
            measurementSystem: profile.measurement_system || 'metric',
            isAdmin: session.user.email === 'AdminEatWise@gmail.com',
            weight: profile.weight,
            startWeight: profile.start_weight,
            goalWeight: profile.goal_weight,
            proteinGoal: profile.protein_goal || 120,
            carbsGoal: profile.carbs_goal || 250,
            fatGoal: profile.fat_goal || 70,
            waterGoal: profile.water_goal || 8,
            age: profile.age,
            gender: profile.gender,
            height: profile.height,
            activityLevel: profile.activity_level || 'moderate',
            goal: profile.goal || 'maintain'
          });
        } else {
          // No profile found, create one
          const newProfile = {
            id: session.user.id,
            email: session.user.email,
            name: session.user.email.split('@')[0],
            measurement_system: 'metric',
            daily_calorie_goal: 2000,
            protein_goal: 120,
            carbs_goal: 250,
            fat_goal: 70,
            water_goal: 8
          };
          
          const { error: insertError } = await supabase
            .from('profiles')
            .insert([newProfile]);
            
          if (insertError) {
            console.error('Error creating profile:', insertError);
          }
          
          setUser({
            isLoggedIn: true,
            id: session.user.id,
            email: session.user.email,
            name: session.user.email.split('@')[0],
            dailyCalorieGoal: 2000,
            measurementSystem: 'metric',
            isAdmin: session.user.email === 'AdminEatWise@gmail.com',
            weight: null,
            startWeight: null,
            goalWeight: null,
            proteinGoal: 120,
            carbsGoal: 250,
            fatGoal: 70,
            waterGoal: 8
          });
        }
        
        setIsAdmin(session.user.email === 'AdminEatWise@gmail.com');
      } else if (event === 'SIGNED_OUT') {
        // User signed out
        setUser({
          isLoggedIn: false,
          name: null,
          email: null,
          id: null,
          dailyCalorieGoal: 2000,
          measurementSystem: 'metric',
          isAdmin: false,
          weight: null,
          startWeight: null,
          goalWeight: null,
          proteinGoal: 120,
          carbsGoal: 250,
          fatGoal: 70,
          waterGoal: 8
        });
        setIsAdmin(false);
      }
    });
    
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);
  
  const login = async (email, password) => {
    // Admin login check
    if (email === 'AdminEatWise@gmail.com' && password === '1234EatWise-16634160/2025') {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) {
          // If admin credentials don't exist in Supabase yet, sign up first
          if (error.message.includes('Invalid login credentials')) {
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
              email,
              password
            });
            
            if (signUpError) {
              console.error('Error signing up admin:', signUpError);
              return { success: false, error: signUpError.message };
            }
            
            // Create admin profile
            const { error: profileError } = await supabase
              .from('profiles')
              .insert([{
                id: signUpData.user.id,
                email,
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
            
            setUser({
              isLoggedIn: true,
              id: signUpData.user.id,
              name: 'Admin',
              email,
              dailyCalorieGoal: 2000,
              measurementSystem: 'metric',
              isAdmin: true,
              weight: null,
              startWeight: null,
              goalWeight: null,
              proteinGoal: 120,
              carbsGoal: 250,
              fatGoal: 70,
              waterGoal: 8
            });
            setIsAdmin(true);
            return { success: true };
          }
          
          return { success: false, error: error.message };
        }
        
        setIsAdmin(true);
        return { success: true };
      } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: 'An unexpected error occurred' };
      }
    } else if (email && password) {
      try {
        // Try to sign in
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) {
          // If user doesn't exist, sign them up
          if (error.message.includes('Invalid login credentials')) {
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
              email,
              password
            });
            
            if (signUpError) {
              console.error('Error signing up:', signUpError);
              return { success: false, error: signUpError.message };
            }
            
            // Create user profile
            const { error: profileError } = await supabase
              .from('profiles')
              .insert([{
                id: signUpData.user.id,
                email,
                name: email.split('@')[0],
                measurement_system: 'metric',
                daily_calorie_goal: 2000,
                protein_goal: 120,
                carbs_goal: 250,
                fat_goal: 70,
                water_goal: 8
              }]);
              
            if (profileError) {
              console.error('Error creating profile:', profileError);
            }
            
            return { success: true };
          }
          
          return { success: false, error: error.message };
        }
        
        return { success: true };
      } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: 'An unexpected error occurred' };
      }
    }
    
    return { 
      success: false, 
      error: 'Invalid email or password' 
    };
  };
  
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Error signing out:', error);
    }
    
    setUser({
      isLoggedIn: false,
      name: null,
      email: null,
      id: null,
      dailyCalorieGoal: 2000,
      measurementSystem: 'metric',
      isAdmin: false,
      weight: null,
      startWeight: null,
      goalWeight: null,
      proteinGoal: 120,
      carbsGoal: 250,
      fatGoal: 70,
      waterGoal: 8
    });
    setIsAdmin(false);
  };
  
  // Add updateUser function to update user data
  const updateUser = async (userData) => {
    if (!user.isLoggedIn || !user.id) {
      console.error('Cannot update user: not logged in');
      return { success: false, error: 'Not logged in' };
    }
    
    // Update local state first for immediate UI feedback
    setUser(prevUser => ({
      ...prevUser,
      ...userData
    }));
    
    // Prepare data for Supabase (convert camelCase to snake_case)
    const profileData = {
      name: userData.name,
      email: userData.email,
      measurement_system: userData.measurementSystem,
      daily_calorie_goal: userData.dailyCalorieGoal,
      weight: userData.weight,
      start_weight: userData.startWeight,
      goal_weight: userData.goalWeight,
      protein_goal: userData.proteinGoal,
      carbs_goal: userData.carbsGoal,
      fat_goal: userData.fatGoal,
      water_goal: userData.waterGoal,
      age: userData.age,
      gender: userData.gender,
      height: userData.height,
      activity_level: userData.activityLevel,
      goal: userData.goal
    };
    
    // Remove undefined values
    Object.keys(profileData).forEach(key => 
      profileData[key] === undefined && delete profileData[key]
    );
    
    // Update profile in Supabase
    const { error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', user.id);
      
    if (error) {
      console.error('Error updating profile:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true };
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
