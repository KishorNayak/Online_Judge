import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { fetchProblemById } from '../../services/api';
import Navbar from '../../components/Navbar';

const probleminfo = () => {
  const { id } = useParams();
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
      <div className="flex h-screen">
        <div
          id="resizable-panel"
          className="relative bg-amber-200 p-6 border-r border-gray-300 min-w-[300px] max-w-[70%] overflow-auto"
          style={{ width: panelWidth }}
        >
          <div
            onMouseDown={startResizing}
            className="absolute right-0 top-0 h-full w-2 cursor-col-resize bg-gray-400 hover:bg-gray-600 z-10"
          ></div>
          <h1 className="text-2xl font-bold mb-4">{problem.title}</h1>
          <p className="text-gray-700 mb-2"><strong>Description:</strong> {problem.discription}</p>
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
        <div className="flex-1 bg-gray-100 p-4">
          <p className="text-gray-500">Right panel (empty for now)</p>
        </div>
      </div>
    </>
  );
};

export default probleminfo;