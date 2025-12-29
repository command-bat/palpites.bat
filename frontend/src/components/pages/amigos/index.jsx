"use client";
import { useEffect, useState } from "react";
import styles from "./index.module.css";
import Icon from "../../icon";
import SelectFriends from "../../popups/select_friends";
import Friend from "../../friend";

export default function Amigos() {
  const [openSelect, setOpenSelect] = useState(false);
  const [loading, setLoading] = useState(true);
  const [friends, setFriends] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [notFound, setNotFound] = useState(false);

  const [select, setSelect] = useState({
    name: "Amigos",
    code: "friends",
  });

  const LINK = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3030";

  async function fetchFriends() {
    setLoading(true);

    try {
      const resfriends = await fetch(`${LINK}/friends`, {
        credentials: "include",
      });

      if (!resfriends.ok) throw new Error("Not authenticated");

      const friends = await resfriends.json(); // ARRAY direto

      setFriends(friends);
      console.log("amigos:", friends);
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
      console.log("amigos:", friends);
    } catch (err) {
      console.error(err);
      setFriends([]);
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
        alert(data.message || "Usuário não encontrado");
        return;
      }

      alert(data.message);
      setSearch("");
      fetchFriends();
    } catch (err) {
      alert("Erro ao enviar pedido");
    }
  }

  function normalizeId(value) {
    return value.startsWith("#") ? value.slice(1) : value;
  }

  useEffect(() => {
    fetchFriends();
  }, []);

  useEffect(() => {
    if (select.code === "friends") fetchFriends();
    if (select.code === "send" || select.code === "received")
      fetchOrders(select.code);
    console.log(select);
    console.log(friends);
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
            {" "}
            {select.name}
            <Icon icon={"down"} />{" "}
          </button>
          {openSelect && (
            <SelectFriends
              setCompetition={(c) => {
                setSelect(c);
                setOpenSelect(false);
              }}
              onClose={() => setOpenSelect(false)}
            />
          )}
        </div>
      </div>

      <div className={styles.list}>
        {filteredFriends.map((friend) => (
          <Friend
            key={friend._id}
            friend={friend}
            options={
              select.code === "friends"
                ? []
                : select.code === "received"
                ? [
                    { text: "Aceitar", color: "green" },
                    { text: "Recusar", color: "red" },
                  ]
                : select.code === "send"
                ? [{ text: "Cancelar pedido", color: "red" }]
                : []
            }
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
