import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import Field from "./Field";
import { COLORS, STYLES, ROOM_TEMPLATES } from "../constants";

export default function RoomWizard({ template, onBack, onComplete, dark }) {
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