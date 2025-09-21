// Import required packages
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');
require('dotenv').config(); // To load environment variables from .env file

// Initialize Express app and Google Generative AI
const app = express();
const port = 3000;
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // To parse JSON bodies

// Define the API endpoint
app.post('/generate', async (req, res) => {
  try {
    const { user, type } = req.body;

    // --- Prompt Engineering ---
    // Create a detailed prompt for the AI model based on user data
    let prompt;
    if (type === 'roadmap') {
      prompt = `Create a personalized career roadmap for a student named ${user.name}.
      - Branch: ${user.branch}
      - Stated Interests: ${user.interests}
      Generate a step-by-step guide. For each step, provide a title and a brief, encouraging description.
      Format the entire response as clean, semantic HTML within a single <div> element. Use <h3> for step titles and <p> for descriptions. Wrap each step in a <div class="card roadmap-step">.`;
    } else if (type === 'courses') {
      prompt = `Recommend a list of essential online courses for a student named ${user.name}.
      - Branch: ${user.branch}
      - Stated Interests: ${user.interests}
      For each course, suggest a title, a recommended platform (like Coursera, edX, YouTube), and a short sentence on why it's useful.
      Format the entire response as clean, semantic HTML within a single <div>. Use <h3> for course titles and <p> for the platform and description. Wrap each course recommendation in a <div class="card course-item">.`;
    } else {
      return res.status(400).json({ error: 'Invalid type specified.' });
    }

    // Call the Gemini API
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

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
