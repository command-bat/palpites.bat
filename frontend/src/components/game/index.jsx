"use client";
import { useEffect, useState, useRef } from "react";
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
  const [showAllFriends, setShowAllFriends] = useState(false);
  const [loading, setLoading] = useState(true);

  const LINK = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3030";

  const statusRound = {
    icon: ["circlePlay", "circleClock", "circleCheck", "circleX"],
    text: ["palpitar", "rolado", "Acertou", "Errou"],
    style: ["", "idle", "on", "off"],
  };

  const options = ["homeTeam", "tie", "awayTeam"];
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
  async function fetchStatistics() {
    setLoading(true);
    try {
      const res = await fetch(`${LINK}/palpite/match/${match.matchId}`, {
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
  async function fetchStatisticsFriends() {
    setLoading(true);
    try {
      const res = await fetch(`${LINK}/friends/palpite/${match.matchId}`, {
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

  function calcWidth(value, total) {
    if (!total || total <= 0 || !value) return "0%";
    return `${(100 / total) * value}%`;
  }

  if (!match) return null;
  const stage = renderStage(match.stage);

  useEffect(() => {
    if (match?.hasPalpite) {
      setSelectedTeam(match.userPalpite);
    }
  }, [match?.hasPalpite, match?.userPalpite]);

  useEffect(() => {
    fetchStatistics();
    fetchStatisticsFriends();
  }, [showStatistics]);

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

  const allFriends = [
    ...(palpiteStatisticsFriends.homeTeam || []).map((f) => ({
      ...f,
      type: "homeTeam",
    })),
    ...(palpiteStatisticsFriends.tie || []).map((f) => ({
      ...f,
      type: "tie",
    })),
    ...(palpiteStatisticsFriends.awayTeam || []).map((f) => ({
      ...f,
      type: "awayTeam",
    })),
  ];

  return (
    <div
      className={`${styles.match} ${showPicker ? styles.expanded : ""} ${
        showStatistics ? styles.moreexpanded : ""
      }`}
    >
      {showPicker && <div className={styles.blurOverlay} />}

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
          <img className={styles.img} src={match.homeTeam.crest} />
          <p>{match.homeTeam.shortName}</p>
        </div>

        <div className={styles.centralInfo}>
          {stage && <div className={styles.stage}>{stage}</div>}
        </div>

        <div className={styles.awayTeam}>
          <img className={styles.img} src={match.awayTeam.crest} />
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
                        width: calcWidth(
                          palpiteStatisticsGlobal.homeTeam,
                          palpiteStatisticsGlobal.total
                        ),
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
                        width: calcWidth(
                          palpiteStatisticsGlobal.tie,
                          palpiteStatisticsGlobal.total
                        ),
                      }}
                    >
                      <img
                        className={styles.imgBar}
                        src={"/placeholder/Empate.png"}
                        alt={"empate"}
                        style={{
                          filter: "invert(1)  ",
                        }}
                      />
                    </div>
                    <div
                      title={match.awayTeam.name}
                      className={styles.awayTeam}
                      style={{
                        width: calcWidth(
                          palpiteStatisticsGlobal.awayTeam,
                          palpiteStatisticsGlobal.total
                        ),
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
              {palpiteStatisticsFriends.total > 0 && (
                <>
                  <p>
                    <Icon icon={"friends"} /> Estatistica dos seus amigos:
                    {allFriends.length > 0 && (
                      <button
                        className={styles.moreFriendsInline}
                        onClick={() => setShowAllFriends(!showAllFriends)}
                      >
                        +{allFriends.length}
                      </button>
                    )}
                  </p>
                  <div className={styles.statisticFriends}>
                    <div
                      title={match.homeTeam.name}
                      className={styles.homeTeam}
                      style={{
                        width: calcWidth(
                          palpiteStatisticsFriends.homeTeam?.length,
                          palpiteStatisticsFriends.total
                        ),
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
                        width: calcWidth(
                          palpiteStatisticsFriends.tie?.length,
                          palpiteStatisticsFriends.total
                        ),
                      }}
                    >
                      <img
                        className={styles.imgBar}
                        src={"/placeholder/Empate.png"}
                        alt={"empate"}
                        style={{
                          filter: "invert(1)",
                        }}
                      />
                    </div>
                    <div
                      title={match.awayTeam.name}
                      className={styles.awayTeam}
                      style={{
                        width: calcWidth(
                          palpiteStatisticsFriends.awayTeam?.length,
                          palpiteStatisticsFriends.total
                        ),
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
              )}
              <div className={styles.friendsWrapper}>
                {showAllFriends && (
                  <div className={styles.friendsColumn}>
                    {allFriends.map((friend) => (
                      <div key={friend._id} className={styles.friendItem}>
                        <div className={styles[`${friend.type}BackgroundImg`]}>
                          <img src={friend.avatar} alt={friend.name} />
                        </div>
                        <span>{friend.name}</span>
                        <img
                          src={
                            friend.type === "tie"
                              ? "/placeholder/Empate.png"
                              : match[friend.type]?.crest
                          }
                          alt="time"
                          style={{
                            filter:
                              friend.type === "tie"
                                ? "var(--filter)"
                                : undefined,
                          }}
                        />
                      </div>
                    ))}
                    <button
                      className={styles.moreFriends}
                      onClick={() => setShowAllFriends(false)}
                    >
                      Fechar
                    </button>
                  </div>
                )}
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
                  onClick={() =>
                    setSelectedTeam(
                      selectedTeam === selectPalpite[index]
                        ? ""
                        : selectPalpite[index]
                    )
                  }
                >
                  <img src={team.crest} />
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
          }}
        />
      </div>
    </div>
  );
}
