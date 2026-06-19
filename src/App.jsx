import React, { useState, useEffect } from "react";
import { StoreProvider } from "./context/StoreContext";
import { ToastProvider } from "./context/ToastContext";
import GoogleFontLoader from "./components/GoogleFontLoader";
import TemplatePicker from "./components/TemplatePicker";
import RoomWizard from "./components/RoomWizard";
import Workspace from "./components/Workspace";

export default function App() {
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
            className="w-full min-h-screen transition-colors duration-500 bg-gradient-to-br from-[#FAF7F2] via-[#F3ECE3] to-[#EDE0D4] dark:from-[#1f2a2e] dark:via-[#2F3E46] dark:to-[#243034]"
            style={{
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