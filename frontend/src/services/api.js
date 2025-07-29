import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

export const fetchProblems = async (queryString = '') => {
  console.log(`${API}/api/problems/getallproblems?${queryString}`);
  try {
    const res = await axios.get(`${API}/api/problems/getallproblems?${queryString}`);
    return res.data;
  } catch (error) {
    console.error('API error while fetching problems:', error);
    throw error;
  }
};

export const fetchProblemById = async (id) => {
  try {
    const res = await axios.get(`${API}/api/problems/getProblemById/${id}`);
    return res.data;
  } catch (error) {
    console.log('API error while fetching problemById:', error);
    throw error;
  }
};