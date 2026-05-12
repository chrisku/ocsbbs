import apiClient from './client';
import type { CompanyQualificationDto, PagedResult } '../../../shared/src/types';

export const getCompanyQualifications = async (
  page: number = 1,
  pageSize: number = 25,
  name?: string
): Promise<PagedResult<CompanyQualificationDto>> => {
  const response = await apiClient.get<PagedResult<CompanyQualificationDto>>(
    '/companyqualifications',
    { params: { page, pageSize, name } }
  );
  return response.data;
};