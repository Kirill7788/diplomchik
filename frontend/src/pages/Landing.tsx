import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CSSProperties } from "react";

const paperDollSvg = `<svg viewBox="0 0 200 400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
      <circle cx="10" cy="10" r="2" fill="rgba(255,255,255,0.3)"/>
    </pattern>
  </defs>
  <!-- Paper doll body -->
  <ellipse cx="100" cy="60" rx="28" ry="32" fill="#FDBCB4" stroke="#E8967C" stroke-width="2"/>
  <!-- Hair -->
  <path d="M72 55 Q72 25 100 20 Q128 25 128 55 Q128 40 115 35 Q100 32 85 35 Q72 40 72 55" fill="#8B4513" stroke="#6B3410" stroke-width="1.5"/>
  <path d="M68 55 Q65 75 70 85" fill="none" stroke="#8B4513" stroke-width="4" stroke-linecap="round"/>
  <path d="M132 55 Q135 75 130 85" fill="none" stroke="#8B4513" stroke-width="4" stroke-linecap="round"/>
  <!-- Eyes -->
  <circle cx="88" cy="55" r="4" fill="#333"/>
  <circle cx="112" cy="55" r="4" fill="#333"/>
  <circle cx="89" cy="53" r="1.5" fill="#fff"/>
  <circle cx="113" cy="53" r="1.5" fill="#fff"/>
  <!-- Smile -->
  <path d="M90 68 Q100 78 110 68" fill="none" stroke="#E8967C" stroke-width="2" stroke-linecap="round"/>
  <!-- Cheeks -->
  <circle cx="78" cy="65" r="6" fill="rgba(255,150,150,0.4)"/>
  <circle cx="122" cy="65" r="6" fill="rgba(255,150,150,0.4)"/>
  <!-- Neck -->
  <rect x="92" y="90" width="16" height="12" rx="4" fill="#FDBCB4"/>
  <!-- Body (underwear/base) -->
  <rect x="70" y="100" width="60" height="55" rx="8" fill="#FFE4E1" stroke="#FFB6C1" stroke-width="1.5" stroke-dasharray="4 2"/>
  <!-- Arms -->
  <path d="M70 105 L45 140 L40 160 L50 162 L55 145 L70 120" fill="#FDBCB4" stroke="#E8967C" stroke-width="1.5"/>
  <path d="M130 105 L155 140 L160 160 L150 162 L145 145 L130 120" fill="#FDBCB4" stroke="#E8967C" stroke-width="1.5"/>
  <!-- Legs -->
  <path d="M80 155 L75 240 L68 290 L65 310 L85 310 L85 295 L90 240 L95 160" fill="#FDBCB4" stroke="#E8967C" stroke-width="1.5"/>
  <path d="M120 155 L125 240 L132 290 L135 310 L115 310 L115 295 L110 240 L105 160" fill="#FDBCB4" stroke="#E8967C" stroke-width="1.5"/>
  <!-- Paper tabs -->
  <rect x="35" y="108" width="18" height="10" rx="2" fill="#FFE4E1" stroke="#FFB6C1" stroke-width="1" stroke-dasharray="3 2" transform="rotate(-20 44 113)"/>
  <rect x="147" y="108" width="18" height="10" rx="2" fill="#FFE4E1" stroke="#FFB6C1" stroke-width="1" stroke-dasharray="3 2" transform="rotate(20 156 113)"/>
  <rect x="55" y="230" width="14" height="10" rx="2" fill="#FFE4E1" stroke="#FFB6C1" stroke-width="1" stroke-dasharray="3 2" transform="rotate(-10 62 235)"/>
  <rect x="131" y="230" width="14" height="10" rx="2" fill="#FFE4E1" stroke="#FFB6C1" stroke-width="1" stroke-dasharray="3 2" transform="rotate(10 138 235)"/>
</svg>`;

