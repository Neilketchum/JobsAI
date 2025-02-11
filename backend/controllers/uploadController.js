const uploadService = require('../services/uploadService');
const {parseResume} = require('../services/openAIServices');
const File = require('../models/fileModel');
const { mdToPdf } = require('md-to-pdf');

exports.uploadFile = async (req, res) => {
  try {
    const { emailId } = req.body;
    const file = req.file;
    if (!file || !emailId) {
      return res.status(400).send('No file uploaded or email ID missing.');
    }
    const parseResumeText = await parseResume(req.file.buffer); 
    const result = await uploadService.uploadFileToGCS(file, emailId, parseResumeText);
    res.status(200).send(result);
  } catch (error) {
    console.error('Error in uploadController:', error);
    res.status(500).send({ message: 'Internal server error', error: error.message });
  }
};

exports.getFilesByEmail = async (req, res) => {
  try {
    const { emailId } = req.params;
    const files = await File.find({ email: emailId });
    if (!files.length) {
      return res.status(404).send('No files found for the given email ID.');
    }
    res.status(200).json(files);
  } catch (error) {
    console.error('Error in getFilesByEmail:', error);
    res.status(500).send('Internal server error');
  }
};

exports.deleteFile = async (req, res) => {
  try {
    const { emailId, fileUrl } = req.body;

    const file = await File.findOneAndDelete({ email: emailId, fileUrl });

    if (!file) {
      return res.status(404).send('File not found or already deleted.');
    }

    res.status(200).send({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error in deleteFile:', error);
    res.status(500).send('Internal server error');
  }
};

exports.downloadMarkdownPDF = async (req, res) => {
  const { markdown } = req.body;

  if (!markdown) {
    return res.status(400).send('No markdown content provided.');
  }

  try {
    // Convert Markdown to PDF with fixed options
    const pdf = await mdToPdf({ content: markdown }, {
      pdf_options: {
        format: 'A4',
        margin: '5mm',
        scale: 1.0, // Set a fixed scale
      }
    }).catch(console.error);

    if (pdf && pdf.content) {
      // Send the PDF as a response
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=resume.pdf');
      res.send(Buffer.from(pdf.content));
    } else {
      console.error('PDF generation failed.');
      res.status(500).send('Error generating PDF.');
    }

  } catch (error) {
    console.error('Error creating PDF:', error);
    res.status(500).send('Error generating PDF.');
  }
};

// Helper function to determine the number of pages in a PDF
async function getPageCount(pdfBuffer) {
  const pdfjsLib = require('pdfjs-dist');
  const loadingTask = pdfjsLib.getDocument({ data: pdfBuffer });
  const pdfDocument = await loadingTask.promise;
  return pdfDocument.numPages;
}