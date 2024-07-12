import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme, Button, Box } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import ForgotPassword from './pages/ForgotPassword';
import VerifyResetToken from './pages/VerifyResetToken';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#121212',
      paper: '#1d1d1d',
    },
    text: {
      primary: '#ffffff',
      secondary: '#bbbbbb',
    },
  },
});

const warmTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#ff7043',
    },
    secondary: {
      main: '#ffb74d',
    },
    background: {
      default: '#fff3e0',
      paper: '#ffe0b2',
    },
    text: {
      primary: '#000000',
      secondary: '#4e342e',
    },
  },
});

const App: React.FC = () => {
  const [theme, setTheme] = useState(darkTheme);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme.palette.mode === 'dark' ? warmTheme : darkTheme));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ textAlign: 'center', marginTop: '1rem' }}>
        <Button variant="contained" onClick={toggleTheme}>
          切換主題
        </Button>
      </Box>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-reset-token" element={<VerifyResetToken />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;