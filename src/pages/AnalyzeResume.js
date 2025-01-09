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
  Chip 
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import WorkIcon from '@mui/icons-material/Work';
import CodeIcon from '@mui/icons-material/Code';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { fetchDocuments } from '../services/documentService';
import { useUser } from '../context/UserContext';
import axios from 'axios';

const DocumentSelector = ({ documents, selectedDocument, setSelectedDocument }) => (
  <FormControl fullWidth variant="outlined">
    <InputLabel id="resume-select-label">Select Resume</InputLabel>
    <Select
      labelId="resume-select-label"
      value={selectedDocument}
      onChange={(e) => setSelectedDocument(e.target.value)}
      label="Select Resume"
    >
      {documents.map((doc) => (
        <MenuItem key={doc._id} value={doc.fileUrl}>
          {doc.fileUrl.split('/').pop()}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

const AnalysisResults = ({ results, onBack }) => {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={onBack}
        sx={{ mb: 3 }}
        variant="outlined"
      >
        Back to Resume Analysis
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
              <AccordionDetails>
                <Chip 
                  label="Suggested Improvement" 
                  color="secondary" 
                  sx={{ mb: 2 }} 
                />
                <Typography variant="body2">
                  {exp.suggested_improvement}
                </Typography>
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
              <AccordionDetails>
                <Chip 
                  label="Suggested Improvement" 
                  color="secondary" 
                  sx={{ mb: 2 }} 
                />
                <Typography variant="body2">
                  {project.suggested_improvement}
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

const AnalyzeResume = () => {
  const { user } = useUser();
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showAnalysisResult, setShowAnalysisResult] = useState(false);

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

  const handleAnalyzeResume = async () => {
    if (jobDescription.split(' ').length > 200) {
      alert('Job description cannot exceed 200 words.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8080/analyze-resume', {
        fileUrl: selectedDocument,
        jobDescription,
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
              onBack={() => {
                setShowAnalysisResult(false);
                setAnalysisResult(null);
              }} 
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
                    onClick={handleAnalyzeResume}
                  >
                    Analyze Resume
                  </Button>
                </Grid>
              </Grid>
            </>
          )}
        </Paper>
      </Container>
    </div>
  );
};

export default AnalyzeResume;
