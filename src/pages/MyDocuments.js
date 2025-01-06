import React, { useEffect, useState } from 'react';
import AppBar from '../components/AppBar';
import { Stack, Modal, Box, Typography, Button, Alert, Snackbar } from '@mui/material';
import DocumentCard from '../components/DocumentCard';
import { fetchDocuments, deleteDocument } from '../services/documentService';
import { useUser } from '../context/UserContext';
import { useAlert } from '../context/AlertContext';

const MyDocuments = () => {
    const { user } = useUser();
    const { showAlert } = useAlert();
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

    const handleDelete = async (fileUrl, email) => {
        try {
            console.log('fileUrl', fileUrl);
            console.log('email', email);
            await deleteDocument(fileUrl, email);
            setDocuments(prevDocs => prevDocs.filter(doc => doc.fileUrl !== fileUrl));
        } catch (error) {
            console.error('Error deleting file:', error);
        }
    };

    const handleUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('pdf', file);
        formData.append('emailId', user.email);

        showAlert('File being uploaded and parsed. This may take up to 2 minutes.', 'info');

        try {
            const response = await fetch('http://localhost:8080/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to upload resume');
            }

            const result = await response.json();
            console.log('Upload successful:', result);

            showAlert(`${file.name} uploaded successfully.`, 'success');

            // Refresh the documents list
            const docs = await fetchDocuments(user.email);
            setDocuments(docs);
        } catch (error) {
            console.error('Error uploading resume:', error);
            showAlert(`${file.name} upload failed.`, 'error');
        }
    };


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
                        accept="application/pdf"
                        onChange={handleUpload}
                    />
                </Stack>
                {documents.map(doc => (
                    <DocumentCard 
                        key={doc._id} 
                        doc={doc} 
                        onView={() => window.open(doc.fileUrl, '_blank')} 
                        onShowParsed={() => handleOpen(doc.parseResumeText)} 
                        onDelete={() => handleDelete(doc.fileUrl, user.email)}
                    />
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
