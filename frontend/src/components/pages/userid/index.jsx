"use client";
import styles from "./index.module.css";
import { useEffect, useState } from "react";
import Icon from "../../icon";
import Alert from "../../popups/alert";

export default function ProfileStatsCard({ user, isMe, isFriend }) {
  const [alert, setAlert] = useState(null);

  const LINK = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3030";

  function normalizeId(value) {
    return value.startsWith("#") ? value.slice(1) : value;
  }

  async function sendFriendRequest(value) {
    const normalizedValue = normalizeId(value.trim());

    try {
      const res = await fetch(
        `${LINK}/friends/add/${encodeURIComponent(normalizedValue)}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setAlert({ message: data.message || "Erro", type: "error" });
        return;
      }

      setAlert({ message: data.message, type: "success" });
    } catch {
      setAlert({ message: "Erro ao enviar pedido", type: "error" });
    }
  }

  return (
    <>
      <div className={styles.wrapper}>
        {/* HEADER */}
        <div className={styles.header}>
          <div className={styles.avatarName}>
            <div className={styles.avatarWrapper}>
              <img src={user.avatar} alt={user.name} />
              {user.isPremium && (
                <div className={styles.premiumIcon}>
                  <Icon icon="star" />
                </div>
              )}
            </div>

            <div className={styles.info}>
              <p className={styles.name}>{user.name}</p>
              {user.isPremium && (
                <span className={styles.premiumBadge}>Premium</span>
              )}
              <p className={styles.userId}>#{user._id}</p>
            </div>
          </div>
          {!isMe && !isFriend && (
            <button
              onClick={() => {
                sendFriendRequest(user.id);
              }}
            >
              <Icon icon={"adduser"} />
            </button>
          )}
        </div>

        {/* STATS */}
        <div className={styles.stats}>
          <div className={`${styles.statCard} ${styles.green}`}>
            <div className={styles.statTop}>
              <Icon icon="check" />
              <span>Acertos</span>
            </div>
            <strong>{user.stats.correct}</strong>
          </div>

          <div className={`${styles.statCard} ${styles.red}`}>
            <div className={styles.statTop}>
              <Icon icon="close" />
              <span>Erros</span>
            </div>
            <strong>{user.stats.wrong}</strong>
          </div>

          <div className={`${styles.statCard} ${styles.gray}`}>
            <div className={styles.statTop}>
              <Icon icon="HourglassHalf" />
              <span>Possíveis</span>
            </div>
            <strong>{user.stats.pending}</strong>
          </div>
        </div>
      </div>

      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
    </>
  );
}
