import { useCallback } from 'react';
import axios from 'axios';
import { useAPI } from './useAPI';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

interface LoginCredentials {
  username: string;
  password: string;
}

interface TokenResponse {
  access_token: string;
  token_type: string;
}

function setToken(token: string) {
  if (typeof window === 'undefined') return;

  localStorage.setItem('auth_token', token);
  document.cookie = `auth_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}`;
}

export function useLogin() {
  const { execute, data, error, loading, reset } = useAPI<TokenResponse>();

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      const formData = new URLSearchParams();
      formData.append('username', credentials.username);
      formData.append('password', credentials.password);

      const result = await execute(async () => {
        const response = await axios.post<TokenResponse>(
          `${API_URL}/auth/login`,
          formData.toString(),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        );
        return response.data;
      });

      if (result?.access_token) {
        setToken(result.access_token);
      }

      return result;
    },
    [execute]
  );

  return { login, data, error, loading, reset };
}
