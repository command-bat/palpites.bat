"use client";
import { useEffect, useState } from "react";
import styles from "./index.module.css";
import Icon from "../icon";
import { useAuth } from "../../auth/useAuth";

export default function MatchCard({ match }) {
  const { user } = useAuth();

  const [showPicker, setShowPicker] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [resultado, setResultado] = useState(""); // mostra resultado do envio
  const [selectStatusRound, setSelectStatusRound] = useState(0); // <-- estado do status
  const [palpiteStatisticsGlobal, setPalpiteStatisticsGlobal] = useState([]);
  const [palpiteStatisticsFriends, setPalpiteStatisticsFriends] = useState([]);

  const [loading, setLoading] = useState(true);

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

  // fetch das estatisticas globais
  async function fetchStatistics(match) {
    setLoading(true);
    try {
      const res = await fetch(`${LINK}/palpite/match/${match}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Not authenticated");
      const data = await res.json();

      setPalpiteStatisticsGlobal(data);
    } catch (err) {
      setPalpiteStatisticsGlobal([]);
    } finally {
      setLoading(false);
    }
  }

  // fetch das estatisticas dos amigos
  async function fetchStatisticsFriends(match) {
    setLoading(true);
    try {
      const res = await fetch(`${LINK}/friends/palpite/${match}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Not authenticated");
      const data = await res.json();

      setPalpiteStatisticsFriends(data);
    } catch (err) {
      setPalpiteStatisticsFriends([]);
    } finally {
      setLoading(false);
    }
  }

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
    } catch (err) {
      console.error(err);
      setResultado("Erro de conexão com o servidor");
    }
  }

  return (
    <div
      className={`${styles.match} ${showPicker ? styles.expanded : ""} ${
        showStatistics ? styles.moreexpanded : ""
      }`}
    >
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
        {showStatistics && (
          <>
            <div className={styles.statisticsMenu}>
              <p
                title={
                  user?.isPremium
                    ? "Estatistica Premium"
                    : "Compre o Premium para poder ver"
                }
                className={user?.isPremium ? "" : styles.blockPremium}
              >
                <Icon icon={user?.isPremium ? "globe" : "lock"} /> Estatistica
                global:
              </p>

              {user?.isPremium ? (
                <>
                  <div className={styles.statisticGlobal}>
                    <div
                      title={match.homeTeam.name}
                      className={styles.homeTeam}
                      style={{
                        width: `${
                          (100 / palpiteStatisticsGlobal.total) *
                          palpiteStatisticsGlobal.homeTeam
                        }%`,
                      }}
                    >
                      <img
                        className={styles.imgBar}
                        src={match.homeTeam.crest}
                        alt={match.homeTeam.name}
                      />
                    </div>
                    <div
                      title={"Empate"}
                      className={styles.tie}
                      style={{
                        width: `${
                          (100 / palpiteStatisticsGlobal.total) *
                          palpiteStatisticsGlobal.tie
                        }%`,
                      }}
                    >
                      <img
                        className={styles.imgBar}
                        src={"/placeholder/Empate.png"}
                        alt={"empate"}
                      />
                    </div>
                    <div
                      title={match.awayTeam.name}
                      className={styles.awayTeam}
                      style={{
                        width: `${
                          (100 / palpiteStatisticsGlobal.total) *
                          palpiteStatisticsGlobal.awayTeam
                        }%`,
                      }}
                    >
                      <img
                        className={styles.imgBar}
                        src={match.awayTeam.crest}
                        alt={match.awayTeam.name}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.statisticGlobal}>
                    <div
                      title={"Compre o Premium para poder ver"}
                      className={styles.premium}
                      style={{
                        width: `100%`,
                      }}
                    ></div>
                  </div>
                </>
              )}
              <p>
                <Icon icon={"friends"} /> Estatistica dos seus amigos:
              </p>
              <div className={styles.statisticFriends}>
                <div
                  title={match.homeTeam.name}
                  className={styles.homeTeam}
                  style={{
                    width: `${
                      (100 / palpiteStatisticsFriends.total) *
                      palpiteStatisticsFriends.homeTeam?.length
                    }%`,
                  }}
                >
                  <img
                    className={styles.imgBar}
                    src={match.homeTeam.crest}
                    alt={match.homeTeam.name}
                  />
                </div>
                <div
                  title={"Empate"}
                  className={styles.tie}
                  style={{
                    width: `${
                      (100 / palpiteStatisticsFriends.total) *
                      palpiteStatisticsFriends.tie?.length
                    }%`,
                  }}
                >
                  <img
                    className={styles.imgBar}
                    src={"/placeholder/Empate.png"}
                    alt={"empate"}
                  />
                </div>
                <div
                  title={match.awayTeam.name}
                  className={styles.awayTeam}
                  style={{
                    width: `${
                      (100 / palpiteStatisticsFriends.total) *
                      palpiteStatisticsFriends.awayTeam?.length
                    }%`,
                  }}
                >
                  <img
                    className={styles.imgBar}
                    src={match.awayTeam.crest}
                    alt={match.awayTeam.name}
                  />
                </div>
              </div>
            </div>
          </>
        )}
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
                  onClick={() => {
                    selectedTeam !== selectPalpite[index]
                      ? setSelectedTeam(selectPalpite[index])
                      : setSelectedTeam("");
                  }}
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
                }}
              >
                Palpitar
              </button>
            </>
          )}
        <Icon
          className={styles.eye}
          icon={showStatistics ? "up" : "statistics"}
          onClick={() => {
            setShowStatistics((v) => !v);
            fetchStatistics(match.matchId);
            fetchStatisticsFriends(match.matchId);
          }}
        />
      </div>
    </div>
  );
}
