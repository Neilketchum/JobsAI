import {React, useState, useEffect} from 'react';
import ResumeEditor from './ResumeEditor';
import AppBar from '../components/AppBar';
import DocumentSelector from '../components/DocumentSelector';
import { Box, TextField, FormControlLabel, Switch, Button, Typography } from '@mui/material';
import { fetchDocuments } from '../services/documentService';
import { useAuth } from '../context/AuthContext';

function BoostResume() {
    const { user } = useAuth();
    const [editorMode, setEditorMode] = useState(false);
    const [jobDescription, setJobDescription] = useState('');
    const [additionalInstructions, setAdditionalInstructions] = useState('');
    const [boostDescription, setBoostDescription] = useState(false);
    const [boostWorkEx, setBoostWorkEx] = useState(false);
    const [boostSkills, setBoostSkills] = useState(false);
    const [boostProjects, setBoostProjects] = useState(false);
    const [selectedResume, setSelectedResume] = useState('');
    const [resumes, setResumes] = useState([]);

    useEffect(() => {
        async function loadResumes() {
            console.log('user.email', user.email);
            const documents = await fetchDocuments(user.email);
            setResumes(documents);
        }
        loadResumes();
    }, []);

    return (
        <div>
            {editorMode ? (
                <ResumeEditor />
            ) : (
                <div>
                    <AppBar />
                    <div style={{
                        padding: '20px',
                        marginTop: '124px',
                        textAlign: 'center',
                    }}>
                        <Typography variant="h5" gutterBottom style={{ color: '#3f51b5' }}>
                            Take the Resume Shortlist Round Out of the Equation with Jobs.AI Intelligent Resume Booster
                        </Typography>
                        <Box style={{
                            padding: '30px',
                            marginTop: '20px',
                            maxWidth: '700px',
                            margin: '0 auto',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '20px',
                            boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
                            borderRadius: '8px',
                            backgroundColor: '#ffffff'
                        }}>
                            <DocumentSelector selectedResume={selectedResume} setSelectedResume={setSelectedResume} />
                            <TextField
                                label="Job Description"
                                multiline
                                rows={4}
                                variant="outlined"
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                            />
                            <TextField
                                label="Additional Instructions"
                                multiline
                                rows={4}
                                variant="outlined"
                                value={additionalInstructions}
                                onChange={(e) => setAdditionalInstructions(e.target.value)}
                            />
                            <FormControlLabel
                                control={<Switch checked={boostDescription} onChange={(e) => setBoostDescription(e.target.checked)} />}
                                label="Boost Description"
                            />
                            <FormControlLabel
                                control={<Switch checked={boostWorkEx} onChange={(e) => setBoostWorkEx(e.target.checked)} />}
                                label="Boost Work Experience"
                            />
                            <FormControlLabel
                                control={<Switch checked={boostSkills} onChange={(e) => setBoostSkills(e.target.checked)} />}
                                label="Boost Skills"
                            />
                            <FormControlLabel
                                control={<Switch checked={boostProjects} onChange={(e) => setBoostProjects(e.target.checked)} />}
                                label="Boost Projects"
                            />
                            <Button variant="contained" color="primary" onClick={() => console.log('Boost Resume clicked')} style={{ marginTop: '20px' }}>
                                Boost Resume
                            </Button>
                        </Box>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BoostResume;