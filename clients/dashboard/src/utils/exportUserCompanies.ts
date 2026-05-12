// src/utils/exportUsers.ts
import ExcelJS from 'exceljs';
import type { UserCompanyDto } from '../types';

export const exportUserCompaniesToExcel = async (userCompanies: UserCompanyDto[]) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('User Companies');

  worksheet.columns = [
    { header: 'Name', key: 'name' },
    { header: 'User Count', key: 'userCount' },
  ];

  userCompanies.forEach(u => worksheet.addRow({
    ...u,
    name: u.name ?? '',
    userCount: u.userCount ?? 0
  }));

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'user-companies.xlsx';
  a.click();
  URL.revokeObjectURL(url);
};