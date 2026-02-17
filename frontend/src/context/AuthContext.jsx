import { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api'; // Ensure this points to your axios instance
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from local storage on initial render
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
  }, []); // Empty dependency array ensures this runs only once

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data.success) {
        const userData = response.data.user;
        
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        
        toast.success(`Welcome back, ${userData.name}!`);
        return true;
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      // Optional: Add toast error here if you want
      // toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const register = async (userData) => {
    try {
      // NOTE: userData must include { name, email, password, role, adminSecret }
      console.log('📝 Registering user data:', userData);
      
      const response = await api.post('/auth/register', userData);
      
      if (response.data.success) {
        const newUser = response.data.user;
        
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(newUser));
        setUser(newUser);
        
        toast.success(`Registered successfully as ${newUser.role}`);
        return true;
      }
    } catch (error) {
      console.error('❌ Register error:', error);
      toast.error(error.response?.data?.message || 'Registration failed');
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

export default AuthContext;