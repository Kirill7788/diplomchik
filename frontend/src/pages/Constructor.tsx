import { useState, useEffect, CSSProperties } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
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

interface ZoneTransform {
  offsetX: number;
  offsetY: number;
  rotation: number;
  scale: number;
}

interface ZoneState {
  selectedItem: ClothingItem | null;
  colors: string[];
  transform: ZoneTransform;
}

const defaultTransform: ZoneTransform = { offsetX: 0, offsetY: 0, rotation: 0, scale: 1 };

const zones = [
  { key: "top", label: "Голова", icon: "🎩" },
  { key: "middle", label: "Торс", icon: "👕" },
  { key: "bottom", label: "Ноги", icon: "👖" },
  { key: "shoes", label: "Обувь", icon: "👟" },
] as const;

type ZoneKey = (typeof zones)[number]["key"];

const mannequinBodySvg = `<svg viewBox="0 0 300 620" xmlns="http://www.w3.org/2000/svg" style="opacity:0.18">
  <ellipse cx="150" cy="50" rx="30" ry="36" fill="#c9a882" stroke="#b8956e" stroke-width="1.5"/>
  <rect x="141" y="86" width="18" height="18" rx="5" fill="#c9a882"/>
  <path d="M141 102 L82 122 L72 136 L70 150 L84 148 L90 133 L141 120 L141 300 L159 300 L159 120 L210 133 L216 148 L230 150 L228 136 L218 122 L159 102" fill="#c9a882" stroke="#b8956e" stroke-width="1.2"/>
  <path d="M70 150 L64 250 L62 275 L76 277 L78 255 L84 150" fill="#c9a882" stroke="#b8956e" stroke-width="1.2"/>
  <path d="M230 150 L236 250 L238 275 L224 277 L222 255 L216 150" fill="#c9a882" stroke="#b8956e" stroke-width="1.2"/>
  <path d="M125 300 L120 420 L114 520 L108 548 L108 565 L100 572 L88 575 L86 580 L108 580 L112 575 L140 575 L140 548 L140 520 L135 425 L140 305" fill="#c9a882" stroke="#b8956e" stroke-width="1.2"/>
  <path d="M175 300 L180 420 L186 520 L192 548 L192 565 L200 572 L212 575 L214 580 L192 580 L188 575 L160 575 L160 548 L160 520 L165 425 L160 305" fill="#c9a882" stroke="#b8956e" stroke-width="1.2"/>
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
    padding: "12px 4px",
    textAlign: "center",
    fontSize: "12px",
    fontWeight: 600,
    cursor: "pointer",
    borderBottom: "3px solid transparent",
    transition: "all 0.2s",
    background: "transparent",
    color: "var(--text-secondary)",
    border: "none",
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
    width: "280px",
    height: "510px",
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
    outline: "2px dashed var(--primary)",
    background: "rgba(230, 0, 35, 0.04)",
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
    background: "transparent",
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

const arrowBtn: CSSProperties = {
  width: "32px",
  height: "32px",
  borderRadius: "8px",
  border: "1px solid var(--border)",
  background: "#fff",
  cursor: "pointer",
  fontSize: "14px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 700,
};

const slotPositions: Record<ZoneKey, CSSProperties> = {
  top: { top: "0px", width: "140px", height: "70px" },
  middle: { top: "62px", width: "200px", height: "180px" },
  bottom: { top: "230px", width: "170px", height: "210px" },
  shoes: { top: "430px", width: "200px", height: "60px" },
};

const slotSizes: Record<ZoneKey, number> = {
  top: 70,
  middle: 180,
  bottom: 210,
  shoes: 60,
};

export default function Constructor() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const editOutfitId = searchParams.get("edit");
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [activeZone, setActiveZone] = useState<ZoneKey>("top");
  const [zoneStates, setZoneStates] = useState<Record<ZoneKey, ZoneState>>({
    top: { selectedItem: null, colors: ["#CCCCCC"], transform: { ...defaultTransform } },
    middle: { selectedItem: null, colors: ["#CCCCCC"], transform: { ...defaultTransform } },
    bottom: { selectedItem: null, colors: ["#CCCCCC"], transform: { ...defaultTransform } },
    shoes: { selectedItem: null, colors: ["#CCCCCC"], transform: { ...defaultTransform } },
  });
  const [showSaveOutfit, setShowSaveOutfit] = useState(false);
  const [showSaveItem, setShowSaveItem] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [editOutfitName, setEditOutfitName] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    api.get("/clothing/items").then((res) => {
      setItems(res.data);
      if (editOutfitId) {
        api.get("/outfits").then((outRes) => {
          const outfit = outRes.data.find((o: { id: number }) => o.id === Number(editOutfitId));
          if (outfit) {
            setEditOutfitName(outfit.name);
            const allItems = res.data as ClothingItem[];
            const transforms = outfit.previewData ? JSON.parse(outfit.previewData) : {};
            const newStates: Record<ZoneKey, ZoneState> = {
              top: { selectedItem: null, colors: ["#CCCCCC"], transform: transforms.top || { ...defaultTransform } },
              middle: { selectedItem: null, colors: ["#CCCCCC"], transform: transforms.middle || { ...defaultTransform } },
              bottom: { selectedItem: null, colors: ["#CCCCCC"], transform: transforms.bottom || { ...defaultTransform } },
              shoes: { selectedItem: null, colors: ["#CCCCCC"], transform: transforms.shoes || { ...defaultTransform } },
            };
            if (outfit.topItem) {
              const found = allItems.find((i: ClothingItem) => i.id === outfit.topItem.id);
              if (found) newStates.top = { ...newStates.top, selectedItem: found, colors: (outfit.topColor || found.defaultColor).split(",") };
            }
            if (outfit.middleItem) {
              const found = allItems.find((i: ClothingItem) => i.id === outfit.middleItem.id);
              if (found) newStates.middle = { ...newStates.middle, selectedItem: found, colors: (outfit.middleColor || found.defaultColor).split(",") };
            }
            if (outfit.bottomItem) {
              const found = allItems.find((i: ClothingItem) => i.id === outfit.bottomItem.id);
              if (found) newStates.bottom = { ...newStates.bottom, selectedItem: found, colors: (outfit.bottomColor || found.defaultColor).split(",") };
            }
            if (outfit.shoesItem) {
              const found = allItems.find((i: ClothingItem) => i.id === outfit.shoesItem.id);
              if (found) newStates.shoes = { ...newStates.shoes, selectedItem: found, colors: (outfit.shoesColor || found.defaultColor).split(",") };
            }
            setZoneStates(newStates);
          }
        });
      }
    });
  }, [editOutfitId]);

  const filteredItems = items.filter((i) => i.category.zone === activeZone);

  const selectItem = (item: ClothingItem) => {
    const colors = item.defaultColor.split(",");
    setZoneStates((prev) => ({
      ...prev,
      [activeZone]: { selectedItem: item, colors, transform: { ...defaultTransform } },
    }));
  };

  const moveItem = (axis: "offsetX" | "offsetY", delta: number) => {
    setZoneStates((prev) => ({
      ...prev,
      [activeZone]: {
        ...prev[activeZone],
        transform: {
          ...prev[activeZone].transform,
          [axis]: prev[activeZone].transform[axis] + delta,
        },
      },
    }));
  };

  const rotateItem = (delta: number) => {
    setZoneStates((prev) => ({
      ...prev,
      [activeZone]: {
        ...prev[activeZone],
        transform: {
          ...prev[activeZone].transform,
          rotation: prev[activeZone].transform.rotation + delta,
        },
      },
    }));
  };

  const scaleItem = (delta: number) => {
    setZoneStates((prev) => {
      const newScale = Math.max(0.3, Math.min(3, prev[activeZone].transform.scale + delta));
      return {
        ...prev,
        [activeZone]: {
          ...prev[activeZone],
          transform: { ...prev[activeZone].transform, scale: newScale },
        },
      };
    });
  };

  const resetTransform = () => {
    setZoneStates((prev) => ({
      ...prev,
      [activeZone]: {
        ...prev[activeZone],
        transform: { ...defaultTransform },
      },
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

  const getOutfitPayload = () => ({
    topItemId: zoneStates.top.selectedItem?.id || null,
    topColor: zoneStates.top.selectedItem ? zoneStates.top.colors.join(",") : null,
    middleItemId: zoneStates.middle.selectedItem?.id || null,
    middleColor: zoneStates.middle.selectedItem ? zoneStates.middle.colors.join(",") : null,
    bottomItemId: zoneStates.bottom.selectedItem?.id || null,
    bottomColor: zoneStates.bottom.selectedItem ? zoneStates.bottom.colors.join(",") : null,
    shoesItemId: zoneStates.shoes.selectedItem?.id || null,
    shoesColor: zoneStates.shoes.selectedItem ? zoneStates.shoes.colors.join(",") : null,
    previewData: JSON.stringify({
      top: zoneStates.top.transform,
      middle: zoneStates.middle.transform,
      bottom: zoneStates.bottom.transform,
      shoes: zoneStates.shoes.transform,
    }),
  });

  const saveOutfit = async () => {
    if (!saveName.trim()) return;
    try {
      await api.post("/outfits", { name: saveName, ...getOutfitPayload() });
      setShowSaveOutfit(false);
      setSaveName("");
      showToast("Образ сохранён!");
    } catch {
      showToast("Ошибка сохранения");
    }
  };

  const updateOutfit = async () => {
    if (!editOutfitId) return;
    try {
      await api.put(`/outfits/${editOutfitId}`, { name: editOutfitName, ...getOutfitPayload() });
      showToast("Образ обновлён!");
      navigate("/my-outfits");
    } catch {
      showToast("Ошибка обновления");
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
      top: { selectedItem: null, colors: ["#CCCCCC"], transform: { ...defaultTransform } },
      middle: { selectedItem: null, colors: ["#CCCCCC"], transform: { ...defaultTransform } },
      bottom: { selectedItem: null, colors: ["#CCCCCC"], transform: { ...defaultTransform } },
      shoes: { selectedItem: null, colors: ["#CCCCCC"], transform: { ...defaultTransform } },
    });
  };

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
              onClick={() => setActiveZone(z.key as ZoneKey)}
            >
              {z.icon} {z.label}
            </button>
          ))}
        </div>

        <div style={s.itemsGrid}>
          {filteredItems.map((item) => {
            const isSelected = zoneStates[activeZone].selectedItem?.id === item.id;
            const displayColors = isSelected
              ? zoneStates[activeZone].colors.join(",")
              : item.defaultColor;
            return (
              <div key={item.id} style={s.itemCard} onClick={() => selectItem(item)}>
                <ClothingPreview
                  svgTemplate={item.svgTemplate}
                  color={displayColors}
                  size={140}
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
          <div
            style={s.mannequinBody}
            dangerouslySetInnerHTML={{ __html: mannequinBodySvg }}
          />

          {zones.map((z) => {
            const zk = z.key as ZoneKey;
            const state = zoneStates[zk];
            const tf = state.transform;
            const isShoes = zk === "shoes";
            return (
              <div
                key={z.key}
                style={{
                  ...s.mannequinSlot,
                  ...slotPositions[zk],
                  ...(activeZone === z.key ? s.mannequinSlotActive : {}),
                  transform: `translateX(calc(-50% + ${tf.offsetX}px)) translateY(${tf.offsetY}px)`,
                }}
                onClick={() => setActiveZone(zk)}
              >
                {state.selectedItem ? (
                  isShoes ? (
                    <div style={{ display: "flex", gap: "4px", transform: `rotate(${tf.rotation}deg) scale(${tf.scale})` }}>
                      <div style={{ transform: "scaleX(-1)" }}>
                        <ClothingPreview
                          svgTemplate={state.selectedItem.svgTemplate}
                          color={state.colors.join(",")}
                          size={Math.floor(slotSizes[zk] * 0.9)}
                          transparent
                        />
                      </div>
                      <ClothingPreview
                        svgTemplate={state.selectedItem.svgTemplate}
                        color={state.colors.join(",")}
                        size={Math.floor(slotSizes[zk] * 0.9)}
                        transparent
                      />
                    </div>
                  ) : (
                    <div style={{ transform: `rotate(${tf.rotation}deg) scale(${tf.scale})` }}>
                      <ClothingPreview
                        svgTemplate={state.selectedItem.svgTemplate}
                        color={state.colors.join(",")}
                        size={slotSizes[zk]}
                        transparent
                      />
                    </div>
                  )
                ) : (
                  <div style={s.placeholderSlot}>
                    {z.icon} {z.label}
                  </div>
                )}
              </div>
            );
          })}

          {/* Position & Rotation Controls — overlay near active item */}
          {activeState.selectedItem && (() => {
            const pos = slotPositions[activeZone];
            const topVal = parseInt(String(pos.top) || "0", 10);
            const hVal = parseInt(String(pos.height) || "60", 10);
            return (
              <div
                style={{
                  position: "absolute",
                  top: `${topVal + hVal / 2 - 52}px`,
                  right: "-110px",
                  background: "#fff",
                  borderRadius: "12px",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
                  padding: "8px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "4px",
                  zIndex: 10,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <button onClick={() => moveItem("offsetY", -3)} style={arrowBtn}>&#9650;</button>
                <div style={{ display: "flex", gap: "4px" }}>
                  <button onClick={() => moveItem("offsetX", -3)} style={arrowBtn}>&#9664;</button>
                  <button onClick={resetTransform} style={{ ...arrowBtn, fontSize: "10px" }}>&#8634;</button>
                  <button onClick={() => moveItem("offsetX", 3)} style={arrowBtn}>&#9654;</button>
                </div>
                <button onClick={() => moveItem("offsetY", 3)} style={arrowBtn}>&#9660;</button>
                <div style={{ display: "flex", gap: "2px", marginTop: "4px" }}>
                  <button onClick={() => rotateItem(-5)} style={{ ...arrowBtn, fontSize: "11px", width: "36px" }}>-5°</button>
                  <span style={{ fontSize: "11px", fontWeight: 600, minWidth: "30px", textAlign: "center", lineHeight: "32px" }}>{activeState.transform.rotation}°</span>
                  <button onClick={() => rotateItem(5)} style={{ ...arrowBtn, fontSize: "11px", width: "36px" }}>+5°</button>
                </div>
                <div style={{ display: "flex", gap: "2px", marginTop: "2px" }}>
                  <button onClick={() => scaleItem(-0.1)} style={{ ...arrowBtn, fontSize: "13px", width: "36px" }}>−</button>
                  <span style={{ fontSize: "11px", fontWeight: 600, minWidth: "36px", textAlign: "center", lineHeight: "32px" }}>{Math.round(activeState.transform.scale * 100)}%</span>
                  <button onClick={() => scaleItem(0.1)} style={{ ...arrowBtn, fontSize: "13px", width: "36px" }}>+</button>
                </div>
              </div>
            );
          })()}
        </div>

        <div style={s.actions}>
          <button style={s.btnSecondary} onClick={clearAll}>
            Очистить
          </button>
          {editOutfitId ? (
            <button style={s.btnSave} onClick={updateOutfit}>
              Сохранить изменения
            </button>
          ) : (
            <button
              style={s.btnSave}
              onClick={() => {
                setSaveName("");
                setShowSaveOutfit(true);
              }}
            >
              Сохранить образ
            </button>
          )}
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
              <button style={s.btnSecondary} onClick={() => setShowSaveOutfit(false)}>
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
              <button style={s.btnSecondary} onClick={() => setShowSaveItem(false)}>
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
