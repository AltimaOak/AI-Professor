import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "@/lib/api";

// ── Types ─────────────────────────────────────────────────────────────────────
type User = {
  id: string;
  name: string;
  email: string;
  avatar_url?: string | null;
};

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

// ── Context ───────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ── Provider ──────────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Rehydrate user from localStorage on app load
  useEffect(() => {
    const storedUser = localStorage.getItem("auth_user");
    const token = localStorage.getItem("auth_token");
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("auth_user");
        localStorage.removeItem("auth_token");
      }
    }
    setIsLoading(false);
  }, []);

  // ── Login ──────────────────────────────────────────────────────────────────
  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Send JSON — matches backend UserLogin schema { email, password }
      const { data } = await api.post("/auth/login", { email, password });

      localStorage.setItem("auth_token", data.access_token);

      // Fetch real user profile using the token
      const { data: profile } = await api.get("/auth/me", {
        headers: { Authorization: `Bearer ${data.access_token}` },
      });

      const loggedInUser: User = {
        id: profile.id,
        name: profile.full_name,
        email: profile.email,
        avatar_url: profile.avatar_url ?? null,
      };

      setUser(loggedInUser);
      localStorage.setItem("auth_user", JSON.stringify(loggedInUser));
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        throw new Error("Invalid email or password");
      }
      throw new Error("Login failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Signup ─────────────────────────────────────────────────────────────────
  const signup = async (
    name: string,
    email: string,
    password: string
  ): Promise<void> => {
    setIsLoading(true);
    try {
      // Register user — backend returns UserResponse
      await api.post("/auth/signup", {
        full_name: name,
        email,
        password,
      });

      // Immediately log in so user lands on dashboard
      await login(email, password);
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        throw new Error("User already exists or invalid data");
      }
      throw new Error("Signup failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Logout ─────────────────────────────────────────────────────────────────
  const logout = (): void => {
    setUser(null);
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_token");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ── Hook ──────────────────────────────────────────────────────────────────────
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};