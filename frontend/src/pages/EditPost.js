import React, { useState, useEffect } from 'react';
import { 
  Container, 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Paper, 
  Grid, 
  InputAdornment,
  Alert,
  Divider,
  CircularProgress,
  Chip,
  Stack
} from '@mui/material';
import { useNavigate, Link as RouterLink, useParams } from 'react-router-dom';
import * as api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import TitleIcon from '@mui/icons-material/Title';
import DescriptionIcon from '@mui/icons-material/Description';
import ArticleIcon from '@mui/icons-material/Article';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LockIcon from '@mui/icons-material/Lock';

const EditPost = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [postAuthor, setPostAuthor] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const post = await api.getPost(id);
        if (post) {
          setTitle(post.title || '');
          setDescription(post.description || '');
          setBody(post.body || '');
          setPostAuthor(post.author || '');
          
          // Check if the current user is the author
          if (user && user.email === post.author) {
            setIsAuthorized(true);
          } else {
            console.log('Current user:', user?.email);
            console.log('Post author:', post.author);
            setIsAuthorized(false);
            setError('You can only edit your own posts');
          }
        } else {
          setError('Post not found');
        }
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to load post. ' + (err.message || ''));
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchPost();
    } else {
      setLoading(false);
      setError('Please log in to edit posts');
    }
  }, [id, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check authorization again before submitting
    if (!isAuthorized) {
      setError('You do not have permission to edit this post');
      return;
    }
    
    setSaving(true);
    setError('');
    setSuccess('');
    
    try {
      await api.updatePost(id, { title, description, body });
      setSuccess('Post updated successfully');
      
      // Navigate back after a short delay
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      console.error('Error updating post:', error);
      setError(error.message || 'Failed to update post');
      
      // If unauthorized error occurs
      if (error.message && error.message.includes('only update your own posts')) {
        setIsAuthorized(false);
      }
    } finally {
      setSaving(false);
    }
  };

  const isFormValid = title.trim() !== '' && description.trim() !== '' && body.trim() !== '';

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading post...
        </Typography>
      </Container>
    );
  }
  
  // If user is not the author, show unauthorized message
  if (!isAuthorized && !loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <LockIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Access Denied
          </Typography>
          <Typography variant="body1" paragraph>
            You do not have permission to edit this post. Only the author can edit their own posts.
          </Typography>
          <Button 
            variant="contained" 
            component={RouterLink} 
            to="/"
            sx={{ mr: 2 }}
          >
            Back to Home
          </Button>
          <Button 
            variant="outlined"
            component={RouterLink}
            to={`/post/${id}`}
          >
            View Post
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={10} lg={10} sx={{ mx: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Button 
              component={RouterLink} 
              to="/" 
              startIcon={<ArrowBackIcon />}
              sx={{ mr: 2 }}
            >
              Back
            </Button>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 600, flexGrow: 1 }}>
              Edit Post
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 4 }}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mb: 4 }}>
              {success}
            </Alert>
          )}

          <Paper elevation={2} sx={{ p: { xs: 3, md: 5 }, borderRadius: 2 }}>
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Stack spacing={3}>
                <TextField
                  label="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  fullWidth
                  variant="outlined"
                  placeholder="Enter an engaging title"
                  helperText="A clear, descriptive title will attract more readers"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <TitleIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
                
                <TextField
                  label="Brief Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={2}
                  placeholder="Write a short summary of your post"
                  helperText="This will appear in post previews"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DescriptionIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
                
                <Divider sx={{ my: 1 }}>
                  <Chip label="Content" />
                </Divider>
                
                <TextField
                  label="Post Content"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  required
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={12}
                  placeholder="Share your thoughts, ideas, or story here..."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ArticleIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={() => navigate('/')}
                    sx={{ mr: 2 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                    disabled={saving || !isFormValid}
                  >
                    {saving ? 'Saving...' : 'Update Post'}
                  </Button>
                </Box>
              </Stack>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default EditPost;
