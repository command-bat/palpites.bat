"use client";
import { useEffect, useState } from "react";
import styles from "./index.module.css";
import Icon from "../icon";

export default function MatchCard({ match }) {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [resultado, setResultado] = useState(""); // mostra resultado do envio
  const [selectStatusRound, setSelectStatusRound] = useState(0); // <-- estado do status

  const LINK = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3030";

  const statusRound = {
    icon: ["circlePlay", "circleClock", "circleCheck", "circleX"],
    text: ["palpitar", "rolado", "Acertou", "Errou"],
    style: ["", "idle", "on", "off"],
  };

  const mapWinnerToUserPalpite = (winner) => {
    switch (winner) {
      case "HOME_TEAM":
        return "homeTeam";
      case "DRAW":
        return "tie";
      case "AWAY_TEAM":
        return "awayTeam";
      default:
        return null;
    }
  };

  const getMatchStatus = () => {
    const now = new Date();
    const winnerMapped = mapWinnerToUserPalpite(match.score.winner);

    if (match.status === "TIMED" && new Date(match.utcDate) > now) return 0;
    if (
      match.status !== "TIMED" &&
      match.status !== "FINISHED" &&
      new Date(match.utcDate) > now
    )
      return 1;
    if (
      match.status === "FINISHED" &&
      match.hasPalpite &&
      match.userPalpite === winnerMapped
    )
      return 2;
    if (match.status === "FINISHED") return 3;
    return -1;
  };

  // Atualiza status a cada minuto e quando o componente monta
  useEffect(() => {
    if (!match) return;

    // Atualiza imediatamente ao iniciar
    setSelectStatusRound(getMatchStatus());

    const interval = setInterval(() => {
      setSelectStatusRound(getMatchStatus());
    }, 60 * 1000); // 60 segundos

    return () => clearInterval(interval); // limpa intervalo ao desmontar
  }, [match]);

  useEffect(() => {
    if (match?.hasPalpite) {
      setSelectedTeam(match.userPalpite);
    }
  }, [match?.hasPalpite, match?.userPalpite]);

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

  useEffect(() => {
    if (match?.hasPalpite) {
      setSelectedTeam(match.userPalpite);
    }
  }, [match?.hasPalpite, match?.userPalpite]);

  async function enviarPalpite() {
    setShowPicker(false);

    console.log(match);
    // console.log(selectedTeam);
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
    } catch (err) {
      console.error(err);
      setResultado("Erro de conexão com o servidor");
    }
  }

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
                    selectedTeam === selectPalpite[index] ? styles.selected : ""
                  } ${stylesPalpite[index]}`}
                  onClick={() => setSelectedTeam(selectPalpite[index])}
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
        {match.status === "TIMED" &&
          match.status !== "FINISHED" &&
          new Date(match.utcDate) > new Date() && (
            <>
              <button
                className={styles.palpitar}
                onClick={() => {
                  setShowPicker((v) => !v);
                  setResultado("");
                  if (!match.hasPalpite) {
                    setSelectedTeam(null);
                  }
                }}
              >
                Palpitar
              </button>
            </>
          )}
        <Icon
          className={styles.eye}
          icon={"eyeOpen"}
          onClick={() => alert("Em Breve")}
        />
      </div>
    </div>
  );
}
