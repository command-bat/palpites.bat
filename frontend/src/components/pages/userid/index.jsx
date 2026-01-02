"use client";
import styles from "./index.module.css";
import Icon from "../../icon";

export default function ProfileStatsCard({ user }) {
  return (
    <div className={styles.wrapper}>
      {/* HEADER */}
      <div className={styles.header}>
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
          {user.premium && <span className={styles.premiumBadge}>Premium</span>}
        </div>
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
  );
}
