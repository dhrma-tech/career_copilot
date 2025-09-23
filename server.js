// ... (imports and app setup)

// Define the API endpoint
app.post('/generate', async (req, res) => {
  try {
    const { user, type } = req.body;

    // --- Prompt Engineering ---
    let prompt;
    if (type === 'roadmap') {
      prompt = `Create a personalized career roadmap for a student named ${user.name}.
      - Branch: ${user.branch}
      - Stated Interests: ${user.interests}
      Generate a step-by-step guide. For each step, provide a title and a brief, encouraging description.
      Format the response as clean, semantic HTML. The response should ONLY contain the HTML content, without any surrounding markdown code fences. Use <h3> for step titles and <p> for descriptions. Wrap each step in a <div class="card roadmap-step">.`;
    } else if (type === 'courses') {
      // --- THIS PROMPT IS NEW AND IMPROVED ---
      prompt = `Recommend a list of 3-4 essential online courses for a student in ${user.branch} with interests in ${user.interests}.
      For each course, provide a title, a recommended platform, a short sentence on why it's useful, and a difficulty level (Beginner, Intermediate, or Advanced).
      Format the entire response as clean, semantic HTML. The response should ONLY contain the HTML content, without any surrounding markdown code fences. 
      Each course should be wrapped in a <div class="course-card">. Inside this div, include:
      - An <h4> tag for the course title.
      - A <p> tag for the description and platform.
      - A <div class="course-meta"> containing a <span> tag for the difficulty level.
      - A <div class="progress-bar-container"><div class="progress-bar"></div></div> for a visual progress bar (it will be empty initially).
      - Make sure to add a unique class to each course card for different colors: 'course-1', 'course-2', 'course-3', etc.`;
    } else if (type === 'growth') {
      prompt = `Generate 2 short, insightful articles for a student named ${user.name} who is in ${user.branch} and interested in ${user.interests}. 
      The topics should focus on personal and professional development.
      Format the response as clean, semantic HTML. The response should ONLY contain the HTML content, without any surrounding markdown code fences. Use an <h3> for each article title and <p> tags for the content. Wrap each article in its own <div class="card">.`;
    } else {
      return res.status(400).json({ error: 'Invalid type specified.' });
    }

    // ... (rest of the file is the same)
    
    // Clean the response to remove markdown fences if they still appear
    text = text.replace(/```html/g, '').replace(/```/g, '').trim();

    // Send the AI-generated HTML back to the frontend
    res.json({ html: text });

  } catch (error) {
    console.error("Error in /generate endpoint:", error);
    res.status(500).json({ error: 'Failed to generate content from AI model.' });
  }
});

// ... (server listen)
