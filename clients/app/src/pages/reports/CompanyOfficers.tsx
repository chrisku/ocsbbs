import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Alert
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useQuery } from '@tanstack/react-query';
import { getCompanyOfficers } from '../../api/companyOfficers';
import usePageTitle from '../../hooks/usePageTitle';

const CompanyOfficers = () => {
  usePageTitle('Company Officers');

  const [search, setSearch] = useState('');
  const [nameFilter, setNameFilter] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);

  const { data, isLoading, error } = useQuery({
    queryKey: ['companyofficers', page, pageSize, nameFilter],
    queryFn: () => getCompanyOfficers(page + 1, pageSize, nameFilter || undefined)
  });

  const columns: GridColDef[] = [
    { field: 'code', headerName: 'Code', width: 80 },
    { field: 'sequence', headerName: 'Sequence', flex: 1 },
    { field: 'position', headerName: 'Position', flex: 1 },
    { field: 'firstName', headerName: 'First Name', flex: 1 },
    { field: 'lastName', headerName: 'Last Name', flex: 1 },
    { field: 'footnote', headerName: 'Footnote', width: 80 },
    { field: 'modifyDate', headerName: 'Modify Date', width: 130,
      renderCell: (params) => params.value ? new Date(params.value).toLocaleDateString() : '' },
    { field: 'expirationDate', headerName: 'Expiration Date', width: 100 },
    { field: 'createdDate', headerName: 'Created Date', width: 100 },
    { field: 'createdBy', headerName: 'Created By', width: 100 },
    { field: 'updatedDate', headerName: 'Updated Date', width: 120 },
    { field: 'updatedBy', headerName: 'Updated By', width: 80 },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h1">
          Company Officers
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" onClick={() => alert('Excel export coming soon')}>
            Export Excel
          </Button>
          <Button variant="outlined" onClick={() => alert('PDF export coming soon')}>
            Export PDF
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load report data.
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="Search by Company Name"
          variant="outlined"
          size="small"
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') setNameFilter(search);
          }}
          sx={{ width: 300 }}
        />
        <Button
          variant="contained"
          onClick={() => setNameFilter(search)}
        >
          Search
        </Button>
        {nameFilter && (
          <Button
            variant="outlined"
            onClick={() => {
              setSearch('');
              setNameFilter('');
            }}
          >
            Clear
          </Button>
        )}
      </Box>

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
    </Container>
  );
};

export default CompanyOfficers;