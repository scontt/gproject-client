import apiClient from '@/app/api/baseApi';
import { construct, type User } from '@/entities/api/User';

class UserService {
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get('/user/me');
    return construct(response.data);
  }
}

export const userService = new UserService();
