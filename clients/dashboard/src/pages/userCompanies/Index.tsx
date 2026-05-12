import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import GroupIcon from '@mui/icons-material/Group';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserCompanies, createUserCompany, updateUserCompany } from '../../api/userCompanies';
import type { UserCompanyDto } from '../types';
import usePageTitle from '../../hooks/usePageTitle';
import { exportUserCompaniesToExcel } from '../../utils/exportUserCompanies';

const UserCompaniesList = () => {
  usePageTitle('User Companies');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [error, setError]             = useState<string | null>(null);
  const [editTarget, setEditTarget]   = useState<UserCompanyDto | null>(null);
  const [createOpen, setCreateOpen]   = useState(false);
  const [name, setName]               = useState('');
  const [search, setSearch]           = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['userCompanies', search],
    queryFn:  () => getUserCompanies(1, 25, search || undefined),
  });

  const createMutation = useMutation({
    mutationFn: (name: string) => createUserCompany(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userCompanies'] });
      setCreateOpen(false);
      setName('');
    },
    onError: () => setError('Failed to create company'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) => updateUserCompany(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userCompanies'] });
      setEditTarget(null);
      setName('');
    },
    onError: () => setError('Failed to update company'),
  });

  const handleEditOpen = (company: UserCompanyDto) => {
    setEditTarget(company);
    setName(company.name);
  };

  const columns: GridColDef[] = [
    { field: 'name',      headerName: 'Company Name', flex: 1 },
    { field: 'userCount', headerName: 'User Count',        width: 150 },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<SearchIcon />}
          label="Show"
          onClick={() => navigate(`/user-companies/${params.row.id}/show`)}
        />,
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() => handleEditOpen(params.row)}
        />,
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">

      {/* ── Page header ── */}
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-xl font-semibold text-neutral-800 mr-auto">User Companies</h1>

        <button
          onClick={() => navigate('/users')}
          className="px-4 py-2 text-sm font-medium rounded bg-neutral-800 text-white hover:bg-neutral-700 transition-colors"
        >
          <GroupIcon fontSize="small" className="mr-1.5" /> 
           Users
        </button>
        <button
          onClick={() => exportUserCompaniesToExcel(data?.items ?? [])}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded bg-neutral-800 text-white hover:bg-neutral-700 transition-colors"
        >
          <FileDownloadIcon fontSize="small" /> 
          Export to XLS
        </button>
        <button
          onClick={() => { setCreateOpen(true); setName(''); }}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded bg-neutral-800 text-white hover:bg-neutral-700 transition-colors"
        >
          <AddIcon fontSize="small" />
          Add Company
        </button>
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
          placeholder="Search companies..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-72 px-3 py-2 text-sm border border-neutral-300 rounded outline-none focus:ring-2 focus:ring-neutral-400 focus:border-neutral-400 transition"
        />
      </div>

      {/* ── Data grid ── */}
      <DataGrid
        rows={data?.items ?? []}
        columns={columns}
        loading={isLoading}
        autoHeight
        disableRowSelectionOnClick
        pageSizeOptions={[25, 50, 100]}
        initialState={{
          pagination: { paginationModel: { pageSize: 25 } },
        }}
      />

      {/* ── Create dialog ── */}
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add Company</DialogTitle>
        <DialogContent>
          <input
            type="text"
            placeholder="Company Name"
            value={name}
            onChange={e => setName(e.target.value)}
            autoFocus
            className="w-full mt-3 px-3 py-2 text-sm border border-neutral-300 rounded outline-none focus:ring-2 focus:ring-neutral-400 focus:border-neutral-400 transition"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => createMutation.mutate(name)}
            disabled={!name || createMutation.isPending}
          >
            {createMutation.isPending ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Edit dialog ── */}
      <Dialog open={!!editTarget} onClose={() => setEditTarget(null)} fullWidth maxWidth="sm">
        <DialogTitle>Edit Company</DialogTitle>
        <DialogContent>
          <input
            type="text"
            placeholder="Company Name"
            value={name}
            onChange={e => setName(e.target.value)}
            autoFocus
            className="w-full mt-3 px-3 py-2 text-sm border border-neutral-300 rounded outline-none focus:ring-2 focus:ring-neutral-400 focus:border-neutral-400 transition"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditTarget(null)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => editTarget && updateMutation.mutate({ id: editTarget.id, name })}
            disabled={!name || updateMutation.isPending}
          >
            {updateMutation.isPending ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserCompaniesList;