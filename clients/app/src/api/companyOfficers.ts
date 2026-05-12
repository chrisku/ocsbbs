import apiClient from './client';
import type { CompanyOfficerDto, PagedResult } from '../../../shared/src/types';

export const getCompanyOfficers = async (
  page: number = 1,
  pageSize: number = 25,
  name?: string
): Promise<PagedResult<CompanyOfficerDto>> => {
  const response = await apiClient.get<PagedResult<CompanyOfficerDto>>(
    '/companyofficers',
    { params: { page, pageSize, name } }
  );
  return response.data;
};