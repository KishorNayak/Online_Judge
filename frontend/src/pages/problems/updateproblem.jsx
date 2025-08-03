import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchProblemById, updateProblem } from '../../services/api';
import axios from 'axios';
const API = import.meta.env.VITE_API_URL;

const updateproblem = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const problemId = location.state?.id;
    
    const [formData, setFormData] = useState({
        title: '',
        discription: '',
        inputFormat: '',
        outputFormat: '',
        sampleTestCase: {
            input: '',
            output: ''
        },
        tags: [],
        difficulty: '',
        testcases: [{ input: '', output: '' }]
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Fetch problem data when component mounts
    useEffect(() => {
        const fetchProblemData = async () => {
            try {
                const problemData = await fetchProblemById(problemId);
                setFormData({
                    title: problemData.title || '',
                    discription: problemData.discription || '',
                    inputFormat: problemData.inputFormat || '',
                    outputFormat: problemData.outputFormat || '',
                    sampleTestCase: {
                        input: problemData.sampleTestCase?.input || '',
                        output: problemData.sampleTestCase?.output || ''
                    },
                    tags: problemData.tags || [],
                    difficulty: problemData.difficulty || '',
                    testcases: problemData.testcases || [{ input: '', output: '' }]
                });
            } catch (error) {
                console.error('Error fetching problem:', error);
                setError('Failed to load problem data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProblemData();
    }, [problemId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'tags') {
            // Convert comma-separated string to array
            const tagsArray = value.split(',').map(tag => tag.trim()).filter(tag => tag);
            setFormData(prev => ({
                ...prev,
                [name]: tagsArray
            }));
        } else if (name === 'sampleInput') {
            setFormData(prev => ({
                ...prev,
                sampleTestCase: { ...prev.sampleTestCase, input: value }
            }));
        } else if (name === 'sampleOutput') {
            setFormData(prev => ({
                ...prev,
                sampleTestCase: { ...prev.sampleTestCase, output: value }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleTestCaseChange = (index, field, value) => {
        const newTestCases = [...formData.testcases];
        newTestCases[index][field] = value;
        setFormData(prev => ({ ...prev, testcases: newTestCases }));
    };

    const addTestCase = () => {
        setFormData(prev => ({
            ...prev,
            testcases: [...prev.testcases, { input: '', output: '' }]
        }));
    };

    const removeTestCase = (index) => {
        if (formData.testcases.length > 1) {
            const newTestCases = formData.testcases.filter((_, i) => i !== index);
            setFormData(prev => ({ ...prev, testcases: newTestCases }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        setSuccess('');

        try {
            const response = await updateProblem(problemId, formData);
            console.log("Problem updated successfully:", response);
            setSuccess('Problem updated successfully!');
            
            // Navigate back to problem description after successful update
            setTimeout(() => {
                navigate(`/problems/${problemId}`);
            }, 1500);

        } catch (error) {
            if (error.response) {
                setError(error.response.data.message || 'Failed to update problem');
            } else {
                setError('Network error. Please try again.');
            }
            console.error("Problem update failed:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const autoResize = (e) => {
        e.target.style.height = 'auto';
        e.target.style.height = e.target.scrollHeight + 'px';
    };

    // Show loading state while fetching data
    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white rounded-xl p-10 w-full max-w-md relative shadow-xl mx-4">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading problem data...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl p-10 w-full max-w-4xl relative shadow-xl max-h-[90vh] overflow-y-auto mx-4">
                <button
                    type="button"
                    className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 text-2xl p-1 transition-colors"
                    aria-label="Close"
                    onClick={() => navigate(`/problems/${problemId}`)}
                >
                </button>
                
                <h2 className="text-center text-gray-800 text-2xl font-semibold mb-8">
                    Update Problem
                </h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {/* Title and Description */}
                    <div className="grid grid-cols-1 gap-5">
                        <input
                            type="text"
                            name="title"
                            placeholder="Problem Title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="p-4 rounded-lg bg-teal-50 text-sm placeholder-gray-500 text-gray-800 focus:bg-teal-100 transition-all outline-none"
                            required
                            minLength={3}
                        />
                        <textarea
                            name="discription"
                            placeholder="Problem Description (minimum 10 characters)"
                            value={formData.discription}
                            onChange={(e) => {
                                handleInputChange(e);
                                autoResize(e);
                            }}
                            className="p-4 rounded-lg bg-teal-50 text-sm placeholder-gray-500 text-gray-800 focus:bg-teal-100 resize-none transition-all outline-none overflow-hidden min-h-[100px]"
                            required
                            minLength={10}
                        />
                    </div>

                    {/* Input/Output Formats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <textarea
                            name="inputFormat"
                            placeholder="Input Format"
                            value={formData.inputFormat}
                            onChange={(e) => {
                                handleInputChange(e);
                                autoResize(e);
                            }}
                            className="p-4 rounded-lg bg-teal-50 text-sm placeholder-gray-500 text-gray-800 focus:bg-teal-100 resize-none transition-all outline-none overflow-hidden min-h-[80px]"
                            required
                        />
                        <textarea
                            name="outputFormat"
                            placeholder="Output Format"
                            value={formData.outputFormat}
                            onChange={(e) => {
                                handleInputChange(e);
                                autoResize(e);
                            }}
                            className="p-4 rounded-lg bg-teal-50 text-sm placeholder-gray-500 text-gray-800 focus:bg-teal-100 resize-none transition-all outline-none overflow-hidden min-h-[80px]"
                            required
                        />
                    </div>

                    {/* Sample Test Case */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <textarea
                            name="sampleInput"
                            placeholder="Sample Input"
                            value={formData.sampleTestCase.input}
                            onChange={handleInputChange}
                            className="p-4 rounded-lg bg-teal-50 text-sm placeholder-gray-500 text-gray-800 focus:bg-teal-100 resize-y min-h-[80px] transition-all outline-none"
                            required
                        />
                        <textarea
                            name="sampleOutput"
                            placeholder="Sample Output"
                            value={formData.sampleTestCase.output}
                            onChange={handleInputChange}
                            className="p-4 rounded-lg bg-teal-50 text-sm placeholder-gray-500 text-gray-800 focus:bg-teal-100 resize-y min-h-[80px] transition-all outline-none"
                            required
                        />
                    </div>

                    {/* Tags and Difficulty */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <input
                            type="text"
                            name="tags"
                            placeholder="Tags (comma-separated: array, sorting, dp)"
                            value={formData.tags.join(', ')}
                            onChange={handleInputChange}
                            className="p-4 rounded-lg bg-teal-50 text-sm placeholder-gray-500 text-gray-800 focus:bg-teal-100 transition-all outline-none"
                        />
                        <select
                            name="difficulty"
                            value={formData.difficulty}
                            onChange={handleInputChange}
                            className="p-4 rounded-lg bg-teal-50 text-sm text-gray-800 focus:bg-teal-100 transition-all outline-none"
                            required
                        >
                            <option value="">Select Difficulty</option>
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                    </div>

                    {/* Test Cases */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-lg font-medium text-gray-800">Test Cases</h3>
                        {formData.testcases.map((testCase, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="text-sm font-medium text-gray-700">
                                        Test Case {index + 1}
                                    </h4>
                                    {formData.testcases.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeTestCase(index)}
                                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <textarea
                                        placeholder={`Input for test case ${index + 1}`}
                                        value={testCase.input}
                                        onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                                        className="p-3 rounded bg-white border border-teal-200 resize-y min-h-[60px] text-sm text-gray-800 focus:bg-teal-50 outline-none focus:border-teal-400"
                                        required
                                    />
                                    <textarea
                                        placeholder={`Expected output for test case ${index + 1}`}
                                        value={testCase.output}
                                        onChange={(e) => handleTestCaseChange(index, 'output', e.target.value)}
                                        className="p-3 rounded bg-white border border-teal-200 resize-y min-h-[60px] text-sm text-gray-800 focus:bg-teal-50 outline-none focus:border-teal-400"
                                        required
                                    />
                                </div>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addTestCase}
                            className="text-sm text-blue-600 hover:text-blue-800 hover:underline self-start font-medium"
                        >
                            + Add Another Test Case
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-teal-500 hover:bg-teal-600 disabled:bg-teal-300 disabled:cursor-not-allowed text-white py-4 px-8 rounded-lg text-base font-semibold cursor-pointer transition-all self-center min-w-[120px] shadow-md hover:shadow-lg"
                    >
                        {isSubmitting ? 'Updating...' : 'Update Problem'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default updateproblem;
