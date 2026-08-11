"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = (typeof window !== 'undefined') ? require('next/navigation').useRouter() : null;

  useEffect(() => {
    // Mock user for demo purposes to avoid Firebase auth domain issues
    const mockUser = {
      uid: "demo-user",
      email: "demo@example.com",
      displayName: "Demo User",
    } as User;
    
    // Check if user is logged out in localStorage to simulate logout state
    const isLoggedOut = localStorage.getItem("demo_logged_out") === "true";
    
    if (!isLoggedOut) {
      setUser(mockUser);
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  const signOut = async () => {
    try {
      localStorage.setItem("demo_logged_out", "true");
      setUser(null);
      if (router) {
        router.push('/login');
      }
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  const signIn = () => {
    localStorage.removeItem("demo_logged_out");
    const mockUser = {
      uid: "demo-user",
      email: "demo@example.com",
      displayName: "Demo User",
    } as User;
    setUser(mockUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut, signIn } as any}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
