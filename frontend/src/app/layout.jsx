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
    document.title = `Palpites.bat - ${capitalize(page)}`;
  }, [page]);
  return (
    <html lang="pt-br">
      <head>
        <link rel="icon" type="image/jpg" href="/placeholder/icon.jpg"></link>
      </head>
      <body className={styles.body}>
        <Header
          icon={icon}
          setShowSidebar={setShowSidebar}
          showSidebar={showSidebar}
        />
        <Sidebar
          showSidebar={showSidebar}
          setPage={setPage}
          setIcon={setIcon}
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
