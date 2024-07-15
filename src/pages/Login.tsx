import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Link } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { API_BASE_URL } from '../constants';

const Login: React.FC = () => {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await api.post(`${API_BASE_URL}/auth/login`, { account, password });
      if (response.data.user.isEmailVerified) {
        login(response.data.accessToken);
        navigate('/');
      } else {
        navigate('/verify-email');
      }
    } catch (err) {
      setError('帳號或密碼錯誤');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          textAlign: 'center',
          marginTop: '5rem',
        }}
      >
        <Typography variant="h4" gutterBottom>
          登入
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <form onSubmit={handleLogin}>
          <TextField
            label="帳號"
            variant="outlined"
            fullWidth
            margin="normal"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
          />
          <TextField
            label="密碼"
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            登入
          </Button>
        </form>
        <Box mt={2}>
          <Link component={RouterLink} to="/" variant="body2">
            回到首頁
          </Link>
          {' | '}
          <Link component={RouterLink} to="/register" variant="body2">
            註冊
          </Link>
          {' | '}
          <Link component={RouterLink} to="/forgot-password" variant="body2">
            忘記密碼
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
