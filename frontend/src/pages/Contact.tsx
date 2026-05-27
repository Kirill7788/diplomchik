import { useState, CSSProperties } from "react";
import api from "../services/api";

const s: Record<string, CSSProperties> = {
  page: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "48px 24px",
  },
  hero: {
    textAlign: "center",
    marginBottom: "48px",
  },
  title: {
    fontSize: "36px",
    fontWeight: 800,
    marginBottom: "12px",
  },
  subtitle: {
    fontSize: "16px",
    color: "var(--text-secondary)",
    lineHeight: "1.6",
    maxWidth: "600px",
    margin: "0 auto",
  },
  aboutSection: {
    background: "#fff",
    borderRadius: "var(--radius)",
    boxShadow: "var(--shadow)",
    padding: "32px",
    marginBottom: "40px",
  },
  aboutTitle: {
    fontSize: "20px",
    fontWeight: 700,
    marginBottom: "16px",
  },
  aboutText: {
    fontSize: "15px",
    lineHeight: "1.7",
    color: "var(--text-secondary)",
    marginBottom: "12px",
  },
  features: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
    marginTop: "24px",
  },
  featureCard: {
    background: "var(--bg-secondary)",
    borderRadius: "12px",
    padding: "20px",
    textAlign: "center",
  },
  featureIcon: {
    fontSize: "32px",
    marginBottom: "8px",
  },
  featureTitle: {
    fontSize: "14px",
    fontWeight: 700,
    marginBottom: "4px",
  },
  featureDesc: {
    fontSize: "12px",
    color: "var(--text-secondary)",
  },
  formSection: {
    background: "#fff",
    borderRadius: "var(--radius)",
    boxShadow: "var(--shadow)",
    padding: "32px",
  },
  formTitle: {
    fontSize: "20px",
    fontWeight: 700,
    marginBottom: "20px",
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
  textarea: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "8px",
    border: "2px solid var(--border)",
    fontSize: "14px",
    minHeight: "120px",
    resize: "vertical" as const,
    boxSizing: "border-box",
    fontFamily: "inherit",
  },
  btnSend: {
    padding: "14px 32px",
    borderRadius: "28px",
    fontSize: "15px",
    fontWeight: 600,
    color: "#fff",
    background: "var(--primary)",
    border: "none",
    cursor: "pointer",
    width: "100%",
    marginTop: "8px",
  },
  toast: {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    background: "#333",
    color: "#fff",
    padding: "12px 24px",
    borderRadius: "12px",
    fontSize: "14px",
    zIndex: 3000,
  },
};

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      showToast("Заполните все поля");
      return;
    }
    setSending(true);
    try {
      await api.post("/contact", { name, email, subject, message });
      showToast("Сообщение отправлено! Мы свяжемся с вами.");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch {
      showToast("Ошибка отправки сообщения");
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.hero}>
        <h1 style={s.title}>Связь с нами</h1>
        <p style={s.subtitle}>
          Мы всегда рады помочь! Напишите нам, и мы ответим в ближайшее время.
        </p>
      </div>

      <div style={s.aboutSection}>
        <h2 style={s.aboutTitle}>О сайте To Be Clad</h2>
        <p style={s.aboutText}>
          To Be Clad — это онлайн-конструктор образов, который позволяет вам создавать
          и визуализировать свой идеальный стиль. С помощью нашего интерактивного манекена
          вы можете комбинировать различные элементы одежды и настраивать их цвета в
          режиме реального времени.
        </p>
        <p style={s.aboutText}>
          Наша платформа предлагает широкий выбор одежды — от головных уборов и курток
          до брюк и обуви. Каждый элемент можно раскрасить в любой цвет с помощью
          интуитивной RGB-палитры. Создавайте, сохраняйте и делитесь своими образами!
        </p>

        <div style={s.features}>
          <div style={s.featureCard}>
            <div style={s.featureIcon}>🎨</div>
            <div style={s.featureTitle}>RGB-палитра</div>
            <div style={s.featureDesc}>Настройте любой цвет для каждой зоны</div>
          </div>
          <div style={s.featureCard}>
            <div style={s.featureIcon}>👕</div>
            <div style={s.featureTitle}>30+ элементов</div>
            <div style={s.featureDesc}>Широкий выбор одежды и обуви</div>
          </div>
          <div style={s.featureCard}>
            <div style={s.featureIcon}>💾</div>
            <div style={s.featureTitle}>Сохранение</div>
            <div style={s.featureDesc}>Сохраняйте и редактируйте образы</div>
          </div>
          <div style={s.featureCard}>
            <div style={s.featureIcon}>🔧</div>
            <div style={s.featureTitle}>Админ-панель</div>
            <div style={s.featureDesc}>Управление каталогом одежды</div>
          </div>
        </div>
      </div>

      <div style={s.formSection}>
        <h2 style={s.formTitle}>Напишите нам</h2>
        <form onSubmit={handleSubmit}>
          <div style={s.field}>
            <label style={s.label}>Имя</label>
            <input
              style={s.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ваше имя"
            />
          </div>
          <div style={s.field}>
            <label style={s.label}>Email</label>
            <input
              style={s.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
            />
          </div>
          <div style={s.field}>
            <label style={s.label}>Тема</label>
            <input
              style={s.input}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Тема сообщения"
            />
          </div>
          <div style={s.field}>
            <label style={s.label}>Сообщение</label>
            <textarea
              style={s.textarea}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ваше сообщение..."
            />
          </div>
          <button style={s.btnSend} type="submit" disabled={sending}>
            {sending ? "Отправка..." : "Отправить сообщение"}
          </button>
        </form>
      </div>

      {toast && <div style={s.toast}>{toast}</div>}
    </div>
  );
}
