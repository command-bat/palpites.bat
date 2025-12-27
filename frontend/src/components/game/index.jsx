"use client";
import styles from "./index.module.css";
import Icon from "../icon";

export default function MatchCard({ match }) {
  const selectStatusRound = 0;
  const statusRound = {
    icon: ["circlePlay", "circleClock", "circleCheck", "circleX"],
    text: ["palpitar", "rolado", "Acertou", "Errou"],
    style: ["", "idle", "on", "off"],
  };

  function renderStage(stage) {
    switch (stage) {
      case "FINAL":
        return "Final";

      case "SEMI_FINALS":
        return "Semifinal";

      case "QUARTER_FINALS":
        return "Quartas";

      case "LAST_16":
        return "Oitavas";

      case "PLAYOFFS":
        return "Playoffs";

      default:
        return null;
    }
  }

  function formatDate(dateString) {
    const date = new Date(dateString);

    const day = new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
    }).format(date);

    let month = new Intl.DateTimeFormat("pt-BR", {
      month: "short",
    }).format(date);

    month = month.replace(".", "");

    const time = new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);

    return (
      <>
        <div>
          {day}/{month}
        </div>
        <div>{time}</div>
      </>
    );
  }

  if (!match) return;

  const stage = renderStage(match.stage);

  return (
    <div className={styles.match}>
      <div className={styles.header}>
        {<div className={styles.date}>{formatDate(match.utcDate)}</div>}
        <div
          className={`${styles.alertRound} ${
            styles[statusRound.style[selectStatusRound]]
          }`}
        >
          <div className={styles.icon}>
            <Icon
              icon={statusRound.icon[selectStatusRound]} /* trocar o valor */
            />
          </div>
          <p /* trocar o valor */>{statusRound.text[selectStatusRound]}</p>
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.homeTeam}>
          <img
            className={styles.img}
            src={match.homeTeam.crest}
            alt={match.homeTeam.name}
          />
          <p>{match.homeTeam.shortName}</p>
        </div>

        <div className={styles.centralInfo}>
          {stage ? (
            <div className={styles.stage}>{stage}</div>
          ) : (
            <div className={styles.fakeStage}>{stage}</div>
          )}
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
