import React, { useEffect, useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { fetchDocuments } from '../services/documentService';
import { useAuth } from '../context/AuthContext';

const DocumentSelector = ({ selectedResume, setSelectedResume }) => {
    const { user } = useAuth();
    const [resumes, setResumes] = useState([]);

    useEffect(() => {
        async function loadResumes() {
            const documents = await fetchDocuments(user.email);
            setResumes(documents);
        }
        loadResumes();
    }, [user.email]);

    return (
        <FormControl variant="outlined" fullWidth>
            <InputLabel>Select Resume</InputLabel>
            <Select
                value={selectedResume}
                onChange={(e) => setSelectedResume(e.target.value)}
                label="Select Resume"
            >
                {resumes.map((resume) => {
                    const fileName = resume.fileUrl.split('/').pop();
                    return (
                        <MenuItem key={resume.fileUrl} value={resume.fileUrl}>{fileName}</MenuItem>
                    );
                })}
            </Select>
        </FormControl>
    );
};

export default DocumentSelector;
