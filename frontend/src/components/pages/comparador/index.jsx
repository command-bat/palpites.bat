"use client";
import { useEffect, useState } from "react";
import styles from "./index.module.css";
import ComparatorCard from "../../comparator_card";
import Ranking from "../../ranking_card";
import Icon from "../../icon";
import Select from "../../popups/select_dropdown";

export default function Comparador() {
  const [ordemRanking, setOrdemRanking] = useState({
    name: "Acertos",
    code: "correct",
  });
  const [openSelectOrdemRanking, setOpenSelectOrdemRanking] = useState(false);

  const valuesSelect = [
    { name: "Acertos", code: "correct" },
    { name: "Erros", code: "errors" },
  ];

  return (
    <>
      <div className={styles.pageComparador}>
        <ComparatorCard />
        <div className={styles.ranking}>
          <div className={styles.headerRanking}>
            <div className={styles.title}>
              <h1>
                <Icon icon={"rank"} /> Ranking
              </h1>
            </div>
            <div className={styles.headerRight}>
              <div className={styles.selectOrderRank}>
                <div
                  className={styles.textSelect}
                  onClick={() => setOpenSelectOrdemRanking((v) => !v)}
                >
                  <h1>{ordemRanking.name}</h1>
                  <Icon icon={"down"} />
                </div>

                {openSelectOrdemRanking && (
                  <Select
                    setValue={(c) => {
                      setOrdemRanking(c);
                      setOpenSelectOrdemRanking(false);
                    }}
                    onClose={() => setOpenSelectOrdemRanking(false)}
                    values={valuesSelect}
                  />
                )}
              </div>
            </div>
          </div>
          <Ranking select={ordemRanking.code} />
        </div>
      </div>
    </>
  );
}
