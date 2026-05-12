import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Dialog, DialogTitle, DialogContent,
  DialogContentText, DialogActions, Button,
} from '@mui/material';
import EditIcon   from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon    from '@mui/icons-material/Add';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBpContacts, deleteBpContact } from '../../api/bpContacts';
import { useAuth } from '../../contexts/AuthContext';
import type { BpContactDto } from '../../types';
import usePageTitle from '../../hooks/usePageTitle';

const BpContactList = () => {
  usePageTitle('BP Contacts');
  const navigate    = useNavigate();
  const queryClient = useQueryClient();
  const { user }    = useAuth();
  const isAdmin     = user?.roles.includes('Admin') ?? false;

  const [page,         setPage]         = useState(1);
  const [search,       setSearch]       = useState('');
  const [deleteTarget, setDeleteTarget] = useState<BpContactDto | null>(null);
  const [error,        setError]        = useState<string | null>(null);

  const pageSize = 25;

  const { data, isLoading } = useQuery({
    queryKey: ['bpContacts', page, search],
    queryFn:  () => getBpContacts(page, pageSize, search || undefined),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteBpContact(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bpContacts'] });
      setDeleteTarget(null);
    },
    onError: () => {
      setError('Failed to delete BP Contact');
      setDeleteTarget(null);
    },
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">

      {/* ── Header ── */}
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-xl font-semibold text-neutral-800 mr-auto">BP Contacts</h1>
        <button
          onClick={() => navigate('/bp-contacts/create')}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded bg-neutral-800 text-white hover:bg-neutral-700 transition-colors"
        >
          <AddIcon fontSize="small" />
          Create BP Contact
        </button>
      </div>

      {/* ── Error ── */}
      {error && (
        <Alert severity="error" className="mb-4" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* ── Search ── */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name, email, company, or department..."
          value={search}
          onChange={handleSearchChange}
          className="w-96 px-3 py-2 text-sm border border-neutral-300 rounded outline-none focus:ring-2 focus:ring-neutral-400 focus:border-neutral-400 transition"
        />
      </div>

      {/* ── Table ── */}
      {isLoading ? (
        <p className="text-sm text-neutral-500">Loading...</p>
      ) : (
        <div className="border border-neutral-200 rounded-lg overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-3 py-2 text-xs font-semibold text-neutral-600 uppercase tracking-wide">Name</th>
                <th className="px-3 py-2 text-xs font-semibold text-neutral-600 uppercase tracking-wide">Company</th>
                <th className="px-3 py-2 text-xs font-semibold text-neutral-600 uppercase tracking-wide">Title / Dept</th>
                <th className="px-3 py-2 text-xs font-semibold text-neutral-600 uppercase tracking-wide">Phone</th>
                <th className="px-3 py-2 text-xs font-semibold text-neutral-600 uppercase tracking-wide">Email</th>
                <th className="px-3 py-2 text-xs font-semibold text-neutral-600 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {data?.items.map(contact => (
                <tr key={contact.id}>
                  <td className="px-3 py-2 text-sm text-neutral-800 font-medium">
                    {contact.firstName}{contact.middleName ? ` ${contact.middleName}` : ''} {contact.lastName}
                  </td>
                  <td className="px-3 py-2 text-sm text-neutral-600">{contact.bpCompanyName}</td>
                  <td className="px-3 py-2 text-sm text-neutral-600">
                    {[contact.title, contact.department].filter(Boolean).join(' / ') || '—'}
                  </td>
                  <td className="px-3 py-2 text-sm text-neutral-600">{contact.phone ?? '—'}</td>
                  <td className="px-3 py-2 text-sm text-neutral-600">{contact.email}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => navigate(`/bp-contacts/${contact.id}/edit`)}
                        className="p-1 rounded text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 transition-colors"
                      >
                        <EditIcon fontSize="small" />
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => setDeleteTarget(contact)}
                          className="p-1 rounded text-neutral-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <DeleteIcon fontSize="small" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {data?.items.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-3 py-6 text-center text-sm text-neutral-400">
                    No BP contacts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center gap-2 mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="px-3 py-1.5 text-sm border border-neutral-300 rounded disabled:opacity-40 hover:bg-neutral-50 transition-colors"
          >
            Previous
          </button>
          <span className="text-sm text-neutral-600">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            className="px-3 py-1.5 text-sm border border-neutral-300 rounded disabled:opacity-40 hover:bg-neutral-50 transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* ── Delete dialog ── */}
      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
        <DialogTitle>Delete BP Contact</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{deleteTarget?.firstName} {deleteTarget?.lastName}"? This action cannot be undone.
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

export default BpContactList;
