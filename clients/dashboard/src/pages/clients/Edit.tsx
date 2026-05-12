import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert } from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UpdateClientDto } from '../../types';
import usePageTitle from '../../hooks/usePageTitle';
import ImageUpload from '../../components/ImageUpload';
import { getClientById, updateClient } from '../../api/clients';

const inputClass = 'w-full px-3 py-2 text-sm border border-neutral-300 rounded outline-none focus:ring-2 focus:ring-neutral-400 focus:border-neutral-400 transition';
const labelClass = 'text-sm font-medium text-neutral-700';

const EditClient = () => {
  usePageTitle('Edit Client');
  const navigate     = useNavigate();
  const { id }       = useParams<{ id: string }>();
  const queryClient  = useQueryClient();

  const [form, setForm]   = useState<UpdateClientDto | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data: client, isLoading } = useQuery({
    queryKey: ['clients', id],
    queryFn:  () => getClientById(Number(id)),
  });

  // Populate form once client is loaded
  useEffect(() => {
    if (!client) return;
    setForm({
      businessName:   client.businessName,
      logo:           client.logo ?? '',
      website:        client.website ?? '',
      clientOrder:    client.clientOrder,
      altTag:    client.altTag ?? '',
      comments:  client.comments ?? '',
    });
  }, [client]);

  const mutation = useMutation({
    mutationFn: (dto: UpdateClientDto) => updateClient(Number(id), dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      navigate('/clients');
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to update client');
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => prev ? ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }) : prev);
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!form) return;
    setError(null);
    mutation.mutate(form);
  };

  if (isLoading || !form) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <p className="text-sm text-neutral-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">

      {/* ── Header ── */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/clients')}
          className="px-3 py-1.5 text-sm font-medium rounded border border-neutral-300 text-neutral-700 hover:bg-neutral-50 transition-colors"
        >
          Back
        </button>
        <h1 className="text-xl font-semibold text-neutral-800">Edit Client</h1>
      </div>

      {/* ── Error ── */}
      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}

      {/* ── Form card ── */}
      <div className="bg-white border border-neutral-200 rounded-lg p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" autoComplete="off">

          {/* Name */}
          <div className="flex flex-col gap-1">
            <label className={labelClass}>Name <span className="text-red-500">*</span></label>
            <input
              name="businessName"
              value={form.businessName}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          {/* Image */}
          <div className="flex flex-col gap-1">
            <label className={labelClass}>Image <span className="text-neutral-400 font-normal">(optional)</span></label>
            <ImageUpload
              value={form.logo ?? ''}
              onChange={url => setForm(prev => prev ? ({ ...prev, logo: url }) : prev)}
            />
          </div>

          {/* Alt Tag */}
          <div className="flex flex-col gap-1">
            <label className={labelClass}>Alt Tag <span className="text-neutral-400 font-normal">(optional)</span></label>
            <input
              name="altTag"
              value={form.altTag ?? ''}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* Website */}
          <div className="flex flex-col gap-1">
            <label className={labelClass}>Website <span className="text-neutral-400 font-normal">(optional)</span></label>
            <input
              name="website"
              value={form.website ?? ''}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1">
            <label className={labelClass}>Comments <span className="text-neutral-400 font-normal">(optional)</span></label>
            <input
              name="comments"
              value={form.comments ?? ''}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelClass}>Order</label>
            <input
              type="number"
              name="clientOrder"
              value={form.clientOrder}
              onChange={handleChange}
              min={0}
              className={inputClass}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="px-4 py-2 text-sm font-medium rounded bg-neutral-800 text-white hover:bg-neutral-700 disabled:opacity-50 transition-colors"
            >
              {mutation.isPending ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/clients')}
              className="px-4 py-2 text-sm font-medium rounded border border-neutral-300 text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};

export default EditClient;