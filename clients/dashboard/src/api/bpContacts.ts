import apiClient from './client';
import type { BpContactDto, CreateBpContactDto, UpdateBpContactDto, PagedResult } from '../types';

export const getBpContacts = async (
  page: number = 1,
  pageSize: number = 25,
  search?: string
): Promise<PagedResult<BpContactDto>> => {
  const response = await apiClient.get<PagedResult<BpContactDto>>('/bpcontacts', {
    params: { page, pageSize, search }
  });
  return response.data;
};

export const getBpContactById = async (id: number): Promise<BpContactDto> => {
  const response = await apiClient.get<BpContactDto>(`/bpcontacts/${id}`);
  return response.data;
};

export const createBpContact = async (dto: CreateBpContactDto): Promise<BpContactDto> => {
  const response = await apiClient.post<BpContactDto>('/bpcontacts', dto);
  return response.data;
};

export const updateBpContact = async (id: number, dto: UpdateBpContactDto): Promise<BpContactDto> => {
  const response = await apiClient.put<BpContactDto>(`/bpcontacts/${id}`, dto);
  return response.data;
};

export const deleteBpContact = async (id: number): Promise<void> => {
  await apiClient.delete(`/bpcontacts/${id}`);
};
