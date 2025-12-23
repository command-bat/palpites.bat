"use client";
import Link from "next/link";
import styles from "./index.module.css";
import { useEffect, useState, useRef } from "react";
import Icon from "../icon";
import Cookies from "js-cookie";
import LoginPopup from "../popups/login_register";
import { useAuth } from "../../auth/useAuth";

export default function header({ setShowSidebar, showSidebar }) {
  const [title, setTitle] = useState("home");
  const [chosenDarkMode, setChosenDarkMode] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    const interval = setInterval(() => {
      const page = Cookies.get("page") || "home";
      setTitle((prev) => (prev !== page ? page : prev));
    }, 650);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const savedTheme = Cookies.get("theme");

    if (savedTheme) {
      document.documentElement.dataset.theme = savedTheme;
      setChosenDarkMode(savedTheme === "dark");
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setChosenDarkMode(prefersDark);
    }
  }, []);

  useEffect(() => {
    if (chosenDarkMode === null) return;

    const theme = chosenDarkMode ? "dark" : "light";
    document.documentElement.dataset.theme = theme;
    Cookies.set("theme", theme, { expires: 365 });
  }, [chosenDarkMode]);

  useEffect(() => {
    const media = window.matchMedia(
      "(width <= 767px) and (orientation: portrait)"
    );

    const update = () => {
      setIsDesktop(!media.matches);
    };

    update();
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
            {!chosenDarkMode ? <Icon icon={"moon"} /> : <Icon icon={"sun"} />}
          </button>
          {loading === false ? (
            user === null ? (
              <>
                {showLogin && (
                  <LoginPopup onClose={() => setShowLogin(false)} />
                )}
                <div
                  className={styles.btn_login}
                  onClick={() => setShowLogin(true)}
                >
                  <p>Login</p>
                </div>
              </>
            ) : (
              <>
                <div>
                  <img
                    src={user?.avatar}
                    alt="useravatar"
                    style={{ width: "34px" }}
                  />
                </div>
                <div onClick={logout} className={styles.btn_login}>
                  <p>Logout</p>
                </div>
              </>
            )
          ) : (
            <></>
          )}
        </nav>
      </header>
    </>
  );
}
