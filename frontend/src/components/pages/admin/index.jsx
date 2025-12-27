"use client";

import { useState } from "react";
import styles from "./index.module.css";
import { useAuth } from "../../../auth/useAuth";

export default function Historico() {
  const { user, token, loading } = useAuth();

  const LINK = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3030";

  const [form, setForm] = useState({
    url: "",
    method: "GET",
    params: "{}",
    body: "{}",
  });

  const [history, setHistory] = useState([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  if (loading) return <p>Carregando...</p>;

  if (user?.role !== "admin") {
    return <p style={{ color: "var(--text)" }}>ACESSO NEGADO</p>;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setSending(true);
      setError(null);

      const response = await fetch(LINK + "/admin/fetch", {
        method: "POST",
        credentials: "include", // 👈 ESSENCIAL
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: form.url,
          method: form.method,
          params: JSON.parse(form.params || "{}"),
          body: JSON.parse(form.body || "{}"),
        }),
      });

      const data = await response.json();

      setHistory((prev) => [
        {
          request: { ...form },
          response: data,
          date: new Date().toISOString(),
        },
        ...prev,
      ]);
    } catch (err) {
      setError("Erro ao fazer o fetch");
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Admin Fetch</h2>

      {/* FORM */}
      <div className={styles.form}>
        <input
          name="url"
          placeholder="URL da API"
          value={form.url}
          onChange={handleChange}
        />

        <select name="method" value={form.method} onChange={handleChange}>
          <option>GET</option>
          <option>POST</option>
          <option>PUT</option>
          <option>DELETE</option>
        </select>

        <textarea
          name="params"
          placeholder="Params (JSON)"
          value={form.params}
          onChange={handleChange}
        />

        <textarea
          name="body"
          placeholder="Body (JSON)"
          value={form.body}
          onChange={handleChange}
        />

        <button onClick={handleSubmit} disabled={sending}>
          {sending ? "Enviando..." : "Enviar"}
        </button>

        {error && <p className={styles.error}>{error}</p>}
      </div>

      {/* HISTÓRICO */}
      <div className={styles.history}>
        <h3>Histórico</h3>

        {history.map((item, index) => (
          <div key={index} className={styles.item}>
            <strong>Data:</strong> {item.date}
            <pre>
              <b>Request:</b>
              {JSON.stringify(item.request, null, 2)}
            </pre>
            <pre>
              <b>Response:</b>
              {JSON.stringify(item.response, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}
