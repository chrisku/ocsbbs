import apiClient from './client';

export const uploadFile = async (file: File, subfolder?: string): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  const params = subfolder ? { subfolder } : {};

  const response = await apiClient.post('/file/upload', formData, {
    headers: { 'Content-Type': undefined },
    params,
  });

  return response.data.url;
};