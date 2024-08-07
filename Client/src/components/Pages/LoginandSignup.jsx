import React, { useState } from 'react';
import { Box, Button, Typography, Link } from '@mui/material';
import Login from '../Login';
import Signup from '../SignUp';

const LoginandSignup = () => {
  const [loginState, setLoginState] = useState("login");

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        p: 2,
      }}
    >
      {loginState === "login" ? (
        <Box
          sx={{
            maxWidth: 400,
            width: '100%',
            p: 3,
            border: '1px solid',
            borderRadius: 2,
            boxShadow: 2,
            textAlign: 'center',
          }}
        >
          
          <Login />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Don't have an account?{' '}
            <Link
              href="#"
              onClick={() => setLoginState("signup")}
              sx={{ cursor: 'pointer', color: 'primary.main' }}
            >
              Sign Up
            </Link>
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            maxWidth: 400,
            width: '100%',
            p: 3,
            border: '1px solid',
            borderRadius: 2,
            boxShadow: 2,
            textAlign: 'center',
          }}
        >
          
          <Signup />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Already have an account?{' '}
            <Link
              href="#"
              onClick={() => setLoginState("login")}
              sx={{ cursor: 'pointer', color: 'primary.main' }}
            >
              Login
            </Link>
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default LoginandSignup;
