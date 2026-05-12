import apiClient from './client';
import { User, PagedResult, CreateUserDto, UpdateUserDto } from '../types';

export type UserFilter = 'All' | 'Active' | 'Inactive' | 'FinancialAssurance' | 'Employees' | 'LawFirm';

export const getUsers = async (
  page: number = 1,
  pageSize: number = 25,
  search?: string,
  filter: UserFilter = 'All'
): Promise<PagedResult<User>> => {
  const response = await apiClient.get<PagedResult<User>>('/users', {
    params: { page, pageSize, search, filter }
  });
  return response.data;
};

export const getUserById = async (id: number): Promise<User> => {
  const response = await apiClient.get<User>(`/users/${id}`);
  return response.data;
};

export const createUser = async (dto: CreateUserDto): Promise<User> => {
  const response = await apiClient.post<User>('/users', dto);
  return response.data;
};

export const updateUser = async (id: number, dto: UpdateUserDto): Promise<User> => {
  const response = await apiClient.put<User>(`/users/${id}`, dto);
  return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await apiClient.delete(`/users/${id}`);
};

export const updateUserRoles = async (id: number, roles: string[]): Promise<void> => {
  await apiClient.put(`/users/${id}/roles`, roles);
};