import React, { useState, useEffect } from 'react';
import { Container, Paper, Typography, Button, TextField, Grid } from '@mui/material';
import { fetchDocuments } from '../services/documentService';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import AppBar from '../components/AppBar';
import DocumentSelector from '../components/DocumentSelector';
import CircularProgress from '@mui/material/CircularProgress';
import { pdfjs, Document, Page } from 'react-pdf';
import { ArrowBack, Refresh, GetApp } from '@mui/icons-material';
import jsPDF from 'jspdf'; // Import jsPDF

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.1.81/pdf.worker.min.js`;

const GenerateCoverLetter = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState('');
  const [formData, setFormData] = useState({
    fileUrl: '',
    additionalInfo: '',
    jobDescription: '',
    emailId: user.email,
    companyName: '',
    position: ''
  });
  const [loading, setLoading] = useState(false);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [coverLetterText, setCoverLetterText] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [modificationText, setModificationText] = useState('');

  useEffect(() => {
    console.log('user', user);
    const loadDocuments = async () => {
      try {
        const docs = await fetchDocuments(user.email);
        setDocuments(docs);
      } catch (error) {
        console.error('Error loading documents:', error);
      }
    };
    loadDocuments();
  }, [user.email]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleGenerate = async () => {
    if (formData.additionalInfo.split(' ').length > 300) {
      alert('Additional information cannot exceed 300 words.');
      return;
    }
    if (formData.jobDescription.split(' ').length > 300) {
      alert('Job description cannot exceed 300 words.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/generate-cover-letter-text', formData, {
        withCredentials: true 
      });

      setCoverLetterText(response.data.coverLetter);
      setChatMessages([{ sender: 'AI', text: response.data.coverLetter }]);
      setShowChat(true);
      console.log('Cover letter text generated successfully');
    } catch (error) {
      console.error('Error generating cover letter text:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const doc = new jsPDF();
    const text = coverLetterText;
    const lines = doc.splitTextToSize(text, 180); 
    let y = 10;
    lines.forEach((line) => {
      if (y > 280) { 
        doc.addPage();
        y = 10; 
      }
      doc.text(line, 10, y);
      y += 10; 
    });
    const sanitizedFileName = `${formData.companyName}_${formData.position}_${user.name}_Cover_Letter.pdf`.replace(' ','_');
    doc.save(sanitizedFileName);
  };

  const handleBack = () => {
    setShowChat(false);
    setChatMessages([]);
    setCoverLetterText('');
  };

  const handleSendSuggestion = async () => {
    setLoading(true);
    setModificationText('');
    try {
      const response = await axios.post('http://localhost:8080/suggest-modification', {
        coverLetterText,
        modificationText,
        fileUrl: formData.fileUrl,
        email: user.email
      }, {
        withCredentials: true 
      });
      setCoverLetterText(response.data.coverLetter);
      setChatMessages([{ sender: 'Jobs.AI', text: response.data.coverLetter }]);
      console.log('Suggestion sent successfully:', response.data.coverLetter);
    } catch (error) {
      console.error('Error sending suggestion:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }} style={{ marginTop: '64px', padding: '20px' }}>
      <AppBar />
      {!showChat ? (
        <>
          <Typography variant="h4" gutterBottom align="center" style={{ fontWeight: 'bold', color: '#3f51b5' }}>
            Generate Cover Letter
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} textAlign="center" sx={{ mt: 4 }}>
              <Paper elevation={3} sx={{ p: 3, backgroundColor: '#f5f5f5' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#3f51b5' }} gutterBottom>
                  Enhance Your Cover Letter
                </Typography>
                <Typography variant="body1" sx={{ color: '#555' }}>
                  Please fill in your LinkedIn URL, Phone Number, Personal Website, and GitHub URL in the "My Profile" section to draft the best cover letter.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <DocumentSelector 
                documents={documents} 
                selectedDocument={selectedDocument} 
                setSelectedDocument={(doc) => {
                  setSelectedDocument(doc);
                  setFormData({ ...formData, fileUrl: doc });
                }}
                disabled={loading} 
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Company Name"
                variant="outlined"
                value={formData.companyName}
                onChange={handleChange}
                name="companyName"
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Position Applying For"
                variant="outlined"
                value={formData.position}
                onChange={handleChange}
                name="position"
                disabled={loading}
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
                value={formData.additionalInfo}
                onChange={handleChange}
                name="additionalInfo"
                disabled={loading}
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
                value={formData.jobDescription}
                onChange={handleChange}
                name="jobDescription"
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleGenerate}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Generate Cover Letter'}
              </Button>
            </Grid>
            {loading && (
              <Grid item xs={12} style={{ textAlign: 'center' }}>
                <CircularProgress />
              </Grid>
            )}
          </Grid>
        </>
      ) : (
        <>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12}>
              <Paper elevation={3} style={{ padding: '30px', maxHeight: '500px', overflowY: 'auto', backgroundColor: '#f5f5f5', width: '100%' }}>
                {loading ? (
                  <Grid item xs={12} style={{ textAlign: 'center' }}>
                    <CircularProgress />
                    <Typography variant="h6" style={{ marginTop: '10px' }}>Loading...</Typography>
                  </Grid>
                ) : (
                  chatMessages.map((msg, index) => (
                    <Typography key={index} align='left' style={{ marginBottom: '15px', color: '#333', whiteSpace: 'pre-line' }}>
                      <strong>{msg.sender}:</strong>
                      <br />
                      {msg.text}
                    </Typography>
                  ))
                )}
              </Paper>
            </Grid>
            <Grid item xs={12} style={{ textAlign: 'center' }}>
              <TextField
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                placeholder="Suggest modifications here"
                value={modificationText}
                onChange={(e) => setModificationText(e.target.value)}
                style={{ marginBottom: '15px' }}
              />
              <Button variant="contained" color="secondary" onClick={handleDownload} disabled={!coverLetterText} style={{ marginRight: '10px' }}>
                Download Cover Letter
              </Button>
              <Button variant="contained" color="primary" onClick={handleBack} style={{ marginRight: '10px' }}>
                Back
              </Button>
              <Button variant="contained" color="default" onClick={handleSendSuggestion} style={{ float: 'right' }}>
                Modify Cover Letter
              </Button>
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  );
};

export default GenerateCoverLetter;