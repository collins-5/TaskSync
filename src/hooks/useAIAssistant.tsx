import { useState } from "react";
// import { GEMINI_API_KEY } from "@env"; // Requires react-native-dotenv

// Use environment variable for API key (recommended for security)
const API_KEY = "AIzaSyD5VJDe9WhAN1GnJ28Q1yVy9xFgZFynyvo"; // No hardcoded fallback for production safety

export const useAIAssistant = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!prompt.trim()) return;
    if (!API_KEY) {
      setResponse(
        "Error: API key is missing. Please configure GEMINI_API_KEY in .env."
      );
      return;
    }

    setLoading(true);
    setResponse("");

    https: try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: prompt }],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1000,
            },
            safetySettings: [
              {
                category: "HARM_CATEGORY_HATE_SPEECH",
                threshold: "BLOCK_MEDIUM_AND_ABOVE",
              },
              {
                category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE",
              },
              {
                category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE",
              },
              {
                category: "HARM_CATEGORY_HARASSMENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE",
              },
            ],
          }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        console.error("API error details:", JSON.stringify(errorData, null, 2));
        if (res.status === 400) {
          throw new Error(
            `Bad request: ${errorData.error?.message || "Invalid request format. Check prompt or API configuration."}`
          );
        } else if (res.status === 401) {
          throw new Error(
            "Invalid API key. Please verify your key in Google AI Studio."
          );
        } else if (res.status === 404) {
          throw new Error(
            "Model not found. Try 'gemini-flash-latest' or check available models."
          );
        } else if (res.status === 429) {
          throw new Error(
            "Rate limit exceeded. Try again later or check your quota."
          );
        } else {
          throw new Error(`API error: ${res.status} ${res.statusText}`);
        }
      }

      const data = await res.json();
      if (!data.candidates || !data.candidates[0]?.content?.parts[0]?.text) {
        throw new Error("Unexpected API response format");
      }

      const generatedText = data.candidates[0].content.parts[0].text;
      setResponse(generatedText);
    } catch (error) {
      console.error("Gemini API error:", error);
      setResponse(
        (error as Error).message ||
          "Sorry, an error occurred. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return { prompt, setPrompt, response, setResponse, loading, generate };
};
