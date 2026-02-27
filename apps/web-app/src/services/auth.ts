// src/services/auth.ts
export interface UserData {
    id: string;
    email: string;
}

export const authService = {
    getAccessToken(): string | null {
        return localStorage.getItem("accessToken");
    },

    setAccessToken(token: string) {
        localStorage.setItem("accessToken", token);
    },

    clearToken() {
        localStorage.removeItem("accessToken");
    },

    isAuthenticated(): boolean {
        const token = this.getAccessToken();
        if (!token) return false;

        // Very basic expiration check (payload decode)
        try {
            const parts = token.split(".");
            if (parts.length !== 3) return false;
            const payload = JSON.parse(atob(parts[1]));
            if (payload.exp && payload.exp * 1000 < Date.now()) {
                return false;
            }
            return true;
        } catch {
            return false;
        }
    },

    getUserData(): UserData | null {
        const token = this.getAccessToken();
        if (!token) return null;

        try {
            const parts = token.split(".");
            if (parts.length !== 3) return null;
            const payload = JSON.parse(atob(parts[1]));
            return {
                id: payload.sub,
                email: payload.email,
            };
        } catch {
            return null;
        }
    }
};