const clothingPieceSvg = (color: string, type: "dress" | "skirt" | "top") => {
  if (type === "dress") return `<svg viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg">
    <path d="M25 5 Q20 0 15 5 L5 45 L15 48 L20 30 L20 130 Q20 138 30 138 L90 138 Q100 138 100 130 L100 30 L105 48 L115 45 L105 5 Q100 0 95 5 L70 15 Q60 20 50 15 Z" fill="${color}" stroke="${color === '#FF69B4' ? '#FF1493' : '#C71585'}" stroke-width="2"/>
    <rect x="12" y="0" width="16" height="8" rx="3" fill="${color}" stroke="${color === '#FF69B4' ? '#FF1493' : '#C71585'}" stroke-width="1" stroke-dasharray="3 2" transform="rotate(-25 20 4)"/>
    <rect x="92" y="0" width="16" height="8" rx="3" fill="${color}" stroke="${color === '#FF69B4' ? '#FF1493' : '#C71585'}" stroke-width="1" stroke-dasharray="3 2" transform="rotate(25 100 4)"/>
    <circle cx="60" cy="25" r="4" fill="rgba(255,255,255,0.5)"/>
    <circle cx="60" cy="38" r="3" fill="rgba(255,255,255,0.5)"/>
  </svg>`;
  if (type === "skirt") return `<svg viewBox="0 0 120 90" xmlns="http://www.w3.org/2000/svg">
    <path d="M25 5 L10 85 Q10 88 15 88 L105 88 Q110 88 110 85 L95 5 Z" fill="${color}" stroke="#6B21A8" stroke-width="2"/>
    <rect x="15" y="0" width="14" height="8" rx="3" fill="${color}" stroke="#6B21A8" stroke-width="1" stroke-dasharray="3 2" transform="rotate(-15 22 4)"/>
    <rect x="91" y="0" width="14" height="8" rx="3" fill="${color}" stroke="#6B21A8" stroke-width="1" stroke-dasharray="3 2" transform="rotate(15 98 4)"/>
  </svg>`;
  return `<svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 5 L5 35 L15 38 L22 22 L22 75 Q22 78 28 78 L92 78 Q98 78 98 75 L98 22 L105 38 L115 35 L100 5 L70 12 Q60 16 50 12 Z" fill="${color}" stroke="#0369A1" stroke-width="2"/>
    <rect x="8" y="0" width="14" height="8" rx="3" fill="${color}" stroke="#0369A1" stroke-width="1" stroke-dasharray="3 2" transform="rotate(-25 15 4)"/>
    <rect x="98" y="0" width="14" height="8" rx="3" fill="${color}" stroke="#0369A1" stroke-width="1" stroke-dasharray="3 2" transform="rotate(25 105 4)"/>
  </svg>`;
};

