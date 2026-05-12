import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createAd } from '../../api/ads';
import type { CreateAdDto } from '../../types';
import usePageTitle from '../../hooks/usePageTitle';
import ImageUpload from '../../components/ImageUpload';

const inputClass = 'w-full px-3 py-2 text-sm border border-neutral-300 rounded outline-none focus:ring-2 focus:ring-neutral-400 focus:border-neutral-400 transition';
const labelClass = 'text-sm font-medium text-neutral-700';

const Create = () => {
  usePageTitle('Create Ad');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState<CreateAdDto>({
    name:      '',
    image:     '',
    url:       '',
    weight:    0,
    startDate: new Date().toISOString().split('T')[0],
    endDate:   '',
    altTag:    '',
    category:  '',
  });

  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (dto: CreateAdDto) => createAd(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ads'] });
      navigate('/ads');
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to create ad');
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError(null);
    mutation.mutate(form);
  };

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
        <h1 className="text-xl font-semibold text-neutral-800">Create Ad</h1>
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

          {/* Image URL */}
          <div className="flex flex-col gap-1">
            <label className={labelClass}>Image <span className="text-red-500">*</span></label>
            <ImageUpload
              value={form.image}
              onChange={url => setForm(prev => ({ ...prev, image: url }))}
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

export default Create;