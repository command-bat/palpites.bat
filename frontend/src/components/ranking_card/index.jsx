"use client";
import { useEffect, useState } from "react";
import styles from "./index.module.css";
import { useAuth } from "../../auth/useAuth";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function Ranking({ select, setPage }) {
  const { user } = useAuth();
  const [ranking, setRanking] = useState([]);
  const router = useRouter();

  const LINK = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3030";
  const isErrors = select === "errors";

  async function fetchRanking() {
    try {
      const res = await fetch(`${LINK}/ranking?by=${select}`, {
        credentials: "include",
      });
      const data = await res.json();
      setRanking(Array.isArray(data.ranking) ? data.ranking : []);
    } catch (err) {
      console.error(err);
      setRanking([]);
    }
  }

  useEffect(() => {
    fetchRanking();
  }, [select]);

  return (
    <div className={styles.ranking}>
      {ranking.map((userRank, index) => {
        const isYou = user?._id === userRank.userId;
        const position = index + 1;

        // % dinâmica
        const percent = isErrors
          ? ((userRank.errors / userRank.total) * 100).toFixed(2)
          : userRank.accuracy;

        return (
          <div
            key={userRank.userId}
            className={`${styles.row} ${isYou ? styles.you : ""}`}
            onClick={() => {
              Cookies.set("page", "perfil");
              if (isYou) {
                setPage("perfil");
              } else {
                router.push("?id=" + userRank.userId);
              }
            }}
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

            {/* % */}
            <div
              className={`${styles.accuracy} ${
                isErrors ? styles.error : styles.success
              }`}
            >
              {percent}%
            </div>

            {/* DETALHES */}
            <div className={styles.details}>
              <span className={isErrors ? styles.wrong : styles.correct}>
                {isErrors ? userRank.errors : userRank.correct}
              </span>
              <span>/</span>
              <span className={styles.total}>{userRank.total}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
