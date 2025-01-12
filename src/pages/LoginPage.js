import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { 
  Box, 
  Paper, 
  Typography 
} from '@mui/material';
import JOBSAI from '../assets/JOBSAI.png';

const LoginPage = () => {
  const navigate = useNavigate();

  const { setUser } = useAuth();

  const handleLoginSuccess = (credentialResponse) => {
    const { credential } = credentialResponse;
    axios.post('http://localhost:8080/auth/google-login', { idToken: credential })
      .then((response) => {
        console.log('User logged in successfully:', response.data);
        console.log('Profile:', response.data.profile);
        setUser(response.data.profile);
        navigate('/dashboard'); 
      })
      .catch((error) => {
        console.error('Error during login:', error);
      });
  };

  const handleLoginError = (error) => {
    console.log('Login Error:', error);
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
    }}>
      <Paper sx={{
        padding: 4,
        maxWidth: 700,
        height: 300,
        textAlign: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 2,
      }} elevation={3}>
        <img
          src={JOBSAI}
          alt="Logo"
          style={{
            width: '100px',
            height: '100px',
            marginBottom: '16px',
            borderRadius: '50%',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          }}
        />
        <Typography variant="h4" sx={{ marginBottom: 2, fontWeight: 'bold' }}>
          Login To Your JOBS.AI profile with Google
        </Typography>
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={handleLoginError}
          style={{
            width: '80%',
            padding: '16px 24px',
            fontSize: '18px',
            backgroundColor: '#4285F4',
            color: '#fff',
            borderRadius: '8px',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
            textTransform: 'none',
            marginTop: '20px',
            transition: 'background-color 0.3s ease',
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        />
      </Paper>
    </Box>
  );
};

export default LoginPage;
