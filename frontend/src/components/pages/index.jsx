"use client";
import styles from "./index.module.css";
import { useEffect, useState, useRef } from "react";
import Home from "./home/index";

export default function MainPage({}) {
  return (
    <>
      <div className={styles.page}>
        <Home></Home>
      </div>
    </>
  );
}