const floatingItems = [
  { top: "8%", left: "5%", size: 70, rotate: -15, color: "#FF69B4", type: "dress" as const },
  { top: "15%", right: "8%", size: 60, rotate: 12, color: "#9333EA", type: "skirt" as const },
  { top: "55%", left: "3%", size: 65, rotate: 8, color: "#38BDF8", type: "top" as const },
  { top: "65%", right: "5%", size: 55, rotate: -10, color: "#FF69B4", type: "dress" as const },
  { top: "35%", left: "8%", size: 50, rotate: 20, color: "#A855F7", type: "skirt" as const },
  { top: "40%", right: "10%", size: 60, rotate: -8, color: "#F472B6", type: "top" as const },
];

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: `
      radial-gradient(circle at 20% 50%, rgba(251,191,36,0.12) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(236,72,153,0.12) 0%, transparent 50%),
      radial-gradient(circle at 60% 80%, rgba(147,51,234,0.10) 0%, transparent 50%),
      linear-gradient(180deg, #FFF7ED 0%, #FDF2F8 30%, #F5F3FF 60%, #ECFDF5 100%)
    `,
    position: "relative",
    overflow: "hidden",
  },
  bgPattern: {
    position: "absolute",
    inset: 0,
    backgroundImage: `
      radial-gradient(circle, rgba(251,191,36,0.15) 1px, transparent 1px),
      radial-gradient(circle, rgba(236,72,153,0.12) 1px, transparent 1px)
    `,
    backgroundSize: "40px 40px, 60px 60px",
    backgroundPosition: "0 0, 20px 30px",
    pointerEvents: "none",
  },
  hero: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "calc(100vh - 64px)",
    textAlign: "center",
    padding: "40px 20px",
    position: "relative",
    zIndex: 1,
  },
  titleWrap: {
    position: "relative",
    marginBottom: "20px",
  },
  title: {
    fontSize: "52px",
    fontWeight: 800,
    lineHeight: 1.15,
    maxWidth: "700px",
    color: "#1E1B4B",
  },
  highlight: {
    background: "linear-gradient(135deg, #EC4899, #A855F7, #3B82F6)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  sparkle: {
    position: "absolute",
    fontSize: "28px",
    animation: "none",
  },
  subtitle: {
    fontSize: "19px",
    color: "#6B7280",
    maxWidth: "550px",
    marginBottom: "36px",
    lineHeight: 1.7,
  },
  dollContainer: {
    width: "180px",
    height: "320px",
    marginBottom: "30px",
    filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.1))",
  },
  buttons: {
    display: "flex",
    gap: "16px",
    marginBottom: "60px",
  },
  btnPrimary: {
    padding: "16px 36px",
    borderRadius: "50px",
    fontSize: "17px",
    fontWeight: 700,
    color: "#fff",
    background: "linear-gradient(135deg, #EC4899, #A855F7)",
    border: "none",
    boxShadow: "0 6px 25px rgba(168,85,247,0.35)",
    transition: "transform 0.2s, box-shadow 0.2s",
    cursor: "pointer",
  },
  btnOutline: {
    padding: "16px 36px",
    borderRadius: "50px",
    fontSize: "17px",
    fontWeight: 700,
    color: "#7C3AED",
    background: "rgba(255,255,255,0.8)",
    border: "2px solid #C4B5FD",
    transition: "transform 0.2s",
    cursor: "pointer",
  },
  features: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "24px",
    maxWidth: "900px",
    width: "100%",
    padding: "0 20px",
  },
  featureCard: {
    background: "rgba(255,255,255,0.85)",
    backdropFilter: "blur(10px)",
    borderRadius: "20px",
    padding: "28px 20px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
    textAlign: "center",
    border: "2px solid rgba(196,181,253,0.3)",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  featureIcon: {
    fontSize: "44px",
    marginBottom: "12px",
  },
  featureTitle: {
    fontSize: "17px",
    fontWeight: 700,
    marginBottom: "8px",
    color: "#4C1D95",
  },
  featureDesc: {
    fontSize: "14px",
    color: "#6B7280",
    lineHeight: 1.6,
  },
  section: {
    padding: "80px 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
    zIndex: 1,
  },
  sectionTitle: {
    fontSize: "36px",
    fontWeight: 800,
    marginBottom: "12px",
    textAlign: "center",
    color: "#1E1B4B",
  },
  sectionSubtitle: {
    fontSize: "16px",
    color: "#6B7280",
    marginBottom: "48px",
    textAlign: "center",
    maxWidth: "480px",
  },
  steps: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "28px",
    maxWidth: "900px",
    width: "100%",
  },
  step: {
    textAlign: "center",
    padding: "24px",
    background: "rgba(255,255,255,0.7)",
    borderRadius: "20px",
    border: "2px dashed #DDD6FE",
  },
  stepNumber: {
    width: "52px",
    height: "52px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #EC4899, #A855F7)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
    fontWeight: 800,
    margin: "0 auto 16px",
    boxShadow: "0 4px 15px rgba(168,85,247,0.3)",
  },
  stepTitle: {
    fontSize: "16px",
    fontWeight: 700,
    marginBottom: "8px",
    color: "#4C1D95",
  },
  stepDesc: {
    fontSize: "14px",
    color: "#6B7280",
    lineHeight: 1.6,
  },
  conceptSection: {
    padding: "60px 20px 80px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
    zIndex: 1,
  },
  conceptCard: {
    maxWidth: "700px",
    background: "rgba(255,255,255,0.85)",
    backdropFilter: "blur(10px)",
    borderRadius: "24px",
    padding: "40px",
    border: "2px solid rgba(196,181,253,0.3)",
    boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
    textAlign: "center",
  },
  conceptEmoji: {
    fontSize: "48px",
    marginBottom: "16px",
  },
  conceptTitle: {
    fontSize: "24px",
    fontWeight: 800,
    color: "#4C1D95",
    marginBottom: "16px",
  },
  conceptText: {
    fontSize: "15px",
    color: "#6B7280",
    lineHeight: 1.8,
  },
  footer: {
    textAlign: "center",
    padding: "32px 20px",
    color: "#9CA3AF",
    fontSize: "14px",
    position: "relative",
    zIndex: 1,
  },
  floatingItem: {
    position: "absolute",
    zIndex: 0,
    opacity: 0.6,
    pointerEvents: "none",
    filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))",
  },
};

