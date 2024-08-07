import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import {useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import path from './api/path';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleSignIn = async () => {
    setErrorMessage('');
    if (!email || !password) {
      setErrorMessage('Email and password are required.');
      return;
    }

    try {
      const response = await fetch(path.login, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      const data = response.ok ? await response.json() : {};

      switch (response.status) {
        case 200:
          if (data.token) {
            localStorage.setItem('token', data.token);
            navigate('/tasks');
            break;
          } else {
            throw new Error('No token received');
          }
        case 401:
          setErrorMessage('Please check your email and password.');
          break;
        case 404:
          setErrorMessage('User not found. Please check your email or sign up.');
          break;
        default:
          setErrorMessage(data.message || 'Something went wrong. Please try again.');
      }
    } catch (e) {
      console.error('Error during login:', e);
      setErrorMessage(e.message);
    }
  };

  const handleGoogleLoginSuccess = async () => {
    try {
      window.location.href = path.googleAuth;

    } catch (e) {
      console.error('Error during Google login:', e);
      setErrorMessage(e.message);
    };
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h6">Login</Typography>
      <TextField
        fullWidth
        margin="normal"
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={!!errorMessage}
        helperText={errorMessage}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={!!errorMessage}
        helperText={errorMessage}
      />
      <Box sx={{ mt: 2 }}>
        <Button variant="contained" onClick={handleSignIn} fullWidth>
          Login
        </Button>
      </Box>
      <Box sx={{ mt: 2 }}>
        <Box sx={{ width: '100%' }}>
          <Button variant="contained" onClick={handleGoogleLoginSuccess} fullWidth>Login with Google</Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
