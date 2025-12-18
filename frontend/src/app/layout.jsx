"use client";
import { useEffect, useState, useRef } from "react";
import "./globals.css";
import Header from "../components/header";
import Sidebar from "../components/sidebar";
import styles from "@/app/layout.module.css";
import Cookies from "js-cookie";
export default function RootLayout({ children }) {
  const [page, setPage] = useState(
    Cookies.get("page") ? Cookies.get("page") : "home"
  );
  const [icon, setIcon] = useState(Cookies.get("icon"));
  const [showSidebar, setShowSidebar] = useState(false);

  const capitalize = (str) =>
    str ? str.substring(0, 1).toUpperCase() + str.substring(1) : "";

  useEffect(() => {
    document.title = `Palpites.bat${page ? " - " + capitalize(page) : ""}`;
  }, [page]);
  return (
    <html lang="pt-br">
      <head></head>
      <body className={styles.body}>
        <Header
          icon={icon}
          setShowSidebar={setShowSidebar}
          showSidebar={showSidebar}
        />
        <Sidebar
          setPage={setPage}
          setIcon={setIcon}
          setShowSidebar={setShowSidebar}
          showSidebar={showSidebar}
        />
        <div
          style={{
            top: "68px",
            left: "46px",
            position: "absolute",
            zIndex: "-10",
          }}
        >
          {children}
        </div>
        <div> roda pé </div>
      </body>
    </html>
  );
}
