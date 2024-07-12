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
        線上狼人殺
      </Typography>
      <Typography variant="body1" paragraph>
        這裡只有最純粹的狼人殺，帶你回到最初的感動。
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
              onClick={() => navigate('/game')}
            >
              加入遊戲
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