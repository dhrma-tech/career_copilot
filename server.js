// Import required packages
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');
require('dotenv').config();

// Initialize Express app and Google Generative AI
const app = express();
const port = 3000;
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Middleware
app.use(cors());
app.use(express.json());

// Define the API endpoint
app.post('/generate', async (req, res) => {
  try {
    const { user, type } = req.body;

    let prompt;
    if (type === 'roadmap') {
      prompt = `Create a personalized career roadmap for a student named ${user.name}.
      - Academic Field: ${user.academic}
      - Stated Interests: ${user.interests}
      Generate a step-by-step guide. For each step, provide a title and a brief, encouraging description. The tone should be highly supportive and motivational.
      Format the response as clean, semantic HTML. The response should ONLY contain the HTML content for the roadmap, without any surrounding <html>, <head>, <body> tags, or markdown code fences. Use <h3> for step titles and <p> for descriptions. Wrap each step in a <div class="card roadmap-step">.`;
    } else if (type === 'courses') {
      // --- THIS PROMPT IS UPDATED TO INCLUDE LINKS ---
      prompt = `Recommend a list of 3-4 essential online courses for a student in ${user.academic} with interests in ${user.interests}.
      For each course, provide a title, a recommended platform, a short sentence on why it's useful, and a difficulty level (Beginner, Intermediate, or Advanced).
      Format the entire response as clean, semantic HTML. The response should ONLY contain the HTML content, without any surrounding markdown code fences.
      Each course should be a clickable unit. To achieve this, wrap the entire course card div in an anchor tag like this: <a href="SEARCH_URL" class="course-card-link" target="_blank" rel="noopener noreferrer">...</a>.
      The SEARCH_URL should be a direct search query URL for the course on the recommended platform (e.g., for a course 'Data Science' on Coursera, the URL would be 'https://www.coursera.org/search?query=Data+Science').
      Inside the anchor tag, place a <div class="course-card">. This div should contain:
      - An <h4> tag for the course title.
      - A <p> tag for the description and platform.
      - A <div class="course-meta"> containing a <span> tag for the difficulty level.
      - Make sure to add a unique class to each course card div for different colors: 'course-1', 'course-2', 'course-3', etc.`;
    } else if (type === 'growth') {
      prompt = `Generate 2 short, insightful articles for a student named ${user.name} who is in ${user.academic} and interested in ${user.interests}. 
      The topics should focus on personal and professional development. Examples include 'Developing a Growth Mindset for Tech Careers' or 'How to Overcome Procrastination When Learning a New Skill'.
      The tone should be encouraging, wise, and practical.
      Format the response as clean, semantic HTML. The response should ONLY contain the HTML content for the articles, without any surrounding <html>, <head>, <body> tags, or markdown code fences. Use an <h3> for each article title and <p> tags for the content. Wrap each article in its own <div class="card">.`;
    } else {
      return res.status(400).json({ error: 'Invalid type specified.' });
    }

    // Call the Gemini API
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Clean the response to remove markdown fences and unwanted HTML tags
    text = text.replace(/```html/g, "").replace(/```/g, "").replace(/<\/?(html|head|body)[^>]*>/g, "").trim();

    // Send the AI-generated HTML back to the frontend
    res.json({ html: text });

  } catch (error) {
    console.error("Error in /generate endpoint:", error);
    res.status(500).json({ error: 'Failed to generate content from AI model.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
