"use client";
import styles from "./index.module.css";
import Icon from "../icon";

export default function FriendCard({ friend }) {
  return (
    <div className={styles.card}>
      <div className={styles.avatarWrapper}>
        <img src={friend.avatar} alt={friend.name} />
        {friend.isPremium && (
          <span className={styles.premiumIcon}>
            <Icon icon="star" />
          </span>
        )}
      </div>

      <div className={styles.info}>
        <p className={styles.name}>{friend.name}</p>

        {friend.isPremium && (
          <span className={styles.premiumBadge}>Premium</span>
        )}

        <p className={styles.id}>#{friend._id}</p>
      </div>
    </div>
  );
}
