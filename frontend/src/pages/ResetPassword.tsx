import { useState, CSSProperties } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
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

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") || "";
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) return;

    if (newPassword !== confirmPassword) {
      setStatus("error");
      setMsg("Пароли не совпадают");
      return;
    }

    if (newPassword.length < 4) {
      setStatus("error");
      setMsg("Пароль должен содержать минимум 4 символа");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/reset-password", { token, newPassword });
      setStatus("success");
      setMsg("Пароль успешно изменён! Перенаправляем...");
      setTimeout(() => navigate("/login"), 2000);
    } catch {
      setStatus("error");
      setMsg("Недействительная или истёкшая ссылка сброса");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div style={s.page}>
        <div style={s.card}>
          <h1 style={s.title}>Ошибка</h1>
          <div style={{ ...s.message, ...s.error }}>
            Отсутствует токен сброса пароля
          </div>
          <Link to="/forgot-password" style={s.link}>
            Запросить сброс пароля →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <h1 style={s.title}>Новый пароль</h1>
        <p style={s.subtitle}>Введите новый пароль для вашего аккаунта</p>

        {status !== "idle" && (
          <div style={{ ...s.message, ...(status === "success" ? s.success : s.error) }}>
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={s.field}>
            <label style={s.label}>Новый пароль</label>
            <input
              style={s.input}
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Минимум 4 символа"
              autoFocus
            />
          </div>
          <div style={s.field}>
            <label style={s.label}>Подтвердите пароль</label>
            <input
              style={s.input}
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Повторите пароль"
            />
          </div>
          <button style={s.btn} type="submit" disabled={loading || status === "success"}>
            {loading ? "Сохранение..." : "Сменить пароль"}
          </button>
        </form>

        <Link to="/login" style={s.link}>
          ← Вернуться к входу
        </Link>
      </div>
    </div>
  );
}
