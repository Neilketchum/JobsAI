import React, { useState } from 'react';
import AppBar from '../components/AppBar';
import { Typography, Button, Modal, Fade, Backdrop, Box } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const AnalyzeResume = () => {
    const [openResumeUpload, setOpenResumeUpload] = useState(false);
    const fileInput = React.useRef();

    const handleClose = () => {
        setOpenResumeUpload(false);
    };

    const handleOpen = () => {
        setOpenResumeUpload(true);
    };

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 24,
        p: 4,
    };

    return (
        <div>
            <AppBar />
            <div style={{ marginTop: '64px', padding: '20px' }}>
                <Typography variant="h3" component="h3" gutterBottom>
                    My Resumes
                </Typography>
                <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<AddCircleOutlineIcon />} 
                    onClick={handleOpen}
                    sx={{ mb: 2 }}
                >
                    Add Resume 
                </Button>
                <Typography variant="h3" component="h3" gutterBottom>
                    My Cover Letters
                </Typography>
                <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<AddCircleOutlineIcon />} 
                    sx={{ mb: 2 }}
                >
                    Add Cover Letter
                </Button>
            </div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={openResumeUpload}
                onClose={handleClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={openResumeUpload}>
                    <Box sx={style}>
                        <Typography id="transition-modal-title" variant="h6" component="h2">
                            Upload Resume
                        </Typography>
                        <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                            You can upload up to 5 resumes
                        </Typography>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={() => fileInput.current.click()}
                            sx={{ mt: 2 }}
                        >
                            Upload File
                        </Button>

                        <input 
                            ref={fileInput} 
                            type="file" 
                            style={{ display: 'none' }} 
                        />
                    </Box>
                </Fade>
            </Modal>
        </div>
    );
};

export default AnalyzeResume;
