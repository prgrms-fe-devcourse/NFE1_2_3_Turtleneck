const BASE_URL = 'http://localhost:3005';

export const fetchApi = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || '요청 처리 중 오류가 발생했습니다');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const authApi = {
  login: async (id, password) => {
    return fetchApi('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ id, password }),
    });
  },
};
