import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createBpContact } from '../../api/bpContacts';
import { getBpCompanies } from '../../api/bpCompanies';
import type { CreateBpContactDto } from '../../types';
import usePageTitle from '../../hooks/usePageTitle';
import ImageUpload from '../../components/ImageUpload';

const inputClass  = 'w-full px-3 py-2 text-sm border border-neutral-300 rounded outline-none focus:ring-2 focus:ring-neutral-400 focus:border-neutral-400 transition';
const selectClass = 'w-full px-3 py-2 text-sm border border-neutral-300 rounded outline-none focus:ring-2 focus:ring-neutral-400 focus:border-neutral-400 transition bg-white';
const labelClass  = 'text-sm font-medium text-neutral-700';

const Create = () => {
  usePageTitle('Create BP Contact');
  const navigate    = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState<CreateBpContactDto>({
    firstName:   '',
    middleName:  '',
    lastName:    '',
    department:  '',
    title:       '',
    phone:       '',
    fax:         '',
    coPhone:     '',
    coFax:       '',
    email:       '',
    photo:       '',
    address:     '',
    city:        '',
    state:       '',
    zip:         '',
    bpCompanyId: 0,
  });

  const [error, setError] = useState<string | null>(null);

  const { data: companiesData } = useQuery({
    queryKey: ['bpCompanies', 'all'],
    queryFn:  () => getBpCompanies(1, 1000),
  });

  const mutation = useMutation({
    mutationFn: (dto: CreateBpContactDto) => createBpContact(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bpContacts'] });
      navigate('/bp-contacts');
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to create BP contact');
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
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
          onClick={() => navigate('/bp-contacts')}
          className="px-3 py-1.5 text-sm font-medium rounded border border-neutral-300 text-neutral-700 hover:bg-neutral-50 transition-colors"
        >
          Back
        </button>
        <h1 className="text-xl font-semibold text-neutral-800">Create BP Contact</h1>
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

          {/* Company */}
          <div className="flex flex-col gap-1">
            <label className={labelClass}>Company <span className="text-red-500">*</span></label>
            <select
              name="bpCompanyId"
              value={form.bpCompanyId}
              onChange={handleChange}
              required
              className={selectClass}
            >
              <option value={0} disabled>Select a company…</option>
              {companiesData?.items.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Name row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1">
              <label className={labelClass}>First Name <span className="text-red-500">*</span></label>
              <input name="firstName" value={form.firstName} onChange={handleChange} required className={inputClass} />
            </div>
            <div className="flex flex-col gap-1">
              <label className={labelClass}>Middle Name</label>
              <input name="middleName" value={form.middleName ?? ''} onChange={handleChange} className={inputClass} />
            </div>
            <div className="flex flex-col gap-1">
              <label className={labelClass}>Last Name <span className="text-red-500">*</span></label>
              <input name="lastName" value={form.lastName} onChange={handleChange} required className={inputClass} />
            </div>
          </div>

          {/* Title / Dept */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className={labelClass}>Title</label>
              <input name="title" value={form.title ?? ''} onChange={handleChange} className={inputClass} />
            </div>
            <div className="flex flex-col gap-1">
              <label className={labelClass}>Department</label>
              <input name="department" value={form.department ?? ''} onChange={handleChange} className={inputClass} />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className={labelClass}>Email <span className="text-red-500">*</span></label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required className={inputClass} />
          </div>

          {/* Phone / Fax */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className={labelClass}>Phone</label>
              <input name="phone" value={form.phone ?? ''} onChange={handleChange} className={inputClass} />
            </div>
            <div className="flex flex-col gap-1">
              <label className={labelClass}>Fax</label>
              <input name="fax" value={form.fax ?? ''} onChange={handleChange} className={inputClass} />
            </div>
          </div>

          {/* Co Phone / Co Fax */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className={labelClass}>Co. Phone</label>
              <input name="coPhone" value={form.coPhone ?? ''} onChange={handleChange} className={inputClass} />
            </div>
            <div className="flex flex-col gap-1">
              <label className={labelClass}>Co. Fax</label>
              <input name="coFax" value={form.coFax ?? ''} onChange={handleChange} className={inputClass} />
            </div>
          </div>

          {/* Address */}
          <div className="flex flex-col gap-1">
            <label className={labelClass}>Address</label>
            <input name="address" value={form.address ?? ''} onChange={handleChange} className={inputClass} />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1 col-span-1">
              <label className={labelClass}>City</label>
              <input name="city" value={form.city ?? ''} onChange={handleChange} className={inputClass} />
            </div>
            <div className="flex flex-col gap-1">
              <label className={labelClass}>State</label>
              <input name="state" value={form.state ?? ''} onChange={handleChange} maxLength={2} className={inputClass} />
            </div>
            <div className="flex flex-col gap-1">
              <label className={labelClass}>Zip</label>
              <input name="zip" value={form.zip ?? ''} onChange={handleChange} className={inputClass} />
            </div>
          </div>

          {/* Photo */}
          <div className="flex flex-col gap-1">
            <label className={labelClass}>Photo <span className="text-neutral-400 font-normal">(optional)</span></label>
            <ImageUpload
              value={form.photo ?? ''}
              onChange={url => setForm(prev => ({ ...prev, photo: url }))}
              subfolder="bp-contacts"
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
              onClick={() => navigate('/bp-contacts')}
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
