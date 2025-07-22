// src/components/ProblemsList.js
import React, { useState, useEffect } from 'react';
import { fetchProblems } from '../services/api';

const ProblemsList = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProblems = async () => {
      try {
        const data = await fetchProblems();
        setProblems(data);
        setError(null);
      } catch (err) {
        setError('Failed to load problems. Please try again later.');
        console.error('Error loading problems:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProblems();
  }, []);

  const handleProblemClick = (problemId) => {
    // Handle problem click - you can add your navigation logic here
    console.log('Navigate to problem:', problemId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 text-lg">Loading problems...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-red-500 text-lg font-medium">{error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Problems</h1>
        <p className="text-gray-600">Choose a problem to solve and improve your coding skills</p>
      </div>

      {/* Problems Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 font-medium text-gray-700 text-sm">
          <div className="col-span-1">Status</div>
          <div className="col-span-6">Title</div>
          <div className="col-span-2">Difficulty</div>
          <div className="col-span-3">Category</div>
        </div>

        {/* Problems List */}
        <div className="divide-y divide-gray-100">
          {problems.map((problem, index) => (
            <div 
              key={problem.id} 
              className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
              onClick={() => handleProblemClick(problem.id)}
            >
              {/* Status Column */}
              <div className="col-span-1 flex items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  problem.status === 'solved' 
                    ? 'bg-green-500 text-white' 
                    : problem.status === 'attempted'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {problem.status === 'solved' && '✓'}
                  {problem.status === 'attempted' && '○'}
                </div>
              </div>

              {/* Title Column */}
              <div className="col-span-6 flex items-center">
                <span className="text-gray-900 font-medium hover:text-blue-600 transition-colors">
                  {index + 1}. {problem.title}
                </span>
              </div>

              {/* Difficulty Column */}
              <div className="col-span-2 flex items-center">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  problem.difficulty === 'Easy' 
                    ? 'bg-green-100 text-green-800'
                    : problem.difficulty === 'Medium'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {problem.difficulty}
                </span>
              </div>

              {/* Category Column */}
              <div className="col-span-3 flex items-center">
                <span className="text-gray-600 text-sm">{problem.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-green-600">
            {problems.filter(p => p.status === 'solved').length}
          </div>
          <div className="text-gray-600">Solved</div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-yellow-600">
            {problems.filter(p => p.status === 'attempted').length}
          </div>
          <div className="text-gray-600">Attempted</div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-gray-600">
            {problems.length}
          </div>
          <div className="text-gray-600">Total Problems</div>
        </div>
      </div>
    </div>
  );
};

export default ProblemsList;
