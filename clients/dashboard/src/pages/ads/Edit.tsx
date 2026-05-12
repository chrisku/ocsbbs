import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert } from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAdById, updateAd } from '../../api/ads';
import type { UpdateAdDto } from '../../types';
import usePageTitle from '../../hooks/usePageTitle';
import ImageUpload from '../../components/ImageUpload';

const inputClass = 'w-full px-3 py-2 text-sm border border-neutral-300 rounded outline-none focus:ring-2 focus:ring-neutral-400 focus:border-neutral-400 transition';
const labelClass = 'text-sm font-medium text-neutral-700';

const EditAd = () => {
  usePageTitle('Edit Ad');
  const navigate     = useNavigate();
  const { id }       = useParams<{ id: string }>();
  const queryClient  = useQueryClient();

  const [form, setForm]   = useState<UpdateAdDto | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data: ad, isLoading } = useQuery({
    queryKey: ['ads', id],
    queryFn:  () => getAdById(Number(id)),
  });

  // Populate form once ad is loaded
  useEffect(() => {
    if (!ad) return;
    setForm({
      name:      ad.name,
      image:     ad.image,
      url:       ad.url,
      weight:    ad.weight,
      startDate: ad.startDate.split('T')[0],
      endDate:   ad.endDate.split('T')[0],
      altTag:    ad.altTag ?? '',
      category:  ad.category,
    });
  }, [ad]);

  const mutation = useMutation({
    mutationFn: (dto: UpdateAdDto) => updateAd(Number(id), dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ads'] });
      navigate('/ads');
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to update ad');
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
            <label className={labelClass}>Name <span className="text-red-500">*</span></label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          {/* Image */}
          <div className="flex flex-col gap-1">
            <label className={labelClass}>Image <span className="text-red-500">*</span></label>
            <ImageUpload
              value={form.image}
              onChange={url => setForm(prev => prev ? ({ ...prev, image: url }) : prev)}
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

          {/* URL */}
          <div className="flex flex-col gap-1">
            <label className={labelClass}>URL <span className="text-red-500">*</span></label>
            <input
              name="url"
              value={form.url}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1">
            <label className={labelClass}>Category <span className="text-red-500">*</span></label>
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          {/* Weight */}
          <div className="flex flex-col gap-1">
            <label className={labelClass}>Weight</label>
            <input
              type="number"
              name="weight"
              value={form.weight}
              onChange={handleChange}
              min={0}
              className={inputClass}
            />
          </div>

          {/* Start / End Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className={labelClass}>Start Date <span className="text-red-500">*</span></label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className={labelClass}>End Date <span className="text-red-500">*</span></label>
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
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