import client from './client';
import { ApiResponse, User } from '../types';

interface AuthData {
  token: string;
  user: User;
}

export const authApi = {
  login: (email: string, password: string) =>
    client.post<ApiResponse<AuthData>>('/auth/login', { email, password }),

  signup: (name: string, email: string, password: string) =>
    client.post<ApiResponse<AuthData>>('/auth/signup', { name, email, password }),

  logout: () => client.delete('/auth/logout'),

  me: () => client.get<ApiResponse<User>>('/auth/me'),
};
