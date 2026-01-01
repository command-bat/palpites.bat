"use client";
import { useEffect, useState } from "react";
import styles from "./index.module.css";
import { useAuth } from "../../auth/useAuth";

export default function Ranking() {
  const { user } = useAuth();
  const [ranking, setRanking] = useState([]);

  const LINK = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3030";

  async function fetchRanking() {
    try {
      const res = await fetch(`${LINK}/ranking`, {
        credentials: "include",
      });
      const data = await res.json();
      console.log(data);
      setRanking(Array.isArray(data.ranking) ? data.ranking : []);
    } catch (err) {
      console.error(err);
      setRanking([]);
    }
  }

  useEffect(() => {
    fetchRanking();
  }, []);

  return (
    <div className={styles.ranking}>
      {ranking.map((userRank, index) => {
        const isYou = user?._id === userRank.userId;
        const position = index + 1;

        return (
          <div
            key={userRank.userId}
            className={`${styles.row} ${isYou ? styles.you : ""}`}
          >
            {/* POSIÇÃO + USUÁRIO */}
            <div className={styles.user}>
              <span
                className={`${styles.position} ${
                  position <= 3 ? styles["top" + position] : ""
                }`}
              >
                {position}
              </span>

              <img src={userRank.avatar} alt={userRank.name} />
              <p>{userRank.name}</p>
            </div>

            {/* APROVEITAMENTO */}
            <div className={styles.accuracy}>{userRank.accuracy}%</div>

            {/* DETALHES */}
            <div className={styles.details}>
              <span className={styles.correct}>{userRank.correct}</span>
              <span>/</span>
              <span className={styles.total}>{userRank.total}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
