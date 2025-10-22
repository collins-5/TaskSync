import { useState, useEffect } from "react";
import supabase from "~/lib/utils/supabase";
import type { User } from "@supabase/supabase-js";

export type Team = {
  id: string;
  name: string;
  members: number;
  color: string;
  initials: string;
  created_at: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  status: "Todo" | "InProgress" | "Done";
  first_name: string;
  last_name: string;
  color: string;
  team_id: string;
  user_id: string;
  created_at: string;
};

export type Profile = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
};

export type ChatHistory = {
  id: number;
  user_id: string;
  prompt: string;
  response: string;
  created_at: string;
};

export const useSupabaseData = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setError("User not authenticated");
          return;
        }

        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from("users")
          .select("id, email, first_name, last_name, created_at")
          .eq("id", user.id)
          .single();
        if (profileError) throw profileError;
        setProfile(profileData || null);

        // Fetch teams (all teams, per RLS policy)
        const { data: teamsData, error: teamsError } = await supabase
          .from("teams")
          .select("*")
          .order("created_at", { ascending: true });
        if (teamsError) throw teamsError;
        setTeams(teamsData || []);

        // Fetch tasks (user-specific, per RLS policy)
        const { data: tasksData, error: tasksError } = await supabase
          .from("tasks")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        if (tasksError) throw tasksError;
        setTasks(tasksData || []);

        // Fetch chat history (user-specific, per RLS policy)
        const { data: chatData, error: chatError } = await supabase
          .from("chat_history")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        if (chatError) throw chatError;
        setChatHistory(chatData || []);
      } catch (err) {
        setError((err as Error).message || "Failed to fetch data");
        console.error("Supabase fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { profile, teams, tasks, chatHistory, loading, error };
};
