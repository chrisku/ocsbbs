import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert } from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAreaById, updateArea } from '../../api/areas';
import type { UpdateAreaDto } from '../../types';
import usePageTitle from '../../hooks/usePageTitle';
import ImageUpload from '../../components/ImageUpload';

const inputClass = 'w-full px-3 py-2 text-sm border border-neutral-300 rounded outline-none focus:ring-2 focus:ring-neutral-400 focus:border-neutral-400 transition';
const labelClass = 'text-sm font-medium text-neutral-700';

const EditAd = () => {
  usePageTitle('Edit Ad');
  const navigate     = useNavigate();
  const { id }       = useParams<{ id: string }>();
  const queryClient  = useQueryClient();

  const [form, setForm]   = useState<UpdateAreaDto | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data: area, isLoading } = useQuery({
    queryKey: ['areas', id],
    queryFn:  () => getAreaById(Number(id)),
  });

  // Populate form once area is loaded
  useEffect(() => {
    if (!area) return;
    setForm({
      areaName:      area.areaName,
      areaAbbreviation: area.areaAbbreviation,
    });
  }, [area]);

  const mutation = useMutation({
    mutationFn: (dto: UpdateAreaDto) => updateArea(Number(id), dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['areas'] });
      navigate('/areas');
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to update area');
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
          onClick={() => navigate('/ads')}
          className="px-3 py-1.5 text-sm font-medium rounded border border-neutral-300 text-neutral-700 hover:bg-neutral-50 transition-colors"
        >
          Back
        </button>
        <h1 className="text-xl font-semibold text-neutral-800">Edit Ad</h1>
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
            <label className={labelClass}>Area Name <span className="text-red-500">*</span></label>
            <input
              name="areaName"
              value={form.areaName}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          {/* Abbr */}
          <div className="flex flex-col gap-1">
            <label className={labelClass}>Area Abbreviation <span className="text-red-500">*</span></label>
            <input
              name="areaAbbreviation"
              value={form.areaAbbreviation}
              onChange={handleChange}
              required
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
              onClick={() => navigate('/ads')}
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

export default EditAd;