import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ViewImage from './component/ViewImage';
import UploadImage from './component/UploadImageModal';
import Dashboard from './component/Dashboard';
import AuthForm from './component/AuthForm';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.is_authenticated) {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    const axiosInstance = axios.create();

    axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const refreshToken = localStorage.getItem('refresh_token');
            const { data } = await axios.post('/auth/refresh', { refresh_token: refreshToken });
            localStorage.setItem('access_token', data.access_token);

            axios.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;
            return axios(originalRequest);
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            setIsAuthenticated(false);
            localStorage.clear();
          }
        }
        return Promise.reject(error);
      }
    );
  }, []);

  return (
    <Router>
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<AuthForm isLogin={true} />} />
          <Route path="/register" element={<AuthForm isLogin={false} />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<UploadImage />} />
          <Route path="/view/:id" element={<ViewImage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
