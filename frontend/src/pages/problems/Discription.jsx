import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { fetchProblemById } from '../../services/api';
import Navbar from '../../components/Navbar';
import CodeEditor from '../../components/CodeEditor';
import { deleteProblem } from '../../services/api';
import { useSelector } from 'react-redux';

const ProblemInfo = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const isadmin = useSelector((state) => state.auth.isadmin);

  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [error, setError] = useState('');
  const [panelWidth, setPanelWidth] = useState('50%');
  const [isLoading, setIsLoading] = useState(true);
  let isResizing = false;

  const startResizing = () => {
    isResizing = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', stopResizing);
  };

  const resize = (e) => {
    if (isResizing) {
      const newWidth = Math.min(Math.max(e.clientX, 300), window.innerWidth * 0.7);
      setPanelWidth(`${newWidth}px`);
    }
  };

  const stopResizing = () => {
    isResizing = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    document.removeEventListener('mousemove', resize);
    document.removeEventListener('mouseup', stopResizing);
  };

  // Handle update
  const handleUpdate = () => {
    console.log('Update problem:', id);
    try {
      navigate(`/updateproblem`, { state: { id } });
    } catch (error) {
      alert('Failed to navigate to update problem page. Please try again.');
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this problem? This action cannot be undone.')) {
      try {
        console.log('Deleting problem:', id);
        await deleteProblem(id);
        // Show success notification
        const successDiv = document.createElement('div');
        successDiv.className = 'fixed top-4 right-4 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 px-6 py-3 rounded-xl z-50';
        successDiv.textContent = 'Problem deleted successfully!';
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
          document.body.removeChild(successDiv);
          navigate('/problemlist');
        }, 2000);
      } catch (error) {
        console.error('Error deleting problem:', error);
        // Show error notification
        const errorDiv = document.createElement('div');
        errorDiv.className = 'fixed top-4 right-4 bg-red-500/20 border border-red-500/30 text-red-300 px-6 py-3 rounded-xl z-50';
        errorDiv.textContent = 'Failed to delete problem. Please try again.';
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
          document.body.removeChild(errorDiv);
        }, 3000);
      }
    }
  };

  // Go back to problem list
  const handleGoBack = () => {
    navigate('/problemlist');
  };

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setIsLoading(true);
        const res = await fetchProblemById(id);
        console.log(res);
        setProblem(res);
        setError('');
      } catch (err) {
        setError('Failed to load problem. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchProblem();
  }, [id]);

  // Loading State
  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-flex items-center gap-4 text-gray-300">
              <div className="w-8 h-8 border-3 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xl font-medium">Loading problem...</span>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Error State
  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
          <div className="text-center">
            <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-8 py-6 rounded-2xl max-w-md">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold mb-2">Error Loading Problem</h3>
              <p className="mb-4">{error}</p>
              <button
                onClick={handleGoBack}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
              >
                Back to Problems
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Problem Not Found
  if (!problem) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
          <div className="text-center">
            <div className="bg-slate-700/30 border border-slate-600/30 text-gray-300 px-8 py-6 rounded-2xl max-w-md">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold mb-2">Problem Not Found</h3>
              <p className="mb-4">The problem you're looking for doesn't exist or has been removed.</p>
              <button
                onClick={handleGoBack}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
              >
                Back to Problems
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="overflow-x-auto overflow-y-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" style={{ height: 'calc(100vh - 64px)' }}>
        <div className="flex pl-1" style={{ minWidth: '100%', height: '100%' }}>
          {/* Problem Details Panel */}
          <div
            id="resizable-panel"
            className="relative bg-slate-800/50 backdrop-blur-sm border-r border-slate-700/50 min-w-[300px] max-w-[70%] overflow-y-auto overflow-x-hidden flex-shrink-0"
            style={{ width: panelWidth }}
          >
            {/* Back Button and Action Buttons */}
            <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-20">
              {/* Back Button */}
              <button
                onClick={handleGoBack}
                className="px-4 py-2 bg-slate-600/50 hover:bg-slate-500/50 text-white text-sm rounded-xl transition-all duration-200 flex items-center space-x-2 border border-slate-500/30"
                title="Back to Problems"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back</span>
              </button>

              {/* Admin Action Buttons */}
              {isadmin && (
                <div className="flex space-x-3">
                  <button
                    onClick={handleUpdate}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm rounded-xl transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
                    title="Update Problem"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>Update</span>
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm rounded-xl transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
                    title="Delete Problem"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>

            {/* Resize Handle */}
            <div
              onMouseDown={startResizing}
              className="absolute right-0 top-0 h-full w-2 cursor-col-resize bg-gradient-to-b from-slate-600 to-slate-700 hover:from-blue-500 hover:to-purple-600 z-10 transition-all duration-200"
            ></div>

            {/* Single Unified Content Box */}
            <div className="p-8 pt-20">
              <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/30 space-y-6">
                {/* Title and Meta */}
                <div className="border-b border-slate-600/30 pb-4">
                  <h1 className="text-3xl font-bold text-white mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {problem.title}
                  </h1>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      problem.difficulty === 'Easy'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : problem.difficulty === 'Medium'
                        ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                        : 'bg-red-500/20 text-red-300 border border-red-500/30'
                    }`}>
                      {problem.difficulty}
                    </span>
                    {problem.tags && (
                      <div className="flex flex-wrap gap-1">
                        {problem.tags.map((tag, idx) => (
                          <span key={idx} className="px-2 py-1 bg-slate-600/50 text-gray-300 text-xs rounded-md border border-slate-500/30">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="text-blue-400">📋</span>
                    Description
                  </h2>
                  <p className="text-gray-300 leading-relaxed mb-6">{problem.discription}</p>
                </div>

                {/* Input Format */}
                <div>
                  <h3 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="text-green-400">📥</span>
                    Input Format
                  </h3>
                  <p className="text-gray-300 leading-relaxed mb-6">{problem.inputFormat}</p>
                </div>

                {/* Output Format */}
                <div>
                  <h3 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="text-purple-400">📤</span>
                    Output Format
                  </h3>
                  <p className="text-gray-300 leading-relaxed mb-6">{problem.outputFormat}</p>
                </div>

                {/* Sample Test Case */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="text-yellow-400">💡</span>
                    Sample Test Case
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Sample Input</h4>
                      <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600/30">
                        <code className="text-green-300 text-sm font-mono whitespace-pre-wrap">
                          {problem.sampleTestCase?.input}
                        </code>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Sample Output</h4>
                      <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600/30">
                        <code className="text-blue-300 text-sm font-mono whitespace-pre-wrap">
                          {problem.sampleTestCase?.output}
                        </code>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Test Cases */}
                {problem.testcases && problem.testcases.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <span className="text-red-400">🧪</span>
                      Test Cases ({problem.testcases.length})
                    </h3>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {problem.testcases.map((testcase, index) => (
                        <div key={index} className="bg-slate-800/30 rounded-lg p-4 border border-slate-600/20">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-semibold text-gray-400">Test Case {index + 1}</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="text-gray-400">Input:</span>
                              <code className="block text-green-300 font-mono bg-slate-900/30 p-2 rounded mt-1">
                                {testcase.input}
                              </code>
                            </div>
                            <div>
                              <span className="text-gray-400">Output:</span>
                              <code className="block text-blue-300 font-mono bg-slate-900/30 p-2 rounded mt-1">
                                {testcase.output}
                              </code>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Code Editor Panel */}
          <div className="flex-1 bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 min-w-0">
            <div className="h-full">
              <CodeEditor problemId={id} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProblemInfo;
