import apiClient from './client';
import type { HotTopicDto, CreateHotTopicDto, UpdateHotTopicDto, PagedResult } from '../types';

export const getHotTopics = async (
  page: number = 1,
  pageSize: number = 25,
  search?: string
): Promise<PagedResult<HotTopicDto>> => {
  const response = await apiClient.get<PagedResult<HotTopicDto>>('/hottopics', {
    params: { page, pageSize, search }
  });
  return response.data;
};

export const getHotTopicById = async (id: number): Promise<HotTopicDto> => {
  const response = await apiClient.get<HotTopicDto>(`/hottopics/${id}`);
  return response.data;
};

export const createHotTopic = async (dto: CreateHotTopicDto): Promise<HotTopicDto> => {
  const response = await apiClient.post<HotTopicDto>('/hottopics', dto);
  return response.data;
};

export const updateHotTopic = async (id: number, dto: UpdateHotTopicDto): Promise<HotTopicDto> => {
  const response = await apiClient.put<HotTopicDto>(`/hottopics/${id}`, dto);
  return response.data;
};

export const deleteHotTopic = async (id: number): Promise<void> => {
  await apiClient.delete(`/hottopics/${id}`);
};