import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { fetchProblemById } from '../../services/api';
import Navbar from '../../components/Navbar';
import CodeEditor from '../../components/CodeEditor';
import { deleteProblem } from '../../services/api';

const probleminfo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [error, setError] = useState('');
  const [panelWidth, setPanelWidth] = useState('50%');
  let isResizing = false;

  const startResizing = () => {
    isResizing = true;
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
    document.removeEventListener('mousemove', resize);
    document.removeEventListener('mouseup', stopResizing);
  };

  //handle update
  const handleUpdate = () => {
    console.log('Update problem:', id);
    try{
      navigate(`/updateproblem`, {state: {id}});
    }catch(error){
      alert('Failed to navigate to update problem page. Please try again.');
    }
  };

  //handle delete
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this problem?')) {
      try {
        console.log('Deleting problem:', id);
        await deleteProblem(id);
        alert('Problem deleted successfully!');
        navigate('/problemlist');
      } catch (error) {
        console.error('Error deleting problem:', error);
        alert('Failed to delete problem. Please try again.');
      }
    }
  };

  useEffect(() => {
    const fetchProblem = async () => {
      try {
       const res = await fetchProblemById(id);
       console.log(res);
        setProblem(res);
      } catch (err) {
        setError('Failed to load problem.');
        console.error(err);
      }
    };

    if(id)fetchProblem();
  }, [id]);

  if (error) return <div className="text-red-500">{error}</div>;
  if (!problem) return <div>Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="overflow-x-auto overflow-y-hidden" style={{ height: 'calc(100vh - 64px)' }}>
        <div className="flex pl-1" style={{ minWidth: '100%', height: '100%' }}>
          <div
            id="resizable-panel"
            className="relative bg-amber-200 p-6 border-r border-gray-300 min-w-[300px] max-w-[70%] overflow-y-auto overflow-x-hidden flex-shrink-0"
            style={{ width: panelWidth }}
          >
            {/* Action Buttons */}
            <div className="absolute top-4 right-8 flex space-x-2 z-20">
              <button
                onClick={handleUpdate}
                className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-md transition-colors duration-200 flex items-center space-x-1"
                title="Update Problem"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Update</span>
              </button>
              <button
                onClick={handleDelete}
                className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded-md transition-colors duration-200 flex items-center space-x-1"
                title="Delete Problem"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Delete</span>
              </button>
            </div>

            <div
              onMouseDown={startResizing}
              className="absolute right-0 top-0 h-full w-2 cursor-col-resize bg-gray-400 hover:bg-gray-600 z-10"
            ></div>
            <h1 className="text-2xl font-bold mb-2 underline">{problem.title}</h1>
            <p className="text-gray-700 mb-2 "><strong>Description:</strong> {problem.discription}</p>
            <p className="text-gray-700 mb-2"><strong>Input Format:</strong> {problem.inputFormat}</p>
            <p className="text-gray-700 mb-2"><strong>Output Format:</strong> {problem.outputFormat}</p>
            <p className="text-gray-700 mb-2"><strong>Sample Input:</strong> {problem.sampleTestCase?.input}</p>
            <p className="text-gray-700 mb-2"><strong>Sample Output:</strong> {problem.sampleTestCase?.output}</p>
            <div className="mb-4">
              <strong>Test Cases:</strong>
              <ul className="list-disc list-inside">
                {problem.testcases?.map((testcase, index) => (
                  <li key={index}>
                    <span className="font-semibold">Input:</span> {testcase.input} | <span className="font-semibold">Output:</span> {testcase.output}
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-gray-700 mb-2"><strong>Difficulty:</strong> {problem.difficulty}</p>
            <p className="text-gray-700 mb-4"><strong>Tags:</strong> {problem.tags?.join(', ')}</p>
          </div>
          <div className="flex-1 bg-gray-100 p-4 min-w-0">
            <CodeEditor problemId={id} />
          </div>
        </div>
      </div>
    </>
  );
};

export default probleminfo;