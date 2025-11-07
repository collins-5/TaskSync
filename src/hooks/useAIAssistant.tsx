// src/hooks/useAIAssistant.tsx
import { useState } from "react";
import { useSupabaseData } from "./useSupabaseData";
import { generateSystemPrompt } from "~/lib/systemPrompt";

const API_KEY = "AIzaSyD5VJDe9WhAN1GnJ28Q1yVy9xFgZFynyvo"; // Move to .env in prod

// -----------------------------------------------------------------
// 1. EXACT Gemini types (no extra fields)
// -----------------------------------------------------------------
type GeminiMessage = {
  role: "user" | "model";
  parts: [{ text: string }];
};

type ConversationEntry = { prompt: string; response: string };

export const useAIAssistant = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  // Get live data
  const { profile, teams, tasks } = useSupabaseData();

  const generate = async (conversation: ConversationEntry[]) => {
    if (!prompt.trim()) return;

    setLoading(true);
    setResponse("");

    // -----------------------------------------------------------------
    // 2. Use external system prompt generator
    // -----------------------------------------------------------------
    const systemPrompt = generateSystemPrompt(profile, teams, tasks);

    // -----------------------------------------------------------------
    // 3. Build conversation: system + history + user prompt
    // -----------------------------------------------------------------
    const contents: GeminiMessage[] = [
      // System message
      {
        role: "model",
        parts: [{ text: systemPrompt }],
      } as const,

      // History
      ...conversation.flatMap(
        (msg): GeminiMessage[] => [
          { role: "user", parts: [{ text: msg.prompt }] } as const,
          { role: "model", parts: [{ text: msg.response }] } as const,
        ]
      ),

      // Current user prompt
      { role: "user", parts: [{ text: prompt }] } as const,
    ];

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents,
            generationConfig: {
              temperature: 0.5,
              maxOutputTokens: 1000,
            },
            safetySettings: [
              { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
              { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
              { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
              { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            ],
          }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message || `${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error("Empty response");

      setResponse(text);
    } catch (e: any) {
      console.error("Gemini error:", e);
      setResponse(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return { prompt, setPrompt, response, loading, generate };
};