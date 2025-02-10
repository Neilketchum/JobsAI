import React from 'react';
import { Card, CardContent, CardActions, Button, Typography } from '@mui/material';

const DocumentCard = ({ doc, onView, onShowParsed, onDelete }) => {
    return (
        <Card key={doc._id} style={{ marginBottom: '20px' }}>
            <CardContent>
                <Typography variant="h5" component="h2">
                    {doc.fileUrl.split('/').pop()}
                </Typography>
                <Typography color="textSecondary">
                    Uploaded on: {new Date(doc.dateUploaded).toLocaleDateString()}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" color="secondary" onClick={onShowParsed}>Show Parsed Resume</Button>
                <Button size="small" color="error" onClick={onDelete}>Delete Resume</Button>
            </CardActions>
        </Card>
    );
};

export default DocumentCard;
