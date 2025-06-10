require('dotenv').config();
const express = require('express');
const { GoogleGenAI } = require("@google/genai");
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Gemini AI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Health check or root GET route for Vercel
app.get('/', (req, res) => {
  res.send('CityGym AI backend is running');
});

// Chat route
app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-pro-latest",
      contents: [
        {
          role: "user",
          parts: [{ text: userMessage }]
        }
      ]
    });

    const botReply = response.text || "No response from Gemini.";
    res.json({ reply: botReply });
  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(500).json({
      error: 'Gemini API request failed',
      details: error.message
    });
  }
});

// Dynamic port for deployment
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
