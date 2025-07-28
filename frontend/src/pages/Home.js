import React, { useState, useEffect } from 'react';
import { Container, Card, CardContent, Typography, CardActions, Button, Stack, Box, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import moment from 'moment';
import { useAuth } from '../contexts/AuthContext';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CommentIcon from '@mui/icons-material/Comment';
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
      await api.deletePost(postId);
      setPosts(posts.filter(post => post._id !== postId));
    } catch (error) {
      setError('Failed to delete post');
      console.error('Error deleting post:', error);
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      {error && <Typography color="error">{error}</Typography>}
      {loading ? (
        <Typography>Loading posts...</Typography>
      ) : (
        <Stack spacing={3}>
          {posts.map((post) => (
            <Card key={post._id}>
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {post.title}
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  {post.description}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    Posted by {post.author} • {moment(post.createdAt).fromNow()}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {post.comments?.length || 0} comments
                  </Typography>
                </Box>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  startIcon={<CommentIcon />}
                  component={RouterLink} 
                  to={`/post/${post._id}`}
                >
                  Comment
                </Button>
                {user && user.email === post.author && (
                  <>
                    <IconButton 
                      size="small" 
                      component={RouterLink} 
                      to={`/post/${post._id}/edit`}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      size="small"
                      color="error"
                      onClick={() => handleDelete(post._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </>
                )}
              </CardActions>
            </Card>
          ))}
        </Stack>
      )}
    </Container>
  );
};

export default Home;
