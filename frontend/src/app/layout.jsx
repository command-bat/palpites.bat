"use client";
import { useEffect, useState, useRef } from "react";
import "./globals.css";
import Header from "../components/header";
import Sidebar from "../components/sidebar";
import styles from "@/app/layout.module.css";
import Cookies from "js-cookie";
import { AuthProvider } from "../auth/AuthContext";
import MainPage from "../components/pages/index";

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
    <AuthProvider>
      <html lang="pt-br">
        {/* <head></head> */}
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
          <MainPage page={page} />
        </body>
      </html>
    </AuthProvider>
  );
}
