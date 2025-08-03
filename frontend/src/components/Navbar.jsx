import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { verifylogout } from '../features/authSlice';

function Navbar() {
  const dispatch = useDispatch();
  return (
    <nav className="bg-gray-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link to="/" className="text-xl font-bold text-white">Online Judge</Link>
          </div>
          <div className="hidden md:flex space-x-4">
            <Link to="/login" className="hover:bg-gray-700 hover:!text-yellow-300 px-3 py-2 rounded-md text-sm font-medium !text-yellow-200 no-underline">Login</Link>
            <Link to="/login" className="hover:bg-gray-700 hover:!text-yellow-300 px-3 py-2 rounded-md text-sm font-medium !text-yellow-200 no-underline" onClick={() => dispatch(verifylogout())}>Logout</Link>
            <Link to="/profile" className="hover:bg-gray-700 hover:!text-yellow-300 px-3 py-2 rounded-md text-sm font-medium !text-yellow-200 no-underline">Profile</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;