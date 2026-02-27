import type { Participant } from "../types";
import { getGuestId } from "../utils/guest";

const getHeaders = (additionalHeaders: Record<string, string> = {}) => {
  return {
    "X-Guest-ID": getGuestId(),
    ...additionalHeaders,
  };
};

export const api = {
  participants: {
    getAll: async (): Promise<Participant[]> => {
      const res = await fetch("/api/participants", {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error("Failed to fetch participants");
      return res.json();
    },
    setAll: async (participants: Participant[]) => {
      const res = await fetch("/api/participants/bulk", {
        method: "POST",
        headers: getHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(participants),
      });
      if (!res.ok) throw new Error("Failed to save participants");
    },
    clear: async () => {
      await fetch("/api/participants", {
        method: "DELETE",
        headers: getHeaders(),
      });
    },
  },
  settings: {
    get: async (key: string): Promise<string | null> => {
      const res = await fetch(`/api/settings/${key}`, {
        headers: getHeaders(),
      });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error(`Failed to get setting ${key}`);
      const data = await res.json();
      return data.value;
    },
    set: async (key: string, value: string): Promise<void> => {
      const res = await fetch(`/api/settings/${key}`, {
        method: "PUT",
        headers: getHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ value }),
      });
      if (!res.ok) throw new Error(`Failed to set setting ${key}`);
    },
  },
};
