// src/hooks/useAIAssistant.tsx
import { useState } from "react";
import { useSupabaseData } from "./useSupabaseData";
import { generateSystemPrompt } from "~/lib/systemPrompt";
import supabase from "~/lib/utils/supabase";

const API_KEY = "AIzaSyD5VJDe9WhAN1GnJ28Q1yVy9xFgZFynyvo";

type AIAction =
  | {
      intent: "create_task";
      title: string;
      status: "Todo" | "InProgress" | "Done";
      team_id: string;
      description?: string;
      color?: string;
    }
  | {
      intent: "create_team";
      name: string;
      color: string;
      initials: string;
    }
  | { error: string };

export const useAIAssistant = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const { profile, teams, tasks, user } = useSupabaseData();

  const generate = async (conversation: any[] = []) => {
    if (!prompt.trim()) return;
    if (!user?.id) {
      setResponse("Error: User not loaded. Please wait.");
      return;
    }

    setLoading(true);
    setResponse("");

    const systemPrompt = generateSystemPrompt(profile, teams, tasks);

    const contents = [
      { role: "model" as const, parts: [{ text: systemPrompt }] },
      ...conversation.flatMap((msg: any) => [
        { role: "user" as const, parts: [{ text: msg.prompt }] },
        { role: "model" as const, parts: [{ text: msg.response }] },
      ]),
      { role: "user" as const, parts: [{ text: prompt }] },
    ];

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents,
            generationConfig: { temperature: 0.5, maxOutputTokens: 1000 },
          }),
        }
      );

      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error("Empty response from AI");

      const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
      if (!jsonMatch) {
        setResponse(text.trim());
        return;
      }

      let action: AIAction | null = null;
      try {
        action = JSON.parse(jsonMatch[1].trim()) as AIAction;
      } catch (e) {
        console.warn("Failed to parse AI JSON:", e);
      }

      if (action && !("error" in action)) {
        await executeAction(action);
        setResponse(`Success: ${action.intent} executed!`);
        return;
      }

      setResponse(text.trim());
    } catch (e: any) {
      console.error("Gemini error:", e);
      setResponse(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------------------------------
  // EXECUTE ACTION – 100% MATCHES TaskCreation.tsx
  // -----------------------------------------------------------------
  const executeAction = async (action: AIAction) => {
    if (!user?.id) throw new Error("User not authenticated");

    try {
      // === CREATE TEAM ===
      if (action.intent === "create_team") {
        const { name, color, initials } = action as any;
        if (!name || !color || !initials) {
          throw new Error("Missing name, color, or initials");
        }

        const teamId = `team-${user.id}-${Date.now()}`;

        console.log("AI inserting team:", {
          id: teamId,
          name,
          color,
          initials,
        });

        const { error } = await supabase.from("teams").insert({
          id: teamId,
          name,
          color,
          initials,
          members: 1,
        });

        if (error) throw error;
      }

      // === CREATE TASK ===
      if (action.intent === "create_task") {
        const task = action as any;
        if (!task.title || !task.status || !task.team_id) {
          throw new Error("Missing title, status, or team_id");
        }

        // Validate team exists
        const teamExists = teams.some((t) => t.id === task.team_id);
        if (!teamExists) {
          throw new Error(`Team not found: ${task.team_id}`);
        }

        // Validate status
        const validStatuses: ("Todo" | "InProgress" | "Done")[] = [
          "Todo",
          "InProgress",
          "Done",
        ];
        if (!validStatuses.includes(task.status)) {
          throw new Error(`Invalid status: ${task.status}`);
        }

        // Generate task ID like TaskCreation.tsx
        const taskId = `task-${user.id}-${Date.now()}`;

        console.log("AI inserting task:", {
          id: taskId,
          title: task.title,
          team_id: task.team_id,
          status: task.status,
          description: task.description,
        });

        const { error } = await supabase.from("tasks").insert({
          id: taskId,
          title: task.title,
          description: task.description || "",
          status: task.status,
          first_name: user.user_metadata?.first_name ?? "User",
          last_name: user.user_metadata?.last_name ?? "",
          color: task.color || "#6366f1",
          team_id: task.team_id,
          user_id: user.id,
        });

        if (error) throw error;
      }
    } catch (err: any) {
      console.error("Action execution error:", err);
      throw new Error(`Failed to execute ${action.intent}: ${err.message}`);
    }
  };

  return { prompt, setPrompt, response, loading, generate };
};
