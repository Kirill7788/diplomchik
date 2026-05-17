import { useState, useEffect, CSSProperties } from "react";
import api from "../services/api";
import ColorPicker from "../components/ColorPicker";
import ClothingPreview, { getZoneNames } from "../components/ClothingPreview";

interface ClothingItem {
  id: number;
  name: string;
  categoryId: number;
  svgTemplate: string;
  defaultColor: string;
  isActive: boolean;
  category: { id: number; name: string; zone: string };
}

interface ZoneState {
  selectedItem: ClothingItem | null;
  colors: string[]; // array of colors, one per SVG zone
}

const zones = [
  { key: "top", label: "Голова", icon: "🎩" },
  { key: "middle", label: "Торс", icon: "👕" },
  { key: "bottom", label: "Ноги", icon: "👖" },
] as const;

type ZoneKey = (typeof zones)[number]["key"];

// Mannequin body silhouette SVG
const mannequinBodySvg = `<svg viewBox="0 0 300 650" xmlns="http://www.w3.org/2000/svg" style="opacity:0.18">
  <ellipse cx="150" cy="58" rx="34" ry="42" fill="#c9a882" stroke="#b8956e" stroke-width="1.5"/>
  <rect x="139" y="100" width="22" height="22" rx="6" fill="#c9a882"/>
  <path d="M139 120 L75 142 L65 158 L62 175 L78 172 L85 155 L139 142 L139 340 L161 340 L161 142 L215 155 L222 172 L238 175 L235 158 L225 142 L161 120" fill="#c9a882" stroke="#b8956e" stroke-width="1.2"/>
  <path d="M62 175 L55 290 L52 318 L68 320 L72 295 L78 175" fill="#c9a882" stroke="#b8956e" stroke-width="1.2"/>
  <path d="M238 175 L245 290 L248 318 L232 320 L228 295 L222 175" fill="#c9a882" stroke="#b8956e" stroke-width="1.2"/>
  <path d="M120 340 L115 480 L108 560 L132 564 L135 485 L142 345" fill="#c9a882" stroke="#b8956e" stroke-width="1.2"/>
  <path d="M180 340 L185 480 L192 560 L168 564 L165 485 L158 345" fill="#c9a882" stroke="#b8956e" stroke-width="1.2"/>
</svg>`;

const s: Record<string, CSSProperties> = {
  page: {
    display: "flex",
    height: "calc(100vh - 64px)",
    overflow: "hidden",
  },
  sidebar: {
    width: "340px",
    borderRight: "1px solid var(--border)",
    display: "flex",
    flexDirection: "column",
    background: "#fff",
    overflowY: "auto",
  },
  sidebarHeader: {
    padding: "20px",
    borderBottom: "1px solid var(--border)",
  },
  sidebarTitle: {
    fontSize: "18px",
    fontWeight: 700,
  },
  zoneTabs: {
    display: "flex",
    borderBottom: "1px solid var(--border)",
  },
  zoneTab: {
    flex: 1,
    padding: "12px 8px",
    textAlign: "center",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
    borderBottom: "3px solid transparent",
    transition: "all 0.2s",
    background: "transparent",
    color: "var(--text-secondary)",
  },
  zoneTabActive: {
    borderBottomColor: "var(--primary)",
    color: "var(--primary)",
  },
  itemsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "12px",
    padding: "16px",
  },
  itemCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "6px",
    cursor: "pointer",
  },
  itemName: {
    fontSize: "12px",
    fontWeight: 600,
    textAlign: "center",
  },
  colorSection: {
    padding: "16px",
    borderTop: "1px solid var(--border)",
  },
  colorTitle: {
    fontSize: "14px",
    fontWeight: 600,
    marginBottom: "12px",
  },
  zoneColorRow: {
    marginBottom: "16px",
  },
  zoneLabel: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#555",
    marginBottom: "8px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  zoneDot: {
    width: "14px",
    height: "14px",
    borderRadius: "50%",
    border: "2px solid #333",
    display: "inline-block",
  },
  center: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "var(--bg-secondary)",
    position: "relative",
  },
  mannequinContainer: {
    position: "relative",
    width: "320px",
    height: "580px",
  },
  mannequinBody: {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
  },
  mannequinSlot: {
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    borderRadius: "12px",
    transition: "all 0.2s",
  },
  mannequinSlotActive: {
    background: "rgba(230, 0, 35, 0.06)",
    outline: "2px dashed var(--primary)",
  },
  placeholderSlot: {
    border: "2px dashed var(--border)",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--text-secondary)",
    fontSize: "13px",
    width: "100%",
    height: "100%",
  },
  actions: {
    position: "absolute",
    bottom: "16px",
    display: "flex",
    gap: "12px",
  },
  btnSave: {
    padding: "12px 28px",
    borderRadius: "28px",
    fontSize: "14px",
    fontWeight: 600,
    color: "#fff",
    background: "var(--primary)",
    border: "none",
    boxShadow: "0 4px 15px rgba(230, 0, 35, 0.3)",
    cursor: "pointer",
  },
  btnSecondary: {
    padding: "12px 28px",
    borderRadius: "28px",
    fontSize: "14px",
    fontWeight: 600,
    color: "var(--text)",
    background: "#fff",
    border: "2px solid var(--border)",
    cursor: "pointer",
  },
  saveModal: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000,
  },
  saveModalCard: {
    background: "#fff",
    borderRadius: "var(--radius)",
    padding: "32px",
    width: "400px",
    maxWidth: "90vw",
  },
  saveModalTitle: {
    fontSize: "20px",
    fontWeight: 700,
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "var(--radius-sm)",
    border: "2px solid var(--border)",
    fontSize: "14px",
    marginBottom: "16px",
    boxSizing: "border-box" as const,
  },
  saveModalBtns: {
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end",
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
    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
  },
};

