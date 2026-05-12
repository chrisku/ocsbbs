import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, FormControlLabel, Checkbox } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createHotTopic } from '../../api/hotTopics';
import type { CreateHotTopicDto } from '../../types';
import usePageTitle from '../../hooks/usePageTitle';

const inputClass = 'w-full px-3 py-2 text-sm border border-neutral-300 rounded outline-none focus:ring-2 focus:ring-neutral-400 focus:border-neutral-400 transition';
const labelClass = 'text-sm font-medium text-neutral-700';

const Create = () => {
  usePageTitle('Create Hot Topic');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState<CreateHotTopicDto>({
    title:           '',
    titleTag:        '',
    metaDescription: '',
    url:             '',
    body:            '',
    publishedDate:   new Date().toISOString().split('T')[0],
    isFrontPage:     false,
    isPublished:     false,
  });

  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (dto: CreateHotTopicDto) => createHotTopic(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotTopics'] });
      navigate('/hot-topics');
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to create hot topic');
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.checked }));
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
          onClick={() => navigate('/hot-topics')}
          className="px-3 py-1.5 text-sm font-medium rounded border border-neutral-300 text-neutral-700 hover:bg-neutral-50 transition-colors"
        >
          Back
        </button>
        <h1 className="text-xl font-semibold text-neutral-800">Add Hot Topic</h1>
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
            <label className={labelClass}>Title <span className="text-red-500">*</span></label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelClass}>Title Tag <span className="text-neutral-400 font-normal">(SEO)</span></label>
            <input
              name="titleTag"
              value={form.titleTag}
              onChange={handleChange}
              maxLength={60}
              className={inputClass}
            />
            <span className="text-xs text-neutral-400">{form.titleTag.length}/60</span>
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelClass}>Meta Description <span className="text-neutral-400 font-normal">(SEO)</span></label>
            <input
              name="metaDescription"
              value={form.metaDescription}
              onChange={handleChange}
              maxLength={160}
              className={inputClass}
            />
            <span className="text-xs text-neutral-400">{form.metaDescription.length}/160</span>
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelClass}>External URL <span className="text-neutral-400 font-normal">(optional)</span></label>
            <input
              name="url"
              value={form.url}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelClass}>Body</label>
            <textarea
              name="body"
              value={form.body}
              onChange={handleChange}
              rows={10}
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelClass}>Published Date</label>
            <input
              name="publishedDate"
              type="date"
              value={form.publishedDate}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* Checkboxes */}
          <div className="flex flex-col gap-1">
            <FormControlLabel
              control={
                <Checkbox
                  name="isFrontPage"
                  checked={form.isFrontPage}
                  onChange={handleCheckbox}
                  size="small"
                />
              }
              label={<span className="text-sm text-neutral-700">Show on Front Page</span>}
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="isPublished"
                  checked={form.isPublished}
                  onChange={handleCheckbox}
                  size="small"
                />
              }
              label={<span className="text-sm text-neutral-700">Published</span>}
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
              onClick={() => navigate('/hot-topics')}
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