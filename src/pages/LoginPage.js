import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { 
  Box, 
  Container, 
  Typography 
} from '@mui/material';
import { Google as GoogleIcon, LinkedIn as LinkedInIcon, GitHub as GitHubIcon } from '@mui/icons-material';
import JOBSAI from '../assets/JOBSAI.png';

const LoginPage = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const handleLoginSuccess = (credentialResponse) => {
    const { credential } = credentialResponse;
    axios.post('https://jobsai-446602.wm.r.appspot.com/auth/google-login', { idToken: credential })
      .then((response) => {
        console.log('User logged in successfully:', response.data);
        console.log('Profile:', response.data.profile);
        login(response.data.profile, response.data.token);
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
      backgroundImage: 'url(/path/to/job-market-background.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      <Container maxWidth="md" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '50px', 
        borderRadius: '8px', 
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)'
      }}>
        <Box style={{ maxWidth: '600px', width: '100%', margin: '0 auto' }}>
          <Typography variant="h2" style={{ fontWeight: 'bold', color: '#3f51b5' }} gutterBottom>
            Jobs.AI
          </Typography>
          <Typography variant="h6" style={{ marginBottom: '20px', color: '#555' }}>
            Your AI Buddy that supports you to get your dream job
          </Typography>
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={handleLoginError}
            style={{
              width: '80%',
              padding: '16px 24px',
              fontSize: '18px',
              backgroundColor: '#fbbc05',
              color: '#000',
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
          <Box display="flex" justifyContent="flex-start" mt={2} style={{ width: '80%' }}>
            <LinkedInIcon 
              style={{ fontSize: 40, color: '#0e76a8', marginRight: '10px', cursor: 'pointer' }} 
              onClick={() => window.open('https://www.linkedin.com/in/daipayan-hati/', '_blank')}
            />
            <GitHubIcon 
              style={{ fontSize: 40, color: '#333', cursor: 'pointer' }} 
              onClick={() => window.open('https://github.com/Neilketchum/JobsAI', '_blank')}
            />
          </Box>
        </Box>
        <Box>
          <img src={JOBSAI} alt="Illustration" style={{ maxWidth: '100%', height: 'auto' }} />
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage;
