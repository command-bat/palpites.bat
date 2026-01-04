"use client";
import { useEffect, useState } from "react";
import "./globals.css";
import Header from "../components/header";
import Sidebar from "../components/sidebar";
import styles from "@/app/layout.module.css";
import Cookies from "js-cookie";
import { AuthProvider, useAuth } from "../auth/AuthContext";
import MainPage from "../components/pages/index";
import FriendRequestPopup from "../components/popups/FriendRequest";

/* 🔹 Wrapper interno para poder usar o AuthContext */
function LayoutContent() {
  const [page, setPage] = useState(
    Cookies.get("page") ? Cookies.get("page") : "home"
  );
  const [icon, setIcon] = useState(Cookies.get("icon"));
  const [showSidebar, setShowSidebar] = useState(false);
  const [perfilPage, setPerfilPage] = useState(false);
  const [select, setSelect] = useState();

  const { friendRequests, clearFriendRequests } = useAuth();

  const capitalize = (str) =>
    str ? str.substring(0, 1).toUpperCase() + str.substring(1) : "";

  useEffect(() => {
    document.title = `Palpites.bat${page ? " - " + capitalize(page) : ""}`;
  }, [page]);

  return (
    <html lang="pt-br">
      <body className={styles.body}>
        {friendRequests?.[0] && (
          <FriendRequestPopup
            user={friendRequests[0]}
            setPage={setPage}
            setSelect={setSelect}
            onClose={clearFriendRequests}
          />
        )}

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
          setPerfilPage={setPerfilPage}
        />

        <MainPage page={page} setPage={setPage} setSelect={select} />
      </body>
    </html>
  );
}

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <LayoutContent />
    </AuthProvider>
  );
}
