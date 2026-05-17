import { useState, useEffect, CSSProperties } from "react";
import api from "../services/api";
import ClothingPreview from "../components/ClothingPreview";

interface Outfit {
  id: number;
  name: string;
  topItem: { svgTemplate: string } | null;
  topColor: string | null;
  middleItem: { svgTemplate: string } | null;
  middleColor: string | null;
  bottomItem: { svgTemplate: string } | null;
  bottomColor: string | null;
  createdAt: string;
}

interface SavedItem {
  id: number;
  name: string | null;
  customColor: string;
  item: {
    name: string;
    svgTemplate: string;
    category: { zone: string };
  };
  createdAt: string;
}

const s: Record<string, CSSProperties> = {
  page: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "32px 24px",
  },
  tabs: {
    display: "flex",
    gap: "8px",
    marginBottom: "32px",
  },
  tab: {
    padding: "10px 24px",
    borderRadius: "24px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    border: "none",
    transition: "all 0.2s",
  },
  tabActive: {
    background: "var(--primary)",
    color: "#fff",
  },
  tabInactive: {
    background: "var(--bg-secondary)",
    color: "var(--text)",
  },
  title: {
    fontSize: "32px",
    fontWeight: 800,
    marginBottom: "8px",
  },
  subtitle: {
    fontSize: "14px",
    color: "var(--text-secondary)",
    marginBottom: "24px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "24px",
  },
  card: {
    background: "#fff",
    borderRadius: "var(--radius)",
    boxShadow: "var(--shadow)",
    overflow: "hidden",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  cardPreview: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "24px",
    background: "var(--bg-secondary)",
    gap: "2px",
  },
  cardBody: {
    padding: "16px",
  },
  cardTitle: {
    fontSize: "16px",
    fontWeight: 700,
    marginBottom: "4px",
  },
  cardDate: {
    fontSize: "12px",
    color: "var(--text-secondary)",
    marginBottom: "12px",
  },
  deleteBtn: {
    padding: "6px 16px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: 600,
    color: "var(--primary)",
    background: "#fef2f2",
    border: "none",
    transition: "background 0.2s",
  },
  empty: {
    textAlign: "center",
    padding: "60px 20px",
    color: "var(--text-secondary)",
  },
  emptyIcon: {
    fontSize: "48px",
    marginBottom: "16px",
  },
  savedItemCard: {
    background: "#fff",
    borderRadius: "var(--radius)",
    boxShadow: "var(--shadow)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    gap: "12px",
  },
};

export default function MyOutfits() {
  const [tab, setTab] = useState<"outfits" | "items">("outfits");
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [outRes, itemRes] = await Promise.all([
        api.get("/outfits"),
        api.get("/saved-items"),
      ]);
      setOutfits(outRes.data);
      setSavedItems(itemRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteOutfit = async (id: number) => {
    await api.delete(`/outfits/${id}`);
    setOutfits((prev) => prev.filter((o) => o.id !== id));
  };

  const deleteSavedItem = async (id: number) => {
    await api.delete(`/saved-items/${id}`);
    setSavedItems((prev) => prev.filter((i) => i.id !== id));
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  if (loading) {
    return (
      <div style={s.page}>
        <p style={{ textAlign: "center", padding: "60px" }}>Загрузка...</p>
      </div>
    );
  }

  return (
    <div style={s.page}>
      <h1 style={s.title}>Мои образы</h1>
      <p style={s.subtitle}>
        Все сохранённые образы и элементы одежды с кастомными цветами
      </p>

      <div style={s.tabs}>
        <button
          style={{ ...s.tab, ...(tab === "outfits" ? s.tabActive : s.tabInactive) }}
          onClick={() => setTab("outfits")}
        >
          Образы ({outfits.length})
        </button>
        <button
          style={{ ...s.tab, ...(tab === "items" ? s.tabActive : s.tabInactive) }}
          onClick={() => setTab("items")}
        >
          Элементы ({savedItems.length})
        </button>
      </div>

      {tab === "outfits" && (
        <>
          {outfits.length === 0 ? (
            <div style={s.empty}>
              <div style={s.emptyIcon}>👗</div>
              <p>У вас пока нет сохранённых образов</p>
            </div>
          ) : (
            <div style={s.grid}>
              {outfits.map((outfit) => (
                <div key={outfit.id} style={s.card}>
                  <div style={s.cardPreview}>
                    {outfit.topItem && (
                      <ClothingPreview
                        svgTemplate={outfit.topItem.svgTemplate}
                        color={outfit.topColor || "#CCC"}
                        size={90}
                      />
                    )}
                    {outfit.middleItem && (
                      <ClothingPreview
                        svgTemplate={outfit.middleItem.svgTemplate}
                        color={outfit.middleColor || "#CCC"}
                        size={140}
                      />
                    )}
                    {outfit.bottomItem && (
                      <ClothingPreview
                        svgTemplate={outfit.bottomItem.svgTemplate}
                        color={outfit.bottomColor || "#CCC"}
                        size={140}
                      />
                    )}
                  </div>
                  <div style={s.cardBody}>
                    <div style={s.cardTitle}>{outfit.name}</div>
                    <div style={s.cardDate}>{formatDate(outfit.createdAt)}</div>
                    <button
                      style={s.deleteBtn}
                      onClick={() => deleteOutfit(outfit.id)}
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {tab === "items" && (
        <>
          {savedItems.length === 0 ? (
            <div style={s.empty}>
              <div style={s.emptyIcon}>👕</div>
              <p>У вас пока нет сохранённых элементов</p>
            </div>
          ) : (
            <div style={s.grid}>
              {savedItems.map((si) => (
                <div key={si.id} style={s.savedItemCard}>
                  <ClothingPreview
                    svgTemplate={si.item.svgTemplate}
                    color={si.customColor}
                    size={150}
                  />
                  <div style={{ textAlign: "center" }}>
                    <div style={s.cardTitle}>
                      {si.name || si.item.name}
                    </div>
                    <div style={s.cardDate}>{formatDate(si.createdAt)}</div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        justifyContent: "center",
                        marginBottom: "8px",
                        flexWrap: "wrap",
                      }}
                    >
                      {si.customColor.split(",").map((c, idx) => (
                        <div
                          key={idx}
                          style={{
                            width: "18px",
                            height: "18px",
                            borderRadius: "50%",
                            background: c,
                            border: "2px solid var(--border)",
                          }}
                          title={c}
                        />
                      ))}
                    </div>
                    <button
                      style={s.deleteBtn}
                      onClick={() => deleteSavedItem(si.id)}
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
