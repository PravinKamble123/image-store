import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5003/',
  headers: {
    'Content-Type': 'application/json',
  },
});

const authenticatedApi = axios.create({
    baseURL: 'http://localhost:5003/',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  authenticatedApi.interceptors.request.use(
    (config) => {
      const user = localStorage.getItem('user');
      if (user) {
        const token = JSON.parse(user).access_token;
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
  authenticatedApi.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
  


// Helper function to set the JWT token in headers for authenticated routes
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Auth API calls
export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

// Task API calls
export const createTask = async (taskData) => {
  const response = await authenticatedApi.post('tasks/add', taskData);
  return response.data;
};

export const getTasks = async () => {
  const response = await authenticatedApi.get('/tasks/');
  return response.data.tasks;
};

export const updateTask = async (taskId, taskData) => {
  const response = await authenticatedApi.put(`/tasks/${taskId}`, taskData);
  return response.data;
};

export const deleteTask = async (taskId) => {
  const response = await authenticatedApi.delete(`/tasks/${taskId}`);
  return response.data;
};

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await authenticatedApi.post('/images/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// Get all images
export const getImages = async () => {
  const response = await authenticatedApi.get('/images/images');
  return response.data.images;
};

export const viewImage = async (image_id) => {
  try {
    const response = await authenticatedApi.get(`/images/view/${image_id}`, {
      responseType: "blob", 
    });

    return URL.createObjectURL(response.data);
  } catch (error) {
    console.error("Error fetching image:", error);
    return null; 
  }
};