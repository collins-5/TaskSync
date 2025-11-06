import React, { createContext, useContext, useEffect, useState } from "react";
import supabase from "~/lib/utils/supabase";
import type { User } from "@supabase/supabase-js";

interface SessionInitContextType {
  loading: boolean;
  loggedIn: boolean;
  hasProfile: boolean;
  user: User | null;
  checkAuthState: () => Promise<void>;
}

export const SessionInitContext = createContext<SessionInitContextType>({
  loading: true,
  loggedIn: false,
  hasProfile: false,
  user: null,
  checkAuthState: async () => {},
});

export const useSessionInit = () => {
  const context = useContext(SessionInitContext);
  if (!context) {
    throw new Error("useSessionInit must be used within a SessionInitializer");
  }
  return context;
};

const SessionInitializer = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const checkAuthState = async () => {
    try {
      console.log("Checking auth state...");
      setLoading(true);
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError) {
        console.error("Session retrieval error:", sessionError);
        throw sessionError;
      }

      console.log("Session:", session ? "Found" : "Not found");
      if (!session) {
        setLoggedIn(false);
        setHasProfile(false);
        setUser(null);
        return;
      }

      setLoggedIn(true);
      setUser(session.user);
      console.log("User:", session.user.id);

      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("id, first_name, last_name")
        .eq("id", session.user.id)
        .single();

      if (
        profileError ||
        !profile ||
        (!profile.first_name && !profile.last_name)
      ) {
        console.log(
          "Profile check failed:",
          profileError?.message || "No profile data"
        );
        setHasProfile(false);
      } else {
        console.log("Profile found:", profile);
        setHasProfile(true);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setLoggedIn(false);
      setHasProfile(false);
      setUser(null);
    } finally {
      setLoading(false);
      console.log("Auth state check complete:", {
        loggedIn,
        hasProfile,
        user: user?.id,
      });
    }
  };

  useEffect(() => {
    console.log("Initializing session check...");
    checkAuthState();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log(
        "Auth state changed:",
        session ? "Session active" : "No session"
      );
      setUser(session?.user ?? null);
      setLoggedIn(!!session);
      checkAuthState();
    });

    return () => {
      console.log("Unsubscribing from auth state changes");
      subscription.unsubscribe();
    };
  }, []);

  return (
    <SessionInitContext.Provider
      value={{ loading, loggedIn, hasProfile, user, checkAuthState }}
    >
      {children}
    </SessionInitContext.Provider>
  );
};

export default SessionInitializer;
