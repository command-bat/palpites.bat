"use client";
import Link from "next/link";
import styles from "./index.module.css";
import { useEffect, useState, useRef } from "react";
import {
  FaHouse,
  FaSquareCheck,
  FaUserGroup,
  FaRegClock,
  FaChartSimple,
  FaUser,
  FaMoon,
  FaSun,
} from "react-icons/fa6";

export default function header({
  title = "home",
  icon = <FaHouse />,
  setShowSidebar,
}) {
  const [chosenDarkMode, setChosenDarkMode] = useState(false);

  // const HeaderLinks = [
  //   {
  //     icon: <img width="24" src="/placeholder/icon.jpg" alt="" />,
  //     label: "Palpites.bat",
  //     href: "/",
  //   },
  //   {
  //     label: "Admin",
  //     href: "/admin",
  //   },
  // ];

  // {
  //   HeaderLinks.map(({ label, href, icon }) => (
  //     <Link href={href} key={href}>
  //       {icon ? icon : ""}
  //       <span>{label}</span>
  //     </Link>
  //   ));
  // }

  // className={styles.}

  return (
    <>
      <header className={styles.header}>
        <nav className={styles.left}>
          <div className={styles.backgroundTitle}>
            <span className={styles.title}>
              {icon}
              {title}
            </span>
          </div>
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
            {chosenDarkMode ? <FaMoon /> : <FaSun />}
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
