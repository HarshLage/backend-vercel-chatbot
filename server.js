require('dotenv').config();
const express = require('express');
const { GoogleGenAI } = require("@google/genai");
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5000;

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-pro-latest", // or "gemini-1.0-pro" or "gemini-2.0-flash-lite"
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
  console.log('Server running on port 5000');
});