import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for active session on mount
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user || null);
      setIsAdmin(session?.user?.email === 'admineatwise@gmail.com');
      setLoading(false);
    };

    checkSession();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(`Auth event: ${event}`);
        setSession(session);
        setUser(session?.user || null);
        setIsAdmin(session?.user?.email === 'admineatwise@gmail.com');
        setLoading(false);
      }
    );

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const login = async (email, password) => {
    try {
      // Normalize email to lowercase
      const normalizedEmail = email.toLowerCase();
      
      // Admin login check
      if (normalizedEmail === 'admineatwise@gmail.com' && password === '1234EatWise-16634160/2025') {
        // Try to sign in
        const { data, error } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password
        });
        
        if (error) {
          // If error is about email confirmation or invalid credentials, try to create admin account
          if (error.message.includes('Email not confirmed') || error.message.includes('Invalid login credentials')) {
            // Create admin account
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
              email: normalizedEmail,
              password,
              options: {
                data: {
                  is_admin: true
                }
              }
            });
            
            if (signUpError) {
              console.error('Error signing up admin:', signUpError);
              return { success: false, error: signUpError.message };
            }
            
            // Try signing in again
            const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
              email: normalizedEmail,
              password
            });
            
            if (retryError) {
              console.error('Error signing in admin after signup:', retryError);
              return { success: false, error: 'Could not sign in admin. Please contact support.' };
            }
          } else {
            return { success: false, error: error.message };
          }
        }
        
        setIsAdmin(true);
        return { success: true };
      } else {
        // Regular user login
        const { data, error } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password
        });
        
        if (error) {
          // If user doesn't exist, sign them up
          if (error.message.includes('Invalid login credentials')) {
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
              email: normalizedEmail,
              password,
              options: {
                emailRedirectTo: window.location.origin
              }
            });
            
            if (signUpError) {
              console.error('Error signing up:', signUpError);
              return { success: false, error: signUpError.message };
            }
            
            // Try signing in again
            const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
              email: normalizedEmail,
              password
            });
            
            if (retryError) {
              console.error('Error signing in after signup:', retryError);
              return { success: false, error: 'Account created. Please check your email for confirmation.' };
            }
          } else {
            return { success: false, error: error.message };
          }
        }
        
        return { success: true };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const register = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // Auto-sign in after registration
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        return { 
          success: true, 
          message: 'Account created. Please check your email for confirmation.' 
        };
      }

      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    session,
    loading,
    isAdmin,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
