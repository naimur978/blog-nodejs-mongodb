import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Box, 
  TextField, 
  Button, 
  Stack,
  Divider,
  IconButton
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import moment from 'moment';
import * as api from '../services/api';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await api.getPost(id);
        setPost(data);
      } catch (error) {
        setError('Failed to fetch post');
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    try {
      const response = await api.createComment(id, { content: comment });
      if (response.success) {
        setPost({
          ...post,
          comments: [...(post.comments || []), response.comment]
        });
        setComment('');
        setError('');
      } else {
        setError(response.message || 'Failed to add comment');
      }
    } catch (error) {
      setError(error.message || 'Failed to add comment');
      console.error('Error adding comment:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await api.deletePost(id);
      navigate('/');
    } catch (error) {
      setError('Failed to delete post');
      console.error('Error deleting post:', error);
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!post) return <Typography>Post not found</Typography>;

  return (
    <Container sx={{ py: 4 }}>
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography variant="h4" component="h1">{post.title}</Typography>
            {user && user.email === post.author && (
              <Box>
                <IconButton 
                  color="primary" 
                  onClick={() => navigate(`/post/${id}/edit`)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton 
                  color="error" 
                  onClick={handleDelete}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            )}
          </Box>
          
          <Typography variant="body1" paragraph>
            {post.body}
          </Typography>
          
          <Typography variant="caption" color="text.secondary">
            Posted by {post.author} • {moment(post.createdAt).fromNow()}
          </Typography>
        </CardContent>
      </Card>

      {user && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>Add a Comment</Typography>
            <form onSubmit={handleComment}>
              <TextField
                fullWidth
                multiline
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your comment here..."
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <Button 
                type="submit" 
                variant="contained" 
                disabled={!comment.trim()}
              >
                Post Comment
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Typography variant="h6" sx={{ mb: 2 }}>
        Comments ({post.comments?.length || 0})
      </Typography>
      
      <Stack spacing={2}>
        {post.comments?.length === 0 ? (
          <Typography color="text.secondary">No comments yet</Typography>
        ) : (
          post.comments?.map((comment) => (
            <Card key={comment._id} variant="outlined">
              <CardContent>
                <Typography variant="body1" paragraph>
                  {comment.message}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {comment.name} ({comment.email}) • {moment(comment.createdAt).fromNow()}
                </Typography>
              </CardContent>
            </Card>
          ))
        )}
      </Stack>
    </Container>
  );
};

export default PostDetail;
