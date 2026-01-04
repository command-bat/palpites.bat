"use client";

import { useEffect } from "react";
import Cookies from "js-cookie";
import styles from "./index.module.css";

export default function FriendRequestPopup({
  user,
  onClose,
  setPage,
  setSelect,
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={styles.popup}
      onClick={() => {
        setPage("amigos");
        setSelect({ name: "Solicitações recebidas", code: "received" });
        Cookies.set("page", "amigos");
        onClose();
      }}
    >
      <div className="card">
        <button
          className={styles.close}
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          ✕
        </button>
        <div className={styles.avatarName}>
          <div className={styles.avatarWrapper}>
            <img src={user.avatar} alt={user.name} />
          </div>

          <span className={styles.name}>
            {"  "}
            {user.name}
          </span>
        </div>
        <div className={styles.info}>
          <span className={styles.id}>
            Pedido de amizade Recebido
            {"  "}
          </span>
        </div>
      </div>
    </div>
  );
}
