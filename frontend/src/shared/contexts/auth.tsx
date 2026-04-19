"use client";

import { KeycloakService } from "@/src/services/keycloack";
import { createContext, useContext, useMemo, useState } from "react";

type User = {
  sub: string;
  email?: string;
  preferred_username?: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  logout: () => void;
  refreshUser: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const keycloak = useMemo(() => new KeycloakService(), []);

  const [user, setUser] = useState<User | null>(() => {
    return keycloak.getUser();
  });

  function refreshUser() {
    const user = keycloak.getUser();
    setUser(user ?? null);
  }

  function logout() {
    keycloak.logout();
    setUser(null);
    window.location.href = "/login";
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
