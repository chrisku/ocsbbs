import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBpCompany } from '../../api/bpCompanies';
import type { CreateBpCompanyDto } from '../../types';
import usePageTitle from '../../hooks/usePageTitle';

const inputClass = 'w-full px-3 py-2 text-sm border border-neutral-300 rounded outline-none focus:ring-2 focus:ring-neutral-400 focus:border-neutral-400 transition';
const labelClass = 'text-sm font-medium text-neutral-700';

const Create = () => {
  usePageTitle('Create BP Company');
  const navigate    = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState<CreateBpCompanyDto>({
    name: '',
    phone: '',
    fax: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  });

  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (dto: CreateBpCompanyDto) => createBpCompany(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bpCompanies'] });
      navigate('/bp-companies');
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to create BP company');
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
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
          onClick={() => navigate('/bp-companies')}
          className="px-3 py-1.5 text-sm font-medium rounded border border-neutral-300 text-neutral-700 hover:bg-neutral-50 transition-colors"
        >
          Back
        </button>
        <h1 className="text-xl font-semibold text-neutral-800">Create BP Company</h1>
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

          <div className="flex flex-col gap-1">
            <label className={labelClass}>Address <span className="text-neutral-400 font-normal">(optional)</span></label>
            <input
              name="address"
              value={form.address ?? ''}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1 col-span-1">
              <label className={labelClass}>City</label>
              <input
                name="city"
                value={form.city ?? ''}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className={labelClass}>State</label>
              <input
                name="state"
                value={form.state ?? ''}
                onChange={handleChange}
                maxLength={2}
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className={labelClass}>Zip</label>
              <input
                name="zip"
                value={form.zip ?? ''}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className={labelClass}>Phone</label>
              <input
                name="phone"
                value={form.phone ?? ''}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className={labelClass}>Fax</label>
              <input
                name="fax"
                value={form.fax ?? ''}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>

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
              onClick={() => navigate('/bp-companies')}
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
