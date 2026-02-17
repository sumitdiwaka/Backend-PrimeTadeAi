import { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log('👤 Loaded user from storage:', parsedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      console.log('🔑 Attempting login for:', email);
      
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data.success) {
        const userData = response.data.user;
        console.log('✅ Login successful, user data:', userData);
        
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        
        toast.success(`Welcome ${userData.name}! You are logged in as ${userData.role}`);
        return true;
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      return false;
    }
  };

  const register = async (userData) => {
    try {
      console.log('📝 Registering user:', userData);
      
      const response = await api.post('/auth/register', userData);
      
      if (response.data.success) {
        const userData = response.data.user;
        console.log('✅ Registration successful, user data:', userData);
        
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        
        toast.success(`Registration successful! You are registered as ${userData.role}`);
        return true;
      }
    } catch (error) {
      console.error('❌ Register error:', error);
      return false;
    }
  };

  const logout = () => {
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
    loading,
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};