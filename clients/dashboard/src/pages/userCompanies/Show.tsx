import { useNavigate, useParams } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { useQuery } from '@tanstack/react-query';
import { getUserCompanyById } from '../../api/userCompanies';
import usePageTitle from '../../hooks/usePageTitle';

const Show = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: company, isLoading } = useQuery({
    queryKey: ['userCompany', id],
    queryFn:  () => getUserCompanyById(Number(id)),
  });

  usePageTitle(company?.name ?? 'Company');

  const columns: GridColDef[] = [
    { field: 'username',  headerName: 'Username',   flex: 1 },
    { field: 'firstName', headerName: 'First Name', flex: 1 },
    { field: 'lastName',  headerName: 'Last Name',  flex: 1 },
    { field: 'email',     headerName: 'Email',      flex: 1 },
    {
      field: 'roles',
      headerName: 'Roles',
      flex: 1,
      renderCell: (params) => params.value?.join(', '),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 80,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() => navigate(`/users/${params.row.id}/edit`)}
        />,
      ],
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6">

      {/* ── Header ── */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/user-companies')}
          className="px-3 py-1.5 text-sm font-medium rounded border border-neutral-300 text-neutral-700 hover:bg-neutral-50 transition-colors"
        >
          Back
        </button>
        <h1 className="text-xl font-semibold text-neutral-800">{company?.name}</h1>
        <span className="text-sm text-neutral-400">{company?.userCount} users</span>
      </div>

      {/* ── Users grid ── */}
      <DataGrid
        rows={company?.users ?? []}
        columns={columns}
        autoHeight
        disableRowSelectionOnClick
        pageSizeOptions={[25, 50, 100]}
        initialState={{
          pagination: { paginationModel: { pageSize: 25 } },
        }}
      />

    </div>
  );
};

export default Show;