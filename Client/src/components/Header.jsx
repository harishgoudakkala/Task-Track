import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box } from '@mui/material';

const Header = ({ onLogout, onChangeProfile }) => {
  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <IconButton edge="start" color="inherit" aria-label="logo">
            
          </IconButton>
          <Typography variant="h6" sx={{ ml: 2 }}>
            My Application
          </Typography>
        </Box>
        <Button color="inherit" onClick={onChangeProfile} sx={{ mr: 2 }}>
          Change Profile
        </Button>
        <Button color="inherit" onClick={onLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
