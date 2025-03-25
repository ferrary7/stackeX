import { NextResponse } from "next/server";

const API_KEY = process.env.GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

/**
 * Calls Gemini API for classification or script generation.
 */
async function askAI(prompt) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || "AI request failed.");
  return data?.candidates?.[0]?.content?.parts?.[0]?.text.trim();
}

export async function POST(req) {
  try {
    const { stack, os } = await req.json();
    if (!stack || !os) {
      return NextResponse.json({ error: "Stack or OS selection missing." }, { status: 400 });
    }

    // **Step 1: Validate the input using AI**
    const validationPrompt = `
      Does the following input describe a valid software development tech stack (Programming languages, frameworks, databases, tools)? 
      These can include docker, git, node, sql, postresql, python, etc.
      You will also have versions and other details for the stack, we can accept them.
      Answer only "YES" or "NO". 
      Input: "${stack}"
    `;
    const validationResult = await askAI(validationPrompt);

    if (validationResult.toUpperCase() !== "YES") {
      return NextResponse.json({ error: "Invalid input. Please provide a valid tech stack." }, { status: 400 });
    }

    // **Step 2: Generate the script**
    const scriptPrompt = `
      Generate an installation script for the following tech stack:
      ${stack}
      
      Output only the installation commands, without any explanations.

      **Strict Rules:**
      - DO NOT wrap the output in markdown code blocks (e.g., \`\`\`powershell or \`\`\`bash). 
      - To show the script heading as powershell or bash, use comments.
      - DO NOT include unnecessary text or explanations.
      - Return only raw script content with correct syntax.

      Format: 
      - If the OS is Windows, output a PowerShell (.ps1) script.
      - If the OS is Linux or macOS, output a Bash (.sh) script.

      OS selected: ${os}.
    `;

    const script = await askAI(scriptPrompt);
    return NextResponse.json({ script }, { status: 200 });
  } catch (error) {
    console.error("Error generating script:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
