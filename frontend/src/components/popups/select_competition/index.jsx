import styles from "./index.module.css";

export default function SelectCompetition({ onClose, setCompetition }) {
  const competitions = [
    {
      name: "Brasileirão",
      code: "BSA",
    },
    {
      name: "Champions League",
      code: "CL",
    },
  ];

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <button className={styles.close} onClick={onClose}>
          ✕
        </button>

        <div className={styles.competitions}>
          {competitions.map((competition) => (
            <p
              key={competition.code}
              onClick={() => {
                setCompetition(competition);
                onClose();
              }}
            >
              {competition.name}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
