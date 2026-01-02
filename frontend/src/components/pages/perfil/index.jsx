"use client";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./index.module.css";

import UserId from "../userid";
import Palpites from "../../game";
import Comparador from "../../comparator_card";
import Icon from "../../icon";
import Select from "../../popups/select_dropdown";
import { useAuth } from "../../../auth/useAuth";

export default function Perfil() {
  const { user: loggedUser } = useAuth();
  const searchParams = useSearchParams();

  const profileId = searchParams.get("id");

  const [page, setPage] = useState({ name: "Perfil", code: "perfil" });
  const [openSelectPage, setOpenSelectPage] = useState(false);

  const [profileUser, setProfileUser] = useState(null);
  const [stats, setStats] = useState(null);

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  const LINK = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3030";

  const valuesSelect = [
    { name: "Perfil", code: "perfil" },
    { name: "Palpites", code: "palpites" },
    { name: "Comparador", code: "comparador" },
  ];

  /* ============================
     🔹 NORMALIZA USER
  ============================ */
  function normalizeUser(user) {
    if (!user) return null;
    return {
      ...user,
      _id: user._id || user.id,
    };
  }

  /* ============================
     🔹 DEFINIR USUÁRIO DO PERFIL
  ============================ */
  useEffect(() => {
    if (profileId) {
      fetchUserById(profileId);
    } else if (loggedUser) {
      setProfileUser(normalizeUser(loggedUser));
    }
  }, [profileId, loggedUser]);

  async function fetchUserById(userId) {
    try {
      const res = await fetch(`${LINK}/users/${userId}`, {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Erro ao buscar usuário");

      const data = await res.json();
      setProfileUser(normalizeUser(data));
    } catch (err) {
      console.error(err);
      setProfileUser(null);
    }
  }

  /* ============================
     🔹 STATS DO USUÁRIO EXIBIDO
  ============================ */
  useEffect(() => {
    if (!profileUser?._id) return;
    fetchStats(profileUser._id);
  }, [profileUser?._id]);

  async function fetchStats(userId) {
    try {
      const res = await fetch(`${LINK}/users/stats/${userId}`, {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Erro ao buscar stats");

      const data = await res.json();
      setStats({
        correct: data.correct ?? 0,
        wrong: data.wrong ?? 0,
        pending: data.pending ?? 0,
      });
    } catch (err) {
      console.error(err);
      setStats({ correct: 0, wrong: 0, pending: 0 });
    }
  }

  /* ============================
     🔹 USER + STATS
  ============================ */
  const userWithStats = useMemo(() => {
    if (!profileUser || !stats) return null;
    return { ...profileUser, stats };
  }, [profileUser, stats]);

  /* ============================
     🔹 PALPITES (FUNCIONA PARA QUALQUER USER)
  ============================ */
  useEffect(() => {
    if (page.code !== "palpites") return;

    const targetUserId = profileId ?? loggedUser?._id;
    if (!targetUserId) return;

    fetchPalpitesEPartidas(targetUserId);
  }, [
    page.code, // string
    profileId, // string | null
    loggedUser?._id, // string | undefined
  ]);

  async function fetchPalpitesEPartidas(userId) {
    setLoading(true);
    try {
      // 1️⃣ Busca palpites do usuário
      const resPalpites = await fetch(`${LINK}/palpite/user/${userId}`, {
        credentials: "include",
      });
      if (!resPalpites.ok) throw new Error("Erro ao buscar palpites");

      const { data: palpites } = await resPalpites.json();
      if (!Array.isArray(palpites)) {
        setMatches([]);
        return;
      }

      // 2️⃣ Busca partidas completas em paralelo
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

  /* ============================
     🔹 RENDER
  ============================ */
  function renderPage() {
    switch (page.code) {
      case "perfil":
        if (!userWithStats) return <p>Carregando perfil...</p>;
        return <UserId user={userWithStats} />;

      case "palpites":
        if (loading) return <p>Carregando palpites...</p>;
        if (!matches.length) return <p>Nenhum palpite encontrado.</p>;

        return matches.map((match) => (
          <Palpites key={match.matchId} match={match} user={profileUser} />
        ));

      case "comparador":
        return <Comparador userFixed={profileUser} fixed />;

      default:
        return null;
    }
  }

  return (
    <div className={styles.perfilPage}>
      <div className={styles.headerPerfil}>
        <div className={styles.options}>
          <h1 onClick={() => setPage({ name: "Perfil", code: "perfil" })}>
            <Icon icon="perfil" /> Perfil
          </h1>

          <h1 onClick={() => setPage({ name: "Palpites", code: "palpites" })}>
            <Icon icon="palpites" /> Palpites
          </h1>

          <h1
            onClick={() => setPage({ name: "Comparador", code: "comparador" })}
          >
            <Icon icon="comparador" /> Comparador
          </h1>
        </div>

        <div className={styles.select}>
          <div
            className={styles.textSelect}
            onClick={() => setOpenSelectPage((v) => !v)}
          >
            <Icon icon={page.code} />
            <h1>{page.name}</h1>
            <Icon icon="down" />
          </div>

          {openSelectPage && (
            <Select
              values={valuesSelect}
              setValue={(value) => {
                setPage(value);
                setOpenSelectPage(false);
              }}
              onClose={() => setOpenSelectPage(false)}
            />
          )}
        </div>
      </div>

      {renderPage()}
    </div>
  );
}
