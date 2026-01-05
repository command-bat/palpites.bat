"use client";
import { useEffect, useState } from "react";
import styles from "./index.module.css";
import Icon from "../../icon";
import SelectFriends from "../../popups/select_dropdown";
import Friend from "../../friend";
import Alert from "../../popups/alert";

export default function Amigos({
  startSelect = { name: "Amigos", code: "friends" },
  setPage,
}) {
  const [openSelect, setOpenSelect] = useState(false);
  const [loading, setLoading] = useState(true);
  const [friends, setFriends] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [alert, setAlert] = useState(null);

  const [select, setSelect] = useState(startSelect);

  const LINK = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3030";

  const valuesFriend = [
    { name: "Amigos", code: "friends" },
    { name: "Solicitações recebidas", code: "received" },
    { name: "Solicitações enviadas", code: "send" },
  ];

  async function fetchFriends() {
    setLoading(true);

    try {
      const resfriends = await fetch(`${LINK}/friends`, {
        credentials: "include",
      });

      if (!resfriends.ok) throw new Error("Not authenticated");

      const friends = await resfriends.json(); // ARRAY direto

      setFriends(friends);
    } catch (err) {
      console.error(err);
      setFriends([]);
    } finally {
      setLoading(false);
    }
  }

  async function fetchOrders(value) {
    setLoading(true);

    try {
      const resfriends = await fetch(`${LINK}/friends/orders/${value}`, {
        credentials: "include",
      });

      if (!resfriends.ok) throw new Error("Not authenticated");

      const friends = await resfriends.json(); // ARRAY direto

      setFriends(friends);
    } catch (err) {
      console.error(err);
      setFriends([]);
    } finally {
      setLoading(false);
    }
  }

  async function fetchAnswer(answers) {
    setLoading(true);

    try {
      for (const answer of answers) {
        const res = await fetch(
          `${LINK}/friends/${
            answer.value === "canceladd"
              ? "canceladd/" + answer.userId
              : "orders/" + answer.userId + "/" + answer.value
          }`,
          {
            method: "POST",
            credentials: "include",
          }
        );

        const data = await res.json();

        if (!res.ok) {
          setAlert({ message: data.message || "Erro", type: "error" });
          return;
        }

        setAlert({ message: data.message, type: "success" });
      }

      await refreshCurrentList(); // 🔥 ATUALIZA A LISTA
    } catch {
      setAlert({ message: "Erro inesperado", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  async function sendFriendRequest(value) {
    const normalizedValue = normalizeId(value.trim());

    try {
      const res = await fetch(
        `${LINK}/friends/add/${encodeURIComponent(normalizedValue)}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setAlert({ message: data.message || "Erro", type: "error" });
        return;
      }

      setAlert({ message: data.message, type: "success" });
      setSearch("");
      await refreshCurrentList();
    } catch {
      setAlert({ message: "Erro ao enviar pedido", type: "error" });
    }
  }

  function normalizeId(value) {
    return value.startsWith("#") ? value.slice(1) : value;
  }

  async function refreshCurrentList() {
    if (select.code === "friends") await fetchFriends();
    if (select.code === "send" || select.code === "received") {
      await fetchOrders(select.code);
    }
  }

  function handleFriendAnswer(answerObj) {
    // answerObj = { value, userId }

    const payload = [
      {
        value: answerObj.value,
        userId: answerObj.userId,
      },
    ];

    fetchAnswer(payload);
  }

  useEffect(() => {
    fetchFriends();
  }, []);

  useEffect(() => {
    if (select.code === "friends") fetchFriends();
    if (select.code === "send" || select.code === "received")
      fetchOrders(select.code);
  }, [select]);
  // filtra em tempo real
  useEffect(() => {
    const value = search.trim().toLowerCase();
    const normalizedSearch = normalizeId(value);

    if (!value) {
      setFilteredFriends(friends);
      setNotFound(false);
      return;
    }

    const filtered = friends.filter((friend) => {
      return (
        friend.name?.toLowerCase().includes(value) ||
        friend._id?.toLowerCase().includes(normalizedSearch)
      );
    });

    setFilteredFriends(filtered);
    setNotFound(filtered.length === 0);
  }, [search, friends]);

  return (
    <>
      <div className={styles.subHeader}>
        <div className={styles.left}>
          <div className={styles.finder}>
            <Icon icon={"find"} />
            <input
              type="search"
              placeholder="Buscar amigo ou ID"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className={styles.right}>
          <button
            className={styles.dropdown}
            onClick={() => setOpenSelect((v) => !v)}
          >
            {select.name}
            <Icon icon={"down"} />
          </button>
          {openSelect && (
            <SelectFriends
              setValue={(c) => {
                setSelect(c);
                setOpenSelect(false);
              }}
              onClose={() => setOpenSelect(false)}
              values={valuesFriend}
            />
          )}
        </div>
      </div>

      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

      <div className={styles.list}>
        {!loading &&
          filteredFriends.map((friend) => (
            <Friend
              key={friend._id}
              friend={friend}
              options={
                select.code === "friends"
                  ? []
                  : select.code === "received"
                  ? [
                      { text: "Aceitar", color: "green", answer: "accept" },
                      { text: "Recusar", color: "red", answer: "reject" },
                    ]
                  : select.code === "send"
                  ? [
                      {
                        text: "Cancelar pedido",
                        color: "gray",
                        answer: "canceladd",
                      },
                    ]
                  : []
              }
              onAnswer={handleFriendAnswer}
              setPage={setPage}
            />
          ))}

        {notFound && search && (
          <div
            className={styles.addFriend}
            onClick={() => sendFriendRequest(search)}
          >
            <Icon icon={"plus"} /> Adicionar "{search}"
          </div>
        )}
      </div>
    </>
  );
}
