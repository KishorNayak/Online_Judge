import React, { useState } from 'react';
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom';
const API = import.meta.env.VITE_API_URL;

import toast, { Toaster } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { verifyadmin, verifylogin, verifylogout } from '../../features/authSlice';


const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
        try {
      const response = await axios.post(`${API}/api/auth/register`, formData);
      dispatch(verifylogin());
      dispatch(verifyadmin(response.data.user.email));
      
       // Show success toast
       toast.success('Registration successful! Redirecting...');
      
       // Delay navigation slightly to show toast
       setTimeout(() => {
         navigate('/');
       }, 1500);
    } catch (error) {
      setError(error.response?.data?.message || "Backend is starting. Please try again.");
    }finally{
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
        <h2 className="text-2xl font-semibold text-center mb-2">Register</h2>
        <p className="text-gray-500 text-center mb-6">
          Create your account.
        </p>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <div className="flex gap-4 mb-4">
          <input
            type="text"
            name="firstname"
            placeholder="First Name"
            value={formData.firstname}
            onChange={handleChange}
            className=" w-1/2 px-3 py-2 border rounded"
            required
          />
          <input
            type="text"
            name="lastname"
            placeholder="Last Name"
            value={formData.lastname}
            onChange={handleChange}
            className="w-1/2 px-3 py-2 border rounded"
            required
          />
        </div>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full mb-4 px-3 py-2 border rounded"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full mb-4 px-3 py-2 border rounded"
          required
        />

        {/* submit button */}
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
          Already have an account?{' '}
           {/* # - link for login page */}
          <Link to="/login" className="text-blue-600 underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;