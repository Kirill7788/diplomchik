import { useState, CSSProperties } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const s: Record<string, CSSProperties> = {
  page: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "calc(100vh - 64px)",
    background: "var(--bg-secondary)",
    padding: "24px",
  },
  card: {
    background: "#fff",
    borderRadius: "var(--radius)",
    boxShadow: "var(--shadow)",
    padding: "40px 32px",
    width: "400px",
    maxWidth: "100%",
  },
  title: {
    fontSize: "24px",
    fontWeight: 800,
    textAlign: "center",
    marginBottom: "8px",
  },
  subtitle: {
    fontSize: "14px",
    color: "var(--text-secondary)",
    textAlign: "center",
    marginBottom: "24px",
  },
  field: {
    marginBottom: "16px",
  },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: 600,
    marginBottom: "6px",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "8px",
    border: "2px solid var(--border)",
    fontSize: "14px",
    boxSizing: "border-box",
  },
  btn: {
    width: "100%",
    padding: "14px",
    borderRadius: "28px",
    fontSize: "15px",
    fontWeight: 600,
    color: "#fff",
    background: "var(--primary)",
    border: "none",
    cursor: "pointer",
    marginTop: "8px",
  },
  link: {
    display: "block",
    textAlign: "center",
    marginTop: "16px",
    fontSize: "14px",
    color: "var(--primary)",
    textDecoration: "none",
  },
  message: {
    padding: "12px 16px",
    borderRadius: "8px",
    fontSize: "14px",
    marginBottom: "16px",
    textAlign: "center",
  },
  success: {
    background: "#dcfce7",
    color: "#16a34a",
  },
  error: {
    background: "#fee2e2",
    color: "#dc2626",
  },
};

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const res = await api.post("/auth/forgot-password", { email });
      setStatus("success");
      setMsg("Ссылка для сброса пароля отправлена на вашу почту.");
      if (res.data.resetToken) {
        setResetToken(res.data.resetToken);
      }
    } catch {
      setStatus("error");
      setMsg("Произошла ошибка. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <h1 style={s.title}>Сброс пароля</h1>
        <p style={s.subtitle}>
          Введите email, указанный при регистрации
        </p>

        {status !== "idle" && (
          <div style={{ ...s.message, ...(status === "success" ? s.success : s.error) }}>
            {msg}
          </div>
        )}

        {resetToken && (
          <div style={{ ...s.message, ...s.success }}>
            <Link to={`/reset-password?token=${resetToken}`} style={{ color: "#16a34a", fontWeight: 600 }}>
              Перейти к сбросу пароля →
            </Link>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={s.field}>
            <label style={s.label}>Email</label>
            <input
              style={s.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              autoFocus
            />
          </div>
          <button style={s.btn} type="submit" disabled={loading}>
            {loading ? "Отправка..." : "Отправить ссылку"}
          </button>
        </form>

        <Link to="/login" style={s.link}>
          ← Вернуться к входу
        </Link>
      </div>
    </div>
  );
}
