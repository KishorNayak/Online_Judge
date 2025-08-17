import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Editor from '@monaco-editor/react';

const CodeEditor = ({ problemId }) => {
  // Get API URL from environment variable
  const API = import.meta.env.VITE_COMPILER_URL;
  
  const [language, setLanguage] = useState('cpp');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isreviewing, setIsReviewing] = useState(false);
  const [review, setReview] = useState(null);
  const [result, setResult] = useState(null);
  const [fontSize, setFontSize] = useState(14);
  const [customInput, setCustomInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [bottomPanelHeight, setBottomPanelHeight] = useState(200);
  const [isResizing, setIsResizing] = useState(false);
  
  const languages = [
    { 
      value: 'cpp', 
      label: 'C++', 
      monacoLang: 'cpp',
      template: '#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    // Your code here\n    return 0;\n}' 
    },
    { 
      value: 'python', 
      label: 'Python', 
      monacoLang: 'python',
      template: '# Write your Python code here\ndef main():\n    pass\n\nif __name__ == "__main__":\n    main()' 
    },
    { 
      value: 'java', 
      label: 'Java', 
      monacoLang: 'java',
      template: 'import java.util.*;\nimport java.io.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Your code here\n    }\n}' 
    }
  ];
  
  //get the localstorage code
  const local_storage_key = `problem_${problemId}_${language}`;
  useEffect(() => {
    const saved = localStorage.getItem(local_storage_key);
    if (saved !== null) setCode(saved);
  }, [local_storage_key]);
  
  

  // Initialize code with C++ template
  const [code, setCode] = useState(languages[0].template);

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

    setIsRunning(true);
    setResult(null);

    try {
      const response = await axios.post(`${API}/compiler/run`, {
        code,
        language,
        input: customInput
      });

      setResult({ verdict: 'OUTPUT', message: response.data.output, isCustomRun: true });
    }catch (error) {
  const errMsg =
    error.response?.data?.details?.stderr || // compiler output
    error.response?.data?.message ||         // general backend message
    error.response?.data?.error ||           // backend "error" field
    error.message;                           // Axios default

  console.error('Run error:', errMsg);

  setResult({
    verdict: 'ERROR',
    message: 'Failed to run code. Please try again.',
    error: errMsg,
    isCustomRun: true
  });
}finally {
      setIsRunning(false);
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
    const id = problemId;
    try {
      const response = await axios.post(`${API}/compiler/submit`, {
        code,
        language,
        id
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

  //handle code review
  const handlecodereview = async () => {
    if (!code.trim()) {
      alert('Please write some code before requesting a review!');
      return;
    }

    setIsReviewing(true);
    setReview(null);
    try{
      const response = await axios.post(`${API}/compiler/ai-review`, {code});
      setReview({
        verdict: 'REVIEW_COMPLETE',
        message: 'Code review completed successfully',
        review: response.data.review,
        isCodeReview: true
      });
    } catch (error) {
      console.error('Review error:', error);
      setReview({
        verdict: 'ERROR',
        message: 'Failed to review code. Please try again.',
        error: error.response?.data?.message || error.message,
        isCodeReview: true
      });
    } finally {
      setIsReviewing(false);
    }
  }

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

  const handleScroll = (e) => {
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = e.target.scrollTop;
    }
  };

  return (
    <div className="flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" style={{ height: '100%', width: '100%', flex: 1, overflow: 'hidden' }}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b text-white">
        <div className="flex items-center gap-3">
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

        {/* Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRun}
            disabled={isSubmitting || isRunning}
            className={`px-2 py-2 rounded-md font-medium transition-colors ${
              isSubmitting || isRunning
                ? 'bg-gray-300 cursor-not-allowed text-white'
                : 'bg-gray-600 hover:bg-gray-700 text-white'
            }`}
          >
            {isRunning ? 'Running...' : 'Run Code'}
          </button>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting || isRunning}
            className={`px-2 py-2 rounded-md font-medium transition-colors  ${
              isSubmitting || isRunning
                ? 'bg-gray-400 cursor-not-allowed text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Code'}
          </button>

          <button
            onClick={handlecodereview}
            disabled={isreviewing || isRunning || isSubmitting}
            className={`px-2 py-2 rounded-md font-medium transition-colors border border-black-300 ${
              isSubmitting || isRunning || isreviewing
                ? 'bg-gray-400 cursor-not-allowed text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isreviewing ? 'Reviewing...' : 'Code Review'}
          </button>
        </div>
      </div>

      {/* Code Editor */}
      <div className="flex-1 relative flex bg-white" style={{ 
        height: result && !result.isCustomRun ? 'calc(100% - 80px)' : `calc(100% - 80px - ${bottomPanelHeight}px)`,
        overflow: 'hidden'
      }}>
        {/* Monaco Editor */}
        <div className="w-full h-full">
          <Editor
            height="100%"
            language={languages.find(lang => lang.value === language)?.monacoLang || 'cpp'}
            value={code}
            onChange={(value) => { setCode(value || ''); localStorage.setItem(local_storage_key, value); }}
            theme="vs-dark"
            options={{
              fontSize: fontSize,
              fontFamily: 'Consolas, "Courier New", monospace',
              lineHeight: 1.5,
              tabSize: 4,
              insertSpaces: true,
              detectIndentation: false,
              automaticLayout: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              lineNumbers: 'on',
              glyphMargin: false,
              folding: true,
              lineDecorationsWidth: 0,
              lineNumbersMinChars: 3,
              renderLineHighlight: 'line',
              selectOnLineNumbers: true,
              roundedSelection: false,
              readOnly: false,
              cursorStyle: 'line',
              // Scrolling options
              scrollbar: {
                vertical: 'visible',
                horizontal: 'visible',
                useShadows: false,
                verticalHasArrows: false,
                horizontalHasArrows: false,
                verticalScrollbarSize: 14,
                horizontalScrollbarSize: 14
              },
              // IntelliSense and autocomplete settings
              suggestOnTriggerCharacters: true,
              acceptSuggestionOnEnter: 'on',
              tabCompletion: 'on',
              wordBasedSuggestions: true,
              // Syntax highlighting
              colorDecorators: true,
              // Bracket matching
              matchBrackets: 'always',
              autoClosingBrackets: 'always',
              autoClosingQuotes: 'always',
              autoSurround: 'languageDefined',
              // Error squiggles
              renderValidationDecorations: 'on'
            }}
            loading={<div className="flex items-center justify-center h-full text-gray-500">Loading editor...</div>}
          />
        </div>
      </div>

      {/* Resizer - Only show when verdict is not displayed */}
      {!(result && !result.isCustomRun && review && !review.isCodeReview && result?.error && result.isCustomRun) && (
        <div
          className={`h-1 bg-gray-200 cursor-row-resize hover:bg-blue-400 transition-colors select-none ${
            isResizing ? 'bg-blue-500' : ''
          }`}
          onMouseDown={(e) => {
            e.preventDefault();
            setIsResizing(true);
            const startY = e.clientY;
            const startHeight = bottomPanelHeight;

            // Prevent text selection during resize
            document.body.style.userSelect = 'none';
            document.body.style.webkitUserSelect = 'none';
            document.body.style.msUserSelect = 'none';

            const handleMouseMove = (e) => {
              e.preventDefault();
              const deltaY = startY - e.clientY;
              const newHeight = Math.min(Math.max(startHeight + deltaY, 100), 400);
              setBottomPanelHeight(newHeight);
            };

            const handleMouseUp = () => {
              setIsResizing(false);
              
              // Re-enable text selection
              document.body.style.userSelect = '';
              document.body.style.webkitUserSelect = '';
              document.body.style.msUserSelect = '';
              
              document.removeEventListener('mousemove', handleMouseMove);
              document.removeEventListener('mouseup', handleMouseUp);
            };

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
          }}
        />
      )}

      {/* Bottom Input/Output Panel - Only show when verdict and code review is not displayed */}
      {!(result && !result.isCustomRun && review && !review.isCodeReview && result?.error && result.isCustomRun) && (
        <div 
          className="border-t flex text-white"
          style={{ height: `${bottomPanelHeight}px` }}
        >
          {/* Input Section */}
          <div className="flex-1 p-4 border-r border-gray-200">
            <h4 className="font-medium text-gray-700 mb-2">Custom Input</h4>
            <textarea
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="sample input"
              className="w-full p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              style={{ height: `${bottomPanelHeight - 80}px` }}
            />
          </div>

          {/* Output Section */}
          <div className="flex-1 p-4 border-r border-gray-200">
            <h4 className="font-medium text-gray-700 mb-2">Output</h4>
            <div 
              className="w-full p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              style={{ height: `${bottomPanelHeight - 80}px` }}
            >
              {result && result.isCustomRun ? (
                <div className={result.verdict === 'OUTPUT' ? 'text-white' : 'text-red-600'}>
                  {result.verdict === 'OUTPUT' ? result.message : `Error: ${result.message}`}
                </div>
              ) : (
                <div className="text-gray-400 italic">Output</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Error Panel for Custom Run */}
      {result?.error && result.isCustomRun && (
        <div
          className="fixed left-0 right-0 z-30"
          style={{
            bottom: 0,
            // anchor to bottom of container, not window: use relative parent with overflow hidden
            position: 'absolute',
            height: '250px',
            transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
            transform: result?.error && result.isCustomRun ? 'translateY(0)' : 'translateY(100%)',
            pointerEvents: 'auto'
          }}
        >
          <div className="bg-red-50 border-t-2 border-red-400 h-full w-full shadow-lg flex flex-col">
            <div className="flex items-center justify-between px-4 py-2 border-b border-red-200">
              <h4 className="font-bold text-red-700 text-base">Error Output</h4>
              <button
                className="text-red-400 hover:text-red-600 p-1 rounded transition-colors"
                onClick={() => setResult(null)}
                title="Close error panel"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-2">
              <pre className="font-mono text-sm text-red-800 whitespace-pre-wrap break-all">
                {result.error || result.message}
              </pre>
            </div>
          </div>
        </div>
      )}


      {/* Submission Results Panel */}
      {result && !result.isCustomRun && (
        <div className="border-t border-gray-200 p-4 bg-gray-50" style={{ maxHeight: '300px', overflowY: 'auto', flexShrink: 0 }}>
          <div className={`p-3 rounded-md border ${getVerdictColor(result.verdict)}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-4">
                <h3 className="font-bold text-lg">{result.verdict}</h3>
                {result.score !== undefined && (
                  <span className="text-sm font-medium">
                    Score: {result.score}% ({result.passedTests}/{result.totalTests})
                  </span>
                )}
              </div>
              <button
                onClick={() => setResult(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-100"
                title="Close results"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-sm mb-2">{result.message}</p>
            
            {result.testResults && result.testResults.length > 0 && (
              <div className="mt-3">
                <h4 className="font-medium mb-2">Test Case Results:</h4>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {result.testResults.map((test, index) => (
                    <div key={index} className="text-xs p-2 bg-white rounded border">
                      <span className={`font-medium ${test.status === 'PASSED' ? 'text-green-600' : 'text-red-600'}`}>
                        Test {index + 1}: {test.status === 'PASSED' ? 'PASSED' : 'FAILED'}
                      </span>
                      {test.status !== 'PASSED' && test.error && (
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

      {/* Code Review Results Panel */}
      {review && review.isCodeReview && (
        <div className="border-t border-gray-200 p-4 bg-blue-50" style={{ maxHeight: '320px', overflowY: 'auto', flexShrink: 0 }}>
          <div className={`p-3 rounded-md border ${
            review.verdict === 'ERROR' 
              ? 'bg-red-50 border-red-200 text-red-800' 
              : 'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-4">
                <h3 className="font-bold text-lg flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  {review.verdict === 'ERROR' ? 'Review Error' : 'AI Code Review'}
                </h3>
              </div>
              <button
                onClick={() => setReview(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-100"
                title="Close review"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {review.verdict === 'ERROR' ? (
              <div className="space-y-2">
                <p className="text-sm font-medium">{review.message}</p>
                {review.error && (
                  <div className="p-2 bg-red-100 border border-red-200 rounded text-red-700 text-sm">
                    <strong>Error:</strong> {review.error}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm font-medium text-blue-700">{review.message}</p>
                <div className="bg-white p-4 rounded-md border border-blue-200 shadow-sm">
                  <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Review Feedback:
                  </h4>
                  <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {review.review}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;