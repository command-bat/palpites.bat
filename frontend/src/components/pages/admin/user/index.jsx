"use client";

import { useState } from "react";
import styles from "../index.module.css";
import { useAuth } from "../../../../auth/useAuth";

export default function AdminUser() {
  const { user, loading } = useAuth();
  const LINK = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3030";

  const [userId, setUserId] = useState("");
  const [rawJson, setRawJson] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  if (loading) return <p>Carregando...</p>;
  if (user?.role !== "admin") return <p>ACESSO NEGADO</p>;

  const fetchUser = async () => {
    try {
      setError(null);

      const res = await fetch(`${LINK}/admin/user/${userId}/raw`, {
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setRawJson(JSON.stringify(data, null, 2));
    } catch (err) {
      setError(err.message);
    }
  };

  const saveUser = async () => {
    try {
      setSaving(true);
      setError(null);

      const parsed = JSON.parse(rawJson);

      const res = await fetch(`${LINK}/admin/user/${userId}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      alert("Usuário atualizado com sucesso");
    } catch (err) {
      setError(err.message || "JSON inválido");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Admin · Usuário</h2>

      <div className={styles.form}>
        <input
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />

        <button onClick={fetchUser}>Buscar usuário</button>

        <textarea
          value={rawJson}
          style={{ height: "80dvh" }}
          onChange={(e) => setRawJson(e.target.value)}
          placeholder="JSON do usuário"
        />

        <button onClick={saveUser} disabled={saving}>
          {saving ? "Salvando..." : "Salvar alterações"}
        </button>

        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
}
