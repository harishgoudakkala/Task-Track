import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Avatar,
} from '@mui/material';

import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';

const Header = ({ onLogout, onChangeProfile }) => {
  return (
    <AppBar position="sticky">
      <Toolbar
        sx={{
          maxWidth: '1400px',
          width: '100%',
          mx: 'auto',
          minHeight: '70px',
          px: { xs: 2, md: 4 },
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            flexGrow: 1,
          }}
        >
          <Avatar
            sx={{
              width: 38,
              height: 38,
              bgcolor: 'primary.main',
              fontWeight: 700,
              fontSize: '16px',
            }}
          >
            TT
          </Avatar>

          <Box>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: '18px',
                lineHeight: 1.2,
              }}
            >
              TaskTrack
            </Typography>

            <Typography
              sx={{
                fontSize: '11px',
                color: 'text.secondary',
              }}
            >
              Stay organized
            </Typography>
          </Box>
        </Box>

        {/* Actions */}
        <Button
          startIcon={<PersonIcon />}
          onClick={onChangeProfile}
          sx={{
            mr: 1,
            color: 'text.primary',
            '&:hover': {
              bgcolor: '#f1f5f9',
            },
          }}
        >
          Profile
        </Button>

        <IconButton
          onClick={onLogout}
          sx={{
            color: 'text.secondary',
            '&:hover': {
              color: 'error.main',
              bgcolor: '#fef2f2',
            },
          }}
        >
          <LogoutIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;