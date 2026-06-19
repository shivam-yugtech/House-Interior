import React, { useState, useRef, useCallback, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { useToast } from "../context/ToastContext";
import { COLORS, CATALOG, ROOM_TEMPLATES, nextId } from "../constants";
import { loadSavedLayouts } from "../utils/storage";

const PX_PER_FT = 28;

export default function Workspace({ dark, setDark, template, onExit }) {
  const { state, dispatch } = useStore();
  const toast = useToast();
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [activeCat, setActiveCat] = useState("sofas");
  const [search, setSearch] = useState("");
  const [styleFilter, setStyleFilter] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [savedLayouts, setSavedLayouts] = useState(() => loadSavedLayouts());
  const canvasRef = useRef(null);

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
  }, []);

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
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [state.selectedId, dispatch]);

  const generateLayout = useCallback(() => {
    setGenerating(true);
    setTimeout(() => {
      const roomWpx = state.room.w * PX_PER_FT;
      const margin = 16;
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

  return (
    <div className="p-6 h-screen flex flex-col justify-between">
      <div className="flex justify-between items-center bg-white/20 dark:bg-black/20 p-4 rounded-2xl backdrop-blur-md border border-white/10 shadow-sm">
        <h2 className="text-lg font-bold" style={{ color: dark ? COLORS.cream : COLORS.charcoal }}>
          Workspace: {state.room.name} ({state.room.w}x{state.room.h} {state.room.unit})
        </h2>
        <div className="flex gap-2">
          <button onClick={generateLayout} className="btn-primary flex items-center gap-1">
            <Sparkles size={16} /> {generating ? "Optimizing..." : "AI Layout"}
          </button>
          <button onClick={onExit} className="px-4 py-2 bg-charcoal/10 rounded-xl text-sm font-semibold border transition hover:bg-black/5 dark:hover:bg-white/5">
            Exit
          </button>
        </div>
      </div>

      <div className="flex-1 flex justify-center items-center overflow-auto my-4">
        <div 
          ref={canvasRef}
          className="relative transition-all border border-dashed border-neutral-400 dark:border-neutral-600 rounded-xl shadow-inner bg-neutral-100/40 dark:bg-neutral-900/40"
          style={{
            width: state.room.w * PX_PER_FT,
            height: state.room.h * PX_PER_FT,
          }}
        >
          {state.items.map((item) => (
            <div
              key={item.id}
              className={`absolute cursor-pointer select-none rounded-md flex items-center justify-center text-[10px] text-white p-1 font-semibold transition-transform ${state.selectedId === item.id ? 'ring-2 ring-emerald-500' : ''}`}
              style={{
                left: item.x,
                top: item.y,
                width: item.w,
                height: item.h,
                backgroundColor: item.color || COLORS.sage,
                transform: `rotate(${item.rotation || 0}deg)`,
              }}
              onClick={(e) => {
                e.stopPropagation();
                dispatch({ type: "SELECT", id: item.id });
              }}
            >
              {item.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}