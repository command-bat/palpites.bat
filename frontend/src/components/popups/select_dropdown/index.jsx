import { useEffect, useRef } from "react";
import styles from "./index.module.css";

export default function Select({ setValue, onClose, values }) {
  const ref = useRef(null);

  // | WC  | FIFA World Cup
  // | CL  | UEFA Champions League
  // | BL1 | Bundesliga
  // | DED | Eredivisie
  // | BSA | Campeonato Brasileiro Série A
  // | PD  | Primera Division
  // | FL1 | Ligue 1
  // | ELC | Championship
  // | PPL | Primeira Liga
  // | EC  | European Championship
  // | SA  | Serie A
  // | PL  | Premier League

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
    <div
      ref={ref}
      className={styles.dropdown}
      onMouseDown={(e) => e.stopPropagation()} // 👈 impede fechar ao clicar dentro
    >
      {values.map((value) => (
        <div
          key={value.code}
          className={styles.option}
          onClick={() => setValue(value)}
        >
          {value.name}
        </div>
      ))}
    </div>
  );
}
