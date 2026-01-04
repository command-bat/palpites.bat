"use client";

import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [friendRequests, setFriendRequests] = useState([]);

  const LINK = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3030";

  async function fetchUser() {
    try {
      const res = await fetch(LINK + "/users/me", {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Not authenticated");

      const data = await res.json();
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function fetchUserById(userId) {
    try {
      const res = await fetch(`${LINK}/users/${userId}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      return null;
    }
  }

  // 🔹 busca pedidos recebidos
  useEffect(() => {
    if (!user?.friends?.received?.length) return;

    let cancelled = false;

    async function loadRequests() {
      const users = await Promise.all(user.friends.received.map(fetchUserById));

      if (!cancelled) {
        setFriendRequests(users.filter(Boolean));
      }
    }

    loadRequests();
    return () => (cancelled = true);
  }, [user]);

  useEffect(() => {
    fetchUser();
  }, []);

  async function logout() {
    await fetch(LINK + "/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        friendRequests,
        clearFriendRequests: () => setFriendRequests([]),
        refreshUser: fetchUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
