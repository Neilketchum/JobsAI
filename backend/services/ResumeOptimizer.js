const fileModel = require('../models/fileModel');
const openai = require('../config/openaiConfig');

exports.parseResumetoMarkDown = async (fileUrl, email) => {
    try {
        const resume = await fileModel.findOne({ fileUrl, email });
        const parsedResume = resume.parseResumeText;
        if (resume.parsedMarkdownResume) {
            return resume.parsedMarkdownResume
        }
        if (!parsedResume) {
            return null;
        }

        const prompt = `Convert the following JSON resume into a concise, well-structured Markdown document. Ensure the content fits well on a page when converted to PDF, avoid using HTML tags, and use bullet points for clarity. Bold technical keywords such as programming languages, technologies, frameworks, and tools in the work experience and project sections. If there is no content to display, omit that section.

Template:
# [Full Name]

[Summary]

## Contact 
- **Email**: [Email]        **Phone**: [Phone]
- **GitHub**: [GitHub]      **LinkedIn**: [LinkedIn]
- [any more contact details]
## Education
[For each education entry:]
- **[Degree]** in [Field], [Institution] ([Start Date] - [End Date]),GPA: [GPA]/total GPA (IF present)

## Work Experience
[For each work experience entry:]
- **[Position]** at [Company] ([Start Date] - [End Date])
  - Responsibilities:
    - **[Responsibility 1]**
    - **[Responsibility 2]**

## Projects
[For each project:]
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
${JSON.stringify(parsedResume, null, 2)}`;

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 1500,
            temperature: 0
        });

        const markdown = response.choices[0].message.content;
        resume.parsedMarkdownResume = markdown;
        await resume.save();
        return markdown;
    } catch (error) {
        console.error('Error in parseResumetoMarkDown:', error);
        return null;
    }
};
exports.boostResumeWithAI = async (markdownText, jobDescription, boostDescription, boostSkills, boostWorkEx, additionalDescription) => {
    // Prepare the prompt for OpenAI
    let prompt = `No additional commentary is required. You are a resume enhancer. Return the response as a direct Markdown resume without any code blocks or markdown syntax indicators. Enhance the following resume based on the job description and additional parameters.\n\n` +
        `Job Description: ${jobDescription}\n`;

    if (boostDescription) {
        prompt += `Boost Description: true\n`;
    }
    if (boostSkills) {
        prompt += `Boost Skills: true\n` +
            `Integrate relevant skills from the job description into the skills section. Add missing skills and remove only the least relevant if necessary.\n`;
    }
    if (boostWorkEx) {
        prompt += `Boost Work Experience: true\n` +
            `Integrate some technical keywords (replace technologies, e.g., if the description has AWS and the user has Azure, change it to AWS. Java with Go, etc.) from the job description into the work experience responsibilities.\n`;
    }
    prompt += `Additional Description: ${additionalDescription}\n\n` +
        `Resume: ${markdownText}`;

    // Call OpenAI API to boost the resume
    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1500,
        temperature: 1.2
    });

    const boostedMarkdown = response.Tchoices[0].message.content;
    return boostedMarkdown;
};
// ---------- Prompt Generators ----------
/**
 * Generates an AI prompt for optimizing a specific resume section.
 * @param {string} section - The resume section ('bio', 'skills', 'projects', 'work_experience').
 * @param {any} content - The current content of the section.
 * @param {string} jobDescription - The job description to align with.
 * @param {string} [additionalDescription] - Any additional context or comments.
 * @returns {string} The generated prompt for the AI.
 */
function generatePromptForSection(section, content, jobDescription, additionalDescription = '') {
    switch (section) {
        case 'bio':
            return `You are a resume optimization expert.
Your task is to generate a strong **professional summary** (bio) that:
- Summarizes the candidate’s **experience, strengths, and career goals**
- Aligns with the **job description** and contains **ATS-friendly** keywords
- Stays within **3-5 sentences**
- Uses a confident and professional tone

### Job Description:
${jobDescription}

### Additional Comments:
${additionalDescription || "N/A"}

### Current Bio (if any):
${JSON.stringify(content)}

Return only the new professional summary as plain text.`;

        case 'skills':
            return `You are a resume optimization expert.
Enhance the candidate’s **Skills section**:
- Match relevant job requirements
- Group into categories (e.g., Programming, Tools, Frameworks)
- Add missing in-demand tools
- Remove outdated/irrelevant ones

### Job Description:
${jobDescription}

### Additional Comments:
${additionalDescription || "N/A"}

### Current Skills:
${JSON.stringify(content)}

Return the result as a JSON object grouped by categories.`;

        case 'projects':
            return `You are a resume enhancement expert.
Optimize the **Projects section** to:
- Use concise, outcome-driven descriptions
- Include tools and methods from the job description
- Add technical metrics where appropriate

### Job Description:
${jobDescription}

### Additional Comments:
${additionalDescription || "N/A"}

### Current Projects:
${JSON.stringify(content)}

Return updated projects in the same JSON format.`;

        case 'work_experience':
            return `You are a resume optimizer.
Improve the **Work Experience** section to:
- Use action verbs, impact-focused phrasing
- Be **ATS-optimized**
- Include **keywords from the job description**
- Replace technologies where appropriate

### Job Description:
${jobDescription}

### Additional Comments:
${additionalDescription || "N/A"}

### Current Work Experience:
${JSON.stringify(content)}

Return updated experience in the same JSON format.`;

        default:
            return '';
    }
}