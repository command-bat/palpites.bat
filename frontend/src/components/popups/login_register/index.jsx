import styles from "./index.module.css";

export default function login_register({ onClose }) {
  const LINK = "http://localhost:3030";
  return (
    <>
      <div className={styles.overlay}>
        <div className={styles.popup}>
          <button className={styles.close} onClick={onClose}>
            ✕
          </button>

          <h2 className={styles.title}>Entrar</h2>
          <p className={styles.subtitle}>Faça login para acessar sua conta.</p>

          <a href={LINK + "/auth/google"} className={styles.googleBtn}>
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
            />
            Entrar com o Google
          </a>

          <a href={LINK + "/auth/discord"} className={styles.discordBtn}>
            <img
              src="https://www.svgrepo.com/show/353655/discord-icon.svg"
              alt="Discord"
            />
            Entrar com o Discord
          </a>

          {/* <p className={styles.footer}>Não ficará nada público em sua conta.</p> */}
        </div>
      </div>
    </>
  );
}
