const LAYOUTS_KEY = "interiorcraft_layouts_v1";

export function loadSavedLayouts() {
  try {
    const raw = window.localStorage?.getItem(LAYOUTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function persistSavedLayouts(layouts) {
  try {
    window.localStorage?.setItem(LAYOUTS_KEY, JSON.stringify(layouts));
  } catch {
    /* storage unavailable — silently no-op */
  }
}