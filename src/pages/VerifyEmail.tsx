import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import api from '../services/api';
import { API_BASE_URL } from '../constants';

const VerifyEmail: React.FC = () => {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenParam = queryParams.get('token');
    if (tokenParam) {
      verifyToken(tokenParam);
    }
    const emailParam = queryParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [location.search]);

  const verifyToken = async (token: string) => {
    try {
      const response = await api.get(`${API_BASE_URL}/email/verify-token`, { params: { token } });
      if (response.data.status === 'success') {
        setSuccess('電子郵件驗證成功');
        navigate('/');
      }
    } catch (err) {
      setError('驗證碼無效或已過期');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    verifyToken(token);
  };

  const resendVerificationEmail = async () => {
    try {
      await api.post(`${API_BASE_URL}/email/verify-email`, { email });
      setSuccess('驗證信已重寄');
    } catch (err) {
      setError('重寄驗證信失敗');
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
          請輸入電子郵件驗證碼
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        {success && <Typography color="success">{success}</Typography>}
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
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          sx={{ marginTop: '1rem' }}
          onClick={resendVerificationEmail}
        >
          重寄驗證信
        </Button>
      </Box>
    </Container>
  );
};

export default VerifyEmail;
