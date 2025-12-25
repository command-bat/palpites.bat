"use client";
import { useEffect, useState } from "react";
import styles from "./index.module.css";
import Matches from "../../game";

export default function Home() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // valor digitado no input
  const [inputValue, setInputValue] = useState(10);

  // valor usado no fetch
  const [limit, setLimit] = useState(10);

  const LINK = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3030";

  async function fetchMatch() {
    setLoading(true);
    try {
      const res = await fetch(`${LINK}/matches/?limit=${limit}&teams=true`, {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Not authenticated");

      const data = await res.json();
      setMatches(Array.isArray(data) ? data : []);
    } catch (err) {
      setMatches([]);
    } finally {
      setLoading(false);
    }
  }

  // 🔥 agora só dispara quando "limit" muda
  useEffect(() => {
    fetchMatch();
  }, [limit]);

  function matchesSubmit(e) {
    e.preventDefault();
    setLimit(inputValue); // 🔥 dispara o fetch
  }

  return (
    <>
      <div className={styles.alertMatches}>
        <p>Jogos:</p>

        <form onSubmit={matchesSubmit}>
          <input
            type="number"
            min={1}
            value={inputValue}
            onChange={(e) => setInputValue(Number(e.target.value))}
          />

          <input type="submit" value="Aplicar" />
        </form>
      </div>

      {loading && <p>Carregando...</p>}

      {!loading &&
        matches.map((match) => <Matches key={match.matchId} match={match} />)}
    </>
  );
}
