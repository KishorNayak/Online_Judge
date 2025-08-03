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

export const updateProblem = async (id, updatedProblem) => {
  try {
    const res = await axios.put(`${API}/api/problems/updateproblem/${id}`, updatedProblem);
    return res.data;
  } catch (error) {
    console.log('API error while updating problem:', error);
    throw error;
  }
};

export const deleteProblem = async (id) => {
  try {
    const res = await axios.delete(`${API}/api/problems/deleteproblem/${id}`);
    return res.data;
  } catch (error) {
    console.log('API error while deleting problem:', error);
    throw error;
  }
};