import apiClient from './client';
import type { UserCompanyDto, PagedResult } from '../types';

export const getUserCompanies = async (
  page: number = 1,
  pageSize: number = 25,
  search?: string,
): Promise<PagedResult<UserCompanyDto>> => {
  const response = await apiClient.get<PagedResult<UserCompanyDto>>('/usercompanies', {
    params: { page, pageSize, search }
  });
  return response.data;
};

export const getUserCompanyById = async (id: number): Promise<UserCompanyDto> => {
  const response = await apiClient.get<UserCompanyDto>(`/usercompanies/${id}`);
  return response.data;
}

export const createUserCompany = async (name: string): Promise<UserCompanyDto> => {
  const response = await apiClient.post<UserCompanyDto>('/usercompanies', JSON.stringify(name));
  return response.data;
};

export const updateUserCompany = async (id: number, name: string): Promise<UserCompanyDto> => {
  const response = await apiClient.put<UserCompanyDto>(`/usercompanies/${id}`, JSON.stringify(name));
  return response.data;
};

export const deleteUserCompany = async (id: number): Promise<void> => {
  await apiClient.delete(`/usercompanies/${id}`);
};