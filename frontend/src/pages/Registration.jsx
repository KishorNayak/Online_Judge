import React, { useState } from 'react';
import axios from 'axios'
import { Link } from 'react-router-dom';
const API = import.meta.env.VITE_API_URL;

const Register = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
        try {
      const response = await axios.post(`${API}/register`, formData);
      console.log("Registration successful:", response.data);
      // Optionally, redirect or show success message
    } catch (error) {
      if (error.response) {
        console.error("Registration failed:", error.response.data.message || error.response.data);
      } else {
        console.error("Error during registration:", error.message);
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
        <h2 className="text-2xl font-semibold text-center mb-2">Register</h2>
        <p className="text-gray-500 text-center mb-6">
          Create your account.
        </p>

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
{/* 
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            name="accepted"
            checked={formData.accepted}
            onChange={handleChange}
            className="mr-2"
            required
          />
          <span className="text-sm text-gray-600">
            I accept the{' '}
            <a href="#" className="text-green-600 underline">
              Terms of Use
            </a>{' '}
            &{' '}
            <a href="#" className="text-green-600 underline">
              Privacy Policy
            </a>
            .
          </span>
        </div> */}

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded"
        >
            Submit
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