import React, { useState, useEffect } from 'react';
import { Container, Paper, Typography, Button, TextField, Grid } from '@mui/material';
import { fetchDocuments } from '../services/documentService';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import AppBar from '../components/AppBar';
import DocumentSelector from '../components/DocumentSelector';

const GenerateCoverLetter = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [position, setPosition] = useState('');

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const docs = await fetchDocuments(user.email);
        setDocuments(docs);
      } catch (error) {
        console.error('Error fetching documents:', error);
      }
    };
    loadDocuments();
  }, [user.email]);

  const handleGenerateCoverLetter = async () => {
    if (additionalInfo.split(' ').length > 300) {
      alert('Additional information cannot exceed 300 words.');
      return;
    }
    if (jobDescription.split(' ').length > 300) {
      alert('Job description cannot exceed 300 words.');
      return;
    }

    try {
      const response = await axios.post('/generate-cover-letter', {
        resumeUrl: selectedDocument,
        additionalInfo,
        jobDescription,
        emailId: user.email,
        companyName,
        position
      });
      console.log('Cover letter generation response:', response.data);
    } catch (error) {
      console.error('Error generating cover letter:', error);
    }
  };

  return (
    <div>
      <AppBar />
      <Container maxWidth="md" sx={{ mt: 4 }} style={{ marginTop: '64px', padding: '20px' }}>
        <Paper sx={{ p: 4 }} elevation={3}>
          <Typography variant="h4" gutterBottom align="center" style={{ fontWeight: 'bold', color: '#3f51b5' }}>
            Generate Cover Letter
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} sm={6}>
              <DocumentSelector 
                documents={documents} 
                selectedDocument={selectedDocument} 
                setSelectedDocument={setSelectedDocument} 
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Company Name"
                variant="outlined"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Position Applying For"
                variant="outlined"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Additional Information"
                multiline
                rows={4}
                variant="outlined"
                placeholder="Add any additional information here"
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Job Description"
                multiline
                rows={4}
                variant="outlined"
                placeholder="Paste the job description here"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleGenerateCoverLetter}
              >
                Generate Cover Letter
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </div>
  );
};

export default GenerateCoverLetter;
