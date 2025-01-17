import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Avatar, Grid, Button, TextField, InputAdornment } from '@mui/material';
import AppBar from '../components/AppBar';
import { useAuth } from '../context/AuthContext';
import PhoneIcon from '@mui/icons-material/Phone';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import LanguageIcon from '@mui/icons-material/Language';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import axios from 'axios';

const MyProfile = () => {
  const { user } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    phoneNumber: '',
    linkedinUrl: '',
    githubUrl: '',
    personalWebsiteUrl: '',
    profilePicture: '',
    "name": "",
    "email": "",
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/profile/${user.email}`);
        console.log('Fetched profile data:', response.data.profile);
        setProfileData((prevData) => ({
          ...prevData,
          ...response.data.profile
        }));
        console.log('Profile Data from state:',   profileData);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };
    fetchProfileData();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      const response = await axios.put('http://localhost:8080/profile/update', {
          email: user.email,  // Ensure the email is included in the request body
          phoneNumber: profileData.phoneNumber,
          linkedinUrl: profileData.linkedinUrl,
          githubUrl: profileData.githubUrl,
          personalWebsiteUrl: profileData.personalWebsiteUrl,
          profilePicture: profileData.profilePicture,
          name: profileData.name
        });
        console.log('Profile update response:', response.data);
        setEditMode(false);
      } catch (error) {
        console.error('Error updating profile:', error);
    
      }
  };

  const handleEditClick = () => {
    setEditMode(true);
  };

  return (
    <div>
      <AppBar />
      <Container maxWidth="md" sx={{ mt: 4 }} style={{ marginTop: '64px', padding: '20px' }}>
        <Paper sx={{ p: 4 }} elevation={3}>
          <Typography 
            variant="h4" 
            gutterBottom 
            align="center" 
            style={{ fontWeight: 'bold', color: '#3f51b5' }}
          >
            My Profile
          </Typography>
          <Grid container spacing={4} justifyContent="center" alignItems="center">
            <Grid item xs={12} textAlign="center">
              <Avatar 
                alt={profileData.profilePicture} 
                src={profileData.profilePicture} 
                sx={{ width: 120, height: 120, margin: '0 auto', mb: 3, boxShadow: 3 }} 
              />
            </Grid>
            <Grid item xs={12} textAlign="center">
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>{user?.name || "John Doe"}</Typography>
              <Typography variant="body2" color="textSecondary">{user?.email || "N/A"}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              {editMode ? (
                <PhoneInput
                  country={'us'}
                  value={profileData.phoneNumber || ''}
                  onChange={(phone) => setProfileData({ ...profileData, phoneNumber: phone })}
                  inputStyle={{ width: '100%', height: '56px', borderRadius: 4, borderColor: '#ced4da' }}
                  containerStyle={{ marginBottom: '16px' }}
                />
              ) : (
                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PhoneIcon sx={{ mr: 1, color: 'primary.main', verticalAlign: 'middle' }} />
                  Phone: {profileData.phoneNumber || "N/A"}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              {editMode ? (
                <TextField
                  fullWidth
                  label="LinkedIn URL"
                  variant="outlined"
                  value={profileData.linkedinUrl || ''}
                  onChange={(e) => setProfileData({ ...profileData, linkedinUrl: e.target.value })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LinkedInIcon sx={{ color: 'primary.main' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
              ) : (
                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LinkedInIcon sx={{ mr: 1, color: 'primary.main', verticalAlign: 'middle' }} />
                  LinkedIn: {profileData.linkedinUrl || "N/A"}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              {editMode ? (
                <TextField
                  fullWidth
                  label="GitHub URL"
                  variant="outlined"
                  value={profileData.githubUrl || ''}
                  onChange={(e) => setProfileData({ ...profileData, githubUrl: e.target.value })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <GitHubIcon sx={{ color: 'primary.main' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
              ) : (
                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <GitHubIcon sx={{ mr: 1, color: 'primary.main', verticalAlign: 'middle' }} />
                  GitHub: {profileData.githubUrl || "N/A"}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              {editMode ? (
                <TextField
                  fullWidth
                  label="Personal Website"
                  variant="outlined"
                  value={profileData.personalWebsiteUrl || ''}
                  onChange={(e) => setProfileData({ ...profileData, personalWebsiteUrl: e.target.value })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LanguageIcon sx={{ color: 'primary.main' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
              ) : (
                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LanguageIcon sx={{ mr: 1, color: 'primary.main', verticalAlign: 'middle' }} />
                  Website: {profileData.personalWebsiteUrl || "N/A"}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} textAlign="center">
              {editMode ? (
                <>
                  <Button variant="outlined" color="secondary" onClick={() => setEditMode(false)} startIcon={<ArrowBackIcon />} sx={{ mt: 2, mr: 2 }}>
                    Back
                  </Button>
                  <Button variant="contained" color="primary" onClick={handleUpdateProfile} startIcon={<SaveIcon />} sx={{ mt: 2 }}>
                    Save Profile
                  </Button>
                </>
              ) : (
                <Button variant="contained" color="primary" onClick={handleEditClick} startIcon={<EditIcon />} sx={{ mt: 2 }}>
                  Edit Profile
                </Button>
              )}
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </div>
  );
};

export default MyProfile;
