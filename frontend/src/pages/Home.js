import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Card, 
  CardContent, 
  Typography, 
  CardActions, 
  Button, 
  Stack, 
  Box, 
  IconButton, 
  Chip,
  Avatar,
  Divider,
  CircularProgress,
  Grid,
  Paper,
  Alert
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import moment from 'moment';
import { useAuth } from '../contexts/AuthContext';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CommentIcon from '@mui/icons-material/Comment';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PersonIcon from '@mui/icons-material/Person';
import * as api from '../services/api';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await api.getAllPosts();
        console.log('Posts received:', response);
        setPosts(response || []);
      } catch (error) {
        setError('Failed to fetch posts');
        console.error('Error fetching posts:', error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleDelete = async (postId) => {
    try {
      setLoading(true);
      console.log('Deleting post with ID:', postId);
      const response = await api.deletePost(postId);
      console.log('Delete response:', response);
      
      // Update the posts list by removing the deleted post
      setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
      
      // Show success message
      setError(''); // Clear any previous errors
      alert('Post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
      setError('Failed to delete post: ' + (error.message || 'Unknown error'));
      alert('Failed to delete post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom 
          sx={{ 
            fontWeight: 700, 
            background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Explore the Latest Stories
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', mb: 2 }}>
          Discover insights, perspectives, and stories from our community of writers
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
          <CircularProgress size={60} />
        </Box>
      ) : posts.length === 0 ? (
        <Paper elevation={0} sx={{ p: 4, textAlign: 'center', backgroundColor: 'background.default' }}>
          <Typography variant="h5" gutterBottom>No posts yet</Typography>
          <Typography variant="body1" color="text.secondary">Be the first to share your thoughts!</Typography>
          {user && (
            <Button
              variant="contained"
              component={RouterLink}
              to="/post/new"
              sx={{ mt: 3 }}
              startIcon={<EditIcon />}
            >
              Create First Post
            </Button>
          )}
        </Paper>
      ) : (
        <Stack spacing={3}>
          {posts.map((post) => {
            // Extract the first letter of email for avatar
            const authorInitial = post.author ? post.author.charAt(0).toUpperCase() : 'A';
            const authorEmail = post.author || 'Anonymous';
            const authorName = authorEmail.split('@')[0]; // Simplistic way to get username from email
            
            return (
              <Card 
                key={post._id}
                sx={{ 
                  width: '100%',
                  display: 'flex', 
                  flexDirection: 'column',
                  position: 'relative'
                }}
              >
                {/* Always show edit and delete buttons for now, since we can't properly compare user.email with post.author */}
                {/* Corner edit/delete buttons removed as requested */}
                <CardContent sx={{ pt: 4, px: 4, pb: 2, flexGrow: 1 }}>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component={RouterLink}
                    to={`/post/${post._id}`}
                    sx={{
                      color: 'text.primary',
                      textDecoration: 'none',
                      fontWeight: 600,
                      display: 'block',
                      mb: 2,
                      '&:hover': {
                        color: 'primary.main',
                      }
                    }}
                  >
                    {post.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    paragraph
                    sx={{ 
                      mb: 2,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {post.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ width: 28, height: 28, mr: 1, bgcolor: 'primary.main' }}>
                      {authorInitial}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 500, lineHeight: 1.2 }}>
                        {authorName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2 }}>
                        {moment(post.createdAt).format('MMM D, YYYY')}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    <Chip 
                      icon={<CommentIcon fontSize="small" />} 
                      label={`${post.comments?.length || 0} comments`}
                      size="small"
                      variant="outlined"
                    />
                  </Stack>
                </CardContent>
                
                <Divider />
                
                                    <CardActions sx={{ p: 2, flexDirection: {xs: 'column', sm: 'row'}, alignItems: 'stretch', gap: 1 }}>
                  <Box sx={{ display: 'flex', width: {xs: '100%', sm: 'auto'} }}>
                    <Button 
                      variant="contained"
                      fullWidth
                      component={RouterLink} 
                      to={`/post/${post._id}`}
                      endIcon={<VisibilityIcon />}
                    >
                      Read More
                    </Button>
                  </Box>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'flex-end',
                    gap: 1,
                    width: {xs: '100%', sm: 'auto'},
                    mt: {xs: 1, sm: 0}
                  }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      component={RouterLink}
                      to={`/post/${post._id}/edit`}
                      startIcon={<EditIcon />}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDelete(post._id)}
                      startIcon={<DeleteIcon />}
                    >
                      Delete
                    </Button>
                  </Box>
                </CardActions>
              </Card>
            );
          })}
        </Stack>
      )}
    </Container>
  );
};

export default Home;
