import React from "react";
import { Home, Sun, Moon, Plus, ChevronRight } from "lucide-react";
import { COLORS, ROOM_TEMPLATES } from "../constants";

export default function TemplatePicker({ onPick, dark, setDark }) {
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
            className="group relative rounded-3xl p-6 text-left overflow-hidden transition-all duration-300 hover:-translate-y-1"
            style={{
              animationDelay: `${i * 60}ms`,
              background: dark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.55)",
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