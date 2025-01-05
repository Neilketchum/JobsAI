import React, { useEffect, useState } from 'react';
import AppBar from '../components/AppBar';
import { Typography, Card, CardContent, CardActions, Button, Stack, Modal, Box } from '@mui/material';
import axios from 'axios';

const MyDocuments = () => {
    const [documents, setDocuments] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedResume, setSelectedResume] = useState(null);
    const fileInput = React.useRef();

    const handleOpen = (resume) => {
        setSelectedResume(resume);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedResume(null);
    };

    useEffect(() => {
        axios.get('http://localhost:8080/files/daipayanh@gmail.com')
            .then(response => {
                setDocuments(response.data);
            })
            .catch(error => {
                console.error('Error fetching documents:', error);
            });
    }, []);

    return (
        <div>
            <AppBar />
            <div style={{ marginTop: '64px', padding: '20px' }}>
                <Stack direction="row" alignItems="center" spacing={2} style={{ marginBottom: '24px' }}>
                    <Typography variant="h4" component="h4" gutterBottom>
                        My Resumes
                    </Typography>
                    <Button 
                        variant="contained" 
                        color="success" 
                        onClick={() => fileInput.current.click()}
                        sx={{ mt: 2 }}
                    >
                        Upload Resume
                    </Button>
                    <input 
                        ref={fileInput} 
                        type="file" 
                        style={{ display: 'none' }} 
                    />
                </Stack>
                {documents.map(doc => (
                    <Card key={doc._id} style={{ marginBottom: '20px' }}>
                        <CardContent>
                            <Typography variant="h5" component="h2">
                                {doc.parseResumeText.education[0].institution}
                            </Typography>
                            <Typography color="textSecondary">
                                {doc.parseResumeText.education[0].degree}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" color="primary" onClick={() => window.open(doc.fileUrl, '_blank')}>View PDF</Button>
                            <Button size="small" color="secondary" onClick={() => handleOpen(doc.parseResumeText)}>Show Parsed Resume</Button>
                        </CardActions>
                    </Card>
                ))}
            </div>
            <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 900, height: 700, overflowY: 'auto', bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
                    <Typography id="modal-title" variant="h6" component="h2">
                        Parsed Resume
                    </Typography>
                    <pre id="modal-description" style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                        {selectedResume && JSON.stringify(selectedResume, null, 2)}
                    </pre>
                </Box>
            </Modal>
        </div>
    );
};

export default MyDocuments;
