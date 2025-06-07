require('dotenv').config();
const express = require('express');
const { GoogleGenAI } = require("@google/genai");
const cors = require('cors');

// ✅ Initialize app FIRST
const app = express();

// ✅ Then configure middleware
const corsOptions = {
  origin: [
    'https://vercel-frontend-chatbot.vercel.app', // Production frontend
    'http://localhost:3000' // Development frontend
  ],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

const PORT = process.env.PORT || 5000;

// ✅ Optional root route for testing
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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

    const botReply = response.text || "No response";
    res.json({ reply: botReply });
  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(500).json({ 
      error: 'Gemini API request failed',
      details: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
