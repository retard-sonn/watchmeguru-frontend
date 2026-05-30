import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function fetchWithAuth(endpoint: string, getToken: () => Promise<string | null>) {
  const token = await getToken();
  if (!token) throw new Error("No auth token");

  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export function useStudentProfile() {
  const { getToken, isLoaded } = useAuth();
  return useQuery({
    queryKey: ["studentProfile"],
    queryFn: () => fetchWithAuth("/api/v1/students/me", getToken),
    enabled: isLoaded,
    retry: 1,
  });
}

export function useTodaySchedule() {
  const { getToken, isLoaded } = useAuth();
  return useQuery({
    queryKey: ["todaySchedule"],
    queryFn: () => fetchWithAuth("/api/v1/students/me/schedule/today", getToken),
    enabled: isLoaded,
    retry: 1,
  });
}

export function useTodayTasks() {
  const { getToken, isLoaded } = useAuth();
  return useQuery({
    queryKey: ["todayTasks"],
    queryFn: () => fetchWithAuth("/api/v1/students/me/tasks/today", getToken),
    enabled: isLoaded,
    select: (data) => data.tasks || [],
    retry: 1,
  });
}

export function useInteractions() {
  const { getToken, isLoaded } = useAuth();
  return useQuery({
    queryKey: ["interactions"],
    queryFn: () => fetchWithAuth("/api/v1/students/me/interactions", getToken),
    enabled: isLoaded,
    select: (data) => data.interactions || [],
    retry: 1,
  });
}

export function useWeekActivity() {
  const { getToken, isLoaded } = useAuth();
  return useQuery({
    queryKey: ["weekActivity"],
    queryFn: () => fetchWithAuth("/api/v1/students/me/activity/week", getToken),
    enabled: isLoaded,
    select: (data) => data.days || [],
    retry: 1,
  });
}

export function useCompleteTask() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: string) => {
      const token = await getToken();
      const res = await fetch(`${API_BASE}/api/v1/students/me/tasks/${taskId}/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) throw new Error("Failed to complete task");
      return res.json();
    },
    onMutate: async (taskId) => {
      await queryClient.cancelQueries({ queryKey: ["todayTasks"] });
      const previousTasks = queryClient.getQueryData(["todayTasks"]);
      queryClient.setQueryData(["todayTasks"], (old: unknown) => {
        if (!Array.isArray(old)) return old;
        return old.map((t: { id: string; status: string }) =>
          t.id === taskId ? { ...t, status: "completed" } : t
        );
      });
      return { previousTasks };
    },
    onError: (_err, _taskId, context) => {
      queryClient.setQueryData(["todayTasks"], context?.previousTasks);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["todayTasks"] });
      queryClient.invalidateQueries({ queryKey: ["studentProfile"] });
      queryClient.invalidateQueries({ queryKey: ["weekActivity"] });
    },
  });
}
