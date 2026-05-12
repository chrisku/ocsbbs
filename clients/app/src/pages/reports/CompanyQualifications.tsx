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
import { getCompanyQualifications } from '../../api/companyQualifications';
import usePageTitle from '../../hooks/usePageTitle';

const CompanyQualifications = () => {
  usePageTitle('Company Qualifications');

  const [search, setSearch] = useState('');
  const [nameFilter, setNameFilter] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);

  const { data, isLoading, error } = useQuery({
    queryKey: ['companyQualifications', page, pageSize, nameFilter],
    queryFn: () => getCompanyQualifications(page + 1, pageSize, nameFilter || undefined)
  });

  const columns: GridColDef[] = [
    { field: 'code', headerName: 'Code', width: 80 },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'address1', headerName: 'Address', flex: 1 },
    { field: 'city', headerName: 'City', width: 120 },
    { field: 'state', headerName: 'State', width: 80 },
    { field: 'zip', headerName: 'Zip', width: 100 },
    { field: 'country', headerName: 'Country', width: 100 },
    { field: 'bond', headerName: 'Bond', width: 100 },
    { field: 'rowBond', headerName: 'Row Bond', width: 100, type: 'boolean' },
    { field: 'incorporation', headerName: 'Incorporation', width: 120 },
    { field: 'approvalDate', headerName: 'Approval Date', width: 130,
      renderCell: (params) => params.value ? new Date(params.value).toLocaleDateString() : '' },
    { field: 'modifyDate', headerName: 'Modify Date', width: 130,
      renderCell: (params) => params.value ? new Date(params.value).toLocaleDateString() : '' },
    { field: 'eeo', headerName: 'EEO', width: 80, type: 'boolean' },
    { field: 'eeoDate', headerName: 'EEO Date', width: 120,
      renderCell: (params) => params.value ? new Date(params.value).toLocaleDateString() : '' },
    { field: 'debarment', headerName: 'Debarment', width: 100, type: 'boolean' },
    { field: 'debarmentDate', headerName: 'Debarment Date', width: 130,
      renderCell: (params) => params.value ? new Date(params.value).toLocaleDateString() : '' },
    { field: 'foreignParent', headerName: 'Foreign Parent', width: 130 },
    { field: 'bankruptcyFlag', headerName: 'Bankruptcy', width: 100 },
    { field: 'bankruptcyStartDate', headerName: 'Bankruptcy Start', width: 130,
      renderCell: (params) => params.value ? new Date(params.value).toLocaleDateString() : '' },
    { field: 'bankruptcyEndDate', headerName: 'Bankruptcy End', width: 130 },
    { field: 'qualificationRevokedFlag', headerName: 'Revoked', width: 100 },
    { field: 'qualificationRevokedStartDate', headerName: 'Revoked Start', width: 130 },
    { field: 'qualificationRevokedEndDate', headerName: 'Revoked End', width: 130 },
    { field: 'memo', headerName: 'Memo', flex: 1 },
    { field: 'resolution', headerName: 'Resolution', flex: 1 }
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h1">
          Company Qualifications
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

export default CompanyQualifications;