import { NextResponse } from "next/server";

const API_KEY = process.env.GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

export async function GET() {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Give me an array of the top 10 trending and popular tech stacks (coding) for 2025 in valid JSON format. Only return an array, like [\"MERN\", \"MEAN\", \"T3\", \"Jamstack\", \"Serverless\"]. No markdown, no JSON wrapping." }] }],
      }),
    });

    const data = await response.json();
    let textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textResponse) {
      return NextResponse.json({ error: "No response from AI" }, { status: 500 });
    }

    // **Ensure it is a valid array**
    textResponse = textResponse.replace(/```json|```/g, "").trim();
    const popularStacks = JSON.parse(textResponse);

    if (!Array.isArray(popularStacks)) {
      return NextResponse.json({ error: "Invalid response format" }, { status: 500 });
    }

    return NextResponse.json({ popularStacks });
  } catch (error) {
    console.error("Error fetching from Gemini API:", error);
    return NextResponse.json({ error: "Failed to fetch popular stacks" }, { status: 500 });
  }
}
