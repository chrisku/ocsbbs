import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
} from '@mui/material';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import BusinessIcon from '@mui/icons-material/Business';
import AddIcon from '@mui/icons-material/Add';
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../../api/users';
import usePageTitle from '../../hooks/usePageTitle';
import { exportUsersToExcel } from '../../utils/exportUsers';
import { UserFilter } from '../../api/users';

const FILTERS: { value: UserFilter; label: string }[] = [
  { value: 'All',                label: 'All' },
  { value: 'Active',             label: 'Active' },
  { value: 'Inactive',           label: 'Inactive' },
  { value: 'FinancialAssurance', label: 'FA' },
  { value: 'Employees',          label: 'Employees' },
  { value: 'LawFirm',            label: 'Law Firms' },
];

const UserList = () => {
  usePageTitle('Users');
  const navigate = useNavigate();
  const [search, setSearch]           = useState('');
  const [page, setPage]               = useState(0);
  const [pageSize, setPageSize]       = useState(25);
  const [error, setError]             = useState<string | null>(null);
  const [filter, setFilter]           = useState<UserFilter>('All');

  const { data, isLoading } = useQuery({
    queryKey: ['users', page, pageSize, search, filter],
    queryFn:  () => getUsers(page + 1, pageSize, search || undefined, filter),
  });

  const columns: GridColDef[] = [
    { field: 'username',        headerName: 'Username',  flex: 1 },
    { field: 'firstName',       headerName: 'First Name', flex: 1 },
    { field: 'lastName',        headerName: 'Last Name',  flex: 1 },
    { field: 'userCompanyName', headerName: 'Company',    flex: 1 },
    { field: 'email',           headerName: 'Email',      flex: 1 },
    {
      field: 'roles',
      headerName: 'Roles',
      flex: 1,
      renderCell: (params) => params.value.join(', '),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() => navigate(`/users/${params.row.id}/edit`)}
        />,
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">

      {/* ── Page header ── */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <h1 className="text-xl font-semibold text-neutral-800 mr-auto">Users</h1>

        <button
          onClick={() => navigate('/user-companies')}
          className="px-4 py-2 text-sm font-medium rounded bg-neutral-800 text-white hover:bg-neutral-700 transition-colors"
        >
          <BusinessIcon fontSize="small" className="mr-1.5" /> 
           Companies
        </button>

        <button
          onClick={() => exportUsersToExcel(data?.items ?? [])}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded bg-neutral-800 text-white hover:bg-neutral-700 transition-colors"        >
          <FileDownloadIcon fontSize="small" /> 
          Export to XLS
        </button>

        <button
          onClick={() => navigate('/users/create')}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded bg-neutral-800 text-white hover:bg-neutral-700 transition-colors"
        >
          <AddIcon fontSize="small" />
          Add User
        </button>
      </div>

      {/* ── Filter tabs ── */}
      <div className="flex flex-wrap gap-2 mb-4">
        {FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => { setFilter(f.value); setPage(0); }}
            className={[
              'px-3 py-1.5 text-sm rounded border transition-colors',
              filter === f.value
                ? 'bg-neutral-800 text-white border-neutral-800'
                : 'bg-white text-neutral-600 border-neutral-300 hover:bg-neutral-50',
            ].join(' ')}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ── Error alert ── */}
      {error && (
        <Alert severity="error" className="mb-4" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* ── Search ── */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-72 px-3 py-2 text-sm border border-neutral-300 rounded outline-none focus:ring-2 focus:ring-neutral-400 focus:border-neutral-400 transition"
        />
      </div>

      <DataGrid
        rows={data?.items ?? []}
        columns={columns}
        rowCount={data?.totalCount ?? 0}
        loading={isLoading}
        pageSizeOptions={[25, 50, 100]}
        paginationMode="server"
        paginationModel={{ page, pageSize }}
        onPaginationModelChange={model => {
          setPage(model.page);
          setPageSize(model.pageSize);
        }}
        autoHeight
        disableRowSelectionOnClick
      />

    </div>
  );
};

export default UserList;