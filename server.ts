import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API: Summarize Research Article
app.post("/api/summarize", async (req, res) => {
  try {
    const { text, title, doi, domain } = req.body;
    if (!text && !title && !doi) {
      return res.status(400).json({ error: "Missing article text, title, or DOI." });
    }

    const ai = getGeminiClient();

    const prompt = `You are an expert academic research analyst and peer reviewer.
Analyze the following research paper / article excerpt and provide a structured comprehensive summary and standardized citations.

Title/Context: ${title || "Unknown Title"}
DOI: ${doi || "N/A"}
Domain: ${domain || "General Science"}
Content/Abstract/Excerpt:
"""
${text || title}
"""

Return a valid JSON object matching the requested schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a distinguished academic synthesis engine. Provide precise, high-level scholarly analysis, citation formatting, and critical peer-review evaluations.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            authors: { type: Type.ARRAY, items: { type: Type.STRING } },
            journal: { type: Type.STRING },
            year: { type: Type.INTEGER },
            doi: { type: Type.STRING },
            domain: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            executiveSummary: { type: Type.STRING },
            keyFindings: { type: Type.ARRAY, items: { type: Type.STRING } },
            methodology: { type: Type.STRING },
            limitations: { type: Type.STRING },
            implications: { type: Type.STRING },
            keyQuotations: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendedFutureWork: { type: Type.ARRAY, items: { type: Type.STRING } },
            criticalReview: {
              type: Type.OBJECT,
              properties: {
                strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                noveltyScore: { type: Type.NUMBER }
              },
              required: ["strengths", "weaknesses", "noveltyScore"]
            },
            bibtex: { type: Type.STRING },
            apaCitation: { type: Type.STRING },
            mlaCitation: { type: Type.STRING },
            ieeeCitation: { type: Type.STRING }
          },
          required: [
            "title", "authors", "journal", "year", "executiveSummary",
            "keyFindings", "methodology", "limitations", "implications",
            "bibtex", "apaCitation", "mlaCitation", "ieeeCitation", "tags"
          ]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response generated from Gemini API.");
    }

    const parsed = JSON.parse(resultText);
    res.json(parsed);
  } catch (error: any) {
    console.error("Summarization error:", error);
    res.status(500).json({ error: error.message || "Failed to summarize article." });
  }
});

// API: Run Research Literature Synthesis Task
app.post("/api/run-task", async (req, res) => {
  try {
    const { topic } = req.body;
    if (!topic) {
      return res.status(400).json({ error: "Missing topic parameter." });
    }

    const ai = getGeminiClient();

    const prompt = `Conduct a rigorous literature review research task on the following topic:
"${topic}"

Synthesize findings from multiple landmark studies (2024-2026), identify overarching themes, consensus points, research gaps, and generate 3 representative academic paper summaries with full citations.

Return a JSON object following the schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an autonomous academic literature synthesis agent. Generate thorough, publication-ready research task outputs.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            overview: { type: Type.STRING },
            themes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  theme: { type: Type.STRING },
                  description: { type: Type.STRING },
                  paperCount: { type: Type.INTEGER }
                },
                required: ["theme", "description", "paperCount"]
              }
            },
            consensusPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
            debatesAndGaps: { type: Type.ARRAY, items: { type: Type.STRING } },
            extractedPaperTitles: { type: Type.ARRAY, items: { type: Type.STRING } },
            synthesizedArticles: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  authors: { type: Type.ARRAY, items: { type: Type.STRING } },
                  journal: { type: Type.STRING },
                  year: { type: Type.INTEGER },
                  doi: { type: Type.STRING },
                  domain: { type: Type.STRING },
                  tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                  abstract: { type: Type.STRING },
                  executiveSummary: { type: Type.STRING },
                  keyFindings: { type: Type.ARRAY, items: { type: Type.STRING } },
                  methodology: { type: Type.STRING },
                  limitations: { type: Type.STRING },
                  implications: { type: Type.STRING },
                  bibtex: { type: Type.STRING },
                  apaCitation: { type: Type.STRING },
                  mlaCitation: { type: Type.STRING },
                  ieeeCitation: { type: Type.STRING }
                },
                required: ["title", "authors", "journal", "year", "abstract", "bibtex", "apaCitation", "mlaCitation", "ieeeCitation"]
              }
            }
          },
          required: ["title", "overview", "themes", "consensusPoints", "debatesAndGaps", "extractedPaperTitles", "synthesizedArticles"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response received from Gemini API.");
    }

    const parsed = JSON.parse(resultText);
    res.json(parsed);
  } catch (error: any) {
    console.error("Task execution error:", error);
    res.status(500).json({ error: error.message || "Failed to execute research synthesis task." });
  }
});

// API: Q&A Chat with Article / Literature
app.post("/api/chat-paper", async (req, res) => {
  try {
    const { paperTitle, abstract, summary, userQuestion, chatHistory } = req.body;
    if (!userQuestion) {
      return res.status(400).json({ error: "Missing userQuestion parameter." });
    }

    const ai = getGeminiClient();

    const historyPrompt = Array.isArray(chatHistory)
      ? chatHistory.map((msg: any) => `${msg.sender.toUpperCase()}: ${msg.text}`).join("\n")
      : "";

    const prompt = `Context Paper: "${paperTitle || "Literature Context"}"
Abstract: ${abstract || "N/A"}
Summary: ${typeof summary === "object" ? JSON.stringify(summary) : summary || "N/A"}

Prior Conversation:
${historyPrompt}

Researcher Question: "${userQuestion}"

Provide a detailed, helpful, academic response referencing the methodology, implications, or related scientific concepts. Keep it clear, logical, and insightful.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a scholarly research assistant helping a scientist or student analyze academic papers, methodology, statistical validity, and citations."
      }
    });

    res.json({ answer: response.text || "No response generated." });
  } catch (error: any) {
    console.error("Chat paper error:", error);
    res.status(500).json({ error: error.message || "Failed to answer paper question." });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
