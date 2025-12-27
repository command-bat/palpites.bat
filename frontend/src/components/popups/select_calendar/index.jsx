import { useEffect, useRef } from "react";
import styles from "./index.module.css";

export default function SelectDate({ date, setDate, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  function changeDay(offset) {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + offset);
    setDate(newDate);
  }

  return (
    <div ref={ref} className={styles.dropdown}>
      <div className={styles.option} onClick={() => changeDay(-1)}>
        ←
      </div>

      <div className={styles.option} onClick={() => setDate(new Date())}>
        Hoje
      </div>

      <div className={styles.option} onClick={() => changeDay(1)}>
        →
      </div>
    </div>
  );
}
