import { NextResponse } from "next/server";
const { GoogleGenerativeAI } = require("@google/generative-ai");

const systemPrompt = `
You are a flashcard creator, you take in text and create multiple flashcards from it. Make sure to create exactly 12 flashcards.
Both front and back should be one sentence long.
You should return in the following JSON format:
{
  "flashcards":[
    {
      "front": "Front of the card",
      "back": "Back of the card"
    }
  ]
}
Text :`;

export async function POST(req) {
  const data = await req.text();

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = systemPrompt + data;

  const result = await model.generateContent(prompt);
  const response = result.response.text();
  const flashcards = JSON.parse(response);
  return NextResponse.json(flashcards.flashcards);
}
