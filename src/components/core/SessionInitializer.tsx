// src/contexts/SessionInitContext.tsx  (or wherever you keep it)
import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import supabase from "~/lib/utils/supabase";
import type { User } from "@supabase/supabase-js";
import { Alert } from "react-native";

interface SessionInitContextType {
  loading: boolean;
  loggedIn: boolean;
  hasProfile: boolean;
  user: User | null;
  checkAuthState: () => Promise<void>;
  logout: () => Promise<void>;
}

/* ---------- Context ---------- */
export const SessionInitContext = createContext<SessionInitContextType>({
  loading: true,
  loggedIn: false,
  hasProfile: false,
  user: null,
  checkAuthState: async () => {},
  logout: async () => {},
});

export const useSessionInit = () => {
  const ctx = useContext(SessionInitContext);
  if (!ctx)
    throw new Error("useSessionInit must be used within SessionInitializer");
  return ctx;
};

/* ---------- Provider ---------- */
const SessionInitializer = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  /* ---------- Helpers ---------- */
  const checkAuthState = async () => {
    try {
      setLoading(true);
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) throw error;

      if (!session) {
        setLoggedIn(false);
        setHasProfile(false);
        setUser(null);
        return;
      }

      setLoggedIn(true);
      setUser(session.user);

      // ---- profile check -------------------------------------------------
      const { data: profile, error: pErr } = await supabase
        .from("users")
        .select("id, first_name, last_name")
        .eq("id", session.user.id)
        .single();

      if (pErr || !profile || (!profile.first_name && !profile.last_name)) {
        setHasProfile(false);
      } else {
        setHasProfile(true);
      }
    } catch (e) {
      console.error("Auth check failed:", e);
      setLoggedIn(false);
      setHasProfile(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      console.log("Signing out (local scope)…");

      // <-- THIS IS THE KEY LINE
      const { error } = await supabase.auth.signOut({ scope: "local" });

      // **Ignore AuthSessionMissingError** – it’s harmless after a local sign-out
      if (error && !(error as any).name?.includes("AuthSessionMissingError")) {
        throw error;
      }

      // Reset UI state
      setLoggedIn(false);
      setHasProfile(false);
      setUser(null);

      console.log("Logged out successfully");

      // Redirect to login (or home)
      router.replace("/login");
    } catch (err: any) {
      console.error("Logout error (non-session):", err);
      Alert.alert("Logout failed", err.message ?? "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- Lifecycle ---------- */
  useEffect(() => {
    checkAuthState();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoggedIn(!!session);
      checkAuthState(); // re-run profile check
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <SessionInitContext.Provider
      value={{
        loading,
        loggedIn,
        hasProfile,
        user,
        checkAuthState,
        logout,
      }}
    >
      {children}
    </SessionInitContext.Provider>
  );
};

export default SessionInitializer;
