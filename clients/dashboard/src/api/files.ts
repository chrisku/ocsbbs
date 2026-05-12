//import api from 'axios';
import apiClient from './client';

export const uploadFile = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post('/file/upload', formData, {
    headers: { 'Content-Type': undefined },
  });

  return response.data.url;
};