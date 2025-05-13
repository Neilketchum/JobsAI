const fileModel = require('../models/fileModel');
const openai = require('../config/openaiConfig');

/**
 * Generates a well-structured, one-page Markdown resume from a parsed resume JSON using ChatGPT.
 * Applies formatting rules and emphasizes ATS-friendly structure.
 * 
 * @param {Object} resumeJson - The parsed or boosted resume JSON data
 * @returns {Promise<string>} - Markdown-formatted resume
 */
async function generateMarkdownFromResumeJSON(resumeJson) {
    try {
        const prompt = `Convert the following JSON resume into a concise, well-structured Markdown document.
- Ensure the content fits well on a page when converted to PDF.
- Follow this order: Bio (summary), Education, Work Experience, Skills, Projects, and the rest if present.
- Avoid using HTML tags.
- Use bullet points for clarity.
- Bold technical keywords such as programming languages, technologies, frameworks, and tools in the work experience and project sections.
- If a section has no content, omit it.
- No commentary — return just the resume in Markdown format.

Template:
# [Full Name]

[Summary]

## Contact 
- **Email**: [Email]        **Phone**: [Phone]
- **GitHub**: [GitHub]      **LinkedIn**: [LinkedIn]

## Education
- **[Degree]** in [Field], [Institution] ([Start Date] - [End Date]), GPA: [GPA]/total GPA (if present)

## Work Experience
- **[Position]** at [Company] ([Start Date] - [End Date])
  - Responsibilities:
    - **[Responsibility 1]**
    - **[Responsibility 2]**

## Projects
- **[Title]**
  - [Description]
  - Code URL: [URL] (If present)
  - Demo URL: [URL] (If present)
  - Technologies: [Technology 1], [Technology 2], ...

## Skills
- Programming Languages: [Language 1], [Language 2], ...
- Frameworks: [Framework 1], [Framework 2], ...
- Databases: [Database 1], [Database 2], ...
- Tools: [Tool 1], [Tool 2], ...
- Others: [Other Skill 1], [Other Skill 2], ...

JSON Data:
${JSON.stringify(resumeJson, null, 2)}`;

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 1500,
            temperature: 0
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error('Error generating Markdown from resume JSON:', error);
        return '';
    }
}

/**
 * Converts parsed resume JSON to Markdown if not already present.
 * 
 * @param {string} fileUrl - File identifier
 * @param {string} email - User's email
 * @returns {Promise<string|null>} - Markdown resume or null if not available
 */
exports.parseResumetoMarkDown = async (fileUrl, email) => {
    try {
        const resume = await fileModel.findOne({ fileUrl, email });
        if (!resume) {
            console.error(`No resume found for fileUrl: ${fileUrl}, email: ${email}`);
            return null;
        }
        const parsedResume = resume.parseResumeText;
        if (resume.parsedMarkdownResume) return resume.parsedMarkdownResume;
        if (!parsedResume) return null;

        const markdown = await generateMarkdownFromResumeJSON(parsedResume);
        resume.parsedMarkdownResume = markdown;
        await resume.save();
        return markdown;
    } catch (error) {
        console.error('Error in parseResumetoMarkDown:', error);
        return null;
    }
};

/**
 * Generates an AI prompt for optimizing a specific resume section.
 */
