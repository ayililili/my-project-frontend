import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';
import { API_BASE_URL } from '../constants';

const VerifyResetToken: React.FC = () => {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenParam = queryParams.get('token');
    if (tokenParam) {
      verifyToken(tokenParam);
    }
  }, [location.search]);

  const verifyToken = async (token: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/password/reset-password`, { params: { token } });
      if (response.data.message === 'Token is valid') {
        navigate(`/reset-password?token=${token}`);
      }
    } catch (err) {
      setError('驗證碼無效或已過期');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    verifyToken(token);
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
          請輸入代碼
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="驗證碼"
            variant="outlined"
            fullWidth
            margin="normal"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            驗證
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default VerifyResetToken;
