import React from 'react';
import GoogleLoginButton from '../components/GoogleLoginButton';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { 
  Box, 
  Paper, 
  Typography 
} from '@mui/material';
import JOBSAI from '../assets/JOBSAI.png';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { setUser } = useUser();

  const handleLoginSuccess = (response) => {
    const decodedToken = jwtDecode(response.credential);
    console.log('User Info:', decodedToken);

    const userEmail = decodedToken.email;
    const userProfilePicture = decodedToken.picture;
    const name = decodedToken.name;

    console.log('Decoded Token :-' + decodedToken);

    axios.post('http://localhost:8080/profile', { email: userEmail, name: name, profilePicture: userProfilePicture })
      .then((response) => {
        console.log('Profile created:', response.data); // Log the response data
      })
      .catch((error) => {
        console.error('Error creating profile:', error);
      });

    setUser({ email: userEmail });
    login();
    console.log(response);
    navigate('/dashboard');
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
        height: 300, // Increased height
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
        <div
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
            '&:hover': {
              backgroundColor: '#357ae8',
            },
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
         <GoogleLoginButton 
          onSuccess={handleLoginSuccess} 
          onError={handleLoginError} 
        />
        </div>
       
      </Paper>
    </Box>
  );
};

export default LoginPage;
