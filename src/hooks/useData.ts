import { useState, useEffect } from "react";
import { mockTasks, mockTeams, Task, Team } from "./task-data";

interface DataState {
  tasks: Task[];
  teams: Team[];
  loading: boolean;
  error: string | null;
}

export function useData() {
  const [data, setData] = useState<DataState>({
    tasks: [],
    teams: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mock fetch (replace with Supabase later)
        setData({
          tasks: mockTasks,
          teams: mockTeams,
          loading: false,
          error: null,
        });
      } catch (err) {
        setData({
          tasks: [],
          teams: [],
          loading: false,
          error: (err as Error).message,
        });
      }
    };

    fetchData();
  }, []);

  return data;
}
