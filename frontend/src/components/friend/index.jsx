"use client";
import styles from "./index.module.css";
import Icon from "../icon";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function FriendCard({ friend, options, onAnswer }) {
  const router = useRouter();

  function handleClick(answer) {
    onAnswer({
      value: answer,
      userId: friend._id,
    });
  }

  return (
    <div
      className={styles.card}
      onClick={() => {
        Cookies.set("page", "perfil");
        router.push("?id=" + friend._id);
      }}
    >
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

      {options?.length > 0 && (
        <div
          className={`${styles.buttons} ${
            styles[options.length % 2 === 0 ? "pair" : "odd"]
          }`}
        >
          {options.map((option, index) => (
            <button
              key={index}
              className={`${styles[option.color]} ${
                styles[index % 2 === 0 ? "left" : "right"]
              }`}
              onClick={() => handleClick(option.answer)}
            >
              {option.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
