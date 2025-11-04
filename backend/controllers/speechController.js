// backend/controllers/speechController.js
import fs from "fs";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function transcribeSpeech(req, res) {
  try {
    const filePath = req.file.path; // assuming multer middleware
    const transcription = await client.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: "whisper-1"
    });
    res.json({ text: transcription.text });
  } catch (err) {
    res.status(500).json({ error: "Speech-to-text failed" });
  }
}
