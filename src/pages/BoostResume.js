import {React, useState, useEffect} from 'react';
import ResumeEditor from './ResumeEditor';
import AppBar from '../components/AppBar';
import DocumentSelector from '../components/DocumentSelector';
import { Box, TextField, FormControlLabel, Switch, Button, Typography } from '@mui/material';
import axios from 'axios';
import { fetchDocuments } from '../services/documentService';
import { useAuth } from '../context/AuthContext';

function BoostResume() {
    const { user } = useAuth();
    const [parsedOriginalResume, setParsedOriginalResume] = useState('Stock');
    const [parsedBoostedResume, setParsedBoostedResume] = useState('Boost');
    const [editorMode, setEditorMode] = useState(false);
    const [jobDescription, setJobDescription] = useState('');
    const [additionalInstructions, setAdditionalInstructions] = useState('');
    const [boostDescription, setBoostDescription] = useState(false);
    const [boostWorkEx, setBoostWorkEx] = useState(false);
    const [boostSkills, setBoostSkills] = useState(false);
    const [boostProjects, setBoostProjects] = useState(false);
    const [selectedResume, setSelectedResume] = useState('');
    const [resumes, setResumes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function loadResumes() {
            console.log('user.email', user.email);
            const documents = await fetchDocuments(user.email);
            setResumes(documents);
        }
        loadResumes();
    }, []);

    const handleBoostResume = async () => {
        try {
            setIsLoading(true);
            // Call the parseToMarkDown API
            const parseResponse = await axios.post(`${process.env.REACT_APP_API_URL}/parseToMarkDown`, {
                email: user.email,
                fileUrl: selectedResume
            });
            const parseData = parseResponse.data;
            setParsedOriginalResume(parseData);

            // Call the boostResume API
            const boostResponse = await axios.post(`${process.env.REACT_APP_API_URL}/boostResume`, {
                email: user.email,
                fileUrl: selectedResume,
                jobDescription: jobDescription,
                boostDescription: boostDescription,
                boostSkills: boostSkills,
                boostWorkEx: boostWorkEx,
                boostProjects: boostProjects,
                additionalDescription: additionalInstructions
            });
            const boostData = boostResponse.data;
            setParsedBoostedResume(boostData);
            console.log('Boosted Resume:', boostData);
            console.log('Original Resume:', parseData);
            setEditorMode(true);
        } catch (error) {
            console.error('Error boosting resume:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            {isLoading ? (
                <Typography variant="h6" style={{ textAlign: 'center', marginTop: '20px' }}>Loading...</Typography>
            ) : (
                editorMode ? (
                    <ResumeEditor
                    parsedOriginalResume={parsedOriginalResume}
                    setParsedOriginalResume={setParsedOriginalResume}
                    parsedBoostedResume={parsedBoostedResume}
                    setParsedBoostedResume={setParsedBoostedResume}
                    setEditorMode={setEditorMode}
                />
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
                                <Button variant="contained" color="primary" onClick={handleBoostResume} style={{ marginTop: '20px' }}>
                                    Boost Resume
                                </Button>
                            </Box>
                        </div>
                    </div>
                )
            )}
        </div>
    );
}

export default BoostResume;