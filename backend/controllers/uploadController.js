const uploadService = require('../services/uploadService');
const {parseResume} = require('../services/openAIServices');
const File = require('../models/fileModel');
const markdownpdf = require('markdown-pdf');
const stream = require('stream');

// Use system Chrome specified in env or fallback

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
  if (!markdown) return res.status(400).send('No markdown content provided.');
  try {

    const mdStream = new stream.Readable();
    mdStream.push(markdown);
    mdStream.push(null); // End stream
  
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=converted.pdf',
    });
  
    mdStream.pipe(markdownpdf()).pipe(res);
    // const html = `<!doctype html><html><head><meta charset="utf-8"><style>body{font-family:sans-serif;padding:20px;}</style></head><body>${marked(markdown)}</body></html>`;
    // const launchOptions = {
    //   headless: true,
    //   args: ['--no-sandbox', '--disable-setuid-sandbox'],
    // };
    // if (process.env.CHROME_PATH) {
    //   launchOptions.executablePath = process.env.CHROME_PATH;
    // }
    // const browser = await puppeteer.launch(launchOptions);
    // const page = await browser.newPage();
    // await page.setContent(html, { waitUntil: 'networkidle0' });
    // const buffer = await page.pdf({ format: 'A4', margin: { top: '5mm', bottom: '5mm' } });
    // await browser.close();
    // res.setHeader('Content-Type', 'application/pdf');
    // res.setHeader('Content-Disposition', 'attachment; filename=resume.pdf');
    // return res.send(buffer);
  } catch (error) {
    console.error('PDF generation failed:', error);
    return res.status(500).send('Error generating PDF.');
  }
};

// Helper function to determine the number of pages in a PDF
async function getPageCount(pdfBuffer) {
  const pdfjsLib = require('pdfjs-dist');
  const loadingTask = pdfjsLib.getDocument({ data: pdfBuffer });
  const pdfDocument = await loadingTask.promise;
  return pdfDocument.numPages;
}