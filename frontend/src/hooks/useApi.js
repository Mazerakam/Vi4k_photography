import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Generic API hook
export const useApi = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get(url);
      if (response.data.success) {
        setData(response.data.data);
      } else {
        throw new Error(response.data.message || 'API request failed');
      }
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'An error occurred');
      console.error(`Error fetching ${url}:`, err);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    if (options.immediate !== false) {
      fetchData();
    }
  }, [fetchData, options.immediate]);

  return { data, loading, error, refetch: fetchData };
};

// Photographer hook
export const usePhotographer = () => {
  return useApi('/photographer');
};

// Categories hook
export const useCategories = (activeOnly = true) => {
  return useApi(`/categories?active_only=${activeOnly}`);
};

// Photos hook
export const usePhotos = (categoryId = null, page = 1, perPage = 50) => {
  const params = new URLSearchParams();
  if (categoryId) params.append('category', categoryId);
  params.append('visible_only', 'true');
  params.append('page', page.toString());
  params.append('per_page', perPage.toString());
  
  return useApi(`/photos?${params.toString()}`);
};

// Photos by category hook
export const usePhotosByCategory = (categoryId) => {
  return useApi(categoryId ? `/photos/category/${categoryId}?visible_only=true` : null, {
    immediate: !!categoryId
  });
};

// Testimonials hook
export const useTestimonials = () => {
  return useApi('/testimonials?visible_only=true');
};

// Services hook
export const useServices = (activeOnly = true) => {
  return useApi(`/services?active_only=${activeOnly}`);
};

// Contact submission hook
export const useContact = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const submitContact = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const response = await apiClient.post('/contact', formData);
      
      if (response.data.success) {
        setSuccess(true);
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to send message');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to send message';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  };

  return {
    submitContact,
    loading,
    error,
    success,
    resetState
  };
};

// Create photo hook (for future admin features)
export const useCreatePhoto = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createPhoto = async (photoData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.post('/photos', photoData);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to create photo');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to create photo';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { createPhoto, loading, error };
};

// Generic mutation hook for future use
export const useMutation = (url, method = 'POST') => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = async (data) => {
    try {
      setLoading(true);
      setError(null);

      let response;
      switch (method.toLowerCase()) {
        case 'post':
          response = await apiClient.post(url, data);
          break;
        case 'put':
          response = await apiClient.put(url, data);
          break;
        case 'delete':
          response = await apiClient.delete(url);
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }

      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Request failed');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 'Request failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
};

export default apiClient;