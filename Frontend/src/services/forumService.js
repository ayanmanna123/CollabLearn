import { API_BASE_URL } from '../config/apiConfig';

const FORUM_API = `${API_BASE_URL}/api/forum`;

/**
 * Forum Service - Handles all forum/question related API calls
 * Easy to switch between Node.js and Java backends via apiConfig.js
 */

// Get all questions with pagination
export const getAllQuestions = async (page = 1, limit = 10, sort = '-createdAt') => {
  try {
    const url = `${FORUM_API}/questions?page=${page}&limit=${limit}&sort=${sort}`;
    console.log('📡 Fetching from:', url);
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}: Failed to fetch questions`);
    return await response.json();
  } catch (error) {
    console.error('❌ Error fetching questions:', error);
    console.error('📡 FORUM_API URL:', FORUM_API);
    throw error;
  }
};

// Get single question by ID
export const getQuestionById = async (id) => {
  try {
    const response = await fetch(`${FORUM_API}/questions/${id}`);
    if (!response.ok) throw new Error('Failed to fetch question');
    return await response.json();
  } catch (error) {
    console.error('Error fetching question:', error);
    throw error;
  }
};

// Create a new question (requires authentication)
export const createQuestion = async (questionData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${FORUM_API}/questions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(questionData)
    });
    if (!response.ok) throw new Error('Failed to create question');
    return await response.json();
  } catch (error) {
    console.error('Error creating question:', error);
    throw error;
  }
};

// Update a question (requires authentication)
export const updateQuestion = async (id, questionData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${FORUM_API}/questions/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(questionData)
    });
    if (!response.ok) throw new Error('Failed to update question');
    return await response.json();
  } catch (error) {
    console.error('Error updating question:', error);
    throw error;
  }
};

// Delete a question (requires authentication)
export const deleteQuestion = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${FORUM_API}/questions/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to delete question');
    return await response.json();
  } catch (error) {
    console.error('Error deleting question:', error);
    throw error;
  }
};

// Add an answer to a question (requires authentication)
export const answerQuestion = async (questionId, answerContent) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${FORUM_API}/questions/${questionId}/answer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ content: answerContent })
    });
    if (!response.ok) throw new Error('Failed to add answer');
    return await response.json();
  } catch (error) {
    console.error('Error adding answer:', error);
    throw error;
  }
};

// Upvote a question (requires authentication)
export const upvoteQuestion = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${FORUM_API}/questions/${id}/upvote`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to upvote question');
    return await response.json();
  } catch (error) {
    console.error('Error upvoting question:', error);
    throw error;
  }
};

// Get questions by category
export const getQuestionsByCategory = async (category, page = 1, limit = 10) => {
  try {
    const response = await fetch(`${FORUM_API}/questions/category/${category}?page=${page}&limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch questions by category');
    return await response.json();
  } catch (error) {
    console.error('Error fetching questions by category:', error);
    throw error;
  }
};

// Get questions by mentor
export const getQuestionsByMentor = async (mentorId, page = 1, limit = 10) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${FORUM_API}/mentor/${mentorId}/questions?page=${page}&limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch mentor questions');
    return await response.json();
  } catch (error) {
    console.error('Error fetching mentor questions:', error);
    throw error;
  }
};

// Search questions
export const searchQuestions = async (query, category = null, page = 1, limit = 10) => {
  try {
    let url = `${FORUM_API}/questions/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`;
    if (category) {
      url += `&category=${category}`;
    }
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to search questions');
    return await response.json();
  } catch (error) {
    console.error('Error searching questions:', error);
    throw error;
  }
};

// Get current user's questions
export const getUserQuestions = async (page = 1, limit = 10) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${FORUM_API}/questions?page=${page}&limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch user questions');
    return await response.json();
  } catch (error) {
    console.error('Error fetching user questions:', error);
    throw error;
  }
};
