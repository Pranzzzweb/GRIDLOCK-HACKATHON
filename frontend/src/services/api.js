const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

class APIClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
    this.timeout = 30000;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (config.method === 'POST' && options.data && !(options.data instanceof FormData)) {
      config.body = JSON.stringify(options.data);
    } else if (options.data instanceof FormData) {
      config.body = options.data;
      delete config.headers['Content-Type'];
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new APIError(
          `API Error: ${response.status}`,
          response.status,
          await response.json().catch(() => ({}))
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError(
        error.message || 'Network error occurred',
        0,
        { originalError: error }
      );
    }
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, data, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST', data });
  }

  put(endpoint, data, options = {}) {
    return this.request(endpoint, { ...options, method: 'PUT', data });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

class APIError extends Error {
  constructor(message, status, responseData) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.responseData = responseData;
  }
}

const apiClient = new APIClient();

export default apiClient;
export { APIError, APIClient };
