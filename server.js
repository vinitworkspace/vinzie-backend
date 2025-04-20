require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" })); // Allows requests from anywhere

const GROQ_API_KEY = process.env.GROQ_API_KEY;

app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await axios.post("https://api.groq.com/openai/v1/chat/completions", {
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: userMessage }],
    }, {
      headers: { Authorization: `Bearer ${GROQ_API_KEY}` }
    });

    if (response.data.choices && response.data.choices.length > 0) {
      res.json({ reply: response.data.choices[0].message.content });
    } else {
      res.status(500).json({ error: "Groq AI response is empty" });
    }
  } catch (error) {
    console.error("Error fetching Groq AI response:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000; // Support online deployment
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));