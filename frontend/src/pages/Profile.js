import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Paper,
  Grid,
  MenuItem,
  Card,
  CardContent,
  CardActions,
  Stack,
  Alert,
  Divider,
  Avatar
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CommentIcon from '@mui/icons-material/Comment';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import moment from 'moment';
import * as api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    profile: {
      firstname: '',
      lastname: '',
      age: '',
      gender: '',
      address: '',
      website: ''
    }
  });

  useEffect(() => {
    loadProfileAndPosts();
  }, []);

  const loadProfileAndPosts = async () => {
    try {
      const [profileData, postsData] = await Promise.all([
        api.getUserProfile(),
        api.getAllPosts()
      ]);

      setProfile(profileData);
      setFormData({
        username: profileData.username || '',
        email: profileData.email || '',
        password: '',
        profile: {
          firstname: profileData.profile?.firstname || '',
          lastname: profileData.profile?.lastname || '',
          age: profileData.profile?.age || '',
          gender: profileData.profile?.gender || '',
          address: profileData.profile?.address || '',
          website: profileData.profile?.website || ''
        }
      });
      
      const userPosts = postsData.filter(post => post.author === profileData.email);
      setUserPosts(userPosts);
      setLoading(false);
    } catch (error) {
      setError('Failed to load profile data');
      setLoading(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name.startsWith('profile.')) {
      const profileField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          [profileField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToUpdate = {
        ...formData,
        ...(formData.password ? { password: formData.password } : {})
      };
      await api.updateProfile(dataToUpdate);
      setSuccess('Profile updated successfully');
      setIsEditing(false);
      loadProfileAndPosts();
    } catch (error) {
      setError('Failed to update profile');
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await api.deletePost(postId);
      setUserPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
      setSuccess('Post deleted successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to delete post');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Typography>Loading profile...</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

            <Grid container spacing={3}>
        {/* Profile Section */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3, borderRadius: 1 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                {profile?.username}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {profile?.email}
              </Typography>
              <Button
                variant={isEditing ? "outlined" : "contained"}
                onClick={() => setIsEditing(!isEditing)}
                startIcon={<EditIcon />}
                size="small"
                sx={{ mt: 1 }}
              >
                {isEditing ? 'Cancel Editing' : 'Edit Profile'}
              </Button>
            </Box>

            <Divider sx={{ my: 3 }} />

            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <Stack spacing={2.5}>
                  <TextField
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    fullWidth
                    size="small"
                  />
                  <TextField
                    label="Email"
                    name="email"
                    value={formData.email}
                    disabled
                    fullWidth
                    size="small"
                  />
                  <TextField
                    label="New Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    fullWidth
                    size="small"
                    helperText="Leave blank to keep current password"
                  />
                  <TextField
                    label="First Name"
                    name="profile.firstname"
                    value={formData.profile.firstname}
                    onChange={handleInputChange}
                    fullWidth
                    size="small"
                  />
                  <TextField
                    label="Last Name"
                    name="profile.lastname"
                    value={formData.profile.lastname}
                    onChange={handleInputChange}
                    fullWidth
                    size="small"
                  />
                  <TextField
                    label="Age"
                    name="profile.age"
                    type="number"
                    value={formData.profile.age}
                    onChange={handleInputChange}
                    fullWidth
                    size="small"
                  />
                  <TextField
                    select
                    label="Gender"
                    name="profile.gender"
                    value={formData.profile.gender}
                    onChange={handleInputChange}
                    fullWidth
                    size="small"
                  >
                    <MenuItem value="M">Male</MenuItem>
                    <MenuItem value="F">Female</MenuItem>
                    <MenuItem value="O">Other</MenuItem>
                  </TextField>
                  <TextField
                    label="Address"
                    name="profile.address"
                    value={formData.profile.address}
                    onChange={handleInputChange}
                    fullWidth
                    size="small"
                    multiline
                    rows={2}
                  />
                  <TextField
                    label="Website"
                    name="profile.website"
                    value={formData.profile.website}
                    onChange={handleInputChange}
                    fullWidth
                    size="small"
                  />
                  <Button 
                    type="submit" 
                    variant="contained" 
                    fullWidth
                  >
                    Save Changes
                  </Button>
                </Stack>
              </form>
            ) : (
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Full Name
                  </Typography>
                  <Typography variant="body1">
                    {profile.profile?.firstname && profile.profile?.lastname 
                      ? `${profile.profile.firstname} ${profile.profile.lastname}`
                      : 'Not set'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Age
                  </Typography>
                  <Typography variant="body1">
                    {profile.profile?.age || 'Not set'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Gender
                  </Typography>
                  <Typography variant="body1">
                    {profile.profile?.gender === 'M' ? 'Male' :
                     profile.profile?.gender === 'F' ? 'Female' :
                     profile.profile?.gender === 'O' ? 'Other' : 'Not set'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Address
                  </Typography>
                  <Typography variant="body1">
                    {profile.profile?.address || 'Not set'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Website
                  </Typography>
                  <Typography variant="body1">
                    {profile.profile?.website ? (
                      <a href={profile.profile.website} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>
                        {profile.profile.website}
                      </a>
                    ) : 'Not set'}
                  </Typography>
                </Box>
              </Stack>
            )}
          </Paper>
        </Grid>

        {/* Posts Section */}
        <Grid item xs={12} md={9}>
          <Paper sx={{ p: 3, borderRadius: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                My Posts ({userPosts.length})
              </Typography>
              <Button
                variant="contained"
                component={RouterLink}
                to="/post/new"
                startIcon={<EditIcon />}
                size="small"
              >
                New Post
              </Button>
            </Box>

            {userPosts.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="text.secondary" variant="body1" gutterBottom>
                  You haven't created any posts yet
                </Typography>
                <Button
                  variant="contained"
                  component={RouterLink}
                  to="/post/new"
                  startIcon={<EditIcon />}
                  sx={{ mt: 2 }}
                >
                  Create Your First Post
                </Button>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {userPosts.map((post) => (
                  <Grid item xs={12} sm={6} key={post._id}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography 
                          variant="h6" 
                          component={RouterLink}
                          to={`/post/${post._id}`}
                          sx={{
                            color: 'text.primary',
                            textDecoration: 'none',
                            fontWeight: 500,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            mb: 1,
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
                          sx={{ 
                            mb: 2,
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}
                        >
                          {post.description}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="caption" color="text.secondary">
                            {moment(post.createdAt).format('MMM D, YYYY')}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CommentIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                              {post.comments?.length || 0}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                      <CardActions sx={{ borderTop: 1, borderColor: 'divider', p: 1.5, justifyContent: 'flex-end' }}>
                        <Button
                          size="small"
                          component={RouterLink}
                          to={`/post/${post._id}`}
                          sx={{ minWidth: 0, px: 1 }}
                        >
                          View
                        </Button>
                        <Button
                          size="small"
                          component={RouterLink}
                          to={`/post/${post._id}/edit`}
                          sx={{ minWidth: 0, px: 1 }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          onClick={() => handleDeletePost(post._id)}
                          sx={{ minWidth: 0, px: 1 }}
                        >
                          Delete
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
