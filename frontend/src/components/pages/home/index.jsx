"use client";
import { useEffect, useState } from "react";
import styles from "./index.module.css";
import Matches from "../../game";
import Icon from "../../icon";
import SelectCompetition from "../../popups/select_competition";

export default function Home() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [competition, setCompetition] = useState({
    name: "Brasileirão",
    code: "BSA",
  });
  const [openSetCompetition, setOpenSetCompetition] = useState(false);

  // valor usado no fetch
  const [limit, setLimit] = useState(10);

  const LINK = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3030";

  const statusRound = {
    icon: ["circleCheck", "circleX", "circleClock"],
    text: ["palpitar", "rolado", "finalizou"],
  };
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
          <h1>Rodada #11</h1>{" "}
          {/* fazer virar um select tambem (igual ao competition) */}
          <p>24 dezembro • 15:30 </p>
        </div>
        <div className={styles.alertRight}>
          <div
            className={styles.titleCompetition}
            onClick={() => setOpenSetCompetition(true)}
          >
            {competition.name}
          </div>
          <div className={styles.alertRound}>
            <div className={styles.icon}>
              <Icon icon={statusRound.icon[0]} /* trocar o valor */ />
            </div>
            <p /* trocar o valor */>{statusRound.text[0]}</p>
          </div>
        </div>
      </div>

      {loading && <p>Carregando...</p>}

      {!loading &&
        matches.map((match) => <Matches key={match.matchId} match={match} />)}
      {openSetCompetition && (
        <SelectCompetition
          onClose={() => setOpenSetCompetition(false)}
          setCompetition={setCompetition}
        />
      )}
    </>
  );
}
