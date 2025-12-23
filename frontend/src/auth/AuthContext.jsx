"use client";

import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchUser() {
    try {
      const res = await fetch("http://localhost:3030/users/me", {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Not authenticated");

      const data = await res.json();
      console.log("Usuário logado:", data.user); // 👈 console pedido
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  async function logout() {
    await fetch("http://localhost:3030/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, refreshUser: fetchUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
