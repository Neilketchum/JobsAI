const fileModel = require('../models/fileModel');
const Profile = require('../models/profileModel');
const PDFDocument = require("pdfkit");

const { analyzeResumeOpenAi, generateCoverLetterService } = require('../services/openAIServices');
exports.analyzeResume = async (req, res) => {
    const { fileUrl, jobDescription, email } = req.body;
    try {
        const resume = await fileModel.findOne({ fileUrl, email });
        if (!resume) {
            return res.status(404).send('Resume not found');
        }
        if (!resume.parseResumeText) {
            return res.status(404).send('Resume not parsed!Try Deleting and Reuploading the resume');
        }
        const result = await analyzeResumeOpenAi(resume.parseResumeText, jobDescription);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error in analyzeResumeController:', error);
        res.status(500).send('Internal server error');
    }
}
exports.generateCoverLetter = async (req, res) => {
    const { fileUrl, additionalInfo, jobDescription, emailId, companyName, position } = req.body;
    try {
        const doc = new PDFDocument();
        const profile = await Profile.findOne({ email: emailId });

        const sanitizedFileName = `${companyName}_${position}_${profile.name}_Cover_Letter.pdf`.replace(' ','_');//${companyName}_${position}_${profile.name}_Cover_Letter.pdf`.replace(/[^a-zA-Z0-9]/g, '_');
        const resume = await fileModel.findOne({ fileUrl, email:emailId });
        if (!resume) {
            return res.status(404).send('Resume not found');
        }
        if (!resume.parseResumeText) {
            return res.status(404).send('Resume not parsed!Try Deleting and Reuploading the resume');
        }
        
        console.log('Sanitized file name:', sanitizedFileName);
        res.setHeader('Content-Disposition', `attachment; filename="${sanitizedFileName}"`);

        // Stream the PDF back to the user
      doc.pipe(res);
        const coverLetter = await generateCoverLetterService( profile, resume.parseResumeText, jobDescription, additionalInfo, companyName, position);
        doc
            .font("Times-Roman")
            .fontSize(12)
            .text(coverLetter, {
                align: "left",
                lineGap: 2,
                paragraphGap: 4,
            });

        // Finalize the PDF
        doc.end();
    } catch (error) {
        console.error('Error in generateCoverLetterController:', error);
        res.status(500).send('Internal server error');
    }
}
// Function to dynamically generate the prompt
