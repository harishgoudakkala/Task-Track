import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { GoogleOAuthProvider } from '@react-oauth/google';

const theme = createTheme({
  palette: {
    mode: 'light',

    primary: {
      main: '#4f46e5',
      dark: '#4338ca',
      light: '#818cf8',
      contrastText: '#ffffff',
    },

    secondary: {
      main: '#64748b',
    },

    background: {
      default: '#f5f7fb',
      paper: '#ffffff',
    },

    text: {
      primary: '#172033',
      secondary: '#64748b',
    },

    success: {
      main: '#16a34a',
    },

    warning: {
      main: '#f59e0b',
    },

    error: {
      main: '#ef4444',
    },
  },

  typography: {
    fontFamily: [
      'Inter',
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),

    h4: {
      fontWeight: 700,
      letterSpacing: '-0.5px',
    },

    h5: {
      fontWeight: 700,
    },

    h6: {
      fontWeight: 600,
    },

    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },

  shape: {
    borderRadius: 12,
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          backgroundColor: '#f5f7fb',
          color: '#172033',
        },

        '*': {
          boxSizing: 'border-box',
        },

        '*::-webkit-scrollbar': {
          width: '7px',
          height: '7px',
        },

        '*::-webkit-scrollbar-track': {
          background: 'transparent',
        },

        '*::-webkit-scrollbar-thumb': {
          background: '#cbd5e1',
          borderRadius: '10px',
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          background: '#ffffff',
          color: '#172033',
          boxShadow: '0 1px 10px rgba(15, 23, 42, 0.08)',
          borderBottom: '1px solid #e5e7eb',
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 9,
          padding: '9px 18px',
          boxShadow: 'none',

          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },

      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            backgroundColor: '#ffffff',
          },
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid #e5e7eb',
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.05)',
        },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          padding: 8,
        },
      },
    },

    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          marginTop: 8,
          border: '1px solid #e5e7eb',
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.12)',
        },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
    <CssBaseline />
      <GoogleOAuthProvider clientId="1080286409988-l2pk0tcl8jgj9180v6bgo5c0hvthc4or.apps.googleusercontent.com">
        <App />
      </GoogleOAuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
