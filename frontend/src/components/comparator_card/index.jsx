"use client";
import { useEffect, useState } from "react";
import styles from "./index.module.css";
import Select from "../popups/select_dropdown";
import Icon from "../icon";
import { useAuth } from "../../auth/useAuth";

export default function ComparatorCard() {
  const [select, setSelect] = useState(null);
  const [select2, setSelect2] = useState(null);
  const [openSelect, setOpenSelect] = useState(false);
  const [openSelect2, setOpenSelect2] = useState(false);
  const [friends, setFriends] = useState([]);
  const [valuesFriend, setValuesFriend] = useState([]);
  const [palpites, setPalpites] = useState({
    correct: 0,
    wrong: 0,
    pending: 0,
  });
  const [palpites2, setPalpites2] = useState({
    correct: 0,
    wrong: 0,
    pending: 0,
  });
  const { user } = useAuth();

  const LINK = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3030";

  async function fetchFriends() {
    try {
      const res = await fetch(`${LINK}/friends`, { credentials: "include" });
      if (!res.ok) throw new Error("Not authenticated");
      const data = await res.json();
      setFriends(data);
    } catch (err) {
      console.error(err);
      setFriends([]);
    }
  }

  async function fetchStats(userId, setStats) {
    try {
      const res = await fetch(`${LINK}/users/stats/${userId}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Erro ao buscar stats");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error(err);
      setStats({ correct: 0, wrong: 0, pending: 0 });
    }
  }

  // Inicializa usuário logado
  useEffect(() => {
    if (!user) return;

    setSelect({ name: user.name, code: user._id, avatar: user.avatar });

    fetchFriends();
  }, [user]);

  // Inicializa select2 quando friends estiverem carregados
  useEffect(() => {
    if (friends.length > 0) {
      setSelect2({
        name: friends[0].name,
        code: friends[0]._id,
        avatar: friends[0].avatar,
      });
    }
  }, [friends]);

  // Monta dropdown
  useEffect(() => {
    if (!user) return;

    const values = [
      { name: `${user.name} (Você)`, code: user._id, avatar: user.avatar },
      ...friends.map((f) => ({ name: f.name, code: f._id, avatar: f.avatar })),
    ];
    setValuesFriend(values);
  }, [friends, user]);

  // Busca estatísticas quando troca seleção
  useEffect(() => {
    if (!select?.code || select.code === "compare") {
      setPalpites({ correct: 0, wrong: 0, pending: 0 });
      return;
    }
    fetchStats(select.code, setPalpites);
  }, [select]);

  useEffect(() => {
    if (!select2?.code || select2.code === "compare") {
      setPalpites2({ correct: 0, wrong: 0, pending: 0 });
      return;
    }
    fetchStats(select2.code, setPalpites2);
  }, [select2]);

  const total = palpites.correct + palpites.wrong + palpites.pending;
  const total2 = palpites2.correct + palpites2.wrong + palpites2.pending;

  const finished = palpites.correct + palpites.wrong;
  const finished2 = palpites2.correct + palpites2.wrong;

  const accuracy =
    finished > 0 ? ((palpites.correct / finished) * 100).toFixed(1) : "—";
  const accuracy2 =
    finished2 > 0 ? ((palpites2.correct / finished2) * 100).toFixed(1) : "—";

  if (!select || !select2) return null;

  return (
    <div className={styles.card}>
      <div className={styles.left}>
        <div className={styles.user}>
          <img src={select.avatar} alt={select.name} />
          <p>{select.name}</p>
        </div>

        <div className={styles.statisticBody}>
          <div
            className={styles.statisticBar}
            style={{ width: `${(100 / finished) * palpites.correct}% ` }}
          ></div>
        </div>

        <div className={styles.statistic}>
          <h1>
            {accuracy}
            {accuracy !== "—" && "%"}
          </h1>
          <p>Acertos</p>
        </div>

        <div className={styles.statisticDetails}>
          <p className={styles.correct} title="Acertos">
            <Icon icon={"palpites"} /> {palpites.correct}/{total}
          </p>
          <p className={styles.wrong} title="Errados">
            <Icon icon={"close"} /> {palpites.wrong}/{total}
          </p>
          <p className={styles.pending} title="Aguarando">
            <Icon icon={"HourglassHalf"} /> {palpites.pending}/{total}
          </p>
        </div>

        <div className={styles.dropdownDiv}>
          <button
            className={styles.dropdown}
            onClick={() => setOpenSelect((v) => !v)}
          >
            {select.name} <Icon icon="down" />
          </button>
          {openSelect && (
            <Select
              values={valuesFriend}
              setValue={(v) => {
                setSelect(v);
                setOpenSelect(false);
              }}
              onClose={() => setOpenSelect(false)}
            />
          )}
        </div>
      </div>
      <div className={styles.center}>
        <p className={styles.vs}>VS</p>{" "}
      </div>
      <div className={styles.right}>
        <div className={styles.user}>
          <img src={select2.avatar} alt={select2.name} />
          <p>{select2.name}</p>
        </div>

        <div className={styles.statisticBody}>
          <div
            className={styles.statisticBar}
            style={{ width: `${(100 / finished2) * palpites2.correct}% ` }}
          ></div>
        </div>

        <div className={styles.statistic}>
          <h1>
            {accuracy2}
            {accuracy2 !== "—" && "%"}
          </h1>
          <p>Acertos</p>
        </div>

        <div className={styles.statisticDetails}>
          <p className={styles.correct} title="Acertos">
            <Icon icon={"palpites"} /> {palpites2.correct}/{total2}
          </p>
          <p className={styles.wrong} title="Errados">
            <Icon icon={"close"} /> {palpites2.wrong}/{total2}
          </p>
          <p className={styles.pending} title="Aguarando">
            <Icon icon={"HourglassHalf"} /> {palpites2.pending}/{total2}
          </p>
        </div>

        <div className={styles.dropdownDiv}>
          <button
            className={styles.dropdown}
            onClick={() => setOpenSelect2((v) => !v)}
          >
            {select2.name} <Icon icon="down" />
          </button>
          {openSelect2 && (
            <Select
              values={valuesFriend}
              setValue={(v) => {
                setSelect2(v);
                setOpenSelect2(false);
              }}
              onClose={() => setOpenSelect2(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
