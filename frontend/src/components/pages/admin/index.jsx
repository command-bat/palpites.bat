"use client";

import { useState } from "react";
import { useAuth } from "../../../auth/useAuth";
import styles from "./index.module.css";
import Fetch from "./fetch";
import User from "./user";

export default function AdminHome() {
  const { user, loading } = useAuth();
  const [page, setPage] = useState("Fetch");

  if (loading) return <p>Carregando...</p>;
  if (user?.role !== "admin") return <p>ACESSO NEGADO</p>;

  const pages = {
    Fetch: <Fetch />,
    User: <User />,
  };

  return (
    <>
      <div className={styles.container}>
        <h2>Painel Admin</h2>

        <div className={styles.cards}>
          <button
            className={styles.card}
            onClick={() => {
              setPage("Fetch");
            }}
          >
            <strong>Fetch</strong>
            <span>Requisições manuais / debug</span>
          </button>

          <button
            className={styles.card}
            onClick={() => {
              setPage("User");
            }}
          >
            <strong>Usuários</strong>
            <span>Editar usuário via JSON</span>
          </button>
        </div>
      </div>
      <div className={styles.page}>{pages[page] || null}</div>
    </>
  );
}
