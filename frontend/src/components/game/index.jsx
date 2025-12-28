"use client";
import { useState } from "react";
import styles from "./index.module.css";
import Icon from "../icon";

export default function MatchCard({ match }) {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [resultado, setResultado] = useState(""); // mostra resultado do envio

  const LINK = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3030";

  const statusRound = {
    icon: ["circlePlay", "circleClock", "circleCheck", "circleX"],
    text: ["palpitar", "rolado", "Acertou", "Errou"],
    style: ["", "idle", "on", "off"],
  };

  const empate = {
    id: 0,
    name: "Empate",
    shortName: "Empate",
    tla: "TIE",
    crest: "/placeholder/Empate.png",
  };

  const stylesPalpite = [
    styles.homeTeamPalpite,
    styles.tiePalpite,
    styles.awayTeamPalpite,
  ];

  const selectPalpite = ["homeTeam", "tie", "awayTeam"];

  const selectStatusRound = 0;

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
    const day = new Intl.DateTimeFormat("pt-BR", { day: "2-digit" }).format(
      date
    );
    let month = new Intl.DateTimeFormat("pt-BR", { month: "short" }).format(
      date
    );
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

  if (!match) return null;
  const stage = renderStage(match.stage);

  function handleTeamSelect(team) {
    setSelectedTeam(team);
  }

  async function enviarPalpite() {
    console.log(Number(match.matchId));
    console.log(selectedTeam);
    if (!selectedTeam) return;

    try {
      const response = await fetch(LINK + "/palpite", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          matchId: Number(match.matchId),
          palpite: selectedTeam,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setResultado("Erro: " + (data.message || "Falha ao enviar"));
        return;
      }

      setResultado("Palpite enviado com sucesso!");
      console.log("Palpite enviado:", data);
      setShowPicker(false); // fecha o menu após enviar
    } catch (err) {
      console.error(err);
      setResultado("Erro de conexão com o servidor");
    }
  }

  console.log(match);
  return (
    <div className={`${styles.match} ${showPicker ? styles.expanded : ""}`}>
      {showPicker && <div className={styles.blurOverlay}></div>}

      <div className={styles.header}>
        <div className={styles.date}>{formatDate(match.utcDate)}</div>
        <div
          className={`${styles.alertRound} ${
            styles[statusRound.style[selectStatusRound]]
          }`}
        >
          <div className={styles.icon}>
            <Icon icon={statusRound.icon[selectStatusRound]} />
          </div>
          <p>{statusRound.text[selectStatusRound]}</p>
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

        {showPicker && (
          <div className={styles.palpiteMenu}>
            <p>Escolha o vencedor</p>
            <div className={styles.teamsPicker}>
              {[match.homeTeam, empate, match.awayTeam].map((team, index) => (
                <div
                  key={team.id}
                  className={`${styles.teamOption} ${
                    selectedTeam === team.shortName ? styles.selected : ""
                  } ${stylesPalpite[index]}`}
                  onClick={() => handleTeamSelect(selectPalpite[index])}
                >
                  <img src={team.crest} alt={team.name} />
                  <p>{team.shortName}</p>
                </div>
              ))}
            </div>

            <button
              className={`${styles.confirmButton} ${
                selectedTeam ? styles.active : ""
              }`}
              onClick={enviarPalpite}
            >
              {selectedTeam ? "Confirmar palpite" : "Cancelar"}
            </button>

            {resultado && <p className={styles.resultado}>{resultado}</p>}
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <button
          className={styles.palpitar}
          onClick={() => {
            setShowPicker(!showPicker);
            setResultado("");
            setSelectedTeam(null);
          }}
        >
          Palpitar
        </button>
        <Icon
          className={styles.eye}
          icon={"eyeOpen"}
          onClick={() => alert("Em Breve")}
        />
      </div>
    </div>
  );
}
