exports.analyzeResume = async (req,res)=>{
    const {parseResumeText, jobDescription} = req.body;
    try{
        const result = await analyzeResumeOpenAi(parseResumeText, jobDescription);
        res.status(200).json(result);
    }catch(error){
        console.error('Error in analyzeResumeController:', error);
        res.status(500).send('Internal server error');
    }
}