import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { verifyadmin, verifylogin } from '../../features/authSlice';

const API = import.meta.env.VITE_API_URL;

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const response = await axios.post(`${API}/api/auth/login`, formData);
      dispatch(verifylogin());
      dispatch(verifyadmin(response.data.user.email));
      
      // Show success toast
      toast.success('Login successful! Redirecting...');
      
      // Delay navigation slightly to show toast
      setTimeout(() => {
        navigate('/');
      }, 1500);
      
    } catch (error) {
      setError(error.response?.data?.message || "Backend is starting. Please try again.");
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-800">
      <Toaster />
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold text-center mb-2">Login</h2>
        <p className="text-gray-500 text-center mb-6">
          Login into your account.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full mb-4 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          required
          disabled={isLoading}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full mb-4 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          required
          disabled={isLoading}
        />

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full font-semibold py-2 rounded transition-all ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Signing in...
            </div>
          ) : (
            'Submit'
          )}
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 underline hover:text-blue-800">
            Register now
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
