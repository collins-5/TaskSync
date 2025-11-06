import { useEffect, useState, useRef } from "react";
import supabase from "~/lib/utils/supabase";

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
  const [profile, setProfile] = useState<Profile | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Check for session first to avoid AuthSessionMissingError
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error("Session error:", sessionError);
          setError("Session error");
          return;
        }
        
        if (!session || !session.user) {
          // No session, clear data and return early
          setProfile(null);
          setTeams([]);
          setTasks([]);
          setChatHistory([]);
          return;
        }

        const user = session.user;

        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from("users")
          .select("id, email, first_name, last_name, image, created_at")
          .eq("id", user.id)
          .single();
        if (profileError) {
          if (profileError.message.includes("column users.image does not exist")) {
            // Fallback to query without image
            const { data: fallbackData, error: fallbackError } = await supabase
              .from("users")
              .select("id, email, first_name, last_name, created_at")
              .eq("id", user.id)
              .single();
            if (fallbackError) throw new Error(`Profile fetch error: ${fallbackError.message}`);
            setProfile(fallbackData || null);
          } else {
            throw new Error(`Profile fetch error: ${profileError.message}`);
          }
        } else {
          setProfile(profileData || null);
        }

        // Fetch teams
        const { data: teamsData, error: teamsError } = await supabase
          .from("teams")
          .select("*")
          .order("created_at", { ascending: true });
        if (teamsError) throw new Error(`Teams fetch error: ${teamsError.message}`);
        setTeams(teamsData || []);

        // Fetch tasks
        const { data: tasksData, error: tasksError } = await supabase
          .from("tasks")
          .select("id, title, description, status, color, team_id, user_id, created_at, users(first_name, last_name)")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        if (tasksError) throw new Error(`Tasks fetch error: ${tasksError.message}`);
        // Transform tasks data to match Task type
        const transformedTasks = tasksData?.map((task) => ({
          id: task.id,
          title: task.title,
          description: task.description || "",
          status: task.status,
          first_name: task.users?.first_name || "",
          last_name: task.users?.last_name || "",
          color: task.color,
          team_id: task.team_id,
          user_id: task.user_id,
          created_at: task.created_at,
        })) || [];
        setTasks(transformedTasks);

        // Fetch chat history
        const { data: chatData, error: chatError } = await supabase
          .from("chat_history")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        if (chatError) throw new Error(`Chat history fetch error: ${chatError.message}`);
        setChatHistory(chatData || []);
      } catch (err) {
        const errorMessage = (err as Error).message || "Failed to fetch data";
        setError(errorMessage);
        console.error("Supabase fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Real-time subscriptions - only set up if we have a session
    const setupSubscriptions = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        return;
      }

      const userId = session.user.id;
      
      // Clean up existing channel if any
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
      
      channelRef.current = supabase
        .channel("supabase-data")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "users",
            filter: `id=eq.${userId}`,
          },
          (payload) => {
            setProfile(payload.new as Profile);
            console.log("Real-time profile update:", payload);
          }
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "teams" },
          (payload) => {
            if (payload.eventType === "INSERT") {
              setTeams((prev) => [...prev, payload.new as Team]);
            } else if (payload.eventType === "UPDATE") {
              setTeams((prev) =>
                prev.map((team) => (team.id === payload.new.id ? (payload.new as Team) : team))
              );
            } else if (payload.eventType === "DELETE") {
              setTeams((prev) => prev.filter((team) => team.id !== payload.old.id));
            }
            console.log("Real-time teams update:", payload);
          }
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "tasks",
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            if (payload.eventType === "INSERT") {
              const newTask = {
                ...(payload.new as any),
                first_name: payload.new.users?.first_name || "",
                last_name: payload.new.users?.last_name || "",
              };
              setTasks((prev) => [newTask, ...prev]);
            } else if (payload.eventType === "UPDATE") {
              setTasks((prev) =>
                prev.map((task) =>
                  task.id === payload.new.id
                    ? { ...(payload.new as any), first_name: payload.new.users?.first_name || "", last_name: payload.new.users?.last_name || "" }
                    : task
                )
              );
            } else if (payload.eventType === "DELETE") {
              setTasks((prev) => prev.filter((task) => task.id !== payload.old.id));
            }
            console.log("Real-time tasks update:", payload);
          }
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "chat_history",
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            if (payload.eventType === "INSERT") {
              setChatHistory((prev) => [payload.new as ChatHistory, ...prev]);
            } else if (payload.eventType === "UPDATE") {
              setChatHistory((prev) =>
                prev.map((chat) => (chat.id === payload.new.id ? (payload.new as ChatHistory) : chat))
              );
            } else if (payload.eventType === "DELETE") {
              setChatHistory((prev) => prev.filter((chat) => chat.id !== payload.old.id));
            }
            console.log("Real-time chat history update:", payload);
          }
        )
        .subscribe();
    };

    setupSubscriptions();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, []);

  return { profile, teams, tasks, chatHistory, loading, error };
};