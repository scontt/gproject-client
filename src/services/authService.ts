import apiClient from '@/app/api/baseApi';

class AuthService {
  async login(username: string, password: string): Promise<string | undefined> {
    const body = {
      username,
      password,
    };

    const response = await apiClient.post('/auth/login', body);
    return response.data?.accessToken;
  }

  async register(username: string, password: string): Promise<void> {
    const body = {
      username,
      password,
    };

    await apiClient.post('/auth/register', body);
  }

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  }
}

export const authService = new AuthService();
