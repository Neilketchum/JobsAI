import React from 'react';
import { Container, Typography, Paper, List, ListItem, ListItemText } from '@mui/material';
import AppBar from '../components/AppBar';

const History = () => {
  // Placeholder for history items
  const historyItems = [
    { id: 1, action: 'Resume Analysis', date: '2024-01-08' },
    { id: 2, action: 'Cover Letter Generated', date: '2024-01-07' },
    { id: 3, action: 'Document Uploaded', date: '2024-01-06' }
  ];

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
            Action History
          </Typography>
          <List>
            {historyItems.map((item) => (
              <ListItem key={item.id} divider>
                <ListItemText 
                  primary={item.action} 
                  secondary={`Date: ${item.date}`} 
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Container>
    </div>
  );
};

export default History;
