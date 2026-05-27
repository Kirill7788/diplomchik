import { useState, FormEvent, CSSProperties } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const styles: Record<string, CSSProperties> = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "calc(100vh - 64px)",
    padding: "20px",
    background: "var(--bg-secondary)",
  },
  card: {
    background: "#fff",
    borderRadius: "var(--radius)",
    padding: "40px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "var(--shadow)",
  },
  title: {
    fontSize: "28px",
    fontWeight: 800,
    marginBottom: "8px",
    textAlign: "center",
  },
  subtitle: {
    fontSize: "14px",
    color: "var(--text-secondary)",
    textAlign: "center",
    marginBottom: "32px",
  },
  field: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: 600,
    marginBottom: "6px",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "var(--radius-sm)",
    border: "2px solid var(--border)",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s",
  },
  btn: {
    width: "100%",
    padding: "14px",
    borderRadius: "28px",
    fontSize: "16px",
    fontWeight: 600,
    color: "#fff",
    background: "var(--primary)",
    border: "none",
    marginTop: "8px",
    transition: "background 0.2s",
  },
  error: {
    color: "var(--primary)",
    fontSize: "13px",
    textAlign: "center",
    marginBottom: "16px",
  },
  link: {
    textAlign: "center",
    marginTop: "20px",
    fontSize: "14px",
    color: "var(--text-secondary)",
  },
  linkA: {
    color: "var(--primary)",
    fontWeight: 600,
  },
};

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username, password);
      navigate("/constructor");
    } catch {
      setError("Неверное имя пользователя или пароль");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Вход</h1>
        <p style={styles.subtitle}>Войдите в свой аккаунт To Be Clad</p>
        <form onSubmit={handleSubmit}>
          {error && <p style={styles.error}>{error}</p>}
          <div style={styles.field}>
            <label style={styles.label}>Имя пользователя</label>
            <input
              style={styles.input}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Введите имя"
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Пароль</label>
            <input
              style={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Введите пароль"
            />
          </div>
          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? "Вход..." : "Войти"}
          </button>
        </form>
        <p style={styles.link}>
          <Link to="/forgot-password" style={styles.linkA}>
            Забыли пароль?
          </Link>
        </p>
        <p style={styles.link}>
          Нет аккаунта?{" "}
          <Link to="/register" style={styles.linkA}>
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  );
}
