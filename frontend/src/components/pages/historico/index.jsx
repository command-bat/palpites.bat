"use client";
import { useEffect, useState } from "react";
import styles from "./index.module.css";
import Matches from "../../game";
import Icon from "../../icon";
import SelectCompetition from "../../popups/select_dropdown";
import SelectDate from "../../popups/select_calendar";
import { useAuth } from "../../../auth/useAuth";

export default function Historico() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [openCalendar, setOpenCalendar] = useState(false);

  const [competition, setCompetition] = useState({
    name: "Brasileirão",
    code: "BSA",
  });
  const [openSetCompetition, setOpenSetCompetition] = useState(false);

  const LINK = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3030";

  const valuesCompetition = [
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

  function formattedDateForDisplay(date) {
    return `${date.getDate()} ${date.toLocaleDateString("pt-BR", {
      month: "short",
    })} ${date.getFullYear()}`;
  }

  function formattedDateForFetch(date) {
    const meses = {
      jan: "01",
      fev: "02",
      mar: "03",
      abr: "04",
      mai: "05",
      jun: "06",
      jul: "07",
      ago: "08",
      set: "09",
      out: "10",
      nov: "11",
      dez: "12",
    };

    const parts = formattedDateForDisplay(date).split(" ");
    const dia = parts[0].padStart(2, "0");
    const mes = meses[parts[1].replace(".", "")];
    const ano = parts[2];

    return `${ano}-${mes}-${dia}`;
  }

  // fetch das datas disponíveis
  async function fetchDate() {
    try {
      const res = await fetch(
        `${LINK}/matches/days?competition=${competition.code}&all=${
          user.role === "admin" ? "true" : "old"
        }`,
        { credentials: "include" }
      );
      if (!res.ok) throw new Error("Not authenticated");
      const data = await res.json();

      return Array.isArray(data) ? data : [];
    } catch (err) {
      return [];
    }
  }

  // fetch das partidas da data selecionada
  async function fetchMatch(date) {
    setLoading(true);
    try {
      const res = await fetch(
        `${LINK}/matches/?teams=true&competition=${
          competition.code
        }&date=${formattedDateForFetch(date)}&palpite=true`,
        { credentials: "include" }
      );
      if (!res.ok) throw new Error("Not authenticated");
      const data = await res.json();
      setMatches(Array.isArray(data) ? data : []);
    } catch (err) {
      setMatches([]);
    } finally {
      setLoading(false);
    }
  }

  // atualiza partidas quando competição ou data muda
  useEffect(() => {
    fetchMatch(selectedDate);
  }, [competition, selectedDate]);

  return (
    <>
      <div className={styles.alertMatches}>
        <div className={styles.infosRound}>
          <div className={styles.dateWrapper}>
            <h1 onClick={() => setOpenCalendar((v) => !v)}>
              <Icon icon={"calendar"} /> {formattedDateForDisplay(selectedDate)}
            </h1>

            {openCalendar && (
              <SelectDate
                date={selectedDate}
                availableDates={fetchDate} // função async
                setDate={(d) => {
                  setSelectedDate(d);
                  setOpenCalendar(false);
                }}
                onClose={() => setOpenCalendar(false)}
              />
            )}
          </div>
        </div>

        <div className={styles.alertRight}>
          <div className={styles.competitionWrapper}>
            <div
              className={styles.titleCompetition}
              onClick={() => setOpenSetCompetition((v) => !v)}
            >
              <h1>{competition.name}</h1>
              <Icon icon={"down"} />
            </div>

            {openSetCompetition && (
              <SelectCompetition
                setValue={(c) => {
                  setCompetition(c);
                  setOpenSetCompetition(false);
                }}
                onClose={() => setOpenSetCompetition(false)}
                values={valuesCompetition}
              />
            )}
          </div>
        </div>
      </div>

      {loading && <p>Carregando...</p>}

      {!loading &&
        matches.map((match) => <Matches key={match.matchId} match={match} />)}
    </>
  );
}
