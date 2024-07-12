import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';
import { API_BASE_URL } from '../constants';

interface IFormInput {
  password: string;
  confirmPassword: string;
}

const ResetPassword: React.FC = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<IFormInput>();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    if (data.password !== data.confirmPassword) {
      setError('密碼不一致');
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/password/reset-password`, {
        token,
        password: data.password,
      });
      setSuccess('重設密碼成功');
      setError('');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError('重設密碼失敗');
      setSuccess('');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ textAlign: 'center', marginTop: '5rem' }}>
        <Typography variant="h4" gutterBottom>
          重設密碼
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        {success && <Typography color="primary">{success}</Typography>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="新密碼"
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
            {...register('password', {
              required: '新密碼是必需的',
              minLength: { value: 6, message: '密碼至少需要6個字元' },
              pattern: { value: /^\w{3,30}$/, message: '密碼必須包含字母、數字或底線' }
            })}
            error={!!errors.password}
            helperText={errors.password ? errors.password.message : ''}
          />
          <TextField
            label="確認新密碼"
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
            {...register('confirmPassword', { 
              required: '請確認新密碼',
              validate: value => value === watch('password') || '密碼不一致'
            })}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword ? errors.confirmPassword.message : ''}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            重設密碼
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default ResetPassword;
