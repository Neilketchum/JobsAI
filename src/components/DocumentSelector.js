import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

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

export default DocumentSelector;
