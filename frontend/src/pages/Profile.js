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
  IconButton,
  Stack,
  Divider,
  Alert
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CommentIcon from '@mui/icons-material/Comment';
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
      setLoading(true);
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
      
      // Filter posts for the current user
      const userPosts = postsData.filter(post => post.author === profileData.email);
      setUserPosts(userPosts);
    } catch (error) {
      setError(error.message || 'Failed to load profile');
    } finally {
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
        // Only include password if it was changed
        ...(formData.password ? { password: formData.password } : {})
      };
      await api.updateProfile(dataToUpdate);
      setSuccess('Profile updated successfully');
      setIsEditing(false);
      loadProfileAndPosts(); // Reload the profile data
    } catch (error) {
      setError(error.message || 'Failed to update profile');
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await api.deletePost(postId);
      setUserPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
    } catch (error) {
      setError('Failed to delete post');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography>Loading profile...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Paper sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5">Profile Information</Typography>
              <Button onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </Box>

            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <TextField
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    fullWidth
                  />
                  <TextField
                    label="Email"
                    name="email"
                    value={formData.email}
                    disabled
                    fullWidth
                  />
                  <TextField
                    label="New Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    fullWidth
                    helperText="Leave blank to keep current password"
                  />
                  <TextField
                    label="First Name"
                    name="profile.firstname"
                    value={formData.profile.firstname}
                    onChange={handleInputChange}
                    fullWidth
                  />
                  <TextField
                    label="Last Name"
                    name="profile.lastname"
                    value={formData.profile.lastname}
                    onChange={handleInputChange}
                    fullWidth
                  />
                  <TextField
                    label="Age"
                    name="profile.age"
                    type="number"
                    value={formData.profile.age}
                    onChange={handleInputChange}
                    fullWidth
                  />
                  <TextField
                    select
                    label="Gender"
                    name="profile.gender"
                    value={formData.profile.gender}
                    onChange={handleInputChange}
                    fullWidth
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
                    multiline
                    rows={2}
                  />
                  <TextField
                    label="Website"
                    name="profile.website"
                    value={formData.profile.website}
                    onChange={handleInputChange}
                    fullWidth
                  />
                  <Button type="submit" variant="contained">Save Changes</Button>
                </Stack>
              </form>
            ) : (
              <Stack spacing={2}>
                <Typography><strong>Username:</strong> {profile.username}</Typography>
                <Typography><strong>Email:</strong> {profile.email}</Typography>
                <Typography><strong>First Name:</strong> {profile.profile?.firstname || 'Not set'}</Typography>
                <Typography><strong>Last Name:</strong> {profile.profile?.lastname || 'Not set'}</Typography>
                <Typography><strong>Age:</strong> {profile.profile?.age || 'Not set'}</Typography>
                <Typography><strong>Gender:</strong> {
                  profile.profile?.gender === 'M' ? 'Male' :
                  profile.profile?.gender === 'F' ? 'Female' :
                  profile.profile?.gender === 'O' ? 'Other' : 'Not set'
                }</Typography>
                <Typography><strong>Address:</strong> {profile.profile?.address || 'Not set'}</Typography>
                <Typography><strong>Website:</strong> {profile.profile?.website || 'Not set'}</Typography>
              </Stack>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
              My Posts ({userPosts.length})
            </Typography>
            <Stack spacing={2}>
              {userPosts.length === 0 ? (
                <Typography color="text.secondary">You haven't created any posts yet.</Typography>
              ) : (
                userPosts.map((post) => (
                  <Card key={post._id} variant="outlined">
                    <CardContent>
                      <Typography variant="h6" component="h2" gutterBottom>
                        {post.title}
                      </Typography>
                      <Typography color="text.secondary" paragraph>
                        {post.description}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                          Posted {moment(post.createdAt).fromNow()}
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
                        View & Comment
                      </Button>
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
                        onClick={() => handleDeletePost(post._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </CardActions>
                  </Card>
                ))
              )}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
