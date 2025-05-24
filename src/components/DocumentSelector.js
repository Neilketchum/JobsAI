import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const DocumentSelector = ({ documents, selectedDocument, setSelectedDocument, disabled }) => (
  <FormControl variant="outlined" fullWidth disabled={disabled}>
    <InputLabel>Select Document</InputLabel>
    <Select
      value={selectedDocument}
      onChange={(e) => setSelectedDocument(e.target.value)}
      label="Select Document"
    >
      {documents.map((doc) => {
        const fileName = doc.fileUrl.split('/').pop();
        return <MenuItem key={doc.fileUrl} value={doc.fileUrl}>{fileName}</MenuItem>;
      })}
    </Select>
  </FormControl>
);

export default DocumentSelector;
