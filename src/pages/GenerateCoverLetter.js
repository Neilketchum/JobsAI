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
      const response = await axios.post('http://localhost:8080/generate-cover-letter', formData, {
        responseType: 'blob',
        withCredentials: true 
      });

      setPdfBlob(response.data);
      console.log('PDF generated successfully');
    } catch (error) {
      console.error('Error generating cover letter:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const url = window.URL.createObjectURL(new Blob([pdfBlob]));
    const link = document.createElement('a');
    const sanitizedFileName = `${formData.companyName}_${formData.position}_${user.name}_Cover_Letter.pdf`.replace(' ','_');
    link.href = url;
    link.setAttribute('download', sanitizedFileName);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  };

  const handleBack = () => {
    setPdfBlob(null);
  };

  return (
    <div>
      <AppBar />
      <Container maxWidth="md" sx={{ mt: 4 }} style={{ marginTop: '64px', padding: '20px' }}>
        {!pdfBlob && (
          <Paper sx={{ p: 4, position: 'relative' }} elevation={3}>
            {loading && (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 1
              }}>
                <CircularProgress />
              </div>
            )}
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
                  Generate Cover Letter
                </Button>
              </Grid>
            </Grid>
          </Paper>
        )}

        {pdfBlob && (
          <Paper sx={{ p: 4, mt: 4 }} elevation={3}>
            <Grid container spacing={2} justifyContent="center">
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<ArrowBack />}
                  onClick={handleBack}
                >
                  Back to Generate Cover Letter
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  startIcon={<Refresh />}
                  onClick={handleGenerate}
                >
                  Regenerate Cover Letter
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<GetApp />}
                  onClick={handleDownload}
                >
                  Download Cover Letter
                </Button>
              </Grid>
            </Grid>
            {/* <Document file={window.URL.createObjectURL(pdfBlob)} onLoadSuccess={() => console.log('PDF loaded successfully')}>
              <Page pageNumber={1} />
            </Document> */}
          </Paper>
        )}
      </Container>
    </div>
  );
};

export default GenerateCoverLetter;