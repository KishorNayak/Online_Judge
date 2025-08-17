import React, { useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;
function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    //starting the backend server
    const res = axios.get(`${API}/`);
  });

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        
        {/* Main Content */}
        <div className="container mx-auto px-6 pt-20 pb-16">
          
          {/* Hero Text */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Code. <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Compete.</span> Conquer.
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Master algorithms, solve challenging problems, and compete with developers worldwide on my online judge platform.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Real-time Judging
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                Multiple Languages
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                AI-code review
              </span>
            </div>
          </div>

          {/* Action Cards */}
          <div className="flex flex-col lg:flex-row justify-center items-center gap-8 max-w-6xl mx-auto">
            
            {/* Problem List Card */}
              <div className="relative w-80 h-64 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-3xl border border-blue-500/20" 
              onClick={() => navigate('/problemlist')}>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-transparent rounded-2xl"></div>
                <div className="relative z-10">
                  <div className="text-4xl mb-4">🧩</div>
                  <h3 className="text-2xl font-bold text-white mb-3">Problem Set</h3>
                  <p className="text-blue-100 mb-6 leading-relaxed">
                    Explore curated coding challenges from beginner to expert level
                  </p>
                  <div className="flex justify-between items-center text-sm text-blue-200">
                    <span>Curated Problems</span>
                    <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
                  </div>
                </div>
              </div>

            {/* Contests Card */}
              <div className="relative w-80 h-64 bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-8 shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-3xl border border-purple-500/20"
              onClick={() => navigate('/contests')}>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-transparent rounded-2xl"></div>
                <div className="relative z-10">
                  <div className="text-4xl mb-4">🏆</div>
                  <h3 className="text-2xl font-bold text-white mb-3">Contests</h3>
                  <p className="text-purple-100 mb-6 leading-relaxed">
                    Participate in weekly contests and climb the global leaderboard
                  </p>
                  <div className="flex justify-between items-center text-sm text-purple-200">
                    <span>Weekly Events</span>
                    <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
                  </div>
                </div>
              </div>

          </div>

          {/* Stats Section */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">AI</div>
              <div className="text-gray-400">Gemini</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">Beginner</div>
              <div className="text-gray-400">Friendly</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">3</div>
              <div className="text-gray-400">Languages</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-gray-400">Online Judge</div>
            </div>
          </div>

        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-400/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-400/10 rounded-full blur-xl"></div>
      </div>
    </>
  )
}

export default Home
