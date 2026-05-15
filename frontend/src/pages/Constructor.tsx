import { useState, useEffect, CSSProperties } from "react";
import api from "../services/api";
import ColorPicker from "../components/ColorPicker";
import ClothingPreview from "../components/ClothingPreview";

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
  color: string;
}

const zones = [
  { key: "top", label: "Голова", icon: "🎩" },
  { key: "middle", label: "Торс", icon: "👕" },
  { key: "bottom", label: "Ноги", icon: "👖" },
] as const;

type ZoneKey = (typeof zones)[number]["key"];

const s: Record<string, CSSProperties> = {
  page: {
    display: "flex",
    height: "calc(100vh - 64px)",
    overflow: "hidden",
  },
  sidebar: {
    width: "320px",
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
  center: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "var(--bg-secondary)",
    position: "relative",
  },
  mannequin: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
    padding: "20px",
  },
  mannequinZone: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer",
    borderRadius: "12px",
    padding: "8px",
    transition: "all 0.2s",
    minHeight: "80px",
    justifyContent: "center",
  },
  mannequinZoneActive: {
    background: "rgba(230, 0, 35, 0.05)",
    outline: "2px dashed var(--primary)",
  },
  placeholder: {
    width: "140px",
    height: "80px",
    border: "2px dashed var(--border)",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--text-secondary)",
    fontSize: "13px",
  },
  actions: {
    position: "absolute",
    bottom: "24px",
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
  },
  btnSecondary: {
    padding: "12px 28px",
    borderRadius: "28px",
    fontSize: "14px",
    fontWeight: 600,
    color: "var(--text)",
    background: "#fff",
    border: "2px solid var(--border)",
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

export default function Constructor() {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [activeZone, setActiveZone] = useState<ZoneKey>("top");
  const [zoneStates, setZoneStates] = useState<Record<ZoneKey, ZoneState>>({
    top: { selectedItem: null, color: "#CCCCCC" },
    middle: { selectedItem: null, color: "#CCCCCC" },
    bottom: { selectedItem: null, color: "#CCCCCC" },
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
    setZoneStates((prev) => ({
      ...prev,
      [activeZone]: { selectedItem: item, color: item.defaultColor },
    }));
  };

  const changeColor = (color: string) => {
    setZoneStates((prev) => ({
      ...prev,
      [activeZone]: { ...prev[activeZone], color },
    }));
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
        topColor: zoneStates.top.selectedItem ? zoneStates.top.color : null,
        middleItemId: zoneStates.middle.selectedItem?.id || null,
        middleColor: zoneStates.middle.selectedItem
          ? zoneStates.middle.color
          : null,
        bottomItemId: zoneStates.bottom.selectedItem?.id || null,
        bottomColor: zoneStates.bottom.selectedItem
          ? zoneStates.bottom.color
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
        customColor: zone.color,
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
      top: { selectedItem: null, color: "#CCCCCC" },
      middle: { selectedItem: null, color: "#CCCCCC" },
      bottom: { selectedItem: null, color: "#CCCCCC" },
    });
  };

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
          {filteredItems.map((item) => (
            <div key={item.id} style={s.itemCard} onClick={() => selectItem(item)}>
              <ClothingPreview
                svgTemplate={item.svgTemplate}
                color={
                  zoneStates[activeZone].selectedItem?.id === item.id
                    ? zoneStates[activeZone].color
                    : item.defaultColor
                }
                size={100}
                selected={zoneStates[activeZone].selectedItem?.id === item.id}
              />
              <span style={s.itemName}>{item.name}</span>
            </div>
          ))}
        </div>

        {zoneStates[activeZone].selectedItem && (
          <div style={s.colorSection}>
            <div style={s.colorTitle}>
              Цвет: {zoneStates[activeZone].selectedItem!.name}
            </div>
            <ColorPicker
              color={zoneStates[activeZone].color}
              onChange={changeColor}
            />
            <button
              style={{ ...s.btnSecondary, width: "100%", marginTop: "12px" }}
              onClick={() => {
                setSaveName(zoneStates[activeZone].selectedItem!.name);
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
        <div style={s.mannequin}>
          {zones.map((z) => {
            const state = zoneStates[z.key];
            return (
              <div
                key={z.key}
                style={{
                  ...s.mannequinZone,
                  ...(activeZone === z.key ? s.mannequinZoneActive : {}),
                }}
                onClick={() => setActiveZone(z.key)}
              >
                {state.selectedItem ? (
                  <ClothingPreview
                    svgTemplate={state.selectedItem.svgTemplate}
                    color={state.color}
                    size={z.key === "middle" ? 180 : z.key === "bottom" ? 180 : 120}
                  />
                ) : (
                  <div style={s.placeholder}>{z.icon} {z.label}</div>
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