export default function Landing() {
  const { user } = useAuth();

  return (
    <div style={styles.page}>
      <div style={styles.bgPattern} />

      {/* Floating paper clothing pieces */}
      {floatingItems.map((item, i) => (
        <div
          key={i}
          style={{
            ...styles.floatingItem,
            top: item.top,
            left: "left" in item ? item.left : undefined,
            right: "right" in item ? item.right : undefined,
            width: `${item.size}px`,
            transform: `rotate(${item.rotate}deg)`,
          }}
          dangerouslySetInnerHTML={{ __html: clothingPieceSvg(item.color, item.type) }}
        />
      ))}

      <div style={styles.hero}>
        <div style={styles.titleWrap}>
          <h1 style={styles.title}>
            <span style={{ ...styles.sparkle, top: "-15px", left: "-30px" }}>&#10024;</span>
            &#128391; Одень свою{" "}
            <span style={styles.highlight}>куколку</span>
            <span style={{ ...styles.sparkle, bottom: "0px", right: "-25px" }}>&#127775;</span>
          </h1>
        </div>

        <div
          style={styles.dollContainer}
          dangerouslySetInnerHTML={{ __html: paperDollSvg }}
        />

        <p style={styles.subtitle}>
          Помнишь бумажных кукол из детства? Теперь можно одевать их онлайн!
          Выбирай одежду, раскрашивай в любые цвета и создавай самые красивые образы &#127752;
        </p>

        <div style={styles.buttons}>
          {user ? (
            <Link to="/constructor">
              <button style={styles.btnPrimary}>&#127880; Играть!</button>
            </Link>
          ) : (
            <>
              <Link to="/register">
                <button style={styles.btnPrimary}>&#127880; Начать играть!</button>
              </Link>
              <Link to="/login">
                <button style={styles.btnOutline}>Уже есть аккаунт</button>
              </Link>
            </>
          )}
        </div>

        <div style={styles.features}>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>&#127912;</div>
            <div style={styles.featureTitle}>Раскрашивай</div>
            <div style={styles.featureDesc}>
              Палитра цветов — как коробка карандашей! Раскрась каждую деталь одежды
            </div>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>&#128087;</div>
            <div style={styles.featureTitle}>Одевай</div>
            <div style={styles.featureDesc}>
              Шапочки, платья, кроссовки — целый гардероб для твоей куколки!
            </div>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>&#128444;&#65039;</div>
            <div style={styles.featureTitle}>Сохраняй</div>
            <div style={styles.featureDesc}>
              Собери коллекцию своих самых красивых образов и покажи друзьям!
            </div>
          </div>
        </div>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>&#127775; Как играть?</h2>
        <p style={styles.sectionSubtitle}>
          Всего три простых шага — как в детстве!
        </p>
        <div style={styles.steps}>
          <div style={styles.step}>
            <div style={styles.stepNumber}>1</div>
            <div style={styles.stepTitle}>Выбери одежду &#128090;</div>
            <div style={styles.stepDesc}>
              Открой шкафчик и выбери шапочку, кофточку, штанишки и ботиночки
            </div>
          </div>
          <div style={styles.step}>
            <div style={styles.stepNumber}>2</div>
            <div style={styles.stepTitle}>Раскрась &#127752;</div>
            <div style={styles.stepDesc}>
              Выбери любимые цвета — сделай одежду такой, какой хочешь!
            </div>
          </div>
          <div style={styles.step}>
            <div style={styles.stepNumber}>3</div>
            <div style={styles.stepTitle}>Сохрани &#10024;</div>
            <div style={styles.stepDesc}>
              Нажми кнопку и твой образ сохранится в коллекцию навсегда!
            </div>
          </div>
        </div>
      </div>

      <div style={styles.conceptSection}>
        <div style={styles.conceptCard}>
          <div style={styles.conceptEmoji}>&#128083;&#10024;&#9986;&#65039;</div>
          <div style={styles.conceptTitle}>Бумажные куколки — теперь онлайн!</div>
          <div style={styles.conceptText}>
            В детстве девочки вырезали из бумаги куколок и одежду к ним — 
            примеряли, комбинировали, создавали целые коллекции нарядов.
            Мы перенесли эту любимую игру в интернет! Теперь не нужны ножницы 
            и бумага — одевай куколку прямо на экране, раскрашивай в любые цвета 
            и сохраняй свои самые красивые образы. &#128150;
          </div>
        </div>
      </div>

      <div style={styles.footer}>
        &#10024; To Be Clad &copy; {new Date().getFullYear()} — Одень куколку! &#10024;
      </div>
    </div>
  );
}
