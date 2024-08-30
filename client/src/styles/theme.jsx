import { createTheme, responsiveFontSizes } from '@mui/material/styles';

const baseTheme = createTheme({
  palette: {
    primary: {
      main: '#6a11cb',
      light: '#8d4de2',
      dark: '#4a0e8f',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ff006e',
      light: '#ff5a9d',
      dark: '#c50057',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#2d3748',
      secondary: '#718096',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      '@media (min-width:600px)': {
        fontSize: '3rem',
      },
      '@media (min-width:960px)': {
        fontSize: '3.2rem',
      },
    },
    h2: {
      fontWeight: 600,
      fontSize: '2.2rem',
      '@media (min-width:600px)': {
        fontSize: '2.5rem',
      },
      '@media (min-width:960px)': {
        fontSize: '2.8rem',
      },
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.8rem',
      '@media (min-width:600px)': {
        fontSize: '2rem',
      },
      '@media (min-width:960px)': {
        fontSize: '2.3rem',
      },
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      '@media (min-width:600px)': {
        fontSize: '1.7rem',
      },
      '@media (min-width:960px)': {
        fontSize: '1.8rem',
      },
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.3rem',
      '@media (min-width:600px)': {
        fontSize: '1.4rem',
      },
      '@media (min-width:960px)': {
        fontSize: '1.5rem',
      },
    },
    h6: {
      fontWeight: 500,
      fontSize: '1.1rem',
      '@media (min-width:600px)': {
        fontSize: '1.2rem',
      },
      '@media (min-width:960px)': {
        fontSize: '1.25rem',
      },
    },
    subtitle1: {
      fontWeight: 400,
      fontSize: '0.9rem',
      '@media (min-width:600px)': {
        fontSize: '1rem',
      },
    },
    subtitle2: {
      fontWeight: 400,
      fontSize: '0.8rem',
      '@media (min-width:600px)': {
        fontSize: '0.85rem',
      },
    },
    body1: {
      fontWeight: 400,
      fontSize: '0.9rem',
      '@media (min-width:600px)': {
        fontSize: '0.95rem',
      },
    },
    body2: {
      fontWeight: 400,
      fontSize: '0.8rem',
      '@media (min-width:600px)': {
        fontSize: '0.875rem',
      },
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 14,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          padding: '10px 20px',
          '@media (min-width:600px)': {
            padding: '12px 24px',
          },
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 4px 10px rgba(106, 17, 203, 0.2)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 16px rgba(106, 17, 203, 0.4)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(45deg, #6a11cb 30%, #8d4de2 90%)',
          boxShadow: '0 6px 12px rgba(106, 17, 203, 0.4)',
        },
        containedSecondary: {
          background: 'linear-gradient(45deg, #ff006e 30%, #ff5a9d 90%)',
          boxShadow: '0 6px 12px rgba(255, 0, 110, 0.4)',
        },
        outlined: {
          borderWidth: '2px',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            borderWidth: '2px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          borderRadius: 24,
        },
        elevation1: {
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          boxShadow: '0 10px 30px rgba(106, 17, 203, 0.1)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 20px 40px rgba(106, 17, 203, 0.2)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
          background: 'linear-gradient(45deg, #6a11cb 30%, #8d4de2 90%)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 16,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 4px 10px rgba(106, 17, 203, 0.1)',
            '&:hover': {
              boxShadow: '0 6px 12px rgba(106, 17, 203, 0.2)',
            },
            '&.Mui-focused': {
              boxShadow: '0 8px 16px rgba(106, 17, 203, 0.3)',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 24,
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
        },
      },
    },
  },
});

const theme = responsiveFontSizes(baseTheme);

export default theme;