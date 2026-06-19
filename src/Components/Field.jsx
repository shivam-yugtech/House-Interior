import React from "react";
import { COLORS } from "../constants";

export default function Field({ label, children, dark }) {
  return (
    <label className="block">
      <span className="text-xs font-medium opacity-60 mb-1.5 block" style={{ color: dark ? COLORS.beige : COLORS.charcoal }}>
        {label}
      </span>
      {children}
    </label>
  );
}