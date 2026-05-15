import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CSSProperties } from "react";

const styles: Record<string, CSSProperties> = {
  nav: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    height: "64px",
    background: "#fff",
    borderBottom: "1px solid var(--border)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 24px",
    zIndex: 1000,
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "20px",
    fontWeight: 700,
    color: "var(--primary)",
  },
  logoIcon: {
    width: "32px",
    height: "32px",
    background: "var(--primary)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontSize: "16px",
    fontWeight: 800,
  },
  links: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  link: {
    padding: "8px 16px",
    borderRadius: "24px",
    fontSize: "14px",
    fontWeight: 600,
    color: "var(--text)",
    background: "transparent",
    transition: "background 0.2s",
  },
  linkActive: {
    background: "var(--bg-secondary)",
  },
  btnPrimary: {
    padding: "8px 20px",
    borderRadius: "24px",
    fontSize: "14px",
    fontWeight: 600,
    color: "#fff",
    background: "var(--primary)",
    border: "none",
    transition: "background 0.2s",
  },
  btnSecondary: {
    padding: "8px 20px",
    borderRadius: "24px",
    fontSize: "14px",
    fontWeight: 600,
    color: "var(--text)",
    background: "var(--bg-secondary)",
    border: "none",
    transition: "background 0.2s",
  },
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>
        <div style={styles.logoIcon}>O</div>
        OutfitLab
      </Link>

      <div style={styles.links}>
        <Link to="/" style={styles.link}>
          Главная
        </Link>
        {user && (
          <>
            <Link to="/constructor" style={styles.link}>
              Конструктор
            </Link>
            <Link to="/my-outfits" style={styles.link}>
              Мои образы
            </Link>
            {user.isAdmin && (
              <Link to="/admin" style={styles.link}>
                Админ
              </Link>
            )}
          </>
        )}
      </div>

      <div style={styles.links}>
        {user ? (
          <>
            <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
              {user.username}
            </span>
            <button
              style={styles.btnSecondary}
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              Выйти
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              <button style={styles.btnSecondary}>Войти</button>
            </Link>
            <Link to="/register">
              <button style={styles.btnPrimary}>Регистрация</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
