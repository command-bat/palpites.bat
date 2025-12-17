"use client";
import Link from "next/link";
import styles from "./index.module.css";
import { useEffect, useState, useRef } from "react";
import Icon from "../icon";
import Cookies from "js-cookie";

export default function header({
  title = Cookies.get("page"),
  setShowSidebar,
  showSidebar,
}) {
  const [chosenDarkMode, setChosenDarkMode] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const media = window.matchMedia(
      "(width <= 767px) and (orientation: portrait)"
    );

    const update = () => {
      setIsDesktop(!media.matches);
    };

    update(); // estado inicial
    media.addEventListener("change", update);

    return () => media.removeEventListener("change", update);
  }, []);

  return (
    <>
      <header className={styles.header}>
        <nav className={styles.left}>
          <button
            className={styles.backgroundTitle}
            disabled={isDesktop}
            onClick={() => {
              setShowSidebar(!showSidebar);
            }}
          >
            <span className={styles.title}>
              <Icon
                icon={isDesktop ? title : !showSidebar ? "menu" : "menuOpen"}
              />
              <span className={styles.titleSpan}>{title}</span>
            </span>
          </button>
        </nav>
        <nav className={styles.center}>
          <div>
            <img
              src="/placeholder/icon.jpg"
              alt=""
              className={styles.iconSite}
            />
            <span className={styles.title}>Palpites.bat</span>
          </div>
        </nav>
        <nav className={styles.menulogin + " " + styles.right}>
          <button
            className={styles.switchTheme}
            onClick={() => {
              setChosenDarkMode(!chosenDarkMode);
            }}
          >
            {chosenDarkMode ? <Icon icon={"moon"} /> : <Icon icon={"sun"} />}
          </button>
          <div className={styles.btn_login}>
            <p>Login</p>
          </div>
          <div className={styles.btn_register}>
            <p>Registrar</p>
          </div>
        </nav>
      </header>
    </>
  );
}
