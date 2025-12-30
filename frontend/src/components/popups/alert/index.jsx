"use client";
import { useEffect } from "react";
import styles from "./index.module.css";
import Icon from "../../icon";

export default function Alert({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 500);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={styles.overlay}>
      <div className={`${styles.alert} ${styles[type]}`}>
        <div className={styles.content}>
          <Icon
            icon={type === "error" ? "close" : "check"}
            className={styles.icon}
          />

          <div className={styles.texts}>
            <h1>{message}</h1>
            <p>
              {type === "error"
                ? "Algo deu errado"
                : "Ação realizada com sucesso"}
            </p>
          </div>
        </div>

        <button className={styles.close} onClick={onClose}>
          <Icon icon="close" />
        </button>
      </div>
    </div>
  );
}
