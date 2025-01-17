import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { AccessTime } from '@mui/icons-material';
import AppBar from '../components/AppBar';

const ComingSoon = ({ featureName }) => {
  return (
  <>
  <AppBar />
  <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: '100px' ,marginTop: '64px', padding: '20px' }}>
      <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
        <AccessTime style={{ fontSize: 40, color: '#3f51b5' }} />
      </Box>
      <Typography variant="h4" component="h1" gutterBottom style={{ fontWeight: 'bold', color: '#3f51b5' }}>
        Coming Soon
      </Typography>
      <Typography variant="h6" component="h2" color="textSecondary">
        The {featureName} feature is under development and will be available soon.
      </Typography>
      <Typography variant="body1" color="textSecondary" style={{ marginTop: '20px' }}>
        Stay tuned for updates!
      </Typography>
    </Container>
    </>
  );
};

export default ComingSoon;
