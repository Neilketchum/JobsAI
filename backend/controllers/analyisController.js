const fileModel = require('../models/fileModel');
const {analyzeResumeOpenAi} = require('../services/openAIServices');
exports.analyzeResume = async (req,res)=>{
    const {fileUrl, jobDescription,email} = req.body;
    try{
        const resume = await fileModel.findOne({fileUrl,email});
        if(!resume){
            return res.status(404).send('Resume not found');
        }
        if(!resume.parseResumeText){
            return res.status(404).send('Resume not parsed!Try Deleting and Reuploading the resume');
        }
        const result = await analyzeResumeOpenAi(resume.parseResumeText, jobDescription);
        res.status(200).json(result);
    }catch(error){
        console.error('Error in analyzeResumeController:', error);
        res.status(500).send('Internal server error');
    }
}