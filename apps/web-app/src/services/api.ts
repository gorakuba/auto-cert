import type { Participant } from "../types";
import { authService } from "./auth";

// Automatically inject Authorization header
function getHeaders(customHeaders: Record<string, string> = {}) {
    const token = authService.getAccessToken();
    return {
        ...customHeaders,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function onRefreshed(token: string) {
    refreshSubscribers.forEach((cb) => cb(token));
    refreshSubscribers = [];
}

async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
    options.headers = getHeaders(options.headers as Record<string, string>);

    let res = await fetch(url, options);

    // If 401, try to refresh token
    if (res.status === 401) {
        if (!isRefreshing) {
            isRefreshing = true;
            try {
                const refreshRes = await fetch("/api/auth/refresh", { method: "POST" });
                if (refreshRes.ok) {
                    const data = await refreshRes.json();
                    authService.setAccessToken(data.accessToken);
                    onRefreshed(data.accessToken);
                } else {
                    // Refresh failed, clear token and let subscribers fail
                    authService.clearToken();
                    onRefreshed("");
                    // Here we could trigger a global event to redirect to login
                    window.dispatchEvent(new CustomEvent("auth:logout"));
                }
            } catch (err) {
                authService.clearToken();
                onRefreshed("");
            } finally {
                isRefreshing = false;
            }
        }

        // Wait for the refresh to finish
        const newToken = await new Promise<string>((resolve) => {
            refreshSubscribers.push(resolve);
        });

        if (newToken) {
            options.headers = getHeaders(options.headers as Record<string, string>);
            res = await fetch(url, options);
        }
    }

    return res;
}

export const api = {
    participants: {
        getAll: async (): Promise<Participant[]> => {
            const res = await fetchWithAuth("/api/participants");
            if (!res.ok) throw new Error("Failed to fetch participants");
            return res.json();
        },
        setAll: async (participants: Participant[]) => {
            const res = await fetchWithAuth("/api/participants/bulk", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(participants),
            });
            if (!res.ok) throw new Error("Failed to save participants");
        },
        clear: async () => {
            await fetchWithAuth("/api/participants", { method: "DELETE" });
        },
    },
    settings: {
        get: async (key: string): Promise<string | null> => {
            const res = await fetchWithAuth(`/api/settings/${key}`);
            if (res.status === 404) return null;
            if (!res.ok) throw new Error(`Failed to get setting ${key}`);
            const data = await res.json();
            return data.value;
        },
        set: async (key: string, value: string): Promise<void> => {
            const res = await fetchWithAuth(`/api/settings/${key}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ value }),
            });
            if (!res.ok) throw new Error(`Failed to set setting ${key}`);
        },
    },
};
