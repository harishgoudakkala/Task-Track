import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Divider,
  Paper,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  EmailOutlined,
  LockOutlined,
  Visibility,
  VisibilityOff,
  TaskAlt,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import path from './api/path';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignIn = async () => {
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Email and password are required.');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(path.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = response.ok ? await response.json() : {};

      switch (response.status) {
        case 200:
          if (data.token) {
            localStorage.setItem('token', data.token);
            navigate('/tasks');
          } else {
            throw new Error('No token received');
          }
          break;

        case 401:
          setErrorMessage('Please check your email and password.');
          break;

        case 404:
          setErrorMessage(
            'User not found. Please check your email or sign up.'
          );
          break;

        default:
          setErrorMessage(
            data.message || 'Something went wrong. Please try again.'
          );
      }
    } catch (e) {
      console.error('Error during login:', e);
      setErrorMessage(
        e instanceof Error
          ? e.message
          : 'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLoginSuccess = () => {
    try {
      window.location.href = path.googleAuth;
    } catch (e) {
      console.error('Error during Google login:', e);
      setErrorMessage(
        e instanceof Error
          ? e.message
          : 'Google login failed. Please try again.'
      );
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        py: 4,
        background:
          'linear-gradient(135deg, #eef2ff 0%, #f8fafc 50%, #e0e7ff 100%)',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 430,
          p: { xs: 3, sm: 4 },
          borderRadius: 4,
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          boxShadow: '0 20px 50px rgba(15, 23, 42, 0.10)',
        }}
      >
        {/* Logo / Brand */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: 2,
          }}
        >
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: 2.5,
              backgroundColor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(79, 70, 229, 0.25)',
            }}
          >
            <TaskAlt
              sx={{
                color: '#fff',
                fontSize: 30,
              }}
            />
          </Box>
        </Box>

        {/* Heading */}
        <Typography
          align="center"
          sx={{
            fontSize: '28px',
            fontWeight: 800,
            color: '#172033',
            letterSpacing: '-0.5px',
          }}
        >
          Welcome back
        </Typography>

        <Typography
          align="center"
          sx={{
            mt: 0.8,
            mb: 3.5,
            fontSize: '14px',
            color: '#64748b',
          }}
        >
          Sign in to continue managing your tasks
        </Typography>

        {/* Email */}
        <TextField
          fullWidth
          label="Email address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!errorMessage}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailOutlined sx={{ color: '#94a3b8' }} />
              </InputAdornment>
            ),
          }}
        />

        {/* Password */}
        <TextField
          fullWidth
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={!!errorMessage}
          helperText={errorMessage || ' '}
          sx={{
            mb: 1,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockOutlined sx={{ color: '#94a3b8' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword((prev) => !prev)}
                  edge="end"
                >
                  {showPassword ? (
                    <VisibilityOff />
                  ) : (
                    <Visibility />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Login */}
        <Button
          variant="contained"
          fullWidth
          onClick={handleSignIn}
          disabled={loading}
          sx={{
            mt: 1,
            py: 1.35,
            borderRadius: 2,
            fontSize: '15px',
            fontWeight: 700,
            backgroundColor: 'primary.main',
            boxShadow: '0 6px 16px rgba(79, 70, 229, 0.25)',
            '&:hover': {
              backgroundColor: 'primary.dark',
              boxShadow: '0 8px 20px rgba(79, 70, 229, 0.30)',
            },
          }}
        >
          {loading ? 'Signing in...' : 'Login'}
        </Button>

        {/* Divider */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            my: 3,
          }}
        >
          <Divider sx={{ flex: 1 }} />

          <Typography
            sx={{
              fontSize: '12px',
              color: '#94a3b8',
              whiteSpace: 'nowrap',
            }}
          >
            OR
          </Typography>

          <Divider sx={{ flex: 1 }} />
        </Box>

        {/* Google Login */}
        <Button
          variant="outlined"
          fullWidth
          onClick={handleGoogleLoginSuccess}
          sx={{
            py: 1.25,
            borderRadius: 2,
            borderColor: '#d1d5db',
            color: '#334155',
            fontWeight: 600,
            backgroundColor: '#fff',
            '&:hover': {
              backgroundColor: '#f8fafc',
              borderColor: '#94a3b8',
            },
          }}
        >
          Continue with Google
        </Button>

        {/* Signup */}
        <Typography
          align="center"
          sx={{
            mt: 3,
            fontSize: '13px',
            color: '#64748b',
          }}
        >
          Don't have an account?{' '}
          <Box
            component="span"
            onClick={() => navigate('/signup')}
            sx={{
              color: 'primary.main',
              fontWeight: 700,
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            Sign up
          </Box>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;