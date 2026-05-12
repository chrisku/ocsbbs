import apiClient from './client';
import type { AreaDto, CreateAreaDto, UpdateAreaDto, PagedResult } from '../types';

export const getAreas = async (
  page: number = 1,
  pageSize: number = 25,
  search?: string
): Promise<PagedResult<AreaDto>> => {
  const response = await apiClient.get<PagedResult<AreaDto>>('/areas', {
    params: { page, pageSize, search }
  });
  return response.data;
};

export const getAreaById = async (id: number): Promise<AreaDto> => {
  const response = await apiClient.get<AreaDto>(`/areas/${id}`);
  return response.data;
};

export const createArea = async (dto: CreateAreaDto): Promise<AreaDto> => {
  const response = await apiClient.post<AreaDto>('/areas', dto);
  return response.data;
};

export const updateArea = async (id: number, dto: UpdateAreaDto): Promise<AreaDto> => {
  const response = await apiClient.put<AreaDto>(`/areas/${id}`, dto);
  return response.data;
};

export const deleteArea = async (id: number): Promise<void> => {
  await apiClient.delete(`/areas/${id}`);
};