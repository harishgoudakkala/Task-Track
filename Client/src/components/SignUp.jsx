import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Divider,
  InputAdornment,
  IconButton,
  LinearProgress,
} from '@mui/material';

import {
  PersonOutline,
  EmailOutlined,
  LockOutlined,
  KeyOutlined,
  Visibility,
  VisibilityOff,
  ArrowBack,
  ArrowForward,
  TaskAlt,
} from '@mui/icons-material';

import { useNavigate, useLocation } from 'react-router-dom';
import path from './api/path';

const SignUp = () => {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    otp: '',
    password: '',
    confirmPassword: '',
  });

  const [errorMessage, setErrorMessage] = useState({
    firstName: '',
    lastName: '',
    email: '',
    otp: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const initialStep = queryParams.get('step');

    if (initialStep) {
      const parsedStep = parseInt(initialStep, 10);

      if (parsedStep >= 1 && parsedStep <= 3) {
        setStep(parsedStep);
      }
    }
  }, [location.search]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrorMessage((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  const getErrorMessage = (error) => {
    return error instanceof Error
      ? error.message
      : 'Something went wrong. Please try again.';
  };

  const handleGoogleLoginSuccess = () => {
    try {
      window.location.href = path.googleAuth;
    } catch (e) {
      console.error('Error during Google login:', e);

      setErrorMessage((prev) => ({
        ...prev,
        email: getErrorMessage(e),
      }));
    }
  };

  const handleNext = async () => {
    setErrorMessage({
      firstName: '',
      lastName: '',
      email: '',
      otp: '',
      password: '',
      confirmPassword: '',
    });

    // =========================
    // STEP 1 - EMAIL
    // =========================

    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.email) {
        setErrorMessage({
          firstName: !formData.firstName
            ? 'First name is required'
            : '',
          lastName: !formData.lastName
            ? 'Last name is required'
            : '',
          email: !formData.email
            ? 'Email is required'
            : '',
          otp: '',
          password: '',
          confirmPassword: '',
        });

        return;
      }

      try {
        setLoading(true);

        const response = await fetch(path.signUpEmail, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
          }),
        });

        const data = response.ok
          ? await response.json()
          : {};

        if (response.status === 409) {
          throw new Error('Email already exists');
        }

        if (!response.ok) {
          throw new Error(
            data.message || 'Something went wrong'
          );
        }

        if (data.is_verified) {
          throw new Error('Email already exists');
        }

        localStorage.setItem('token', data.token);

        setFormData((prev) => ({
          ...prev,
          otp: '',
        }));

        setStep(2);
      } catch (e) {
        console.error('Error checking OTP:', e);

        setErrorMessage((prev) => ({
          ...prev,
          email: getErrorMessage(e),
        }));
      } finally {
        setLoading(false);
      }
    }

    // =========================
    // STEP 2 - OTP
    // =========================

    else if (step === 2) {
      if (!formData.otp) {
        setErrorMessage((prev) => ({
          ...prev,
          otp: 'OTP is required',
        }));

        return;
      }

      try {
        setLoading(true);

        const token = localStorage.getItem('token');

        const response = await fetch(path.signUpOTP, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            otp: formData.otp,
          }),
        });

        const data = response.ok
          ? await response.json()
          : {};

        if (response.status === 401) {
          throw new Error('OTP is incorrect');
        }

        if (!response.ok) {
          throw new Error(
            data.message || 'Something went wrong'
          );
        }

        if (data.message === 'OTP is Correct') {
          setStep(3);
        } else {
          throw new Error('Invalid OTP');
        }
      } catch (e) {
        console.error('Error verifying OTP:', e);

        setErrorMessage((prev) => ({
          ...prev,
          otp: getErrorMessage(e),
        }));
      } finally {
        setLoading(false);
      }
    }

    // =========================
    // STEP 3 - PASSWORD
    // =========================

    else if (step === 3) {
      if (!formData.password || !formData.confirmPassword) {
        setErrorMessage((prev) => ({
          ...prev,
          password: !formData.password
            ? 'Password is required'
            : '',
          confirmPassword: !formData.confirmPassword
            ? 'Please confirm your password'
            : '',
        }));

        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setErrorMessage((prev) => ({
          ...prev,
          confirmPassword: 'Passwords do not match',
        }));

        return;
      }

      const token = localStorage.getItem('token');

      try {
        setLoading(true);

        const response = await fetch(path.signUpPassword, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            password: formData.password,
          }),
        });

        const data = response.ok
          ? await response.json()
          : {};

        if (response.status === 401) {
          throw new Error('Invalid Password');
        }

        if (!response.ok) {
          throw new Error(
            data.message || 'Something went wrong'
          );
        }

        navigate('/tasks');

      } catch (e) {
        console.error('Error during sign-up:', e);

        setErrorMessage((prev) => ({
          ...prev,
          password: getErrorMessage(e),
        }));
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    setErrorMessage({
      firstName: '',
      lastName: '',
      email: '',
      otp: '',
      password: '',
      confirmPassword: '',
    });

    if (step > 1) {
      setStep(step - 1);
    }
  };

  const progress = (step / 3) * 100;

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
          maxWidth: 460,

          p: {
            xs: 3,
            sm: 4,
          },

          borderRadius: 4,

          backgroundColor: '#ffffff',

          border: '1px solid #e5e7eb',

          boxShadow:
            '0 20px 50px rgba(15, 23, 42, 0.10)',
        }}
      >
        {/* =========================
            LOGO
        ========================= */}

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

              boxShadow:
                '0 8px 20px rgba(79, 70, 229, 0.25)',
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

        {/* =========================
            HEADING
        ========================= */}

        <Typography
          align="center"
          sx={{
            fontSize: '28px',
            fontWeight: 800,
            color: '#172033',
            letterSpacing: '-0.5px',
          }}
        >
          Create your account
        </Typography>

        <Typography
          align="center"
          sx={{
            mt: 0.8,
            mb: 3,
            fontSize: '14px',
            color: '#64748b',
          }}
        >
          Get started with TaskTrack
        </Typography>

        {/* =========================
            STEP INDICATOR
        ========================= */}

        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mb: 1,
            }}
          >
            {['Details', 'Verification', 'Password'].map(
              (label, index) => {
                const stepNumber = index + 1;

                return (
                  <Box
                    key={label}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.8,
                    }}
                  >
                    <Box
                      sx={{
                        width: 25,
                        height: 25,
                        borderRadius: '50%',

                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',

                        fontSize: '11px',
                        fontWeight: 700,

                        backgroundColor:
                          stepNumber <= step
                            ? 'primary.main'
                            : '#e2e8f0',

                        color:
                          stepNumber <= step
                            ? '#ffffff'
                            : '#64748b',
                      }}
                    >
                      {stepNumber}
                    </Box>

                    <Typography
                      sx={{
                        fontSize: '11px',
                        fontWeight:
                          stepNumber === step ? 700 : 500,

                        color:
                          stepNumber === step
                            ? '#172033'
                            : '#94a3b8',
                      }}
                    >
                      {label}
                    </Typography>
                  </Box>
                );
              }
            )}
          </Box>

          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 5,
              borderRadius: 5,
              backgroundColor: '#e2e8f0',

              '& .MuiLinearProgress-bar': {
                borderRadius: 5,
              },
            }}
          />
        </Box>

        {/* =========================
            STEP 1
        ========================= */}

        {step === 1 && (
          <Box>
            <Typography
              sx={{
                fontSize: '18px',
                fontWeight: 700,
                color: '#172033',
                mb: 0.5,
              }}
            >
              Your details
            </Typography>

            <Typography
              sx={{
                fontSize: '13px',
                color: '#64748b',
                mb: 2,
              }}
            >
              Enter your basic information to get started.
            </Typography>

            <TextField
              fullWidth
              name="firstName"
              label="First Name"
              value={formData.firstName}
              onChange={handleChange}
              error={!!errorMessage.firstName}
              helperText={errorMessage.firstName}
              sx={{
                mb: 2,

                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutline
                      sx={{ color: '#94a3b8' }}
                    />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              name="lastName"
              label="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              error={!!errorMessage.lastName}
              helperText={errorMessage.lastName}
              sx={{
                mb: 2,

                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutline
                      sx={{ color: '#94a3b8' }}
                    />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              name="email"
              label="Email address"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errorMessage.email}
              helperText={errorMessage.email}
              sx={{
                mb: 1,

                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlined
                      sx={{ color: '#94a3b8' }}
                    />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        )}

        {/* =========================
            STEP 2
        ========================= */}

        {step === 2 && (
          <Box>
            <Typography
              sx={{
                fontSize: '18px',
                fontWeight: 700,
                color: '#172033',
                mb: 0.5,
              }}
            >
              Verify your email
            </Typography>

            <Typography
              sx={{
                fontSize: '13px',
                color: '#64748b',
                mb: 2,
              }}
            >
              Enter the OTP sent to{' '}
              <strong>{formData.email}</strong>
            </Typography>

            <TextField
              fullWidth
              name="otp"
              label="Enter OTP"
              value={formData.otp}
              onChange={handleChange}
              error={!!errorMessage.otp}
              helperText={errorMessage.otp}
              inputProps={{
                maxLength: 6,
                inputMode: 'numeric',
              }}
              sx={{
                mb: 1,

                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },

                '& input': {
                  textAlign: 'center',
                  letterSpacing: '8px',
                  fontSize: '20px',
                  fontWeight: 700,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <KeyOutlined
                      sx={{ color: '#94a3b8' }}
                    />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        )}

        {/* =========================
            STEP 3
        ========================= */}

        {step === 3 && (
          <Box>
            <Typography
              sx={{
                fontSize: '18px',
                fontWeight: 700,
                color: '#172033',
                mb: 0.5,
              }}
            >
              Create your password
            </Typography>

            <Typography
              sx={{
                fontSize: '13px',
                color: '#64748b',
                mb: 2,
              }}
            >
              Choose a strong password for your account.
            </Typography>

            <TextField
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              error={!!errorMessage.password}
              helperText={errorMessage.password}
              sx={{
                mb: 2,

                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined
                      sx={{ color: '#94a3b8' }}
                    />
                  </InputAdornment>
                ),

                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowPassword((prev) => !prev)
                      }
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

            <TextField
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type={
                showConfirmPassword
                  ? 'text'
                  : 'password'
              }
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!errorMessage.confirmPassword}
              helperText={errorMessage.confirmPassword}
              sx={{
                mb: 1,

                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined
                      sx={{ color: '#94a3b8' }}
                    />
                  </InputAdornment>
                ),

                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(
                          (prev) => !prev
                        )
                      }
                      edge="end"
                    >
                      {showConfirmPassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        )}

        {/* =========================
            ACTIONS
        ========================= */}

        <Box
          sx={{
            display: 'flex',
            gap: 1.5,
            mt: 2,
          }}
        >
          {step > 1 && (
            <Button
              variant="outlined"
              fullWidth
              startIcon={<ArrowBack />}
              onClick={handleBack}
              disabled={loading}
              sx={{
                py: 1.25,
                borderRadius: 2,
              }}
            >
              Back
            </Button>
          )}

          <Button
            variant="contained"
            fullWidth
            endIcon={
              step < 3 ? (
                <ArrowForward />
              ) : null
            }
            onClick={handleNext}
            disabled={loading}
            sx={{
              py: 1.25,
              borderRadius: 2,

              fontSize: '14px',
              fontWeight: 700,

              boxShadow:
                '0 6px 16px rgba(79, 70, 229, 0.25)',

              '&:hover': {
                boxShadow:
                  '0 8px 20px rgba(79, 70, 229, 0.30)',
              },
            }}
          >
            {loading
              ? 'Please wait...'
              : step === 3
              ? 'Create Account'
              : 'Continue'}
          </Button>
        </Box>

        {/* =========================
            GOOGLE
        ========================= */}

        {step === 1 && (
          <>
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
                }}
              >
                OR
              </Typography>

              <Divider sx={{ flex: 1 }} />
            </Box>

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

                backgroundColor: '#ffffff',

                '&:hover': {
                  backgroundColor: '#f8fafc',
                  borderColor: '#94a3b8',
                },
              }}
            >
              Continue with Google
            </Button>
          </>
        )}

        {/* =========================
            LOGIN LINK
        ========================= */}

        <Typography
          align="center"
          sx={{
            mt: 3,
            fontSize: '13px',
            color: '#64748b',
          }}
        >
          Already have an account?{' '}

          <Box
            component="span"
            onClick={() => navigate('/login')}
            sx={{
              color: 'primary.main',
              fontWeight: 700,
              cursor: 'pointer',

              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            Login
          </Box>
        </Typography>
      </Paper>
    </Box>
  );
};

export default SignUp;