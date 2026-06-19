import React, { createContext, useContext, useState, useCallback } from "react";
import { Check, AlertTriangle } from "lucide-react";
import { nextId } from "../constants";

const ToastCtx = createContext(null);

export function ToastProvider({ children }) {
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
            className="toast-in flex items-center gap-2 rounded-2xl px-4 py-3 shadow-xl backdrop-blur-xl border text-sm font-medium animate-fadeIn"
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

export function useToast() {
  return useContext(ToastCtx);
}