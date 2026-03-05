"use client";

import { CASH_CLOSE_TOTAL, CASH_OPEN_TOTAL, CURRENT_USER, IS_ADMIN, IS_CASH_OPEN, IS_LOGGED_IN } from "@/storage/storage-config";
import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  isAdmin: boolean;
  isAuthenticated: boolean;
  logged: (isAdmin: number, user: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("isAdmin") === "true";
    }
    return false;
  })

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(IS_LOGGED_IN) === "true";
    }
    return false;
  });

  const logged = (isAdmin: number, user: string) => {
    if (isAdmin === 1) {
      localStorage.setItem(IS_ADMIN, "true")
      setIsAdmin(true)
    } else {
      localStorage.setItem(IS_CASH_OPEN, "false")
    }

    localStorage.setItem(CURRENT_USER, user)
    localStorage.setItem(IS_LOGGED_IN, "true")
    setIsAuthenticated(true)
  };

  const logout = () => {
    const isCashOpen = localStorage.getItem(IS_CASH_OPEN)

    if (isCashOpen === "true") return

    localStorage.removeItem(IS_LOGGED_IN);
    localStorage.removeItem(IS_ADMIN);
    localStorage.removeItem(IS_CASH_OPEN);
    localStorage.removeItem(CURRENT_USER);
    localStorage.removeItem(CASH_CLOSE_TOTAL);
    localStorage.removeItem(CASH_OPEN_TOTAL);
    setIsAdmin(false);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isLogged = localStorage.getItem("isLoggedIn") === "true";
      setIsAuthenticated(isLogged);
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      isAdmin,
      isAuthenticated,
      logged,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth precisa estar dentro de <AuthProvider>");
  }
  return context;
}
