const openai = require('../config/openaiConfig');
const fs = require('fs');
const pdf = require('pdf-parse');

function buildPrompt(name,jobDescription, resume, additionalInfo, companyName, position, linkedIn, github, website, email, phone) {
    let prompt = `
    You are a career assistant specializing in crafting tailored cover letters and job application materials. Use the following input details to create a professional and personalized cover letter.Dont include candidate and company physicall adresses:
    
    **Job Description**: ${JSON.stringify(jobDescription)}
    **Resume (Parsed JSON)**: ${JSON.stringify(resume)}
    **Company Name**: ${companyName}
    **Position**: ${position}
    ** Date**: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
    **Contact Information**: Email: ${email}, Phone: ${phone}, Candidate Name: ${name}
    `;
    
        // Conditionally add LinkedIn, GitHub, and Personal Website if they exist
        if (linkedIn) prompt += ` **LinkedIn URL**: ${linkedIn}\n`;
        if (github) prompt += ` **GitHub Profile**: ${github}\n`;
        if (website) prompt += ` **Personal Website**: ${website}\n`;
    
        // Add Additional Information only if it exists
        if (additionalInfo) prompt += ` **Additional Information**: ${additionalInfo}\n`;
    
        // Add output requirements
        prompt += `
    **Output Requirements**:
    -Avoid Markdown Formatting
    - Add date to the cover letter as given in the input.Dont need any physical address for both candidate and company .Adress it to the Hiring Manager,no name is required. Do NOT LEAVE ANY PLACEHOLDERS  IN THE COVER LETTER that would need to be filled in by the candidate.This should be a fully completed cover letter.
    - Write a customized and compelling cover letter for the specified job application.
    - Highlight the alignment between the candidate’s experience and the job requirements.
    - Demonstrate enthusiasm for the company’s mission and how the candidate can contribute meaningfully.
    - Include appropriate contact information and call-to-action for an interview.
    - Make sure spacing and paragraphing is perfect.
    - Ensure all contact details provided (email, phone, LinkedIn, GitHub, website) are included correctly in the end of the cover letter .
     Ensure the tone is professional, concise, and tailored to the company's culture.
    `;
    
        return prompt;
}

    
  
async function generateCoverLetterService(profile,resume,jobDescription,additionalInfo,companyName,position) {
    // Logic to generate cover letter using OpenAI API
    // Return the generated cover letter as a string
    const prompt = buildPrompt(profile.name,jobDescription, resume, additionalInfo, companyName, position, profile.linkedinUrl, profile.githubUrl, profile.personalWebsiteUrl, profile.email, profile.phoneNumber);
    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2500,
    });
    return response.choices[0].message.content;
 //  TODO: WE NEED TO CHANGE hoW WE iNIT OUR moDel WE NeeD to add system promppts
}

async function analyzeResumeOpenAi(resumeContent, jobDescription) {
    for (let attempt = 1; attempt <= 3; attempt++) {
        try {
            const prompt = `The following JSON represents a resume. Improve the 'work_experience' and 'projects' sections to align with the job description below:

            Job Description:
            ${jobDescription}

            Resume JSON:
            ${JSON.stringify(resumeContent, null, 2)}

            Instructions:
            1. For each 'work_experience' entry, imrove updates by including job-relevant tools, technologies, or achievements that align with the job description.
            2. For roles at the same company, provide distinct improvments by specifying the role or position to avoid ambiguity.
            3. Refine 'projects' to highlight relevant tools, technologies, or outcomes that align with the job description.
            4. Optimize for Applicant Tracking Systems by incorporating relevant keywords, skills, and technologies from the job description.
            5. Provide the output in the following JSON format, strictly adhering to the structure:

            {
            "work_experience": [
                {
                "company": "<Company Name>",
                "role": "<Role or Position>",
                "suggested_improvement": "<Suggested improvement for this specific role>"
                },
                {
                "company": "<Company Name>",
                "role": "<Role or Position>",
                "suggested_improvement": "<Suggested improvement for this specific role>"
                }
            ],
            "projects": [
                {
                "title": "<Project Title>",
                "suggested_improvement": "<Suggested improvement for this project>"
                },
                {
                "title": "<Project Title>",
                "suggested_improvement": "<Suggested improvement for this project>"
                }
            ]
            }

            6. Do NOT include existing entries. Only return the suggested improvements.`;


            const response = await openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 1500,
            });

            const content = response.choices[0].message.content;
            const jsonContent = content.replace(/^```json\n|```$/g, '');
            try {
                const parsedData = JSON.parse(jsonContent);
                return parsedData;
            } catch (error) {
                console.error(`Error parsing JSON on attempt ${attempt}: ${error.message}. Extracted text: ${jsonContent}`);
                if (attempt === 3) {
                    throw new Error('Failed to parse suggestions after 3 attempts');
                }
            }
        } catch (error) {
            console.error(`Attempt ${attempt} failed in generateResumeTweaks:`, error);
            if (attempt === 3) {
                throw new Error('Failed to generate resume tweaks after 3 attempts');
            }
        }
    }
}


async function parseResume(fileBuffer) {
    for (let attempt = 1; attempt <= 3; attempt++) {
        try {
            const pdfData = await pdf(fileBuffer); // Convert buffer to string
            const fileContent = pdfData.text;
            const prompt = `Extract the following details from the resume in valid JSON format with these keys:
      - contacts: [{ first_name, last_name ,github, linkedin, website, email, phone, address ...} ] 
      - bio: { summary }   
      - education: [{ institution, degree, start_date, end_date }]
      - work_experience: [{ company, position, start_date, end_date, responsibilities }]
      - projects: [{ title, description, technologies,democodeurl(if present),codebaseurl(if present) }] 
      - skills: { categories (e.g., programming_languages, tools, frameworks) }
      - certifications: [{ name, issuer }]

      If synonyms like "job experience" or "professional experience" are used instead of "work experience," ensure they are parsed under the "work_experience" key. Similarly, ensure consistency for all categories regardless of synonyms.

      Ensure the response is a well-structured, valid JSON object without any additional text or commentary.

      Resume Content:

      ${fileContent}`;
            const response = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 1500,
                temperature: 0
            });

            const content = response.choices[0].message.content;
            const jsonContent = content.replace(/^```json\n|```$/g, '');
            try {
                const parsedData = JSON.parse(jsonContent);
                return parsedData;
            } catch (error) {
                console.error(`Error parsing JSON on attempt ${attempt}: ${error.message}. Extracted text: ${jsonContent}`);
                // Continue to the next attempt without throwing an error
                if (attempt === 3) {
                    throw new Error('Failed to parse resume after 3 attempts');
                }
            }
        } catch (error) {
            console.error(`Attempt ${attempt} failed in parseResume:`, error);
            if (attempt === 3) {
                throw new Error('Failed to parse resume after 3 attempts');
            }
        }
    }
}

async function suggestModificationService(coverLetterText, modificationText, resumeText) {
    const prompt = `
    Based on the following cover letter, incorporate the user's suggestions to create an updated version:

    **Original Cover Letter**: ${coverLetterText}
    **User Suggestions**: ${modificationText}
    **Candidate Resume**: ${resumeText}

    Please provide only the updated cover letter text as the output, without any additional formatting or headings.
    `;

    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2500,
    });
    console.log(response.choices[0].message.content);
    return response.choices[0].message.content;
}

module.exports = { parseResume, analyzeResumeOpenAi, generateCoverLetterService, suggestModificationService };