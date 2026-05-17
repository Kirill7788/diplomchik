import { useState, useEffect, useRef, CSSProperties } from "react";
import api from "../services/api";
import ClothingPreview from "../components/ClothingPreview";

interface Category {
  id: number;
  name: string;
  zone: string;
  displayOrder: number;
  items: Item[];
}

interface Item {
  id: number;
  name: string;
  categoryId: number;
  svgTemplate: string;
  defaultColor: string;
  isActive: boolean;
  category?: Category;
}

const s: Record<string, CSSProperties> = {
  page: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "32px 24px",
  },
  title: {
    fontSize: "32px",
    fontWeight: 800,
    marginBottom: "8px",
  },
  subtitle: {
    fontSize: "14px",
    color: "var(--text-secondary)",
    marginBottom: "32px",
  },
  section: {
    marginBottom: "40px",
  },
  sectionTitle: {
    fontSize: "20px",
    fontWeight: 700,
    marginBottom: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "#fff",
    borderRadius: "var(--radius)",
    overflow: "hidden",
    boxShadow: "var(--shadow)",
  },
  th: {
    padding: "12px 16px",
    textAlign: "left",
    fontSize: "13px",
    fontWeight: 600,
    color: "var(--text-secondary)",
    background: "var(--bg-secondary)",
    borderBottom: "1px solid var(--border)",
  },
  td: {
    padding: "12px 16px",
    fontSize: "14px",
    borderBottom: "1px solid var(--border)",
    verticalAlign: "middle",
  },
  badge: {
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: 600,
  },
  badgeActive: {
    background: "#dcfce7",
    color: "#16a34a",
  },
  badgeInactive: {
    background: "#fee2e2",
    color: "#dc2626",
  },
  btnSmall: {
    padding: "6px 14px",
    borderRadius: "16px",
    fontSize: "12px",
    fontWeight: 600,
    border: "none",
    cursor: "pointer",
    marginRight: "6px",
  },
  btnAdd: {
    padding: "8px 20px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: 600,
    color: "#fff",
    background: "var(--primary)",
    border: "none",
    cursor: "pointer",
  },
  modal: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000,
  },
  modalCard: {
    background: "#fff",
    borderRadius: "var(--radius)",
    padding: "32px",
    width: "500px",
    maxWidth: "90vw",
    maxHeight: "80vh",
    overflowY: "auto",
  },
  modalTitle: {
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
    marginBottom: "4px",
  },
  input: {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "8px",
    border: "2px solid var(--border)",
    fontSize: "14px",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "8px",
    border: "2px solid var(--border)",
    fontSize: "13px",
    fontFamily: "monospace",
    minHeight: "120px",
    resize: "vertical" as const,
    boxSizing: "border-box",
  },
  select: {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "8px",
    border: "2px solid var(--border)",
    fontSize: "14px",
    background: "#fff",
    boxSizing: "border-box",
  },
  modalBtns: {
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end",
    marginTop: "20px",
  },
  previewBox: {
    display: "flex",
    justifyContent: "center",
    padding: "16px",
    background: "var(--bg-secondary)",
    borderRadius: "8px",
    marginBottom: "16px",
  },
};

