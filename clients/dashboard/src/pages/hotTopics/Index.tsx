import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getHotTopics, deleteHotTopic } from '../../api/hotTopics';
import { useAuth } from '../../contexts/AuthContext';
import type { HotTopicDto } from '../../types';
import usePageTitle from '../../hooks/usePageTitle';

// ── Status badge ──────────────────────────────────────────────────────────────

const StatusBadge = ({ published }: { published: boolean }) => (
  <span className={[
    'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
    published
      ? 'bg-green-100 text-green-800'
      : 'bg-neutral-100 text-neutral-600',
  ].join(' ')}>
    {published ? 'Published' : 'Draft'}
  </span>
);

const FrontPageBadge = ({ value }: { value: boolean }) => (
  <span className={[
    'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
    value
      ? 'bg-blue-100 text-blue-800'
      : 'bg-neutral-100 text-neutral-600',
  ].join(' ')}>
    {value ? 'Yes' : 'No'}
  </span>
);

// ── Component ─────────────────────────────────────────────────────────────────

const HotTopicsList = () => {
  usePageTitle('Hot Topics');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isAdmin = user?.roles.includes('Admin') ?? false;

  const [search, setSearch]             = useState('');
  const [page, setPage]                 = useState(0);
  const [pageSize, setPageSize]         = useState(25);
  const [deleteTarget, setDeleteTarget] = useState<HotTopicDto | null>(null);
  const [error, setError]               = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['hotTopics', page, pageSize, search],
    queryFn:  () => getHotTopics(page + 1, pageSize, search || undefined),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteHotTopic(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotTopics'] });
      setDeleteTarget(null);
    },
    onError: () => {
      setError('Failed to delete hot topic');
      setDeleteTarget(null);
    },
  });

  const columns: GridColDef[] = [
    { field: 'title', headerName: 'Title', flex: 2 },
    {
      field: 'isPublished',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => <StatusBadge published={params.value} />,
    },
    {
      field: 'isFrontPage',
      headerName: 'Front Page',
      width: 120,
      renderCell: (params) => <FrontPageBadge value={params.value} />,
    },
    {
      field: 'publishedDate',
      headerName: 'Published Date',
      width: 160,
      renderCell: (params) => new Date(params.value).toLocaleDateString(),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      getActions: (params) => {
        const actions = [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            onClick={() => navigate(`/hot-topics/${params.row.id}/edit`)}
          />,
        ];

        if (isAdmin) {
          actions.push(
            <GridActionsCellItem
              icon={<DeleteIcon />}
              label="Delete"
              onClick={() => setDeleteTarget(params.row)}
            />
          );
        }

        return actions;
      },
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">

      {/* ── Page header ── */}
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-xl font-semibold text-neutral-800 mr-auto">Hot Topics</h1>

        <button
          onClick={() => navigate('/hot-topics/create')}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded bg-neutral-800 text-white hover:bg-neutral-700 transition-colors"
        >
          <AddIcon fontSize="small" />
          Add Hot Topic
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
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-72 px-3 py-2 text-sm border border-neutral-300 rounded outline-none focus:ring-2 focus:ring-neutral-400 focus:border-neutral-400 transition"
        />
      </div>

      {/* ── Data grid ── */}
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

      {/* ── Delete dialog ── */}
      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
        <DialogTitle>Delete Hot Topic</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{deleteTarget?.title}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );
};

export default HotTopicsList;