import React, { useState, useRef, useCallback, useEffect, useMemo, createContext, useContext, useReducer } from "react";
import {
  Sofa, Bed, Armchair, Lamp, Flower2, Box, Table2, BookOpen, ChefHat,
  Plus, Search, Undo2, Redo2, Save, Download, Trash2, RotateCw,
  ChevronLeft, ChevronRight, X, Check, Sparkles, Grid3x3, Moon, Sun,
  Copy, Layers, ZoomIn, ZoomOut, Maximize2, Image as ImageIcon, FileText,
  Link2, Settings2, Home, PanelLeftClose, PanelRightClose, PanelLeft, PanelRight,
  AlertTriangle, ArrowLeftRight
} from "lucide-react";

/* ============================================================
   InteriorCraft AI — Workspace
   A premium, glassmorphic home interior layout planner.
   Built with plain React state (no external state/animation libs
   available in this runtime) — drag/resize/rotate are hand-rolled
   with pointer events; motion uses CSS transitions/keyframes.
   ============================================================ */

/* ---------------- Design tokens ---------------- */
const COLORS = {
  sage: "#84A98C",
  sageDeep: "#52796F",
  beige: "#EDE0D4",
  terracotta: "#D4A373",
  cream: "#FAF7F2",
  charcoal: "#2F3E46",
};

/* ---------------- Furniture catalog data ---------------- */
const CATEGORIES = [
  { id: "sofas", label: "Sofas", icon: Sofa },
  { id: "chairs", label: "Chairs", icon: Armchair },
  { id: "tables", label: "Tables", icon: Table2 },
  { id: "beds", label: "Beds", icon: Bed },
  { id: "storage", label: "Storage", icon: Box },
  { id: "decor", label: "Decor", icon: BookOpen },
  { id: "lighting", label: "Lighting", icon: Lamp },
  { id: "plants", label: "Plants", icon: Flower2 },
  { id: "kitchen", label: "Kitchen", icon: ChefHat },
];

const STYLES = ["Modern", "Minimal", "Scandinavian", "Luxury", "Vintage"];

const CATALOG = [
  { id: "f1", name: "Sectional Sofa", cat: "sofas", style: "Modern", w: 220, h: 90, color: "#84A98C" },
  { id: "f2", name: "Loveseat", cat: "sofas", style: "Minimal", w: 150, h: 85, color: "#A3B899" },
  { id: "f3", name: "Chesterfield Sofa", cat: "sofas", style: "Vintage", w: 200, h: 95, color: "#B08968" },
  { id: "f4", name: "Accent Chair", cat: "chairs", style: "Scandinavian", w: 70, h: 70, color: "#D4A373" },
  { id: "f5", name: "Dining Chair", cat: "chairs", style: "Minimal", w: 45, h: 50, color: "#E6CCB2" },
  { id: "f6", name: "Lounge Chair", cat: "chairs", style: "Luxury", w: 80, h: 85, color: "#C9967A" },
  { id: "f7", name: "Coffee Table", cat: "tables", style: "Modern", w: 110, h: 60, color: "#8C7A6B" },
  { id: "f8", name: "Dining Table", cat: "tables", style: "Scandinavian", w: 160, h: 90, color: "#A1887F" },
  { id: "f9", name: "Side Table", cat: "tables", style: "Minimal", w: 45, h: 45, color: "#BCAAA4" },
  { id: "f10", name: "Queen Bed", cat: "beds", style: "Modern", w: 160, h: 200, color: "#84A98C" },
  { id: "f11", name: "King Bed", cat: "beds", style: "Luxury", w: 195, h: 205, color: "#52796F" },
  { id: "f12", name: "Single Bed", cat: "beds", style: "Minimal", w: 95, h: 195, color: "#A3B899" },
  { id: "f13", name: "Bookshelf", cat: "storage", style: "Scandinavian", w: 90, h: 35, color: "#9C6644" },
  { id: "f14", name: "Wardrobe", cat: "storage", style: "Modern", w: 120, h: 60, color: "#7F5539" },
  { id: "f15", name: "TV Console", cat: "storage", style: "Minimal", w: 150, h: 40, color: "#B08968" },
  { id: "f16", name: "Area Rug", cat: "decor", style: "Vintage", w: 200, h: 140, color: "#DDA15E" },
  { id: "f17", name: "Wall Art", cat: "decor", style: "Modern", w: 60, h: 6, color: "#606C38" },
  { id: "f18", name: "Mirror", cat: "decor", style: "Luxury", w: 50, h: 6, color: "#BC6C25" },
  { id: "f19", name: "Floor Lamp", cat: "lighting", style: "Scandinavian", w: 35, h: 35, color: "#D4A373" },
  { id: "f20", name: "Pendant Light", cat: "lighting", style: "Modern", w: 30, h: 30, color: "#84A98C" },
  { id: "f21", name: "Table Lamp", cat: "lighting", style: "Minimal", w: 22, h: 22, color: "#EDE0D4" },
  { id: "f22", name: "Fiddle Leaf Fig", cat: "plants", style: "Scandinavian", w: 45, h: 45, color: "#52796F" },
  { id: "f23", name: "Snake Plant", cat: "plants", style: "Minimal", w: 30, h: 30, color: "#40916C" },
  { id: "f24", name: "Monstera", cat: "plants", style: "Modern", w: 50, h: 50, color: "#2D6A4F" },
  { id: "f25", name: "Kitchen Island", cat: "kitchen", style: "Modern", w: 140, h: 80, color: "#8C7A6B" },
  { id: "f26", name: "Bar Stool", cat: "kitchen", style: "Minimal", w: 35, h: 35, color: "#BCAAA4" },
];

const ROOM_TEMPLATES = [
  { id: "bedroom", label: "Bedroom", w: 14, h: 12, defaults: ["f10", "f14", "f21"] },
  { id: "living", label: "Living Room", w: 16, h: 13, defaults: ["f1", "f7", "f15", "f16"] },
  { id: "office", label: "Office", w: 12, h: 10, defaults: ["f9", "f5", "f13"] },
  { id: "study", label: "Study Room", w: 10, h: 9, defaults: ["f13", "f5"] },
  { id: "kitchen", label: "Kitchen", w: 14, h: 11, defaults: ["f25", "f26"] },
  { id: "custom", label: "Custom Room", w: 12, h: 12, defaults: [] },
];

/* ---------------- ID helper ---------------- */
let _id = 1000;
const nextId = () => `item-${_id++}`;

/* ============================================================
   Store — useReducer-based, exposed via Context (Zustand-shaped API)
   ============================================================ */
const StoreCtx = createContext(null);

const initialRoom = { name: "Living Room", w: 16, h: 13, unit: "ft" };

function storeReducer(state, action) {
  switch (action.type) {
    case "SET_ROOM":
      return { ...state, room: { ...state.room, ...action.payload } };
    case "ADD_ITEM": {
      const items = [...state.items, action.payload];
      return pushHistory({ ...state, items, selectedId: action.payload.id });
    }
    case "UPDATE_ITEM": {
      const items = state.items.map((it) =>
        it.id === action.id ? { ...it, ...action.payload } : it
      );
      return { ...state, items };
    }
    case "COMMIT_ITEM_CHANGE": {
      // pushes to history (called on drag/resize end, not every frame)
      return pushHistory(state);
    }
    case "DELETE_ITEM": {
      const items = state.items.filter((it) => it.id !== action.id);
      return pushHistory({ ...state, items, selectedId: null });
    }
    case "DUPLICATE_ITEM": {
      const orig = state.items.find((it) => it.id === action.id);
      if (!orig) return state;
      const copy = { ...orig, id: nextId(), x: orig.x + 20, y: orig.y + 20 };
      return pushHistory({ ...state, items: [...state.items, copy], selectedId: copy.id });
    }
    case "SELECT":
      return { ...state, selectedId: action.id };
    case "SET_ITEMS":
      return pushHistory({ ...state, items: action.payload });
    case "RESET_LAYOUT":
      return pushHistory({ ...state, items: [], selectedId: null });
    case "UNDO": {
      if (state.historyIndex <= 0) return state;
      const idx = state.historyIndex - 1;
      return { ...state, items: state.history[idx], historyIndex: idx, selectedId: null };
    }
    case "REDO": {
      if (state.historyIndex >= state.history.length - 1) return state;
      const idx = state.historyIndex + 1;
      return { ...state, items: state.history[idx], historyIndex: idx, selectedId: null };
    }
    case "LOAD_LAYOUT":
      return pushHistory({
        ...state,
        items: action.payload.items,
        room: action.payload.room,
        selectedId: null,
      });
    default:
      return state;
  }
}

function pushHistory(state) {
  const trimmed = state.history.slice(0, state.historyIndex + 1);
  const newHistory = [...trimmed, state.items];
  return { ...state, history: newHistory, historyIndex: newHistory.length - 1 };
}

