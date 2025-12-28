import { useEffect, useRef } from "react";
import styles from "./index.module.css";

export default function SelectCompetition({ setCompetition, onClose }) {
  const ref = useRef(null);

  const competitions = [
    { name: "Copa do Mundo FIFA", code: "WC" },
    { name: "Champions League", code: "CL" },
    { name: "Bundesliga", code: "BL1" },
    { name: "Eredivisie", code: "DED" },
    { name: "Brasileirão", code: "BSA" },
    { name: "Primera Division", code: "PD" },
    { name: "Ligue 1", code: "FL1" },
    { name: "Championship", code: "ELC" },
    { name: "Primeira Liga", code: "PPL" },
    { name: "European Championship", code: "EC" },
    { name: "Serie A", code: "SA" },
    { name: "Premier League", code: "PL" },
  ];

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
    <div ref={ref} className={styles.dropdown}>
      {competitions.map((competition) => (
        <div
          key={competition.code}
          className={styles.option}
          onClick={() => {
            setCompetition(competition);
            onClose();
          }}
        >
          {competition.name}
        </div>
      ))}
    </div>
  );
}
