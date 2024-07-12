import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';
import { API_BASE_URL } from '../constants';

const ForgotPassword: React.FC = () => {
  const [account, setAccount] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_BASE_URL}/password/forgot-password`, { account });
      if (response.data.message === 'Password reset email has been sent') {
        navigate('/verify-reset-token');
      }
    } catch (err) {
      setError('找不到用戶');
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
          忘記密碼
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <form onSubmit={handleForgotPassword}>
          <TextField
            label="帳號"
            variant="outlined"
            fullWidth
            margin="normal"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            提交
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default ForgotPassword;
