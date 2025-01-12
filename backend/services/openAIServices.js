const openai = require('../config/openaiConfig');
const fs = require('fs');
const pdf = require('pdf-parse');

async function generateCoverLetter(resumeUrl, additionalInfo, jobDescription, emailId) {
    // Logic to generate cover letter using OpenAI API
    // Return the generated cover letter as a string
}

async function analyzeResumeOpenAi(resumeContent, jobDescription) {
    for (let attempt = 1; attempt <= 3; attempt++) {
        try {
            const prompt = `The following JSON represents a resume. Provide specific suggestions to improve the 'work_experience' and 'projects' sections to align with the job description below:

            Job Description:
            ${jobDescription}

            Resume JSON:
            ${JSON.stringify(resumeContent, null, 2)}

            Instructions:
            1. For each 'work_experience' entry, suggest updates by including job-relevant tools, technologies, or achievements that align with the job description.
            2. For roles at the same company, provide distinct suggestions by specifying the role or position to avoid ambiguity.
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
                model: 'gpt-4o-mini',
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
      - education: [{ institution, degree, start_date, end_date }]
      - work_experience: [{ company, position, start_date, end_date, responsibilities }]
      - projects: [{ title, description, technologies }]
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

module.exports = { parseResume, analyzeResumeOpenAi };