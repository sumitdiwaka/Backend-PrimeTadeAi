import { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage on initial load
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log('🔄 Loading user from storage:', parsedUser);
        setUser(parsedUser);
      } catch (e) {
        console.error('Error parsing stored user:', e);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      console.log('🔐 Login attempt for:', email);
      
      const response = await api.post('/auth/login', { email, password });
      
      console.log('📥 Login response:', response.data);
      
      if (response.data.success) {
        // Store in localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Update state
        setUser(response.data.user);
        
        console.log('✅ User logged in with role:', response.data.user.role);
        toast.success(`Welcome ${response.data.user.name}!`);
        return true;
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      return false;
    }
  };

  const register = async (userData) => {
    try {
      console.log('📝 Register attempt with data:', userData);
      
      const response = await api.post('/auth/register', userData);
      
      console.log('📥 Register response:', response.data);
      
      if (response.data.success) {
        // Store in localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Update state
        setUser(response.data.user);
        
        console.log('✅ User registered with role:', response.data.user.role);
        
        if (response.data.user.role === 'admin') {
          toast.success('Admin account created successfully!');
        } else {
          toast.success('Registration successful!');
        }
        return true;
      }
    } catch (error) {
      console.error('❌ Register error:', error);
      return false;
    }
  };

  const logout = () => {
    console.log('👋 Logging out user:', user?.email);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};