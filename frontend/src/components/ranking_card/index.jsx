"use client";
import { useEffect, useState } from "react";
import styles from "./index.module.css";
import Select from "../popups/select_dropdown";
import Icon from "../icon";
import { useAuth } from "../../auth/useAuth";

export default function Ranking() {
  const [ranking, setRanking] = useState([]);

  const LINK = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3030";

  async function fetchRanking() {
    try {
      const res = await fetch(`${LINK}/ranking`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Not authenticated");
      const data = await res.json();
      console.log(Array.isArray(data.ranking) ? data.ranking : []);
      setRanking(Array.isArray(data.ranking) ? data.ranking : []);
    } catch (err) {
      console.error(err);
      setRanking([]);
    }
  }

  useEffect(() => {
    fetchRanking();
  }, []);

  useEffect(() => {
    console.log("ranking atualizado:", ranking);
  }, [ranking]);

  return (
    <>
      {ranking.map((user) => (
        <div key={user.userId}>
          <img src={user.avatar} alt={user.name} width={40} />
          <strong>{user.name}</strong>
          <span> ✔ {user.correct}</span>
          <span> ✖ {user.errors}</span>
        </div>
      ))}
    </>
  );
}
