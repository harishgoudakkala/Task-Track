import React, { useState,useEffect } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useNavigate, useLocation } from'react-router-dom';
import path from './api/path';

const SignUp = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    otp: '',
    password: '',
    confirmPassword: ''
  });
  const [errorMessage, setErrorMessage] = useState({
    firstName: '',
    lastName: '',
    email: '',
    otp: '',
    password: '',
    confirmPassword: ''
  });

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const initialStep = queryParams.get('step');
    if (initialStep) {
      setStep(parseInt(initialStep, 10));
    }
  }, [location.search]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleGoogleLoginSuccess = async () => {
    try {
      window.location.href = path.googleAuth;

    } catch (e) {
      console.error('Error during Google login:', e);
      setErrorMessage(e.message);
    };
  };

  const handleNext = async () => {
    setErrorMessage({ email: '', otp: '', password: ''});
    if (step === 1 && formData.firstName && formData.lastName && formData.email) {
        try {
            const response = await fetch(path.signUpEmail, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email
                })
            });

            const data = response.ok ? await response.json() : {};

            if(response.status === 409) {
              throw new Error('Email already exists');
            }

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            if (data.is_verified) {
                throw new Error('Email already exists');
            }
            localStorage.setItem('token', data.token);
            setFormData({ ...formData, otp: '' });
            setStep(2);
        } catch (e) {
            console.error('Error checking email:', e);
            setErrorMessage({ ...errorMessage, email: e.message });
        }
    }
    // Step 2: Submit OTP
    else if (step === 2 && formData.otp) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(path.signUpOTP, {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    otp: formData.otp
                })
            });

            const data = response.ok ? await response.json() : {};

            if (response.status === 401) {
                throw new Error( 'OTP is incorrect');
            }

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            if (data.message === 'OTP is Correct') {
                setStep(3);
            } else {
                throw new Error('Invalid OTP');
            }
        } catch (e) {
            console.error('Error verifying OTP:', e);
            setErrorMessage({ ...errorMessage, otp: e.message });
        }
    }
    // Step 3: Submit Password
    else if (step === 3 && formData.password) {
      if (formData.password !== formData.confirmPassword) {
        setErrorMessage({ ...errorMessage, confirmPassword: 'Passwords do not match' });
        return;
      }
      const token = localStorage.getItem('token');
        try {
            const response = await fetch(path.signUpPassword, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                      Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    password: formData.password
                })
            });

            const data = response.ok ? await response.json() : {};
            if (response.status === 401) {
                throw new Error('Invalid Password');
            }
            if (response.ok) {
               navigate('/tasks');
            }
            console.log('Password set successfully:', response);
            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

        } catch (e) {
            console.error('Error during sign-up:', e);
            setErrorMessage({ ...errorMessage, password: e.message });
        }
    }
};

  const handleBack = () => {
    setErrorMessage({ email: '', otp: '', password: ''});
    if (step > 1) setStep(step - 1);
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
    {step === 1 && (
      <Box>
        <Typography variant="h6">Step 1: Enter your details</Typography>
        <TextField
          fullWidth
          margin="normal"
          name="firstName"
          label="First Name"
          value={formData.firstName}
          onChange={handleChange}
          error={!!errorMessage.firstName}
          helperText={errorMessage.firstName}
        />
        <TextField
          fullWidth
          margin="normal"
          name="lastName"
          label="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          error={!!errorMessage.lastName}
          helperText={errorMessage.lastName}
        />
        <TextField
          fullWidth
          margin="normal"
          name="email"
          label="Email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={!!errorMessage.email}
          helperText={errorMessage.email}
        />
      </Box>
    )}
    
    {step === 2 && (
      <Box>
        <Typography variant="h6">Step 2: Enter OTP</Typography>
        <TextField
          fullWidth
          margin="normal"
          name="otp"
          label="OTP"
          value={formData.otp}
          onChange={handleChange}
          error={!!errorMessage.otp}
          helperText={errorMessage.otp}
        />
      </Box>
    )}
    
    {step === 3 && (
      <Box>
        <Typography variant="h6">Step 3: Set your password</Typography>
        <TextField
          fullWidth
          margin="normal"
          name="password"
          label="Password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          error={!!errorMessage.password}
          helperText={errorMessage.password}
        />
        <TextField
          fullWidth
          margin="normal"
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={!!errorMessage.confirmPassword}
          helperText={errorMessage.confirmPassword}
        />
      </Box>
    )}

      <Box sx={{ mt: 2 }}>
        <Button variant="contained" onClick={handleBack} disabled={step === 1 || step===3} >
          Back
        </Button>
        <Button variant="contained" sx={{ ml: 2 }} onClick={handleNext}>
          {step === 3 ? 'Sign Up' : 'Next'}
        </Button>
      </Box>
      {step===1?<Button variant='contained'  onClick={handleGoogleLoginSuccess} sx={{ mt: 2 }} > Signup with Google</Button>: null}
    </Box>
  );
};

export default SignUp;
