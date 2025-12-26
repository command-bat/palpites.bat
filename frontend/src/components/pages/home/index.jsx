"use client";
import { useEffect, useState } from "react";
import styles from "./index.module.css";
import Matches from "../../game";
import Icon from "../../icon";

export default function Home() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // valor digitado no input
  const [inputValue, setInputValue] = useState(10);

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
        `${LINK}/matches/?limit=${limit}&teams=true&season=2025&competition=ELC`,
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
  }, [limit]);

  function matchesSubmit(e) {
    e.preventDefault();
    setLimit(inputValue);
  }

  return (
    <>
      <div className={styles.alertMatches}>
        <div className={styles.infosRound}>
          <h1>Rodada Atual #11</h1>
          <p>24 dezembro • 15:30 </p>
        </div>
        <div className={styles.alertRight}>
          <div className={styles.titleCompetition}>Brasileirão</div>
          <div className={styles.alertRound}>
            <div className={styles.icon}>
              <Icon icon={statusRound.icon[0]} /* trocar o valor */ />
            </div>
            <p /* trocar o valor */>{statusRound.text[0]}</p>
          </div>
        </div>
        {/* <p>Jogos:</p>

        <form onSubmit={matchesSubmit}>
          <input
            type="number"
            min={1}
            value={inputValue}
            onChange={(e) => setInputValue(Number(e.target.value))}
          />

          <input type="submit" value="Aplicar" />
        </form> */}
      </div>

      {loading && <p>Carregando...</p>}

      {!loading &&
        matches.map((match) => <Matches key={match.matchId} match={match} />)}
    </>
  );
}
