const fs = require('fs');
const { jsPDF } = require('jspdf');

// Read the installation document
const content = fs.readFileSync('installation.doc', 'utf8');

// Create a new PDF document
const doc = new jsPDF();

// Split content into lines
const lines = content.split('\n');

// Set initial position
let y = 20;
const lineHeight = 7;
const margin = 20;
const pageWidth = doc.internal.pageSize.width;

// Process each line
lines.forEach((line) => {
  // Check if we need a new page
  if (y > doc.internal.pageSize.height - margin) {
    doc.addPage();
    y = margin;
  }

  // Handle headers
  if (line.startsWith('# ')) {
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    y += lineHeight;
    doc.text(line.substring(2), margin, y);
    y += lineHeight * 2;
  } else if (line.startsWith('## ')) {
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    y += lineHeight;
    doc.text(line.substring(3), margin, y);
    y += lineHeight * 1.5;
  } else if (line.startsWith('### ')) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    y += lineHeight;
    doc.text(line.substring(4), margin, y);
    y += lineHeight;
  } else {
    // Regular text
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
    // Handle code blocks
    if (line.startsWith('```')) {
      doc.setFont('courier', 'normal');
      y += lineHeight;
    } else if (line.trim() === '') {
      y += lineHeight / 2;
    } else {
      // Split long lines
      const splitText = doc.splitTextToSize(line, pageWidth - (margin * 2));
      doc.text(splitText, margin, y);
      y += lineHeight * splitText.length;
    }
  }
});

// Save the PDF
doc.save('installation.pdf'); 