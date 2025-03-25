import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

async function listModels() {
  try {
    const models = await genAI.listModels();
    console.log("Available Models:", models);
  } catch (error) {
    console.error("Error fetching models:", error);
  }
}

listModels();
