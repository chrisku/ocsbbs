import apiClient from '@shared/core/api';

import type { AuthLoginRequest, LoginResponse } from '../../../shared/src/types';

export const login = async (request: AuthLoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>('/auth/app/login', request);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await apiClient.post('/auth/logout');
  localStorage.removeItem('token');
};

export const forgotPassword = async (email: string, clientBaseUrl: string): Promise<void> => {
  await apiClient.post('/auth/forgot-password', { email, clientBaseUrl });
};

export const resetPassword = async (
  email: string,
  token: string,
  newPassword: string
): Promise<void> => {
  await apiClient.post('/auth/reset-password', { email, token, newPassword });
};