export default function Admin() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [showAddItem, setShowAddItem] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editItem, setEditItem] = useState<Item | null>(null);
  const svgFileRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formCategoryId, setFormCategoryId] = useState<number>(0);
  const [formSvg, setFormSvg] = useState("");
  const [formColor, setFormColor] = useState("#CCCCCC");
  const [formCatName, setFormCatName] = useState("");
  const [formCatZone, setFormCatZone] = useState("");
  const [toast, setToast] = useState("");

  const fetchData = async () => {
    const [catRes, itemRes] = await Promise.all([
      api.get("/admin/categories"),
      api.get("/admin/items"),
    ]);
    setCategories(catRes.data);
    setAllItems(itemRes.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleAddCategory = async () => {
    if (!formCatName || !formCatZone) return;
    await api.post("/admin/categories", {
      name: formCatName,
      zone: formCatZone,
    });
    setShowAddCategory(false);
    setFormCatName("");
    setFormCatZone("");
    fetchData();
    showToast("Категория добавлена");
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm("Удалить категорию и все её элементы?")) return;
    await api.delete(`/admin/categories/${id}`);
    fetchData();
    showToast("Категория удалена");
  };

  const handleAddItem = async () => {
    if (!formName || !formCategoryId || !formSvg) return;
    await api.post("/admin/items", {
      name: formName,
      categoryId: formCategoryId,
      svgTemplate: formSvg,
      defaultColor: formColor,
    });
    setShowAddItem(false);
    resetForm();
    fetchData();
    showToast("Элемент добавлен");
  };

  const handleEditItem = async () => {
    if (!editItem) return;
    await api.put(`/admin/items/${editItem.id}`, {
      name: formName,
      categoryId: formCategoryId,
      svgTemplate: formSvg,
      defaultColor: formColor,
    });
    setEditItem(null);
    resetForm();
    fetchData();
    showToast("Элемент обновлён");
  };

  const handleToggleActive = async (item: Item) => {
    await api.put(`/admin/items/${item.id}`, { isActive: !item.isActive });
    fetchData();
  };

  const handleDeleteItem = async (id: number) => {
    if (!confirm("Удалить элемент?")) return;
    await api.delete(`/admin/items/${id}`);
    fetchData();
    showToast("Элемент удалён");
  };

  const resetForm = () => {
    setFormName("");
    setFormCategoryId(0);
    setFormSvg("");
    setFormColor("#CCCCCC");
  };

  const openEdit = (item: Item) => {
    setFormName(item.name);
    setFormCategoryId(item.categoryId);
    setFormSvg(item.svgTemplate);
    setFormColor(item.defaultColor);
    setEditItem(item);
  };

  const handleSvgFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      if (text) setFormSvg(text.trim());
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  // Get unique zones from existing categories
  const existingZones = [...new Set(categories.map((c) => c.zone))];

  return (
    <div style={s.page}>
      <h1 style={s.title}>Панель администратора</h1>
      <p style={s.subtitle}>
        Управление категориями и элементами одежды
      </p>

      {/* Categories */}
      <div style={s.section}>
        <div style={s.sectionTitle}>
          <span>Категории</span>
          <button style={s.btnAdd} onClick={() => setShowAddCategory(true)}>
            + Добавить категорию
          </button>
        </div>
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>ID</th>
              <th style={s.th}>Название</th>
              <th style={s.th}>Зона</th>
              <th style={s.th}>Элементов</th>
              <th style={s.th}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td style={s.td}>{cat.id}</td>
                <td style={s.td}>{cat.name}</td>
                <td style={s.td}>
                  <span
                    style={{
                      ...s.badge,
                      background: "#e0f2fe",
                      color: "#0369a1",
                    }}
                  >
                    {cat.zone}
                  </span>
                </td>
                <td style={s.td}>{cat.items.length}</td>
                <td style={s.td}>
                  <button
                    style={{ ...s.btnSmall, background: "#fee2e2", color: "#dc2626" }}
                    onClick={() => handleDeleteCategory(cat.id)}
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Items */}
      <div style={s.section}>
        <div style={s.sectionTitle}>
          <span>Элементы одежды</span>
          <button
            style={s.btnAdd}
            onClick={() => {
              resetForm();
              setShowAddItem(true);
            }}
          >
            + Добавить элемент
          </button>
        </div>
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>Превью</th>
              <th style={s.th}>Название</th>
              <th style={s.th}>Категория</th>
              <th style={s.th}>Цвет</th>
              <th style={s.th}>Статус</th>
              <th style={s.th}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {allItems.map((item) => (
              <tr key={item.id}>
                <td style={s.td}>
                  <ClothingPreview
                    svgTemplate={item.svgTemplate}
                    color={item.defaultColor}
                    size={50}
                  />
                </td>
                <td style={s.td}>{item.name}</td>
                <td style={s.td}>{item.category?.name || "—"}</td>
                <td style={s.td}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    {item.defaultColor.split(",").map((c, idx) => (
                      <div
                        key={idx}
                        style={{
                          width: "16px",
                          height: "16px",
                          borderRadius: "50%",
                          background: c.trim(),
                          border: "1px solid var(--border)",
                        }}
                      />
                    ))}
                  </div>
                </td>
                <td style={s.td}>
                  <span
                    style={{
                      ...s.badge,
                      ...(item.isActive ? s.badgeActive : s.badgeInactive),
                    }}
                  >
                    {item.isActive ? "Активен" : "Скрыт"}
                  </span>
                </td>
                <td style={s.td}>
                  <button
                    style={{
                      ...s.btnSmall,
                      background: item.isActive ? "#fef3c7" : "#dcfce7",
                      color: item.isActive ? "#92400e" : "#16a34a",
                    }}
                    onClick={() => handleToggleActive(item)}
                  >
                    {item.isActive ? "Скрыть" : "Показать"}
                  </button>
                  <button
                    style={{ ...s.btnSmall, background: "#e0f2fe", color: "#0369a1" }}
                    onClick={() => openEdit(item)}
                  >
                    Изменить
                  </button>
                  <button
                    style={{ ...s.btnSmall, background: "#fee2e2", color: "#dc2626" }}
                    onClick={() => handleDeleteItem(item.id)}
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Category Modal */}
      {showAddCategory && (
        <div style={s.modal} onClick={() => setShowAddCategory(false)}>
          <div style={s.modalCard} onClick={(e) => e.stopPropagation()}>
            <div style={s.modalTitle}>Новая категория</div>
            <div style={s.field}>
              <label style={s.label}>Название</label>
              <input
                style={s.input}
                value={formCatName}
                onChange={(e) => setFormCatName(e.target.value)}
                placeholder="Например: Аксессуары"
              />
            </div>
            <div style={s.field}>
              <label style={s.label}>Зона (идентификатор)</label>
              <input
                style={s.input}
                value={formCatZone}
                onChange={(e) => setFormCatZone(e.target.value)}
                placeholder="Например: top, middle, bottom, shoes или своя"
              />
              {existingZones.length > 0 && (
                <div style={{ marginTop: "8px", display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Существующие:</span>
                  {existingZones.map((z) => (
                    <button
                      key={z}
                      onClick={() => setFormCatZone(z)}
                      style={{
                        ...s.btnSmall,
                        background: formCatZone === z ? "var(--primary)" : "#e0f2fe",
                        color: formCatZone === z ? "#fff" : "#0369a1",
                        fontSize: "11px",
                        padding: "3px 10px",
                        marginRight: 0,
                      }}
                    >
                      {z}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div style={s.modalBtns}>
              <button
                style={{ ...s.btnSmall, background: "var(--bg-secondary)" }}
                onClick={() => setShowAddCategory(false)}
              >
                Отмена
              </button>
              <button style={s.btnAdd} onClick={handleAddCategory}>
                Добавить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Item Modal */}
      {(showAddItem || editItem) && (
        <div
          style={s.modal}
          onClick={() => {
            setShowAddItem(false);
            setEditItem(null);
          }}
        >
          <div style={s.modalCard} onClick={(e) => e.stopPropagation()}>
            <div style={s.modalTitle}>
              {editItem ? "Редактировать элемент" : "Новый элемент"}
            </div>

            {formSvg && (
              <div style={s.previewBox}>
                <ClothingPreview
                  svgTemplate={formSvg}
                  color={formColor}
                  size={100}
                />
              </div>
            )}

            <div style={s.field}>
              <label style={s.label}>Название</label>
              <input
                style={s.input}
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Например: Куртка-бомбер"
              />
            </div>
            <div style={s.field}>
              <label style={s.label}>Категория</label>
              <select
                style={s.select}
                value={formCategoryId}
                onChange={(e) => setFormCategoryId(Number(e.target.value))}
              >
                <option value={0}>Выберите категорию</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} ({cat.zone})
                  </option>
                ))}
              </select>
            </div>
            <div style={s.field}>
              <label style={s.label}>SVG шаблон</label>
              <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                <button
                  style={{
                    ...s.btnSmall,
                    background: "#e0f2fe",
                    color: "#0369a1",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                  onClick={() => svgFileRef.current?.click()}
                >
                  📁 Импорт SVG файла
                </button>
                <input
                  ref={svgFileRef}
                  type="file"
                  accept=".svg"
                  style={{ display: "none" }}
                  onChange={handleSvgFileImport}
                />
              </div>
              <textarea
                style={s.textarea}
                value={formSvg}
                onChange={(e) => setFormSvg(e.target.value)}
                placeholder='<svg viewBox="0 0 300 320">...</svg> (используйте FILL_COLOR_1, FILL_COLOR_2, FILL_COLOR_3 для заливки)'
              />
            </div>
            <div style={s.field}>
              <label style={s.label}>Цвета по умолчанию (через запятую)</label>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <input
                  style={{ ...s.input, flex: 1 }}
                  value={formColor}
                  onChange={(e) => setFormColor(e.target.value)}
                  placeholder="#FF0000,#00FF00,#0000FF"
                />
              </div>
              <div style={{ marginTop: "8px", display: "flex", gap: "6px" }}>
                {formColor.split(",").map((c, idx) => (
                  <div
                    key={idx}
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      background: c.trim(),
                      border: "2px solid var(--border)",
                    }}
                  />
                ))}
              </div>
            </div>
            <div style={s.modalBtns}>
              <button
                style={{ ...s.btnSmall, background: "var(--bg-secondary)" }}
                onClick={() => {
                  setShowAddItem(false);
                  setEditItem(null);
                }}
              >
                Отмена
              </button>
              <button
                style={s.btnAdd}
                onClick={editItem ? handleEditItem : handleAddItem}
              >
                {editItem ? "Сохранить" : "Добавить"}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            background: "#333",
            color: "#fff",
            padding: "12px 24px",
            borderRadius: "12px",
            fontSize: "14px",
            zIndex: 3000,
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}
