"use client";
import { useEffect, useState } from "react";
import styles from "./index.module.css";
import Matches from "../../game";
import Icon from "../../icon";
import SelectCompetition from "../../popups/select_competition";
import SelectDate from "../../popups/select_calendar";

export default function Home() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [openCalendar, setOpenCalendar] = useState(false);

  const [competition, setCompetition] = useState({
    name: "Brasileirão",
    code: "BSA",
  });
  const [openSetCompetition, setOpenSetCompetition] = useState(false);

  // valor usado no fetch
  const [limit, setLimit] = useState(10);

  const LINK = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3030";

  const formattedDate = `${selectedDate.getDate()} ${selectedDate.toLocaleDateString(
    "pt-BR",
    { month: "short" }
  )} ${selectedDate.getFullYear()}`;

  async function fetchMatch() {
    setLoading(true);
    try {
      const res = await fetch(
        `${LINK}/matches/?limit=${limit}&teams=true&season=2025&competition=${competition.code}`,
        {
          credentials: "include",
        }
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

  useEffect(() => {
    fetchMatch();
  }, [limit, competition]);

  return (
    <>
      <div className={styles.alertMatches}>
        <div className={styles.infosRound}>
          <div className={styles.dateWrapper}>
            <h1 onClick={() => setOpenCalendar((v) => !v)}>
              <Icon icon={"calendar"} />
              {formattedDate}
            </h1>

            {openCalendar && (
              <SelectDate
                date={selectedDate}
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
                  setCompetition={(c) => {
                    setCompetition(c);
                    setOpenSetCompetition(false);
                  }}
                  onClose={() => setOpenSetCompetition(false)}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {loading && <p>Carregando...</p>}

      {!loading &&
        matches.map((match) => <Matches key={match.matchId} match={match} />)}
    </>
  );
}
