import React, { useState, useEffect } from 'react';
import AppBar from '../components/AppBar';
import { 
  Typography, 
  Button, 
  TextField, 
  Container, 
  Grid, 
  Paper, 
  MenuItem, 
  Select, 
  FormControl, 
  InputLabel, 
  CircularProgress, 
  Box, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  Chip, 
  IconButton, 
  Snackbar
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import WorkIcon from '@mui/icons-material/Work';
import CodeIcon from '@mui/icons-material/Code';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ReplayIcon from '@mui/icons-material/Replay';
import { fetchDocuments } from '../services/documentService';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import DocumentSelector from '../components/DocumentSelector';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const AnalysisResults = ({ results, onBack, handleCopyToClipboard, handleReAnalyze }) => {
  return (
    <div>
    
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={onBack}
        sx={{ mb: 3, mr: 2 }}
        variant="outlined"
      >
        Back to Resume Analysis
      </Button>
      <Button 
        startIcon={<ReplayIcon />} 
        onClick={handleReAnalyze}
        sx={{ mb: 3 }}
        variant="contained"
        color="primary"
      >
        Re-Analyze Resume for the Same Job
      </Button>
      {/* Work Experience Improvements */}
      <Typography variant="h5" gutterBottom>
        Work Experience Improvements
      </Typography>
      <Grid container spacing={2}>
        {results.work_experience?.map((exp, index) => (
          <Grid item xs={12} key={index}>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`work-exp-${index}-content`}
                id={`work-exp-${index}-header`}
              >
                <WorkIcon sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="subtitle1">
                  {exp.company} - {exp.role}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ position: 'relative' }}>
                <div>
                  <Chip 
                    label="Suggested Improvement" 
                    color="secondary" 
                    sx={{ mb: 2 }} 
                  />
                  <Typography variant="body2">
                    {exp.suggested_improvement}
                  </Typography>
                </div>
                <IconButton 
                  color="primary" 
                  onClick={() => handleCopyToClipboard(exp.suggested_improvement)}
                  sx={{ position: 'absolute', right: 8, bottom: 8, fontSize: 'small' }}
                >
                  <ContentCopyIcon fontSize="inherit" />
                </IconButton>
              </AccordionDetails>
            </Accordion>
          </Grid>
        ))}
      </Grid>

      {/* Projects Improvements */}
      <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
        Projects Improvements
      </Typography>
      <Grid container spacing={2}>
        {results.projects?.map((project, index) => (
          <Grid item xs={12} key={index}>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`project-${index}-content`}
                id={`project-${index}-header`}
              >
                <CodeIcon sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="subtitle1">
                  {project.title}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ position: 'relative' }}>
                <div>
                  <Chip 
                    label="Suggested Improvement" 
                    color="secondary" 
                    sx={{ mb: 2 }} 
                  />
                  <Typography variant="body2">
                    {project.suggested_improvement}
                  </Typography>
                </div>
                <IconButton 
                  color="primary" 
                  onClick={() => handleCopyToClipboard(project.suggested_improvement)}
                  sx={{ position: 'absolute', right: 8, bottom: 8, fontSize: 'small' }}
                >
                  <ContentCopyIcon fontSize="inherit" />
                </IconButton>
              </AccordionDetails>
            </Accordion>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

const AnalyzeResume = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showAnalysisResult, setShowAnalysisResult] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        console.log('user.email', user.email);
        const docs = await fetchDocuments(user.email);
        setDocuments(docs);
      } catch (error) {
        console.error('Error fetching documents:', error);
      }
    };
    loadDocuments();
  }, [user.email]);

  const handleAnalyzeResume = async (fileUrl, jobDesc) => {
    if (jobDesc.split(' ').length > 200) {
      alert('Job description cannot exceed 200 words.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8080/analyze-resume', {
        fileUrl,
        jobDescription: jobDesc,
        email: user.email
      });
      setAnalysisResult(response.data);
      setShowAnalysisResult(true);
    } catch (error) {
      console.error('Error analyzing resume:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setOpenSnackbar(true);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <div>
      <AppBar />
      <Container maxWidth="md" sx={{ mt: 4 }} style={{ marginTop: '64px', padding: '20px' }}>
        <Paper sx={{ p: 4 }} elevation={3}>
          {loading ? (
            <CircularProgress style={{ display: 'block', margin: '0 auto' }} />
          ) : showAnalysisResult && analysisResult ? (
            <AnalysisResults 
              results={analysisResult} 
              onBack={() => setShowAnalysisResult(false)} 
              handleCopyToClipboard={handleCopyToClipboard}
              handleReAnalyze={() => handleAnalyzeResume(selectedDocument, jobDescription)}
            />
          ) : (
            <>
              <Typography variant="h4" gutterBottom align="center" style={{ fontWeight: 'bold', color: '#3f51b5' }}>
                Analyze Your Resume
              </Typography>
              <Typography variant="body1" gutterBottom align="center" style={{ marginBottom: '20px' }}>
                Select your resume and paste the job description. JOB.AI's intelligent AI
                will analyze your resume and provide personalized suggestions to align it with
                the specified job description. The AI ensures the word count remains unchanged,
                allowing you to seamlessly use the improved version in tools like Canva, MS Word,
                and others.
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
                    style={{ marginTop: '20px' }}
                    onClick={() => handleAnalyzeResume(selectedDocument, jobDescription)}
                  >
                    Analyze Resume
                  </Button>
                </Grid>
              </Grid>
            </>
          )}
        </Paper>
      </Container>
      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={3000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Copied to clipboard!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AnalyzeResume;
