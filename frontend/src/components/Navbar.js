import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Container, 
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Tooltip
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import CreateIcon from '@mui/icons-material/Create';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = async () => {
    try {
      handleCloseUserMenu();
      await logout(navigate);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
    <AppBar position="sticky" elevation={1} sx={{ backgroundColor: 'background.paper', borderRadius: 0 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo on larger screens */}
          <Typography
            variant="h5"
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              color: 'primary.main',
              textDecoration: 'none',
            }}
          >
            BlogSpace
          </Typography>

          {/* Mobile menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              onClick={handleOpenNavMenu}
              color="primary"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {user ? (
                [
                  <MenuItem key="new-post" onClick={handleCloseNavMenu} component={RouterLink} to="/post/new">
                    <CreateIcon sx={{ mr: 1, fontSize: 20 }} />
                    <Typography textAlign="center">New Post</Typography>
                  </MenuItem>
                ]
              ) : (
                [
                  <MenuItem key="login" onClick={handleCloseNavMenu} component={RouterLink} to="/login">
                    <LoginIcon sx={{ mr: 1, fontSize: 20 }} />
                    <Typography textAlign="center">Login</Typography>
                  </MenuItem>,
                  <MenuItem key="register" onClick={handleCloseNavMenu} component={RouterLink} to="/register">
                    <HowToRegIcon sx={{ mr: 1, fontSize: 20 }} />
                    <Typography textAlign="center">Register</Typography>
                  </MenuItem>
                ]
              )}
            </Menu>
          </Box>

          {/* Logo on mobile screens */}
          <Typography
            variant="h5"
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontWeight: 700,
              color: 'primary.main',
              textDecoration: 'none',
            }}
          >
            BlogSpace
          </Typography>

          {/* Desktop menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {user && (
              <Button
                component={RouterLink}
                to="/post/new"
                startIcon={<CreateIcon />}
                sx={{ my: 2, color: 'primary.main', display: 'flex', mr: 2 }}
              >
                New Post
              </Button>
            )}
          </Box>

          {/* User menu */}
          <Box sx={{ flexGrow: 0 }}>
            {user ? (
              <>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      {getInitials(user.username)}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem component={RouterLink} to="/profile" onClick={handleCloseUserMenu}>
                    <AccountCircleIcon sx={{ mr: 1, fontSize: 20 }} />
                    <Typography textAlign="center">Profile</Typography>
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <LogoutIcon sx={{ mr: 1, fontSize: 20 }} />
                    <Typography textAlign="center">Logout</Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                <Button
                  component={RouterLink}
                  to="/login"
                  startIcon={<LoginIcon />}
                  sx={{ color: 'text.primary', mr: 1 }}
                >
                  Login
                </Button>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  startIcon={<HowToRegIcon />}
                  sx={{ ml: 1 }}
                >
                  Register
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
