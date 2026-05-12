import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  TextField,
  Alert,
  Paper,
  FormControlLabel,
  Checkbox,
  CircularProgress
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getHotTopicById, updateHotTopic } from '../../api/hotTopics';
import type { UpdateHotTopicDto } from '../types';
import usePageTitle from '../../hooks/usePageTitle';

const Edit = () => {
  usePageTitle('Edit Hot Topic');
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState<UpdateHotTopicDto>({
    title: '',
    titleTag: '',
    metaDescription: '',
    url: '',
    body: '',
    publishedDate: '',
    isFrontPage: false,
    isPublished: false
  });

  const [error, setError] = useState<string | null>(null);

  const { data: hotTopic, isLoading } = useQuery({
    queryKey: ['hotTopic', id],
    queryFn: () => getHotTopicById(Number(id))
  });

  useEffect(() => {
    if (hotTopic) {
      setForm({
        title: hotTopic.title,
        titleTag: hotTopic.titleTag,
        metaDescription: hotTopic.metaDescription,
        url: hotTopic.url,
        body: hotTopic.body,
        publishedDate: hotTopic.publishedDate.split('T')[0],
        isFrontPage: hotTopic.isFrontPage,
        isPublished: hotTopic.isPublished
      });
    }
  }, [hotTopic]);

  const mutation = useMutation({
    mutationFn: (dto: UpdateHotTopicDto) => updateHotTopic(Number(id), dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotTopics'] });
      navigate('/hot-topics');
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to update hot topic');
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  if (isLoading) return <CircularProgress />;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button variant="outlined" onClick={() => navigate('/hot-topics')}>
          Back
        </Button>
        <Typography variant="h5" component="h1">
          Edit Hot Topic — {hotTopic?.title}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Title"
            name="title"
            fullWidth
            margin="normal"
            value={form.title}
            onChange={handleChange}
            required
          />
          <TextField
            label="Title Tag (SEO)"
            name="titleTag"
            fullWidth
            margin="normal"
            value={form.titleTag}
            onChange={handleChange}
            inputProps={{ maxLength: 60 }}
            helperText={`${form.titleTag.length}/60`}
          />
          <TextField
            label="Meta Description (SEO)"
            name="metaDescription"
            fullWidth
            margin="normal"
            value={form.metaDescription}
            onChange={handleChange}
            inputProps={{ maxLength: 160 }}
            helperText={`${form.metaDescription.length}/160`}
          />
          <TextField
            label="External URL (optional)"
            name="url"
            fullWidth
            margin="normal"
            value={form.url}
            onChange={handleChange}
          />
          <TextField
            label="Body"
            name="body"
            fullWidth
            margin="normal"
            multiline
            rows={10}
            value={form.body}
            onChange={handleChange}
          />
          <TextField
            label="Published Date"
            name="publishedDate"
            type="date"
            fullWidth
            margin="normal"
            value={form.publishedDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
          <FormControlLabel
            control={
              <Checkbox
                name="isFrontPage"
                checked={form.isFrontPage}
                onChange={handleCheckbox}
              />
            }
            label="Show on Front Page"
          />
          <FormControlLabel
            control={
              <Checkbox
                name="isPublished"
                checked={form.isPublished}
                onChange={handleCheckbox}
              />
            }
            label="Published"
          />

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button variant="outlined" onClick={() => navigate('/hot-topics')}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Edit;