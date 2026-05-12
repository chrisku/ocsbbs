// src/utils/exportUsers.ts
import ExcelJS from 'exceljs';
import type { User } from '../types';

export const exportUsersToExcel = async (users: User[]) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Users');

  worksheet.columns = [
    { header: 'Username', key: 'username' },
    { header: 'Email', key: 'email' },
    { header: 'First Name', key: 'firstName' },
    { header: 'Last Name', key: 'lastName' },
    { header: 'Company', key: 'company' },
    { header: 'Roles', key: 'roles' },
    { header: 'Created At', key: 'createdAt' },
    { header: 'Last Login', key: 'lastLoginAt' },
  ];

  users.forEach(u => worksheet.addRow({
    ...u,
    company: u.userCompanyName ?? '',
    roles: u.roles.join(', '),
    lastLoginAt: u.lastLoginAt ?? ''
  }));

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'users.xlsx';
  a.click();
  URL.revokeObjectURL(url);
};