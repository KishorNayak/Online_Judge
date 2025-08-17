import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { verifylogout } from '../features/authSlice';
import codefury from '../assets/codefury_logo.png';

function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(verifylogout());
    navigate('/');
  }  
  return (
    <nav className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo Section */}
          <div className="flex-shrink-0 group flex items-center space-x-2" onClick={()=> navigate('/')}>
            <img className="w-12 h-12" src={codefury} alt="logo"/>
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:via-purple-300 group-hover:to-blue-300 transition-all duration-300">
                CodeFury
              </div>
          </div>

          {/* Navigation Links */}
          <div>
          <div className="hidden md:flex items-center space-x-1">
            
            {/* Navigation Menu Items */}
            <Link 
              to="/problemlist" 
              className="text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-slate-800/50 relative group"
            >
              Problems
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></div>
            </Link>
            
            <Link 
              to="/contests" 
              className="text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-slate-800/50 relative group"
            >
              Contests
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></div>
            </Link>
            
            <Link 
              to="/leaderboard" 
              className="text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-slate-800/50 relative group"
            >
              Leaderboard
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></div>
            </Link>

            {/* Divider */}
            <div className="w-px h-6 bg-slate-600 mx-2"></div>
            
            {/* Auth Section */}
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/profile" 
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-slate-800/50"
                >
                  Profile
                </Link>
                <button
                  onClick={() => handleLogout()}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/register" 
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-slate-800/50"
                >
                  Sign Up

                </Link>
                <Link 
                  to="/login" 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
                >
                  Login
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-slate-800/50 transition-all duration-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

      {/* Subtle glow effect */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-400/20 to-transparent"></div>
    </nav>
  );
}

export default Navbar;
