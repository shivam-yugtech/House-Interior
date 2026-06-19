import React, { createContext, useContext, useReducer } from "react";
import { nextId } from "../constants";

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

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(storeReducer, {
    room: initialRoom,
    items: [],
    selectedId: null,
    history: [[]],
    historyIndex: 0,
  });
  return <StoreCtx.Provider value={{ state, dispatch }}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}