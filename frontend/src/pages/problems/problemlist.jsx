import React, { useState, useEffect } from 'react';
import { fetchProblems } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { useSelector } from 'react-redux';

const ProblemsList = () => {
  const isadmin = useSelector((state) => state.auth.isadmin);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [tags, setTags] = useState('');

  const loadProblems = async () => {
    try {
      setLoading(true);
      const queryParams = {};

      if (search.trim()) queryParams.search = search;
      if (difficulty) queryParams.difficulty = difficulty;
      if (tags.trim()) queryParams.tags = tags;

      const queryString = new URLSearchParams(queryParams).toString();
      const response = await fetchProblems(queryString);
      setProblems(response);
      setError(null);
    } catch (err) {
      console.error('Error loading problems:', err);
      setError('Failed to load problems. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProblems();
  }, []);

  const handleFilter = () => {
    loadProblems();
  };

  const navigate = useNavigate();
  const handleProblemClick = (problemId) => {
    console.log('Navigate to problem:', problemId);
    navigate(`/problems/${problemId}`);
  };

  const handlecreateproblem = () => {
    navigate('/createproblem');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Problem Set
            </h1>
            <p className="text-gray-300 text-lg">Master algorithms and data structures with our curated problems</p>
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                {problems.length} Problems Available
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                Real-time Judging
              </span>
            </div>
          </div>
          
          {/* Create Problem Button */}
          {isadmin && (
            <button
              onClick={handlecreateproblem}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <span className="text-lg">+</span>
              Create Problem
            </button>
          )}
        </div>

        {/* Filters Section */}
        <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-xl mb-8 border border-slate-700/50">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="text-blue-400">🔍</span>
            Search & Filter
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Search by Title</label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="e.g., Two Sum, Binary Search..."
              />
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                <option value="">All Levels</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            {/* Tags Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="array, dp, math..."
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={handleFilter}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
            >
              Apply Filters
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center gap-3 text-gray-300">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
              <span className="text-lg">Loading problems...</span>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="text-red-400 text-lg bg-red-400/10 border border-red-400/20 rounded-xl p-6 inline-block">
              {error}
            </div>
          </div>
        ) : (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-700/50 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-700/50 border-b border-slate-600/50 font-medium text-gray-300 text-sm">
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-6">Problem Title</div>
              <div className="col-span-2">Difficulty</div>
              <div className="col-span-3">Tags</div>
            </div>

            {/* Problem List */}
            <div className="divide-y divide-slate-700/30">
              {problems.map((problem, index) => (
                <div
                  key={problem._id}
                  className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-slate-700/30 cursor-pointer transition-all duration-200 group border-l-4 border-transparent hover:border-l-blue-400"
                  onClick={() => handleProblemClick(problem._id)}
                >
                  <div className="col-span-1 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 text-gray-300 flex items-center justify-center text-sm font-bold group-hover:from-blue-500 group-hover:to-purple-600 group-hover:text-white transition-all duration-200">
                      {index + 1}
                    </div>
                  </div>
                  
                  <div className="col-span-6 flex items-center">
                    <span className="text-white font-medium group-hover:text-blue-300 transition-colors duration-200">
                      {problem.title}
                    </span>
                  </div>
                  
                  <div className="col-span-2 flex items-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      problem.difficulty === 'Easy'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : problem.difficulty === 'Medium'
                        ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                        : 'bg-red-500/20 text-red-300 border border-red-500/30'
                    }`}>
                      {problem.difficulty}
                    </span>
                  </div>
                  
                  <div className="col-span-3 flex items-center">
                    <div className="flex flex-wrap gap-1">
                      {Array.isArray(problem.tags) && problem.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 bg-slate-600/50 text-gray-300 text-xs rounded-md border border-slate-500/30">
                          {tag}
                        </span>
                      ))}
                      {Array.isArray(problem.tags) && problem.tags.length > 3 && (
                        <span className="px-2 py-1 bg-slate-600/50 text-gray-400 text-xs rounded-md border border-slate-500/30">
                          +{problem.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {problems.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-medium text-gray-300 mb-2">No problems found</h3>
                <p>Try adjusting your search criteria or filters</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Decorative Elements */}
      <div className="fixed top-20 left-10 w-20 h-20 bg-blue-400/5 rounded-full blur-xl -z-10"></div>
      <div className="fixed bottom-20 right-10 w-32 h-32 bg-purple-400/5 rounded-full blur-xl -z-10"></div>
    </div>
  );
};

export default ProblemsList;
