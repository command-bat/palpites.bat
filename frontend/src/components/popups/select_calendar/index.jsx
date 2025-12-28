"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./index.module.css";
import Icon from "../../icon";

export default function SelectDate({ date, setDate, onClose, availableDates }) {
  const ref = useRef(null);
  const [dates, setDates] = useState([]);

  // busca datas ao abrir calendário
  useEffect(() => {
    async function loadDates() {
      if (typeof availableDates === "function") {
        const fetched = await availableDates();
        setDates(fetched);
      } else {
        setDates(availableDates || []);
      }
    }
    loadDates();
  }, [availableDates]);

  const allowedDates = useMemo(
    () =>
      dates.map((d) => {
        const [y, m, day] = d.split("-");
        return new Date(y, m - 1, day);
      }),
    [dates]
  );

  const months = useMemo(() => {
    const map = new Map();
    allowedDates.forEach((d) => {
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (!map.has(key)) map.set(key, d);
    });
    return Array.from(map.values()).sort((a, b) => a - b);
  }, [allowedDates]);

  const [monthIndex, setMonthIndex] = useState(0);
  useEffect(() => {
    const idx = months.findIndex(
      (m) =>
        m.getMonth() === date.getMonth() &&
        m.getFullYear() === date.getFullYear()
    );
    setMonthIndex(idx >= 0 ? idx : 0);
  }, [months, date]);

  const currentMonth = months[monthIndex];

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  function isAllowed(day) {
    return allowedDates.some(
      (d) =>
        d.getFullYear() === day.getFullYear() &&
        d.getMonth() === day.getMonth() &&
        d.getDate() === day.getDate()
    );
  }

  function buildCalendar() {
    if (!currentMonth) return [];
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days = [];
    for (let i = 0; i < firstDay.getDay(); i++) days.push(null);
    for (let d = 1; d <= lastDay.getDate(); d++)
      days.push(new Date(year, month, d));

    return days;
  }

  if (!currentMonth) return null;

  return (
    <div ref={ref} className={styles.dropdown}>
      <div className={styles.header}>
        <button
          disabled={monthIndex === 0}
          onClick={() => setMonthIndex((i) => i - 1)}
        >
          <Icon icon={"arrowTwoLeft"} />
        </button>
        <span>
          {currentMonth.toLocaleDateString("pt-BR", {
            month: "long",
            year: "numeric",
          })}
        </span>
        <button
          disabled={monthIndex === months.length - 1}
          onClick={() => setMonthIndex((i) => i + 1)}
        >
          <Icon icon={"arrowTwoRight"} />
        </button>
      </div>

      <div className={styles.weekdays}>
        {["D", "S", "T", "Q", "Q", "S", "S"].map((d, index) => (
          <span key={`${d}-${index}`}>{d}</span>
        ))}
      </div>

      <div className={styles.grid}>
        {buildCalendar().map((day, i) =>
          !day ? (
            <div key={i} />
          ) : (
            <button
              key={i}
              disabled={!isAllowed(day)}
              className={[
                styles.day,
                day.toDateString() === date.toDateString() && styles.selected,
              ].join(" ")}
              onClick={() => setDate(day)}
            >
              {day.getDate()}
            </button>
          )
        )}
      </div>
    </div>
  );
}
