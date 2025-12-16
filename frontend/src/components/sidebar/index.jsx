"use client";
import {
  FaHouse,
  FaSquareCheck,
  FaUserGroup,
  FaRegClock,
  FaChartSimple,
  FaUser,
} from "react-icons/fa6";
import styles from "./index.module.css";
import { useEffect, useState, useRef } from "react";

export default function sidebar({
  page = "home",
  showSidebar = false,
  setPage,
  setIcon,
}) {
  const [chosenTargetPage, setChosenTargetPage] = useState(page);

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
                setIcon(<FaHouse />);
              }}
            />
            <label htmlFor="sidebarSelectHome">
              <div>
                <FaHouse className={styles.icon} />
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
                setIcon(<FaSquareCheck />);
              }}
            />
            <label htmlFor="sidebarSelectGuesses">
              <div>
                <FaSquareCheck className={styles.icon} />
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
                setIcon(<FaUserGroup />);
              }}
            />
            <label htmlFor="sidebarSelectFriends">
              <div>
                <FaUserGroup className={styles.icon} />
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
                setIcon(<FaRegClock />);
              }}
            />
            <label htmlFor="sidebarSelectHistory">
              <div>
                <FaRegClock className={styles.icon} />
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
                setIcon(<FaChartSimple />);
              }}
            />
            <label htmlFor="sidebarSelectComparator">
              <div>
                <FaChartSimple className={styles.icon} />
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
                setIcon(<FaUser />);
              }}
            />
            <label htmlFor="sidebarSelectProfile">
              <div>
                <FaUser className={styles.icon} />
              </div>
              <span>Perfil</span>
            </label>
          </div>
        </div>
      </div>
    </>
  );
}
