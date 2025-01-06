import React, { useState, useEffect } from 'react';
import AppBar from '../components/AppBar';
import { Typography, Button, TextField, Container, Grid, Paper, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { fetchDocuments } from '../services/documentService';
import { useUser } from '../context/UserContext';

const AnalyzeResume = () => {
    const { user } = useUser();
    const [documents, setDocuments] = useState([]);
    const [selectedDocument, setSelectedDocument] = useState('');

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

    return (
        <div>
            <AppBar />
            <Container maxWidth="md" style={{ marginTop: '64px', padding: '20px' }}>
                <Paper elevation={3} style={{ padding: '70px', borderRadius: '10px' }}>
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
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Job Description"
                                multiline
                                rows={4}
                                variant="outlined"
                                placeholder="Paste the job description here"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" color="primary" size="large" style={{ marginTop: '20px' }}>
                                Analyze Resume
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </div>
    );
};

export default AnalyzeResume;
