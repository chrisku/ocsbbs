import apiClient from './client';
import type { BpCompanyDto, CreateBpCompanyDto, UpdateBpCompanyDto, PagedResult } from '../types';

export const getBpCompanies = async (
  page: number = 1,
  pageSize: number = 25,
  search?: string
): Promise<PagedResult<BpCompanyDto>> => {
  const response = await apiClient.get<PagedResult<BpCompanyDto>>('/bpcompanies', {
    params: { page, pageSize, search }
  });
  return response.data;
};

export const getBpCompanyById = async (id: number): Promise<BpCompanyDto> => {
  const response = await apiClient.get<BpCompanyDto>(`/bpcompanies/${id}`);
  return response.data;
};

export const createBpCompany = async (dto: CreateBpCompanyDto): Promise<BpCompanyDto> => {
  const response = await apiClient.post<BpCompanyDto>('/bpcompanies', dto);
  return response.data;
};

export const updateBpCompany = async (id: number, dto: UpdateBpCompanyDto): Promise<BpCompanyDto> => {
  const response = await apiClient.put<BpCompanyDto>(`/bpcompanies/${id}`, dto);
  return response.data;
};

export const deleteBpCompany = async (id: number): Promise<void> => {
  await apiClient.delete(`/bpcompanies/${id}`);
};
