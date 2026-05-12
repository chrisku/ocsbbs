import apiClient from './client';
import type { ClientDto, CreateClientDto, UpdateClientDto, PagedResult } from '../types';

export const getClients  = async (
  page: number = 1,
  pageSize: number = 25,
  search?: string
): Promise<PagedResult<ClientDto>> => {
  const response = await apiClient.get<PagedResult<ClientDto>>('/clients', {
    params: { page, pageSize, search }
  });
  return response.data;
};

export const reorderClients = async (orderedIds: number[]): Promise<void> => {
  await apiClient.put('/clients/reorder', orderedIds);
};

export const getClientById = async (id: number): Promise<ClientDto> => {
  const response = await apiClient.get<ClientDto>(`/clients/${id}`);
  return response.data;
};

export const createClient = async (dto: CreateClientDto): Promise<ClientDto> => {
  const response = await apiClient.post<ClientDto>('/clients', dto);
  return response.data;
};

export const updateClient = async (id: number, dto: UpdateClientDto): Promise<ClientDto> => {
  const response = await apiClient.put<ClientDto>(`/clients/${id}`, dto);
  return response.data;
};

export const deleteClient = async (id: number): Promise<void> => {
  await apiClient.delete(`/clients/${id}`);
};