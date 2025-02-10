import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import AppBar from '../components/AppBar';
import MarkdownEditor from '@uiw/react-markdown-editor';
import MarkdownPreview from '@uiw/react-markdown-preview';

function BoostResume() {
  const [parsedOriginalResume, setParsedOriginalResume] = useState(`# Daipayan Hati

Highly motivated Software Engineer with 3+ years of experience. Looking forward to Internships on Software Development and Artificial Intelligence in the United States of America.

## Contact 
- **Email**: daipayanh@gmail.com        **Phone**: +1 (510)-826-8530
- **GitHub**: [github.com/Neilketchum](https://github.com/Neilketchum)      **LinkedIn**: [linkedin.com/in/daipayan-hati/](https://linkedin.com/in/daipayan-hati/)
- **Website**: [www.daipayanhati.com](http://www.daipayanhati.com)

## Education
- **Master’s of Science (MSC)** in Computer Science, California State University - East Bay (End Date: December 2025)
- **Bachelors’ of Technology (B.TECH)** in Computer Science, Sikkim Manipal Institute of Technology (April 2017 - July 2021)

## Work Experience
- **Software Engineer** at Dell Technologies, Bangalore, India (December 2021 - May 2024)
  - Responsibilities:
    - Collaborated with a cross-functional team of 100+ software engineers to develop and architect a **SAAS application (Wyse Management Suite)** using a **microservices framework** with tools **Spring Boot**, **Kafka**, **MySQL**, and **MongoDB**.
    - Developed reusable and optimized UI components using **ReactJS** and **Redux**, resulting in an 80% reduction in UI delays and significantly improving customer satisfaction.
    - Implemented continuous integration/continuous delivery (CI/CD) pipelines using **Jenkins**, enhancing deployment frequency by 50% and reducing rollbacks by 75%.
    - Integrated **GraphQL** into microservices architecture for more efficient data querying, and utilized **Azure** for deploying applications, leveraging **AWS** services like buckets and blob storage which improved system resilience and scalability.

- **Software Engineer** at Kapture CX, Bangalore, India (August 2021 - December 2024)
  - Responsibilities:
    - Architected and implemented a scalable **microservices infrastructure** from an existing monolith platform, increasing system efficiency by 40%.
    - Developed core modules for ticket distribution among agents using **Java** and **Spring**, leveraging parallel programming techniques to optimize algorithm efficiency and enhance system performance.
    - Directed the transition to a containerized deployment model using **Docker**, **NGINX**, and **Kubernetes**, resulting in a 50% reduction in deployment times and a 70% decrease in deployment-related issues.

- **Software Engineer Intern** at Nomura Research Institute, Kolkata, India (January 2021 - April 2021)
  - Responsibilities:
    - Developed a new screen to download reports in **Excel** format where users had complete flexibility to choose the rows they wanted to include in the report, decreasing the time to download a required report by 90%.
    - Learned the art of creating optimized **SQL** queries and using **Java’s Hibernate ORM** and **ReactJS**.

## Projects
- **Jobs.AI**
  - Jobs.ai leverages **generative AI** and **Retrieval-Augmented Generation (RAG)** with **OpenAI** models to transform job applications. Using **NLP** for resume parsing and **MongoDB** for storing structured data, it tailors resumes and generates personalized cover letters via **Prompt Engineering**.
  - Technologies: **OpenAI**, **NLP**, **MongoDB**, **WebSocket**, **Google OAuth**, **Node.js**, **Material-UI**, **ReactJS**

- **FashionMoods.AI**
  - Fashion Moods leverages **AI** to redefine personal styling, offering outfit recommendations tailored to trends, moods, and occasions. Powered by **Google Computer Vision** and an **OpenAI LLM** to recommend fashion tips.
  - Technologies: **AI**, **Google Computer Vision**, **OpenAI LLM**

- **Sikkim News**
  - Developed a full-stack news blog for The Sikkim News using **Next.js**, **Strapi CMS**, and **PostgreSQL**. Designed wireframes in **Figma**, ensuring user-friendly UI. Optimized performance for fast load times and SEO, boosting search visibility and user engagement.
  - Technologies: **Next.js**, **Strapi CMS**, **PostgreSQL**, **Figma**

- **Cardiovascular Disease Prediction**
  - Utilized the **Machine Learning Algorithm “Random Forests”** on a large clinical dataset, analyzing 50 features and achieving 80% accuracy in heart disease prediction.
  - Technologies: **Machine Learning**, **Random Forests**
  - Codebase URL: Published Paper to International Journal of All Research Education and Scientific Methods (IJARESM) with an impact score of 8.45.

## Skills
- Programming Languages: **Java**, **C++**, **Python**, **Go**, **JavaScript**, **TypeScript**
- Frameworks: **React**, **Spring Boot**, **Node.js**, **Django**, **Angular**
- Databases: **MySQL**, **PostgreSQL**, **NoSQL (MongoDB)**, **Firebase**
- Tools: **AWS**, **Azure**, **Selenium**, **Generative AI - OpenAI GPT**, **Google Vision**, **Jenkins**, **NGINX**, **Kafka**, **MQTT**, **Pandas**, **Numpy**
- Others: **Prompt Engineering**, **Fine Tuning Large Language Models**, **JIRA**, **Technical Documentation**, **Docker**, **Kubernetes**, **Git**`);

  const [parsedBoostedResume, setParsedBoostedResume] = useState(`# Daipayan Hati

Highly motivated Software Engineer with over 3 years of experience in full-stack development. Seeking opportunities to leverage my skills in software development and cloud technologies within the United States.
## Contact
- **Email**: daipayanh@gmail.com  
- **Phone**: +1 (510)-826-8530  
- **GitHub**: [github.com/Neilketchum](https://github.com/Neilketchum)  
- **LinkedIn**: [linkedin.com/in/daipayan-hati/](https://linkedin.com/in/daipayan-hati/)  
- **Website**: [www.daipayanhati.com](http://www.daipayanhati.com)

## Education
- **Master’s of Science (MSC)** in Computer Science, California State University - East Bay (Finish Date: December 2025)  
- **Bachelors’ of Technology (B.TECH)** in Computer Science, Sikkim Manipal Institute of Technology (April 2017 - July 2021)  

## Work Experience
- **Software Engineer** at Dell Technologies, Bangalore, India (December 2021 - May 2024)  
  - Responsibilities:
    - Collaborated with a cross-functional team of 100+ engineers to develop and architect a **SaaS application (Wyse Management Suite)** leveraging a **microservices architecture** using **Go**, **Kafka**, **MySQL**, and **MongoDB**.
    - Crafted and optimized high-performance UI components with **Angular** and **Redux**, leading to an 80% reduction in UI delays and improved user feedback.
    - Implemented CI/CD pipelines utilizing **Jenkins** for rapid deployment, increasing deployment frequency by 50% and minimizing rollback instances by 75%.
    - Integrated **GraphQL** within microservices for efficient data retrieval and utilized **AWS** cloud technologies to enhance application resilience and scalability.

- **Software Engineer** at Kapture CX, Bangalore, India (August 2021 - December 2024)  
  - Responsibilities:
    - Designed and implemented a scalable **microservices framework**, transitioning from a monolithic architecture that boosted system efficiency by 40%.
    - Developed and optimized core applications for ticket management using **Go** and **Spring Boot**, applying parallel programming to refine algorithm efficiency.
    - Led the shift to a containerized deployment on **Docker**, orchestrated with **Kubernetes**, achieving a 50% decrease in deployment timelines and a 70% reduction in related issues.

- **Software Engineer Intern** at Nomura Research Institute, Kolkata, India (January 2021 - April 2021)  
  - Responsibilities:
    - Built an application feature enabling users to download reports in **Excel** format with customizable options, which cut download times by 90%.
    - Gained hands-on experience in creating optimized **SQL** queries and employing **Java**, **Haskell**, and **ReactJS** for frontend solutions.

## Projects
- **Jobs.AI**
  - Leveraged **generative AI** and **Retrieval-Augmented Generation (RAG)** to innovate job application processes, enhancing resume analysis and generating personalized cover letters through advanced **NLP** techniques.
  - Technologies: **OpenAI**, **NLP**, **MongoDB**, **WebSocket**, **Google OAuth**, **Node.js**, **Material-UI**, **ReactJS**

- **FashionMoods.AI**
  - An interactive platform using **AI** for personalized fashion recommendations tailored to user preferences and trending styles, utilizing **Google Computer Vision** and an **OpenAI LLM**.
  - Technologies: **AI**, **Google Computer Vision**, **OpenAI LLM**

- **Sikkim News**
  - Developed a complete **full-stack** news website utilizing **Next.js**, **Strapi CMS**, and **PostgreSQL**, enhancing UI design from **Figma** wireframes to ensure high performance and SEO optimization.
  - Technologies: **Next.js**, **Strapi CMS**, **PostgreSQL**, **Figma**

- **Cardiovascular Disease Prediction**
  - Applied the **Random Forest Machine Learning Algorithm** to large-scale clinical datasets, assessing 50+ attributes to achieve 80% accuracy in heart disease predictions.
  - Technologies: **Machine Learning**, **Random Forests**  
  - Published findings in the International Journal of All Research Education and Scientific Methods (IJARESM), achieving an impact score of 8.45.

## Skills
- Programming Languages: **Go**, **Haskell**, **Java**, **C++**, **Python**, **JavaScript**, **TypeScript**
- Frameworks: **Angular**, **React**, **Spring Boot**, **Node.js**, **Django**
- Databases: **MySQL**, **PostgreSQL**, **NoSQL (MongoDB)**, **Firebase**
- Tools: **AWS**, **Selenium**, **Generative AI - OpenAI GPT**, **Google Vision**, **Jenkins**, **NGINX**, **Kafka**, **MQTT**, **Docker**, **Kubernetes**, **Pandas**, **NumPy**
- Additional Skills: **Prompt Engineering**, **Fine Tuning Large Language Models**, **JIRA**, **Technical Documentation**, **Git**`);

  return (
    <div>
      <AppBar />
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gridTemplateRows: 'repeat(2, 1fr)',
        gap: '20px',
        marginTop: '64px',
        padding: '20px',
        width: '100vw',
        height: 'calc(100vh - 64px)',
        overflow: 'hidden'
      }}>
        {[parsedOriginalResume, parsedBoostedResume].map((content, index) => (
          <Box key={index + 2} sx={{
            boxShadow: 3,
            borderRadius: 2,
            border: '1px solid #e0e0e0',
            p: 2,
            overflow: 'auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            
            <MarkdownEditor.Markdown  source={content} style={{ width: '100%', height: '90%', overflow: 'auto' }} />
          </Box>
        ))}
        {[parsedOriginalResume, parsedBoostedResume].map((content, index) => (
          <Box key={index} sx={{
            boxShadow: 3,
            borderRadius: 2,
            border: '1px solid #e0e0e0',
            padding: '10px',
            overflow: 'auto',
            display: 'flex',
          
          }}>
            <MarkdownEditor
              value={index === 0 ? parsedOriginalResume : parsedBoostedResume}
              onChange={(value, viewUpdate) => {
                if (index === 0) {
                  setParsedOriginalResume(value);
                } else {
                  setParsedBoostedResume(value);
                }
              }}
              height="90%"
              enablePreview={false}
              enableScroll = {true}
              

            />
          </Box>
        ))}
        
      </div>
    </div>
  );
}

export default BoostResume;