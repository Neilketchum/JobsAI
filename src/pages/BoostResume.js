import {  Box } from '@mui/material'
import React from 'react'
import AppBar from '../components/AppBar';
import MarkdownEditor from '@uiw/react-markdown-editor';


function BoostResume() {
  const parsedOrginalResume = ""
  const parsedBoostedResume = ""  
  return (
    <div>
    <AppBar />
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '20px',marginTop: '64px', padding: '20px' }}>
      <Box sx={{ boxShadow: 3, borderRadius: 2, border: '1px solid #e0e0e0', p: 2 }}>
       
       <Box/>
      </Box>
      <Box sx={{ boxShadow: 3, borderRadius: 2, border: '1px solid #e0e0e0', p: 2 }}>
      
      </Box>
        <Box sx={{ boxShadow: 3, borderRadius: 2, border: '1px solid #e0e0e0', p: 2 }}>
        <MarkdownEditor
        value={parsedOrginalResume}
        disabled = {true}
        onChange={(value, viewUpdate) => {
            console.log(value);
        }}
        />
      </Box>
      <Box sx={{ boxShadow: 3, borderRadius: 2, border: '1px solid #e0e0e0', p: 2, textAlign: 'center' }}>
        <MarkdownEditor
        value={parsedBoostedResume}
        onChange={(value, viewUpdate) => {
            
        }}
        />
      </Box>
    </div>
    </div>
  )
}

export default BoostResume