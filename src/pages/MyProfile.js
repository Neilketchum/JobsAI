import React from 'react';
import { Container, Typography, Paper, Avatar, Grid, Button } from '@mui/material';
import AppBar from '../components/AppBar';
import { useUser } from '../context/UserContext';

const MyProfile = () => {
  const { user } = useUser();

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
          <Grid container spacing={3} justifyContent="center" alignItems="center">
            <Grid item xs={12} textAlign="center">
              <Avatar 
                alt={user?.name} 
                src={user?.picture} 
                sx={{ width: 100, height: 100, margin: '0 auto', mb: 2 }} 
              />
            </Grid>
            <Grid item xs={12} textAlign="center">
              <Typography variant="h6">{user?.name}</Typography>
              <Typography variant="body1">{user?.email}</Typography>
            </Grid>
            <Grid item xs={12} textAlign="center">
              <Button variant="contained" color="primary">
                Edit Profile
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </div>
  );
};

export default MyProfile;
