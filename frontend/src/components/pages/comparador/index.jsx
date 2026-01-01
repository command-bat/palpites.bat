"use client";
import styles from "./index.module.css";
import ComparatorCard from "../../comparator_card";
import Ranking from "../../ranking_card";

export default function Comparador() {
  return (
    <>
      <div className={styles.pageComparador}>
        <ComparatorCard />
        <Ranking />
      </div>
    </>
  );
}
