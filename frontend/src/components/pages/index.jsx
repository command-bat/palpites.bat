"use client";
import styles from "./index.module.css";
import Home from "./home";
import Palpites from "./palpites";
import Amigos from "./amigos";
import Historico from "./historico";
import Comparador from "./comparador";
import Perfil from "./perfil";
import Admin from "./admin";

export default function MainPage({ page }) {
  const pages = {
    home: <Home />,
    palpites: <Palpites />,
    amigos: <Amigos />,
    historico: <Historico />,
    comparador: <Comparador />,
    perfil: <Perfil />,
    admin: <Admin />,
  };

  return <div className={styles.page}>{pages[page] || null}</div>;
}
