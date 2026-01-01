"use client";
import { useEffect, useState } from "react";
import Matches from "../../game";

export default function Palpites() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const LINK = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3030";

  async function fetchPalpitesEPartidas() {
    setLoading(true);

    try {
      // 1️⃣ Busca palpites do usuário
      const resPalpites = await fetch(`${LINK}/palpite/user`, {
        credentials: "include",
      });
      if (!resPalpites.ok) throw new Error("Not authenticated");

      const palpitesResponse = await resPalpites.json();
      const palpites = Array.isArray(palpitesResponse.data)
        ? palpitesResponse.data
        : [];

      // 2️⃣ Busca todas as partidas em paralelo
      const matchesData = await Promise.all(
        palpites.map(async (palpite) => {
          const resMatch = await fetch(
            `${LINK}/matches/${palpite.matchId}?teams=true`,
            {
              credentials: "include",
            }
          );

          if (!resMatch.ok) return null;

          const match = await resMatch.json();

          // 3️⃣ Injeta o palpite no objeto da partida
          return {
            ...match,
            hasPalpite: true,
            userPalpite: palpite.palpite,
          };
        })
      );

      // 4️⃣ Remove possíveis nulls
      setMatches(matchesData.filter(Boolean));
    } catch (err) {
      console.error(err);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPalpitesEPartidas();
  }, []);

  if (loading) {
    return <div>Carregando palpites...</div>;
  }

  return (
    <>
      {matches.map((match) => (
        <Matches key={match.matchId} match={match} />
      ))}
    </>
  );
}
