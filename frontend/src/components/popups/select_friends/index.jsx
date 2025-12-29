import { useEffect, useRef } from "react";
import styles from "./index.module.css";

export default function SelectFriends({ setCompetition, onClose }) {
  const ref = useRef(null);

  const friends = [
    { name: "Amigos", code: "friends" },
    { name: "Solicitações recebidas", code: "send" },
    { name: "Solicitações enviadas", code: "received" },
  ];

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div ref={ref} className={styles.dropdown}>
      {friends.map((friend) => (
        <div
          key={friend.code}
          className={styles.option}
          onClick={() => {
            setCompetition(friend);
            onClose();
          }}
        >
          {friend.name}
        </div>
      ))}
    </div>
  );
}
