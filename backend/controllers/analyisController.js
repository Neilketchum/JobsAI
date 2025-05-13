const fileModel = require('../models/fileModel');
const Profile = require('../models/profileModel');
const PDFDocument = require("pdfkit");
const {parseResumetoMarkDown, boostResumeWithAI} = require('../services/ResumeOptimizer');
const { analyzeResumeOpenAi, generateCoverLetterService, suggestModificationService } = require('../services/openAIServices');

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
exports.generateCoverLetterText = async (req, res) => {
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
        // res.setHeader('Content-Disposition', `attachment; filename="${sanitizedFileName}"`);

        const coverLetter = await generateCoverLetterService( profile, resume.parseResumeText, jobDescription, additionalInfo, companyName, position);
        res.status(200).json({ coverLetter });
    } catch (error) {
        console.error('Error in generateCoverLetterController:', error);
        res.status(500).send('Internal server error');
    }
}
// Function to dynamically generate the prompt

exports.suggestModification = async (req, res) => {
    const { coverLetterText, modificationText, fileUrl, email } = req.body;
    try {
        const resume = await fileModel.findOne({ fileUrl, email });
        if (!resume) {
            return res.status(404).send('Resume not found');
        }
        if (!resume.parseResumeText) {
            return res.status(404).send('Resume not parsed! Try deleting and reuploading the resume');
        }
        const coverLetter = await suggestModificationService(coverLetterText, modificationText, resume.parseResumeText);
        res.status(200).json({ coverLetter });
    } catch (error) {
        console.error('Error generating updated cover letter:', error);
        res.status(500).send('Internal server error');
    }
};
exports.parseToMarkDown = async (req, res) => {
    const { fileUrl, email } = req.body;
    try {
        const markdown = await parseResumetoMarkDown(fileUrl, email);
        if (!markdown) {
            return res.status(404).send('Resume not found or could not be parsed');
        }
        res.setHeader('Content-Type', 'text/markdown');
        res.status(200).send(markdown);
    } catch (error) {
        console.error('Error in boostResumeController:', error);
        res.status(500).send('Internal server error');
    }
};
    exports.boostResume = async (req, res) => {
        const { email, fileUrl, jobDescription, boostDescription, boostSkills,boostProjects, boostWorkEx, additionalDescription } = req.body;
        try {
            console.log('email', email);
            console.log('fileUrl', fileUrl);
            console.log('jobDescription', jobDescription);
            console.log('boostDescription', boostDescription);
            console.log('boostSkills', boostSkills);
            console.log('boostWorkEx', boostWorkEx);
            console.log('boostProjects', boostProjects);
            console.log('additionalDescription', additionalDescription);
            // Retrieve the markdown text from the file model
            const resume = await fileModel.findOne({ email, fileUrl });
            if (!resume || !resume.parsedMarkdownResume) {
                return res.status(404).send('Resume not found or not parsed yet');
            }

            const markdownText = resume.parsedMarkdownResume;

            // Call the ResumeOptimizer function to boost the resume
            const boostedMarkdown = await boostResumeWithAI(req,res);

            // Respond with the boosted markdown
            // res.setHeader('Content-Type', 'text/markdown');
            res.send(boostedMarkdown);
        } catch (error) {
            console.error('Error in boostResume:', error);
            res.status(500).send('Internal server error');
        }
};