const openai = require('../config/openaiConfig');
const fs = require('fs');
const pdf = require('pdf-parse');

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

module.exports = parseResume;