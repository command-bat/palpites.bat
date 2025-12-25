"use client";
import styles from "./index.module.css";

export default function MatchCard({ match }) {
  if (!match) return;
  return (
    <div className={styles.match}>
      <div className={styles.header}>
        <div className={styles.homeTeam}>
          <img
            className={styles.img}
            src={match.homeTeam.crest}
            alt={match.homeTeam.shortName}
          />
          <p>Santos</p>
        </div>

        <div className={styles.awayTeam}>
          <img
            className={styles.img}
            src={match.awayTeam.crest}
            alt={match.awayTeam.shortName}
          />
          <p>Flamengo</p>
        </div>
      </div>

      <div className={styles.footer}>
        <button
          className={styles.palpitar}
          onClick={() => alert(match.matchId)}
        >
          Palpitar
        </button>
        <button className={styles.eye} onClick={() => alert("Em Breve")}>
          👁️
        </button>
      </div>
    </div>
  );
}
