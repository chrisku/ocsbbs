import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Dialog, DialogTitle, DialogContent,
  DialogContentText, DialogActions, Button,
} from '@mui/material';
import EditIcon   from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon    from '@mui/icons-material/Add';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { getClients, deleteClient, reorderClients } from '../../api/clients';
import { useAuth } from '../../contexts/AuthContext';
import type { ClientDto } from '../../types';
import usePageTitle from '../../hooks/usePageTitle';

// ── Sortable row ──────────────────────────────────────────────────────────────

interface RowProps {
  client:    ClientDto;
  isAdmin:   boolean;
  onEdit:    (id: number) => void;
  onDelete:  (client: ClientDto) => void;
}

const SortableRow = ({ client, isAdmin, onEdit, onDelete }: RowProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: client.id });

  const style = {
    transform:  CSS.Transform.toString(transform),
    transition,
    opacity:    isDragging ? 0.5 : 1,
    background: isDragging ? '#f5f5f5' : undefined,
  };

  return (
    <tr ref={setNodeRef} style={style}>
      {/* Drag handle */}
      <td className="px-3 py-2 w-8 text-neutral-400 cursor-grab" {...attributes} {...listeners}>
        <DragIndicatorIcon fontSize="small" />
      </td>

      <td className="px-3 py-2 text-sm text-neutral-700">{client.businessName}</td>

      <td className="px-3 py-2">
        {client.logo && (
          <img src={client.logo} alt="logo" className="w-10 h-10 object-contain" />
        )}
      </td>

      <td className="px-3 py-2 text-sm text-neutral-700">{client.website}</td>
      <td className="px-3 py-2 text-sm text-neutral-700">{client.altTag}</td>
      <td className="px-3 py-2 text-sm text-neutral-500">{client.comments}</td>

      {/* Actions */}
      <td className="px-3 py-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(client.id)}
            className="p-1 rounded text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 transition-colors"
          >
            <EditIcon fontSize="small" />
          </button>
          {isAdmin && (
            <button
              onClick={() => onDelete(client)}
              className="p-1 rounded text-neutral-500 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <DeleteIcon fontSize="small" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

// ── Main component ────────────────────────────────────────────────────────────

const ClientList = () => {
  usePageTitle('Clients');
  const navigate     = useNavigate();
  const queryClient  = useQueryClient();
  const { user }     = useAuth();
  const isAdmin      = user?.roles.includes('Admin') ?? false;

  const [search,       setSearch]       = useState('');
  const [rows,         setRows]         = useState<ClientDto[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<ClientDto | null>(null);
  const [error,        setError]        = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor));

  // Load all clients — no pagination
  const { data, isLoading } = useQuery({
    queryKey: ['clients', search],
    queryFn:  () => getClients(1, 1000, search || undefined),
  });

  // Keep local rows in sync with query data, sorted by clientOrder
  useEffect(() => {
    if (data?.items) {
      const sorted = [...data.items].sort((a, b) => a.clientOrder - b.clientOrder);
      setRows(sorted);
    }
  }, [data]);

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteClient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setDeleteTarget(null);
    },
    onError: () => {
      setError('Failed to delete client');
      setDeleteTarget(null);
    },
  });

  const reorderMutation = useMutation({
    mutationFn: (orderedIds: number[]) => reorderClients(orderedIds),
    onError: () => {
      // Roll back to server state on failure
      setError('Failed to save order. Please try again.');
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setRows(prev => {
      const oldIndex = prev.findIndex(r => r.id === active.id);
      const newIndex = prev.findIndex(r => r.id === over.id);
      const reordered = arrayMove(prev, oldIndex, newIndex);
      reorderMutation.mutate(reordered.map(r => r.id));
      return reordered;
    });
  };

  const filtered = rows.filter(r =>
    r.businessName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">

      {/* ── Header ── */}
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-xl font-semibold text-neutral-800 mr-auto">Clients</h1>
        <button
          onClick={() => navigate('/clients/create')}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded bg-neutral-800 text-white hover:bg-neutral-700 transition-colors"
        >
          <AddIcon fontSize="small" />
          Create Client
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
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-72 px-3 py-2 text-sm border border-neutral-300 rounded outline-none focus:ring-2 focus:ring-neutral-400 focus:border-neutral-400 transition"
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
                <th className="px-3 py-2 w-8" />
                <th className="px-3 py-2 text-xs font-semibold text-neutral-600 uppercase tracking-wide">Name</th>
                <th className="px-3 py-2 text-xs font-semibold text-neutral-600 uppercase tracking-wide">Logo</th>
                <th className="px-3 py-2 text-xs font-semibold text-neutral-600 uppercase tracking-wide">Website</th>
                <th className="px-3 py-2 text-xs font-semibold text-neutral-600 uppercase tracking-wide">Alt Tag</th>
                <th className="px-3 py-2 text-xs font-semibold text-neutral-600 uppercase tracking-wide">Comments</th>
                <th className="px-3 py-2 text-xs font-semibold text-neutral-600 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={filtered.map(r => r.id)} strategy={verticalListSortingStrategy}>
                <tbody className="divide-y divide-neutral-100">
                  {filtered.map(client => (
                    <SortableRow
                      key={client.id}
                      client={client}
                      isAdmin={isAdmin}
                      onEdit={id => navigate(`/clients/${id}/edit`)}
                      onDelete={setDeleteTarget}
                    />
                  ))}
                </tbody>
              </SortableContext>
            </DndContext>
          </table>
        </div>
      )}

      {/* ── Delete dialog ── */}
      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
        <DialogTitle>Delete Client</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{deleteTarget?.businessName}"? This action cannot be undone.
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

export default ClientList;