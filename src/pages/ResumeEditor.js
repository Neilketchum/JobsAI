import React, { useState } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import AppBar from '../components/AppBar';
import MarkdownEditor from '@uiw/react-markdown-editor';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

function ResumeEditor({parsedOriginalResume,setParsedOriginalResume,parsedBoostedResume,setParsedBoostedResume}) {

    const handleDownloadPDF = async () => {
    
    };

    return (
        <div>
            <AppBar />
            <Stack
                direction="row"
                justifyContent="space-evenly"
                style={{
                    marginTop: '64px', padding: '20px'
                }}
            >

                <Typography
                    variant="h4"
                >
                    Stock Resume
                </Typography>

                <Stack flexDirection="row">
                    <Typography variant="h4" style={{ marginRight: '10px' ,marginLeft: '20px'}} >
                        <AutoAwesomeIcon style={{ marginRight: '10px', color: 'red' }} />
                        Boosted Resume
                    </Typography>
                    <Button variant="contained" color="success" onClick={handleDownloadPDF}>
                        Download Boosted Resume
                    </Button>
                </Stack>
            </Stack>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gridTemplateRows: 'repeat(2, 1fr)',
                gap: '20px',
                width: '100vw',
                height: 'calc(100vh - 64px)',
                overflow: 'hidden'
            }}>
                {[parsedOriginalResume, parsedBoostedResume].map((content, index) => (
                    <Box key={index + 2} sx={{
                        boxShadow: 3,
                        borderRadius: 2,
                        border: '1px solid #e0e0e0',
                        p: 2,
                        overflow: 'auto',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>

                        <MarkdownEditor.Markdown source={content} style={{ width: '100%', height: '90%', overflow: 'auto' }} />
                    </Box>
                ))}
                {[parsedOriginalResume, parsedBoostedResume].map((content, index) => (
                    <Box key={index} sx={{
                        boxShadow: 3,
                        borderRadius: 2,
                        border: '1px solid #e0e0e0',
                        padding: '10px',
                        overflow: 'auto',
                        display: 'flex',

                    }}>
                        <MarkdownEditor
                            value={index === 0 ? parsedOriginalResume : parsedBoostedResume}
                            onChange={(value, viewUpdate) => {
                                if (index === 0) {
                                    setParsedOriginalResume(value);
                                } else {
                                    setParsedBoostedResume(value);
                                }
                            }}
                            height="90%"
                            enablePreview={false}
                            enableScroll={true}


                        />
                    </Box>
                ))}

            </div>
        </div>
    );
}

export default ResumeEditor;