"use client";
import styles from "./index.module.css";
import { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import Icon from "../icon";

export default function sidebar({
  page = "home",
  showSidebar = false,
  setShowSidebar,
  setPage,
  setIcon,
}) {
  const [chosenTargetPage, setChosenTargetPage] = useState("home");
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    let lastPage = Cookies.get("page") || "home";

    const interval = setInterval(() => {
      const page = Cookies.get("page") || "home";
      setChosenTargetPage(page);
      if (page !== lastPage) {
        setShowSidebar((prev) => !prev);

        lastPage = page;
      }
    }, 500);

    return () => clearInterval(interval);
  }, [setShowSidebar]);

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
  // className={styles.}

  return (
    <>
      <div
        className={
          isDesktop
            ? styles.desktop
            : styles.mobile + " " + (showSidebar ? styles.open : styles.close)
        }
      >
        <div className={styles.sidebar}>
          <div>
            <input
              checked={chosenTargetPage == "home"}
              type={"radio"}
              name={"sidebarSelect"}
              id={"sidebarSelectHome"}
              value={"home"}
              onChange={() => {
                setChosenTargetPage("home");
                setPage("home");
                Cookies.set("page", "home");
              }}
            />
            <label htmlFor="sidebarSelectHome">
              <div>
                <Icon icon={"home"} className={styles.icon} />
              </div>
              <span>Home</span>
            </label>
          </div>

          <div>
            <input
              checked={chosenTargetPage == "palpites"}
              type={"radio"}
              name={"sidebarSelect"}
              id={"sidebarSelectGuesses"}
              value={"palpites"}
              onChange={() => {
                setChosenTargetPage("palpites");
                setPage("palpites");
                Cookies.set("page", "palpites");
              }}
            />
            <label htmlFor="sidebarSelectGuesses">
              <div>
                <Icon icon={"palpites"} className={styles.icon} />
              </div>
              <span>Palpites</span>
            </label>
          </div>
          <div>
            <input
              checked={chosenTargetPage == "amigos"}
              type={"radio"}
              name={"sidebarSelect"}
              id={"sidebarSelectFriends"}
              value={"amigos"}
              onChange={() => {
                setChosenTargetPage("amigos");
                setPage("amigos");
                Cookies.set("page", "amigos");
              }}
            />
            <label htmlFor="sidebarSelectFriends">
              <div>
                <Icon icon={"amigos"} className={styles.icon} />
              </div>
              <span>Amigos</span>
            </label>
          </div>
          <div>
            <input
              checked={chosenTargetPage == "historico"}
              type={"radio"}
              name={"sidebarSelect"}
              id={"sidebarSelectHistory"}
              value={"historico"}
              onChange={() => {
                setChosenTargetPage("historico");
                setPage("historico");
                Cookies.set("page", "historico");
              }}
            />
            <label htmlFor="sidebarSelectHistory">
              <div>
                <Icon icon={"historico"} className={styles.icon} />
              </div>
              <span>Historico</span>
            </label>
          </div>
          <div>
            <input
              checked={chosenTargetPage == "comparador"}
              type={"radio"}
              name={"sidebarSelect"}
              id={"sidebarSelectComparator"}
              value={"comparador"}
              onChange={() => {
                setChosenTargetPage("comparador");
                setPage("comparador");
                Cookies.set("page", "comparador");
              }}
            />
            <label htmlFor="sidebarSelectComparator">
              <div>
                <Icon icon={"comparador"} className={styles.icon} />
              </div>
              <span> Comparador</span>
            </label>
          </div>
          <div>
            <input
              checked={chosenTargetPage == "perfil"}
              type={"radio"}
              name={"sidebarSelect"}
              id={"sidebarSelectProfile"}
              value={"perfil"}
              onChange={() => {
                setChosenTargetPage("perfil");
                setPage("perfil");
                Cookies.set("page", "perfil");
              }}
            />
            <label htmlFor="sidebarSelectProfile">
              <div>
                <Icon icon={"perfil"} className={styles.icon} />
              </div>
              <span>Perfil</span>
            </label>
          </div>
        </div>
      </div>
    </>
  );
}
