import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { getMe, login as loginRequest, logout as logoutRequest, type User } from "../api/auth";

interface AuthContextValue {
    user: User | null;

    token: string | null;

    loading: boolean;

    isAuthenticated: boolean;

    login: (email: string, password: string) => Promise<void>;

    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = "methane_access_token";

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));

    const [user, setUser] = useState<User | null>(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }

        let cancelled = false;

        async function loadUser() {
            try {
                const currentUser = await getMe(token!);

                if (!cancelled) {
                    setUser(currentUser);
                }
            } catch {
                localStorage.removeItem(TOKEN_KEY);

                if (!cancelled) {
                    setToken(null);
                    setUser(null);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadUser();

        return () => {
            cancelled = true;
        };
    }, [token]);

    const value = useMemo<AuthContextValue>(
        () => ({
            user,
            token,
            loading,

            isAuthenticated: Boolean(token),

            async login(email, password) {
                const response = await loginRequest(email, password);

                localStorage.setItem(TOKEN_KEY, response.access_token);

                setToken(response.access_token);

                if (response.user) {
                    setUser(response.user);
                }
            },

            async logout() {
                if (token) {
                    try {
                        await logoutRequest(token);
                    } finally {
                        localStorage.removeItem(TOKEN_KEY);

                        setToken(null);
                        setUser(null);
                    }

                    return;
                }

                localStorage.removeItem(TOKEN_KEY);

                setToken(null);
                setUser(null);
            },
        }),
        [user, token, loading],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }

    return context;
}
