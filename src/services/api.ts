const API_BASE = 'http://localhost:8080/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: token } : {};
};

// Auth endpoints
export const auth = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  register: async (userData: any) => {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return response.json();
  },
};

// Alumni endpoints
export const alumni = {
  getAll: async () => {
    const response = await fetch(`${API_BASE}/alumni`, {
      headers: getAuthHeader(),
    });
    return response.json();
  },

  search: async (keyword?: string, company?: string) => {
    const params = new URLSearchParams();
    if (keyword) params.append('keyword', keyword);
    if (company) params.append('company', company);
    
    const response = await fetch(`${API_BASE}/alumni/search?${params}`, {
      headers: getAuthHeader(),
    });
    return response.json();
  },
};

// Profile endpoints
export const profile = {
  getOwn: async () => {
    const response = await fetch(`${API_BASE}/profiles/me`, {
      headers: getAuthHeader(),
    });
    return response.json();
  },

  create: async (profileData: any) => {
    const response = await fetch(`${API_BASE}/profiles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(profileData),
    });
    return response.json();
  },

  update: async (id: number, profileData: any) => {
    const response = await fetch(`${API_BASE}/profiles/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(profileData),
    });
    return response.json();
  },
};

// Connection requests
export const connections = {
  send: async (alumniId: number) => {
    const response = await fetch(`${API_BASE}/requests/send/${alumniId}`, {
      method: 'POST',
      headers: getAuthHeader(),
    });
    return response.json();
  },

  getReceived: async () => {
    const response = await fetch(`${API_BASE}/requests/received`, {
      headers: getAuthHeader(),
    });
    return response.json();
  },
};

// Forum endpoints
export const forum = {
  getAllPosts: async () => {
    const response = await fetch(`${API_BASE}/forum`, {
      headers: getAuthHeader(),
    });
    return response.json();
  },

  createPost: async (postData: any) => {
    const response = await fetch(`${API_BASE}/forum`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(postData),
    });
    return response.json();
  },
};

// Chatbot endpoints
export const chatbot = {
  getQuestions: async () => {
    const response = await fetch(`${API_BASE}/chatbot/questions`);
    return response.json();
  },

  ask: async (question: string) => {
    const response = await fetch(`${API_BASE}/chatbot/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });
    return response.json();
  },
};