import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Link } from '@mui/material';
import api from '../services/api';
import { API_BASE_URL } from '../constants';

interface IFormInput {
  account: string;
  email: string;
  password: string;
}

const Register: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, setError } = useForm<IFormInput>();
  const navigate = useNavigate();

  const onSubmit = async (data: IFormInput) => {
    try {
      const response = await api.get(`${API_BASE_URL}/auth/check-account/${data.account}`);
      if (!response.data.available) {
        setError('account', { type: 'manual', message: '帳號已存在。' });
        return;
      }
    } catch (err) {
      setError('account', { type: 'manual', message: '檢查帳號可用性時出錯。' });
      return;
    }

    try {
      const response = await api.get(`${API_BASE_URL}/auth/check-email/${data.email}`);
      if (!response.data.available) {
        setError('email', { type: 'manual', message: '郵箱已存在。' });
        return;
      }
    } catch (err) {
      setError('email', { type: 'manual', message: '檢查郵箱可用性時出錯。' });
      return;
    }

    try {
      await api.post(`${API_BASE_URL}/auth/register`, data);
      navigate('/login');
    } catch (err) {
      console.error('註冊失敗', err);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ textAlign: 'center', marginTop: '5rem' }}>
        <Typography variant="h4" gutterBottom>
          註冊
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="帳號"
            variant="outlined"
            fullWidth
            margin="normal"
            {...register('account', {
              required: '帳號是必需的',
              pattern: {
                value: /^\w{3,30}$/,
                message: '帳號必須為3-30個字元，並且只能包含字母、數字和底線。',
              },
            })}
            error={!!errors.account}
            helperText={errors.account ? errors.account.message : ''}
          />
          <TextField
            label="郵箱"
            variant="outlined"
            fullWidth
            margin="normal"
            {...register('email', {
              required: '郵箱是必需的',
              pattern: {
                value: /^\w+@(\w+\.)+\w{2,}$/,
                message: '郵箱格式不正確。',
              },
            })}
            error={!!errors.email}
            helperText={errors.email ? errors.email.message : ''}
          />
          <TextField
            label="密碼"
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
            {...register('password', {
              required: '密碼是必需的',
              minLength: {
                value: 6,
                message: '密碼至少需要6個字元。',
              },
            })}
            error={!!errors.password}
            helperText={errors.password ? errors.password.message : ''}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            註冊
          </Button>
        </form>
        <Box mt={2}>
          <Link component={RouterLink} to="/" variant="body2">
            回到首頁
          </Link>
          {' | '}
          <Link component={RouterLink} to="/login" variant="body2">
            登入
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;
