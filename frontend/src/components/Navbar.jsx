import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  console.log('👤 Navbar user:', user); // Debug log

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold">
            Task Manager
          </Link>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span>Welcome, {user.name}</span>
                <span className={`px-2 py-1 rounded text-sm font-medium ${
                  user.role === 'admin' 
                    ? 'bg-purple-700 text-white' 
                    : 'bg-blue-700 text-white'
                }`}>
                  {user.role === 'admin' ? '👑 ADMIN' : '👤 USER'}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:text-blue-200 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;