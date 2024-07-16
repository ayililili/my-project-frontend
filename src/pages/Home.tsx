import React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();

  return (
    <Container
      maxWidth="sm"
      sx={{
        textAlign: 'center',
        marginTop: '5rem',
      }}
    >
      <Typography variant="h2" gutterBottom>
        線上聊天室
      </Typography>
      <Typography variant="body1" paragraph>
        簡易線上聊天室實作
      </Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-around',
          marginTop: '2rem',
        }}
      >
        {isLoggedIn ? (
          <>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate('/chat')}
            >
              加入聊天
            </Button>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              onClick={() => {
                logout();
                navigate('/');
              }}
            >
              登出
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate('/register')}
            >
              註冊
            </Button>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              onClick={() => navigate('/login')}
            >
              登入
            </Button>
          </>
        )}
      </Box>
    </Container>
  );
};

export default Home;