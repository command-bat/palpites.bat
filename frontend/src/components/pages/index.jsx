"use client";
import styles from "./index.module.css";
import Home from "./home";
import Palpites from "./palpites";
import Amigos from "./amigos";
import Historico from "./historico";
import Comparador from "./comparador";
import Perfil from "./perfil";
import Admin from "./admin";

export default function MainPage({ page, setPage, setSelect }) {
  const pages = {
    home: <Home setPage={setPage} />,
    palpites: <Palpites setPage={setPage} />,
    amigos: <Amigos setPage={setPage} startSelect={setSelect} />,
    historico: <Historico setPage={setPage} />,
    comparador: <Comparador setPage={setPage} />,
    perfil: <Perfil setPage={setPage} />,
    admin: <Admin />,
  };

  return <div className={styles.page}>{pages[page] || null}</div>;
}