function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(storeReducer, {
    room: initialRoom,
    items: [],
    selectedId: null,
    history: [[]],
    historyIndex: 0,
  });
  return <StoreCtx.Provider value={{ state, dispatch }}>{children}</StoreCtx.Provider>;
}
function useStore() {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

/* ============================================================
   Utility: localStorage layouts
   ============================================================ */
const LAYOUTS_KEY = "interiorcraft_layouts_v1";
function loadSavedLayouts() {
  try {
    const raw = window.localStorage?.getItem(LAYOUTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function persistSavedLayouts(layouts) {
  try {
    window.localStorage?.setItem(LAYOUTS_KEY, JSON.stringify(layouts));
  } catch {
    /* storage unavailable — silently no-op */
  }
}

/* ============================================================
   Toast / notification system
   ============================================================ */
const ToastCtx = createContext(null);
function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((msg, kind = "success") => {
    const id = nextId();
    setToasts((t) => [...t, { id, msg, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2 items-end">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="toast-in flex items-center gap-2 rounded-2xl px-4 py-3 shadow-xl backdrop-blur-xl border text-sm font-medium"
            style={{
              background: t.kind === "success" ? "rgba(132,169,140,0.92)" : "rgba(47,62,70,0.92)",
              color: "white",
              borderColor: "rgba(255,255,255,0.25)",
            }}
          >
            {t.kind === "success" ? <Check size={16} /> : <AlertTriangle size={16} />}
            {t.msg}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
function useToast() {
  return useContext(ToastCtx);
}

/* ============================================================
   Root App — handles top-level routing between wizard & workspace
   ============================================================ */
export default function InteriorCraftWorkspace() {
  const [stage, setStage] = useState("templates"); // templates | wizard | workspace
  const [draftRoom, setDraftRoom] = useState(null);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    try {
      const pref = window.localStorage?.getItem("interiorcraft_theme");
      if (pref === "dark") setDark(true);
    } catch {}
  }, []);
  useEffect(() => {
    try {
      window.localStorage?.setItem("interiorcraft_theme", dark ? "dark" : "light");
    } catch {}
  }, [dark]);

  return (
    <StoreProvider>
      <ToastProvider>
        <div className={dark ? "dark" : ""}>
          <div
            className="w-full min-h-screen transition-colors duration-500"
            style={{
              background: dark
                ? "linear-gradient(135deg,#1f2a2e 0%, #2F3E46 60%, #243034 100%)"
                : "linear-gradient(135deg,#FAF7F2 0%, #F3ECE3 50%, #EDE0D4 100%)",
              fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif",
            }}
          >
            <GoogleFontLoader />
            {stage === "templates" && (
              <TemplatePicker
                dark={dark}
                setDark={setDark}
                onPick={(tpl) => {
                  setDraftRoom(tpl);
                  setStage("wizard");
                }}
              />
            )}
            {stage === "wizard" && (
              <RoomWizard
                dark={dark}
                template={draftRoom}
                onBack={() => setStage("templates")}
                onComplete={(room) => {
                  setDraftRoom({ ...draftRoom, ...room });
                  setStage("workspace");
                }}
              />
            )}
            {stage === "workspace" && (
              <Workspace
                dark={dark}
                setDark={setDark}
                template={draftRoom}
                onExit={() => setStage("templates")}
              />
            )}
          </div>
        </div>
      </ToastProvider>
    </StoreProvider>
  );
}

function GoogleFontLoader() {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);
  return null;
}

/* ============================================================
   STAGE 1 — Template Picker
   ============================================================ */
function TemplatePicker({ onPick, dark, setDark }) {
  const roomThumbs = {
    bedroom: "🛏️",
    living: "🛋️",
    office: "🪑",
    study: "📚",
    kitchen: "🍽️",
    custom: "✦",
  };
  return (
    <div className="max-w-6xl mx-auto px-6 py-14 fade-up">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg"
            style={{ background: `linear-gradient(135deg, ${COLORS.sage}, ${COLORS.sageDeep})` }}
          >
            <Home size={20} color="white" />
          </div>
          <div>
            <div
              className="text-xl font-bold leading-none"
              style={{ fontFamily: "Fraunces, serif", color: dark ? COLORS.cream : COLORS.charcoal }}
            >
              InteriorCraft <span style={{ color: COLORS.sage }}>AI</span>
            </div>
            <div className="text-xs opacity-60" style={{ color: dark ? COLORS.beige : COLORS.charcoal }}>
              Design. Visualize. Transform.
            </div>
          </div>
        </div>
        <button
          onClick={() => setDark(!dark)}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-105"
          style={{ background: dark ? "rgba(255,255,255,0.1)" : "rgba(47,62,70,0.08)" }}
        >
          {dark ? <Sun size={17} color={COLORS.beige} /> : <Moon size={17} color={COLORS.charcoal} />}
        </button>
      </div>

      <h1
        className="text-4xl md:text-5xl font-bold mb-2 tracking-tight"
        style={{ fontFamily: "Fraunces, serif", color: dark ? COLORS.cream : COLORS.charcoal }}
      >
        Select a room type
      </h1>
      <p className="mb-10 text-base opacity-70" style={{ color: dark ? COLORS.beige : COLORS.charcoal }}>
        Choose a template to start with sensible defaults, or build from a blank canvas.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
        {ROOM_TEMPLATES.map((tpl, i) => (
          <button
            key={tpl.id}
            onClick={() => onPick(tpl)}
            className="group relative rounded-3xl p-6 text-left overflow-hidden card-rise"
            style={{
              animationDelay: `${i * 60}ms`,
              background: dark
                ? "rgba(255,255,255,0.05)"
                : "rgba(255,255,255,0.55)",
              backdropFilter: "blur(16px)",
              border: dark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(255,255,255,0.7)",
              boxShadow: "0 8px 30px rgba(47,62,70,0.08)",
            }}
          >
            <div
              className="w-full h-28 rounded-2xl mb-4 flex items-center justify-center text-4xl transition-transform duration-300 group-hover:scale-105"
              style={{
                background: tpl.id === "custom"
                  ? `repeating-linear-gradient(45deg, ${COLORS.beige}55, ${COLORS.beige}55 10px, transparent 10px, transparent 20px)`
                  : `linear-gradient(135deg, ${COLORS.beige}, ${COLORS.sage}33)`,
              }}
            >
              {tpl.id === "custom" ? <Plus size={32} color={COLORS.sageDeep} /> : roomThumbs[tpl.id]}
            </div>
            <div
              className="font-semibold text-lg mb-1"
              style={{ color: dark ? COLORS.cream : COLORS.charcoal, fontFamily: "Fraunces, serif" }}
            >
              {tpl.label}
            </div>
            <div className="text-xs opacity-60" style={{ color: dark ? COLORS.beige : COLORS.charcoal }}>
              {tpl.id === "custom" ? "Start from scratch" : `${tpl.w} × ${tpl.h} ft suggested`}
            </div>
            <div
              className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: COLORS.sage }}
            >
              <ChevronRight size={15} color="white" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   STAGE 2 — Room Setup Wizard
   ============================================================ */
function RoomWizard({ template, onBack, onComplete, dark }) {
  const [step, setStep] = useState(0);
  const [width, setWidth] = useState(template.w);
  const [height, setHeight] = useState(template.h);
  const [unit, setUnit] = useState("ft");
  const [style, setStyle] = useState("Modern");
  const steps = ["Room Dimensions", "Room Style", "Lighting"];

  return (
    <div className="max-w-4xl mx-auto px-6 py-14 fade-up">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm mb-8 opacity-70 hover:opacity-100 transition-opacity"
        style={{ color: dark ? COLORS.beige : COLORS.charcoal }}
      >
        <ChevronLeft size={16} /> Back to templates
      </button>

      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-10">
        {/* Step rail */}
        <div className="flex md:flex-col gap-3">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2.5">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors"
                style={{
                  background: i <= step ? COLORS.sage : dark ? "rgba(255,255,255,0.1)" : "rgba(47,62,70,0.1)",
                  color: i <= step ? "white" : dark ? COLORS.beige : COLORS.charcoal,
                }}
              >
                {i + 1}
              </div>
              <span
                className="text-sm hidden md:inline"
                style={{ color: dark ? COLORS.cream : COLORS.charcoal, opacity: i === step ? 1 : 0.5 }}
              >
                {s}
              </span>
            </div>
          ))}
        </div>

        {/* Step content */}
        <div
          className="rounded-3xl p-8"
          style={{
            background: dark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.6)",
            backdropFilter: "blur(16px)",
            border: dark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(255,255,255,0.7)",
            boxShadow: "0 8px 30px rgba(47,62,70,0.08)",
          }}
        >
          {step === 0 && (
            <div className="fade-in">
              <h2
                className="text-2xl font-bold mb-1"
                style={{ fontFamily: "Fraunces, serif", color: dark ? COLORS.cream : COLORS.charcoal }}
              >
                Room dimensions
              </h2>
              <p className="text-sm opacity-60 mb-6" style={{ color: dark ? COLORS.beige : COLORS.charcoal }}>
                Set the size of your room. You can change this later.
              </p>
              <div className="grid grid-cols-2 gap-5 mb-6">
                <Field label="Width" dark={dark}>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={width}
                      onChange={(e) => setWidth(Math.max(4, Number(e.target.value) || 0))}
                      className="input-soft"
                    />
                    <span className="text-sm opacity-60">{unit}</span>
                  </div>
                </Field>
                <Field label="Height" dark={dark}>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(Math.max(4, Number(e.target.value) || 0))}
                      className="input-soft"
                    />
                    <span className="text-sm opacity-60">{unit}</span>
                  </div>
                </Field>
              </div>
              <div className="flex items-center justify-center rounded-2xl p-8 mb-2" style={{ background: dark ? "rgba(0,0,0,0.2)" : COLORS.cream }}>
                <div
                  className="relative border-2 rounded-lg transition-all duration-300"
                  style={{
                    width: Math.min(280, width * 14),
                    height: Math.min(220, height * 14),
                    borderColor: COLORS.sage,
                    background: `repeating-linear-gradient(0deg, transparent, transparent 13px, ${COLORS.sage}22 13px, ${COLORS.sage}22 14px), repeating-linear-gradient(90deg, transparent, transparent 13px, ${COLORS.sage}22 13px, ${COLORS.sage}22 14px)`,
                  }}
                >
                  <span
                    className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs opacity-60"
                    style={{ color: dark ? COLORS.beige : COLORS.charcoal }}
                  >
                    {width} {unit}
                  </span>
                  <span
                    className="absolute top-1/2 -left-8 -translate-y-1/2 -rotate-90 text-xs opacity-60"
                    style={{ color: dark ? COLORS.beige : COLORS.charcoal }}
                  >
                    {height} {unit}
                  </span>
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="fade-in">
              <h2
                className="text-2xl font-bold mb-1"
                style={{ fontFamily: "Fraunces, serif", color: dark ? COLORS.cream : COLORS.charcoal }}
              >
                Room style
              </h2>
              <p className="text-sm opacity-60 mb-6" style={{ color: dark ? COLORS.beige : COLORS.charcoal }}>
                Pick a starting aesthetic — this filters your suggested furniture.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {STYLES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setStyle(s)}
                    className="rounded-2xl px-4 py-4 text-sm font-medium transition-all border-2"
                    style={{
                      borderColor: style === s ? COLORS.sage : "transparent",
                      background: style === s ? `${COLORS.sage}22` : dark ? "rgba(255,255,255,0.05)" : "white",
                      color: dark ? COLORS.cream : COLORS.charcoal,
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="fade-in">
              <h2
                className="text-2xl font-bold mb-1"
                style={{ fontFamily: "Fraunces, serif", color: dark ? COLORS.cream : COLORS.charcoal }}
              >
                Lighting mood
              </h2>
              <p className="text-sm opacity-60 mb-6" style={{ color: dark ? COLORS.beige : COLORS.charcoal }}>
                You're all set. We'll drop in a few starter pieces for a {ROOM_TEMPLATES.find(t=>t.id===template.id)?.label?.toLowerCase() || "room"}.
              </p>
              <div
                className="rounded-2xl p-6 flex items-center gap-4"
                style={{ background: `linear-gradient(135deg, ${COLORS.beige}55, ${COLORS.sage}22)` }}
              >
                <Sparkles size={28} color={COLORS.sageDeep} />
                <div>
                  <div className="font-semibold" style={{ color: dark ? COLORS.cream : COLORS.charcoal }}>
                    Ready to design
                  </div>
                  <div className="text-xs opacity-70" style={{ color: dark ? COLORS.beige : COLORS.charcoal }}>
                    {width}{unit} × {height}{unit} · {style} style
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              className="px-5 py-2.5 rounded-xl text-sm font-medium transition-opacity"
              style={{
                opacity: step === 0 ? 0.3 : 0.8,
                color: dark ? COLORS.cream : COLORS.charcoal,
                pointerEvents: step === 0 ? "none" : "auto",
              }}
            >
              Previous
            </button>
            <button
              onClick={() => {
                if (step < steps.length - 1) setStep((s) => s + 1);
                else onComplete({ w: width, h: height, unit, style, name: template.label });
              }}
              className="btn-primary"
            >
              {step < steps.length - 1 ? "Next" : "Start designing"}
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children, dark }) {
  return (
    <label className="block">
      <span className="text-xs font-medium opacity-60 mb-1.5 block" style={{ color: dark ? COLORS.beige : COLORS.charcoal }}>
        {label}
      </span>
      {children}
    </label>
  );
}

/* ============================================================
   STAGE 3 — Workspace (the core app)
   ============================================================ */
const PX_PER_FT = 28; // canvas scale baseline

function Workspace({ dark, setDark, template, onExit }) {
  const { state, dispatch } = useStore();
  const toast = useToast();
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [activeCat, setActiveCat] = useState("sofas");
  const [search, setSearch] = useState("");
  const [styleFilter, setStyleFilter] = useState(null);
  const [snap, setSnap] = useState(true);
  const [view, setView] = useState("2d"); // 2d | 3d
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showSavedDrawer, setShowSavedDrawer] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [savedLayouts, setSavedLayouts] = useState(() => loadSavedLayouts());
  const [guides, setGuides] = useState({ v: null, h: null });
  const [generating, setGenerating] = useState(false);
  const [mobileSheet, setMobileSheet] = useState(null); // null | 'catalog' | 'props'
  const canvasRef = useRef(null);

  // Initialize room from wizard/template
  useEffect(() => {
    dispatch({ type: "SET_ROOM", payload: { name: template.name, w: template.w, h: template.h, unit: template.unit || "ft" } });
    const defaults = ROOM_TEMPLATES.find((t) => t.id === template.id)?.defaults || [];
    if (defaults.length && state.items.length === 0) {
      const seeded = defaults.map((fid, i) => {
        const base = CATALOG.find((c) => c.id === fid);
        return {
          id: nextId(),
          catalogId: base.id,
          name: base.name,
          cat: base.cat,
          x: 40 + i * 30,
          y: 40 + i * 20,
          w: base.w,
          h: base.h,
          rotation: 0,
          color: base.color,
          layer: i,
        };
      });
      dispatch({ type: "SET_ITEMS", payload: seeded });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selected = state.items.find((it) => it.id === state.selectedId);

  /* ----- keyboard shortcuts ----- */
  useEffect(() => {
    const handler = (e) => {
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        dispatch({ type: "UNDO" });
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
        e.preventDefault();
        dispatch({ type: "REDO" });
      } else if (e.key === "Delete" || e.key === "Backspace") {
        if (state.selectedId) {
          e.preventDefault();
          dispatch({ type: "DELETE_ITEM", id: state.selectedId });
        }
      } else if (e.key.toLowerCase() === "r" && state.selectedId) {
        const it = state.items.find((i) => i.id === state.selectedId);
        if (it) dispatch({ type: "UPDATE_ITEM", id: it.id, payload: { rotation: (it.rotation + 45) % 360 } });
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [state.selectedId, state.items, dispatch]);

  /* ----- add furniture (click-to-add, since native HTML5 DnD is unreliable in iframes) ----- */
  const addFurniture = useCallback(
    (item) => {
      const newItem = {
        id: nextId(),
        catalogId: item.id,
        name: item.name,
        cat: item.cat,
        x: 60,
        y: 60,
        w: item.w,
        h: item.h,
        rotation: 0,
        color: item.color,
        layer: state.items.length,
      };
      dispatch({ type: "ADD_ITEM", payload: newItem });
      toast(`${item.name} added`, "success");
      setMobileSheet(null);
    },
    [dispatch, state.items.length, toast]
  );

  const filtered = CATALOG.filter((c) => {
    if (activeCat && c.cat !== activeCat) return false;
    if (styleFilter && c.style !== styleFilter) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  /* ----- AI layout suggestion (rule-based smart arrangement) ----- */
  const generateLayout = useCallback(() => {
    setGenerating(true);
    setTimeout(() => {
      const roomWpx = state.room.w * PX_PER_FT;
      const roomHpx = state.room.h * PX_PER_FT;
      const margin = 16;
      // simple shelf-packing: sort by area desc, place against walls/grid
      const sorted = [...state.items].sort((a, b) => b.w * b.h - a.w * a.h);
      let cursorX = margin, cursorY = margin, rowH = 0;
      const placed = sorted.map((it) => {
        if (cursorX + it.w + margin > roomWpx) {
          cursorX = margin;
          cursorY += rowH + margin;
          rowH = 0;
        }
        const pos = { ...it, x: cursorX, y: cursorY };
        cursorX += it.w + margin;
        rowH = Math.max(rowH, it.h);
        return pos;
      });
      dispatch({ type: "SET_ITEMS", payload: placed });
      setGenerating(false);
      toast("AI suggestion applied — layout optimized", "success");
    }, 900);
  }, [state.items, state.room, dispatch, toast]);

  /* ----- save / load layouts ----- */
  const saveLayout = (name) => {
    const layout = {
      id: nextId(),
      name: name || state.room.name || "Untitled",
      room: state.room,
      items: state.items,
      updatedAt: Date.now(),
    };
    const next = [layout, ...savedLayouts];
    setSavedLayouts(next);
    persistSavedLayouts(next);
    setShowSaveModal(false);
    toast("Design saved successfully");
  };
  const deleteLayout = (id) => {
    const next = savedLayouts.filter((l) => l.id !== id);
    setSavedLayouts(next);
    persistSavedLayouts(next);
  };
  const duplicateLayout = (id) => {
    const orig = savedLayouts.find((l) => l.id === id);
    if (!orig) return;
    const copy = { ...orig, id: nextId(), name: `${orig.name} copy`, updatedAt: Date.now() };
    const next = [copy, ...savedLayouts];
    setSavedLayouts(next);
    persistSavedLayouts(next);
  };
  const renameLayout = (id, name) => {
    const next = savedLayouts.map((l) => (l.id === id ? { ...l, name } : l));
    setSavedLayouts(next);
    persistSavedLayouts(next);
  };
  const loadLayout = (id) => {
    const layout = savedLayouts.find((l) => l.id === id);
    if (!layout) return;
    dispatch({ type: "LOAD_LAYOUT", payload: { items: layout.items, room: layout.room } });
    setShowSavedDrawer(false);
    toast(`Loaded "${layout.name}"`);
  };

  /* ----- export (canvas -> PNG via DOM rasterization) ----- */
  const exportPNG = async () => {
    const node = canvasRef.current;
    if (!node) return;
    try {
      // Build an off-DOM SVG-based snapshot since html2canvas isn't available;
      // we draw a simplified representation directly to a <canvas> element.
      const rect = node.getBoundingClientRect();
      const cnv = document.createElement("canvas");
      const scale = 2;
      cnv.width = rect.width * scale;
      cnv.height = rect.height * scale;
      const ctx = cnv.getContext("2d");
      ctx.scale(scale, scale);
      ctx.fillStyle = "#FAF7F2";
      ctx.fillRect(0, 0, rect.width, rect.height);
      // room outline
      ctx.strokeStyle = COLORS.sage;
      ctx.lineWidth = 2;
      ctx.strokeRect(8, 8, rect.width - 16, rect.height - 16);
      // furniture
      state.items.forEach((it) => {
        ctx.save();
        ctx.translate(it.x + it.w / 2 + 8, it.y + it.h / 2 + 8);
        ctx.rotate((it.rotation * Math.PI) / 180);
        ctx.fillStyle = it.color;
        ctx.globalAlpha = 0.85;
        roundRectPath(ctx, -it.w / 2, -it.h / 2, it.w, it.h, 8);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.fillStyle = "#2F3E46";
        ctx.font = "11px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(it.name, 0, 4);
        ctx.restore();
      });
      const url = cnv.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `${state.room.name || "layout"}.png`;
      a.click();
      toast("Exported as PNG");
    } catch (err) {
      toast("Export failed — try again", "error");
    }
    setShowExportModal(false);
  };

  const roomPxW = state.room.w * PX_PER_FT;
  const roomPxH = state.room.h * PX_PER_FT;

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      {/* Top nav */}
      <TopBar
        dark={dark}
        setDark={setDark}
        onExit={onExit}
        roomName={state.room.name}
        onUndo={() => dispatch({ type: "UNDO" })}
        onRedo={() => dispatch({ type: "REDO" })}
        canUndo={state.historyIndex > 0}
        canRedo={state.historyIndex < state.history.length - 1}
        onSave={() => setShowSaveModal(true)}
        onExport={() => setShowExportModal(true)}
        onOpenSaved={() => setShowSavedDrawer(true)}
        leftOpen={leftOpen}
        rightOpen={rightOpen}
        setLeftOpen={setLeftOpen}
        setRightOpen={setRightOpen}
        view={view}
        setView={setView}
      />

      <div className="flex-1 flex overflow-hidden relative">
        {/* Left: Furniture catalog (desktop) */}
        <div
          className={`hidden md:flex flex-col transition-all duration-300 overflow-hidden ${leftOpen ? "w-[280px]" : "w-0"}`}
          style={{
            background: dark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.5)",
            backdropFilter: "blur(16px)",
            borderRight: dark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(255,255,255,0.6)",
          }}
        >
          {leftOpen && (
            <CatalogPanel
              dark={dark}
              activeCat={activeCat}
              setActiveCat={setActiveCat}
              search={search}
              setSearch={setSearch}
              styleFilter={styleFilter}
              setStyleFilter={setStyleFilter}
              filtered={filtered}
              onAdd={addFurniture}
            />
          )}
        </div>

        {/* Center: Canvas */}
        <div className="flex-1 relative flex flex-col overflow-hidden">
          <CanvasToolbar
            dark={dark}
            zoom={zoom}
            setZoom={setZoom}
            snap={snap}
            setSnap={setSnap}
            onGenerate={generateLayout}
            generating={generating}
            onReset={() => setShowResetModal(true)}
            onCompare={() => setShowCompare(true)}
            roomDims={state.room}
            onDimsChange={(payload) => dispatch({ type: "SET_ROOM", payload })}
          />
          <div
            className="flex-1 overflow-auto relative flex items-center justify-center p-10"
            style={{ background: dark ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.25)" }}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) dispatch({ type: "SELECT", id: null });
            }}
          >
            <div
              ref={canvasRef}
              className="relative rounded-2xl shadow-2xl flex-shrink-0 room-canvas"
              style={{
                width: roomPxW * zoom,
                height: roomPxH * zoom,
                background: dark ? "#3a4a52" : "#FFFDF9",
                border: `3px solid ${dark ? COLORS.sageDeep : COLORS.sage}`,
                backgroundImage: `linear-gradient(${dark ? "rgba(255,255,255,0.05)" : "rgba(132,169,140,0.12)"} 1px, transparent 1px), linear-gradient(90deg, ${dark ? "rgba(255,255,255,0.05)" : "rgba(132,169,140,0.12)"} 1px, transparent 1px)`,
                backgroundSize: `${PX_PER_FT * zoom}px ${PX_PER_FT * zoom}px`,
              }}
              onMouseDown={(e) => {
                if (e.target === e.currentTarget) dispatch({ type: "SELECT", id: null });
              }}
            >
              {state.items.map((item) => (
                <FurnitureItem
                  key={item.id}
                  item={item}
                  zoom={zoom}
                  selected={state.selectedId === item.id}
                  dark={dark}
                  snap={snap}
                  bounds={{ w: roomPxW, h: roomPxH }}
                  allItems={state.items}
                  setGuides={setGuides}
                  onSelect={() => dispatch({ type: "SELECT", id: item.id })}
                  onChange={(payload) => dispatch({ type: "UPDATE_ITEM", id: item.id, payload })}
                  onCommit={() => dispatch({ type: "COMMIT_ITEM_CHANGE" })}
                />
              ))}
              {/* alignment guides */}
              {guides.v != null && (
                <div className="absolute top-0 bottom-0 w-px bg-[#D4A373] pointer-events-none z-30" style={{ left: guides.v }} />
              )}
              {guides.h != null && (
                <div className="absolute left-0 right-0 h-px bg-[#D4A373] pointer-events-none z-30" style={{ top: guides.h }} />
              )}

              {state.items.length === 0 && (
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 fade-in"
                  style={{ color: dark ? COLORS.beige : COLORS.charcoal, opacity: 0.5 }}
                >
                  <Sofa size={36} className="mb-2" />
                  <p className="text-sm">Add furniture from the catalog to start designing</p>
                </div>
              )}
            </div>

            {/* Mini map */}
            <MiniMap
              dark={dark}
              items={state.items}
              room={state.room}
              roomPxW={roomPxW}
              roomPxH={roomPxH}
            />
          </div>
        </div>

        {/* Right: Properties panel (desktop) */}
        <div
          className={`hidden md:flex flex-col transition-all duration-300 overflow-hidden ${rightOpen ? "w-[280px]" : "w-0"}`}
          style={{
            background: dark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.5)",
            backdropFilter: "blur(16px)",
            borderLeft: dark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(255,255,255,0.6)",
          }}
        >
          {rightOpen && (
            <PropertiesPanel
              dark={dark}
              item={selected}
              roomBounds={{ w: roomPxW, h: roomPxH }}
              onChange={(payload) => {
                dispatch({ type: "UPDATE_ITEM", id: selected.id, payload });
                dispatch({ type: "COMMIT_ITEM_CHANGE" });
              }}
              onDelete={() => dispatch({ type: "DELETE_ITEM", id: selected.id })}
              onDuplicate={() => dispatch({ type: "DUPLICATE_ITEM", id: selected.id })}
              onLayerChange={(dir) => {
                const maxLayer = Math.max(0, ...state.items.map((i) => i.layer));
                const newLayer = dir === "up" ? Math.min(maxLayer + 1, selected.layer + 1) : Math.max(0, selected.layer - 1);
                dispatch({ type: "UPDATE_ITEM", id: selected.id, payload: { layer: newLayer } });
              }}
            />
          )}
        </div>

        {/* Mobile bottom bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex gap-2 p-3" style={{ background: dark ? "rgba(30,38,42,0.9)" : "rgba(255,255,255,0.9)", backdropFilter: "blur(16px)" }}>
          <button onClick={() => setMobileSheet("catalog")} className="flex-1 btn-secondary text-sm justify-center">
            <Sofa size={16} /> Furniture
          </button>
          <button
            onClick={() => setMobileSheet("props")}
            className="flex-1 btn-secondary text-sm justify-center"
            disabled={!selected}
            style={{ opacity: selected ? 1 : 0.4 }}
          >
            <Settings2 size={16} /> Properties
          </button>
        </div>

        {/* Mobile bottom sheets */}
        {mobileSheet === "catalog" && (
          <BottomSheet onClose={() => setMobileSheet(null)} dark={dark} title="Furniture catalog">
            <CatalogPanel
              dark={dark}
              activeCat={activeCat}
              setActiveCat={setActiveCat}
              search={search}
              setSearch={setSearch}
              styleFilter={styleFilter}
              setStyleFilter={setStyleFilter}
              filtered={filtered}
              onAdd={addFurniture}
            />
          </BottomSheet>
        )}
        {mobileSheet === "props" && selected && (
          <BottomSheet onClose={() => setMobileSheet(null)} dark={dark} title="Properties">
            <PropertiesPanel
              dark={dark}
              item={selected}
              roomBounds={{ w: roomPxW, h: roomPxH }}
              onChange={(payload) => {
                dispatch({ type: "UPDATE_ITEM", id: selected.id, payload });
                dispatch({ type: "COMMIT_ITEM_CHANGE" });
              }}
              onDelete={() => {
                dispatch({ type: "DELETE_ITEM", id: selected.id });
                setMobileSheet(null);
              }}
              onDuplicate={() => dispatch({ type: "DUPLICATE_ITEM", id: selected.id })}
              onLayerChange={(dir) => {
                const maxLayer = Math.max(0, ...state.items.map((i) => i.layer));
                const newLayer = dir === "up" ? Math.min(maxLayer + 1, selected.layer + 1) : Math.max(0, selected.layer - 1);
                dispatch({ type: "UPDATE_ITEM", id: selected.id, payload: { layer: newLayer } });
              }}
            />
          </BottomSheet>
        )}
      </div>

      {/* Modals */}
      {showSaveModal && (
        <SaveModal dark={dark} defaultName={state.room.name} onClose={() => setShowSaveModal(false)} onSave={saveLayout} />
      )}
      {showExportModal && (
        <ExportModal dark={dark} onClose={() => setShowExportModal(false)} onExportPNG={exportPNG} />
      )}
      {showResetModal && (
        <ConfirmModal
          dark={dark}
          title="Reset layout?"
          message="This removes all furniture from the canvas. This can't be undone with redo after closing."
          confirmLabel="Reset layout"
          onCancel={() => setShowResetModal(false)}
          onConfirm={() => {
            dispatch({ type: "RESET_LAYOUT" });
            setShowResetModal(false);
            toast("Layout reset");
          }}
        />
      )}
      {showSavedDrawer && (
        <SavedLayoutsDrawer
          dark={dark}
          layouts={savedLayouts}
          onClose={() => setShowSavedDrawer(false)}
          onLoad={loadLayout}
          onDelete={deleteLayout}
          onDuplicate={duplicateLayout}
          onRename={renameLayout}
        />
      )}
      {showCompare && (
        <CompareModal dark={dark} onClose={() => setShowCompare(false)} />
      )}

      <style>{GLOBAL_CSS}</style>
    </div>
  );
}

function roundRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/* ============================================================
   Top Bar
   ============================================================ */
function TopBar({ dark, setDark, onExit, roomName, onUndo, onRedo, canUndo, canRedo, onSave, onExport, onOpenSaved, leftOpen, rightOpen, setLeftOpen, setRightOpen, view, setView }) {
  return (
    <div
      className="flex items-center justify-between px-4 py-2.5 z-30 flex-shrink-0"
      style={{
        background: dark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.65)",
        backdropFilter: "blur(16px)",
        borderBottom: dark ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(255,255,255,0.7)",
      }}
    >
      <div className="flex items-center gap-3">
        <button onClick={onExit} className="flex items-center gap-2 group">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
            style={{ background: `linear-gradient(135deg, ${COLORS.sage}, ${COLORS.sageDeep})` }}
          >
            <Home size={15} color="white" />
          </div>
        </button>
        <div className="hidden sm:block w-px h-6" style={{ background: dark ? "rgba(255,255,255,0.1)" : "rgba(47,62,70,0.15)" }} />
        <span className="text-sm font-semibold hidden sm:inline" style={{ color: dark ? COLORS.cream : COLORS.charcoal, fontFamily: "Fraunces, serif" }}>
          {roomName || "Untitled room"}
        </span>

        <button
          onClick={() => setLeftOpen((v) => !v)}
          className="hidden md:flex w-8 h-8 rounded-lg items-center justify-center ml-2 transition-colors hover:bg-black/5"
          title="Toggle furniture panel"
        >
          {leftOpen ? <PanelLeftClose size={15} style={{ color: dark ? COLORS.beige : COLORS.charcoal }} /> : <PanelLeft size={15} style={{ color: dark ? COLORS.beige : COLORS.charcoal }} />}
        </button>
      </div>

      <div className="flex items-center gap-1.5">
        <IconBtn dark={dark} onClick={onUndo} disabled={!canUndo} title="Undo (Ctrl+Z)">
          <Undo2 size={15} />
        </IconBtn>
        <IconBtn dark={dark} onClick={onRedo} disabled={!canRedo} title="Redo (Ctrl+Y)">
          <Redo2 size={15} />
        </IconBtn>
        <div className="w-px h-5 mx-1" style={{ background: dark ? "rgba(255,255,255,0.1)" : "rgba(47,62,70,0.15)" }} />
        <div
          className="hidden sm:flex rounded-lg overflow-hidden text-xs font-medium"
          style={{ background: dark ? "rgba(255,255,255,0.06)" : "rgba(47,62,70,0.06)" }}
        >
          <button
            onClick={() => setView("2d")}
            className="px-3 py-1.5 transition-colors"
            style={{ background: view === "2d" ? COLORS.sage : "transparent", color: view === "2d" ? "white" : dark ? COLORS.beige : COLORS.charcoal }}
          >
            2D
          </button>
          <button
            onClick={() => setView("3d")}
            className="px-3 py-1.5 transition-colors"
            style={{ background: view === "3d" ? COLORS.sage : "transparent", color: view === "3d" ? "white" : dark ? COLORS.beige : COLORS.charcoal }}
          >
            3D
          </button>
        </div>
        <button onClick={onOpenSaved} className="btn-secondary text-xs hidden sm:flex">
          <Layers size={14} /> My Designs
        </button>
        <button onClick={onSave} className="btn-secondary text-xs">
          <Save size={14} /> <span className="hidden sm:inline">Save</span>
        </button>
        <button onClick={onExport} className="btn-primary text-xs">
          <Download size={14} /> <span className="hidden sm:inline">Export</span>
        </button>
        <button
          onClick={() => setDark(!dark)}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-black/5 ml-1"
        >
          {dark ? <Sun size={15} color={COLORS.beige} /> : <Moon size={15} color={COLORS.charcoal} />}
        </button>
        <button
          onClick={() => setRightOpen((v) => !v)}
          className="hidden md:flex w-8 h-8 rounded-lg items-center justify-center transition-colors hover:bg-black/5"
          title="Toggle properties panel"
        >
          {rightOpen ? <PanelRightClose size={15} style={{ color: dark ? COLORS.beige : COLORS.charcoal }} /> : <PanelRight size={15} style={{ color: dark ? COLORS.beige : COLORS.charcoal }} />}
        </button>
      </div>
    </div>
  );
}

function IconBtn({ children, dark, disabled, ...props }) {
  return (
    <button
      {...props}
      disabled={disabled}
      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-black/5 disabled:opacity-30"
      style={{ color: dark ? COLORS.beige : COLORS.charcoal }}
    >
      {children}
    </button>
  );
}

/* ============================================================
   Catalog Panel (left sidebar)
   ============================================================ */
function CatalogPanel({ dark, activeCat, setActiveCat, search, setSearch, styleFilter, setStyleFilter, filtered, onAdd }) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-3 flex-shrink-0">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50" style={{ color: dark ? COLORS.beige : COLORS.charcoal }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search furniture..."
            className="w-full pl-9 pr-3 py-2 rounded-xl text-sm outline-none transition-all"
            style={{
              background: dark ? "rgba(255,255,255,0.06)" : "white",
              color: dark ? COLORS.cream : COLORS.charcoal,
              border: dark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(47,62,70,0.1)",
            }}
          />
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {STYLES.map((s) => (
            <button
              key={s}
              onClick={() => setStyleFilter(styleFilter === s ? null : s)}
              className="px-2.5 py-1 rounded-full text-[11px] font-medium transition-all"
              style={{
                background: styleFilter === s ? COLORS.terracotta : dark ? "rgba(255,255,255,0.06)" : "rgba(47,62,70,0.06)",
                color: styleFilter === s ? "white" : dark ? COLORS.beige : COLORS.charcoal,
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex overflow-x-auto px-3 gap-1 flex-shrink-0 pb-2">
        {CATEGORIES.map((c) => {
          const Icon = c.icon;
          const active = activeCat === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setActiveCat(c.id)}
              className="flex flex-col items-center gap-1 px-2.5 py-2 rounded-xl flex-shrink-0 transition-all"
              style={{ background: active ? `${COLORS.sage}33` : "transparent" }}
            >
              <Icon size={16} style={{ color: active ? COLORS.sageDeep : dark ? COLORS.beige : COLORS.charcoal }} />
              <span className="text-[10px] whitespace-nowrap" style={{ color: active ? COLORS.sageDeep : dark ? COLORS.beige : COLORS.charcoal }}>
                {c.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-3 grid grid-cols-2 gap-2.5">
        {filtered.map((item, i) => (
          <button
            key={item.id}
            onClick={() => onAdd(item)}
            className="group relative rounded-xl p-2.5 text-left card-rise"
            style={{
              animationDelay: `${i * 30}ms`,
              background: dark ? "rgba(255,255,255,0.05)" : "white",
              border: dark ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(47,62,70,0.06)",
            }}
          >
            <div
              className="w-full h-12 rounded-lg mb-1.5 transition-transform group-hover:scale-105"
              style={{ background: item.color, opacity: 0.85 }}
            />
            <div className="text-[11px] font-medium truncate" style={{ color: dark ? COLORS.cream : COLORS.charcoal }}>
              {item.name}
            </div>
            <div
              className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: COLORS.sage }}
            >
              <Plus size={11} color="white" />
            </div>
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-2 text-center py-8 text-sm opacity-50" style={{ color: dark ? COLORS.beige : COLORS.charcoal }}>
            No furniture matches your search.
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   Canvas Toolbar
   ============================================================ */
function CanvasToolbar({ dark, zoom, setZoom, snap, setSnap, onGenerate, generating, onReset, onCompare, roomDims, onDimsChange }) {
  const [showDims, setShowDims] = useState(false);
  return (
    <div
      className="flex items-center justify-between px-4 py-2 flex-shrink-0 relative z-20"
      style={{ borderBottom: dark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(47,62,70,0.06)" }}
    >
      <div className="flex items-center gap-2">
        <button onClick={onGenerate} disabled={generating} className="btn-ai text-xs">
          <Sparkles size={14} className={generating ? "spin-slow" : ""} />
          {generating ? "Optimizing layout…" : "Generate Layout"}
        </button>
        <button
          onClick={() => setSnap(!snap)}
          className="text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
          style={{
            background: snap ? `${COLORS.sage}33` : "transparent",
            color: snap ? COLORS.sageDeep : dark ? COLORS.beige : COLORS.charcoal,
          }}
        >
          <Grid3x3 size={13} /> Snap
        </button>
        <div className="relative">
          <button
            onClick={() => setShowDims((v) => !v)}
            className="text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors hover:bg-black/5"
            style={{ color: dark ? COLORS.beige : COLORS.charcoal }}
          >
            <Maximize2 size={13} /> {roomDims.w} × {roomDims.h} {roomDims.unit}
          </button>
          {showDims && (
            <div
              className="absolute top-full left-0 mt-2 p-3 rounded-xl shadow-xl z-50 flex gap-2 fade-in"
              style={{ background: dark ? "#33424a" : "white", border: dark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(47,62,70,0.1)" }}
            >
              <input
                type="number"
                value={roomDims.w}
                onChange={(e) => onDimsChange({ w: Math.max(4, Number(e.target.value) || 0) })}
                className="input-soft w-16 !py-1"
              />
              <span className="self-center text-xs opacity-50">×</span>
              <input
                type="number"
                value={roomDims.h}
                onChange={(e) => onDimsChange({ h: Math.max(4, Number(e.target.value) || 0) })}
                className="input-soft w-16 !py-1"
              />
            </div>
          )}
        </div>
        <button onClick={onCompare} className="text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors hover:bg-black/5" style={{ color: dark ? COLORS.beige : COLORS.charcoal }}>
          <ArrowLeftRight size={13} /> <span className="hidden lg:inline">Before / After</span>
        </button>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => setZoom((z) => Math.max(0.4, +(z - 0.1).toFixed(2)))} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/5">
          <ZoomOut size={14} style={{ color: dark ? COLORS.beige : COLORS.charcoal }} />
        </button>
        <span className="text-xs w-10 text-center" style={{ color: dark ? COLORS.beige : COLORS.charcoal }}>
          {Math.round(zoom * 100)}%
        </span>
        <button onClick={() => setZoom((z) => Math.min(2, +(z + 0.1).toFixed(2)))} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/5">
          <ZoomIn size={14} style={{ color: dark ? COLORS.beige : COLORS.charcoal }} />
        </button>
        <div className="w-px h-5" style={{ background: dark ? "rgba(255,255,255,0.1)" : "rgba(47,62,70,0.15)" }} />
        <button onClick={onReset} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/5" title="Reset layout">
          <Trash2 size={14} style={{ color: dark ? COLORS.beige : COLORS.charcoal }} />
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   Furniture Item — draggable, resizable, rotatable
   ============================================================ */
function FurnitureItem({ item, zoom, selected, dark, snap, bounds, allItems, setGuides, onSelect, onChange, onCommit }) {
  const dragRef = useRef(null);
  const interactionRef = useRef(null); // {mode, startX, startY, orig}

  const SNAP = 10;
  const snapVal = (v) => (snap ? Math.round(v / SNAP) * SNAP : v);

  const checkAlignment = useCallback(
    (x, y, w, h) => {
      const myCenterX = x + w / 2;
      const myCenterY = y + h / 2;
      let vGuide = null, hGuide = null;
      for (const other of allItems) {
        if (other.id === item.id) continue;
        const oCenterX = other.x + other.w / 2;
        const oCenterY = other.y + other.h / 2;
        if (Math.abs(oCenterX - myCenterX) < 4) vGuide = (oCenterX) * zoom;
        if (Math.abs(oCenterY - myCenterY) < 4) hGuide = (oCenterY) * zoom;
        if (Math.abs(other.x - x) < 4) vGuide = other.x * zoom;
        if (Math.abs(other.y - y) < 4) hGuide = other.y * zoom;
      }
      setGuides({ v: vGuide, h: hGuide });
    },
    [allItems, item.id, zoom, setGuides]
  );

  const onPointerDownMove = (e) => {
    e.stopPropagation();
    onSelect();
    interactionRef.current = {
      mode: "move",
      startX: e.clientX,
      startY: e.clientY,
      orig: { x: item.x, y: item.y },
    };
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  const onPointerDownResize = (e, corner) => {
    e.stopPropagation();
    onSelect();
    interactionRef.current = {
      mode: "resize",
      corner,
      startX: e.clientX,
      startY: e.clientY,
      orig: { x: item.x, y: item.y, w: item.w, h: item.h },
    };
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  const onPointerDownRotate = (e) => {
    e.stopPropagation();
    onSelect();
    interactionRef.current = {
      mode: "rotate",
      startX: e.clientX,
      startY: e.clientY,
      orig: { rotation: item.rotation },
    };
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  const onPointerMove = (e) => {
    const interaction = interactionRef.current;
    if (!interaction) return;
    const dx = (e.clientX - interaction.startX) / zoom;
    const dy = (e.clientY - interaction.startY) / zoom;

    if (interaction.mode === "move") {
      let nx = snapVal(interaction.orig.x + dx);
      let ny = snapVal(interaction.orig.y + dy);
      nx = Math.max(0, Math.min(bounds.w - item.w, nx));
      ny = Math.max(0, Math.min(bounds.h - item.h, ny));
      checkAlignment(nx, ny, item.w, item.h);
      onChange({ x: nx, y: ny });
    } else if (interaction.mode === "resize") {
      let { x, y, w, h } = interaction.orig;
      if (interaction.corner.includes("right")) w = Math.max(24, snapVal(w + dx));
      if (interaction.corner.includes("bottom")) h = Math.max(24, snapVal(h + dy));
      if (interaction.corner.includes("left")) {
        const newW = Math.max(24, snapVal(w - dx));
        x = x + (w - newW);
        w = newW;
      }
      if (interaction.corner.includes("top")) {
        const newH = Math.max(24, snapVal(h - dy));
        y = y + (h - newH);
        h = newH;
      }
      onChange({ x, y, w, h });
    } else if (interaction.mode === "rotate") {
      const deg = Math.round((interaction.orig.rotation + dx) / 5) * 5;
      onChange({ rotation: ((deg % 360) + 360) % 360 });
    }
  };

  const onPointerUp = () => {
    interactionRef.current = null;
    setGuides({ v: null, h: null });
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
    onCommit();
  };

  return (
    <div
      ref={dragRef}
      onPointerDown={onPointerDownMove}
      className="absolute select-none furniture-pop"
      style={{
        left: item.x * zoom,
        top: item.y * zoom,
        width: item.w * zoom,
        height: item.h * zoom,
        zIndex: (item.layer || 0) + (selected ? 100 : 0),
        cursor: "grab",
        touchAction: "none",
      }}
    >
      <div
        className="w-full h-full rounded-lg flex items-center justify-center text-center relative transition-shadow"
        style={{
          background: item.color,
          opacity: 0.88,
          transform: `rotate(${item.rotation}deg)`,
          boxShadow: selected ? `0 0 0 2px ${COLORS.sage}, 0 8px 20px rgba(0,0,0,0.18)` : "0 3px 8px rgba(0,0,0,0.12)",
        }}
      >
        <span className="text-[10px] font-medium px-1 leading-tight" style={{ color: "white", textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}>
          {item.name}
        </span>
      </div>

      {selected && (
        <>
          {/* resize handles */}
          {["top-left", "top-right", "bottom-left", "bottom-right"].map((corner) => (
            <div
              key={corner}
              onPointerDown={(e) => onPointerDownResize(e, corner)}
              className="absolute w-3 h-3 bg-white rounded-full shadow-md handle-pulse"
              style={{
                border: `2px solid ${COLORS.sage}`,
                top: corner.includes("top") ? -6 : undefined,
                bottom: corner.includes("bottom") ? -6 : undefined,
                left: corner.includes("left") ? -6 : undefined,
                right: corner.includes("right") ? -6 : undefined,
                cursor: corner === "top-left" || corner === "bottom-right" ? "nwse-resize" : "nesw-resize",
              }}
            />
          ))}
          {/* rotate handle */}
          <div
            onPointerDown={onPointerDownRotate}
            className="absolute w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center cursor-grab"
            style={{
              border: `2px solid ${COLORS.terracotta}`,
              top: -34,
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <RotateCw size={11} style={{ color: COLORS.terracotta }} />
          </div>
          <div
            className="absolute w-px"
            style={{ height: 22, top: -22, left: "50%", background: COLORS.terracotta, opacity: 0.5 }}
          />
        </>
      )}
    </div>
  );
}

/* ============================================================
   Mini Map
   ============================================================ */
function MiniMap({ dark, items, room, roomPxW, roomPxH }) {
  const scale = 100 / Math.max(roomPxW, roomPxH);
  return (
    <div
      className="absolute bottom-6 right-6 rounded-xl overflow-hidden shadow-lg"
      style={{
        width: roomPxW * scale + 16,
        height: roomPxH * scale + 16,
        background: dark ? "rgba(40,50,55,0.85)" : "rgba(255,255,255,0.85)",
        backdropFilter: "blur(10px)",
        border: dark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(47,62,70,0.1)",
      }}
    >
      <div className="relative m-2" style={{ width: roomPxW * scale, height: roomPxH * scale }}>
        <div className="absolute inset-0 rounded" style={{ border: `1px solid ${COLORS.sage}` }} />
        {items.map((it) => (
          <div
            key={it.id}
            className="absolute rounded-[1px]"
            style={{
              left: it.x * scale,
              top: it.y * scale,
              width: Math.max(2, it.w * scale),
              height: Math.max(2, it.h * scale),
              background: it.color,
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   Properties Panel
   ============================================================ */
function PropertiesPanel({ dark, item, onChange, onDelete, onDuplicate, onLayerChange, roomBounds }) {
  if (!item) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 h-full">
        <Settings2 size={28} className="mb-2 opacity-30" style={{ color: dark ? COLORS.beige : COLORS.charcoal }} />
        <p className="text-xs opacity-50" style={{ color: dark ? COLORS.beige : COLORS.charcoal }}>
          Select an item on the canvas to edit its properties
        </p>
      </div>
    );
  }
  const swatches = ["#84A98C", "#D4A373", "#EDE0D4", "#52796F", "#B08968", "#A1887F"];

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold" style={{ color: dark ? COLORS.cream : COLORS.charcoal, fontFamily: "Fraunces, serif" }}>
          {item.name}
        </span>
        <div className="flex gap-1">
          <button onClick={onDuplicate} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/5" title="Duplicate">
            <Copy size={13} style={{ color: dark ? COLORS.beige : COLORS.charcoal }} />
          </button>
          <button onClick={onDelete} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50" title="Delete">
            <Trash2 size={13} style={{ color: "#c0584a" }} />
          </button>
        </div>
      </div>

      <PropGroup label="Position" dark={dark}>
        <div className="grid grid-cols-2 gap-2">
          <NumField label="X" value={Math.round(item.x)} onChange={(v) => onChange({ x: Math.max(0, Math.min(roomBounds.w - item.w, v)) })} dark={dark} />
          <NumField label="Y" value={Math.round(item.y)} onChange={(v) => onChange({ y: Math.max(0, Math.min(roomBounds.h - item.h, v)) })} dark={dark} />
        </div>
      </PropGroup>

      <PropGroup label="Size" dark={dark}>
        <div className="grid grid-cols-2 gap-2">
          <NumField label="W" value={Math.round(item.w)} onChange={(v) => onChange({ w: Math.max(20, v) })} dark={dark} />
          <NumField label="H" value={Math.round(item.h)} onChange={(v) => onChange({ h: Math.max(20, v) })} dark={dark} />
        </div>
      </PropGroup>

      <PropGroup label="Rotation" dark={dark}>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min="0"
            max="359"
            value={item.rotation}
            onChange={(e) => onChange({ rotation: Number(e.target.value) })}
            className="flex-1 slider-soft"
          />
          <span className="text-xs w-10 text-right tabular-nums" style={{ color: dark ? COLORS.beige : COLORS.charcoal }}>
            {item.rotation}°
          </span>
        </div>
      </PropGroup>

      <PropGroup label="Color theme" dark={dark}>
        <div className="flex gap-2 flex-wrap">
          {swatches.map((c) => (
            <button
              key={c}
              onClick={() => onChange({ color: c })}
              className="w-7 h-7 rounded-full transition-transform hover:scale-110"
              style={{ background: c, boxShadow: item.color === c ? `0 0 0 2px white, 0 0 0 4px ${c}` : "none" }}
            />
          ))}
        </div>
      </PropGroup>

      <PropGroup label="Layer order" dark={dark}>
        <div className="flex items-center gap-2">
          <button onClick={() => onLayerChange("down")} className="btn-secondary text-xs flex-1 justify-center">
            Send back
          </button>
          <button onClick={() => onLayerChange("up")} className="btn-secondary text-xs flex-1 justify-center">
            Bring front
          </button>
        </div>
      </PropGroup>
    </div>
  );
}

function PropGroup({ label, children, dark }) {
  return (
    <div className="mb-4">
      <div className="text-[11px] font-medium uppercase tracking-wide opacity-50 mb-1.5" style={{ color: dark ? COLORS.beige : COLORS.charcoal }}>
        {label}
      </div>
      {children}
    </div>
  );
}
function NumField({ label, value, onChange, dark }) {
  return (
    <div className="relative">
      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] opacity-40 font-medium" style={{ color: dark ? COLORS.beige : COLORS.charcoal }}>
        {label}
      </span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="input-soft !pl-7"
      />
    </div>
  );
}

/* ============================================================
   Bottom Sheet (mobile)
   ============================================================ */
function BottomSheet({ children, onClose, dark, title }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end md:hidden">
      <div className="absolute inset-0 bg-black/30 fade-in" onClick={onClose} />
      <div
        className="relative rounded-t-3xl max-h-[75vh] flex flex-col sheet-up"
        style={{ background: dark ? "#2F3E46" : "#FAF7F2" }}
      >
        <div className="flex items-center justify-between px-4 py-3 flex-shrink-0">
          <span className="font-semibold text-sm" style={{ color: dark ? COLORS.cream : COLORS.charcoal }}>{title}</span>
          <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-black/5">
            <X size={15} style={{ color: dark ? COLORS.beige : COLORS.charcoal }} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

/* ============================================================
   Modals: Save / Export / Confirm / Saved Drawer / Compare
   ============================================================ */
function ModalShell({ children, onClose, dark, width = 420 }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 fade-in" onClick={onClose} />
      <div
        className="relative rounded-3xl p-6 modal-pop"
        style={{
          width,
          maxWidth: "100%",
          background: dark ? "#2F3E46" : "#FFFDF9",
          boxShadow: "0 24px 60px rgba(0,0,0,0.3)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function SaveModal({ dark, defaultName, onClose, onSave }) {
  const [name, setName] = useState(defaultName || "");
  return (
    <ModalShell onClose={onClose} dark={dark}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold" style={{ fontFamily: "Fraunces, serif", color: dark ? COLORS.cream : COLORS.charcoal }}>Save design</h3>
        <button onClick={onClose}><X size={18} style={{ color: dark ? COLORS.beige : COLORS.charcoal }} /></button>
      </div>
      <label className="text-xs font-medium opacity-60 mb-1.5 block" style={{ color: dark ? COLORS.beige : COLORS.charcoal }}>Design name</label>
      <input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="input-soft w-full mb-5"
        placeholder="e.g. Cozy Living Room"
      />
      <div className="flex gap-2 justify-end">
        <button onClick={onClose} className="btn-secondary text-sm">Cancel</button>
        <button onClick={() => onSave(name)} className="btn-primary text-sm">
          <Save size={14} /> Save design
        </button>
      </div>
    </ModalShell>
  );
}

function ExportModal({ dark, onClose, onExportPNG }) {
  return (
    <ModalShell onClose={onClose} dark={dark}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold" style={{ fontFamily: "Fraunces, serif", color: dark ? COLORS.cream : COLORS.charcoal }}>Export your design</h3>
        <button onClick={onClose}><X size={18} style={{ color: dark ? COLORS.beige : COLORS.charcoal }} /></button>
      </div>
      <div className="space-y-2.5 mb-5">
        <button onClick={onExportPNG} className="w-full flex items-center gap-3 p-3.5 rounded-2xl transition-colors hover:bg-black/5 text-left" style={{ border: dark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(47,62,70,0.08)" }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${COLORS.sage}33` }}>
            <ImageIcon size={18} color={COLORS.sageDeep} />
          </div>
          <div>
            <div className="text-sm font-medium" style={{ color: dark ? COLORS.cream : COLORS.charcoal }}>Export as Image</div>
            <div className="text-xs opacity-50" style={{ color: dark ? COLORS.beige : COLORS.charcoal }}>High-quality PNG snapshot</div>
          </div>
        </button>
        <div className="w-full flex items-center gap-3 p-3.5 rounded-2xl text-left opacity-50 cursor-not-allowed" style={{ border: dark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(47,62,70,0.08)" }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${COLORS.terracotta}33` }}>
            <FileText size={18} color={COLORS.terracotta} />
          </div>
          <div>
            <div className="text-sm font-medium" style={{ color: dark ? COLORS.cream : COLORS.charcoal }}>Export as PDF</div>
            <div className="text-xs opacity-50" style={{ color: dark ? COLORS.beige : COLORS.charcoal }}>Coming soon</div>
          </div>
        </div>
        <div className="w-full flex items-center gap-3 p-3.5 rounded-2xl text-left opacity-50 cursor-not-allowed" style={{ border: dark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(47,62,70,0.08)" }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(47,62,70,0.1)" }}>
            <Link2 size={18} style={{ color: dark ? COLORS.beige : COLORS.charcoal }} />
          </div>
          <div>
            <div className="text-sm font-medium" style={{ color: dark ? COLORS.cream : COLORS.charcoal }}>Share link</div>
            <div className="text-xs opacity-50" style={{ color: dark ? COLORS.beige : COLORS.charcoal }}>Coming soon</div>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}

function ConfirmModal({ dark, title, message, confirmLabel, onCancel, onConfirm }) {
  return (
    <ModalShell onClose={onCancel} dark={dark} width={380}>
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#F4DCC8" }}>
          <AlertTriangle size={18} color={COLORS.terracotta} />
        </div>
        <div>
          <h3 className="font-bold mb-1" style={{ color: dark ? COLORS.cream : COLORS.charcoal }}>{title}</h3>
          <p className="text-sm opacity-70" style={{ color: dark ? COLORS.beige : COLORS.charcoal }}>{message}</p>
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        <button onClick={onCancel} className="btn-secondary text-sm">Cancel</button>
        <button onClick={onConfirm} className="px-4 py-2 rounded-xl text-sm font-medium text-white transition-transform hover:scale-[1.02]" style={{ background: "#c0584a" }}>
          {confirmLabel}
        </button>
      </div>
    </ModalShell>
  );
}

function SavedLayoutsDrawer({ dark, layouts, onClose, onLoad, onDelete, onDuplicate, onRename }) {
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div className="absolute inset-0 bg-black/40 fade-in" onClick={onClose} />
      <div className="relative w-full sm:w-[420px] h-full overflow-y-auto p-5 drawer-in" style={{ background: dark ? "#2F3E46" : "#FAF7F2" }}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-bold" style={{ fontFamily: "Fraunces, serif", color: dark ? COLORS.cream : COLORS.charcoal }}>My Designs</h3>
          <button onClick={onClose}><X size={20} style={{ color: dark ? COLORS.beige : COLORS.charcoal }} /></button>
        </div>
        {layouts.length === 0 && (
          <div className="text-center py-16 opacity-50 text-sm" style={{ color: dark ? COLORS.beige : COLORS.charcoal }}>
            No saved designs yet. Save your current layout to see it here.
          </div>
        )}
        <div className="space-y-3">
          {layouts.map((l) => (
            <div
              key={l.id}
              className="rounded-2xl p-3.5"
              style={{ background: dark ? "rgba(255,255,255,0.05)" : "white", border: dark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(47,62,70,0.06)" }}
            >
              <div
                className="w-full h-20 rounded-xl mb-2.5 relative overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${COLORS.beige}, ${COLORS.sage}33)` }}
              >
                {l.items.slice(0, 6).map((it, i) => (
                  <div
                    key={i}
                    className="absolute rounded"
                    style={{
                      background: it.color,
                      opacity: 0.8,
                      left: `${(it.x / (l.room.w * PX_PER_FT)) * 100}%`,
                      top: `${(it.y / (l.room.h * PX_PER_FT)) * 100}%`,
                      width: `${Math.min(40, (it.w / (l.room.w * PX_PER_FT)) * 100)}%`,
                      height: `${Math.min(40, (it.h / (l.room.h * PX_PER_FT)) * 100)}%`,
                    }}
                  />
                ))}
              </div>
              {editingId === l.id ? (
                <input
                  autoFocus
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onBlur={() => { onRename(l.id, editName || l.name); setEditingId(null); }}
                  onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
                  className="input-soft w-full mb-2 !py-1.5"
                />
              ) : (
                <div className="font-medium text-sm mb-0.5" style={{ color: dark ? COLORS.cream : COLORS.charcoal }}>{l.name}</div>
              )}
              <div className="text-[11px] opacity-50 mb-2.5" style={{ color: dark ? COLORS.beige : COLORS.charcoal }}>
                {l.items.length} items · {new Date(l.updatedAt).toLocaleDateString()}
              </div>
              <div className="flex gap-1.5 flex-wrap">
                <button onClick={() => onLoad(l.id)} className="btn-primary !py-1.5 !px-2.5 text-[11px]">Open</button>
                <button onClick={() => { setEditingId(l.id); setEditName(l.name); }} className="btn-secondary !py-1.5 !px-2.5 text-[11px]">Rename</button>
                <button onClick={() => onDuplicate(l.id)} className="btn-secondary !py-1.5 !px-2.5 text-[11px]"><Copy size={11} /></button>
                <button onClick={() => onDelete(l.id)} className="btn-secondary !py-1.5 !px-2.5 text-[11px]" style={{ color: "#c0584a" }}><Trash2 size={11} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CompareModal({ dark, onClose }) {
  const [pos, setPos] = useState(50);
  return (
    <ModalShell onClose={onClose} dark={dark} width={560}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold" style={{ fontFamily: "Fraunces, serif", color: dark ? COLORS.cream : COLORS.charcoal }}>Before / After</h3>
        <button onClick={onClose}><X size={18} style={{ color: dark ? COLORS.beige : COLORS.charcoal }} /></button>
      </div>
      <p className="text-xs opacity-60 mb-4" style={{ color: dark ? COLORS.beige : COLORS.charcoal }}>
        Save two versions of a layout to compare them side-by-side here. This is a preview of the comparison slider.
      </p>
      <div className="relative w-full h-56 rounded-2xl overflow-hidden select-none">
        <div className="absolute inset-0 flex items-center justify-center text-sm font-medium" style={{ background: COLORS.beige, color: COLORS.charcoal }}>Before layout</div>
        <div
          className="absolute inset-0 flex items-center justify-center text-sm font-medium overflow-hidden"
          style={{ background: `${COLORS.sage}55`, color: COLORS.charcoal, clipPath: `inset(0 0 0 ${pos}%)` }}
        >
          After layout
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          className="absolute bottom-3 left-3 right-3 slider-soft"
        />
      </div>
    </ModalShell>
  );
}

/* ============================================================
   Global CSS — animations, utility classes
   ============================================================ */
const GLOBAL_CSS = `
@keyframes fadeUp { from { opacity:0; transform: translateY(10px); } to { opacity:1; transform: translateY(0); } }
@keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
@keyframes cardRise { from { opacity:0; transform: translateY(16px) scale(0.98); } to { opacity:1; transform: translateY(0) scale(1); } }
@keyframes sheetUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
@keyframes drawerIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
@keyframes modalPop { from { opacity:0; transform: scale(0.95) translateY(8px); } to { opacity:1; transform: scale(1) translateY(0); } }
@keyframes toastIn { from { opacity:0; transform: translateY(8px) scale(0.96); } to { opacity:1; transform: translateY(0) scale(1); } }
@keyframes spinSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes handlePulse { 0%,100% { box-shadow: 0 0 0 0 rgba(132,169,140,0.4); } 50% { box-shadow: 0 0 0 4px rgba(132,169,140,0.15); } }
@keyframes furniturePop { from { opacity:0; transform: scale(0.85); } to { opacity:1; transform: scale(1); } }

.fade-up { animation: fadeUp 0.5s ease both; }
.fade-in { animation: fadeIn 0.35s ease both; }
.card-rise { animation: cardRise 0.45s cubic-bezier(0.22,1,0.36,1) both; }
.sheet-up { animation: sheetUp 0.35s cubic-bezier(0.22,1,0.36,1) both; }
.drawer-in { animation: drawerIn 0.32s cubic-bezier(0.22,1,0.36,1) both; }
.modal-pop { animation: modalPop 0.28s cubic-bezier(0.22,1,0.36,1) both; }
.toast-in { animation: toastIn 0.3s cubic-bezier(0.22,1,0.36,1) both; }
.spin-slow { animation: spinSlow 1.1s linear infinite; }
.handle-pulse { animation: handlePulse 2s ease-in-out infinite; }
.furniture-pop { animation: furniturePop 0.25s cubic-bezier(0.22,1,0.36,1) both; }

.btn-primary {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 16px; border-radius: 12px;
  background: linear-gradient(135deg, #84A98C, #52796F);
  color: white; font-weight: 600; font-size: 13px;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  box-shadow: 0 2px 10px rgba(82,121,111,0.3);
}
.btn-primary:hover { transform: translateY(-1px) scale(1.02); box-shadow: 0 4px 16px rgba(82,121,111,0.4); }
.btn-secondary {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 14px; border-radius: 12px;
  background: rgba(47,62,70,0.06);
  color: #2F3E46; font-weight: 500; font-size: 13px;
  transition: background 0.15s ease;
}
.dark .btn-secondary { background: rgba(255,255,255,0.08); color: #EDE0D4; }
.btn-secondary:hover { background: rgba(47,62,70,0.12); }
.dark .btn-secondary:hover { background: rgba(255,255,255,0.14); }
.btn-ai {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 14px; border-radius: 12px;
  background: linear-gradient(135deg, #D4A373, #BC6C25);
  color: white; font-weight: 600; font-size: 13px;
  transition: transform 0.15s ease;
  box-shadow: 0 2px 10px rgba(212,163,115,0.35);
}
.btn-ai:hover { transform: translateY(-1px) scale(1.02); }
.btn-ai:disabled { opacity: 0.7; }

.input-soft {
  padding: 8px 12px; border-radius: 10px; font-size: 13px;
  background: white; border: 1px solid rgba(47,62,70,0.12);
  color: #2F3E46; outline: none; width: 100%;
  transition: border-color 0.15s ease;
}
.input-soft:focus { border-color: #84A98C; }
.dark .input-soft { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.12); color: #FAF7F2; }

.slider-soft {
  -webkit-appearance: none; height: 5px; border-radius: 4px;
  background: rgba(132,169,140,0.25); outline: none;
}
.slider-soft::-webkit-slider-thumb {
  -webkit-appearance: none; width: 15px; height: 15px; border-radius: 50%;
  background: #84A98C; cursor: pointer; box-shadow: 0 1px 4px rgba(0,0,0,0.25);
}

.room-canvas { transition: width 0.3s ease, height 0.3s ease; }
`;