import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { authService } from "../services/auth";
import type { UserData } from "../services/auth";

interface AuthContextType {
    user: UserData | null;
    isLoading: boolean;
    loginState: (token: string) => void;
    logoutState: () => void;
    setUser: (user: UserData | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            // First, check if we have a valid token
            if (authService.isAuthenticated()) {
                setUser(authService.getUserData());
                setIsLoading(false);
            } else {
                // Try to refresh silently
                try {
                    const res = await fetch("/api/auth/refresh", { method: "POST" });
                    if (res.ok) {
                        const data = await res.json();
                        authService.setAccessToken(data.accessToken);
                        setUser(authService.getUserData());
                    } else {
                        authService.clearToken();
                        setUser(null);
                    }
                } catch {
                    authService.clearToken();
                    setUser(null);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        initAuth();

        // Listen to global logout event from api interceptor
        const handleLogout = () => {
            setUser(null);
        };
        window.addEventListener("auth:logout", handleLogout);
        return () => window.removeEventListener("auth:logout", handleLogout);
    }, []);

    const loginState = (token: string) => {
        authService.setAccessToken(token);
        setUser(authService.getUserData());
    };

    const logoutState = () => {
        authService.clearToken();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, loginState, logoutState, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
    return ctx;
};
