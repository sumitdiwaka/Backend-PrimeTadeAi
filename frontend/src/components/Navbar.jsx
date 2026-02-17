import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  console.log('👤 Navbar user:', user); // Debug log

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-md shadow-lg py-2' 
          : 'bg-gradient-to-r from-blue-600 to-blue-700 shadow-xl py-3'
      }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo/Brand */}
            <Link 
              to="/" 
              className={`text-xl font-bold flex items-center space-x-2 group ${
                isScrolled ? 'text-gray-800' : 'text-white'
              }`}
            >
              <div className={`p-2 rounded-lg transition-all duration-300 group-hover:scale-110 ${
                isScrolled 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white' 
                  : 'bg-white/20 backdrop-blur-sm'
              }`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <span className="font-bold tracking-tight">TaskFlow</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {user ? (
                <>
                  {/* User Info */}
                  <div className="flex items-center space-x-4">
                    {/* User Avatar */}
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm shadow-md ${
                        user.role === 'admin'
                          ? 'bg-gradient-to-br from-purple-500 to-purple-700 text-white ring-2 ring-purple-300'
                          : isScrolled
                            ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white ring-2 ring-blue-200'
                            : 'bg-white/20 backdrop-blur-sm text-white ring-2 ring-white/50'
                      }`}>
                        {getInitials(user.name)}
                      </div>
                      <div className={`hidden lg:block ${
                        isScrolled ? 'text-gray-700' : 'text-white'
                      }`}>
                        <p className="text-sm font-medium">Welcome back,</p>
                        <p className="text-sm font-bold">{user.name}</p>
                      </div>
                    </div>

                    {/* Role Badge */}
                    <div className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1 ${
                      user.role === 'admin'
                        ? isScrolled
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-purple-600/20 backdrop-blur-sm text-white border border-purple-400/30'
                        : isScrolled
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-blue-600/20 backdrop-blur-sm text-white border border-blue-400/30'
                    }`}>
                      {user.role === 'admin' ? (
                        <>
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zm0 16a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                          </svg>
                          <span>ADMIN</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                          <span>USER</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                      isScrolled
                        ? 'bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg transform hover:scale-105'
                        : 'bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border border-white/30 hover:border-white/50'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  {/* Auth Links for Desktop */}
                  <Link
                    to="/login"
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      isScrolled
                        ? 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                        : 'text-white hover:bg-white/20'
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className={`flex items-center space-x-2 px-5 py-2 rounded-lg font-medium shadow-lg transition-all duration-200 transform hover:scale-105 ${
                      isScrolled
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
                        : 'bg-white text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    <span>Get Started</span>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-all duration-200 ${
                isScrolled
                  ? 'text-gray-600 hover:bg-gray-100'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 animate-slideDown">
              {user ? (
                <div className="space-y-3">
                  {/* Mobile User Info */}
                  <div className={`p-4 rounded-xl ${
                    isScrolled ? 'bg-gray-50' : 'bg-white/10 backdrop-blur-sm'
                  }`}>
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold ${
                        user.role === 'admin'
                          ? 'bg-gradient-to-br from-purple-500 to-purple-700 text-white'
                          : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                      }`}>
                        {getInitials(user.name)}
                      </div>
                      <div>
                        <p className={`font-medium ${isScrolled ? 'text-gray-800' : 'text-white'}`}>
                          {user.name}
                        </p>
                        <p className={`text-sm ${isScrolled ? 'text-gray-500' : 'text-white/70'}`}>
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs ${
                      user.role === 'admin'
                        ? isScrolled
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-purple-600/30 text-white'
                        : isScrolled
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-blue-600/30 text-white'
                    }`}>
                      {user.role === 'admin' ? '👑 Admin' : '👤 User'}
                    </div>
                  </div>

                  {/* Mobile Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Mobile Auth Links */}
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block w-full text-center px-4 py-3 rounded-lg font-medium transition-colors ${
                      isScrolled
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block w-full text-center px-4 py-3 rounded-lg font-medium ${
                      isScrolled
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                        : 'bg-white text-blue-600'
                    }`}
                  >
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Spacer to prevent content from hiding under fixed navbar */}
      <div className="h-16"></div>

      {/* Add animation keyframes */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </>
  );
};

export default Navbar;