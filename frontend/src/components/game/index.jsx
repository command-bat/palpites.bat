"use client";
import styles from "./index.module.css";
import Icon from "../icon";

export default function MatchCard({ match }) {
  if (!match) return;
  return (
    <div className={styles.match}>
      <div className={styles.header}>
        <div className={styles.homeTeam}>
          <img
            className={styles.img}
            src={match.homeTeam.crest}
            alt={match.homeTeam.name}
          />
          <p>{match.homeTeam.shortName}</p>
        </div>

        <div className={styles.awayTeam}>
          <img
            className={styles.img}
            src={match.awayTeam.crest}
            alt={match.awayTeam.name}
          />
          <p>{match.awayTeam.shortName}</p>
        </div>
      </div>

      <div className={styles.footer}>
        <button
          className={styles.palpitar}
          onClick={() => alert(match.matchId)}
        >
          Palpitar
        </button>
        <Icon
          className={styles.eye}
          icon={"eyeOpen"}
          onClick={() => alert("Em Breve")}
        />
        {/* <button onClick={() => alert("Em Breve")}>👁️</button> */}
      </div>
    </div>
  );
}
