import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

// ✅ Test route
app.get("/", (req, res) => {
  res.send("🚀 Backend is working!");
});

// ✅ AI Suggest endpoint
app.post("/ai-suggest", async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI failed" });
  }
});

// ✅ Food recognition endpoint (dummy for now)
app.post("/recognize-food", async (req, res) => {
  try {
    res.json({
      name: "Pizza",
      calories: 266,
    });
  } catch (err) {
    res.status(500).json({ error: "Recognition failed" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});