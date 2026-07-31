import { apiClient } from './apiClient';
import type { User } from '../types';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const data = await apiClient.post<LoginResponse>('/auth/login', credentials);
    localStorage.setItem('minikin_auth_token', data.token);
    return data;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      localStorage.removeItem('minikin_auth_token');
    }
  },

  async getMe(): Promise<User> {
    return apiClient.get<User>('/auth/me');
  },
};