function generatePromptForSection(section, content, jobDescription, additionalDescription = '') {
    switch (section) {
        case 'bio':
            return `You are a resume optimization expert.\nOptimize the professional summary:\n- Summarize the candidate's experience, strengths, and career goals in 3-5 sentences.\n- Align with the job description and use ATS-friendly keywords.\n- Use a confident, professional tone.\n\nJob Description:\n${jobDescription}\n\nAdditional Comments:\n${additionalDescription || 'N/A'}\n\nCurrent Summary:\n${JSON.stringify(content)}\n\nReturn only the new professional summary.`;

        case 'skills':
            return `You are a resume optimization expert.\nEnhance the Skills section:\n- Match relevant requirements from the job description.\n- Group into categories (Programming, Frameworks, Tools, etc.).\n- Add missing in-demand tools/technologies from the job description or additional comments.\n- Remove outdated or irrelevant skills.\n\nJob Description:\n${jobDescription}\n\nAdditional Comments:\n${additionalDescription || 'N/A'}\n\nCurrent Skills:\n${JSON.stringify(content)}\n\nReturn the result as a JSON array of categories and skills.`;

        case 'projects':
            return `You are a resume enhancement expert.\nOptimize the Projects section:\n- Use concise, outcome-driven bullet points.\n- Highlight technologies and methods from the job description and additional comments.\n- Include metrics where possible.\n\nJob Description:\n${jobDescription}\n\nAdditional Comments:\n${additionalDescription || 'N/A'}\n\nCurrent Projects:\n${JSON.stringify(content)}\n\nReturn updated projects in JSON format.`;

        case 'work_experience':
            return `You are a resume optimization expert.
                Improve the Work Experience section with the following guidelines:
                - Use strong action verbs and quantify impact with metrics.
                - Include and **bold** relevant keywords and technologies from the job description and additional comments.
                - Group responsibilities under each role in clear, concise bullet points.
                - You may infer tools and technologies where reasonable based on context (e.g., if the candidate builds pipelines, infer possible use of **Kafka**, **Airflow**, **Jenkins**, **Terraform**, etc.).
                - Be ATS-friendly and avoid overuse of filler language.
                - Output should be in JSON format — an array of roles with updated responsibilities.
                
                Job Description:
                ${jobDescription}
                
                Technologies to emphasize:
                ${additionalDescription || 'None'}
                
                Current Work Experience:
                ${JSON.stringify(content)}
                
                Return only the updated work_experience section in JSON format.`;
        default:
            return '';
    }
}

/**
 * Helper to call OpenAI Chat API and optionally parse JSON.
 */
async function callOpenAI(prompt, parseJson = false) {
    const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: parseJson ? 500 : 1500,
        temperature: 1
    });
    const text = response.choices[0].message.content;
    if (parseJson) {
        try {
            return JSON.parse(text);
        } catch (e) {
            console.error('Failed to parse JSON from OpenAI:', e);
            // Return raw text if not valid JSON
            return text;
        }
    }
    return text;
}

/**
 * Converts parsed resume (updated or raw) into Markdown using OpenAI.
 * @param {Object} parsedResume - Parsed or enhanced resume in JSON
 * @returns {Promise<string>} - Markdown formatted resume
 */
async function convertToMarkdown(parsedResume) {
    return await generateMarkdownFromResumeJSON(parsedResume);
}

/**
 * Boosts resume sections based on job description and re-renders updated markdown.
 */
exports.boostResumeWithAI = async (req, res) => {
    const {
        email,
        fileUrl,
        jobDescription,
        boostDescription,
        boostSkills,
        boostProjects,
        boostWorkEx,
        additionalDescription
    } = req.body;

    try {
        const resume = await fileModel.findOne({ email, fileUrl });
        if (!resume || !resume.parseResumeText) {
            return res.status(404).send('Resume not found or not parsed yet');
        }

        const parsed = resume.parseResumeText;
        const updatedSections = {};

        if (boostDescription) {
            const bioPrompt = generatePromptForSection("bio", parsed.bio, jobDescription, additionalDescription);
            updatedSections.bio = await callOpenAI(bioPrompt);
        }

        if (boostSkills) {
            const skillsPrompt = generatePromptForSection("skills", parsed.skills, jobDescription, additionalDescription);
            updatedSections.skills = await callOpenAI(skillsPrompt);
        }

        if (boostProjects) {
            const projectsPrompt = generatePromptForSection("projects", parsed.projects, jobDescription, additionalDescription);
            updatedSections.projects = await callOpenAI(projectsPrompt);
        }

        if (boostWorkEx) {
            const workExpPrompt = generatePromptForSection("work_experience", parsed.work_experience, jobDescription, additionalDescription);
            updatedSections.work_experience = await callOpenAI(workExpPrompt);
        }

        const finalMarkdown = await convertToMarkdown({
            ...parsed,
            ...updatedSections
        });
        console.log(finalMarkdown);
        res.setHeader('Content-Type', 'text/markdown');
        res.send(finalMarkdown);
    } catch (error) {
        console.error('Error in boostResume:', error);
        res.status(500).send('Internal Server Error');
    }
};
