import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createUser } from '../../api/users';
import type { CreateUserDto } from '../types';
import { getUserCompanies } from '../../api/userCompanies';
import usePageTitle from '../../hooks/usePageTitle';

const AVAILABLE_ROLES = ['OCSBBS', 'BP', 'NRF', 'LFD', 'LawFirm', 'FA', 'Employee', 'Admin', 'Inactive'];

const Create = () => {
  usePageTitle('Create User');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState<CreateUserDto>({
    username:      '',
    email:         '',
    firstName:     '',
    lastName:      '',
    userCompanyId: null,
    password:      '',
    roles:         [],
  });

  const [error, setError] = useState<string | null>(null);

  const { data: companies } = useQuery({
    queryKey: ['userCompanies'],
    queryFn:  () => getUserCompanies(1, 9999),
  });

  const mutation = useMutation({
    mutationFn: (dto: CreateUserDto) => createUser(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      navigate('/users');
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to create user');
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRoleChange = (role: string, checked: boolean) => {
    setForm(prev => ({
      ...prev,
      roles: checked
        ? [...prev.roles, role]
        : prev.roles.filter(r => r !== role),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    mutation.mutate(form);
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6">

      {/* ── Header ── */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/users')}
          className="px-3 py-1.5 text-sm font-medium rounded border border-neutral-300 text-neutral-700 hover:bg-neutral-50 transition-colors"
        >
          Back
        </button>
        <h1 className="text-xl font-semibold text-neutral-800">Add User</h1>
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
            <label className="text-sm font-medium text-neutral-700">Username <span className="text-red-500">*</span></label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              className="px-3 py-2 text-sm border border-neutral-300 rounded outline-none focus:ring-2 focus:ring-neutral-400 focus:border-neutral-400 transition"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-neutral-700">Email <span className="text-red-500">*</span></label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="px-3 py-2 text-sm border border-neutral-300 rounded outline-none focus:ring-2 focus:ring-neutral-400 focus:border-neutral-400 transition"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-sm font-medium text-neutral-700">First Name <span className="text-red-500">*</span></label>
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                required
                className="px-3 py-2 text-sm border border-neutral-300 rounded outline-none focus:ring-2 focus:ring-neutral-400 focus:border-neutral-400 transition"
              />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-sm font-medium text-neutral-700">Last Name <span className="text-red-500">*</span></label>
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                required
                className="px-3 py-2 text-sm border border-neutral-300 rounded outline-none focus:ring-2 focus:ring-neutral-400 focus:border-neutral-400 transition"
              />
            </div>
          </div>

          {/* Company — kept as MUI Select since it's a controlled dropdown */}
          <FormControl fullWidth size="small">
            <InputLabel>Company</InputLabel>
            <Select
              value={form.userCompanyId ?? 0}
              label="Company"
              onChange={e => setForm(prev => ({
                ...prev,
                userCompanyId: e.target.value === 0 ? null : Number(e.target.value),
              }))}
            >
              <MenuItem value={0}><em>No Company</em></MenuItem>
              {companies?.items?.map(company => (
                <MenuItem key={company.id} value={company.id}>
                  {company.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-neutral-700">Password <span className="text-red-500">*</span></label>
            <input
              name="password"
              type="password"
              value={form.password}
              autoComplete="new-password"
              onChange={handleChange}
              required
              className="px-3 py-2 text-sm border border-neutral-300 rounded outline-none focus:ring-2 focus:ring-neutral-400 focus:border-neutral-400 transition"
            />
          </div>

          {/* Roles */}
          <div>
            <p className="text-sm font-medium text-neutral-700 mb-2">Roles</p>
            <FormGroup row>
              {AVAILABLE_ROLES.map(role => (
                <FormControlLabel
                  key={role}
                  control={
                    <Checkbox
                      size="small"
                      checked={form.roles.includes(role)}
                      onChange={e => handleRoleChange(role, e.target.checked)}
                    />
                  }
                  label={<span className="text-sm text-neutral-700">{role}</span>}
                />
              ))}
            </FormGroup>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="px-4 py-2 text-sm font-medium rounded bg-neutral-800 text-white hover:bg-neutral-700 disabled:opacity-50 transition-colors"
            >
              {mutation.isPending ? 'Saving...' : 'Save User'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/users')}
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