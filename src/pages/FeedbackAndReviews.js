import React from 'react';
import { Container, Typography, Paper } from '@mui/material';
import AppBar from '../components/AppBar';

const FeedbackAndReviews = () => {
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
            Feedback and Reviews
          </Typography>
          {/* Add feedback and reviews content here */}
          <Typography variant="body1" align="center">
            We value your feedback! Share your experience with Jobs.AI.
          </Typography>
        </Paper>
      </Container>
    </div>
  );
};

export default FeedbackAndReviews;