// Slot positions on mannequin (top, left offsets relative to container)
const slotPositions: Record<ZoneKey, CSSProperties> = {
  top: { top: "0px", width: "200px", height: "130px" },
  middle: { top: "115px", width: "260px", height: "240px" },
  bottom: { top: "330px", width: "240px", height: "240px" },
};

export default function Constructor() {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [activeZone, setActiveZone] = useState<ZoneKey>("top");
  const [zoneStates, setZoneStates] = useState<Record<ZoneKey, ZoneState>>({
    top: { selectedItem: null, colors: ["#CCCCCC"] },
    middle: { selectedItem: null, colors: ["#CCCCCC"] },
    bottom: { selectedItem: null, colors: ["#CCCCCC"] },
  });
  const [showSaveOutfit, setShowSaveOutfit] = useState(false);
  const [showSaveItem, setShowSaveItem] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    api.get("/clothing/items").then((res) => setItems(res.data));
  }, []);

  const filteredItems = items.filter((i) => i.category.zone === activeZone);

  const selectItem = (item: ClothingItem) => {
    const colors = item.defaultColor.split(",");
    setZoneStates((prev) => ({
      ...prev,
      [activeZone]: { selectedItem: item, colors },
    }));
  };

  const changeZoneColor = (zoneIndex: number, color: string) => {
    setZoneStates((prev) => {
      const newColors = [...prev[activeZone].colors];
      newColors[zoneIndex] = color;
      return {
        ...prev,
        [activeZone]: { ...prev[activeZone], colors: newColors },
      };
    });
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const saveOutfit = async () => {
    if (!saveName.trim()) return;
    try {
      await api.post("/outfits", {
        name: saveName,
        topItemId: zoneStates.top.selectedItem?.id || null,
        topColor: zoneStates.top.selectedItem
          ? zoneStates.top.colors.join(",")
          : null,
        middleItemId: zoneStates.middle.selectedItem?.id || null,
        middleColor: zoneStates.middle.selectedItem
          ? zoneStates.middle.colors.join(",")
          : null,
        bottomItemId: zoneStates.bottom.selectedItem?.id || null,
        bottomColor: zoneStates.bottom.selectedItem
          ? zoneStates.bottom.colors.join(",")
          : null,
      });
      setShowSaveOutfit(false);
      setSaveName("");
      showToast("Образ сохранён!");
    } catch {
      showToast("Ошибка сохранения");
    }
  };

  const saveCurrentItem = async () => {
    const zone = zoneStates[activeZone];
    if (!zone.selectedItem || !saveName.trim()) return;
    try {
      await api.post("/saved-items", {
        itemId: zone.selectedItem.id,
        customColor: zone.colors.join(","),
        name: saveName,
      });
      setShowSaveItem(false);
      setSaveName("");
      showToast("Элемент сохранён!");
    } catch {
      showToast("Ошибка сохранения");
    }
  };

  const clearAll = () => {
    setZoneStates({
      top: { selectedItem: null, colors: ["#CCCCCC"] },
      middle: { selectedItem: null, colors: ["#CCCCCC"] },
      bottom: { selectedItem: null, colors: ["#CCCCCC"] },
    });
  };

  // Get zone names for the active item
  const activeState = zoneStates[activeZone];
  const activeZoneNames = activeState.selectedItem
    ? getZoneNames(activeState.selectedItem.svgTemplate)
    : [];

  return (
    <div style={s.page}>
      {/* Sidebar */}
      <div style={s.sidebar}>
        <div style={s.sidebarHeader}>
          <div style={s.sidebarTitle}>Элементы одежды</div>
        </div>

        <div style={s.zoneTabs}>
          {zones.map((z) => (
            <button
              key={z.key}
              style={{
                ...s.zoneTab,
                ...(activeZone === z.key ? s.zoneTabActive : {}),
              }}
              onClick={() => setActiveZone(z.key)}
            >
              {z.icon} {z.label}
            </button>
          ))}
        </div>

        <div style={s.itemsGrid}>
          {filteredItems.map((item) => {
            const isSelected =
              zoneStates[activeZone].selectedItem?.id === item.id;
            const displayColors = isSelected
              ? zoneStates[activeZone].colors.join(",")
              : item.defaultColor;
            return (
              <div
                key={item.id}
                style={s.itemCard}
                onClick={() => selectItem(item)}
              >
                <ClothingPreview
                  svgTemplate={item.svgTemplate}
                  color={displayColors}
                  size={120}
                  selected={isSelected}
                />
                <span style={s.itemName}>{item.name}</span>
              </div>
            );
          })}
        </div>

        {activeState.selectedItem && (
          <div style={s.colorSection}>
            <div style={s.colorTitle}>
              Цвета: {activeState.selectedItem.name}
            </div>
            {activeZoneNames.map((zoneName, i) => (
              <div key={i} style={s.zoneColorRow}>
                <div style={s.zoneLabel}>
                  <span
                    style={{
                      ...s.zoneDot,
                      backgroundColor: activeState.colors[i] || "#CCC",
                    }}
                  />
                  {zoneName}
                </div>
                <ColorPicker
                  color={activeState.colors[i] || "#CCCCCC"}
                  onChange={(c) => changeZoneColor(i, c)}
                />
              </div>
            ))}
            <button
              style={{ ...s.btnSecondary, width: "100%", marginTop: "12px" }}
              onClick={() => {
                setSaveName(activeState.selectedItem!.name);
                setShowSaveItem(true);
              }}
            >
              Сохранить элемент
            </button>
          </div>
        )}
      </div>

      {/* Center: Mannequin */}
      <div style={s.center}>
        <div style={s.mannequinContainer}>
          {/* Body silhouette */}
          <div
            style={s.mannequinBody}
            dangerouslySetInnerHTML={{ __html: mannequinBodySvg }}
          />

          {/* Clothing slots */}
          {zones.map((z) => {
            const state = zoneStates[z.key];
            return (
              <div
                key={z.key}
                style={{
                  ...s.mannequinSlot,
                  ...slotPositions[z.key],
                  ...(activeZone === z.key ? s.mannequinSlotActive : {}),
                }}
                onClick={() => setActiveZone(z.key)}
              >
                {state.selectedItem ? (
                  <ClothingPreview
                    svgTemplate={state.selectedItem.svgTemplate}
                    color={state.colors.join(",")}
                    size={
                      z.key === "top"
                        ? 130
                        : z.key === "middle"
                        ? 230
                        : 230
                    }
                  />
                ) : (
                  <div style={s.placeholderSlot}>
                    {z.icon} {z.label}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={s.actions}>
          <button style={s.btnSecondary} onClick={clearAll}>
            Очистить
          </button>
          <button
            style={s.btnSave}
            onClick={() => {
              setSaveName("");
              setShowSaveOutfit(true);
            }}
          >
            Сохранить образ
          </button>
        </div>
      </div>

      {/* Save Outfit Modal */}
      {showSaveOutfit && (
        <div style={s.saveModal} onClick={() => setShowSaveOutfit(false)}>
          <div style={s.saveModalCard} onClick={(e) => e.stopPropagation()}>
            <div style={s.saveModalTitle}>Сохранить образ</div>
            <input
              style={s.input}
              placeholder="Название образа"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && saveOutfit()}
            />
            <div style={s.saveModalBtns}>
              <button
                style={s.btnSecondary}
                onClick={() => setShowSaveOutfit(false)}
              >
                Отмена
              </button>
              <button style={s.btnSave} onClick={saveOutfit}>
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save Item Modal */}
      {showSaveItem && (
        <div style={s.saveModal} onClick={() => setShowSaveItem(false)}>
          <div style={s.saveModalCard} onClick={(e) => e.stopPropagation()}>
            <div style={s.saveModalTitle}>Сохранить элемент</div>
            <input
              style={s.input}
              placeholder="Название"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && saveCurrentItem()}
            />
            <div style={s.saveModalBtns}>
              <button
                style={s.btnSecondary}
                onClick={() => setShowSaveItem(false)}
              >
                Отмена
              </button>
              <button style={s.btnSave} onClick={saveCurrentItem}>
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <div style={s.toast}>{toast}</div>}
    </div>
  );
}
