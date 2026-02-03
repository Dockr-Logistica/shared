import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  company_id: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface UserResponse {
  id: string;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
  company_id: string;
  created_at: string;
  updated_at: string;
}

const authService = {
  async login(credentials: LoginCredentials): Promise<TokenResponse> {
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    const response = await axios.post<TokenResponse>(
      `${API_URL}/auth/login`,
      formData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    return response.data;
  },

  async register(data: RegisterData): Promise<UserResponse> {
    const response = await axios.post<UserResponse>(
      `${API_URL}/auth/register`,
      data
    );
    return response.data;
  },

  async getMe(token: string): Promise<UserResponse> {
    const response = await axios.get<UserResponse>(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  setToken(token: string) {
    localStorage.setItem('auth_token', token);
    document.cookie = `auth_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}`;
  },

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  },

  removeToken() {
    localStorage.removeItem('auth_token');
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  },

  logout() {
    this.removeToken();
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await axios.post(`${API_URL}/auth/forgot-password`, {
      email,
    });
    return response.data;
  },

  async resetPassword(
    token: string,
    newPassword: string
  ): Promise<{ message: string }> {
    const response = await axios.post(`${API_URL}/auth/reset-password`, {
      token,
      new_password: newPassword,
    });
    return response.data;
  },

  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<{ message: string }> {
    const token = this.getToken();
    if (!token) {
      throw new Error('Usuário não autenticado');
    }

    const response = await axios.post(
      `${API_URL}/auth/change-password`,
      {
        current_password: currentPassword,
        new_password: newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },
};

export default authService;
