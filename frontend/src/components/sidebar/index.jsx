"use client";
import {
  FaSquareCheck,
  FaUserGroup,
  FaRegClock,
  FaChartSimple,
  FaUser,
} from "react-icons/fa6";
import styles from "./index.module.css";
import { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import Icon from "../icon";

export default function sidebar({
  page = "home",
  showSidebar = false,
  setPage,
  setIcon,
}) {
  const [chosenTargetPage, setChosenTargetPage] = useState(Cookies.get("page"));

  // className={styles.}

  return (
    <>
      <div className={showSidebar ? styles.mobile : styles.desktop}>
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
              checked={chosenTargetPage == "guesses"}
              type={"radio"}
              name={"sidebarSelect"}
              id={"sidebarSelectGuesses"}
              value={"guesses"}
              onChange={() => {
                setChosenTargetPage("guesses");
                setPage("palpites");
                Cookies.set("page", "guesses");
              }}
            />
            <label htmlFor="sidebarSelectGuesses">
              <div>
                <Icon icon={"guesses"} className={styles.icon} />
              </div>
              <span>Palpites</span>
            </label>
          </div>
          <div>
            <input
              checked={chosenTargetPage == "friends"}
              type={"radio"}
              name={"sidebarSelect"}
              id={"sidebarSelectFriends"}
              value={"friends"}
              onChange={() => {
                setChosenTargetPage("friends");
                setPage("amigos");
                Cookies.set("page", "friends");
              }}
            />
            <label htmlFor="sidebarSelectFriends">
              <div>
                <Icon icon={"friends"} className={styles.icon} />
              </div>
              <span>Amigos</span>
            </label>
          </div>
          <div>
            <input
              checked={chosenTargetPage == "history"}
              type={"radio"}
              name={"sidebarSelect"}
              id={"sidebarSelectHistory"}
              value={"history"}
              onChange={() => {
                setChosenTargetPage("history");
                setPage("historico");
                Cookies.set("page", "history");
              }}
            />
            <label htmlFor="sidebarSelectHistory">
              <div>
                <Icon icon={"history"} className={styles.icon} />
              </div>
              <span>Historico</span>
            </label>
          </div>
          <div>
            <input
              checked={chosenTargetPage == "comparator"}
              type={"radio"}
              name={"sidebarSelect"}
              id={"sidebarSelectComparator"}
              value={"comparator"}
              onChange={() => {
                setChosenTargetPage("comparator");
                setPage("comparador");
                Cookies.set("page", "comparator");
              }}
            />
            <label htmlFor="sidebarSelectComparator">
              <div>
                <Icon icon={"comparator"} className={styles.icon} />
              </div>
              <span> Comparador</span>
            </label>
          </div>
          <div>
            <input
              checked={chosenTargetPage == "profile"}
              type={"radio"}
              name={"sidebarSelect"}
              id={"sidebarSelectProfile"}
              value={"profile"}
              onChange={() => {
                setChosenTargetPage("profile");
                setPage("perfil");
                Cookies.set("page", "profile");
              }}
            />
            <label htmlFor="sidebarSelectProfile">
              <div>
                <Icon icon={"profile"} className={styles.icon} />
              </div>
              <span>Perfil</span>
            </label>
          </div>
        </div>
      </div>
    </>
  );
}
