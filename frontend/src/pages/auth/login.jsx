import React, { useState } from 'react';
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom';
import "tailwindcss";
const API = import.meta.env.VITE_API_URL;
import { useDispatch } from 'react-redux';
import { verifyadmin, verifylogin } from '../../features/authSlice';



const login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
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
    setError('');
    try {
      const response = await axios.post(`${API}/api/auth/login`, formData);
      console.log("Login successful:", response.data);
      dispatch(verifylogin());
      dispatch(verifyadmin(response.data.user.email));
      console.log("Login response:", response.data);
      navigate('/');
    
    } catch (error) {
      setError(error.response?.data?.message || "Login failed. Please try again.");
      if (error.response) {
        console.error("Logion failed:", error.response.data.message || error.response.data);
      } else {
        console.error("Error during Login:", error.message);
      }
    }
    console.log(formData);
    // Perform validation and submit
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-800">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold text-center mb-2">Login</h2>
        <p className="text-gray-500 text-center mb-6">
          Login into account.
        </p>

        {error && <p className="text-red-600 mb-4">{error}</p>}

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

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded"
        >
            Submit
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          Dont't have an account?{' '}
           {/* # - link for login page */}
          <Link to="/register" className="text-blue-600 underline">
            Register now
          </Link>
        </p>
      </form>
    </div>
  );
};

export default login;