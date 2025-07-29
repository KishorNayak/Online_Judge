import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const CodeEditor = ({ problemId }) => {
  const [code, setCode] = useState('// Write your code here\n');
  const [language, setLanguage] = useState('cpp');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [fontSize, setFontSize] = useState(14);
  const textareaRef = useRef(null);

  const languages = [
    { value: 'cpp', label: 'C++', template: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your code here\n    return 0;\n}' },
    { value: 'python', label: 'Python', template: '# Write your Python code here\n' },
    { value: 'java', label: 'Java', template: 'public class Solution {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}' }
  ];

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    const template = languages.find(lang => lang.value === newLanguage)?.template || '';
    setCode(template);
  };


  // handle run 
    const handleRun = async () => {
    if (!code.trim()) {
      alert('Please write some code before running!');
      return;
    }

    setIsSubmitting(true);
    setResult(null);

    try {
      const response = await axios.post('http://localhost:5000/compiler/run', {
        code,
        language,
        input: ''
      });

      setResult({ verdict: 'OUTPUT', message: response.data.output });
    } catch (error) {
      console.error('Run error:', error);
      setResult({
        verdict: 'ERROR',
        message: 'Failed to run code. Please try again.',
        error: error.response?.data?.message || error.message
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  //handle submit
  const handleSubmit = async () => {
    if (!code.trim()) {
      alert('Please write some code before submitting!');
      return;
    }

    setIsSubmitting(true);
    setResult(null);

    try {
      const response = await axios.post('http://localhost:5000/submit', {
        code,
        language,
        problemId
      });

      setResult(response.data);
    } catch (error) {
      console.error('Submission error:', error);
      setResult({
        verdict: 'ERROR',
        message: 'Failed to submit code. Please try again.',
        error: error.response?.data?.message || error.message
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      setCode(newCode);
      
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 4;
      }, 0);
    }
  };

  const getVerdictColor = (verdict) => {
    switch (verdict) {
      case 'ACCEPTED': return 'text-green-600 bg-green-50 border-green-200';
      case 'WRONG ANSWER': return 'text-red-600 bg-red-50 border-red-200';
      case 'TIME LIMIT EXCEEDED': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'RUNTIME ERROR': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'COMPILATION ERROR': return 'text-purple-600 bg-purple-50 border-purple-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-4">
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {languages.map(lang => (
              <option key={lang.value} value={lang.value}>{lang.label}</option>
            ))}
          </select>
          
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Font Size:</label>
            <select
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={12}>12px</option>
              <option value={14}>14px</option>
              <option value={16}>16px</option>
              <option value={18}>18px</option>
            </select>
          </div>
        </div>

        {/* run buttom */}
        <button
          onClick={handleRun}
          disabled={isSubmitting}
          className={`px-6 py-2 rounded-md font-medium transition-colors ${
            isSubmitting
              ? 'bg-gray-300 cursor-not-allowed text-white'
              : 'bg-gray-600 hover:bg-gray-700 text-white'
          }`}
        >
          {isSubmitting ? 'Running...' : 'Run Code'}
        </button>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`px-6 py-2 rounded-md font-medium transition-colors ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Code'}
        </button>
      </div>

      {/* Code Editor */}
<div className="flex-1 relative flex bg-white">
  {/* Line numbers sidebar */}
  <div
    className="border-r border-gray-300 text-gray-400 font-mono text-right py-4 px-3 select-none bg-gray-50"
    style={{
      width: '48px',
      fontSize: `${fontSize}px`,
      lineHeight: '1.5',
    }}
  >
    {code.split('\n').map((_, index) => (
      <div key={index}>{index + 1}</div>
    ))}
  </div>

  {/* Textarea editor */}
  <textarea
    ref={textareaRef}
    value={code}
    onChange={(e) => setCode(e.target.value)}
    onKeyDown={handleKeyDown}
    spellCheck={false}
    className="w-full h-full p-4 font-mono resize-none focus:outline-none border-none"
    style={{
      fontSize: `${fontSize}px`,
      lineHeight: '1.5',
      tabSize: 4,
    }}
    placeholder="Write your code here..."
  />
</div>


      {/* Results Panel */}
      {result && (
        <div className="border-t border-gray-200 p-4 bg-gray-50 max-h-64 overflow-y-auto">
          <div className={`p-3 rounded-md border ${getVerdictColor(result.verdict)}`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-lg">{result.verdict}</h3>
              {result.score !== undefined && (
                <span className="text-sm font-medium">
                  Score: {result.score}% ({result.passedTests}/{result.totalTests})
                </span>
              )}
            </div>
            <p className="text-sm mb-2">{result.message}</p>
            
            {result.testResults && result.testResults.length > 0 && (
              <div className="mt-3">
                <h4 className="font-medium mb-2">Test Case Results:</h4>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {result.testResults.map((test, index) => (
                    <div key={index} className="text-xs p-2 bg-white rounded border">
                      <span className={`font-medium ${test.passed ? 'text-green-600' : 'text-red-600'}`}>
                        Test {index + 1}: {test.passed ? 'PASSED' : 'FAILED'}
                      </span>
                      {!test.passed && test.error && (
                        <div className="mt-1 text-red-600">{test.error}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {result.error && (
              <div className="mt-2 p-2 bg-red-100 border border-red-200 rounded text-red-700 text-sm">
                <strong>Error:</strong> {result.error}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
