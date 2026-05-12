import apiClient from './client';
import type { AdDto, CreateAdDto, UpdateAdDto, PagedResult } from '../types';

export const getAds = async (
  page: number = 1,
  pageSize: number = 25,
  search?: string
): Promise<PagedResult<AdDto>> => {
  const response = await apiClient.get<PagedResult<AdDto>>('/ads', {
    params: { page, pageSize, search }
  });
  return response.data;
};

export const getAdById = async (id: number): Promise<AdDto> => {
  const response = await apiClient.get<AdDto>(`/ads/${id}`);
  return response.data;
};

export const createAd = async (dto: CreateAdDto): Promise<AdDto> => {
  const response = await apiClient.post<AdDto>('/ads', dto);
  return response.data;
};

export const updateAd = async (id: number, dto: UpdateAdDto): Promise<AdDto> => {
  const response = await apiClient.put<AdDto>(`/ads/${id}`, dto);
  return response.data;
};

export const deleteAd = async (id: number): Promise<void> => {
  await apiClient.delete(`/ads/${id}`);
};