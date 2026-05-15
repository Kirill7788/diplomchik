import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CSSProperties } from "react";

const styles: Record<string, CSSProperties> = {
  hero: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "calc(100vh - 64px)",
    textAlign: "center",
    padding: "40px 20px",
    background: "linear-gradient(180deg, #fff 0%, #fef2f2 50%, #fff 100%)",
  },
  title: {
    fontSize: "56px",
    fontWeight: 800,
    lineHeight: 1.1,
    marginBottom: "20px",
    maxWidth: "700px",
  },
  highlight: {
    color: "var(--primary)",
  },
  subtitle: {
    fontSize: "20px",
    color: "var(--text-secondary)",
    maxWidth: "600px",
    marginBottom: "40px",
    lineHeight: 1.6,
  },
  buttons: {
    display: "flex",
    gap: "16px",
    marginBottom: "60px",
  },
  btnPrimary: {
    padding: "14px 32px",
    borderRadius: "28px",
    fontSize: "16px",
    fontWeight: 600,
    color: "#fff",
    background: "var(--primary)",
    border: "none",
    transition: "all 0.2s",
    boxShadow: "0 4px 15px rgba(230, 0, 35, 0.3)",
  },
  btnOutline: {
    padding: "14px 32px",
    borderRadius: "28px",
    fontSize: "16px",
    fontWeight: 600,
    color: "var(--text)",
    background: "transparent",
    border: "2px solid var(--border)",
    transition: "all 0.2s",
  },
  features: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "32px",
    maxWidth: "1000px",
    width: "100%",
    padding: "0 20px",
  },
  featureCard: {
    background: "var(--card-bg)",
    borderRadius: "var(--radius)",
    padding: "32px 24px",
    boxShadow: "var(--shadow)",
    textAlign: "center",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  featureIcon: {
    fontSize: "40px",
    marginBottom: "16px",
  },
  featureTitle: {
    fontSize: "18px",
    fontWeight: 700,
    marginBottom: "8px",
  },
  featureDesc: {
    fontSize: "14px",
    color: "var(--text-secondary)",
    lineHeight: 1.6,
  },
  section: {
    padding: "80px 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: "36px",
    fontWeight: 800,
    marginBottom: "16px",
    textAlign: "center",
  },
  sectionSubtitle: {
    fontSize: "16px",
    color: "var(--text-secondary)",
    marginBottom: "48px",
    textAlign: "center",
    maxWidth: "500px",
  },
  steps: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "32px",
    maxWidth: "900px",
    width: "100%",
  },
  step: {
    textAlign: "center",
    padding: "20px",
  },
  stepNumber: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    background: "var(--primary)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    fontWeight: 700,
    margin: "0 auto 16px",
  },
  stepTitle: {
    fontSize: "16px",
    fontWeight: 700,
    marginBottom: "8px",
  },
  stepDesc: {
    fontSize: "14px",
    color: "var(--text-secondary)",
  },
  footer: {
    textAlign: "center",
    padding: "40px 20px",
    borderTop: "1px solid var(--border)",
    color: "var(--text-secondary)",
    fontSize: "14px",
  },
};

export default function Landing() {
  const { user } = useAuth();

  return (
    <div>
      <div style={styles.hero}>
        <h1 style={styles.title}>
          Создавай свой <span style={styles.highlight}>стиль</span> онлайн
        </h1>
        <p style={styles.subtitle}>
          OutfitLab — конструктор образов, где ты можешь собрать идеальный
          аутфит, настроить цвета и сохранить свои лучшие комбинации.
          Экспериментируй с модой без ограничений!
        </p>
        <div style={styles.buttons}>
          {user ? (
            <Link to="/constructor">
              <button style={styles.btnPrimary}>Открыть конструктор</button>
            </Link>
          ) : (
            <>
              <Link to="/register">
                <button style={styles.btnPrimary}>Начать бесплатно</button>
              </Link>
              <Link to="/login">
                <button style={styles.btnOutline}>Войти</button>
              </Link>
            </>
          )}
        </div>
        <div style={styles.features}>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>🎨</div>
            <div style={styles.featureTitle}>Настройка цвета</div>
            <div style={styles.featureDesc}>
              Полная палитра RGB для настройки цвета каждого элемента одежды
            </div>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>👕</div>
            <div style={styles.featureTitle}>Разнообразие</div>
            <div style={styles.featureDesc}>
              Кепки, толстовки, куртки, джинсы и многое другое для создания
              образа
            </div>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>💾</div>
            <div style={styles.featureTitle}>Сохранение</div>
            <div style={styles.featureDesc}>
              Сохраняй готовые образы и отдельные элементы с кастомными цветами
            </div>
          </div>
        </div>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Как это работает?</h2>
        <p style={styles.sectionSubtitle}>
          Три простых шага до идеального образа
        </p>
        <div style={styles.steps}>
          <div style={styles.step}>
            <div style={styles.stepNumber}>1</div>
            <div style={styles.stepTitle}>Выбери одежду</div>
            <div style={styles.stepDesc}>
              Выбери элементы для каждой зоны: голова, торс и ноги
            </div>
          </div>
          <div style={styles.step}>
            <div style={styles.stepNumber}>2</div>
            <div style={styles.stepTitle}>Настрой цвет</div>
            <div style={styles.stepDesc}>
              Используй палитру цветов для настройки каждого элемента
            </div>
          </div>
          <div style={styles.step}>
            <div style={styles.stepNumber}>3</div>
            <div style={styles.stepTitle}>Сохрани образ</div>
            <div style={styles.stepDesc}>
              Сохрани готовый эскиз или отдельные элементы в коллекцию
            </div>
          </div>
        </div>
      </div>

      <div style={styles.footer}>
        OutfitLab &copy; {new Date().getFullYear()}. Конструктор образов.
      </div>
    </div>
  );
}
