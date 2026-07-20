import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

export const API_BASE_URL = "http://localhost:5000";

interface User {
  id: string;
  name: string;
  email: string;
  role: "patient" | "doctor" | "admin";
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: any) => Promise<boolean>;
  logout: () => void;
  fetchWithAuth: (endpoint: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Load stored token and user info
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Invalid credentials");
        setLoading(false);
        return false;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      
      toast.success("Login successful!", { description: `Welcome back, ${data.user.name}` });
      setLoading(false);
      return true;
    } catch (err) {
      console.error(err);
      toast.error("Network error. Is the server running?");
      setLoading(false);
      return false;
    }
  };

  const signup = async (userData: any): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Registration failed");
        setLoading(false);
        return false;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);

      toast.success("Account created successfully!");
      setLoading(false);
      return true;
    } catch (err) {
      console.error(err);
      toast.error("Network error during registration");
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    toast.success("Logged out successfully");
  };

  const fetchWithAuth = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
    const headers = new Headers(options.headers || {});
    
    // Add JWT Token if available
    const activeToken = token || localStorage.getItem("token");
    if (activeToken) {
      headers.set("Authorization", `Bearer ${activeToken}`);
    }

    if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    return fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout, fetchWithAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
