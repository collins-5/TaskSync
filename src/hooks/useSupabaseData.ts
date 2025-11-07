// hooks/useSupabaseData.ts
import { useEffect, useState, useRef } from "react";
import supabase from "~/lib/utils/supabase";
import { useSessionInit } from "~/components/core/SessionInitializer";

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
  image?: string | null;
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
  const { user } = useSessionInit();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const channelRef = useRef<any>(null);

  const fetchAll = async () => {
    if (!user) {
      setProfile(null);
      setTeams([]);
      setTasks([]);
      setChatHistory([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Profile
      let profileData: Profile | null = null;
      const { data: p, error: pErr } = await supabase
        .from("users")
        .select("id, email, first_name, last_name, image, created_at")
        .eq("id", user.id)
        .single();

      if (pErr && pErr.message.includes("column users.image does not exist")) {
        const { data: f, error: fErr } = await supabase
          .from("users")
          .select("id, email, first_name, last_name, created_at")
          .eq("id", user.id)
          .single();
        if (fErr) throw fErr;
        profileData = f;
      } else if (pErr) throw pErr;
      else profileData = p;
      setProfile(profileData);

      // Teams
      const { data: t, error: tErr } = await supabase.from("teams").select("*");
      if (tErr) throw tErr;
      setTeams((t || []) as Team[]);

      // Tasks
      const { data: tasksRaw, error: taskErr } = await supabase
        .from("tasks")
        .select("id, title, description, status, color, team_id, user_id, created_at, users(first_name, last_name)")
        .eq("user_id", user.id);
      if (taskErr) throw taskErr;

      const transformed: Task[] = (tasksRaw || []).map((t: any) => ({
        id: t.id,
        title: t.title,
        description: t.description || "",
        status: t.status,
        first_name: t.users?.first_name || "",
        last_name: t.users?.last_name || "",
        color: t.color,
        team_id: t.team_id,
        user_id: t.user_id,
        created_at: t.created_at,
      }));
      setTasks(transformed);

      // Chat History
      const { data: chat, error: chatErr } = await supabase
        .from("chat_history")
        .select("id, user_id, prompt, response, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });
      if (chatErr) throw chatErr;
      setChatHistory((chat || []) as ChatHistory[]);
    } catch (e: any) {
      setError(e.message || "Failed to load data");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [user]);

  // Real-time subscriptions
  useEffect(() => {
    if (!user) return;
    if (channelRef.current) supabase.removeChannel(channelRef.current);

    const channel = supabase
      .channel("data")
      // Profile changes
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "users", filter: `id=eq.${user.id}` },
        (payload) => {
          const newProfile = payload.new as Profile | null;
          if (newProfile) {
            setProfile(newProfile);
          } else if (payload.eventType === "DELETE") {
            setProfile(null);
          }
        }
      )
      // Teams changes
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "teams" },
        (payload) => {
          const newTeam = payload.new as Team;
          const oldTeam = payload.old as { id: string };

          if (payload.eventType === "INSERT") {
            setTeams((prev) => [...prev, newTeam]);
          } else if (payload.eventType === "UPDATE") {
            setTeams((prev) => prev.map((t) => (t.id === newTeam.id ? newTeam : t)));
          } else if (payload.eventType === "DELETE") {
            setTeams((prev) => prev.filter((t) => t.id !== oldTeam.id));
          }
        }
      )
      // Tasks changes
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tasks", filter: `user_id=eq.${user.id}` },
        (payload) => {
          const raw = payload.new as any;
          const old = payload.old as { id: string };

          // Transform nested `users` object
          const task: Task = {
            id: raw.id,
            title: raw.title,
            description: raw.description || "",
            status: raw.status,
            first_name: raw.users?.first_name || "",
            last_name: raw.users?.last_name || "",
            color: raw.color,
            team_id: raw.team_id,
            user_id: raw.user_id,
            created_at: raw.created_at,
          };

          if (payload.eventType === "INSERT") {
            setTasks((prev) => [task, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
          } else if (payload.eventType === "DELETE") {
            setTasks((prev) => prev.filter((t) => t.id !== old.id));
          }
        }
      )
      // Chat History changes
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "chat_history", filter: `user_id=eq.${user.id}` },
        (payload) => {
          const newChat = payload.new as ChatHistory;
          const oldChat = payload.old as { id: number };

          if (payload.eventType === "INSERT") {
            setChatHistory((prev) => [...prev, newChat]);
          } else if (payload.eventType === "UPDATE") {
            setChatHistory((prev) => prev.map((c) => (c.id === newChat.id ? newChat : c)));
          } else if (payload.eventType === "DELETE") {
            setChatHistory((prev) => prev.filter((c) => c.id !== oldChat.id));
          }
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [user]);

  return { profile, teams, tasks, chatHistory, loading, error, refetch: fetchAll };
};